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
  height: number
) {
  return Math.round(
    (0.0005 * windowWidth * (windowHeight - 200)) / Math.max(width, height) - 1
  );
}
