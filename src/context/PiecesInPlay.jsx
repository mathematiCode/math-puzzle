/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from 'react';
// import { colors } from '../CONSTANTS';
export const PiecesInPlayContext = createContext();

import { CurrentLevelContext } from './CurrentLevel.tsx';
const initialLocation = null;

function PiecesInPlayProvider({ children }) {
  const { initialPieces } = useContext(CurrentLevelContext);
  const [piecesInPlay, setPiecesInPlay] = useState(initialPieces);

  function movePiece(pieceIndex, newLocation) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].location = newLocation;
    if (newLocation != null) {
      updatedPieces[pieceIndex].id = `inPlay-${pieceIndex}`;
    } else {
      updatedPieces[pieceIndex].id = `initial-${pieceIndex}`;
    }
    setPiecesInPlay(updatedPieces);
  }

  function updateDimensions(pieceIndex, width, height) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].width = width;
    updatedPieces[pieceIndex].height = height;
    setPiecesInPlay(updatedPieces);
  }

  function resetPieces() {
    const updatedPieces = [...piecesInPlay];
    updatedPieces.forEach((piece, index) => {
      piece.location = initialLocation;
      piece.width = initialPieces[index].width;
      piece.height = initialPieces[index].height;
      piece.id = `initial-${index}`;
      piece.isRotated = false;
    });
    setPiecesInPlay(updatedPieces);
  }

  function rotatePiece(pieceIndex) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].isRotated = !updatedPieces[pieceIndex].isRotated;
    setPiecesInPlay(updatedPieces);
  }

  function setPiecesForNewLevel() {
    setPiecesInPlay(initialPieces);
  }
  return (
    <PiecesInPlayContext.Provider
      value={{
        piecesInPlay,
        movePiece,
        updateDimensions,
        rotatePiece,
        resetPieces,
        setPiecesForNewLevel,
      }}
    >
      {children}
    </PiecesInPlayContext.Provider>
  );
}

export default PiecesInPlayProvider;
