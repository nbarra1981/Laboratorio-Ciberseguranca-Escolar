import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DOMAIN_MAP, type DomainId } from '../data/flashcardsData';
import type { DomainMasteryBarItem } from '../logic/flashcardEngine';
import { DomainIcon } from './DomainIcon';

interface DashboardStatsProps {
  items: DomainMasteryBarItem[];
}

const COMPACT_CHART_LABEL: Record<DomainId, string> = {
  autenticacao: 'Autenticação',
  'engenharia-social': 'Eng. Social',
  privacidade: 'Privacidade',
  'equipamentos-redes': 'Equipamentos',
  'informacao-incidentes': 'Incidentes',
};

export function DashboardStats({ items }: DashboardStatsProps) {
  const chartData = items.map((item) => ({
    name: COMPACT_CHART_LABEL[item.domainId] ?? item.shortName,
    fullName: item.domainName,
    domainId: item.domainId,
    Dominadas: item.mastered,
    'Total de cartas': item.total,
    percentage: item.percentage,
  }));

  return (
    <section
      data-testid="dashboard-stats-chart"
      aria-label="Dashboard de estatísticas: cartas dominadas versus total de cartas por domínio"
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-slate-50">
              Desempenho por Domínio de Cibersegurança
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Comparação visual entre cartas dominadas e o total de cartas em cada domínio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-[3px] bg-emerald-600 dark:bg-emerald-500 inline-block shrink-0"
              aria-hidden="true"
            />
            <span>Dominadas</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-[3px] bg-slate-300 dark:bg-slate-600 inline-block shrink-0"
              aria-hidden="true"
            />
            <span>Total de cartas</span>
          </span>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700/60"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              className="text-slate-600 dark:text-slate-400 text-[11px]"
              tickLine={false}
              axisLine={{ stroke: 'currentColor', className: 'text-slate-300 dark:text-slate-700' }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={35}
            />
            <YAxis
              stroke="currentColor"
              className="text-slate-600 dark:text-slate-400 text-[11px]"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, 'dataMax + 1']}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) {
                  return null;
                }
                const data = payload[0].payload;
                const info = DOMAIN_MAP[data.domainId as DomainId];
                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-lg space-y-1.5 text-xs">
                    <p className="font-display font-bold text-slate-900 dark:text-slate-50">
                      {data.fullName}
                    </p>
                    <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between gap-4">
                        <span>Cartas dominadas:</span>
                        <span className="font-mono tabular-nums">{data.Dominadas}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-medium flex items-center justify-between gap-4">
                        <span>Total no domínio:</span>
                        <span className="font-mono tabular-nums">{data['Total de cartas']}</span>
                      </p>
                      <p className="text-sky-700 dark:text-sky-400 font-semibold flex items-center justify-between gap-4">
                        <span>Taxa de domínio:</span>
                        <span className="font-mono tabular-nums">{data.percentage}%</span>
                      </p>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="Dominadas"
              fill="#059669"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="Total de cartas"
              fill="#cbd5e1"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Domain legend breakdown list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
        {items.map((item) => {
          const info = DOMAIN_MAP[item.domainId];
          return (
            <div
              key={item.domainId}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`${info.textClass} shrink-0`}>
                  <DomainIcon iconName={info.iconName} className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {COMPACT_CHART_LABEL[item.domainId]}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono font-semibold tabular-nums">
                <span className="text-emerald-700 dark:text-emerald-400">
                  {item.mastered} dominadas
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  / {item.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
