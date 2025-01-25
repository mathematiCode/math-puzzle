import LandingSquare from './LandingSquare';
import InvalidSquare from './InvalidSquare';
import { range } from 'lodash';
import PropTypes from 'prop-types';

function BoardSection({ width, height, x, y, valid, translation }) {
  const color = 'hsl(209, 26%, 89%)';
  const borderThickness = 8;
  if (valid) {
    return (
      <div
        className="unit-container board"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          backgroundColor: 'black',
          boxShadow:
            ' hsl(178, 100%, 23%) 0px 1px 8px, hsl(178, 100%, 23%) 0px 0px 0px 8px',
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
    let xTranslation = 0;
    let yTranslation = 0;
    if (translation.includes('top')) {
      yTranslation = -borderThickness;
    } else if (translation.includes('bottom')) {
      yTranslation = borderThickness;
    }
    if (translation.includes('left')) {
      xTranslation = -borderThickness;
    } else if (translation.includes('right')) {
      xTranslation = borderThickness;
    }
    return (
      <div
        className="unit-container board"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          zIndex: 1,
          transform: `translate(${xTranslation}px, ${yTranslation}px)`,
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
  translation: PropTypes.array,
};

export default BoardSection;
