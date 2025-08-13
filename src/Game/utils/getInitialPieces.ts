import { Piece } from '../../types/piece';
import levels from '../levels.json' assert { type: 'json' };
import { colors } from '../../CONSTANTS';

const initialLocation = null;

export function getInitialPieces(level: number): Piece[] {
  return [
    {
      width: 3,
      height: 2,
      location: 'instructions',
      color: 'hsl(0, 61%, 66%)',
      id: 'sample-0',
      isRotated: false,
      isStable: true,
    },
    ...levels[level].pieces.map((piece, index) => ({
      ...piece,
      location: initialLocation,
      color: colors[index % colors.length],
      id: `i-${index + 1}`,
      isRotated: false,
      isStable: true,
    })),
  ];
}
