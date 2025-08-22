import { useCallback } from 'react';
import { useBoardSquares } from '../context/BoardSquares';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useCurrentLevel } from '../context/CurrentLevel';

export function usePieceStabilitySetter() {
  const { getUnstablePieces } = useBoardSquares();
  const { setPieceStability, resetStabilityOfAllPieces, piecesInPlay } =
    usePiecesInPlay();
  const { boardDimensions } = useCurrentLevel();
  const { boardWidth, boardHeight } = boardDimensions;

  const updateStabilityAllPieces = useCallback(() => {
    const unstablePieces = getUnstablePieces();
    resetStabilityOfAllPieces();
    unstablePieces.forEach(pieceId => {
      setPieceStability(pieceId, false);
    });
    piecesInPlay.forEach(piece => {
      const isOnBoard =
        piece.location !== null && piece.location !== 'instructions';
      if (
        isOnBoard &&
        (piece.width > boardWidth || piece.height > boardHeight)
      ) {
        setPieceStability(piece.id, false);
      }
    });
  }, [getUnstablePieces, setPieceStability, resetStabilityOfAllPieces]);

  return { updateStabilityAllPieces };
}
