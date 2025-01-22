/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import { initialPieces, colors } from '../CONSTANTS';
export const PiecesInPlayContext = createContext();
const initialLocation = null;

const futurePiecesList = initialPieces.map((piece, index) => ({
  ...piece,
  location: initialLocation,
  color: colors[index % colors.length],
  id: `initial-${index}`,
  isRotated: false,
}));

function PiecesInPlayProvider({ children }) {
  console.log('futurePiecesList', futurePiecesList);
  const [piecesInPlay, setPiecesInPlay] = useState(futurePiecesList);

  function movePiece(pieceIndex, newLocation) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].location = newLocation;
    if (newLocation != null) {
      updatedPieces[pieceIndex].id = `inPlay-${pieceIndex}`;
    } else {
      updatedPieces[pieceIndex].id = `initial-${pieceIndex}`;
    }
    setPiecesInPlay(updatedPieces);
    console.log(updatedPieces);
    console.log('piecesInPlay', piecesInPlay);
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
      console.log('updated Pieces is:', updatedPieces);
      console.log('levels pieces is', initialPieces);
    });
    setPiecesInPlay(updatedPieces);
  }

  function rotatePiece(pieceIndex) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].isRotated = !updatedPieces[pieceIndex].isRotated;
    setPiecesInPlay(updatedPieces);
  }

  return (
    <PiecesInPlayContext.Provider
      value={{
        piecesInPlay,
        movePiece,
        updateDimensions,
        rotatePiece,
        resetPieces,
      }}
    >
      {children}
    </PiecesInPlayContext.Provider>
  );
}

export default PiecesInPlayProvider;
