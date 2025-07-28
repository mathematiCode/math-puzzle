import { memo } from 'react';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';
import { Piece } from '../types/piece';

function PieceOverlay({ piece }: { piece: Piece }) {
  return (
    <motion.div
      className="unit-container"
      style={{
        cursor: 'grab',
        border: '2px solid black',
      }}
      animate={{
        rotate: piece.isRotated ? 90 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      <Rectangle
        width={piece.width}
        height={piece.height}
        unitSize={1}
        color={piece.color || 'transparent'}
      />
    </motion.div>
  );
}

PieceOverlay.propTypes = {
  piece: PropTypes.object.isRequired,
};

const MemoizedPieceOverlay = memo(PieceOverlay);
export default MemoizedPieceOverlay;
