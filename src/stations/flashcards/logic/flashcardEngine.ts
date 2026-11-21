import { DOMAINS, type DomainId, type FlashCard } from '../data/flashcardsData';

export type LearningMode = 'free' | 'challenge' | 'quick10' | 'review';
export type SelfRating = 'forgot' | 'unsure' | 'mastered';
export type DomainFilter = DomainId | 'all';

export interface AssessmentRecord {
  cardId: string;
  domainId: DomainId;
  rating: SelfRating;
  timestamp: number;
}

export interface ChallengeSessionState {
  mode: Exclude<LearningMode, 'free'>;
  domainFilter: DomainFilter;
  /** IDs of all cards in the broader session scope */
  initialCardIds: string[];
  /** Ordered queue of card IDs remaining to be presented */
  queue: string[];
  /** Unique card IDs revealed (flipped front -> back) at least once */
  revealedCardIds: string[];
  /** Unique card IDs marked as mastered during this session */
  masteredIds: string[];
  /** Latest rating recorded per card ID during this session */
  latestRatings: Record<string, SelfRating>;
  /** Full chronological list of assessments made in this session (including review cycles) */
  history: AssessmentRecord[];
  /** Total number of times the user revealed/flipped a card in this session (including review cycles) */
  totalFlips: number;
  /** Total cards initially in the active queue/scope */
  totalInitial: number;
  /** Whether the session has reached completion */
  completed: boolean;
  /** Timestamp when session started */
  startedAt: number;
  /** Timestamp when session completed */
  completedAt: number | null;
}

export interface DomainProgressBreakdown {
  domainId: DomainId;
  domainName: string;
  shortName: string;
  total: number;
  revealed: number;
  worked: number;
  mastered: number;
  unsure: number;
  forgot: number;
  toReview: number;
  unseen: number;
  revealedPercentage: number;
  workedPercentage: number;
  masteredPercentage: number;
}

export interface ProgressStats {
  totalSelected: number;
  revealedUniqueCount: number;
  workedCount: number;
  masteredCount: number;
  unsureCount: number;
  forgotCount: number;
  toReviewCount: number;
  unseenCount: number;
  revealedPercentage: number;
  workedPercentage: number;
  masteredPercentage: number;
  byDomain: DomainProgressBreakdown[];
}

export interface DomainMasteryBarItem {
  domainId: DomainId;
  domainName: string;
  shortName: string;
  order: number;
  mastered: number;
  total: number;
  percentage: number;
}

export interface ChallengeSummaryData {
  mode: Exclude<LearningMode, 'free'>;
  totalSelected: number;
  uniqueRevealedCount: number;
  totalWorked: number;
  totalFlips: number;
  masteredCount: number;
  unsureCount: number;
  forgotCount: number;
  toReviewCount: number;
  totalAttempts: number;
  performancePercentage: number;
  durationSeconds: number;
  byDomain: DomainProgressBreakdown[];
  areasForReview: DomainProgressBreakdown[];
  weakCardIds: string[];
  feedbackTitle: string;
  feedbackMessage: string;
}

/**
 * Deterministic-compatible Fisher-Yates shuffle.
 * Returns a new array without mutating the source array.
 */
