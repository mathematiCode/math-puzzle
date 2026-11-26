import { createContext, useState, useContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from './CurrentLevel';
import { Piece } from '../types/piece';
import { createInitialPieces, isSample } from '../Game/utils/piece';
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

  // All mutators use the functional update form of setPiecesInPlay. A single
  // event handler (e.g. a drag drop) fires several of these in a row, so each
  // must build on the latest state rather than the stale `piecesInPlay` closure,
  // otherwise later updates clobber earlier ones (e.g. stability overwriting a
  // just-applied location).
  function movePiece(pieceId: string, newLocation: string | null) {
    const piece = piecesInPlay.find(piece => piece.id === pieceId);
    if (!piece) {
      console.error('Piece not found');
      return;
    }
    const oldLocation = piece.location;
    setPiecesInPlay(prevPieces =>
      prevPieces.map(piece =>
        piece.id === pieceId ? { ...piece, location: newLocation } : piece
      )
    );
    if (newLocation == null && oldLocation !== null) {
      Hotjar.event('move off of board');
    }
  }

  function updateDimensions(pieceId: string, newWidth: number, newHeight: number) {
    if (piecesInPlay.findIndex(piece => piece.id === pieceId) === -1) {
      console.error('Piece not found');
      return;
    }
    setPiecesInPlay(prevPieces =>
      prevPieces.map(piece =>
        piece.id === pieceId
          ? { ...piece, width: newWidth, height: newHeight }
          : piece
      )
    );
  }

  function resetPieces() {
    try {
      setPiecesInPlay(createInitialPieces(currentLevel));
    } catch (error) {
      console.error('Error resetting pieces:', error);
    }
  }


  function setPiecesForNewLevel(newPieces?: Piece[]) {
    setPiecesInPlay(newPieces || initialPieces);
  }

  function setPieceStability(pieceId: string, isStable: boolean) {
    const piece = piecesInPlay.find(piece => piece.id === pieceId);
    if (!piece) {
      console.error('Piece not found');
      return;
    }
    if (isSample(piece)) {
      return;
    }
    setPiecesInPlay(prevPieces =>
      prevPieces.map(piece =>
        piece.id === pieceId ? { ...piece, isStable } : piece
      )
    );
  }


  function resetStabilityOfAllPieces() {
    setPiecesInPlay(prevPieces =>
      prevPieces.map(piece => ({ ...piece, isStable: true }))
    );
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