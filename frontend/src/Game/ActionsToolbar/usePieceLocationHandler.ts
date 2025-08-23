import { Piece } from '../../types/piece';
import { convertLocationToXAndY } from '../utils/utilities';
import { getNewValidLocation } from '../utils/getNewValidLocation';
import { useBoardSquares } from '../../context/BoardSquares';
import { useCallback } from 'react';
import Hotjar from '@hotjar/browser';

export function usePieceLocationHandler() {
  const {
    boardSquares,
    countOverlappingSquares,
    removePieceFromBoard,
    addPieceToBoard,
  } = useBoardSquares();
  const updateLocationAndBoardSquares = useCallback(
    (
      selectedPiece: Piece,
      newWidth: number,
      newHeight: number,
      movePiece: (pieceId: string, newLocation: string | null) => void
    ) => {
      const boardWidth = boardSquares[0].length;
      const boardHeight = boardSquares.length;
      let { x, y } = convertLocationToXAndY(selectedPiece.location);
      removePieceFromBoard(
        x,
        y,
        selectedPiece.width,
        selectedPiece.height,
        selectedPiece.id
      );
      const { innerOverlaps, outerOverlaps, squaresOutsideBoard } =
        countOverlappingSquares(
          selectedPiece.location ?? 'invalidLocation',
          newWidth,
          newHeight
        );
      if (innerOverlaps + outerOverlaps > 0) {
        Hotjar.event('Collision alert');
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
        movePiece(selectedPiece.id, `(${correctedX},${correctedY})`);
        x = correctedX;
        y = correctedY;
      }
      addPieceToBoard(x, y, newWidth, newHeight, selectedPiece.id);
    },
    [
      boardSquares,
      countOverlappingSquares,
      removePieceFromBoard,
      addPieceToBoard,
    ]
  );

  return { updateLocationAndBoardSquares };
}
