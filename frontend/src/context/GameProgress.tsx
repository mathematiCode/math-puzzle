import { createContext, useContext, ReactNode } from 'react';
import { Piece } from '../types/piece';
import { getLevelsArray } from '../Game/utils/getLevelsArray';
import Hotjar from '@hotjar/browser';
import useLocalStorageState from 'use-local-storage-state';
import { syncLevelProgress } from '../lib/api';

type GameProgress = {
  level: number;
  completed: boolean;
  modalShown: boolean;
  pieces: Piece[];
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
    moves: 0,
  }).map((_, index) => ({
    level: index,
    completed: false,
    modalShown: false,
    pieces: [],
    moves: 0,
  }));

  const [gameProgress, setGameProgress] = useLocalStorageState<GameProgress[]>(
    'gameProgress',
    {
      defaultValue: initialGameProgress,
    }
  );

  function setLevelCompleted(level: number, pieces: Piece[]) {
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? { ...gameProgress, completed: true, pieces: pieces }
        : gameProgress
    );
    setGameProgress(newGameProgress);
    Hotjar.event(`Completed Level ${level}`);
  }

  function isLevelCompleted(level: number): boolean {
    return gameProgress[level]?.completed || false;
  }

  function getCompletedLevels(): number {
    return gameProgress.filter(level => level.completed).length;
  }

  function setModalShown(level: number): void {
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? { ...gameProgress, modalShown: true }
        : gameProgress
    );
    setGameProgress(newGameProgress);
  }

  function setPiecesForLevel(level: number, pieces: Piece[]): void {
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? { ...gameProgress, pieces: pieces }
        : gameProgress
    );
    setGameProgress(newGameProgress);
  }

  // Count a "move" (a piece placement or a toolbar action) for a level and
  // best-effort sync the running total to the backend (issue #115).
  function incrementMoves(level: number): void {
    let newMoveCount = 0;
    const newGameProgress = gameProgress.map(progress => {
      if (progress.level === level) {
        newMoveCount = (progress.moves ?? 0) + 1;
        return { ...progress, moves: newMoveCount };
      }
      return progress;
    });
    setGameProgress(newGameProgress);
    void syncLevelProgress(level, newMoveCount);
  }

  function resetProgress(): void {
    setGameProgress(initialGameProgress);
  }

  function resetLevel(level: number): void {
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? {
            ...gameProgress,
            completed: false,
            modalShown: false,
            pieces: [],
            moves: 0,
          }
        : gameProgress
    );
    setGameProgress(newGameProgress);
    void syncLevelProgress(level, 0);
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
