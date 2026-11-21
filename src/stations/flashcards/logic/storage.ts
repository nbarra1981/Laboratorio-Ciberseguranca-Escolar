import type { SelfRating } from './flashcardEngine';

const STORAGE_KEY = 'lab_informatica_estacao1_progresso_v1';

export type StoredRatingsMap = Record<string, SelfRating>;

export function loadStoredRatings(): StoredRatingsMap {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const valid: StoredRatingsMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === 'mastered' || value === 'unsure' || value === 'forgot') {
        valid[key] = value;
      }
    }
    return valid;
  } catch {
    return {};
  }
}

export function saveStoredRatings(ratings: StoredRatingsMap): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    // Ignore storage quota or private mode failures gracefully
  }
}

export function clearStoredRatings(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}
