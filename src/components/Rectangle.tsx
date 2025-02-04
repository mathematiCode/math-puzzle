/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
import { memo, forwardRef, useContext } from 'react';
import { CurrentLevelContext } from '../context/CurrentLevel';
function Rectangle(
  { width, height, color, isRotated, isSelected, style, ...delegated },
  ref
) {
  const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  const total = width * height;
  return (
    <motion.div
      ref={ref}
      className="unit-container"
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        backgroundColor: 'transparent',
        // ...(isSelected && {
        //   boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        // }),
      }}
      // animate={{
      //   rotate: isRotated ? 90 : 0,
      // }}
      // transition={{ duration: 0.5 }}
      {...delegated}
    >
      {range(total).map(unit => (
        <motion.div
          className="unit"
          key={unit}
          layout={true}
          style={{
            backgroundColor: color,
            width: `${sizeOfEachUnit - 2}px`,
            height: `${sizeOfEachUnit - 2}px`,
          }}
          id={unit}
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
