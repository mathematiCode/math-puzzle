/**
 * Thin client for the Frectangles backend.
 *
 * The game is localStorage-first: these calls are best-effort syncs, so any
 * network or API failure is swallowed and never blocks gameplay.
 */

import { getClientId } from './clientId';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

/**
 * Store the player's current move count for a level on the backend.
 *
 * `levelId` is the level's stable id (levels.json `id`), not its list position,
 * so tracking survives level reordering (issue #105).
 */
export async function syncLevelProgress(
  levelId: number,
  moveCount: number
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: getClientId(),
        level_id: levelId,
        move_count: moveCount,
      }),
    });
  } catch {
    // Best-effort only — ignore failures so offline play is unaffected.
  }
}

/**
 * Record that the player completed a level, along with the number of moves it
 * took them. Best-effort; drives the secret analytics page (issue #89).
 *
 * `levelId` is the level's stable id (levels.json `id`), not its list position.
 */
export async function syncLevelCompletion(
  levelId: number,
  moveCount: number
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/progress/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: getClientId(),
        level_id: levelId,
        move_count: moveCount,
      }),
    });
  } catch {
    // Best-effort only — ignore failures so offline play is unaffected.
  }
}

/** Per-level aggregate stats shown on the secret analytics page. */
export type LevelCompletionStat = {
  level_id: number;
  started_count: number;
  completed_count: number;
  avg_moves_to_complete: number | null;
};

export type CompletionAnalytics = {
  total_players: number;
  levels: LevelCompletionStat[];
};

/** Fetch site-wide completion analytics for the secret page (issue #89). */
export async function fetchCompletionAnalytics(): Promise<CompletionAnalytics> {
  const response = await fetch(`${API_BASE_URL}/api/analytics/completions`);
  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }
  return response.json();
}
