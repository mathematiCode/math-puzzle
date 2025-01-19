/* eslint-disable react/prop-types */
import BoardSection from './BoardSection';
import PropTypes from 'prop-types';

function Board({ dimensions, boardSections }) {
  const boardWidth = dimensions.x;

  /**
   * boardSections.map((section) => {
   *  check if section.length is > 1
   *  if so then
   * <div>
   * section.map
   * </div>
   *
   * if not then section[0] with no div.
   * }
   *
   * );
   */
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
        zIndex: '0',
      }}
    >
      {boardSections.map(row => {
        if (row.length === 1) {
          return (
            <BoardSection
              key="hi"
              width={row[0].width}
              height={row[0].height}
              x={row[0].x}
              y={row[0].y}
              valid={row[0].valid}
            />
          );
        } else {
          console.log(row);
          return (
            <div
              key="div"
              style={{
                gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
                zIndex: '0',
                display: 'flex',
              }}
            >
              {row.map(section => {
                return (
                  <BoardSection
                    key={`${section.x},${section.y}`}
                    width={section.width}
                    height={section.height}
                    x={section.x}
                    y={section.y}
                    valid={section.valid}
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

// return (
//   <div
//     style={{
//       gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
//       zIndex: '0',
//     }}
//   >
//     <div
//       style={{
//         display: 'flex',
//       }}
//     >
//       <div
//         className="unit-container board"
//         style={{
//           gridTemplateColumns: `repeat(${6}, 1fr)`,
//           zIndex: '3',
//         }}
//       >
//         {range(9).map((row, rowIndex) => {
//           return range(6).map((square, colIndex) => {
//             return (
//               <InvalidSquare
//                 key={`(${colIndex},${rowIndex})`}
//                 id={`(${colIndex},${rowIndex})`}
//               />
//             );
//           });
//         })}
//       </div>
//       <div
//         className="unit-container board"
//         style={{
//           gridTemplateColumns: `repeat(${16}, 1fr)`,
//         }}
//       >
//         {range(9).map((row, rowIndex) => {
//           return range(16).map((square, colIndex) => {
//             console.log(`(${colIndex + 6},${rowIndex})`);
//             return (
//               <LandingSquare
//                 key={`(${colIndex + 6},${rowIndex})`}
//                 id={`(${colIndex + 6},${rowIndex})`}
//                 color={color}
//               />
//             );
//           });
//         })}
//       </div>
//     </div>
//     <div
//       className="unit-container board"
//       style={{
//         gridTemplateColumns: `repeat(${22}, 1fr)`,
//       }}
//     >
//       {range(9).map((row, rowIndex) => {
//         return range(22).map((square, colIndex) => {
//           console.log(`(${colIndex},${rowIndex + 9})`);
//           return (
//             <LandingSquare
//               key={`(${colIndex},${rowIndex + 9})`}
//               id={`(${colIndex},${rowIndex + 9})`}
//               color={color}
//             />
//           );
//         });
//       })}
//     </div>
//   </div>

Board.propTypes = {
  dimensions: PropTypes.object.isRequired,
  boardSections: PropTypes.array.isRequired,
};

export default Board;
