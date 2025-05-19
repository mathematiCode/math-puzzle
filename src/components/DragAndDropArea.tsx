import { useContext, useMemo } from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  createSnapModifier,
  restrictToWindowEdges,
  snapCenterToCursor,
} from '@dnd-kit/modifiers';
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

  const snapToGrid = useMemo(() => createSnapModifier(sizeOfEachUnit), []);

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
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      const newLocation = event.over.id.toString();
      movePiece(pieceIndex, newLocation);
    } else movePiece(pieceIndex, null);
  };
  return (
    <DndContext
      sensors={sensors}
      modifiers={[snapCenterToCursor, snapToGrid]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}

export default DragAndDropArea;
