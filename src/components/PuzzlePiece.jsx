import { useContext } from 'react';
import { motion } from 'motion/react';
import { CurrentLevelContext } from '../context/CurrentLevel';
import PropTypes from 'prop-types';

const PuzzlePiece = ({ piece, children, style, ...props }) => {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);

  const combinedStyle = {
    ...style,
    ...(piece.isRotated && {
      transform: `rotate(90deg)`,
    }),
  };

  return (
    <motion.div
      style={combinedStyle}
      animate={{ rotate: piece.isRotated ? 90 : 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

PuzzlePiece.propTypes = {
  piece: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default PuzzlePiece;
