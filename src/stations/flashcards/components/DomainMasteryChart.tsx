import { BarChart3 } from 'lucide-react';
import { DOMAIN_MAP, type DomainId } from '../data/flashcardsData';
import type { DomainMasteryBarItem } from '../logic/flashcardEngine';
import { DomainIcon } from './DomainIcon';

interface DomainMasteryChartProps {
  items: DomainMasteryBarItem[];
}

const COMPACT_CHART_LABEL: Record<DomainId, { mobile: string; desktop: string }> = {
  autenticacao: { mobile: 'Aut.', desktop: 'Autenticação' },
  'engenharia-social': { mobile: 'Eng.', desktop: 'Eng. Social' },
  privacidade: { mobile: 'Priv.', desktop: 'Privacidade' },
  'equipamentos-redes': { mobile: 'Equip.', desktop: 'Equipamentos' },
  'informacao-incidentes': { mobile: 'Incid.', desktop: 'Incidentes' },
};

export function DomainMasteryChart({ items }: DomainMasteryChartProps) {
  const maxTotal = Math.max(1, ...items.map((d) => d.total));
  const midTick = Math.ceil(maxTotal / 2);

  return (
    <section
      data-testid="domain-mastery-chart"
      aria-label="Gráfico de barras por domínio: cartas dominadas versus total de cartas"
      className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2"
    >
      {/* Header & inline legend */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
          <BarChart3
            className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400 shrink-0"
            aria-hidden="true"
          />
          <h3>Gráfico por domínio: Dominadas vs. Total de cartas</h3>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 dark:bg-emerald-500 inline-block shrink-0"
              aria-hidden="true"
            />
            <span>Dominadas</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-slate-300 dark:bg-slate-600 inline-block shrink-0"
              aria-hidden="true"
            />
            <span>Total de cartas</span>
          </span>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="flex items-stretch gap-2">
        {/* Y-axis scale ticks */}
        <div
          aria-hidden="true"
          className="flex flex-col justify-between items-end h-28 sm:h-32 pb-0.5 pr-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums select-none shrink-0"
        >
          <span>{maxTotal}</span>
          {maxTotal > 1 && <span>{midTick}</span>}
          <span>0</span>
        </div>

        {/* Plot area + X-axis labels */}
        <div className="flex-1 min-w-0">
          <div className="relative h-28 sm:h-32 border-b border-slate-300 dark:border-slate-600">
            {/* Horizontal dashed guide lines */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col justify-between pointer-events-none"
            >
              <div className="border-t border-dashed border-slate-200 dark:border-slate-700/80 w-full" />
              {maxTotal > 1 && (
                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/80 w-full" />
              )}
              <div className="h-0" />
            </div>

            {/* 5 domain bar groups */}
            <div className="relative z-10 grid grid-cols-5 gap-1.5 sm:gap-3 h-full items-end px-0.5 sm:px-1.5">
              {items.map((item) => {
                const masteredHeightPct =
                  item.mastered > 0
                    ? Math.max(8, Math.round((item.mastered / maxTotal) * 100))
                    : 0;
                const totalHeightPct =
                  item.total > 0
                    ? Math.max(8, Math.round((item.total / maxTotal) * 100))
                    : 0;

                return (
                  <div
                    key={item.domainId}
                    data-testid={`chart-domain-${item.domainId}`}
                    aria-label={`${item.domainName}: ${item.mastered} dominadas de ${item.total} cartas (${item.percentage}%)`}
                    title={`${item.domainName}: ${item.mastered} dominadas / ${item.total} cartas (${item.percentage}%)`}
                    className="h-full flex items-end justify-center gap-1 sm:gap-1.5"
                  >
                    {/* Dominadas bar */}
                    <div className="h-full flex flex-col items-center justify-end w-3.5 sm:w-5">
                      <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums leading-none mb-0.5">
                        {item.mastered}
                      </span>
                      <div
                        className={`w-full rounded-t-[3px] transition-all duration-300 ease-out ${
                          item.mastered > 0
                            ? 'bg-emerald-600 dark:bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-800 h-[2px]'
                        }`}
                        style={
                          item.mastered > 0
                            ? { height: `${Math.min(82, masteredHeightPct * 0.82)}%` }
                            : undefined
                        }
                      />
                    </div>

                    {/* Total bar */}
                    <div className="h-full flex flex-col items-center justify-end w-3.5 sm:w-5">
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 tabular-nums leading-none mb-0.5">
                        {item.total}
                      </span>
                      <div
                        className={`w-full rounded-t-[3px] transition-all duration-300 ease-out ${
                          item.total > 0
                            ? 'bg-slate-300 dark:bg-slate-600'
                            : 'bg-slate-200 dark:bg-slate-800 h-[2px]'
                        }`}
                        style={
                          item.total > 0
                            ? { height: `${Math.min(82, totalHeightPct * 0.82)}%` }
                            : undefined
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis domain labels + ratio */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 pt-1.5 px-0.5 sm:px-1.5">
            {items.map((item) => {
              const info = DOMAIN_MAP[item.domainId];
              const labels = COMPACT_CHART_LABEL[item.domainId];
              return (
                <div
                  key={item.domainId}
                  className="flex flex-col items-center text-center min-w-0"
                >
                  <div className="flex items-center justify-center gap-1 min-w-0 max-w-full">
                    <span className={`${info.textClass} shrink-0`}>
                      <DomainIcon iconName={info.iconName} className="w-3 h-3" />
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate">
                      <span className="sm:hidden">{labels.mobile}</span>
                      <span className="hidden sm:inline">{labels.desktop}</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {item.mastered}/{item.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
