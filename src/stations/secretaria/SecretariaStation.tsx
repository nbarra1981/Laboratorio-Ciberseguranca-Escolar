import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  Lock,
  Pause,
  Play,
  RefreshCcw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Square,
  Volume2,
  XCircle,
} from 'lucide-react';
import type { StationComponentProps } from '../../core/types';
import {
  QUESTIONARIO_ESTACAO_2,
  SECRETARIA_ITEMS,
  type SecretaraItem,
} from './data/secretariaData';
import {
  buildElementSpeechText,
  computeQuizResults,
  prepareShuffledQuiz,
  type ShuffledQuizQuestion,
} from './logic/secretariaLogic';

type StationMode = 'explore' | 'challenge' | 'quiz';

const DESK_IMAGE_SRC = '/assets/aistudio/Ciberseguran_a_Secret_ria_Professor_517dc663.png';

export function SecretariaStation(_props: StationComponentProps) {
  const [mode, setMode] = useState<StationMode>('explore');
  const [selectedItem, setSelectedItem] = useState<SecretaraItem | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const [imageError, setImageError] = useState<boolean>(false);

  // Challenge state
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [showChallengeSolution, setShowChallengeSolution] = useState<boolean>(false);
  const [lastFoundFeedback, setLastFoundFeedback] = useState<string>('');

  // Quiz state (options shuffled on mount and on every reset)
  const [quizQuestions, setQuizQuestions] = useState<ShuffledQuizQuestion[]>(() =>
    prepareShuffledQuiz(QUESTIONARIO_ESTACAO_2),
  );
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Audio playback & session cache (Gemini TTS primary + strict pt-PT browser fallback)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  const [speechStatus, setSpeechStatus] = useState<string>('');
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobCacheRef = useRef<Record<string, string>>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const resolveEuropeanPortugueseVoice = useCallback(
    (synth: SpeechSynthesis): SpeechSynthesisVoice | null => {
      const voices = synth.getVoices();
      // Strictly prefer genuine European Portuguese (pt-PT) voices; never pick pt-BR
      const exactPtPt = voices.find((v) => {
        const normalized = v.lang.replace('_', '-').toLowerCase();
        const nameLower = v.name.toLowerCase();
        return (
          normalized === 'pt-pt' &&
          !nameLower.includes('brazil') &&
          !nameLower.includes('brasil')
        );
      });
      if (exactPtPt) {
        return exactPtPt;
      }
      const namedPortugal = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        return (
          (nameLower.includes('portugal') || nameLower.includes('european portuguese')) &&
          !nameLower.includes('brazil') &&
          !nameLower.includes('brasil')
        );
      });
      return namedPortugal ?? null;
    },
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    const synth = window.speechSynthesis;
    const updateVoice = () => {
      preferredVoiceRef.current = resolveEuropeanPortugueseVoice(synth);
    };
    updateVoice();
    synth.addEventListener?.('voiceschanged', updateVoice);
    return () => {
      synth.removeEventListener?.('voiceschanged', updateVoice);
      synth.cancel();
    };
  }, [resolveEuropeanPortugueseVoice]);

  const handleStopSpeech = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      audioElementRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    speechUtteranceRef.current = null;
    setIsGeneratingAudio(false);
    setIsPlaying(false);
    setIsPaused(false);
    setSpeechStatus('');
  }, []);

  useEffect(() => {
    return () => {
      handleStopSpeech();
    };
  }, [selectedItem, handleStopSpeech]);

  useEffect(() => {
    return () => {
      for (const blobUrl of Object.values(audioBlobCacheRef.current)) {
        URL.revokeObjectURL(blobUrl);
      }
      audioBlobCacheRef.current = {};
    };
  }, []);

  const playAudioFromBlobUrl = useCallback((blobUrl: string) => {
    const audio = new Audio(blobUrl);
    audioElementRef.current = audio;

    audio.onplay = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setIsGeneratingAudio(false);
      setSpeechStatus('A reproduzir explicação...');
    };

    audio.onpause = () => {
      if (audio.currentTime > 0 && !audio.ended && audioElementRef.current === audio) {
        setIsPaused(true);
        setSpeechStatus('Reprodução em pausa.');
      }
    };

    audio.onended = () => {
      if (audioElementRef.current === audio) {
        audioElementRef.current = null;
      }
      setIsPlaying(false);
      setIsPaused(false);
      setSpeechStatus('');
    };

    audio.onerror = () => {
      if (audioElementRef.current === audio) {
        audioElementRef.current = null;
      }
      setIsPlaying(false);
      setIsPaused(false);
      setIsGeneratingAudio(false);
      setSpeechStatus('Voz indisponível de momento. Leia a descrição acima.');
    };

    audio.play().catch(() => {
      setIsPlaying(false);
      setIsPaused(false);
      setIsGeneratingAudio(false);
      setSpeechStatus('Não foi possível iniciar a reprodução de áudio.');
    });
  }, []);

  const fallbackSpeakBrowserPtPt = useCallback(
    (text: string): boolean => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return false;
      }
      const synth = window.speechSynthesis;
      const ptPtVoice = preferredVoiceRef.current ?? resolveEuropeanPortugueseVoice(synth);
      if (!ptPtVoice) {
        return false;
      }

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.voice = ptPtVoice;
      utterance.rate = 0.94;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsGeneratingAudio(false);
        setSpeechStatus('A reproduzir explicação...');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setSpeechStatus('');
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setSpeechStatus('Voz indisponível de momento. Leia a descrição acima.');
      };

      speechUtteranceRef.current = utterance;
      synth.speak(utterance);
      return true;
    },
    [resolveEuropeanPortugueseVoice],
  );

  const handlePlayOrResume = useCallback(
    async (item: SecretaraItem) => {
      if (isPlaying && isPaused) {
        if (audioElementRef.current) {
          try {
            await audioElementRef.current.play();
            setIsPaused(false);
            setSpeechStatus('A reproduzir explicação...');
          } catch {
            setSpeechStatus('Não foi possível retomar o áudio.');
          }
          return;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.resume();
          setIsPaused(false);
          setSpeechStatus('A reproduzir explicação...');
        }
        return;
      }

      if ((isPlaying && !isPaused) || isGeneratingAudio) {
        return;
      }

      handleStopSpeech();

      const cachedBlobUrl = audioBlobCacheRef.current[item.id];
      if (cachedBlobUrl) {
        playAudioFromBlobUrl(cachedBlobUrl);
        return;
      }

      const elementText = buildElementSpeechText(item);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsGeneratingAudio(true);
      setSpeechStatus('A preparar voz...');

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: elementText, itemId: item.id }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };

        if (!payload.audioBase64) {
          throw new Error('Missing audioBase64 payload');
        }

        if (controller.signal.aborted) {
          return;
        }

        const binaryStr = window.atob(payload.audioBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i += 1) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], {
          type: payload.mimeType || 'audio/wav',
        });
        const objectUrl = URL.createObjectURL(audioBlob);
        audioBlobCacheRef.current[item.id] = objectUrl;
        abortControllerRef.current = null;
        playAudioFromBlobUrl(objectUrl);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        abortControllerRef.current = null;
        setIsGeneratingAudio(false);

        const startedFallback = fallbackSpeakBrowserPtPt(elementText);
        if (!startedFallback) {
          setSpeechStatus('Voz indisponível de momento. Leia a descrição acima.');
        }
      }
    },
    [
      fallbackSpeakBrowserPtPt,
      handleStopSpeech,
      isGeneratingAudio,
      isPaused,
      isPlaying,
      playAudioFromBlobUrl,
    ],
  );

  const handlePauseSpeech = useCallback(() => {
    if (!isPlaying || isPaused) {
      return;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPaused(true);
      setSpeechStatus('Reprodução em pausa.');
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setSpeechStatus('Reprodução em pausa.');
    }
  }, [isPaused, isPlaying]);

  const handleSelectItem = useCallback(
    (item: SecretaraItem) => {
      handleStopSpeech();
      setSelectedItem(item);

      setExploredIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));

      if (mode === 'challenge') {
        if (!foundIds.includes(item.id)) {
          const nextFound = [...foundIds, item.id];
          setFoundIds(nextFound);
          setLastFoundFeedback(
            `Risco identificado (${nextFound.length}/${SECRETARIA_ITEMS.length}): ${item.title}`,
          );
        } else {
          setLastFoundFeedback(`${item.shortTitle} já tinha sido identificado.`);
        }
      }
    },
    [foundIds, handleStopSpeech, mode],
  );

  const handleResetChallenge = useCallback(() => {
    handleStopSpeech();
    setFoundIds([]);
    setShowChallengeSolution(false);
    setSelectedItem(null);
    setLastFoundFeedback('');
  }, [handleStopSpeech]);

  const handleShowSolution = useCallback(() => {
    handleStopSpeech();
    setFoundIds(SECRETARIA_ITEMS.map((item) => item.id));
    setShowChallengeSolution(true);
    setLastFoundFeedback(
      'Solução apresentada. Selecione qualquer elemento numerado para consultar as boas práticas.',
    );
  }, [handleStopSpeech]);

  const handleSelectQuizOption = useCallback(
    (questionId: number, optionIndex: number) => {
      if (quizCompleted) return;
      // Lock the answer once selected so immediate feedback reflects first decision
      setSelectedAnswers((prev) => {
        if (prev[questionId] !== undefined) {
          return prev;
        }
        return { ...prev, [questionId]: optionIndex };
      });
    },
    [quizCompleted],
  );

  const handleResetQuiz = useCallback(() => {
    setQuizQuestions(prepareShuffledQuiz(QUESTIONARIO_ESTACAO_2));
    setSelectedAnswers({});
    setCurrentQuizIndex(0);
    setQuizCompleted(false);
  }, []);

  const handleReviewItemFromQuiz = useCallback(
    (itemId: string) => {
      const target = SECRETARIA_ITEMS.find((item) => item.id === itemId);
      handleStopSpeech();
      setMode('explore');
      if (target) {
        setSelectedItem(target);
        setExploredIds((prev) => (prev.includes(target.id) ? prev : [...prev, target.id]));
      }
    },
    [handleStopSpeech],
  );

  const answeredCount = Object.keys(selectedAnswers).length;
  const allQuizAnswered = answeredCount === quizQuestions.length;

  const quizSummary = useMemo(
    () => computeQuizResults(quizQuestions, selectedAnswers, SECRETARIA_ITEMS),
    [quizQuestions, selectedAnswers],
  );

  const challengeCompleted = foundIds.length === SECRETARIA_ITEMS.length;
  const challengeProgressPct = Math.round((foundIds.length / SECRETARIA_ITEMS.length) * 100);
  const quizProgressPct = Math.round((answeredCount / quizQuestions.length) * 100);

  return (
    <div className="space-y-6 pb-10">
      {/* Header Station Title Bar */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 dark:text-sky-400">
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Estação 2 · Ciber-higiene e Proteção da Informação</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-slate-50 text-balance">
            A Secretária do Professor
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Identifique os riscos de cibersegurança e de proteção de dados presentes na secretária de um professor, em contexto escolar, e adote as boas práticas de segurança digital recomendadas.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          role="group"
          aria-label="Modos de interação da Estação 2"
          className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              setMode('explore');
              handleStopSpeech();
            }}
            aria-pressed={mode === 'explore'}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
              mode === 'explore'
                ? 'bg-sky-700 dark:bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
            }`}
          >
            Modo Exploração
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('challenge');
              setSelectedItem(null);
              handleStopSpeech();
            }}
            aria-pressed={mode === 'challenge'}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 tabular-nums ${
              mode === 'challenge'
                ? 'bg-sky-700 dark:bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
            }`}
          >
            Desafio ({foundIds.length}/{SECRETARIA_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('quiz');
              setSelectedItem(null);
              handleStopSpeech();
            }}
            aria-pressed={mode === 'quiz'}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
              mode === 'quiz'
                ? 'bg-sky-700 dark:bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
            }`}
          >
            Avaliação (Quiz)
          </button>
        </div>
      </section>

      {/* Challenge Status & Progress Bar */}
      {mode === 'challenge' && (
        <section className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-4 space-y-3 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-display font-bold text-amber-950 dark:text-amber-200">
                  Modo Desafio — Encontra os {SECRETARIA_ITEMS.length} Riscos
                </h2>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/80">
                  Os marcadores estão ocultos. Clique diretamente nos objetos da imagem que representam riscos de segurança ({foundIds.length}/{SECRETARIA_ITEMS.length} identificados).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetChallenge}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reiniciar Desafio</span>
              </button>
              <button
                type="button"
                onClick={handleShowSolution}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Mostrar Solução</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-amber-200/70 dark:bg-amber-900/50 overflow-hidden">
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                style={{ width: `${challengeProgressPct}%` }}
              />
            </div>
            {lastFoundFeedback && (
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                {lastFoundFeedback}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Main Interactive Stage (Explore or Challenge) */}
      {mode !== 'quiz' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Desk Image + Object Index */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg relative">
              <div className="relative w-full select-none">
                {!imageError ? (
                  <img
                    src={DESK_IMAGE_SRC}
                    alt="Secretária do professor com oito elementos de risco de cibersegurança para explorar"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-auto block"
                  />
                ) : (
                  <div className="w-full aspect-[16/9] bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-300">
                    <ShieldAlert className="w-10 h-10 text-amber-400 mb-2" aria-hidden="true" />
                    <p className="font-display font-bold text-base text-white">
                      Quadro interativo da secretária
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Não foi possível carregar a imagem. Utilize os botões abaixo para explorar os oito elementos de cibersegurança.
                    </p>
                  </div>
                )}

                {/* 8 Relative Percentage-Based Hotspots */}
                {SECRETARIA_ITEMS.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const isFound = foundIds.includes(item.id);
                  const isExplored = exploredIds.includes(item.id);
                  const showMarker = mode === 'explore' || isFound || showChallengeSolution;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      aria-label={
                        showMarker
                          ? `Ponto ${item.number}: ${item.title}`
                          : 'Zona interativa oculta na secretária'
                      }
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${item.w}%`,
                        height: `${item.h}%`,
                        zIndex: isSelected ? 40 : item.zIndex ?? 10,
                      }}
                      className={`absolute rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/25 border-2 border-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.55)]'
                          : mode === 'challenge' && isFound
                          ? 'bg-emerald-500/20 border-2 border-emerald-400 hover:bg-emerald-500/35'
                          : mode === 'explore' && isExplored
                          ? 'bg-emerald-500/15 border-2 border-emerald-400/90 hover:bg-emerald-500/30'
                          : showMarker
                          ? 'bg-rose-500/15 border-2 border-rose-500/85 hover:bg-rose-500/30'
                          : 'bg-transparent border border-transparent hover:bg-white/5 focus-visible:bg-sky-500/20'
                      }`}
                    >
                      {showMarker && (
                        <span
                          className={`absolute -top-2.5 -left-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white text-white text-xs font-mono font-bold flex items-center justify-center shadow-md transition-colors ${
                            isSelected
                              ? 'bg-sky-600'
                              : (mode === 'challenge' && isFound) ||
                                (mode === 'explore' && isExplored)
                              ? 'bg-emerald-600'
                              : 'bg-rose-600'
                          }`}
                        >
                          {item.number}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span className="font-medium">
                  {mode === 'explore'
                    ? `Modo Exploração · ${exploredIds.length}/${SECRETARIA_ITEMS.length} inspecionados`
                    : `Modo Desafio · ${foundIds.length}/${SECRETARIA_ITEMS.length} riscos descobertos`}
                </span>
                <span className="text-slate-400">
                  {mode === 'explore'
                    ? 'Clique numa zona marcada da secretária'
                    : 'Clique sobre os objetos de risco na imagem'}
                </span>
              </div>
            </div>

            {/* Quick Index in Explore Mode / Discovered Summary in Challenge Mode */}
            {mode === 'explore' ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Índice dos 8 elementos da secretária
                  </h2>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {exploredIds.length}/{SECRETARIA_ITEMS.length} explorados
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SECRETARIA_ITEMS.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    const isExplored = exploredIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectItem(item)}
                        className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors flex items-center gap-2 min-h-[40px] ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-950 dark:text-sky-200 font-semibold'
                            : isExplored
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-mono font-bold shrink-0">{item.number}.</span>
                        <span className="truncate">{item.shortTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              challengeCompleted && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="space-y-1">
                      <h3 className="text-base font-display font-bold text-emerald-950 dark:text-emerald-200">
                        {showChallengeSolution
                          ? 'Solução completa dos 8 riscos'
                          : 'Parabéns! Identificou todos os 8 riscos da secretária'}
                      </h3>
                      <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
                        {showChallengeSolution
                          ? 'Selecione qualquer um dos 8 pontos para rever o risco, as boas práticas e ouvir a recomendação.'
                          : 'Completou o desafio de inspeção visual. Pode agora avançar para a Avaliação (Quiz) ou rever qualquer elemento abaixo.'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {SECRETARIA_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectItem(item)}
                        className="text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/70 text-xs text-slate-800 dark:text-slate-200 hover:border-sky-400 transition-colors flex items-center gap-2"
                      >
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {item.number}.
                        </span>
                        <span className="font-medium truncate">{item.shortTitle}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right: Info Panel & Voice Explanation */}
          <div className="lg:col-span-5 space-y-4">
            {selectedItem ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-5 transition-colors">
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-sky-800 dark:text-sky-400">
                      Elemento {selectedItem.number} de {SECRETARIA_ITEMS.length} ·{' '}
                      {selectedItem.theme}
                    </p>
                    <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-50">
                      {selectedItem.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleStopSpeech();
                      setSelectedItem(null);
                    }}
                    aria-label="Fechar painel do elemento"
                    className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Audio Controls (strictly reading the element's displayed text) */}
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-950 dark:text-sky-300">
                      <Volume2 className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
                      <span>Explicação Sonora</span>
                    </div>
                    {speechStatus && (
                      <span className="text-xs font-mono text-sky-800 dark:text-sky-300">
                        {speechStatus}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {selectedItem.audioSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handlePlayOrResume(selectedItem)}
                      disabled={(isPlaying && !isPaused) || isGeneratingAudio}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-xs font-semibold hover:bg-sky-800 dark:hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none transition-colors whitespace-nowrap"
                    >
                      {isGeneratingAudio ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                          <span>A preparar...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isPlaying && isPaused ? 'Retomar' : 'Reproduzir'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePauseSpeech}
                      disabled={!isPlaying || isPaused}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap"
                    >
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Pausar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStopSpeech}
                      disabled={!isPlaying && !isGeneratingAudio}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-800 dark:hover:text-rose-300 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap"
                    >
                      <Square className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Parar</span>
                    </button>
                  </div>
                </div>

                {/* Risk, Consequences, Best Practices & Recommended Tools */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800/80 space-y-1">
                    <p className="font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                      <AlertTriangle
                        className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span>Risco de Cibersegurança</span>
                    </p>
                    <p className="text-rose-950/90 dark:text-rose-200/90 leading-relaxed">
                      {selectedItem.risk}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-1">
                    <p className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <HelpCircle
                        className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span>Possíveis Consequências</span>
                    </p>
                    <p className="text-amber-950/90 dark:text-amber-200/90 leading-relaxed">
                      {selectedItem.consequences}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                    <p className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span>Boas Práticas Recomendadas</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-emerald-950/90 dark:text-emerald-200/90 leading-relaxed">
                      {selectedItem.bestPractices.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-slate-800/70 border border-sky-200/80 dark:border-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0" aria-hidden="true" />
                      <span>Ferramentas e Tecnologias Recomendadas</span>
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedItem.tools.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-display font-bold text-slate-900 dark:text-slate-50">
                  {mode === 'explore'
                    ? 'Selecione um elemento na secretária'
                    : 'Encontre os 8 riscos na imagem'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {mode === 'explore'
                    ? 'Clique em qualquer um dos oito elementos assinalados para conhecer os riscos associados, consultar as boas práticas e ouvir a explicação.'
                    : 'Clique diretamente sobre os objetos da secretária que representam vulnerabilidades ou más práticas de cibersegurança.'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Evaluation Quiz Mode with Shuffled Options & Immediate Feedback */
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md max-w-3xl mx-auto space-y-6 transition-colors">
          <div className="space-y-3 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                  Avaliação de Conhecimentos · Estação 2
                </p>
                <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                  Questionário sobre Ciber-higiene e Proteção de Dados
                </h2>
              </div>
              {!quizCompleted && (
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 tabular-nums shrink-0">
                  Pergunta {currentQuizIndex + 1} de {quizQuestions.length} · {answeredCount}/{quizQuestions.length} respondidas
                </span>
              )}
            </div>

            {!quizCompleted && (
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-sky-600 dark:bg-sky-500 transition-all duration-300"
                  style={{ width: `${quizProgressPct}%` }}
                />
              </div>
            )}
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              {(() => {
                const q = quizQuestions[currentQuizIndex];
                const chosenAnswer = selectedAnswers[q.id];
                const isAnswered = chosenAnswer !== undefined;
                const isAnswerCorrect = isAnswered && chosenAnswer === q.respostaCorreta;

                return (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Tema: {q.tema}
                      </p>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                        {currentQuizIndex + 1}. {q.pergunta}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {q.opcoes.map((opcao, optIdx) => {
                        const isChosen = chosenAnswer === optIdx;
                        const isRightOption = optIdx === q.respostaCorreta;

                        let buttonClass =
                          'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
                        let letterClass =
                          'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300';

                        if (isAnswered) {
                          if (isRightOption) {
                            buttonClass =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
                            letterClass = 'bg-emerald-700 border-emerald-700 text-white';
                          } else if (isChosen) {
                            buttonClass =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200 font-medium';
                            letterClass = 'bg-rose-700 border-rose-700 text-white';
                          } else {
                            buttonClass =
                              'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm transition-colors flex items-start justify-between gap-3 ${buttonClass} ${
                              isAnswered ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          >
                            <span className="flex items-start gap-3">
                              <span
                                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${letterClass}`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="leading-relaxed">{opcao}</span>
                            </span>

                            {isAnswered && isRightOption && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shrink-0">
                                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                <span>Correta</span>
                              </span>
                            )}
                            {isAnswered && isChosen && !isRightOption && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 dark:text-rose-300 shrink-0">
                                <XCircle className="w-4 h-4" aria-hidden="true" />
                                <span>Incorreta</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Immediate Pedagogical Explanation Box */}
                    {isAnswered && (
                      <div
                        className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                          isAnswerCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/35 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                        }`}
                      >
                        <p className="font-bold flex items-center gap-1.5">
                          {isAnswerCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                          )}
                          <span>
                            {isAnswerCorrect ? 'Resposta correta!' : 'Resposta incorreta'}
                          </span>
                        </p>
                        <p className="leading-relaxed">{q.explicacao}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Question Step Indicators */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {quizQuestions.map((q, idx) => {
                  const ans = selectedAnswers[q.id];
                  const answered = ans !== undefined;
                  const right = answered && ans === q.respostaCorreta;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuizIndex(idx)}
                      aria-label={`Ir para pergunta ${idx + 1}`}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        idx === currentQuizIndex
                          ? 'ring-2 ring-sky-500 border-sky-600 bg-sky-700 text-white'
                          : answered && right
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-300'
                          : answered
                          ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentQuizIndex === 0}
                  onClick={() => setCurrentQuizIndex((idx) => Math.max(0, idx - 1))}
                  className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Anterior</span>
                </button>

                {currentQuizIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuizIndex((idx) => Math.min(quizQuestions.length - 1, idx + 1))
                    }
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-5 py-2 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 transition-colors"
                  >
                    <span>Seguinte</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!allQuizAnswered}
                    onClick={() => setQuizCompleted(true)}
                    className="inline-flex items-center gap-1.5 min-h-[42px] px-6 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {allQuizAnswered
                        ? 'Concluir Avaliação'
                        : `Responda a todas (${answeredCount}/${quizQuestions.length})`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Final Quiz Results + Personalized Study Recommendations */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" aria-hidden="true" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50">
                    {quizSummary.feedbackTitle}
                  </h3>
                  <p className="text-3xl font-display font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {quizSummary.score} / {quizSummary.total} corretas ({quizSummary.percentage}%)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                    {quizSummary.feedbackMessage}
                  </p>
                </div>
              </div>

              {/* Personalized Recommendations */}
              {quizSummary.recommendations.length > 0 && (
                <div className="p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-3">
                  <h4 className="text-sm font-display font-bold text-amber-950 dark:text-amber-200">
                    Recomendações personalizadas de consolidação
                  </h4>
                  <ul className="space-y-2.5">
                    {quizSummary.recommendations.map((rec) => (
                      <li
                        key={`${rec.relatedItemId}-${rec.tema}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm bg-white/80 dark:bg-slate-900/80 border border-amber-200/80 dark:border-amber-800/60 rounded-lg p-3"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {rec.tema}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">{rec.recomendacao}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleReviewItemFromQuiz(rec.relatedItemId)}
                          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-xs font-semibold hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                        >
                          <span>Rever {rec.itemTitle}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed review list */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-display font-bold text-slate-900 dark:text-slate-50">
                  Correção detalhada
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {quizQuestions.map((q, idx) => {
                    const userOpt = selectedAnswers[q.id];
                    const isCorrect = userOpt === q.respostaCorreta;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                          isCorrect
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
                        }`}
                      >
                        <p className="font-semibold flex items-start gap-2">
                          <span className="shrink-0">{isCorrect ? '✓' : '✗'}</span>
                          <span>
                            {idx + 1}. {q.pergunta}
                          </span>
                        </p>
                        {!isCorrect && userOpt !== undefined && (
                          <p className="text-rose-900/90 dark:text-rose-300">
                            <strong>A sua resposta:</strong> {q.opcoes[userOpt]}
                          </p>
                        )}
                        <p className="text-slate-700 dark:text-slate-200">
                          <strong>Resposta correta:</strong> {q.opcoes[q.respostaCorreta]}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {q.explicacao}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 transition-colors shadow-xs"
                >
                  <RefreshCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Repetir Questionário</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Sensitization & Privacy Footer Note */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        Conteúdo de sensibilização. Confirme os procedimentos com o responsável de TIC do seu agrupamento. Esta atividade não recolhe nem guarda resultados ou dados pessoais.
      </p>
    </div>
  );
}
