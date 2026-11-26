import { describe, it, expect } from 'vitest';
import {
  formatPath,
  comparePath,
  generatePieceId,
  createInitialPieces,
  isSample,
  isOnBoard,
} from './piece';
import { Piece } from '../../types/piece';

function makePiece(overrides: Partial<Piece> = {}): Piece {
  return {
    id: 'test',
    order: [1],
    kind: 'puzzle',
    width: 1,
    height: 1,
    location: null,
    color: 'red',
    isRotated: false,
    isStable: true,
    ...overrides,
  };
}

describe('formatPath', () => {
  it('renders an order path as a dotted label', () => {
    expect(formatPath([4])).toBe('4');
    expect(formatPath([3, 1])).toBe('3.1');
    expect(formatPath([3, 2, 1])).toBe('3.2.1');
  });
});

describe('comparePath', () => {
  const sorted = (paths: number[][]) =>
    [...paths].sort(comparePath).map(formatPath);

  it('keeps split children adjacent and in depth-first order', () => {
    // 3 split into 3.1, 3.2
    expect(sorted([[1], [2], [3, 1], [3, 2], [4]])).toEqual([
      '1',
      '2',
      '3.1',
      '3.2',
      '4',
    ]);
    // then 3.2 split into 3.2.1, 3.2.2
    expect(sorted([[1], [2], [3, 1], [3, 2, 1], [3, 2, 2], [4]])).toEqual([
      '1',
      '2',
      '3.1',
      '3.2.1',
      '3.2.2',
      '4',
    ]);
  });

  it('compares segment-by-segment, not by overall magnitude', () => {
    // 3.11 must sort after 3.2 (segment 11 > 2 is wrong; [3,1,1] < [3,2])
    expect(comparePath([3, 1, 1], [3, 2])).toBeLessThan(0);
  });

  it('sorts a shorter prefix before its longer extension', () => {
    expect(comparePath([3, 2], [3, 2, 1])).toBeLessThan(0);
  });

  it('handles multi-digit roots without ambiguity', () => {
    expect(sorted([[10, 1], [2], [10]])).toEqual(['2', '10', '10.1']);
  });
});

describe('generatePieceId', () => {
  it('produces unique, opaque ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generatePieceId()));
    expect(ids.size).toBe(100);
  });
});

describe('createInitialPieces', () => {
  it('builds a sample piece plus the level pieces with unique ids', () => {
    const pieces = createInitialPieces(0);
    const ids = new Set(pieces.map(p => p.id));
    expect(ids.size).toBe(pieces.length);
    expect(pieces.every(p => typeof p.id === 'string' && p.id.length > 0)).toBe(
      true
    );
  });

  it('marks exactly one sample piece, first, with the rest as puzzle pieces', () => {
    const pieces = createInitialPieces(0);
    expect(pieces.filter(isSample)).toHaveLength(1);
    expect(isSample(pieces[0])).toBe(true);
    expect(pieces.slice(1).every(p => p.kind === 'puzzle')).toBe(true);
  });

  it('assigns 1-based order paths to puzzle pieces', () => {
    const pieces = createInitialPieces(0);
    const puzzlePieces = pieces.slice(1);
    puzzlePieces.forEach((piece, index) => {
      expect(piece.order).toEqual([index + 1]);
    });
  });

  it('does not encode state in the id', () => {
    const pieces = createInitialPieces(0);
    expect(pieces.some(p => p.id.startsWith('i-') || p.id.startsWith('b-'))).toBe(
      false
    );
  });
});

describe('isOnBoard', () => {
  it('is true only for puzzle pieces with a location', () => {
    expect(isOnBoard(makePiece({ location: '(2,0)' }))).toBe(true);
    expect(isOnBoard(makePiece({ location: null }))).toBe(false);
    expect(
      isOnBoard(makePiece({ kind: 'sample', location: 'instructions' }))
    ).toBe(false);
  });
});
