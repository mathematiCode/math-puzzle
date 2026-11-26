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

/** Store the player's current move count for a level on the backend. */
export async function syncLevelProgress(
  level: number,
  moveCount: number
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: getClientId(),
        level,
        move_count: moveCount,
      }),
    });
  } catch {
    // Best-effort only — ignore failures so offline play is unaffected.
  }
}
