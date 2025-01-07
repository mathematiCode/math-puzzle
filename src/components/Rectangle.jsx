/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { range } from 'lodash';

function Rectangle({ width, height }) {
  let total = width * height;
  return (
    <motion.div
      className="unit-container"
      layout={true}
      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
    >
      {range(total).map(unit => (
        <motion.div className="unit" key={unit} layout={true} />
      ))}
    </motion.div>
  );
}

export default Rectangle;
