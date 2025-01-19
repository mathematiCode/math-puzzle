import LandingSquare from './LandingSquare';
import InvalidSquare from './InvalidSquare';
import { range } from 'lodash';
import PropTypes from 'prop-types';

function BoardSection({ width, height, x, y, valid }) {
  // check if valid
  // return array of valid or invalid squares

  let color = 'hsl(209, 26%, 89%)';
  if (valid) {
    return (
      <div
        className="unit-container board"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          backgroundColor: 'black',
        }}
      >
        {range(height).map((row, rowIndex) => {
          return range(width).map((square, colIndex) => {
            console.log(`(${colIndex + x},${rowIndex + y})`);
            return (
              <LandingSquare
                key={`(${colIndex + x},${rowIndex + y})`}
                id={`(${colIndex + x},${rowIndex + y})`}
                color={color}
              />
            );
          });
        })}
      </div>
    );
  } else {
    return (
      <div
        className="unit-container board"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          zIndex: '3',
        }}
      >
        {range(height).map((row, rowIndex) => {
          return range(width).map((square, colIndex) => {
            return (
              <InvalidSquare
                key={`(${colIndex + x},${rowIndex + y})`}
                id={`(${colIndex + x},${rowIndex + y})`}
              />
            );
          });
        })}
      </div>
    );
  }
}

BoardSection.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default BoardSection;
