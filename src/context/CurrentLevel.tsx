import { createContext, useState, type ReactNode } from 'react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';
export const CurrentLevelContext = createContext<CurrentLevelContextType>(
  {} as CurrentLevelContextType
);
import { InitialPiece } from '../types/piece';
import { calculateUnitSize } from '../utilities';
import Hotjar from '@hotjar/browser';

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

function useInitialPieces(level: number) {
  const instructionsPiece = {
    width: 3,
    height: 2,
    location: 'instructions',
    color: 'hsl(0, 61%, 66%)',
    id: 'sample-0',
    isRotated: false,
  };
  return [
    instructionsPiece,
    ...levels[level].pieces.map((piece, index) => ({
      ...piece,
      location: initialLocation,
      color: colors[index % colors.length],
      id: `initial-${index + 1}`,
      isRotated: false,
    })),
  ];
}

export function CurrentLevelProvider({ children }: CurrentLevelProviderProps) {
  const [currentLevel, setCurrentLevel] = useState(0);

  const boardDimensions = {
    boardWidth: levels[currentLevel].dimensions.width,
    boardHeight: levels[currentLevel].dimensions.height,
  };
  const { width, height } = levels[currentLevel].dimensions;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const sizeOfEachUnit = calculateUnitSize(
    windowWidth,
    windowHeight,
    width,
    height
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

  const initialPieces = useInitialPieces(currentLevel);

  function setSizeOfEachUnit(currentLevel: number) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { width, height } = levels[currentLevel].dimensions;
    const sizeOfEachUnit = calculateUnitSize(
      windowWidth,
      windowHeight,
      width,
      height
    );
    document.documentElement.style.setProperty(
      '--sizeOfEachUnit',
      `${sizeOfEachUnit}px`
    );
  }

  function nextLevel() {
    if (currentLevel === numberOfLevels - 1) {
      Hotjar.event('click disabled nextLevel button');
      return;
    } else {
      setCurrentLevel(currentLevel + 1);
    }
  }

  function previousLevel() {
    if (currentLevel === 0) {
      Hotjar.event('click disabled previousLevel button');
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
          setSizeOfEachUnit,
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
