/**
 * Transient hand-off for the split "glide" animation.
 *
 * When a tray piece is cut, the second child (the right/bottom half) lands in a
 * new tray slot that is nowhere near where that half physically sat inside the
 * original piece — so without help it just pops into place. The cut handler
 * records the half's on-screen top-left corner here, keyed by the new child's
 * id; the child's component consumes it on mount and plays a FLIP animation from
 * that point into its final slot.
 *
 * This is a one-shot side channel (not React state) on purpose: it carries a
 * pre-layout screen measurement across a single re-render and must not itself
 * trigger renders. Each origin is read exactly once and then discarded.
 */
export type SplitOrigin = { left: number; top: number };

const origins = new Map<string, SplitOrigin>();

export function registerSplitOrigin(pieceId: string, origin: SplitOrigin): void {
  origins.set(pieceId, origin);
}

/** True if an unconsumed origin exists for this id (peek, without removing it). */
export function hasSplitOrigin(pieceId: string): boolean {
  return origins.has(pieceId);
}

/** Read and remove the origin for this id, or null if there isn't one. */
export function consumeSplitOrigin(pieceId: string): SplitOrigin | null {
  const origin = origins.get(pieceId);
  if (origin) origins.delete(pieceId);
  return origin ?? null;
}
