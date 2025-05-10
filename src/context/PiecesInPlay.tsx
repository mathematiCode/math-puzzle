/* eslint-disable react/prop-types */

import { createContext, useState, useContext } from 'react';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from './CurrentLevel.tsx';
// import { colors } from '../CONSTANTS';
import { InitialPiece, Piece } from '../types/piece.ts';
import { convertLocationToXAndY } from '../utilities.ts';
import { useAnimate } from 'motion/dist/react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';
import { useSelectedPiece } from './SelectedPiece.tsx';

export type PiecesInPlayContextType = {
  piecesInPlay: Piece[];
  movePiece: (pieceIndex: number, newLocation: string) => void;
  updateDimensions: (pieceIndex: number, width: number, height: number) => void;
  rotatePiece: (pieceIndex: number) => void;
  resetPieces: () => void;
  setPiecesForNewLevel: () => void;
};

export const PiecesInPlayContext =
  createContext<PiecesInPlayContextType | null>(null);
const initialLocation = null;

function PiecesInPlayProvider({ children }: { children: React.ReactNode }) {
  const { initialPieces, boardDimensions, currentLevel } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const { setSelectedPiece } = useSelectedPiece();
  const [piecesInPlay, setPiecesInPlay] = useState<InitialPiece[] | Piece[]>(
    initialPieces
  );
  const { boardWidth, boardHeight } = boardDimensions;

  function movePiece(pieceIndex: number, newLocation: string) {
    const updatedPieces = [...piecesInPlay];
    let newValidLocation = newLocation;
    if (newValidLocation != null) {
      const { x, y } = convertLocationToXAndY(newValidLocation);
      const pieceHeight = piecesInPlay[pieceIndex].height;
      const pieceWidth = piecesInPlay[pieceIndex].width;
      if (y + pieceHeight + 1 > boardHeight) {
        newValidLocation = `(${x},${boardHeight - pieceHeight})`;
      }
      if (x + pieceWidth > boardWidth) {
        newValidLocation = `(${boardWidth - pieceWidth},${y})`;
      }
    }
    updatedPieces[pieceIndex].location = newValidLocation;
    if (newValidLocation != null) {
      updatedPieces[pieceIndex].id = `inPlay-${pieceIndex}`;
    } else {
      updatedPieces[pieceIndex].id = `initial-${pieceIndex}`;
    }
    setPiecesInPlay(updatedPieces);
  }

  function updateDimensions(pieceIndex: number, width: number, height: number) {
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].width = width;
    updatedPieces[pieceIndex].height = height;
    setPiecesInPlay(updatedPieces);
    console.log(`Reset piece ${pieceIndex} to have width:${width} and height:${height}`)
  }

  function resetPieces() {
    const initialLocation = null;
    console.log('resetPieces has been called.')
    try {
      const piecesAfterReset = [
        {
          width: 3,
          height: 2,
          location: 'instructions',
          color: 'hsl(0, 61%, 66%)',
          id: 'sample-0',
          isRotated: false,
        },
        ...levels[currentLevel].pieces.map((piece, index) => ({
          ...piece,
          location: initialLocation,
          color: colors[index % colors.length],
          id: `initial-${index + 1}`,
          isRotated: false,
        }))
      ];
      console.log(piecesInPlay);
      console.log(piecesAfterReset);
      setPiecesInPlay(piecesAfterReset);
      throw new Error('You\'re doing great!');
    } finally {
      console.log('You\'re doing wonderfully!');
      setSelectedPiece(null);
    }
  }

  function rotatePiece(pieceIndex: number) {
    const updatedPieces = [...piecesInPlay];
    // updatedPieces[pieceIndex].isRotated = !updatedPieces[pieceIndex].isRotated;

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
