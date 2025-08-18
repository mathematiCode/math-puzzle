import { useContext } from 'react';
import {
  BoardSquaresContext,
  BoardSquaresContextType,
} from '../context/BoardSquares';

export function useBoardSquares(): BoardSquaresContextType {
  const context = useContext(BoardSquaresContext);

  if (!context) {
    throw new Error(
      'useBoardSquares must be used within a BoardSquaresProvider'
    );
  }

  return context;
}
