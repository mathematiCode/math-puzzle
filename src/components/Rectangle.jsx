/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
import { memo, forwardRef } from 'react';
function Rectangle({ width, height, color, ...delegated }, ref) {
  const total = width * height;
  return (
    <motion.div
      ref={ref}
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
// Rectangle.propTypes = {
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   color: PropTypes.string.isRequired,
// };

const MemoizedForwardedRectangle = memo(forwardRef(Rectangle));
export default MemoizedForwardedRectangle;
