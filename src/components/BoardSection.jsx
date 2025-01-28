import LandingSquare from './LandingSquare';
import InvalidSquare from './InvalidSquare';
import { range } from 'lodash';
import PropTypes from 'prop-types';
// import { useContext } from 'react';
// import { CurrentLevelContext } from '../context/CurrentLevel';

function BoardSection({ section }) {
  const color = 'hsl(209, 26%, 89%)';
  const { width, height, x, y, valid } = section;
  // const { sizeOfEachUnit } = useContext(CurrentLevelContext);
  if (valid) {
    return (
      <div
        className="unit-container board withBorder"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
        }}
      >
        {range(height).map((row, rowIndex) => {
          return range(width).map((square, colIndex) => {
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
      // <div
      //   style={{
      //     width: `${width}*${sizeOfEachUnit}px`,
      //     height: `${height}*${sizeOfEachUnit}px`,
      //   }}
      //   className="board"
      // />
    );
  }
}

BoardSection.propTypes = {
  section: PropTypes.object.isRequired,
};

export default BoardSection;
