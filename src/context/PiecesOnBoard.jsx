import { createContext, useState } from 'react';

export const PiecesOnBoardContext = createContext();

function PiecesOnBoardProvider({ children }) {
  const [piecesOnBoard, setPiecesOnBoard] = useState(new Set());

  function addPieceToBoard(newPiece) {
    let newSet = new Set(...piecesOnBoard, newPiece);
    setPiecesOnBoard(newSet);
  }

  function removePieceFromBoard() {}

  function movePieceOnBoard() {}

  function resetPiecesOnBoard() {
    setPiecesOnBoard(new Set());
  }

  return (
    <PiecesOnBoardContext.Provider
      value={
        (piecesOnBoard,
        addPieceToBoard,
        removePieceFromBoard,
        movePieceOnBoard,
        resetPiecesOnBoard)
      }
    >
      {' '}
      {children}
    </PiecesOnBoardContext.Provider>
  );
}

export default PiecesOnBoardProvider;
