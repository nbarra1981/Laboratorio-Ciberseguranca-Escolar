import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Lock,
  MonitorCheck,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { stationsRegistry } from '../core/stationsRegistry';
import type { StationId } from '../core/types';
import { FLASHCARDS_DECK } from '../stations/flashcards/data/flashcardsData';

interface LabHubProps {
  masteredCount: number;
  hasSavedProgress: boolean;
  onSelectStation: (stationId: StationId) => void;
  onClearProgress: () => void;
}

export function LabHub({
  masteredCount,
  hasSavedProgress,
  onSelectStation,
  onClearProgress,
}: LabHubProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const activeCount = stationsRegistry.filter((s) => s.status === 'active').length;
  const upcomingCount = stationsRegistry.length - activeCount;

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-colors">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-sky-800 dark:text-sky-400">
              Ambiente Educativo Modular · Segurança Digital Escolar
            </p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-slate-50 leading-tight text-balance">
              Laboratório de Informática
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Espaço interativo de aprendizagem prática para consolidar competências fundamentais de literacia digital e cibersegurança nas escolas. Cada estação propõe uma atividade focada em situações reais do dia a dia escolar.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectStation('estacao-1-flashcards')}
                className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-sky-700 dark:bg-sky-600 text-white text-sm sm:text-base font-semibold hover:bg-sky-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <span>Abrir Estação 1 — FlashCards</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              {hasSavedProgress && (
                <button
                  type="button"
                  onClick={onClearProgress}
                  className="inline-flex items-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-800 dark:hover:text-rose-300 hover:border-rose-200 dark:hover:border-rose-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Limpar progresso</span>
                </button>
              )}
            </div>

            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 tabular-nums">
              Estação 1 · {masteredCount} / {FLASHCARDS_DECK.length} cartas dominadas
            </p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-xs flex">
          {!imageFailed ? (
            <img
              src="/src/assets/images/lab_informatica_hero_1795273882491.jpg"
              alt="Ilustração de um laboratório de informática escolar com ecrãs sobre cibersegurança"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="w-full h-64 lg:h-full object-cover dark:brightness-90 dark:contrast-105"
            />
          ) : (
            <div className="w-full h-64 lg:h-full bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950 flex flex-col items-center justify-center p-6 text-center">
              <ShieldCheck className="w-12 h-12 text-sky-700 dark:text-sky-400 mb-3" aria-hidden="true" />
              <p className="font-display font-bold text-slate-900 dark:text-slate-50">
                Estações de Aprendizagem Digital
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Cibersegurança prática em ambiente escolar
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stations Registry Grid */}
      <section id="estacoes" aria-labelledby="estacoes-heading" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="estacoes-heading"
              className="text-2xl font-display font-bold text-slate-900 dark:text-slate-50"
            >
              Estações de Aprendizagem
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Seleciona a estação ativa para começar a trabalhar ou consulta as próximas estações previstas para o laboratório.
            </p>
          </div>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
            {activeCount} {activeCount === 1 ? 'estação ativa' : 'estações ativas'} · {upcomingCount} em preparação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stationsRegistry.map((station) => {
            const isActive = station.status === 'active';
            return (
              <article
                key={station.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-800/80 shadow-xs'
                    : 'bg-slate-100/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="space-y-3">
                  {/* Metadata inline line — zero pill enclosures */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        isActive
                          ? 'text-sky-800 dark:text-sky-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isActive
                        ? `Estação ${station.number}`
                        : `Estação ${station.number} · Próxima estação em breve`}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      {station.estimatedTime}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-display font-bold ${
                      isActive
                        ? 'text-slate-900 dark:text-slate-50'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {station.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {station.description}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    Temas: {station.topics.join(' · ')}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {station.methodology}
                  </span>

                  {isActive ? (
                    <button
                      type="button"
                      onClick={() => onSelectStation(station.id)}
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-sky-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400"
                    >
                      <span>Entrar na estação</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap shrink-0">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Próxima estação em breve</span>
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Methodology & Privacy Principles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          id="metodologia"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2.5 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-50">
            <BookOpen className="w-5 h-5 text-sky-700 dark:text-sky-400" aria-hidden="true" />
            <h2 className="text-lg font-display font-bold">
              Recordação ativa e repetição orientada
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Em vez de leitura passiva, as cartas convidam o formando a analisar cenários concretos do contexto escolar, formular uma resposta mental e autoavaliar o seu grau de confiança para reforçar os pontos com mais dúvidas.
          </p>
        </div>

        <div
          id="privacidade"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2.5 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-50">
            <Lock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <h2 className="text-lg font-display font-bold">
              Execução 100% local e privada
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Todo o conteúdo e lógica funcionam diretamente no navegador, sem necessidade de ligação à Internet, sem registo de utilizadores, sem modelos de IA externos e sem recolha de dados pessoais.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
            <MonitorCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <span>Compatível com computadores, portáteis, tablets e projeção em sala.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
