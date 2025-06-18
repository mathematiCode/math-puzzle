import { createContext, useContext, useState, ReactNode } from 'react';
import levels from '../levels.json';
import { getInitialBoardSquares } from '../utils/getInitialBoardSquares';
import { CurrentLevelContext } from './CurrentLevel.tsx';

export type BoardSquaresContextType = {
  boardSquares: string[][];
  setBoardSquares: (boardSquares: [][]) => void;
  addPieceToBoard: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  removePieceFromBoard: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  resetBoardSquares: (level: number) => void;
};

export const BoardSquaresContext =
  createContext<BoardSquaresContextType | null>(null);

function BoardSquaresProvider({ children }: { children: ReactNode }) {
  const { currentLevel } = useContext(CurrentLevelContext);
  const [boardSquares, setBoardSquares] = useState<string[][]>(
    getInitialBoardSquares(currentLevel)
  );
  const boardWidth = levels[currentLevel].dimensions.width;
  const boardHeight = levels[currentLevel].dimensions.height;
  function addPieceToBoard(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    let newBoardSquares = boardSquares;
    for (let row = y; row < y + height; row++) {
      for (let col = x; col < x + width; col++) {
        newBoardSquares[row][col] = 'full';
      }
    }
    setBoardSquares(newBoardSquares);
    console.log('after addition', newBoardSquares);
  }
  function removePieceFromBoard(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    let newBoardSquares = boardSquares;
    for (let row = y; row < y + height; row++) {
      for (let col = x; col < x + width; col++) {
        newBoardSquares[row][col] = 'empty';
      }
    }
    setBoardSquares(newBoardSquares);
    console.log('after removal', newBoardSquares);
  }

  function resetBoardSquares(level: number) {
    console.log('resetting squares for level', level);
    setBoardSquares(getInitialBoardSquares(level));
  }

  return (
    <BoardSquaresContext.Provider
      value={{
        boardSquares,
        setBoardSquares,
        addPieceToBoard,
        removePieceFromBoard,
        resetBoardSquares,
      }}
    >
      {children}
    </BoardSquaresContext.Provider>
  );
}

export default BoardSquaresProvider;
