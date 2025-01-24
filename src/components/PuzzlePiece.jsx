import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';
import ActionsToolbarPopover from './ActionsToolbarPopover';
import { useContext } from 'react';
import { motion } from 'motion/react';
import { SelectedPieceContext } from '../context/SelectedPiece';

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
    touchAction: 'none',
    ...(selectedPiece?.id === piece.id && {
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    }),
  };

  function handlePieceSelected() {
    setSelectedPiece(piece);
  }
  return (
    <ActionsToolbarPopover>
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
    </ActionsToolbarPopover>
  );
};

PuzzlePiece.displayName = 'PuzzlePiece';

PuzzlePiece.propTypes = {
  piece: PropTypes.object.isRequired,
  className: PropTypes.string,
  activePiece: PropTypes.object,
};

export default PuzzlePiece;
