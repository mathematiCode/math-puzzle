export function calculateUnitSize(
  windowWidth: number,
  windowHeight: number,
  width: number,
  height: number,
  largestHeight: number,
  numPieces: number
): number {
  let offset = 0;
  if (windowHeight < 800 && windowWidth > 800) {
    offset += 5;
  }
  if (numPieces > 14 && largestHeight > height / 2) {
    offset += 2;
  }
  if (largestHeight > height / 2 && windowWidth > 800) {
    offset += 3;
  }
  if (windowWidth < 800) {
    return (
      Math.round(
        600 / (numPieces + Math.max(largestHeight * 1.5, height) + width)
      ) - offset
    );
  }
  if (windowWidth < 1000) {
    return (
      Math.round(
        700 / (numPieces + Math.max(largestHeight * 1.5, height) + width)
      ) - offset
    );
  }
  if (windowWidth < 1500) {
    return (
      Math.round(
        1000 / (numPieces + Math.max(largestHeight * 1.5, height) + width)
      ) - offset
    );
  } else {
    return (
      Math.round(
        1200 / (numPieces + Math.max(largestHeight * 1.5, height) + width)
      ) - offset
    );
  }
}
