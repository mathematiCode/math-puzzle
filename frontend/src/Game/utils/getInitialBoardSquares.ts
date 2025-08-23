import levels from '../levels.json';

export function getInitialBoardSquares(level: number) {
  //const dimensions = levels[level].dimensions;
  const boardSections = levels[level].boardSections;
  let boardSquares = [];
  for (let i = 0; i < boardSections.length; i++) {
    let height = boardSections[i][0].height;
    for (let j = 0; j < height; j++) {
      let row: string[] = [];
      boardSections[i].forEach(section => {
        const { width, valid } = section;
        for (let k = 0; k < width; k++) {
          row.push(valid ? '' : 'invalid');
        }
      });
      boardSquares.push(row);
    }
  }
  return boardSquares;
}
