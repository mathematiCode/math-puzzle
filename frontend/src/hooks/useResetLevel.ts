import { useCallback } from 'react';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useBoardSquares } from '../context/BoardSquares';
import { useGameProgress } from '../context/GameProgress';
import { useCurrentLevel } from '../context/CurrentLevel';

/**
 * Resets the current level back to its initial, unsolved state: the pieces,
 * the board squares, and the saved progress (which clears the `completed` flag,
 * re-enabling dragging and the piece actions toolbar). Shared by the Reset Game
 * button and the "level complete" lock badge so both behave identically.
 */
export function useResetLevel() {
  const { resetPieces } = usePiecesInPlay();
  const { resetBoardSquares } = useBoardSquares();
  const { resetLevel } = useGameProgress();
  const { currentLevel } = useCurrentLevel();

  const resetCurrentLevel = useCallback(() => {
    resetPieces();
    resetBoardSquares(currentLevel);
    resetLevel(currentLevel);
  }, [resetPieces, resetBoardSquares, resetLevel, currentLevel]);

  return { resetCurrentLevel };
}
