/* eslint-disable react/prop-types */
import { useDraggable } from '@dnd-kit/core';
import Rectangle from './Rectangle';
import { memo, useContext } from 'react';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { motion } from 'motion/react';

import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { RotateRightOutlined } from '@ant-design/icons';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { CurrentLevelContext } from '../context/CurrentLevel';

function PieceOnBoard({ piece, id }) {
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { piecesInPlay, updateDimensions, rotatePiece } =
    useContext(PiecesInPlayContext);
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);

  function handleRotation() {
    const id = selectedPiece.id;
    const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
    rotatePiece(pieceIndex);
  }

  function handleHorizontalStretch() {
    if (Number.isInteger(selectedPiece.height / 2)) {
      const newHeight = selectedPiece.height / 2;
      const newWidth = selectedPiece.width * 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      console.log(pieceIndex);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  function handleVerticalStretch() {
    if (Number.isInteger(selectedPiece.width / 2)) {
      const newHeight = selectedPiece.height * 2;
      const newWidth = selectedPiece.width / 2;
      const id = selectedPiece.id;
      const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
      console.log(pieceIndex);
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  function convertlocationToXAndY(location) {
    const cleanedString = location.replace(/[()]/g, '');
    const [x, y] = cleanedString.split(',').map(Number);
    return { x, y };
  }

  const { x, y } = convertlocationToXAndY(piece.location);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });

  const style = {
    position: 'absolute',
    left: `${x * sizeOfEachUnit - 1}px`,
    top: `${y * sizeOfEachUnit - 1}px`,
    // ...(transform && {
    //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // }),
    ...(isDragging && { cursor: 'grab' }),
    ...(selectedPiece?.id === id && {
      boxShadow:
        'rgba(0, 0, 0, 0.5) 0px 19px 19px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
    }),
  };

  function handlePieceSelected() {
    const chosenPiece = piecesInPlay.find(piece => id === piece.id);
    setSelectedPiece(chosenPiece);
  }

  return (
    <Popover withArrow trapFocus size="medium" positioning="below">
      <PopoverTrigger>
        <motion.button
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          onClick={handlePieceSelected}
          animate={{ rotate: piece.isRotated ? 90 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Rectangle
            width={piece.width}
            height={piece.height}
            color={piece.color}
            {...listeners}
          />
        </motion.button>
      </PopoverTrigger>
      <PopoverSurface id="actions">
        <div className="actions-toolbar">
          <button className="icon-button" onClick={handleRotation}>
            <RotateRightOutlined
              style={{ fontSize: '32px', color: 'hsl(178, 100%, 23%)' }}
            />
          </button>
          <button className="icon-button" onClick={handleHorizontalStretch}>
            <img
              src="./assets/horizontalStretch.svg"
              style={{ width: '32px' }}
            />
          </button>
          <button className="icon-button" onClick={handleVerticalStretch}>
            <img src="./assets/verticalStretch.svg" style={{ width: '32px' }} />
          </button>
        </div>
      </PopoverSurface>
    </Popover>
  );
}

export default memo(PieceOnBoard);
