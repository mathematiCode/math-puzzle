import { createContext, useContext, ReactNode } from 'react';
import { Piece } from '../types/piece';
import { getLevelsArray, getLevelId } from '../Game/utils/getLevelsArray';
import Hotjar from '@hotjar/browser';
import useLocalStorageState from 'use-local-storage-state';
import { syncLevelCompletion, syncLevelProgress } from '../lib/api';

type GameProgress = {
  level: number;
  completed: boolean;
  modalShown: boolean;
  pieces: Piece[];
  // Snapshot of the board-occupancy grid so a level started-but-not-finished
  // can be restored exactly when the player navigates away and back (issue
  // #117). Empty array means "no snapshot yet" — fall back to the initial grid.
  boardSquares: string[][];
  moves: number;
};

export type GameProgressContextType = {
  gameProgress: GameProgress[];
  setGameProgress: (gameProgress: GameProgress[]) => void;
  setLevelCompleted: (level: number, pieces: Piece[]) => void;
  isLevelCompleted: (level: number) => boolean;
  getCompletedLevels: () => number;
  resetProgress: () => void;
  setModalShown: (level: number) => void;
  resetLevel: (level: number) => void;
  setPiecesForLevel: (level: number, pieces: Piece[]) => void;
  setBoardSquaresForLevel: (level: number, boardSquares: string[][]) => void;
  incrementMoves: (level: number) => void;
};

export const GameProgressContext =
  createContext<GameProgressContextType | null>(null);

export function GameProgressProvider({ children }: { children: ReactNode }) {
  // Create initial level progress array with the correct number of levels
  const initialGameProgress = getLevelsArray<GameProgress>({
    level: 0,
    completed: false,
    modalShown: false,
    pieces: [],
    boardSquares: [],
    moves: 0,
  }).map((_, index) => ({
    level: index,
    completed: false,
    modalShown: false,
    pieces: [],
    boardSquares: [],
    moves: 0,
  }));

  const [gameProgress, setGameProgress] = useLocalStorageState<GameProgress[]>(
    'gameProgress',
    {
      defaultValue: initialGameProgress,
    }
  );

  function setLevelCompleted(level: number, pieces: Piece[]) {
    // Functional updater so this composes with a same-handler incrementMoves()
    // instead of overwriting it from a stale snapshot. Capture movesTaken from
    // the up-to-date `prev` so the analytics sync reflects the real count.
    let movesTaken = 0;
    setGameProgress(prev =>
      prev.map(progress => {
        if (progress.level === level) {
          movesTaken = progress.moves ?? 0;
          return { ...progress, completed: true, pieces };
        }
        return progress;
      })
    );
    Hotjar.event(`Completed Level ${level}`);
    // Best-effort sync of the completion (and moves-to-complete) to the backend
    // so the secret analytics page can aggregate it (issue #89). Keyed by the
    // level's stable id, not its index, so tracking survives reordering (#105).
    void syncLevelCompletion(getLevelId(level), movesTaken);
  }

  function isLevelCompleted(level: number): boolean {
    return gameProgress[level]?.completed || false;
  }

  function getCompletedLevels(): number {
    return gameProgress.filter(level => level.completed).length;
  }

  function setModalShown(level: number): void {
    setGameProgress(prev =>
      prev.map(progress =>
        progress.level === level
          ? { ...progress, modalShown: true }
          : progress
      )
    );
  }

  // Uses the functional updater form so that saving pieces and board squares
  // for the same level back-to-back compose instead of clobbering each other
  // (both would otherwise derive from the same stale render snapshot).
  function setPiecesForLevel(level: number, pieces: Piece[]): void {
    setGameProgress(prev =>
      prev.map(progress =>
        progress.level === level ? { ...progress, pieces } : progress
      )
    );
  }

  // Persist the board-occupancy grid for a level so it can be restored exactly
  // when the player returns to a started-but-unfinished level (issue #117). The
  // grid is deep-copied because the board mutators update row arrays in place.
  function setBoardSquaresForLevel(
    level: number,
    boardSquares: string[][]
  ): void {
    const snapshot = boardSquares.map(row => [...row]);
    setGameProgress(prev =>
      prev.map(progress =>
        progress.level === level
          ? { ...progress, boardSquares: snapshot }
          : progress
      )
    );
  }

  // Count a "move" (a piece placement or a toolbar action) for a level and
  // best-effort sync the running total to the backend (issue #115).
  // Functional updater form (like setPiecesForLevel) is essential here: a move
  // and a level-completion often fire in the same handler (e.g. a stretch that
  // finishes the level calls checkAndHandleLevelStatus() then incrementMoves()).
  // A direct-value setGameProgress derived from a stale snapshot would clobber
  // the `completed` flag just set by setLevelCompleted, so the "Level Complete"
  // modal would never appear (issue #115 regression).
  function incrementMoves(level: number): void {
    let newMoveCount = 0;
    setGameProgress(prev =>
      prev.map(progress => {
        if (progress.level === level) {
          newMoveCount = (progress.moves ?? 0) + 1;
          return { ...progress, moves: newMoveCount };
        }
        return progress;
      })
    );
    void syncLevelProgress(getLevelId(level), newMoveCount);
  }

  function resetProgress(): void {
    setGameProgress(initialGameProgress);
  }

  function resetLevel(level: number): void {
    setGameProgress(prev =>
      prev.map(progress =>
        progress.level === level
          ? {
              ...progress,
              completed: false,
              modalShown: false,
              pieces: [],
              boardSquares: [],
              moves: 0,
            }
          : progress
      )
    );
    void syncLevelProgress(getLevelId(level), 0);
  }

  return (
    <GameProgressContext.Provider
      value={{
        gameProgress,
        setGameProgress,
        setLevelCompleted,
        isLevelCompleted,
        getCompletedLevels,
        setModalShown,
        resetProgress,
        resetLevel,
        setPiecesForLevel,
        setBoardSquaresForLevel,
        incrementMoves,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
}

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error(
      'useGameProgress must be used within a GameProgressProvider'
    );
  }
  return context;
};
