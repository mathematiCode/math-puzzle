import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { usePiecesInPlay } from '../context/PiecesInPlay';
import { Piece } from '../types/piece';
import { useSelectedPiece } from '../context/SelectedPiece';
import {
  convertLocationToXAndY,
  isPlacementFullyOnBoard,
  rateDroppability,
  RETURN_TO_CONTAINER_DURATION,
} from './utils/utilities';
import Hotjar from '@hotjar/browser';
import { useBoardSquares } from '../context/BoardSquares';
import { getNewValidLocation } from './utils/getNewValidLocation';
import { useLevelStatus } from '../hooks/useLevelStatus';
import { usePieceStabilitySetter } from '../hooks/usePieceStabilitySetter';
import { useGameProgress } from '../context/GameProgress';
import { useCurrentLevel } from '../context/CurrentLevel';

interface DragAndDropAreaProps {
  children: React.ReactNode;
  setActivePiece: (piece: Piece) => void;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  setPreviewLocation: (location: string | null) => void;
  setReturningPieceId: (id: string | null) => void;
}

function DragAndDropArea({
  children,
  setActivePiece,
  isRotating,
  setIsRotating,
  setPreviewLocation,
  setReturningPieceId,
}: DragAndDropAreaProps) {
  const { setSelectedPiece } = useSelectedPiece();
  const { piecesInPlay, movePiece, setPieceStability } = usePiecesInPlay();
  const { updateStabilityAllPieces } = usePieceStabilitySetter();
  const {
    boardSquares,
    addPieceToBoard,
    removePieceFromBoard,
    getUnstablePieces,
    countOverlappingSquares,
  } = useBoardSquares();
  const { checkAndHandleLevelStatus } = useLevelStatus();
  const { incrementMoves, isLevelCompleted } = useGameProgress();
  const { currentLevel } = useCurrentLevel();
  // Once a level is completed, lock the pieces in place so the player can't
  // nudge the solution apart and back together (which would skip the
  // LevelCompleteModal). Resetting the level re-enables dragging.
  const isLevelLocked = isLevelCompleted(currentLevel);
  function compareCollisionRects(
    { data: { value: a } }: { data: { value: number } },
    { data: { value: b } }: { data: { value: number } }
  ) {
    return b - a;
  }

  function customCollisionDetection(args: any) {
    const { collisionRect } = args;
    const x = collisionRect.left;
    const y = collisionRect.top;

    let potentialDroppables: any = rectIntersection(args);
    if (potentialDroppables[0]) {
      potentialDroppables.forEach((droppable: any) => {
        const droppableRect = droppable.data.droppableContainer.rect.current;
        droppable.data.value = rateDroppability(x, y, droppableRect);
      });
    }
    return potentialDroppables.sort(compareCollisionRects);
  }

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // const snapToGrid = useMemo(
  //   () => createSnapModifier(sizeOfEachUnit),
  //   [sizeOfEachUnit]
  // );
  // const snapToGrid = createSnapModifier(sizeOfEachUnit);
  // function snapToGrid(sizeOfEachUnit: number) {
  //   const { transform } = sizeOfEachUnit;

  //   return {
  //     ...transform,
  //     x: Math.ceil(transform.x / sizeOfEachUnit) * sizeOfEachUnit,
  //     y: Math.ceil(transform.y / sizeOfEachUnit) * sizeOfEachUnit,
  //   };
  // }

  // const snapToGrid = function createSnapModifier(gridSize: number): Modifier {
  //   return ({ transform }) => ({
  //     ...transform,
  //     x: Math.ceil(transform.x / gridSize) * gridSize,
  //     y: Math.ceil(transform.y / gridSize) * gridSize,
  //   });
  // }

  const activationConstraint = {
    distance: 20,
  };
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const piece = piecesInPlay.find(p => p.id === id);
    if (!piece) return;
    if (isRotating) {
      setTimeout(() => {
        setActivePiece(piece);
        setSelectedPiece(piece);
        setIsRotating(false);
      }, 500);
    } else {
      setActivePiece(piece);
      setSelectedPiece(piece);
    }
    Hotjar.event('drag start');
  };

  // Show a translucent preview of where the piece would land as it is dragged
  // over the board, so the player can see the drop target before releasing.
  const handleDragOver = (event: DragOverEvent) => {
    const id = event.active.id as string;
    const piece = piecesInPlay.find(p => p.id === id);
    if (!piece) {
      setPreviewLocation(null);
      return;
    }
    if (event.over?.id) {
      const { x, y } = convertLocationToXAndY(event.over.id.toString());
      const boardWidth = boardSquares[0].length;
      const boardHeight = boardSquares.length;
      const { correctedX, correctedY } = getNewValidLocation(
        x,
        y,
        piece.width,
        piece.height,
        boardWidth,
        boardHeight
      );
      // Only preview locations where the piece would land entirely on the
      // board. On a non-rectangular board a piece can be inside the bounding
      // box yet still hang over off-shape squares; hiding the preview tells
      // the player that spot isn't a valid drop target (issue #59).
      if (
        isPlacementFullyOnBoard(
          boardSquares,
          correctedX,
          correctedY,
          piece.width,
          piece.height
        )
      ) {
        setPreviewLocation(`(${correctedX},${correctedY})`);
      } else {
        setPreviewLocation(null);
      }
    } else {
      setPreviewLocation(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setPreviewLocation(null);
    const id = event.active.id as string;
    const piece = piecesInPlay.find(piece => piece.id === id);
    if (!piece) return;
    const originalLocation = piece.location;

    if (event.over?.id) {
      const newLocation = event.over.id.toString();
      const { x, y } = convertLocationToXAndY(newLocation);
      const boardWidth = boardSquares[0].length;
      const boardHeight = boardSquares.length;
      const { correctedX, correctedY } = getNewValidLocation(
        x,
        y,
        piece.width,
        piece.height,
        boardWidth,
        boardHeight
      );
      // Reject drops that would leave the piece hanging off the board. On a
      // non-rectangular board the clamped location can still cover off-shape
      // squares, so without this check a piece dragged in from outside could
      // be placed partially off the board (issue #59). The piece stays where
      // it was and the DragOverlay animates it back to its origin.
      if (
        !isPlacementFullyOnBoard(
          boardSquares,
          correctedX,
          correctedY,
          piece.width,
          piece.height
        )
      ) {
        Hotjar.event('piece drop rejected off board');
        Hotjar.event('drag end');
        return;
      }
      if (originalLocation != null) {
        const { x: oldX, y: oldY } = convertLocationToXAndY(originalLocation);
        removePieceFromBoard(oldX, oldY, piece.width, piece.height, piece.id);
      }
      const newValidLocation = `(${correctedX},${correctedY})`;
      movePiece(id, newValidLocation);
      const { outerOverlaps, innerOverlaps, squaresOutsideBoard } =
        countOverlappingSquares(newValidLocation, piece.width, piece.height);
      if (outerOverlaps + innerOverlaps + squaresOutsideBoard > 0) {
        setPieceStability(id, false);
      } else {
        setPieceStability(id, true);
      }
      addPieceToBoard(
        correctedX,
        correctedY,
        piece.width,
        piece.height,
        piece.id
      );
      // A piece landing on the board counts as a move (issue #115).
      incrementMoves(currentLevel);
    } else {
      if (originalLocation != null) {
        const { x: oldX, y: oldY } = convertLocationToXAndY(originalLocation);
        removePieceFromBoard(oldX, oldY, piece.width, piece.height, piece.id);
      }
      // Dropped back into the initial pieces container. The DragOverlay plays a
      // drop animation from the release point to the piece's home slot; keep the
      // real piece hidden until that animation finishes so the piece doesn't
      // appear in its final place immediately alongside the animated copy
      // (issue #84).
      movePiece(id, null);
      if (piece.location == null) {
        setReturningPieceId(id);
        setTimeout(
          () => setReturningPieceId(null),
          RETURN_TO_CONTAINER_DURATION
        );
      }
    }
    Hotjar.event('drag end');
    updateStabilityAllPieces();
    checkAndHandleLevelStatus();
  };

  return (
    <DndContext
      sensors={isLevelLocked ? [] : sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setPreviewLocation(null)}
      collisionDetection={customCollisionDetection}
    >
      {children}
    </DndContext>
  );
}

export default DragAndDropArea;
