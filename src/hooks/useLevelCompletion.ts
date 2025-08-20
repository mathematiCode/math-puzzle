import { useCallback } from 'react';
import { useBoardSquares } from '../context/BoardSquares';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useCurrentLevel } from '../context/CurrentLevel';
import { useGameProgress } from '../context/GameProgress';

export function useLevelCompletion() {
  const { checkIfPassedLevel } = useBoardSquares();
  const { piecesInPlay } = usePiecesInPlay();
  const { currentLevel } = useCurrentLevel();
  const { setPiecesSolution, setLevelCompleted } = useGameProgress();

  const handleLevelCheck = useCallback(() => {
    if (checkIfPassedLevel()) {
      setPiecesSolution(currentLevel, piecesInPlay);
      setLevelCompleted(currentLevel);
    }
  }, [
    checkIfPassedLevel,
    piecesInPlay,
    currentLevel,
    setPiecesSolution,
    setLevelCompleted,
  ]);

  return { handleLevelCheck };
}
