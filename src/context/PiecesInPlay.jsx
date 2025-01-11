/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import levels from '../levels.json';
export const PiecesInPlayContext = createContext();

const initialLocation = null;

const futurePiecesList = levels[0].pieces;
futurePiecesList.forEach(piece => {
  piece.location = initialLocation;
});

function PiecesInPlayProvider({ children }) {
  const [piecesInPlay, setPiecesInPlay] = useState(futurePiecesList);

  function movePiece(pieceIndex, newLocation) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].location = newLocation;
    setPiecesInPlay(updatedPieces);
    console.log(updatedPieces);
    console.log(piecesInPlay);
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
