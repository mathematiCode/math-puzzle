import { describe, it, expect } from 'vitest';
import {
  convertLocationToXAndY,
  isPlacementFullyOnBoard,
} from './utilities';

describe('convertLocationToXAndY', () => {
  it(`converts location strings to x and y values`, () => {
    const { x, y } = convertLocationToXAndY('(2,3');
    expect(x).toEqual(2);
    expect(y).toEqual(3);
  });
});

describe('isPlacementFullyOnBoard', () => {
  // Staircase board matching level 0: the top-left 2x2 corner is off-shape.
  //   X X . . .
  //   X X . . .
  //   . . . . .
  //   . . . . .
  //   . . . . .
  //   . . . . .
  const X = 'invalid';
  const board: string[][] = [
    [X, X, '', '', ''],
    [X, X, '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ];

  it('accepts a piece fully over valid squares', () => {
    expect(isPlacementFullyOnBoard(board, 2, 0, 3, 3)).toBe(true);
    expect(isPlacementFullyOnBoard(board, 0, 2, 5, 4)).toBe(true);
  });

  it('rejects a piece overhanging off-shape (invalid) squares', () => {
    // 3x3 at (0,0) covers the invalid top-left corner (issue #59).
    expect(isPlacementFullyOnBoard(board, 0, 0, 3, 3)).toBe(false);
  });

  it('rejects a piece hanging past the board bounding box', () => {
    // Bottom-right: cols 4..5 and rows 5..6 are out of bounds.
    expect(isPlacementFullyOnBoard(board, 4, 5, 2, 2)).toBe(false);
  });

  it('accepts placement over occupied (but valid) squares', () => {
    const occupied = board.map(row => [...row]);
    occupied[2][2] = 'piece-1';
    expect(isPlacementFullyOnBoard(occupied, 2, 2, 2, 2)).toBe(true);
  });
});
