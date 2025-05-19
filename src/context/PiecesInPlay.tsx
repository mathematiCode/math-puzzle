/* eslint-disable react/prop-types */
// @ts-nocheck
import { createContext, useState, useContext } from 'react';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from './CurrentLevel.tsx';
import { colors } from '../CONSTANTS';
import { InitialPiece, Piece } from '../types/piece.ts';
import { convertLocationToXAndY } from '../utilities.ts';
import { useAnimate } from 'motion/dist/react';
import levels from '../levels.json';

export type PiecesInPlayContextType = {
  piecesInPlay: Piece[];
  movePiece: (pieceIndex: number, newLocation: string | null) => void;
  updateDimensions: (pieceIndex: number, width: number, height: number) => void;
  rotatePiece: (pieceIndex: number) => void;
  resetPieces: () => void;
  setPiecesForNewLevel: (newPieces?: InitialPiece[]) => void;
};

export const PiecesInPlayContext =
  createContext<PiecesInPlayContextType | null>(null);
const initialLocation = null;

function PiecesInPlayProvider({ children }: { children: React.ReactNode }) {
  const { initialPieces, boardDimensions, currentLevel } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const [piecesInPlay, setPiecesInPlay] = useState<InitialPiece[] | Piece[]>(
    initialPieces
  );
  const { boardWidth, boardHeight } = boardDimensions;

  function movePiece(pieceIndex: number, newLocation: string | null) {
    const updatedPieces = [...piecesInPlay];
    const oldLocation = updatedPieces[pieceIndex].location;
    let newValidLocation = newLocation;
    if (newValidLocation != null) {
      const { x, y } = convertLocationToXAndY(newValidLocation);
      let correctedX = x;
      let correctedY = y;
      const pieceHeight = piecesInPlay[pieceIndex].height;
      const pieceWidth = piecesInPlay[pieceIndex].width;
      if (oldLocation === null) {
        if (pieceWidth > 1 && x > 0) {
          correctedX = x - 1; // Temporary fix for pieces shifting one to the right when dragged from initial container
        }
      }
      if (correctedX + pieceWidth > boardWidth) {
        correctedX = boardWidth - pieceWidth;
      }
      // I have no idea why adding 1 works here to correct pieces placed below the bottom of the board
      if (y + pieceHeight + 1 > boardHeight) {
        correctedY = boardHeight - pieceHeight;
      }
      newValidLocation = `(${correctedX},${correctedY})`;
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
  }

  function resetPieces() {
    const initialLocation = null;
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
        })),
      ];
      setPiecesInPlay(piecesAfterReset);
    } catch (error) {
      console.error('Error resetting pieces:', error);
    }
  }

  function rotatePiece(pieceIndex: number) {
    const updatedPieces = [...piecesInPlay];
    // updatedPieces[pieceIndex].isRotated = !updatedPieces[pieceIndex].isRotated;

    setPiecesInPlay(updatedPieces);
  }

  function setPiecesForNewLevel(newPieces?: InitialPiece[]) {
    setPiecesInPlay(newPieces || initialPieces);
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
