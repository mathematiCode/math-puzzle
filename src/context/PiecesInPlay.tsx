/* eslint-disable react/prop-types */
// @ts-nocheck
import { createContext, useState, useContext } from 'react';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from './CurrentLevel.tsx';
import { BoardSquaresContext } from './BoardSquares';
import { colors } from '../CONSTANTS';
import { InitialPiece, Piece } from '../types/piece.ts';
import { convertLocationToXAndY } from '../Game/utils/utilities.ts';
import { getNewValidLocation } from '../Game/utils/getNewValidLocation.ts';
import { useAnimate } from 'motion/dist/react';
import levels from '../Game/levels.json' with { type: 'json' };
import Hotjar from '@hotjar/browser';
import Board from '../components/Board/Board';
import { remove } from 'lodash';
import { X } from 'lucide-react';

export interface PiecesInPlayContextType {
  piecesInPlay: Piece[];
  movePiece: (pieceId: string, newLocation: string | null) => void;
  updateDimensions: (pieceId: string, width: number, height: number) => void;
  rotatePiece: (pieceIndex: number) => void;
  resetPieces: () => void;
  setPiecesForNewLevel: (newPieces?: InitialPiece[]) => void;
  setPieceStability: (pieceId: string, isStable: boolean) => void;
}

export const PiecesInPlayContext =
  createContext<PiecesInPlayContextType | null>(null);
const initialLocation = null;

export function PiecesInPlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialPieces, boardDimensions, currentLevel } =
    useContext<CurrentLevelContextType>(CurrentLevelContext);
  const {
    boardSquares,
    addPieceToBoard,
    removePieceFromBoard,
    resetBoardSquares,
    countOverlappingSquares,
  } = useContext(BoardSquaresContext);
  const [piecesInPlay, setPiecesInPlay] = useState<InitialPiece[] | Piece[]>(
    initialPieces
  );
  const { boardWidth, boardHeight } = boardDimensions;

  function movePiece(pieceId: string, newLocation: string | null) {
    const pieceIndex = piecesInPlay.findIndex(piece => piece.id === pieceId);
    const updatedPieces = [...piecesInPlay];
    const oldLocation = piecesInPlay[pieceIndex].location;
    const { x: oldX, y: oldY } = convertLocationToXAndY(oldLocation);
    const pieceHeight = piecesInPlay[pieceIndex].height;
    const pieceWidth = piecesInPlay[pieceIndex].width;
    let newValidLocation = newLocation;
    if (newLocation != null) {
      const { x, y } = convertLocationToXAndY(newLocation);
      const { correctedX, correctedY } = getNewValidLocation(x, y, pieceWidth, pieceHeight, boardWidth, boardHeight);
      newValidLocation = `(${correctedX},${correctedY})`;
      const { outerOverlaps, innerOverlaps, squaresOutsideBoard } = countOverlappingSquares(
        newValidLocation,
        pieceWidth,
        pieceHeight
      );
      updatedPieces[pieceIndex].location = newValidLocation;
      updatedPieces[pieceIndex].id = `b-${pieceIndex}`;
   
      setPiecesInPlay(updatedPieces);
      if (outerOverlaps + innerOverlaps > 0) {
        updatedPieces[pieceIndex].isStable = false;
        setPiecesInPlay(updatedPieces);
        Hotjar.event('piece placed partially overlapping another piece');
      } else if (squaresOutsideBoard > 0) {
        updatedPieces[pieceIndex].isStable = false;
        setPiecesInPlay(updatedPieces);
        Hotjar.event('piece placed partially off board');
      } else {
        updatedPieces[pieceIndex].isStable = true;
      }
    } else if (newLocation === null) {
      updatedPieces[pieceIndex].location = null;
      updatedPieces[pieceIndex].id = `i-${pieceIndex}`;
      setPiecesInPlay(updatedPieces);
      if (oldLocation !== null) {
        Hotjar.event('move off of board');
      }
    }
  }

  function updateDimensions(pieceId: string, width: number, height: number) {
    const pieceIndex = piecesInPlay.findIndex(piece => piece.id === pieceId);
    if (pieceIndex === -1) {
      console.error('Piece not found');
      return;
    }
    const updatedPieces = [...piecesInPlay];
    const {
      location,
      width: oldWidth,
      height: oldHeight,
    } = piecesInPlay[pieceIndex];
    updatedPieces[pieceIndex].width = width;
    updatedPieces[pieceIndex].height = height;
    if (width > boardWidth || height > boardHeight) {
      updatedPieces[pieceIndex].isStable = false;
    } else {
      updatedPieces[pieceIndex].isStable = true;
    }
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
          id: `i-${index + 1}`,
          isRotated: false,
        })),
      ];
      setPiecesInPlay(piecesAfterReset);
    } catch (error) {
      console.error('Error resetting pieces:', error);
    }
  }


  function setPiecesForNewLevel(newPieces?: InitialPiece[]) {
    setPiecesInPlay(newPieces || initialPieces);
  }

  function setPieceStability(pieceId: string, isStable: boolean) {
    // if pieceId starts with i-${num} create a constant called onBoardId and set it to b-${num}
    const iPattern = /^i-(\d+)$/;
    const match = pieceId.match(iPattern);
    if (match) {
      const num = match[1];
      const onBoardId = `b-${num}`;
    }
    
    // Extract the number from pieceId (removes i- or b- prefix)
    const numberPattern = /^[ib]-(\d+)$/;
    const numberMatch = pieceId.match(numberPattern);
    if (!numberMatch) {
      console.error('Invalid pieceId format');
      return;
    }
    const pieceNumber = numberMatch[1];
    
    // Find piece by number (ignoring prefix)
    const pieceIndex = piecesInPlay.findIndex(piece => {
      const pieceNumberMatch = piece.id.match(/^[ib]-(\d+)$/);
      return pieceNumberMatch && pieceNumberMatch[1] === pieceNumber;
    });
    
    if (pieceIndex === -1) {
      console.error('Piece not found');
      console.log(`Could not find ${pieceId}`)
      console.log(piecesInPlay);
      return;
    }
    const updatedPieces = [...piecesInPlay];
    updatedPieces[pieceIndex].isStable = isStable;
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
      }}
    >
      {children}
    </PiecesInPlayContext.Provider>
  );
}
