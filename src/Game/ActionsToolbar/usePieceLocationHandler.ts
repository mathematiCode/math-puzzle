import { Piece } from '../../types/piece';
import { convertLocationToXAndY } from '../utils/utilities';
import { getNewValidLocation } from '../utils/getNewValidLocation';
import { useContext } from 'react';
import { BoardSquaresContext } from '../../context/BoardSquares';
import Hotjar from '@hotjar/browser';
import { PiecesInPlayContext } from '../../context/PiecesInPlay';

export function usePieceLocationHandler() {
  const boardSquaresContext = useContext(BoardSquaresContext);
  if (!boardSquaresContext) {
    throw new Error(
      'UpdateLocationAndBoardSquares must be used within a BoardSquaresProvider'
    );
  }
  // const piecesInPlayContext = useContext(PiecesInPlayContext);
  // if (!piecesInPlayContext) {
  //   throw new Error(
  //     'UpdateLocationAndBoardSquares must be used within a PiecesInPlayProvider'
  //   );
  // }
  const {
    boardSquares,
    countOverlappingSquares,
    removePieceFromBoard,
    addPieceToBoard,
  } = boardSquaresContext;
  // const { setPieceStability } = piecesInPlayContext;

  const updateLocationAndBoardSquares = (
    selectedPiece: Piece,
    newWidth: number,
    newHeight: number,
    movePiece: (pieceId: string, newLocation: string | null) => void
  ) => {
    const boardWidth = boardSquares[0].length;
    const boardHeight = boardSquares.length;
    let { x, y } = convertLocationToXAndY(selectedPiece.location ?? '');
    const { innerOverlaps, outerOverlaps, squaresOutsideBoard } =
      countOverlappingSquares(
        selectedPiece.location ?? '',
        newWidth,
        newHeight
      );
    if (innerOverlaps + outerOverlaps > 0) {
      Hotjar.event('Collision alert');
      // setPieceStability(selectedPiece.id, false);
    } else if (squaresOutsideBoard > 0) {
      Hotjar.event('Piece placed partially off board');
      const { correctedX, correctedY } = getNewValidLocation(
        x,
        y,
        newWidth,
        newHeight,
        boardWidth,
        boardHeight
      );
      console.log(
        `possibly moving piece ${selectedPiece.id} to (${correctedX},${correctedY})`
      );
      movePiece(
        selectedPiece.id ?? 'invalidId',
        `(${correctedX},${correctedY})`
      );
      x = correctedX;
      y = correctedY;
    }
    removePieceFromBoard(
      x,
      y,
      selectedPiece.width,
      selectedPiece.height,
      selectedPiece.id ?? ''
    );
    const { correctedX, correctedY } = getNewValidLocation(
      x,
      y,
      newWidth,
      newHeight,
      boardWidth,
      boardHeight
    );
    movePiece(selectedPiece.id, `(${correctedX},${correctedY})`);
    console.log(
      `moving piece ${selectedPiece.id} to (${correctedX},${correctedY})`
    );
    x = correctedX;
    y = correctedY;
    addPieceToBoard(x, y, newWidth, newHeight, selectedPiece.id ?? '');
  };

  return { updateLocationAndBoardSquares };
}
