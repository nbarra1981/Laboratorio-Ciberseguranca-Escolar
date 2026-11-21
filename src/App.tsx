import { useCallback, useEffect, useState } from 'react';
import { HelpModal } from './components/HelpModal';
import { LabHeader } from './components/LabHeader';
import { LabHub } from './components/LabHub';
import { getStationById } from './core/stationsRegistry';
import {
  applyThemeToDocument,
  getNextTheme,
  loadStoredTheme,
  saveStoredTheme,
  type ThemeMode,
} from './core/theme';
import type { StationId } from './core/types';
import {
  clearStoredRatings,
  loadStoredRatings,
  type StoredRatingsMap,
} from './stations/flashcards/logic/storage';

function getInitialStationId(): StationId | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') {
    return 'estacao-1-flashcards';
  }
  return null;
}

export default function App() {
  const [activeStationId, setActiveStationId] = useState<StationId | null>(
    getInitialStationId,
  );
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => loadStoredTheme());
  const [storedRatings, setStoredRatings] = useState<StoredRatingsMap>(() =>
    loadStoredRatings(),
  );

  useEffect(() => {
    applyThemeToDocument(theme);
    saveStoredTheme(theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => getNextTheme(prev));
  }, []);

  const refreshStoredRatings = useCallback(() => {
    setStoredRatings(loadStoredRatings());
  }, []);

  const handleClearHubProgress = useCallback(() => {
    clearStoredRatings();
    setStoredRatings({});
  }, []);

  const activeStation = getStationById(activeStationId);
  const StationComponent =
    activeStation?.status === 'active' ? activeStation.component : undefined;

  const masteredCount = Object.values(storedRatings).filter(
    (rating) => rating === 'mastered',
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <LabHeader
        activeStation={activeStation}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onBackToHub={() => setActiveStationId(null)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {StationComponent ? (
          <StationComponent
            onBackToHub={() => setActiveStationId(null)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onProgressChange={refreshStoredRatings}
          />
        ) : (
          <LabHub
            masteredCount={masteredCount}
            hasSavedProgress={Object.keys(storedRatings).length > 0}
            onSelectStation={(id) => setActiveStationId(id)}
            onClearProgress={handleClearHubProgress}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span>Laboratório de Informática · Literacia Digital e Cibersegurança nas Escolas</span>
          <span>Funcionamento local no navegador · Sem recolha de dados pessoais</span>
        </div>
      </footer>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
