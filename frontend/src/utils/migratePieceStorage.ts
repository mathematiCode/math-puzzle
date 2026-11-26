/**
 * One-time reset of persisted piece state when the piece data structure changes
 * shape in an incompatible way (see issue #109: pieces gained `order`/`kind`
 * fields and switched to opaque random ids).
 *
 * Old saved pieces lack the new required fields and would break when reloaded,
 * so when the stored schema version doesn't match we clear the piece-bearing
 * localStorage keys and let the providers rebuild fresh defaults. This discards
 * any in-progress board and saved level progress — an accepted trade-off for a
 * clean structure rather than a bespoke back-fill migration.
 *
 * Bump PIECE_SCHEMA_VERSION whenever the persisted Piece shape changes again,
 * or to force a one-time reset for clients that accumulated corrupt state
 * (e.g. phantom board-square ids left by an earlier drop bug).
 */
const PIECE_SCHEMA_VERSION = 3;
const SCHEMA_VERSION_KEY = 'pieceSchemaVersion';
const PIECE_STORAGE_KEYS = ['piecesInPlay', 'boardSquares', 'gameProgress'];

export function migratePieceStorage(): void {
  try {
    const storedVersion = Number(
      window.localStorage.getItem(SCHEMA_VERSION_KEY)
    );
    if (storedVersion === PIECE_SCHEMA_VERSION) return;

    PIECE_STORAGE_KEYS.forEach(key => window.localStorage.removeItem(key));
    window.localStorage.setItem(
      SCHEMA_VERSION_KEY,
      String(PIECE_SCHEMA_VERSION)
    );
  } catch {
    // localStorage may be unavailable (SSR, privacy mode); nothing to migrate.
  }
}
