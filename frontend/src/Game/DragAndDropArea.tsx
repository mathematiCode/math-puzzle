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
  const { incrementMoves } = useGameProgress();
  const { currentLevel } = useCurrentLevel();
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
      setPreviewLocation(`(${correctedX},${correctedY})`);
    } else {
      setPreviewLocation(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setPreviewLocation(null);
    const id = event.active.id as string;
    const piece = piecesInPlay.find(piece => piece.id === id);
    if (!piece) return;
    if (piece.location != null) {
      const { x, y } = convertLocationToXAndY(piece.location);
      removePieceFromBoard(x, y, piece.width, piece.height, piece.id);
    }
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
      sensors={sensors}
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
