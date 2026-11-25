import type { ComponentType } from 'react';

export type StationId =
  | 'estacao-1-flashcards'
  | 'estacao-2-secretaria'
  | 'estacao-3-passwords'
  | 'estacao-4-privacidade';

export type StationStatus = 'active' | 'coming_soon';

export interface StationComponentProps {
  onBackToHub: () => void;
  onOpenHelp: () => void;
  onProgressChange?: () => void;
}

export interface StationDefinition {
  id: StationId;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  methodology: string;
  estimatedTime: string;
  status: StationStatus;
  topics: string[];
  component?: ComponentType<StationComponentProps>;
}
