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
