import { BarChart3, BookOpenCheck, Flag, RotateCcw, Trash2 } from 'lucide-react';
import { DOMAINS, FLASHCARDS_DECK } from '../data/flashcardsData';
import type { DomainFilter, LearningMode } from '../logic/flashcardEngine';

interface StationConfigBarProps {
  domainFilter: DomainFilter;
  mode: LearningMode;
  hasSavedProgress: boolean;
  toReviewCount: number;
  canFinishEarly: boolean;
  onDomainChange: (domain: DomainFilter) => void;
  onModeChange: (mode: Exclude<LearningMode, 'review'>) => void;
  onStartReview: () => void;
  onFinishEarly: () => void;
  onOpenStats: () => void;
  onRestartSession: () => void;
  onClearProgress: () => void;
}

const MODES: { id: Exclude<LearningMode, 'review'>; label: string }[] = [
  { id: 'free', label: 'Estudo Livre' },
  { id: 'challenge', label: 'Modo Desafio' },
  { id: 'quick10', label: 'Desafio Rápido de 10' },
];

export function StationConfigBar({
  domainFilter,
  mode,
  hasSavedProgress,
  toReviewCount,
  canFinishEarly,
  onDomainChange,
  onModeChange,
  onStartReview,
  onFinishEarly,
  onOpenStats,
  onRestartSession,
  onClearProgress,
}: StationConfigBarProps) {
  return (
    <section
      aria-label="Configuração do estudo"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3 transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5">
        {/* Domain selector */}
        <div className="flex-1 min-w-[260px]">
          <label
            htmlFor="domain-select"
            className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5"
          >
            Domínio de cibersegurança
          </label>
          <select
            id="domain-select"
            value={domainFilter}
            onChange={(e) => onDomainChange(e.target.value as DomainFilter)}
            className="w-full min-h-[42px] rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400"
          >
            <option value="all">
              Todos os domínios ({FLASHCARDS_DECK.length} cartas)
            </option>
            {DOMAINS.map((domain) => {
              const count = FLASHCARDS_DECK.filter(
                (card) => card.domainId === domain.id,
              ).length;
              return (
                <option key={domain.id} value={domain.id}>
                  {domain.order}. {domain.name} ({count} cartas)
                </option>
              );
            })}
          </select>
        </div>

        {/* Mode selector */}
        <div className="shrink-0">
          <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Modo de aprendizagem
          </span>
          <div
            role="group"
            aria-label="Selecionar modo de aprendizagem"
            className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            {MODES.map((m) => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onModeChange(m.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400 ${
                    isActive
                      ? 'bg-sky-700 dark:bg-sky-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700/70'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Utility, Statistics and Review actions bar */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {toReviewCount > 0 && mode !== 'review' && (
            <button
              type="button"
              onClick={onStartReview}
              title="Rever cartas marcadas «Com dúvidas» e «Não me lembrei»"
              className="inline-flex items-center gap-2 min-h-[38px] px-3.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-200 whitespace-nowrap shrink-0 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
              <span>Rever cartas ({toReviewCount})</span>
            </button>
          )}
          {canFinishEarly && (
            <button
              type="button"
              onClick={onFinishEarly}
              className="inline-flex items-center gap-2 min-h-[38px] px-3.5 py-1.5 rounded-lg border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/60 text-xs sm:text-sm font-semibold text-sky-900 dark:text-sky-200 whitespace-nowrap shrink-0 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <Flag className="w-4 h-4" aria-hidden="true" />
              <span>Ver resumo</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            type="button"
            data-testid="open-stats-button"
            onClick={onOpenStats}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg border border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/60 text-xs sm:text-sm font-semibold text-sky-900 dark:text-sky-200 whitespace-nowrap shrink-0 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400"
          >
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            <span>Ver Estatísticas</span>
          </button>
          {mode !== 'free' && (
            <button
              type="button"
              onClick={onRestartSession}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reiniciar</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClearProgress}
            disabled={!hasSavedProgress}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-800 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-800 disabled:opacity-45 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Limpar progresso</span>
          </button>
        </div>
      </div>
    </section>
  );
}
