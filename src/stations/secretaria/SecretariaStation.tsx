import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lock,
  Pause,
  Play,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  Square,
  Volume2,
} from 'lucide-react';
import type { StationComponentProps } from '../../core/types';
import { QUESTIONARIO_ESTACAO_2, SECRETARIA_ITEMS, type SecretaraItem } from './data/secretariaData';

type StationMode = 'explore' | 'challenge' | 'quiz';

export function SecretariaStation({ onBackToHub, onOpenHelp }: StationComponentProps) {
  const [mode, setMode] = useState<StationMode>('explore');
  const [selectedItem, setSelectedItem] = useState<SecretaraItem | null>(null);

  // Challenge state
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [showChallengeSolution, setShowChallengeSolution] = useState<boolean>(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // TTS Voice state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechStatus, setSpeechStatus] = useState<string>('');
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech on unmount or item change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedItem]);

  const handleSpeak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechStatus('Voz indisponível no navegador.');
      return;
    }

    const synth = window.speechSynthesis;

    if (isPlaying && isPaused) {
      synth.resume();
      setIsPaused(false);
      setSpeechStatus('A reproduzir...');
      return;
    }

    if (isPlaying) {
      synth.pause();
      setIsPaused(true);
      setSpeechStatus('Em pausa.');
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 0.95; // calm pace

    // Try finding a Portuguese voice
    const voices = synth.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang === 'pt-PT' || v.lang === 'pt_PT' || v.lang.startsWith('pt'),
    );
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setSpeechStatus('A reproduzir explicação em voz alta...');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpeechStatus('');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setSpeechStatus('Voz indisponível de momento. Leia o texto acima.');
    };

    speechUtteranceRef.current = utterance;
    synth.speak(utterance);
  }, [isPlaying, isPaused]);

  const handleStopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setSpeechStatus('');
  }, []);

  const handleSelectItem = useCallback((item: SecretaraItem) => {
    handleStopSpeech();
    setSelectedItem(item);
    if (mode === 'challenge' && !foundIds.includes(item.id)) {
      const nextFound = [...foundIds, item.id];
      setFoundIds(nextFound);
      if (nextFound.length === SECRETARIA_ITEMS.length) {
        setChallengeCompleted(true);
      }
    }
  }, [foundIds, handleStopSpeech, mode]);

  const handleResetChallenge = useCallback(() => {
    setFoundIds([]);
    setChallengeCompleted(false);
    setShowChallengeSolution(false);
    setSelectedItem(null);
  }, []);

  const handleShowSolution = useCallback(() => {
    setFoundIds(SECRETARIA_ITEMS.map((i) => i.id));
    setShowChallengeSolution(true);
    setChallengeCompleted(true);
  }, []);

  const handleAnswerQuiz = useCallback((questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }, [quizSubmitted]);

  const handleSubmitQuiz = useCallback(() => {
    let score = 0;
    for (const q of QUESTIONARIO_ESTACAO_2) {
      if (selectedAnswers[q.id] === q.respostaCorreta) {
        score += 1;
      }
    }
    setQuizScore(score);
    setQuizSubmitted(true);
  }, [selectedAnswers]);

  const handleResetQuiz = useCallback(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Station Title Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Estação 2 · Ciber-higiene e Proteção de Informação</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-slate-50">
            A Secretária do Professor
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
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
              setSelectedItem(null);
              handleStopSpeech();
            }}
            aria-pressed={mode === 'explore'}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
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
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
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
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
              mode === 'quiz'
                ? 'bg-sky-700 dark:bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/80'
            }`}
          >
            Avaliação (Quiz)
          </button>
        </div>
      </div>

      {/* Challenge Status Bar */}
      {mode === 'challenge' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-amber-950 dark:text-amber-200">
                Desafio: Encontra os {SECRETARIA_ITEMS.length} Riscos na Secretária
              </h2>
              <p className="text-xs text-amber-900/80 dark:text-amber-300/80">
                Clique diretamente sobre os 8 elementos de risco e pouca segurança presentes na imagem. ({foundIds.length} de {SECRETARIA_ITEMS.length} identificados)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetChallenge}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reiniciar</span>
            </button>
            <button
              type="button"
              onClick={handleShowSolution}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mostrar Solução</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      {mode !== 'quiz' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Image Container with Interactive Hotspots */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
            <div className="relative w-full aspect-[16/9] select-none">
              <img
                src="/public/assets/aistudio/Ciberseguran_a_Secret_ria_Professor_517dc663.png"
                alt="Secretária do professor com elementos interativos de cibersegurança"
                className="w-full h-full object-cover"
              />

              {/* Hotspot Markers */}
              {SECRETARIA_ITEMS.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isFound = foundIds.includes(item.id);
                const showMarker = mode === 'explore' || isFound || showChallengeSolution;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    aria-label={`Ponto ${item.number}: ${item.title}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${item.w}%`,
                      height: `${item.h}%`,
                    }}
                    className={`absolute rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-400 ${
                      isSelected
                        ? 'bg-sky-500/30 border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)] scale-[1.02] z-20'
                        : isFound
                        ? 'bg-emerald-500/25 border-2 border-emerald-400 hover:bg-emerald-500/40 z-10'
                        : showMarker
                        ? 'bg-rose-500/20 border-2 border-rose-500/80 hover:bg-rose-500/40 animate-pulse z-10'
                        : 'bg-transparent border border-transparent hover:bg-white/10 z-10'
                    }`}
                  >
                    <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-slate-900 border-2 border-white text-white text-xs font-mono font-bold flex items-center justify-center shadow-md">
                      {item.number}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Modo: {mode === 'explore' ? 'Exploração Livre' : 'Desafio Ativo'}</span>
              <span>Clique nos números ou zonas destacadas para inspecionar</span>
            </div>
          </div>

          {/* Right: Info Panel & Voice Explanation */}
          <div className="lg:col-span-5 space-y-4">
            {selectedItem ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 transition-colors">
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Elemento {selectedItem.number} de {SECRETARIA_ITEMS.length}</span>
                    </span>
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
                    aria-label="Fechar painel"
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Voice TTS player */}
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-900 dark:text-sky-300">
                      <Volume2 className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
                      <span>Explicação em Áudio</span>
                    </div>
                    {speechStatus && (
                      <span className="text-[11px] font-mono text-sky-800 dark:text-sky-300 animate-pulse">
                        {speechStatus}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{selectedItem.speechText}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSpeak(selectedItem.speechText)}
                      className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-xs font-semibold hover:bg-sky-800 transition-colors shadow-xs"
                    >
                      {isPlaying && !isPaused ? (
                        <>
                          <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Pausar voz</span>
                        </>
                      ) : isPlaying && isPaused ? (
                        <>
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Retomar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Ouvir explicação</span>
                        </>
                      )}
                    </button>

                    {isPlaying && (
                      <button
                        type="button"
                        onClick={handleStopSpeech}
                        className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        <Square className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Parar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Risk and Consequences */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-1">
                    <p className="font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" aria-hidden="true" />
                      <span>Risco Associado:</span>
                    </p>
                    <p className="text-rose-900/90 dark:text-rose-300 leading-relaxed">
                      {selectedItem.risk}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1">
                    <p className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                      <span>Possíveis Consequências:</span>
                    </p>
                    <p className="text-amber-900/90 dark:text-amber-300 leading-relaxed">
                      {selectedItem.consequences}
                    </p>
                  </div>

                  {/* Best Practices */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                    <p className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Boas Práticas e Recomendações:</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-emerald-900/90 dark:text-emerald-300">
                      {selectedItem.bestPractices.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools */}
                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0" aria-hidden="true" />
                      <span>Ferramentas e Tecnologias:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-50">
                  Selecione um elemento na imagem
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Clique em qualquer um dos 8 marcadores numerados na imagem para consultar o risco de cibersegurança, as consequências e ouvir a explicação em voz alta.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                Avaliação de Conhecimentos · Estação 2
              </span>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-slate-50 mt-0.5">
                Questionário de Ciber-higiene e Proteção de Dados
              </h2>
            </div>
            {!quizSubmitted && (
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                Pergunta {currentQuizIndex + 1} de {QUESTIONARIO_ESTACAO_2.length}
              </span>
            )}
          </div>

          {!quizSubmitted ? (
            <div className="space-y-6">
              {(() => {
                const q = QUESTIONARIO_ESTACAO_2[currentQuizIndex];
                const currentAnswer = selectedAnswers[q.id];

                return (
                  <div className="space-y-4">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                      {currentQuizIndex + 1}. {q.pergunta}
                    </p>

                    <div className="space-y-2.5">
                      {q.opcoes.map((opcao, optIdx) => {
                        const isSelected = currentAnswer === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleAnswerQuiz(q.id, optIdx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm transition-colors flex items-start gap-3 ${
                              isSelected
                                ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-950 dark:text-sky-200 font-medium'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                isSelected
                                  ? 'bg-sky-700 border-sky-700 text-white'
                                  : 'border-slate-300 dark:border-slate-600 text-slate-500'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opcao}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentQuizIndex === 0}
                  onClick={() => setCurrentQuizIndex((idx) => Math.max(0, idx - 1))}
                  className="min-h-[40px] px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Anterior
                </button>

                {currentQuizIndex < QUESTIONARIO_ESTACAO_2.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuizIndex((idx) => Math.min(QUESTIONARIO_ESTACAO_2.length - 1, idx + 1))}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-5 py-2 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 transition-colors"
                  >
                    <span>Seguinte</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-6 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>Submeter Respostas</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Results Summary */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50">
                  Resultados da Avaliação
                </h3>
                <p className="text-3xl font-display font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {quizScore} / {QUESTIONARIO_ESTACAO_2.length} corretas ({Math.round((quizScore / QUESTIONARIO_ESTACAO_2.length) * 100)}%)
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {quizScore >= 8
                    ? 'Excelente desempenho! Demonstrou sólidos conhecimentos em cibersegurança e proteção de dados em ambiente escolar.'
                    : quizScore >= 5
                    ? 'Bom trabalho! Reveja os pontos em que teve dúvidas para consolidar ainda mais as boas práticas na secretária.'
                    : 'Recomendamos uma nova ronda de exploração na secretária e a leitura atenta das recomendações de segurança.'}
                </p>
              </div>

              {/* Detailed review list */}
              <div className="text-left space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-display font-bold text-slate-900 dark:text-slate-50">
                  Correção detalhada:
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {QUESTIONARIO_ESTACAO_2.map((q) => {
                    const userOpt = selectedAnswers[q.id];
                    const isCorrect = userOpt === q.respostaCorreta;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                          isCorrect
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                            : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
                        }`}
                      >
                        <p className="font-semibold flex items-center gap-2">
                          <span>{isCorrect ? '✓' : '✗'}</span>
                          <span>{q.pergunta}</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          <strong>Resposta correta:</strong> {q.opcoes[q.respostaCorreta]}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          {q.explicacao}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 transition-colors shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Repetir Questionário</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
