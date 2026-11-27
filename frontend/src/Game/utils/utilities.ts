import { Piece } from '../../types/piece';

/**
 * Duration (ms) of the drop animation that plays when a piece is released
 * back into the initial pieces container. Shared between the DragOverlay's
 * `dropAnimation` and the logic that keeps the real piece hidden until the
 * animated copy finishes settling into its home slot (issue #84), so the two
 * stay in sync and the piece doesn't appear twice.
 */
export const RETURN_TO_CONTAINER_DURATION = 250;

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

/**
 * Returns true only if a piece whose top-left corner is at (x, y) would sit
 * entirely on playable board squares — every square it covers must be in
 * bounds and not an 'invalid' (off-shape) square.
 *
 * The board can be non-rectangular (see levels.json), so a location can be
 * inside the board's bounding box yet still hang over squares that aren't part
 * of the board. getNewValidLocation only clamps to the bounding box, so this
 * extra check is what actually keeps a piece from being dropped off the board
 * (issue #59). Occupied-but-valid squares are fine — overlapping other pieces
 * is an allowed (unstable) placement.
 */
export function isPlacementFullyOnBoard(
  boardSquares: string[][],
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  for (let row = y; row < y + height; row++) {
    for (let col = x; col < x + width; col++) {
      const square = boardSquares?.[row]?.[col];
      if (square === undefined || square === 'invalid') {
        return false;
      }
    }
  }
  return true;
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

export function findPieceIndexById(piecesInPlay: Piece[], id: string) {
  return piecesInPlay.findIndex(piece => piece.id === id);
}
