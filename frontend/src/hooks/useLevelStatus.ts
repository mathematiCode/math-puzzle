import { useBoardSquares } from '../context/BoardSquares';
import { useGameProgress } from '../context/GameProgress';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useCurrentLevel } from '../context/CurrentLevel';
import { useCallback } from 'react';

export function useLevelStatus() {
  const { getUnstablePieces, countEmptySquares } = useBoardSquares();
  const { setLevelCompleted } = useGameProgress();
  const { currentLevel } = useCurrentLevel();
  const { piecesInPlay } = usePiecesInPlay();

  const checkAndHandleLevelStatus = useCallback(() => {
    const unstablePieces = getUnstablePieces();
    const isLevelPassed =
      unstablePieces.length === 0 && countEmptySquares() === 0;
    if (isLevelPassed) {
      setLevelCompleted(currentLevel, piecesInPlay);
    }
  }, [
    getUnstablePieces,
    countEmptySquares,
    currentLevel,
    piecesInPlay,
    setLevelCompleted,
  ]);

  return { checkAndHandleLevelStatus };
}
