import { useContext, useMemo } from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
// import { createSnapModifier } from '@dnd-kit/modifiers';
// import { CurrentLevelContext } from '../context/CurrentLevel';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { Piece } from '../types/piece';
import { useSelectedPiece } from '../context/SelectedPiece';
import { convertLocationToXAndY, rateDroppability } from '../utils/utilities';
import Hotjar from '@hotjar/browser';
import { BoardSquaresContext } from '../context/BoardSquares';
import { getNewValidLocation } from '../utils/getNewValidLocation';
interface DragAndDropAreaProps {
  children: React.ReactNode;
  setActivePiece: (piece: Piece) => void;
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
}

function DragAndDropArea({
  children,
  setActivePiece,
  isRotating,
  setIsRotating,
}: DragAndDropAreaProps) {
  const { setSelectedPiece } = useSelectedPiece();
  // const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const context = useContext(PiecesInPlayContext);
  if (!context) {
    throw new Error(
      'DragAndDropArea must be used within a PiecesInPlayProvider'
    );
  }

  const { piecesInPlay, movePiece } = context;
  const boardSquaresContext = useContext(BoardSquaresContext);
  if (!boardSquaresContext) {
    throw new Error(
      'DragAndDropArea must be used within a BoardSquaresProvider'
    );
  }
  const {
    boardSquares,
    addPieceToBoard,
    removePieceFromBoard,
    getUnstablePieces,
  } = boardSquaresContext;

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
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (isRotating) {
      setTimeout(() => {
        setActivePiece(piecesInPlay[pieceIndex]);
        setSelectedPiece(piecesInPlay[pieceIndex]);
        setIsRotating(false);
      }, 500);
    } else {
      setActivePiece(piecesInPlay[pieceIndex]);
      setSelectedPiece(piecesInPlay[pieceIndex]);
    }
    Hotjar.event('drag start');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const id = event.active.id as string;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    const { x, y } = convertLocationToXAndY(piecesInPlay[pieceIndex].location);
    if (piecesInPlay[pieceIndex].location != null) {
      removePieceFromBoard(
        x,
        y,
        piecesInPlay[pieceIndex].width,
        piecesInPlay[pieceIndex].height,
        piecesInPlay[pieceIndex].id ?? ''
      );
    }
    if (event?.over?.id) {
      const newLocation = event.over.id.toString();
      const { x, y } = convertLocationToXAndY(newLocation);
      const boardWidth = boardSquares[0].length;
      const boardHeight = boardSquares.length;
      const { correctedX, correctedY } = getNewValidLocation(
        x,
        y,
        piecesInPlay[pieceIndex].width,
        piecesInPlay[pieceIndex].height,
        boardWidth,
        boardHeight
      );
      movePiece(pieceIndex, `(${correctedX},${correctedY})`);
      addPieceToBoard(
        correctedX,
        correctedY,
        piecesInPlay[pieceIndex].width,
        piecesInPlay[pieceIndex].height,
        piecesInPlay[pieceIndex].id ?? ''
      );
    } else movePiece(pieceIndex, null);
    const unstablePieces = getUnstablePieces();
    piecesInPlay.forEach(piece => {
      if (unstablePieces.includes(piece.id)) {
        piece.isStable = false;
      } else {
        piece.isStable = true;
      }
    });
    Hotjar.event('drag end');
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={customCollisionDetection}
    >
      {children}
    </DndContext>
  );
}

export default DragAndDropArea;
