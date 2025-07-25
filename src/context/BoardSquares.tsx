//@ts-nocheck
import { createContext, useContext, useState, ReactNode } from 'react';
import levels from '../levels.json';
import { getInitialBoardSquares } from '../utils/getInitialBoardSquares';
import { CurrentLevelContext } from './CurrentLevel.tsx';
import { convertLocationToXAndY } from '../utils/utilities';

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
    pieceHeight: number,
    boardSquares: string[][]
  ) => { outerOverlaps: number; innerOverlaps: number };
};

export const BoardSquaresContext =
  createContext<BoardSquaresContextType | null>(null);

export function BoardSquaresProvider({ children }: { children: ReactNode }) {
  const { currentLevel } = useContext(CurrentLevelContext);
  const [boardSquares, setBoardSquares] = useState<string[][]>(
    getInitialBoardSquares(currentLevel)
  );
  //console.log('boardSquares is:', boardSquares);
  const boardWidth = levels[currentLevel].dimensions.width;
  const boardHeight = levels[currentLevel].dimensions.height;
  function addPieceToBoard(
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) {
    // console.log('adding a piece', {
    //   x,
    //   y,
    //   width,
    //   height,
    //   boardWidth,
    //   boardHeight,
    // });
    if (x < 0) {
      console.error('adding a piece to the board with a negative x.');
      x = 0;
    }
    if (y < 0) {
      console.error('adding a piece to the board with a negative y.');
      y = 0;
    }
    let newBoardSquares = boardSquares;
    for (let row = y; row < Math.min(y + height, boardHeight); row++) {
      if (!newBoardSquares[row]) {
        console.warn(`Row index ${row} is out of bounds for boardSquares.`);
        continue;
      }
      for (let col = x; col < Math.min(x + width, boardWidth); col++) {
        if (typeof newBoardSquares[row][col] == undefined) {
          console.warn(`Column index ${col} is out of bounds for row ${row}.`);
        } else if (boardSquares[row][col] == 'invalid') {
          console.error('Piece was placed on invalid squares.');
        } else {
          newBoardSquares[row][col] = newBoardSquares[row][col]
            ? `${newBoardSquares[row][col]}, ${id}`
            : `${id}`;
        }
      }
    }
    setBoardSquares(newBoardSquares);
    console.log('after addition', newBoardSquares);
  }
  function removePieceFromBoard(
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) {
    // console.log('removing a piece', {
    //   x,
    //   y,
    //   width,
    //   height,
    //   boardWidth,
    //   boardHeight,
    // });
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
    console.log('after removal', newBoardSquares);
  }

  function resetBoardSquares(level: number) {
    console.log('resetting squares for level', level);
    setBoardSquares(getInitialBoardSquares(level));
  }

  function countOverlappingSquares(
    location: string,
    pieceWidth: number,
    pieceHeight: number,
    boardSquares: string[][]
  ) {
    let outerOverlaps = 0;
    let innerOverlaps = 0;
    let squaresOutsideBoard = 0;
    const { x, y } = convertLocationToXAndY(location);
    console.log({ x, y, pieceWidth, pieceHeight, boardSquares });
    // removePieceFromBoard(x, y, pieceWidth, pieceHeight);
    for (let col = x; col < x + pieceWidth; col++) {
      for (let row = y; row < y + pieceHeight; row++) {
        if (boardSquares[row] == undefined) {
          squaresOutsideBoard++;
        }
        // console.log({ row, col, boardSquare: boardSquares[row] });
        //console.log(boardSquares);
        if (boardSquares?.[row]?.[col].length > 0) {
          if (
            col > x &&
            col < x + pieceWidth - 1 &&
            row > y &&
            row < y + pieceHeight - 1
          ) {
            innerOverlaps++;
          } else {
            // console.log({ x, col, pieceWidth, y, row, pieceHeight });
            outerOverlaps++;
          }
        }
      }
    }
    // addPieceToBoard(x, y, pieceWidth, pieceHeight, boardSquares);
    return { outerOverlaps, innerOverlaps };
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
      }}
    >
      {children}
    </BoardSquaresContext.Provider>
  );
}
