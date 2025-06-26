import { useContext, useMemo } from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  closestCenter,
  closestCorners,
  rectIntersection,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CurrentLevelContext } from '../context/CurrentLevel.tsx';
import { PiecesInPlayContext } from '../context/PiecesInPlay.tsx';
import { Piece } from '../types/piece';
import { useSelectedPiece } from '../context/SelectedPiece.tsx';

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
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const context = useContext(PiecesInPlayContext);
  if (!context) {
    throw new Error(
      'DragAndDropArea must be used within a PiecesInPlayProvider'
    );
  }

  const { piecesInPlay, movePiece } = context;

  function debugCollisionDetection(args) {
    console.log('Collision detection args:', args);

    // Still need to return actual collision results
    // So just use the default rectangle intersection
    return rectIntersection(args);
  }

  const snapToGrid = useMemo(
    () => createSnapModifier(sizeOfEachUnit),
    [sizeOfEachUnit]
  );
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const id = event.active.id as string;
    console.log('event.over', event.over);
    console.log('sizeOfEachUnit', sizeOfEachUnit);
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      const newLocation = event.over.id.toString();
      console.log(newLocation);
      movePiece(pieceIndex, newLocation);
    } else movePiece(pieceIndex, null);
  };
  return (
    <DndContext
      sensors={sensors}
<<<<<<< Updated upstream
      modifiers={[snapToGrid]}
=======
>>>>>>> Stashed changes
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={debugCollisionDetection}
    >
      {children}
    </DndContext>
  );
}

export default DragAndDropArea;
