import { CheckCircle2, Clock3, Eye, Layers, RefreshCw } from 'lucide-react';
import { DOMAIN_MAP } from '../data/flashcardsData';
import type {
  DomainFilter,
  DomainMasteryBarItem,
  LearningMode,
  ProgressStats,
} from '../logic/flashcardEngine';
import { DomainIcon } from './DomainIcon';
import { DomainMasteryChart } from './DomainMasteryChart';

interface ProgressPanelProps {
  stats: ProgressStats;
  domainChartData: DomainMasteryBarItem[];
  domainFilter: DomainFilter;
  mode: LearningMode;
  totalFlips: number;
  totalInteractions?: number;
  quick10AnsweredCount?: number;
  quick10Total?: number;
  elapsedSeconds?: number;
  embedded?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const COMPACT_DOMAIN_NAME: Record<string, string> = {
  autenticacao: 'Autenticação',
  'engenharia-social': 'Eng. Social',
  privacidade: 'Privacidade',
  'equipamentos-redes': 'Equipamentos',
  'informacao-incidentes': 'Incidentes',
};

export function ProgressPanel({
  stats,
  domainChartData,
  domainFilter,
  mode,
  totalFlips,
  totalInteractions = 0,
  quick10AnsweredCount = 0,
  quick10Total = 10,
  elapsedSeconds = 0,
  embedded = false,
}: ProgressPanelProps) {
  const activeDomainName =
    domainFilter === 'all' ? 'Todos os domínios' : DOMAIN_MAP[domainFilter].name;

  const isQuick10 = mode === 'quick10';
  const totalDenominator = isQuick10 ? quick10Total : stats.totalSelected;

  const barRevealedPercentage = isQuick10
    ? totalDenominator === 0
      ? 0
      : Math.round((quick10AnsweredCount / totalDenominator) * 100)
    : stats.revealedPercentage;

  const masteredSegmentWidth =
    totalDenominator === 0
      ? 0
      : Math.min(100, Math.round((stats.masteredCount / totalDenominator) * 100));

  const reviewSegmentWidth =
    totalDenominator === 0
      ? 0
      : Math.min(
          100 - masteredSegmentWidth,
          Math.round((stats.toReviewCount / totalDenominator) * 100),
        );

  const revealedPendingSegmentWidth = Math.max(
    0,
    Math.min(
      100 - masteredSegmentWidth - reviewSegmentWidth,
      barRevealedPercentage - masteredSegmentWidth - reviewSegmentWidth,
    ),
  );

  return (
    <aside
      aria-label="Painel de progresso e estatísticas"
      className={
        embedded
          ? 'space-y-4'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3 transition-colors'
      }
    >
      {/* Top summary row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p
            data-testid="flipped-counter"
            className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-slate-50 tabular-nums"
          >
            Cartas reveladas: {totalFlips}
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-2">
              ({stats.revealedUniqueCount} / {stats.totalSelected} únicas)
            </span>
          </p>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Domínio:{' '}
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {activeDomainName}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 tabular-nums">
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2
              className="w-4 h-4 text-emerald-700 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span>
              Já domino:{' '}
              <strong className="text-slate-900 dark:text-slate-50">{stats.masteredCount}</strong>
            </span>
          </div>
          <div
            className="inline-flex items-center gap-1.5"
            title={`Com dúvidas: ${stats.unsureCount} · Não me lembrei: ${stats.forgotCount}`}
          >
            <RefreshCw
              className="w-4 h-4 text-amber-700 dark:text-amber-400"
              aria-hidden="true"
            />
            <span>
              Para rever:{' '}
              <strong className="text-slate-900 dark:text-slate-50">{stats.toReviewCount}</strong>
              {stats.toReviewCount > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  ({stats.unsureCount} dúvidas · {stats.forgotCount} não lembradas)
                </span>
              )}
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Layers
              className="w-4 h-4 text-slate-500 dark:text-slate-400"
              aria-hidden="true"
            />
            <span>
              Por revelar:{' '}
              <strong className="text-slate-900 dark:text-slate-50">{stats.unseenCount}</strong>
            </span>
          </div>
          {mode !== 'free' && (
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
              Interações:{' '}
              <strong className="text-slate-900 dark:text-slate-50">{totalInteractions}</strong>
            </span>
          )}
          {isQuick10 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
              <Clock3 className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
              <span>Tempo: {formatDuration(elapsedSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main stacked progress bar: counts ALL revealed cards regardless of final state */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 mb-1 tabular-nums">
          <span>
            {isQuick10
              ? `Progresso no Desafio Rápido: ${quick10AnsweredCount} / ${quick10Total} respondidas`
              : `Totalidade de cartas reveladas: ${stats.revealedUniqueCount} / ${stats.totalSelected}`}
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              <Eye className="w-3 h-3 text-sky-700 dark:text-sky-400" aria-hidden="true" />
              <span>Dominadas: {stats.masteredCount}</span>
              <span aria-hidden="true">·</span>
              <span>Rever: {stats.toReviewCount}</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {barRevealedPercentage}%
            </span>
          </div>
        </div>
        <div
          role="progressbar"
          aria-valuenow={barRevealedPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso total de cartas reveladas"
          className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700 flex"
        >
          {masteredSegmentWidth > 0 && (
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${masteredSegmentWidth}%` }}
            />
          )}
          {reviewSegmentWidth > 0 && (
            <div
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${reviewSegmentWidth}%` }}
            />
          )}
          {revealedPendingSegmentWidth > 0 && (
            <div
              className="h-full bg-sky-500 transition-all duration-300 ease-out"
              style={{ width: `${revealedPendingSegmentWidth}%` }}
            />
          )}
        </div>
      </div>

      {/* Per-domain breakdown: shows ALL revealed cards per domain regardless of final state */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {stats.byDomain.map((d) => {
          const info = DOMAIN_MAP[d.domainId];
          return (
            <div
              key={d.domainId}
              title={`${d.domainName}: ${d.revealed} reveladas (${d.mastered} dominadas, ${d.toReview} para rever)`}
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`${info.textClass} shrink-0`}>
                  <DomainIcon iconName={info.iconName} className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {COMPACT_DOMAIN_NAME[d.domainId] ?? d.shortName}
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-50 tabular-nums shrink-0">
                {d.revealed}/{d.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bar chart: mastered vs. total flashcards separated by each of the 5 domains */}
      <DomainMasteryChart items={domainChartData} />
    </aside>
  );
}
