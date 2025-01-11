/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import levels from '../levels.json';
export const PiecesInPlayContext = createContext();

function PiecesInPlayProvider({ children }) {
  const initialLocation = null;

  const futurePiecesList = levels[0].pieces;
  futurePiecesList.forEach(piece => {
    piece.location = initialLocation;
  });

  const [piecesInPlay, setPiecesInPlay] = useState(futurePiecesList);

  function movePiece(pieceIndex, newLocation) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].location = newLocation;
    setPiecesInPlay(updatedPieces);
    console.log(updatedPieces);
  }

  function resetPieces() {
    const updatedPieces = [...piecesInPlay];
    updatedPieces.forEach(piece => {
      piece.location = initialLocation;
    });
    setPiecesInPlay(updatedPieces);
  }

  return (
    <PiecesInPlayContext.Provider
      value={{ piecesInPlay, movePiece, resetPieces }}
    >
      {children}
    </PiecesInPlayContext.Provider>
  );
}

export default PiecesInPlayProvider;
