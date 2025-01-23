import { memo } from 'react';
import { motion } from 'motion/react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
import { sizeOfEachUnit } from '../CONSTANTS';

function PieceOverlay({ activePiece }) {
  return (
    <motion.div
      className="unit-container"
      animate={{ rotate: activePiece.isRotated ? 90 : 0 }}
      style={{
        gridTemplateColumns: `repeat(${activePiece.width}, 1fr)`,
        backgroundColor: 'transparent',
      }}
    >
      {range(activePiece.width * activePiece.height).map(unit => (
        <motion.div
          className="unit"
          key={unit}
          layout={true}
          style={{
            backgroundColor: activePiece.color,
            width: `${sizeOfEachUnit - 2}px`,
            height: `${sizeOfEachUnit - 2}px`,
          }}
        />
      ))}
    </motion.div>
  );
}

PieceOverlay.propTypes = {
  activePiece: PropTypes.object.isRequired,
};

const MemoizedPieceOverlay = memo(PieceOverlay);
export default MemoizedPieceOverlay;
