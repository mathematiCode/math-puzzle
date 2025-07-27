// Not currently in use
// import { Modifier } from '@dnd-kit/core';
// import { useMemo } from 'react';

export function useSnapToGrid(
  gridSize: number,
  origin: { x: number; y: number }
) {
  // return useMemo(() => {
  return ({ transform }: { transform: { x: number; y: number } }) => {
    let xOffset = (transform.x - origin.x) % gridSize;

    if (xOffset > gridSize / 2) {
      xOffset -= gridSize;
    }
    // if (xOffset < 0) {
    //   xOffset += gridSize;
    // }

    let yOffset = (transform.y - origin.y) % gridSize;

    // if (yOffset < 0) {
    //   yOffset += gridSize;
    // }

    console.log('origin', origin);
    console.log('xOffset', xOffset);
    console.log('yOffset', yOffset);
    console.log('transform', transform);
    console.log('gridSize', gridSize);
    // let xOffset = 0;
    // let yOffset = 0;

    return {
      ...transform,
      x: Math.ceil(transform.x / gridSize) * gridSize + xOffset,
      y: Math.ceil(transform.y / gridSize) * gridSize + yOffset,
    };
  };
  // }, [gridSize, origin]);
}

export default useSnapToGrid;
