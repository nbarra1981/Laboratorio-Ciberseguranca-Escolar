import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  RotateCw,
} from 'lucide-react';
import { DOMAIN_MAP, type FlashCard } from '../data/flashcardsData';
import type { LearningMode, SelfRating } from '../logic/flashcardEngine';
import { DomainIcon } from './DomainIcon';

interface FlashCardStageProps {
  card: FlashCard;
  isFlipped: boolean;
  mode: LearningMode;
  positionLabel: string;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  previousRating?: SelfRating;
  onFlip: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onRate?: (rating: SelfRating) => void;
}

const MODE_LABEL: Record<LearningMode, string> = {
  free: 'Estudo Livre',
  challenge: 'Modo Desafio · Recordação Ativa',
  quick10: 'Desafio Rápido · 10 Cartas',
  review: 'Revisão de Cartas com Dúvidas',
};

export function FlashCardStage({
  card,
  isFlipped,
  mode,
  positionLabel,
  canGoPrev = false,
  canGoNext = false,
  previousRating,
  onFlip,
  onPrev,
  onNext,
  onRate,
}: FlashCardStageProps) {
  const domain = DOMAIN_MAP[card.domainId];
  const isAssessmentMode = mode !== 'free';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3.5">
      {/* Subtle stage context line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {MODE_LABEL[mode]}
          </span>
          {previousRating && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 dark:text-slate-400">
                Estado anterior:{' '}
                <strong className="text-slate-800 dark:text-slate-100">
                  {previousRating === 'mastered'
                    ? 'Dominada'
                    : previousRating === 'unsure'
                      ? 'Com dúvidas'
                      : 'Para rever'}
                </strong>
              </span>
            </>
          )}
        </div>
        <span
          data-testid="card-position"
          className="font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums"
        >
          {positionLabel}
        </span>
      </div>

      {/* 3D Flip Card using CSS grid stacking so both faces share natural max height with zero clipping */}
      <div className="flashcard-perspective">
        <div
          className={`flashcard-inner grid ${isFlipped ? 'is-flipped' : ''}`}
        >
          {/* FRONT FACE */}
          <article
            aria-hidden={isFlipped}
            className={`flashcard-face col-start-1 row-start-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[290px] sm:min-h-[300px] ${
              isFlipped ? 'pointer-events-none' : ''
            }`}
          >
            <div>
              {/* Domain Header Band */}
              <div
                className={`px-5 sm:px-6 py-3 border-b ${domain.borderClass} ${domain.softBgClass} flex items-center justify-between gap-3`}
              >
                <div className={`flex items-center gap-2.5 ${domain.textClass}`}>
                  <DomainIcon iconName={domain.iconName} className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Domínio {domain.order} · {domain.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0">
                  Frente
                </span>
              </div>

              {/* Question Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-center">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Situação escolar ou pergunta
                </p>
                <h2 className="text-lg sm:text-2xl font-display font-semibold text-slate-900 dark:text-slate-50 leading-snug text-balance">
                  {card.question}
                </h2>
              </div>
            </div>

            {/* Front Footer Prompt */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {isAssessmentMode
                  ? 'Formula a tua resposta mentalmente antes de virar a carta.'
                  : 'Clica no botão para consultar a resposta e a recomendação prática.'}
              </p>
              <button
                type="button"
                onClick={onFlip}
                disabled={isFlipped}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-sky-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <RotateCw className="w-4 h-4" aria-hidden="true" />
                <span>Virar carta</span>
              </button>
            </div>
          </article>

          {/* BACK FACE */}
          <article
            aria-hidden={!isFlipped}
            className={`flashcard-face flashcard-face-back col-start-1 row-start-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[290px] sm:min-h-[300px] ${
              !isFlipped ? 'pointer-events-none' : ''
            }`}
          >
            <div>
              {/* Domain Header Band */}
              <div
                className={`px-5 sm:px-6 py-3 ${domain.colorClass} flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-2.5">
                  <DomainIcon iconName={domain.iconName} className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Domínio {domain.order} · {domain.shortName}
                  </span>
                </div>
                <span className="text-xs font-medium text-white/90 whitespace-nowrap shrink-0">
                  Verso · Resposta
                </span>
              </div>

              {/* Answer & Practical School Tip */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Explicação e procedimento correto
                  </p>
                  <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                    {card.answer}
                  </p>
                </div>

                <div
                  className={`rounded-xl border ${domain.borderClass} ${domain.softBgClass} p-3.5 sm:p-4`}
                >
                  <div className={`flex items-center gap-2 ${domain.textClass} mb-1`}>
                    <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <h3 className="text-sm font-bold">Na escola, lembra-te:</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {card.schoolTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Back Footer Flip-back */}
            <div className="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {isAssessmentMode
                  ? 'Avalia a tua recordação abaixo para continuar.'
                  : 'Podes voltar a ver a pergunta ou avançar para a carta seguinte.'}
              </span>
              <button
                type="button"
                onClick={onFlip}
                disabled={!isFlipped}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              >
                <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ver frente</span>
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Mode Controls Bar */}
      {mode === 'free' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canGoPrev}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Carta anterior</span>
          </button>

          <button
            type="button"
            onClick={onFlip}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <RotateCw className="w-4 h-4" aria-hidden="true" />
            <span>{isFlipped ? 'Ver pergunta' : 'Virar carta'}</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <span>Carta seguinte</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {!isFlipped ? (
            <div className="text-center py-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Vira a carta para desbloquear as opções de autoavaliação.
              </p>
            </div>
          ) : (
            <div
              role="group"
              aria-label="Autoavaliação da resposta"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <button
                type="button"
                onClick={() => onRate?.('forgot')}
                className="flex items-center justify-between sm:justify-center gap-2.5 min-h-[48px] px-4 py-3 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 font-semibold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
              >
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Não me lembrei</span>
                </span>
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/90 dark:bg-rose-900/80 border border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-100">
                  1
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => onRate?.('unsure')}
                className="flex items-center justify-between sm:justify-center gap-2.5 min-h-[48px] px-4 py-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              >
                <span className="inline-flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Com dúvidas</span>
                </span>
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/90 dark:bg-amber-900/80 border border-amber-200 dark:border-amber-700 text-amber-900 dark:text-amber-100">
                  2
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => onRate?.('mastered')}
                className="flex items-center justify-between sm:justify-center gap-2.5 min-h-[48px] px-4 py-3 rounded-xl border border-emerald-700 dark:border-emerald-600 bg-emerald-700 dark:bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              >
                <span className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Já domino!</span>
                </span>
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-800 dark:bg-emerald-700 border border-emerald-600 dark:border-emerald-500 text-emerald-50">
                  3
                </kbd>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyboard shortcuts subtle footer */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
        <span>
          Atalhos:{' '}
          <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
            Espaço
          </kbd>{' '}
          ou{' '}
          <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
            Enter
          </kbd>{' '}
          virar carta
        </span>
        {isAssessmentMode ? (
          <>
            <span aria-hidden="true">·</span>
            <span>
              <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
                1
              </kbd>{' '}
              Não me lembrei
            </span>
            <span>
              <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
                2
              </kbd>{' '}
              Com dúvidas
            </span>
            <span>
              <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
                3
              </kbd>{' '}
              Já domino!
            </span>
          </>
        ) : (
          <>
            <span aria-hidden="true">·</span>
            <span>
              <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
                ←
              </kbd>{' '}
              /{' '}
              <kbd className="font-mono px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200">
                →
              </kbd>{' '}
              navegar entre cartas
            </span>
          </>
        )}
      </div>
    </div>
  );
}
