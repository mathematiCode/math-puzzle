import { createContext, useState, useContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from './CurrentLevel';
import { colors } from '../CONSTANTS';
import { Piece } from '../types/piece';
import levels from '../Game/levels.json' with { type: 'json' };
import Hotjar from '@hotjar/browser';

export interface PiecesInPlayContextType {
  piecesInPlay: Piece[];
  movePiece: (pieceId: string, newLocation: string | null) => void;
  updateDimensions: (pieceId: string, width: number, height: number) => void;
  resetPieces: () => void;
  setPiecesForNewLevel: (newPieces?: Piece[]) => void;
  setPieceStability: (pieceId: string, isStable: boolean) => void;
  resetStabilityOfAllPieces: () => void;
}

export const PiecesInPlayContext =
  createContext<PiecesInPlayContextType | null>(null);

export function PiecesInPlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialPieces, currentLevel } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const [piecesInPlay, setPiecesInPlay] = useLocalStorageState<Piece[]>(
    'piecesInPlay', {
    defaultValue: initialPieces
  });

  function movePiece(pieceId: string, newLocation: string | null) {
    const pieceIndex = piecesInPlay.findIndex(piece => piece.id === pieceId);
    if (pieceIndex === -1) {
      console.error('Piece not found');
      return;
    }
    const updatedPieces = [...piecesInPlay];
    const oldLocation = piecesInPlay[pieceIndex].location;
    if (newLocation != null) {
      updatedPieces[pieceIndex].location = newLocation;
      setPiecesInPlay(updatedPieces);
    } else {
      updatedPieces[pieceIndex].location = null;
      setPiecesInPlay(updatedPieces);
      if (oldLocation !== null) {
        Hotjar.event('move off of board');
      }
    }
  }

  function updateDimensions(pieceId: string, newWidth: number, newHeight: number) {
    const pieceIndex = piecesInPlay.findIndex(piece => piece.id === pieceId);
    if (pieceIndex === -1) {
      console.error('Piece not found');
      return;
    }
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].width = newWidth;
    updatedPieces[pieceIndex].height = newHeight;
    if (pieceId === 'sample-0') {
      setPiecesInPlay(updatedPieces);
      return;
    }
    setPiecesInPlay(updatedPieces);
  }

  function resetPieces() {
    const initialLocation = null;
    try {
      const piecesAfterReset: Piece[] = [
        {
          width: 3,
          height: 2,
          location: 'instructions',
          color: 'hsl(0, 61%, 66%)',
          id: 'sample-0',
          isRotated: false,
          isStable: true
        },
        ...levels[currentLevel].pieces.map((piece, index) => ({
          ...piece,
          location: initialLocation,
          color: colors[index % colors.length],
          id: `i-${index + 1}`,
          isRotated: false,
          isStable: true
        })),
      ];
      setPiecesInPlay(piecesAfterReset);
    } catch (error) {
      console.error('Error resetting pieces:', error);
    }
  }


  function setPiecesForNewLevel(newPieces?: Piece[]) {
    setPiecesInPlay(newPieces || initialPieces);
  }

  function setPieceStability(pieceId: string, isStable: boolean) {
    if (pieceId === 'sample-0') {
      return;
    }
    const pieceIndex = piecesInPlay.findIndex(piece => piece.id === pieceId);
    if (pieceIndex === -1) {
      console.error('Piece not found');
      return;
    }
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].isStable = isStable;
    setPiecesInPlay(updatedPieces);
  }


  function resetStabilityOfAllPieces() {
    const updatedPieces = [...piecesInPlay];
    updatedPieces.forEach(piece => {
      piece.isStable = true;
    });
    setPiecesInPlay(updatedPieces);
  }
   
    
  return (
    <PiecesInPlayContext.Provider
      value={{
        piecesInPlay,
        movePiece,
        updateDimensions,
        resetPieces,
        setPiecesForNewLevel,
        setPieceStability,
        resetStabilityOfAllPieces,
      }}
    >
      {children}
    </PiecesInPlayContext.Provider>
  );
}

export const usePiecesInPlay = () => {
  const context = useContext<PiecesInPlayContextType | null>(PiecesInPlayContext);
  if (!context) {
    throw new Error('usePiecesInPlay must be used within a PiecesInPlayProvider');
  }
  return context;
};