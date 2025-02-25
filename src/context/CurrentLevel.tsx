import { createContext, useState, type ReactNode } from 'react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';
export const CurrentLevelContext = createContext<CurrentLevelContextType>(
  {} as CurrentLevelContextType
);
import { InitialPiece } from '../types/piece.ts';

export interface CurrentLevelContextType {
  currentLevel: number;
  initialPieces: InitialPiece[];
  boardDimensions: { boardWidth: number; boardHeight: number };
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

  const boardDimensions = {
    boardWidth: levels[currentLevel].dimensions.width,
    boardHeight: levels[currentLevel].dimensions.height,
  };
  const { width, height } = levels[currentLevel].dimensions;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 450 is an arbitrary number that seems to work well when divided by the width or height
  const sizeOfEachUnit = Math.round(
    600 /
      ((Math.max(width, height) * Math.max(windowWidth, windowHeight)) / 1000)
  );
  document.documentElement.style.setProperty(
    '--sizeOfEachUnit',
    `${sizeOfEachUnit}px`
  );

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
          boardDimensions,
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
