import { useEffect, useRef } from 'react';
import { BarChart3, X } from 'lucide-react';
import type {
  DomainFilter,
  DomainMasteryBarItem,
  LearningMode,
  ProgressStats,
} from '../logic/flashcardEngine';
import { ProgressPanel } from './ProgressPanel';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ProgressStats;
  domainChartData: DomainMasteryBarItem[];
  domainFilter: DomainFilter;
  mode: LearningMode;
  totalFlips: number;
  totalInteractions?: number;
  quick10AnsweredCount?: number;
  quick10Total?: number;
  elapsedSeconds?: number;
}

export function StatsModal({
  isOpen,
  onClose,
  stats,
  domainChartData,
  domainFilter,
  mode,
  totalFlips,
  totalInteractions = 0,
  quick10AnsweredCount = 0,
  quick10Total = 10,
  elapsedSeconds = 0,
}: StatsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    closeButtonRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
      data-testid="stats-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2
              id="stats-modal-title"
              className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-slate-50 truncate"
            >
              Estatísticas e progresso
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar estatísticas"
            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <ProgressPanel
            embedded
            stats={stats}
            domainChartData={domainChartData}
            domainFilter={domainFilter}
            mode={mode}
            totalFlips={totalFlips}
            totalInteractions={totalInteractions}
            quick10AnsweredCount={quick10AnsweredCount}
            quick10Total={quick10Total}
            elapsedSeconds={elapsedSeconds}
          />
        </div>

        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] px-5 py-2 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
