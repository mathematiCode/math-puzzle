import { describe, it, expect } from 'vitest';
import { convertLocationToXAndY } from './utilities';

describe('convertLocationToXAndY', () => {
  it(`converts location strings to x and y values`, () => {
    const { x, y } = convertLocationToXAndY('(2,3');
    expect(x).toEqual(2);
    expect(y).toEqual(3);
  });
});
