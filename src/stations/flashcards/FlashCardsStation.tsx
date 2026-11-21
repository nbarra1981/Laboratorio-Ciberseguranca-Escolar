import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StationComponentProps } from '../../core/types';
import { ChallengeSummary } from './components/ChallengeSummary';
import { FlashCardStage } from './components/FlashCardStage';
import { StationConfigBar } from './components/StationConfigBar';
import { StatsModal } from './components/StatsModal';
import { FLASHCARDS_DECK } from './data/flashcardsData';
import {
  computeChallengeSummary,
  computeDomainMasteryChart,
  computeProgressStats,
  createChallengeSession,
  filterCardsByDomain,
  finishChallengeSession,
  getCardsToReviewIds,
  rateCurrentCard,
  recordSessionFlip,
  startReviewCycle,
  type ChallengeSessionState,
  type DomainFilter,
  type LearningMode,
  type SelfRating,
} from './logic/flashcardEngine';
import {
  clearStoredRatings,
  loadStoredRatings,
  saveStoredRatings,
  type StoredRatingsMap,
} from './logic/storage';

export function FlashCardsStation({
  onBackToHub,
  onProgressChange,
}: StationComponentProps) {
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');
  const [mode, setMode] = useState<LearningMode>('free');
  const [freeIndex, setFreeIndex] = useState<number>(0);
  const [freeFlipCount, setFreeFlipCount] = useState<number>(0);
  const [freeRevealedIds, setFreeRevealedIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [storedRatings, setStoredRatings] = useState<StoredRatingsMap>(() =>
    loadStoredRatings(),
  );
  const [session, setSession] = useState<ChallengeSessionState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const wasCompletedRef = useRef<boolean>(false);

  const focusStage = useCallback(() => {
    window.requestAnimationFrame(() => {
      stageContainerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const isCompleted = Boolean(session?.completed);
    if (isCompleted && !wasCompletedRef.current) {
      window.requestAnimationFrame(() => {
        stageContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        stageContainerRef.current?.focus({ preventScroll: true });
      });
    }
    wasCompletedRef.current = isCompleted;
  }, [session?.completed]);

  const filteredCards = useMemo(
    () => filterCardsByDomain(FLASHCARDS_DECK, domainFilter),
    [domainFilter],
  );

  const cardLookup = useMemo(
    () => new Map(FLASHCARDS_DECK.map((c) => [c.id, c])),
    [],
  );

  // Live timer during active challenge / quick10 / review sessions
  useEffect(() => {
    if (!session || session.completed || mode === 'free') {
      return;
    }
    const interval = window.setInterval(() => {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000)),
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, [session, mode]);

  const startSession = useCallback(
    (
      nextMode: Exclude<LearningMode, 'free'>,
      nextDomain: DomainFilter,
      customCards = FLASHCARDS_DECK,
    ) => {
      const created = createChallengeSession(
        customCards,
        nextMode,
        nextMode === 'review' ? 'all' : nextDomain,
      );
      setSession(created);
      setElapsedSeconds(0);
      setIsFlipped(false);
    },
    [],
  );

  const handleDomainChange = useCallback(
    (nextDomain: DomainFilter) => {
      setDomainFilter(nextDomain);
      setFreeIndex(0);
      setIsFlipped(false);
      if (mode !== 'free') {
        const effectiveMode = mode === 'review' ? 'challenge' : mode;
        if (mode === 'review') {
          setMode('challenge');
        }
        startSession(effectiveMode, nextDomain);
      }
      focusStage();
    },
    [focusStage, mode, startSession],
  );

  const handleModeChange = useCallback(
    (nextMode: Exclude<LearningMode, 'review'>) => {
      setMode(nextMode);
      setIsFlipped(false);
      if (nextMode === 'free') {
        setFreeIndex(0);
        setSession(null);
        setElapsedSeconds(0);
      } else {
        startSession(nextMode, domainFilter);
      }
      focusStage();
    },
    [domainFilter, focusStage, startSession],
  );

  const handleRestartSession = useCallback(() => {
    if (mode === 'free') {
      setFreeIndex(0);
      setFreeFlipCount(0);
      setFreeRevealedIds([]);
      setIsFlipped(false);
      focusStage();
      return;
    }
    const targetMode = mode === 'review' ? 'challenge' : mode;
    if (mode === 'review') {
      setMode('challenge');
    }
    startSession(targetMode, domainFilter);
    focusStage();
  }, [domainFilter, focusStage, mode, startSession]);

  const handleClearProgress = useCallback(() => {
    clearStoredRatings();
    setStoredRatings({});
    setFreeFlipCount(0);
    setFreeRevealedIds([]);
    onProgressChange?.();
    if (mode !== 'free') {
      const targetMode = mode === 'review' ? 'challenge' : mode;
      if (mode === 'review') {
        setMode('challenge');
      }
      startSession(targetMode, domainFilter);
    }
    focusStage();
  }, [domainFilter, focusStage, mode, onProgressChange, startSession]);

  const currentFreeCard = filteredCards[freeIndex] ?? filteredCards[0];
  const currentSessionCard =
    session && !session.completed && session.queue.length > 0
      ? cardLookup.get(session.queue[0])
      : undefined;

  const activeCard = mode === 'free' ? currentFreeCard : currentSessionCard;

  const handleFlip = useCallback(() => {
    if (!activeCard) {
      return;
    }
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped) {
      if (mode === 'free') {
        setFreeFlipCount((count) => count + 1);
        setFreeRevealedIds((ids) =>
          ids.includes(activeCard.id) ? ids : [...ids, activeCard.id],
        );
      } else {
        setSession((prevSession) =>
          prevSession ? recordSessionFlip(prevSession, activeCard.id) : prevSession,
        );
      }
    }
  }, [activeCard, isFlipped, mode]);

  const handlePrevFree = useCallback(() => {
    setFreeIndex((idx) => Math.max(0, idx - 1));
    setIsFlipped(false);
  }, []);

  const handleNextFree = useCallback(() => {
    setFreeIndex((idx) => Math.min(filteredCards.length - 1, idx + 1));
    setIsFlipped(false);
  }, [filteredCards.length]);

  const handleRate = useCallback(
    (rating: SelfRating) => {
      if (!session || !currentSessionCard || !isFlipped) {
        return;
      }
      const nextSession = rateCurrentCard(session, currentSessionCard, rating);
      setSession(nextSession);
      setIsFlipped(false);

      const updatedStored: StoredRatingsMap = {
        ...storedRatings,
        [currentSessionCard.id]: rating,
      };
      setStoredRatings(updatedStored);
      saveStoredRatings(updatedStored);
      onProgressChange?.();
    },
    [currentSessionCard, isFlipped, onProgressChange, session, storedRatings],
  );

  // Global keyboard shortcuts: Space/Enter flip, 1/2/3 rate, Left/Right navigate in free mode
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isStatsOpen) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'select' || tagName === 'input' || tagName === 'textarea') {
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        if (tagName === 'button' || tagName === 'a') {
          return;
        }
        if (activeCard && !(session && session.completed)) {
          event.preventDefault();
          handleFlip();
        }
        return;
      }

      if (mode !== 'free' && session && !session.completed && isFlipped) {
        if (event.key === '1') {
          event.preventDefault();
          handleRate('forgot');
        } else if (event.key === '2') {
          event.preventDefault();
          handleRate('unsure');
        } else if (event.key === '3') {
          event.preventDefault();
          handleRate('mastered');
        }
        return;
      }

      if (mode === 'free') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          handlePrevFree();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          handleNextFree();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeCard,
    handleFlip,
    handleNextFree,
    handlePrevFree,
    handleRate,
    isFlipped,
    isStatsOpen,
    mode,
    session,
  ]);

  // Compute progress stats appropriate to current mode (includes ALL revealed cards)
  const progressStats = useMemo(() => {
    if (mode === 'free' || !session) {
      return computeProgressStats(filteredCards, storedRatings, freeRevealedIds);
    }
    const sessionCards = session.initialCardIds
      .map((id) => cardLookup.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    return computeProgressStats(
      sessionCards,
      session.latestRatings,
      session.revealedCardIds,
    );
  }, [cardLookup, filteredCards, freeRevealedIds, mode, session, storedRatings]);

  const domainChartData = useMemo(() => {
    if (mode === 'free' || !session) {
      return computeDomainMasteryChart(FLASHCARDS_DECK, storedRatings);
    }
    const sessionCards = session.initialCardIds
      .map((id) => cardLookup.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    return computeDomainMasteryChart(sessionCards, session.latestRatings);
  }, [cardLookup, mode, session, storedRatings]);

  const summaryData = useMemo(() => {
    if (!session || !session.completed) {
      return null;
    }
    return computeChallengeSummary(session, FLASHCARDS_DECK);
  }, [session]);

  // Cards eligible for "Rever cartas": BOTH "Com dúvidas" ('unsure') AND "Não me lembrei" ('forgot')
  const activeReviewIds = useMemo(() => {
    if (mode !== 'free' && session) {
      return getCardsToReviewIds(session.latestRatings, session.initialCardIds);
    }
    const filteredIds = filteredCards.map((c) => c.id);
    return getCardsToReviewIds(storedRatings, filteredIds);
  }, [filteredCards, mode, session, storedRatings]);

  const handleStartDirectReview = useCallback(() => {
    if (activeReviewIds.length === 0) {
      return;
    }
    const reviewCards = activeReviewIds
      .map((id) => cardLookup.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    setMode('review');
    setIsFlipped(false);
    setSession((prevSession) =>
      startReviewCycle(prevSession, reviewCards, domainFilter),
    );
    focusStage();
  }, [activeReviewIds, cardLookup, domainFilter, focusStage]);

  const handleFinishEarly = useCallback(() => {
    if (!session || session.completed) {
      return;
    }
    setSession((prev) => (prev ? finishChallengeSession(prev) : prev));
    setIsFlipped(false);
    focusStage();
  }, [focusStage, session]);

  const handleReviewWeakCards = useCallback(() => {
    if (!summaryData || summaryData.weakCardIds.length === 0) {
      return;
    }
    const weakCards = summaryData.weakCardIds
      .map((id) => cardLookup.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    setMode('review');
    setIsFlipped(false);
    setSession((prevSession) =>
      startReviewCycle(prevSession, weakCards, domainFilter),
    );
    focusStage();
  }, [cardLookup, domainFilter, focusStage, summaryData]);

  const positionLabel = useMemo(() => {
    if (mode === 'free') {
      return `Carta ${freeIndex + 1} de ${filteredCards.length}`;
    }
    if (!session) {
      return '';
    }
    if (mode === 'quick10') {
      const currentNumber = Math.min(
        session.totalInitial,
        session.history.length + 1,
      );
      return `Carta ${currentNumber} de ${session.totalInitial} · Reveladas: ${session.totalFlips}`;
    }
    return `Reveladas: ${session.totalFlips} · Na fila: ${session.queue.length} · Para rever: ${progressStats.toReviewCount}`;
  }, [
    filteredCards.length,
    freeIndex,
    mode,
    progressStats.toReviewCount,
    session,
  ]);

  const hasSavedProgress = Object.keys(storedRatings).length > 0;
  const totalFlips = mode === 'free' ? freeFlipCount : (session?.totalFlips ?? 0);
  const totalInteractions = session?.history.length ?? 0;
  const canFinishEarly =
    mode !== 'free' &&
    Boolean(session && !session.completed && session.totalFlips > 0);

  return (
    <div className="space-y-4">
      <StationConfigBar
        domainFilter={domainFilter}
        mode={mode}
        hasSavedProgress={hasSavedProgress}
        toReviewCount={activeReviewIds.length}
        canFinishEarly={canFinishEarly}
        onDomainChange={handleDomainChange}
        onModeChange={handleModeChange}
        onStartReview={handleStartDirectReview}
        onFinishEarly={handleFinishEarly}
        onOpenStats={() => setIsStatsOpen(true)}
        onRestartSession={handleRestartSession}
        onClearProgress={handleClearProgress}
      />

      <div
        ref={stageContainerRef}
        tabIndex={-1}
        className="focus:outline-none scroll-mt-20"
      >
        {summaryData ? (
          <ChallengeSummary
            summary={summaryData}
            onReviewWeakCards={handleReviewWeakCards}
            onStartNewChallenge={handleRestartSession}
            onBackToHub={onBackToHub}
          />
        ) : activeCard ? (
          <FlashCardStage
            card={activeCard}
            isFlipped={isFlipped}
            mode={mode}
            positionLabel={positionLabel}
            canGoPrev={mode === 'free' && freeIndex > 0}
            canGoNext={mode === 'free' && freeIndex < filteredCards.length - 1}
            previousRating={storedRatings[activeCard.id]}
            onFlip={handleFlip}
            onPrev={handlePrevFree}
            onNext={handleNextFree}
            onRate={handleRate}
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-600 dark:text-slate-300">
            Não existem cartas disponíveis para o filtro selecionado.
          </div>
        )}
      </div>

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={progressStats}
        domainChartData={domainChartData}
        domainFilter={domainFilter}
        mode={mode}
        totalFlips={totalFlips}
        totalInteractions={totalInteractions}
        quick10AnsweredCount={session?.history.length ?? 0}
        quick10Total={session?.totalInitial ?? 10}
        elapsedSeconds={elapsedSeconds}
      />
    </div>
  );
}
