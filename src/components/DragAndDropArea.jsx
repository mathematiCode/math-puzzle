import { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
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
import useSnapToGrid from '../hooks/useSnapToGrid';
import { useElementPosition } from '../hooks/useItemPosition';

function DragAndDropArea({ children, setActivePiece, boardRef }) {
  const { setSelectedPiece } = useContext(SelectedPieceContext);
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const { piecesInPlay, movePiece } = useContext(PiecesInPlayContext);

  const boardPosition = useElementPosition(boardRef);
  const snapToGrid = useSnapToGrid(sizeOfEachUnit, boardPosition);

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

DragAndDropArea.propTypes = {
  children: PropTypes.node.isRequired,
  setActivePiece: PropTypes.func.isRequired,
  boardRef: PropTypes.object,
};

export default DragAndDropArea;
