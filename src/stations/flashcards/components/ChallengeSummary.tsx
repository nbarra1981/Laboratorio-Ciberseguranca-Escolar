import { ArrowLeft, Award, BookOpenCheck, RotateCcw } from 'lucide-react';
import { DOMAIN_MAP } from '../data/flashcardsData';
import type { ChallengeSummaryData } from '../logic/flashcardEngine';
import { DomainIcon } from './DomainIcon';

interface ChallengeSummaryProps {
  summary: ChallengeSummaryData;
  onReviewWeakCards: () => void;
  onStartNewChallenge: () => void;
  onBackToHub: () => void;
}

function formatDurationText(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min ${secs} s`;
}

export function ChallengeSummary({
  summary,
  onReviewWeakCards,
  onStartNewChallenge,
  onBackToHub,
}: ChallengeSummaryProps) {
  const hasWeakCards = summary.weakCardIds.length > 0;

  return (
    <section
      aria-label="Resumo final do desafio"
      className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors"
    >
      {/* Positive Pedagogical Header */}
      <div className="bg-sky-50 dark:bg-sky-950/50 border-b border-sky-200 dark:border-sky-800/80 px-6 sm:px-8 py-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-700 dark:bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-sky-800 dark:text-sky-300 mb-1">
              {summary.mode === 'quick10'
                ? 'Resumo Final · Desafio Rápido de 10'
                : summary.mode === 'review'
                  ? 'Resumo Final · Ciclo de Revisão'
                  : 'Resumo Final · Modo Desafio'}
            </p>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50">
              {summary.feedbackTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
              {summary.feedbackMessage}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Global metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Cartas reveladas
            </p>
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
              {summary.totalFlips}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
              {summary.uniqueRevealedCount} únicas · {summary.totalAttempts} avaliações
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80">
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
              Já domino
            </p>
            <p className="text-2xl font-display font-bold text-emerald-900 dark:text-emerald-100 tabular-nums mt-1">
              {summary.masteredCount}
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 tabular-nums mt-0.5">
              {summary.performancePercentage}% de domínio
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">
              Para rever
            </p>
            <p className="text-2xl font-display font-bold text-amber-950 dark:text-amber-100 tabular-nums mt-1">
              {summary.toReviewCount}
            </p>
            <p className="text-[11px] text-amber-900 dark:text-amber-300 tabular-nums mt-0.5">
              {summary.unsureCount} dúvidas · {summary.forgotCount} não lembradas
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Tempo da sessão
            </p>
            <p className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1">
              {formatDurationText(summary.durationSeconds)}
            </p>
          </div>
        </div>

        {/* Breakdown by domain */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Distribuição dos resultados por domínio
          </h3>
          <div className="space-y-3">
            {summary.byDomain.map((d) => {
              const info = DOMAIN_MAP[d.domainId];
              return (
                <div
                  key={d.domainId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={info.textClass}>
                        <DomainIcon iconName={info.iconName} className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {d.domainName}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {d.revealed} / {d.total} reveladas ({d.mastered} dominadas · {d.toReview} rever)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${info.barClass} transition-all duration-300`}
                      style={{ width: `${d.masteredPercentage}%` }}
                    />
                    {d.toReview > 0 && d.total > 0 && (
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100 - d.masteredPercentage,
                            Math.round((d.toReview / d.total) * 100),
                          )}%`,
                        }}
                      />
                    )}
                    {d.revealed > d.worked && d.total > 0 && (
                      <div
                        className="h-full bg-sky-400 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100 - d.masteredPercentage - Math.round((d.toReview / d.total) * 100),
                            Math.round(((d.revealed - d.worked) / d.total) * 100),
                          )}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Areas needing attention (constructive & encouraging) */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
          <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-200 mb-1.5">
            Áreas a rever
          </h3>
          {summary.areasForReview.length > 0 ? (
            <div className="space-y-1.5 text-sm text-amber-900 dark:text-amber-300">
              <p>
                Durante esta sessão, marcaste{' '}
                <strong>{summary.weakCardIds.length}</strong>{' '}
                {summary.weakCardIds.length === 1 ? 'carta' : 'cartas'} como «Com dúvidas» ou «Não me lembrei» nos seguintes domínios:
              </p>
              <ul className="list-disc pl-5 space-y-0.5">
                {summary.areasForReview.map((area) => (
                  <li key={area.domainId}>{area.domainName}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-amber-900 dark:text-amber-300">
              Conseguiste responder com segurança a todas as cartas trabalhadas sem hesitações registadas. Excelente consolidação!
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Regressar ao Laboratório</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {hasWeakCards && (
              <button
                type="button"
                onClick={onReviewWeakCards}
                title="Inclui cartas marcadas «Com dúvidas» e «Não me lembrei»"
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-sm font-semibold text-amber-950 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              >
                <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
                <span>Rever cartas ({summary.weakCardIds.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartNewChallenge}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Iniciar novo desafio</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
