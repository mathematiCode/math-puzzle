import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';
import { useContext } from 'react';
import { SelectedPieceContext } from '../context/SelectedPiece';
import { motion } from 'motion/react';
import {
  makeStyles,
  useId,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { RotateRightOutlined } from '@ant-design/icons';

// function handleRotation() {
//   const id = selectedPiece.id;
//   const pieceIndex = parseInt(id.slice(id.indexOf('-') + 1), 10);
//   rotatePiece(pieceIndex);
// }

const PuzzlePiece = ({ piece }) => {
  //console.log('re-rendering this piece:', piece.id);
  const { selectedPiece, setSelectedPiece } = useContext(SelectedPieceContext);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece.id,
  });
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
    console.log('new piece is selected');
  }

  return (
    <Popover withArrow trapFocus size="medium" positioning="below">
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
          <Button className="icon-button">
            <RotateRightOutlined style={{ fontSize: '40px' }} />
          </Button>
          <Button className="icon-button">
            <img
              src="./assets/horizontalStretch.svg"
              style={{ width: '40px' }}
            />
          </Button>
          <Button className="icon-button">
            <img src="./assets/verticalStretch.svg" style={{ width: '40px' }} />
          </Button>
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
