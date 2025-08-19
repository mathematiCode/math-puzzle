import { createContext, useContext, useState, ReactNode } from 'react';
import levels from '../Game/levels.json';
import { getInitialBoardSquares } from '../Game/utils/getInitialBoardSquares';
import { CurrentLevelContext } from './CurrentLevel';
import { convertLocationToXAndY } from '../Game/utils/utilities';
import {
  LevelProgressContext,
  LevelProgressContextType,
} from './LevelProgress';
import Hotjar from '@hotjar/browser';
import useLocalStorageState from 'use-local-storage-state';

export type BoardSquaresContextType = {
  boardSquares: string[][];
  setBoardSquares: (boardSquares: [][]) => void;
  addPieceToBoard: (
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) => void;
  removePieceFromBoard: (
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) => void;
  resetBoardSquares: (level: number) => void;
  countOverlappingSquares: (
    location: string,
    pieceWidth: number,
    pieceHeight: number
  ) => {
    outerOverlaps: number;
    innerOverlaps: number;
    squaresOutsideBoard: number;
  };
  getUnstablePieces: () => string[];
  checkIfPassedLevel: () => boolean;
};

export const BoardSquaresContext =
  createContext<BoardSquaresContextType | null>(null);

export function BoardSquaresProvider({ children }: { children: ReactNode }) {
  const { currentLevel } = useContext(CurrentLevelContext);
  const levelProgressContext = useContext(LevelProgressContext);
  if (!levelProgressContext) {
    throw new Error(
      'LevelProgressContext must be used within a LevelProgressProvider'
    );
  }
  const { setLevelCompleted } = levelProgressContext;
  const [boardSquares, setBoardSquares] = useLocalStorageState<string[][]>(
    'boardSquares',
    {
      defaultValue: getInitialBoardSquares(currentLevel),
    }
  );
  const boardWidth = levels[currentLevel].dimensions.width;
  const boardHeight = levels[currentLevel].dimensions.height;
  function addPieceToBoard(
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) {
    if (x < 0) {
      console.error('adding a piece to the board with a negative x.');
      x = 0;
    }
    if (y < 0) {
      console.error('adding a piece to the board with a negative y.');
      y = 0;
    }
    let newBoardSquares = [...boardSquares];
    for (let row = y; row < Math.min(y + height, boardHeight); row++) {
      if (!newBoardSquares[row]) {
        console.warn(`Row index ${row} is out of bounds for boardSquares.`);
        continue;
      }
      for (let col = x; col < Math.min(x + width, boardWidth); col++) {
        if (typeof newBoardSquares[row][col] == undefined) {
          console.warn(`Column index ${col} is out of bounds for row ${row}.`);
        } else if (newBoardSquares[row][col] == 'invalid') {
          console.error('Piece was placed on invalid squares.');
        } else {
          newBoardSquares[row][col] = newBoardSquares[row][col]
            ? `${newBoardSquares[row][col]}, ${id}`
            : `${id}`;
        }
      }
    }
    setBoardSquares(newBoardSquares);

    setTimeout(() => {
      if (checkIfPassedLevel()) {
        Hotjar.event('Level completed!');
        setLevelCompleted(currentLevel);
      }
    }, 0);
  }
  function removePieceFromBoard(
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) {
    let newBoardSquares = [...boardSquares];
    for (let row = y; row < y + height && row < boardHeight; row++) {
      if (!newBoardSquares[row]) {
        console.warn(`Row index ${row} is out of bounds.`);
        continue;
      }
      for (let col = x; col < x + width && col < boardWidth; col++) {
        if (typeof newBoardSquares[row][col] == undefined) {
          console.warn(`Column index ${col} is out of bounds.`);
          continue;
        } else if (
          newBoardSquares[row][col] &&
          newBoardSquares[row][col].length > 0
        ) {
          // remove the id from the string
          const currentIds = newBoardSquares[row][col].split(', ');
          const filteredIds = currentIds.filter(
            currentId => currentId.trim() !== id
          );
          newBoardSquares[row][col] = filteredIds.join(', ');
        }
      }
    }
    setBoardSquares(newBoardSquares);
  }

  function resetBoardSquares(level: number) {
    setBoardSquares(getInitialBoardSquares(level));
  }

  function countOverlappingSquares(
    location: string,
    pieceWidth: number,
    pieceHeight: number
  ) {
    let outerOverlaps = 0;
    let innerOverlaps = 0;
    let squaresOutsideBoard = 0;
    const { x, y } = convertLocationToXAndY(location);
    for (let col = x; col < x + pieceWidth; col++) {
      for (let row = y; row < y + pieceHeight; row++) {
        if (boardSquares[row] == undefined) {
          squaresOutsideBoard++;
        }
        if (boardSquares?.[row]?.[col]?.length > 0) {
          if (
            col > x &&
            col < x + pieceWidth - 1 &&
            row > y &&
            row < y + pieceHeight - 1
          ) {
            innerOverlaps++;
          } else {
            outerOverlaps++;
          }
        }
      }
    }
    return { outerOverlaps, innerOverlaps, squaresOutsideBoard };
  }

  function getUnstablePieces() {
    const overlappingPieces: string[] = [];
    for (let row = 0; row < boardSquares.length; row++) {
      for (let col = 0; col < boardSquares[row].length; col++) {
        if (boardSquares[row][col]?.length > 0) {
          const ids = boardSquares[row][col].split(', ').map(id => id.trim());
          if (ids.length > 1) {
            ids.forEach(id => {
              if (!overlappingPieces.includes(id)) {
                overlappingPieces.push(id);
              }
            });
          }
        }
      }
    }
    return overlappingPieces;
  }

  function countEmptySquares() {
    let emptySquares = 0;
    for (let row = 0; row < boardSquares.length; row++) {
      for (let col = 0; col < boardSquares[row].length; col++) {
        if (boardSquares[row][col]?.length === 0) {
          emptySquares++;
        }
      }
    }
    return emptySquares;
  }

  function checkIfPassedLevel() {
    const unstablePieces = getUnstablePieces();
    const noOverlaps = unstablePieces.length === 0;
    const noEmptySquares = countEmptySquares() === 0;
    if (noOverlaps && noEmptySquares) {
      return true;
    } else return false;
  }

  return (
    <BoardSquaresContext.Provider
      value={{
        boardSquares,
        setBoardSquares,
        addPieceToBoard,
        removePieceFromBoard,
        resetBoardSquares,
        countOverlappingSquares,
        getUnstablePieces,
        checkIfPassedLevel,
      }}
    >
      {children}
    </BoardSquaresContext.Provider>
  );
}
