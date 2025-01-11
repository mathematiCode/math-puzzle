import LandingSquare from './LandingSquare';
import { range } from 'lodash';
import PropTypes from 'prop-types';

function Board({ coordinates }) {
  const width = 22; // eventually will calculate from coordinates
  const height = 18;
  let color = 'hsl(209, 26%, 89%)';

  return (
    <div
      className="unit-container board"
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
      }}
    >
      {range(height).map((row, rowIndex) => {
        return range(width).map((square, colIndex) => {
          return (
            <LandingSquare
              key={`(${colIndex},${rowIndex})`}
              id={`(${colIndex},${rowIndex})`}
              color={color}
            />
          );
        });
      })}
    </div>
  );
}

Board.propTypes = {
  coordinates: PropTypes.array.isRequired,
};

export default Board;
