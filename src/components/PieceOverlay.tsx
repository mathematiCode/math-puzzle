import { memo } from 'react';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import Rectangle from './Rectangle';

function PieceOverlay({ piece }) {
  return (
    <motion.div
      className="unit-container"
      animate={{
        rotate: piece.isRotated ? 90 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      <Rectangle
        width={piece.width}
        height={piece.height}
        color={piece.color}
      />
    </motion.div>
  );
}

PieceOverlay.propTypes = {
  piece: PropTypes.object.isRequired,
};

const MemoizedPieceOverlay = memo(PieceOverlay);
export default MemoizedPieceOverlay;
