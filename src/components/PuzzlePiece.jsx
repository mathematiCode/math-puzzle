import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';
import { useContext } from 'react';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { motion } from 'motion/react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { RotateRightOutlined } from '@ant-design/icons';
import { PiecesInPlayContext } from '../context/PiecesInPlay';

const PuzzlePiece = ({ piece }) => {
  //console.log('re-rendering this piece:', piece.id);
  const { updateDimensions, rotatePiece } = useContext(PiecesInPlayContext);
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece.id,
  });

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
      updateDimensions(pieceIndex, newWidth, newHeight);
    }
  }

  const style = {
    // ...(transform && {
    //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // }),
    ...(selectedPiece?.id === piece.id && {
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    }),
  };

  function handlePieceSelected() {
    setSelectedPiece(piece);
  }
  return (
    <Popover
      withArrow
      trapFocus
      size="small"
      positioning="below"
      style={{ gap: '0px' }}
    >
      <PopoverTrigger>
        <motion.button
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          className="puzzle-piece"
          onClick={handlePieceSelected}
          animate={{ rotate: piece.isRotated ? 90 : 0 }}
          transition={{ duration: 0.5 }}
          popoverTarget="actions"
        >
          <Rectangle
            width={piece.width}
            height={piece.height}
            color={piece.color}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
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
};

PuzzlePiece.displayName = 'PuzzlePiece';

PuzzlePiece.propTypes = {
  piece: PropTypes.object.isRequired,
  className: PropTypes.string,
  activePiece: PropTypes.object,
};

export default PuzzlePiece;
