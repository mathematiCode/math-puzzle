import Hotjar from '@hotjar/browser';

export function getNewValidLocation(
  x: number,
  y: number,
  pieceWidth: number,
  pieceHeight: number,
  boardWidth: number,
  boardHeight: number
) {
  let correctedX = x;
  let correctedY = y;
  if (pieceWidth > boardWidth) {
    correctedX = 0;
  } else if (correctedX + pieceWidth > boardWidth) {
    correctedX = boardWidth - pieceWidth;
    Hotjar.event('piece placed partially off board on the x axis');
  }
  correctedX = Math.max(correctedX, 0);
  if (pieceHeight > boardHeight) {
    correctedY = 0;
  } else if (correctedY + pieceHeight > boardHeight) {
    correctedY = boardHeight - pieceHeight;
    Hotjar.event('piece placed partially off board on the y axis');
  }
  correctedY = Math.max(correctedY, 0);
  return { correctedX, correctedY };
}
