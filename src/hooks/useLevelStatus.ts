import { useBoardSquares } from '../context/BoardSquares';

export function useLevelStatus(): boolean {
  const { getUnstablePieces, countEmptySquares } = useBoardSquares();
  const unstablePieces = getUnstablePieces();
  const noOverlaps = unstablePieces.length === 0;
  const noEmptySquares = countEmptySquares() === 0;
  if (noOverlaps && noEmptySquares) {
    return true;
  } else return false;
}
