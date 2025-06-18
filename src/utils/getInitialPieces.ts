import { InitialPiece } from '../types/piece';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';

const initialLocation = null;

export function getInitialPieces(level: number): InitialPiece[] {
  return [
    {
      width: 3,
      height: 2,
      location: 'instructions',
      color: 'hsl(0, 61%, 66%)',
      id: 'sample-0',
      isRotated: false,
    },
    ...levels[level].pieces.map((piece, index) => ({
      ...piece,
      location: initialLocation,
      color: colors[index % colors.length],
      id: `initial-${index + 1}`,
      isRotated: false,
    })),
  ];
}
