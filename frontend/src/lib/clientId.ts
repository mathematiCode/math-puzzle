/**
 * Anonymous, per-device player identifier.
 *
 * A UUID is generated once and persisted in localStorage so a player's progress
 * can be associated with them on the backend without requiring an account.
 */

const CLIENT_ID_KEY = 'clientId';

export function getClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (e.g. private mode) — use an ephemeral id.
    return crypto.randomUUID();
  }
}