export function shuffleFisherYates<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const raw = rng();
    const clamped = raw >= 1 ? 0.9999999999 : raw < 0 ? 0 : raw;
    const j = Math.floor(clamped * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function filterCardsByDomain(
  cards: readonly FlashCard[],
  domainFilter: DomainFilter,
): FlashCard[] {
  if (domainFilter === 'all') {
    return [...cards];
  }
  return cards.filter((card) => card.domainId === domainFilter);
}

/**
 * Creates a new challenge, quick10, or standalone review session.
 */
export function createChallengeSession(
  cards: readonly FlashCard[],
  mode: Exclude<LearningMode, 'free'>,
  domainFilter: DomainFilter,
  now: number = Date.now(),
  rng: () => number = Math.random,
): ChallengeSessionState {
  const filtered = filterCardsByDomain(cards, domainFilter);
  const selected =
    mode === 'quick10'
      ? shuffleFisherYates(filtered, rng).slice(0, Math.min(10, filtered.length))
      : filtered;

  const initialCardIds = selected.map((c) => c.id);

  return {
    mode,
    domainFilter,
    initialCardIds,
    queue: [...initialCardIds],
    revealedCardIds: [],
    masteredIds: [],
    latestRatings: {},
    history: [],
    totalFlips: 0,
    totalInitial: initialCardIds.length,
    completed: initialCardIds.length === 0,
    startedAt: now,
    completedAt: initialCardIds.length === 0 ? now : null,
  };
}

/**
 * Transitions an existing session into a targeted 'review' cycle containing
 * all cards marked "Com dúvidas" ('unsure') OR "Não me lembrei" ('forgot'),
 * while preserving all cumulative reveals, flips, ratings, and interaction history.
 */
export function startReviewCycle(
  previousSession: ChallengeSessionState | null,
  cardsToReview: readonly FlashCard[],
  domainFilter: DomainFilter,
  now: number = Date.now(),
): ChallengeSessionState {
  const reviewQueueIds = cardsToReview.map((c) => c.id);

  if (!previousSession) {
    return {
      mode: 'review',
      domainFilter,
      initialCardIds: [...reviewQueueIds],
      queue: [...reviewQueueIds],
      revealedCardIds: [],
      masteredIds: [],
      latestRatings: {},
      history: [],
      totalFlips: 0,
      totalInitial: reviewQueueIds.length,
      completed: reviewQueueIds.length === 0,
      startedAt: now,
      completedAt: reviewQueueIds.length === 0 ? now : null,
    };
  }

  return {
    ...previousSession,
    mode: 'review',
    queue: [...reviewQueueIds],
    totalInitial: reviewQueueIds.length,
    completed: reviewQueueIds.length === 0,
    completedAt: reviewQueueIds.length === 0 ? now : null,
  };
}

/**
 * Records a card reveal (front -> back) in the active session.
 * Adds the card ID to revealedCardIds (if not yet present) and increments totalFlips.
 */
export function recordSessionFlip(
  session: ChallengeSessionState,
  cardId?: string,
): ChallengeSessionState {
  if (session.completed) {
    return session;
  }
  const targetId = cardId ?? session.queue[0];
  const nextRevealed =
    targetId && !session.revealedCardIds.includes(targetId)
      ? [...session.revealedCardIds, targetId]
      : session.revealedCardIds;

  return {
    ...session,
    revealedCardIds: nextRevealed,
    totalFlips: session.totalFlips + 1,
  };
}

/**
 * Finishes an active challenge session on demand so the learner can inspect
 * their current totals and launch a targeted review of flagged cards.
 */
export function finishChallengeSession(
  session: ChallengeSessionState,
  now: number = Date.now(),
): ChallengeSessionState {
  if (session.completed) {
    return session;
  }
  return {
    ...session,
    completed: true,
    completedAt: now,
  };
}

/**
 * Processes a student's self-assessment for the current head card in the queue.
 * - In 'challenge' and 'review' modes:
 *   - 'forgot' ("Não me lembrei"): reinserts card shortly ahead (after 2-3 cards whenever queue allows), no duplicates.
 *   - 'unsure' ("Com dúvidas"): reinserts card later in the same session (near the end of remaining queue), no duplicates.
 *   - 'mastered' ("Já domino!"): marks card as mastered and removes from queue.
 * - In 'quick10' mode:
 *   - Each of the 10 shuffled cards is assessed once; ratings are recorded for summary and optional weak-card review.
 */
export function rateCurrentCard(
  session: ChallengeSessionState,
  card: FlashCard,
  rating: SelfRating,
  now: number = Date.now(),
): ChallengeSessionState {
  if (session.completed || session.queue.length === 0) {
    return session;
  }

  const [currentId, ...restQueue] = session.queue;
  if (currentId !== card.id) {
    return session;
  }

  // Ensure no duplicate copies of currentId remain in restQueue
  const cleanRest = restQueue.filter((id) => id !== currentId);

  const nextRatings: Record<string, SelfRating> = {
    ...session.latestRatings,
    [currentId]: rating,
  };

  const nextHistory: AssessmentRecord[] = [
    ...session.history,
    {
      cardId: currentId,
      domainId: card.domainId,
      rating,
      timestamp: now,
    },
  ];

  const nextRevealed = session.revealedCardIds.includes(currentId)
    ? session.revealedCardIds
    : [...session.revealedCardIds, currentId];

  // Ensure totalFlips is never lower than total assessments
  const nextTotalFlips = Math.max(session.totalFlips, nextHistory.length);

  let nextMasteredIds = [...session.masteredIds];
  let nextQueue = cleanRest;

  if (session.mode === 'quick10') {
    if (rating === 'mastered' && !nextMasteredIds.includes(currentId)) {
      nextMasteredIds.push(currentId);
    } else if (rating !== 'mastered') {
      nextMasteredIds = nextMasteredIds.filter((id) => id !== currentId);
    }
  } else {
    // Active recall with deterministic spaced repetition ('challenge' or 'review')
    if (rating === 'mastered') {
      if (!nextMasteredIds.includes(currentId)) {
        nextMasteredIds.push(currentId);
      }
    } else if (rating === 'forgot') {
      nextMasteredIds = nextMasteredIds.filter((id) => id !== currentId);
      // Reappears after ~2 or 3 cards when enough cards exist in queue
      const offset = cleanRest.length >= 3 ? 3 : cleanRest.length;
      nextQueue = [
        ...cleanRest.slice(0, offset),
        currentId,
        ...cleanRest.slice(offset),
      ];
    } else {
      // 'unsure': returns later in the same session
      nextMasteredIds = nextMasteredIds.filter((id) => id !== currentId);
      const lateOffset =
        cleanRest.length <= 1
          ? cleanRest.length
          : Math.max(cleanRest.length - 1, Math.ceil(cleanRest.length * 0.8));
      nextQueue = [
        ...cleanRest.slice(0, lateOffset),
        currentId,
        ...cleanRest.slice(lateOffset),
      ];
    }
  }

  const completed = nextQueue.length === 0;

  return {
    ...session,
    queue: nextQueue,
    revealedCardIds: nextRevealed,
    masteredIds: nextMasteredIds,
    latestRatings: nextRatings,
    history: nextHistory,
    totalFlips: nextTotalFlips,
    completed,
    completedAt: completed ? now : null,
  };
}

/**
 * Returns IDs of all cards marked for review:
 * includes BOTH "Com dúvidas" ('unsure') AND "Não me lembrei" ('forgot').
 */
export function getCardsToReviewIds(
  ratingsMap: Record<string, SelfRating>,
  candidateIds?: readonly string[],
): string[] {
  const ids = candidateIds ?? Object.keys(ratingsMap);
  return ids.filter((id) => {
    const rating = ratingsMap[id];
    return rating === 'unsure' || rating === 'forgot';
  });
}

/**
 * Computes real-time progress stats counting ALL revealed and worked cards
 * (mastered + unsure + forgot + revealed-not-yet-rated), regardless of final state.
 */
export function computeProgressStats(
  selectedCards: readonly FlashCard[],
  ratingsMap: Record<string, SelfRating>,
  revealedIds: readonly string[] = [],
): ProgressStats {
  const totalSelected = selectedCards.length;
  const revealedSet = new Set(revealedIds);
  let masteredCount = 0;
  let unsureCount = 0;
  let forgotCount = 0;
  let revealedUniqueCount = 0;

  const domainBuckets: Record<
    DomainId,
    {
      total: number;
      revealed: number;
      mastered: number;
      unsure: number;
      forgot: number;
      unseen: number;
    }
  > = {
    autenticacao: { total: 0, revealed: 0, mastered: 0, unsure: 0, forgot: 0, unseen: 0 },
    'engenharia-social': { total: 0, revealed: 0, mastered: 0, unsure: 0, forgot: 0, unseen: 0 },
    privacidade: { total: 0, revealed: 0, mastered: 0, unsure: 0, forgot: 0, unseen: 0 },
    'equipamentos-redes': { total: 0, revealed: 0, mastered: 0, unsure: 0, forgot: 0, unseen: 0 },
    'informacao-incidentes': { total: 0, revealed: 0, mastered: 0, unsure: 0, forgot: 0, unseen: 0 },
  };

  for (const card of selectedCards) {
    const bucket = domainBuckets[card.domainId];
    bucket.total += 1;
    const rating = ratingsMap[card.id];
    const isRevealed = Boolean(rating) || revealedSet.has(card.id);

    if (isRevealed) {
      bucket.revealed += 1;
      revealedUniqueCount += 1;
    } else {
      bucket.unseen += 1;
    }

    if (rating === 'mastered') {
      bucket.mastered += 1;
      masteredCount += 1;
    } else if (rating === 'unsure') {
      bucket.unsure += 1;
      unsureCount += 1;
    } else if (rating === 'forgot') {
      bucket.forgot += 1;
      forgotCount += 1;
    }
  }

  const toReviewCount = unsureCount + forgotCount;
  const workedCount = masteredCount + toReviewCount;
  const unseenCount = Math.max(0, totalSelected - revealedUniqueCount);

  const revealedPercentage =
    totalSelected === 0 ? 0 : Math.round((revealedUniqueCount / totalSelected) * 100);
  const workedPercentage =
    totalSelected === 0 ? 0 : Math.round((workedCount / totalSelected) * 100);
  const masteredPercentage =
    totalSelected === 0 ? 0 : Math.round((masteredCount / totalSelected) * 100);

  const byDomain: DomainProgressBreakdown[] = DOMAINS.filter(
    (d) => domainBuckets[d.id].total > 0,
  ).map((d) => {
    const b = domainBuckets[d.id];
    const toReview = b.unsure + b.forgot;
    const worked = b.mastered + toReview;
    return {
      domainId: d.id,
      domainName: d.name,
      shortName: d.shortName,
      total: b.total,
      revealed: b.revealed,
      worked,
      mastered: b.mastered,
      unsure: b.unsure,
      forgot: b.forgot,
      toReview,
      unseen: b.unseen,
      revealedPercentage: b.total === 0 ? 0 : Math.round((b.revealed / b.total) * 100),
      workedPercentage: b.total === 0 ? 0 : Math.round((worked / b.total) * 100),
      masteredPercentage: b.total === 0 ? 0 : Math.round((b.mastered / b.total) * 100),
    };
  });

  return {
    totalSelected,
    revealedUniqueCount,
    workedCount,
    masteredCount,
    unsureCount,
    forgotCount,
    toReviewCount,
    unseenCount,
    revealedPercentage,
    workedPercentage,
    masteredPercentage,
    byDomain,
  };
}

/**
 * Computes mastered vs. total card counts separated across all five cybersecurity domains
 * for the statistics bar chart.
 */
export function computeDomainMasteryChart(
  cards: readonly FlashCard[],
  ratingsMap: Record<string, SelfRating>,
): DomainMasteryBarItem[] {
  return DOMAINS.map((domain) => {
    const domainCards = cards.filter((c) => c.domainId === domain.id);
    const total = domainCards.length;
    const mastered = domainCards.filter(
      (c) => ratingsMap[c.id] === 'mastered',
    ).length;
    const percentage = total === 0 ? 0 : Math.round((mastered / total) * 100);
    return {
      domainId: domain.id,
      domainName: domain.name,
      shortName: domain.shortName,
      order: domain.order,
      mastered,
      total,
      percentage,
    };
  });
}

/**
 * Computes pedagogical end-of-challenge summary from session state,
 * counting ALL revealed cards and ALL interactions across challenge + review cycles.
 */
export function computeChallengeSummary(
  session: ChallengeSessionState,
  allCards: readonly FlashCard[],
): ChallengeSummaryData {
  const cardById = new Map(allCards.map((c) => [c.id, c]));
  const sessionCards = session.initialCardIds
    .map((id) => cardById.get(id))
    .filter((c): c is FlashCard => Boolean(c));

  const stats = computeProgressStats(
    sessionCards,
    session.latestRatings,
    session.revealedCardIds,
  );

  // Cards that experienced difficulty at any point or currently need review
  // Includes BOTH "Com dúvidas" ('unsure') AND "Não me lembrei" ('forgot')
  const hadDifficultyIds = new Set<string>();
  for (const record of session.history) {
    if (record.rating === 'forgot' || record.rating === 'unsure') {
      hadDifficultyIds.add(record.cardId);
    }
  }
  for (const [cardId, rating] of Object.entries(session.latestRatings)) {
    if (rating === 'forgot' || rating === 'unsure') {
      hadDifficultyIds.add(cardId);
    }
  }

  // Domains with current cards to review or where difficulty occurred during session
  const difficultyByDomain = new Map<DomainId, number>();
  for (const record of session.history) {
    if (record.rating === 'forgot' || record.rating === 'unsure') {
      difficultyByDomain.set(
        record.domainId,
        (difficultyByDomain.get(record.domainId) ?? 0) + 1,
      );
    }
  }

  const areasForReview = stats.byDomain.filter(
    (d) =>
      d.toReview > 0 ||
      d.mastered < d.worked ||
      (difficultyByDomain.get(d.domainId) ?? 0) > 0,
  );

  const totalWorked = stats.workedCount;
  const performancePercentage =
    session.mode === 'quick10'
      ? stats.masteredPercentage
      : totalWorked === 0
        ? 0
        : Math.round((stats.masteredCount / totalWorked) * 100);

  const durationSeconds =
    session.completedAt && session.completedAt >= session.startedAt
      ? Math.max(1, Math.round((session.completedAt - session.startedAt) / 1000))
      : 0;

  const totalFlips = Math.max(
    session.totalFlips,
    session.history.length,
    stats.revealedUniqueCount,
  );

  let feedbackTitle = 'Excelente trabalho de revisão!';
  let feedbackMessage =
    'Demonstraste grande segurança nos cenários escolares apresentados. Continua a praticar periodicamente para manter estes hábitos bem presentes.';

  if (stats.toReviewCount > 0) {
    feedbackTitle = 'Progresso registado com sucesso!';
    feedbackMessage =
      'Todas as cartas reveladas nesta sessão foram contabilizadas. Podes usar o botão «Rever cartas» abaixo para consolidar tanto as cartas marcadas com dúvidas como as que não recordaste.';
  } else if (session.mode !== 'quick10' && hadDifficultyIds.size > 0) {
    feedbackTitle = 'Ciclo concluído com persistência!';
    feedbackMessage =
      'Todas as interações realizadas ao longo do desafio e da revisão foram contabilizadas. Rever as cartas com dúvidas e as não lembradas consolidou cada conceito até ao domínio completo.';
  } else if (session.mode === 'quick10' && performancePercentage < 60) {
    feedbackTitle = 'Bom ponto de partida!';
    feedbackMessage =
      'Identificaste os temas que merecem uma segunda leitura. Experimenta usar «Rever cartas» para trabalhar as cartas com dúvidas e as não lembradas.';
  } else if (session.mode === 'quick10' && performancePercentage < 90) {
    feedbackTitle = 'Muito bom progresso!';
    feedbackMessage =
      'Já dominas a maioria das situações propostas. Uma revisão às cartas com dúvidas e não lembradas vai consolidar ainda melhor estes cuidados.';
  }

  return {
    mode: session.mode,
    totalSelected: sessionCards.length,
    uniqueRevealedCount: stats.revealedUniqueCount,
    totalWorked,
    totalFlips,
    masteredCount: stats.masteredCount,
    unsureCount: stats.unsureCount,
    forgotCount: stats.forgotCount,
    toReviewCount: stats.toReviewCount,
    totalAttempts: session.history.length,
    performancePercentage,
    durationSeconds,
    byDomain: stats.byDomain,
    areasForReview,
    weakCardIds: Array.from(hadDifficultyIds),
    feedbackTitle,
    feedbackMessage,
  };
}
