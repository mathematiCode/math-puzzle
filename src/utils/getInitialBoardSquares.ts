import levels from '../levels.json';

export function getInitialBoardSquares(level: number) {
  //const dimensions = levels[level].dimensions;
  const boardSections = levels[level].boardSections;
  let boardSquares = [];
  for (let i = 0; i < boardSections.length; i++) {
    let height = boardSections[i][0].height;
    for (let um = 0; um < height; um++) {
      let row: string[] = [];
      boardSections[i].forEach(section => {
        const { width, valid } = section;
        for (let j = 0; j < width; j++) {
          row.push(valid ? '' : 'invalid');
        }
      });
      boardSquares.push(row);
    }
  }
  // console.log('current level:', level, boardSquares);
  return boardSquares;
}
