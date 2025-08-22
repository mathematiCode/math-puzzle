import { useCallback } from 'react';
import { useBoardSquares } from '../context/BoardSquares';
import { usePiecesInPlay } from '../context/PiecesInPlay';

export function usePieceStabilitySetter() {
  const { getUnstablePieces } = useBoardSquares();
  const { setPieceStability, resetStabilityOfAllPieces } = usePiecesInPlay();

  const updateStabilityAllPieces = useCallback(() => {
    const unstablePieces = getUnstablePieces();
    resetStabilityOfAllPieces();
    unstablePieces.forEach(piece => {
      setPieceStability(piece, false);
    });
  }, [getUnstablePieces, setPieceStability]);

  return { updateStabilityAllPieces };
}
