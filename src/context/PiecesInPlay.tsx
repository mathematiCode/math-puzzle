/* eslint-disable react/prop-types */
// @ts-nocheck
import { createContext, useState, useContext } from 'react';
import {
  CurrentLevelContext,
  CurrentLevelContextType,
} from './CurrentLevel.tsx';
import { BoardSquaresContext } from './BoardSquares.tsx';
import { colors } from '../CONSTANTS';
import { InitialPiece, Piece } from '../types/piece.ts';
import { convertLocationToXAndY } from '../utils/utilities.ts';
import { useAnimate } from 'motion/dist/react';
import levels from '../levels.json' with { type: 'json' };
import Hotjar from '@hotjar/browser';
import Board from '../components/Board.tsx';
import { remove } from 'lodash';
import { X } from 'lucide-react';

export interface PiecesInPlayContextType {
  piecesInPlay: Piece[];
  movePiece: (pieceIndex: number, newLocation: string | null) => void;
  updateDimensions: (pieceIndex: number, width: number, height: number) => void;
  rotatePiece: (pieceIndex: number) => void;
  resetPieces: () => void;
  setPiecesForNewLevel: (newPieces?: InitialPiece[]) => void;
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

  function movePiece(pieceIndex: number, newLocation: string | null) {
    const updatedPieces = [...piecesInPlay];
    const oldLocation = piecesInPlay[pieceIndex].location;
    const { x: oldX, y: oldY } = convertLocationToXAndY(oldLocation);
    let newValidLocation = newLocation;
    const pieceHeight = piecesInPlay[pieceIndex].height;
    const pieceWidth = piecesInPlay[pieceIndex].width;
    if (oldLocation != null) {
      removePieceFromBoard(oldX, oldY, pieceWidth, pieceHeight);
    }
    // if moving from off the board to a valid spot on the board
    //  if moving from on the board to another valid spot on the board
    // if moving from off the board to an invalid spot on the board
    // if moving from on the board to an invalid spot on the board

    if (newLocation != null) {
      const { x, y } = convertLocationToXAndY(newValidLocation);
      let correctedX = x;
      let correctedY = y;
      const pieceHeight = piecesInPlay[pieceIndex].height;
      const pieceWidth = piecesInPlay[pieceIndex].width;
      // if (oldLocation === null) {
      //   Hotjar.event('move from initial onto board');
      // } else {
      //   Hotjar.event('move piece already on board to new location');
      // }
      if (correctedX + pieceWidth > boardWidth) {
        correctedX = boardWidth - pieceWidth;
        Hotjar.event('piece placed partially off board on the x axis');
      }
      // I have no idea why adding 1 works here to correct pieces placed below the bottom of the board
      if (y + pieceHeight + 1 > boardHeight) {
        correctedY = boardHeight - pieceHeight;
        Hotjar.event('piece placed partially off board on the y axis');
      }
      newValidLocation = `(${correctedX},${correctedY})`;
      const { outerOverlaps, innerOverlaps } = countOverlappingSquares(
        newValidLocation,
        pieceWidth,
        pieceHeight,
        boardSquares
      );
      updatedPieces[pieceIndex].location = newValidLocation;
      updatedPieces[pieceIndex].id = `inPlay-${pieceIndex}`;
      addPieceToBoard(correctedX, correctedY, pieceWidth, pieceHeight);
      setPiecesInPlay(updatedPieces);
      if (outerOverlaps + innerOverlaps > 0) {
        updatedPieces[pieceIndex].isStable = false;
        setPiecesInPlay(updatedPieces);
        Hotjar.event('piece placed partially overlapping another piece');
        console.log('piece placed partially overlapping another piece');
      } else {
        updatedPieces[pieceIndex].isStable = true;
        console.log('piece placed without overlapping another piece');
      }
    } else if (newLocation === null) {
      updatedPieces[pieceIndex].location = newValidLocation;
      updatedPieces[pieceIndex].id = `initial-${pieceIndex}`;
      setPiecesInPlay(updatedPieces);
      if (oldLocation !== null) {
        Hotjar.event('move off of board');
      }
    }
  }

  function updateDimensions(pieceIndex: number, width: number, height: number) {
    const updatedPieces = [...piecesInPlay];
    const {
      location,
      width: oldWidth,
      height: oldHeight,
    } = piecesInPlay[pieceIndex];
    const { x, y } = convertLocationToXAndY(location);
    try {
      removePieceFromBoard(x, y, oldWidth, oldHeight);
    } catch {
      console.log('Unable to remove piece from board');
    }
    updatedPieces[pieceIndex].width = width;
    updatedPieces[pieceIndex].height = height;
    if (width > boardWidth || height > boardHeight) {
      updatedPieces[pieceIndex].isStable = false;
    } else {
      updatedPieces[pieceIndex].isStable = true;
    }
    try {
      addPieceToBoard(x, y, width, height);
    } catch {
      console.log('Unable to add piece to board');
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
          id: `initial-${index + 1}`,
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
  return (
    <PiecesInPlayContext.Provider
      value={{
        piecesInPlay,
        movePiece,
        updateDimensions,
        resetPieces,
        setPiecesForNewLevel,
      }}
    >
      {children}
    </PiecesInPlayContext.Provider>
  );
}
