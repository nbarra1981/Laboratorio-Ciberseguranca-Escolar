import { ArrowLeft, CircleHelp, Moon, ShieldCheck, Sun } from 'lucide-react';
import type { ThemeMode } from '../core/theme';
import type { StationDefinition } from '../core/types';

interface LabHeaderProps {
  activeStation?: StationDefinition;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onBackToHub: () => void;
  onOpenHelp: () => void;
}

export function LabHeader({
  activeStation,
  theme,
  onToggleTheme,
  onBackToHub,
  onOpenHelp,
}: LabHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 min-h-14 py-2 sm:py-0 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink sm:shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-700 dark:bg-sky-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-xs sm:text-base lg:text-lg leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:whitespace-nowrap">
            Laboratório de Cibersegurança Escolar
          </span>
        </div>

        {/* Zone 2: Station identification or hub links */}
        {activeStation ? (
          <div className="hidden lg:flex items-center min-w-0">
            <span className="text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
              {activeStation.subtitle}
            </span>
          </div>
        ) : (
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#estacoes"
              className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Estações
            </a>
            <a
              href="#metodologia"
              className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Metodologia
            </a>
            <a
              href="#privacidade"
              className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Privacidade
            </a>
          </nav>
        )}

        {/* Zone 3: Actions & Theme Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {activeStation && (
            <button
              type="button"
              onClick={onBackToHub}
              aria-label="Regressar ao Painel Principal"
              className="inline-flex items-center gap-1 sm:gap-1.5 min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap shrink-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              <span className="sm:hidden">Painel</span>
              <span className="hidden sm:inline">Painel Principal</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            data-testid="theme-toggle"
            className="inline-flex items-center justify-center w-[38px] sm:w-[40px] min-h-[38px] sm:min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="Como funciona"
            className="inline-flex items-center gap-1 sm:gap-1.5 min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-slate-900 dark:bg-sky-600 text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400"
          >
            <CircleHelp className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="sm:hidden">Ajuda</span>
            <span className="hidden sm:inline">Como funciona</span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet station subtitle row when inside a station */}
      {activeStation && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-4 py-1.5">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
            {activeStation.subtitle}
          </p>
        </div>
      )}
    </header>
  );
}
