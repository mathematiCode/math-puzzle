import { motion } from 'motion/react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
function Rectangle({ width, height, color, ...delegated }) {
  const total = width * height;
  return (
    <motion.div
      className="unit-container"
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        backgroundColor: 'transparent',
      }}
      {...delegated}
    >
      {range(total).map(unit => (
        <motion.div
          className="unit"
          key={unit}
          layout={true}
          style={{ backgroundColor: color }}
        />
      ))}
    </motion.div>
  );
}
Rectangle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default Rectangle;
