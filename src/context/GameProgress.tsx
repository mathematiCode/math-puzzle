import { createContext, useContext, ReactNode } from 'react';
import { Piece } from '../types/piece';
import { getLevelsArray } from '../Game/utils/getLevelsArray';
import Hotjar from '@hotjar/browser';
import useLocalStorageState from 'use-local-storage-state';

type GameProgress = {
  level: number;
  completed: boolean;
  modalShown: boolean;
  pieces: Piece[];
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
  }).map((_, index) => ({
    level: index,
    completed: false,
    modalShown: false,
    pieces: [],
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
    //   console.log('setting pieces solution to:', pieces);
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? { ...gameProgress, pieces: pieces }
        : gameProgress
    );
    setGameProgress(newGameProgress);
  }

  function resetProgress(): void {
    setGameProgress(initialGameProgress);
  }

  function resetLevel(level: number): void {
    const newGameProgress = gameProgress.map(gameProgress =>
      gameProgress.level === level
        ? { ...gameProgress, completed: false, modalShown: false, pieces: [] }
        : gameProgress
    );
    setGameProgress(newGameProgress);
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
