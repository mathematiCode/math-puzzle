import { createContext, useContext, useState, ReactNode } from 'react';
import { Piece } from '../types/piece';
import {
  getLevelsArray,
  getTotalLevels as getTotalLevelsFromUtils,
} from '../Game/utils/getLevelsArray';

type LevelProgress = {
  level: number;
  completed: boolean;
  pieces: Piece[];
};

export type LevelProgressContextType = {
  levelProgress: LevelProgress[];
  setLevelProgress: (levelProgress: LevelProgress[]) => void;
  setLevelCompleted: (level: number) => void;
  isLevelCompleted: (level: number) => boolean;
  getTotalLevels: () => number;
  getCompletedLevels: () => number;
  resetProgress: () => void;
};

export const LevelProgressContext =
  createContext<LevelProgressContextType | null>(null);

export function LevelProgressProvider({ children }: { children: ReactNode }) {
  // Create initial level progress array with the correct number of levels
  const initialLevelProgress = getLevelsArray<LevelProgress>({
    level: 0,
    completed: false,
    pieces: [],
  }).map((_, index) => ({
    level: index,
    completed: false,
    pieces: [],
  }));

  const [levelProgress, setLevelProgress] =
    useState<LevelProgress[]>(initialLevelProgress);

  function setLevelCompleted(level: number) {
    const newLevelProgress = levelProgress.map(levelProgress =>
      levelProgress.level === level
        ? { ...levelProgress, completed: true }
        : levelProgress
    );
    setLevelProgress(newLevelProgress);
  }

  function isLevelCompleted(level: number): boolean {
    return levelProgress[level]?.completed || false;
  }

  function getTotalLevels(): number {
    return getTotalLevelsFromUtils();
  }

  function getCompletedLevels(): number {
    return levelProgress.filter(level => level.completed).length;
  }

  function resetProgress(): void {
    setLevelProgress(initialLevelProgress);
  }

  return (
    <LevelProgressContext.Provider
      value={{
        levelProgress,
        setLevelProgress,
        setLevelCompleted,
        isLevelCompleted,
        getTotalLevels,
        getCompletedLevels,
        resetProgress,
      }}
    >
      {children}
    </LevelProgressContext.Provider>
  );
}

export const useLevelProgress = () => {
  const context = useContext(LevelProgressContext);
  if (!context) {
    throw new Error(
      'useLevelProgress must be used within a LevelProgressProvider'
    );
  }
  return context;
};
