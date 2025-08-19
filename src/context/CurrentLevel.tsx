import { createContext, useState, type ReactNode } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import levels from '../Game/levels.json' with { type: 'json' };
import { colors } from '../CONSTANTS';
export const CurrentLevelContext = createContext<CurrentLevelContextType>(
  {} as CurrentLevelContextType
);
import { Piece } from '../types/piece';
import { findLargestHeight } from '../Game/utils/utilities';
import { calculateUnitSize } from '../Game/utils/calculateUnitSize';
import Hotjar from '@hotjar/browser';

export interface CurrentLevelContextType {
  currentLevel: number;
  initialPieces: Piece[];
  boardDimensions: { boardWidth: number; boardHeight: number };
  levelPosition: 'first' | 'middle' | 'last';
  levelId: number;
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

function getInitialPieces(level: number) {
  const instructionsPiece = {
    width: 3,
    height: 2,
    location: 'instructions',
    color: 'hsl(0, 61%, 66%)',
    id: 'sample-0',
    isRotated: false,
    isStable: true,
  };
  return [
    instructionsPiece,
    ...levels[level].pieces.map((piece, index) => ({
      ...piece,
      location: initialLocation,
      color: colors[index % colors.length],
      id: `i-${index + 1}`,
      isRotated: false,
    })),
  ];
}

export function CurrentLevelProvider({ children }: CurrentLevelProviderProps) {
  const [currentLevel, setCurrentLevel] = useLocalStorageState('currentLevel', {
    defaultValue: 1
  });

  const boardDimensions = {
    boardWidth: levels[currentLevel].dimensions.width,
    boardHeight: levels[currentLevel].dimensions.height,
  };
  const { width, height } = levels[currentLevel].dimensions;
  const levelId = levels[currentLevel].id;
  const numPieces = levels[currentLevel].pieces.length;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const largestHeight = findLargestHeight(levels[currentLevel].pieces);
  const sizeOfEachUnit = calculateUnitSize(
    windowWidth,
    windowHeight,
    width,
    height,
    largestHeight,
    numPieces
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

  const initialPieces = getInitialPieces(currentLevel);

  function setSizeOfEachUnit(currentLevel: number) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { width, height } = levels[currentLevel].dimensions;
    const largestHeight = findLargestHeight(levels[currentLevel].pieces);
    const sizeOfEachUnit = calculateUnitSize(
      windowWidth,
      windowHeight,
      width,
      height,
      largestHeight,
      numPieces
    );
    document.documentElement.style.setProperty(
      '--sizeOfEachUnit',
      `${sizeOfEachUnit}px`
    );
    // Need to investigate if this is the right approach to keep all the sizeOfEachUnit states consistent across the app.
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
          levelId,
          boardDimensions,
          sizeOfEachUnit,
          setSizeOfEachUnit,
          nextLevel,
          previousLevel,
          setCurrentLevel,
        } as CurrentLevelContextType
        // maybe I should export these (top 6) as a named object instead of separate variables. 
      }
    >
      {children}
    </CurrentLevelContext.Provider>
  );
}
