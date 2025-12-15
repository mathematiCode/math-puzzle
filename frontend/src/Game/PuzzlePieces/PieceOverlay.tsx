import { memo } from 'react';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import Rectangle from '../Rectangle.js';
import { Piece } from '../../types/piece.js';

// Simple touch device detection
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

function PieceOverlay({ piece }: { piece: Piece }) {
  return (
    <motion.div
      className="unit-container"
      style={{
        cursor: 'grab',
        border: '2px solid black',
        position: 'relative',
        isolation: 'isolate',
        left: isTouchDevice() ? 20 : 0, // offset only visually
        top: isTouchDevice() ? -40 : 0,
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

export default PieceOverlay;
