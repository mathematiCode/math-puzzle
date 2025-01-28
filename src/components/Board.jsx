/* eslint-disable react/prop-types */
import BoardSection from './BoardSection';
import PropTypes from 'prop-types';

function Board({ dimensions, boardSections }) {
  const boardWidth = dimensions.width;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr',
      }}
    >
      {boardSections.map((row, index) => {
        if (row.length === 1) {
          return <BoardSection key={index} section={row[0]} />;
        } else {
          return (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateRows: '1fr',
                gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
                width: 'min-content',
              }}
            >
              {row.map(section => {
                return (
                  <BoardSection
                    key={`${section.x},${section.y}`}
                    section={section}
                  />
                );
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

Board.propTypes = {
  dimensions: PropTypes.object.isRequired,
  boardSections: PropTypes.array.isRequired,
};

export default Board;
