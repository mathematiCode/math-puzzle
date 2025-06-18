import levels from '../levels.json';

export function getInitialBoardSquares(level: number) {
  //const dimensions = levels[level].dimensions;
  const boardSections = levels[level].boardSections;
  //   const dimensions = { width: 15, height: 14 };
  //   const boardSections = [
  //     [
  //       {
  //         x: 0,
  //         y: 0,
  //         width: 8,
  //         height: 4,
  //         valid: false,
  //       },
  //       { x: 8, y: 0, width: 7, height: 4, valid: true },
  //     ],
  //     [{ x: 0, y: 4, width: 15, height: 10, valid: true }],
  //   ];
  let boardSquares = [];
  // const { x, y, width, height, valid } = boardSections[0][0];
  for (let i = 0; i < boardSections.length; i++) {
    let height = boardSections[i][0].height;
    for (let um = 0; um < height; um++) {
      let row: string[] = [];
      boardSections[i].forEach(section => {
        const { width, valid } = section;
        for (let j = 0; j < width; j++) {
          row.push(valid ? 'empty' : 'invalid');
        }
      });
      boardSquares.push(row);
    }
  }
  console.log('current level:', level, boardSquares);
  return boardSquares;
}
