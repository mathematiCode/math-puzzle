import { useCallback } from 'react';
import Hotjar from '@hotjar/browser';
import { Cut, Piece } from '../types/piece';
import { createSplitPieces, isOnBoard } from '../Game/utils/piece';
import { convertLocationToXAndY } from '../Game/utils/utilities';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { useBoardSquares } from '../context/BoardSquares';
import { useSelectedPiece } from '../context/SelectedPiece';
import { useCuttingPiece } from '../context/CuttingPiece';
import { useCurrentLevel } from '../context/CurrentLevel';
import { useGameProgress } from '../context/GameProgress';
import { useLevelStatus } from './useLevelStatus';
import { usePieceStabilitySetter } from './usePieceStabilitySetter';

/**
 * Splits a piece into two along a cut: builds the two children, updates the
 * board squares (when the piece is on the board the children tile its exact
 * footprint), replaces the parent in piecesInPlay, and runs the same
 * bookkeeping the other piece actions do (stability, level-status check, move
 * count). Mirrors the stretch flow in ActionsToolbarPopover.
 */
export function useSplitPiece() {
  const { splitPiece } = usePiecesInPlay();
  const { addPieceToBoard, removePieceFromBoard } = useBoardSquares();
  const { setSelectedPiece } = useSelectedPiece();
  const { setCuttingPieceId } = useCuttingPiece();
  const { currentLevel } = useCurrentLevel();
  const { incrementMoves } = useGameProgress();
  const { checkAndHandleLevelStatus } = useLevelStatus();
  const { updateStabilityAllPieces } = usePieceStabilitySetter();

  const performSplit = useCallback(
    (piece: Piece, cut: Cut) => {
      const [childA, childB] = createSplitPieces(piece, cut);

      if (isOnBoard(piece)) {
        const { x, y } = convertLocationToXAndY(piece.location);
        removePieceFromBoard(x, y, piece.width, piece.height, piece.id);
        const a = convertLocationToXAndY(childA.location);
        addPieceToBoard(a.x, a.y, childA.width, childA.height, childA.id);
        const b = convertLocationToXAndY(childB.location);
        addPieceToBoard(b.x, b.y, childB.width, childB.height, childB.id);
      }

      splitPiece(piece.id, childA, childB);
      updateStabilityAllPieces();
      checkAndHandleLevelStatus();
      incrementMoves(currentLevel);

      // The parent piece no longer exists; clear the selection and exit cut mode.
      setSelectedPiece(null);
      setCuttingPieceId(null);
      Hotjar.event('separate pieces successfully');
      return { childA, childB };
    },
    [
      splitPiece,
      addPieceToBoard,
      removePieceFromBoard,
      updateStabilityAllPieces,
      checkAndHandleLevelStatus,
      incrementMoves,
      currentLevel,
      setSelectedPiece,
      setCuttingPieceId,
    ]
  );

  return { performSplit };
}
