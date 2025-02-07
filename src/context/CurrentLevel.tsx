import { createContext, useState, type ReactNode } from 'react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';
export const CurrentLevelContext = createContext<CurrentLevelContextType>(
  {} as CurrentLevelContextType
);

interface CurrentLevelContextType {
  currentLevel: number;
  initialPieces: Array<{
    location: string | null;
    color: string;
    id: string;
    isRotated: boolean;
  }>;
  levelPosition: 'first' | 'middle' | 'last';
  sizeOfEachUnit: number;
  nextLevel: () => void;
  previousLevel: () => void;
  setCurrentLevel: (level: number) => void;
}

const initialLocation = null;
const numberOfLevels = levels.length;

interface CurrentLevelProviderProps {
  children: ReactNode;
}

function CurrentLevelProvider({ children }: CurrentLevelProviderProps) {
  const [currentLevel, setCurrentLevel] = useState(0);

  const { width, height } = levels[currentLevel].dimensions;

  // 450 is an arbitrary number that seems to work well when divided by the width or height
  const sizeOfEachUnit = Math.round(450 / Math.max(width, height));

  let levelPosition: 'first' | 'middle' | 'last';
  if (currentLevel === numberOfLevels - 1) {
    levelPosition = 'last';
  } else if (currentLevel === 0) {
    levelPosition = 'first';
  } else {
    levelPosition = 'middle';
  }

  const initialPieces = levels[currentLevel].pieces.map((piece, index) => ({
    ...piece,
    location: initialLocation,
    color: colors[index % colors.length],
    id: `initial-${index}`,
    isRotated: false,
  }));

  function nextLevel() {
    if (currentLevel === numberOfLevels - 1) {
      return;
    } else {
      setCurrentLevel(currentLevel + 1);
    }
  }

  function previousLevel() {
    if (currentLevel === 0) {
      return;
    } else {
      setCurrentLevel(currentLevel - 1);
    }
  }

  return (
    <CurrentLevelContext.Provider
      value={
        {
          currentLevel,
          initialPieces,
          levelPosition,
          sizeOfEachUnit,
          nextLevel,
          previousLevel,
          setCurrentLevel,
        } as CurrentLevelContextType
      }
    >
      {children}
    </CurrentLevelContext.Provider>
  );
}

export default CurrentLevelProvider;
