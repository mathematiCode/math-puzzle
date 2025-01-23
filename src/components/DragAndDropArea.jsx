import { useContext, useMemo } from 'react';
// import { initialPieces, sizeOfEachUnit, currentLevel } from './CONSTANTS';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
} from '@dnd-kit/core';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { CurrentLevelContext } from '../context/CurrentLevel';
import { PiecesInPlayContext } from '../context/PiecesInPlay';

function DragAndDropArea({ children, setActivePiece }) {
  const { setSelectedPiece } = useContext(SelectedPieceContext);
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const { piecesInPlay, movePiece } = useContext(PiecesInPlayContext);

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

  const handleDragStart = event => {
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    setActivePiece(piecesInPlay[pieceIndex]);
    setSelectedPiece(piecesInPlay[pieceIndex]);
  };

  const handleDragEnd = event => {
    const id = event.active.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    if (event?.over?.id) {
      const newLocation = event.over.id;
      movePiece(pieceIndex, newLocation);
    } else movePiece(pieceIndex, null);
  };
  return (
    <DndContext
      sensors={sensors}
      modifiers={[snapToGrid]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}

export default DragAndDropArea;
