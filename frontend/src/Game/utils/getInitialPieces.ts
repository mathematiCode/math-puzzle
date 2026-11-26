import { Piece } from '../../types/piece';
import { createInitialPieces } from './piece';

/**
 * Thin wrapper kept for existing call sites. The actual piece construction
 * (ids, order paths, kind) lives in one place: createInitialPieces.
 */
export function getInitialPieces(level: number): Piece[] {
  return createInitialPieces(level);
}
