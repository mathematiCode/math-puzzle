import { createContext, useContext, useState, ReactNode } from 'react';
import levels from '../levels.json';

export type BoardSquaresContextType = {
  boardSquares: [][];
  setBoardSquares: (boardSquares: [][]) => void;
};
let currentLevel = 0;
export const BoardSquaresContext =
  createContext<BoardSquaresContextType | null>(null);
const dimensions = levels[currentLevel].dimensions;
const boardSections = levels[currentLevel].boardSections;

function BoardSquaresProvider({ children }: { children: ReactNode }) {
  const [boardSquares, setBoardSquares] = useState<[][]>([]);

  return (
    <BoardSquaresContext.Provider value={{ boardSquares, setBoardSquares }}>
      {children}
    </BoardSquaresContext.Provider>
  );
}

export default BoardSquaresProvider;
