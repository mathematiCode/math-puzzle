/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import levels from '../levels.json';
export const PiecesInPlayContext = createContext();

const initialLocation = null;
const colors = [
  'hsl(178, 100%, 32%)',
  'hsl(0, 61%, 66%)',
  '	hsl(185, 78%, 80%)',
  'hsl(38, 87%, 66%)',
];

const futurePiecesList = levels[0].pieces;
futurePiecesList.forEach((piece, index) => {
  piece.location = initialLocation;
  piece.color = colors[index % colors.length];
  piece.id = `initial-${index}`;
  piece.isRotated = false;
});

function PiecesInPlayProvider({ children }) {
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
      piece.width = levels[0].pieces[index].width;
      piece.height = levels[0].pieces[index].height;
      piece.id = `initial-${index}`;
      piece.isRotated = false;
      console.log('updated Pieces is:', updatedPieces);
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
