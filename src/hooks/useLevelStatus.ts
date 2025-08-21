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
  const unstablePieces = getUnstablePieces();

  const checkLevelStatus = useCallback(() => {
    const isLevelPassed =
      unstablePieces.length === 0 && countEmptySquares() === 0;
    if (isLevelPassed) {
      setLevelCompleted(currentLevel, piecesInPlay);
    }
  }, [
    unstablePieces,
    countEmptySquares,
    currentLevel,
    piecesInPlay,
    setLevelCompleted,
  ]);

  return { checkLevelStatus };
}
