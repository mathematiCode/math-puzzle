import { Piece } from '../../types/piece';

export function updatePiecesInPlay() {
  /**  check if puzzle piece was already placed on the board 
         - if it was update it's new location in the array of pieces placed on the board
              - if it's still on the board, update new location
              - if it's removed from the board, delete from array

        - if it wasn't on the board yet add it to the array of pieces placed on the board. 

        Then convert that object into pixel coordinates to display on the board in re-render. 
    */
}

export function convertLocationToXAndY(location: string | null) {
  if (!location) return { x: 0, y: 0 };
  const cleanedString = location.replace(/[()]/g, '');
  const [x, y] = cleanedString.split(',').map(Number);
  return { x, y };
}

export function rateDroppability(x: number, y: number, droppableRect: any) {
  const { top, left, width, height } = droppableRect;
  // I'm multiplying the width and height by 2 to allow a greater range of droppableRects
  // to be considered by decreasing the likelihood of a negative xOffsetRatio or yOffsetRatio
  const xOffsetRatio = (width * 2 - Math.abs(x - left)) / (width * 2);
  const yOffsetRatio = (height * 2 - Math.abs(y - top)) / (height * 2);
  if (xOffsetRatio < 0 && yOffsetRatio < 0) return 0;
  return (xOffsetRatio * yOffsetRatio).toFixed(3);
}

export function calculateUnitSize(
  windowWidth: number,
  windowHeight: number,
  width: number,
  height: number,
  largestHeight: number
) {
  if (windowWidth < 500) {
    return Math.round(
      ((0.002 * windowWidth * (windowHeight - 200)) /
        Math.max(width, height, largestHeight * 1.5)) *
        0.8 -
        1
    );
  } else if (windowWidth < 800) {
    return Math.round(
      ((0.0015 * windowWidth * (windowHeight - 200)) /
        Math.max(width, height, largestHeight * 1.5)) *
        0.8 -
        1
    );
  } else if (windowWidth < 1600) {
    return Math.round(
      ((0.35 * Math.max(windowWidth, windowHeight - 200)) /
        Math.max(width, height, largestHeight * 1.5)) *
        0.8 -
        1
    );
  } else {
    return Math.round(
      ((0.7 * Math.min(windowWidth, windowHeight - 200, 2000)) /
        Math.max(width, height, largestHeight * 1.5)) *
        0.8 -
        1
    );
  }
}

export function findLargestHeight(
  piecesArray: { width: number; height: number }[]
): number {
  let heights: number[] = [];
  piecesArray.forEach(piece => {
    heights.push(piece.height);
  });
  return Math.max(...heights);
}

export function findPieceById(piecesInPlay: Piece[], id: string) {
  return piecesInPlay.find(piece => piece.id === id);
}

export function getPieceNumber(id: string) {
  return parseInt(id.slice(id.indexOf('-') + 1), 10);
}
