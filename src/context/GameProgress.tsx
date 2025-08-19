import { createContext, useContext, useState, ReactNode } from 'react';
import { Piece } from '../types/piece';
import {
  getLevelsArray,
  getTotalLevels as getTotalLevelsFromUtils,
} from '../Game/utils/getLevelsArray';
import Hotjar from '@hotjar/browser';

type GameProgress = {
  level: number;
  completed: boolean;
  pieces: Piece[];
};

export type GameProgressContextType = {
  gameProgress: GameProgress[];
  setGameProgress: (gameProgress: GameProgress[]) => void;
  setLevelCompleted: (level: number) => void;
  isLevelCompleted: (level: number) => boolean;
  getTotalLevels: () => number;
  getCompletedLevels: () => number;
  resetProgress: () => void;
};

export const GameProgressContext =
  createContext<GameProgressContextType | null>(null);

export function GameProgressProvider({ children }: { children: ReactNode }) {
  // Create initial level progress array with the correct number of levels
  const initialGameProgress = getLevelsArray<GameProgress>({
    level: 0,
    completed: false,
    pieces: [],
  }).map((_, index) => ({
    level: index,
    completed: false,
    pieces: [],
  }));

  const [gameProgress, setGameProgress] =
    useState<GameProgress[]>(initialGameProgress);

  function setLevelCompleted(level: number) {
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? { ...gameProgress, completed: true }
        : gameProgress
    );
    setGameProgress(newGameProgress);
    Hotjar.event(`Completed Level ${level}`);
  }

  function isLevelCompleted(level: number): boolean {
    return gameProgress[level]?.completed || false;
  }

  function getTotalLevels(): number {
    return getTotalLevelsFromUtils();
  }

  function getCompletedLevels(): number {
    return gameProgress.filter(level => level.completed).length;
  }

  function resetProgress(): void {
    setGameProgress(initialGameProgress);
  }

  return (
    <GameProgressContext.Provider
      value={{
        gameProgress,
        setGameProgress,
        setLevelCompleted,
        isLevelCompleted,
        getTotalLevels,
        getCompletedLevels,
        resetProgress,
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
