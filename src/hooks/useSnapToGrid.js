// import { Modifier } from '@dnd-kit/core';
import { useMemo } from 'react';

export function useSnapToGrid(gridSize, origin = { x: 0, y: 0 }) {
  return useMemo(() => {
    return ({ transform }) => {
      const xOffset = (transform.x - origin.x) % gridSize;
      const yOffset = (transform.y - origin.y) % gridSize;
      return {
        ...transform,
        x: Math.ceil(transform.x / gridSize) * gridSize + xOffset,
        y: Math.ceil(transform.y / gridSize) * gridSize + yOffset,
      };
    };
  }, [gridSize, origin]);
}

export default useSnapToGrid;
