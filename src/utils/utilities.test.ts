import { describe, it, expect } from 'vitest';
import { convertLocationToXAndY, countOverlappingSquares } from './utilities';

describe('convertLocationToXAndY', () => {
  it(`converts location strings to x and y values`, () => {
    const { x, y } = convertLocationToXAndY('(2,3');
    expect(x).toEqual(2);
    expect(y).toEqual(3);
  });
});

describe('countOverlappingSquares', () => {
  const mockBoardSquares = [
    ['invalid', 'invalid', 'empty', 'empty', 'empty'],
    ['invalid', 'invalid', 'empty', 'empty', 'empty'],
    ['full', 'full', 'full', 'empty', 'empty'],
    ['full', 'full', 'full', 'empty', 'empty'],
    ['full', 'full', 'full', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty'],
  ];
  it(`counts no inner and 2 outer overlaps`, () => {
    const { outerOverlaps, innerOverlaps } = countOverlappingSquares(
      '(2,3)',
      2,
      2,
      mockBoardSquares
    );
    expect(outerOverlaps).toEqual(2);
    expect(innerOverlaps).toEqual(0);
  });
  it('counts 0 inner and 0 outer overlaps', () => {
    const { outerOverlaps, innerOverlaps } = countOverlappingSquares(
      '(3,3)',
      2,
      2,
      mockBoardSquares
    );
    expect(outerOverlaps).toEqual(0);
    expect(innerOverlaps).toEqual(0);
  });
  it('counts 2 inner and 4 outer overlaps', () => {
    const { outerOverlaps, innerOverlaps } = countOverlappingSquares(
      '(0,3)',
      4,
      3,
      mockBoardSquares
    );
    expect(outerOverlaps).toEqual(4);
    expect(innerOverlaps).toEqual(2);
  });
  it('counts 0 inner and 3 outer overlaps', () => {
    const { outerOverlaps, innerOverlaps } = countOverlappingSquares(
      '(0,2)',
      1,
      3,
      mockBoardSquares
    );
    expect(outerOverlaps).toEqual(3);
    expect(innerOverlaps).toEqual(0);
  });
});
