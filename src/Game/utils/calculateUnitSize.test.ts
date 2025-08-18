import { calculateUnitSize } from './calculateUnitSize';
import { describe, it, expect } from 'vitest';

const upperLimit = (idealSize: number) =>
  Math.round(idealSize + idealSize * 0.15);
const lowerLimit = (idealSize: number) =>
  Math.round(idealSize - idealSize * 0.44);
/*This means the function will calculate an appropriate unit size up to 15% larger than the ideal and up to 44% smaller*/

describe('calculate sizes for level 1', () => {
  it(`calculates around 94 for laptop`, () => {
    const unitSize = calculateUnitSize(1512, 857, 5, 6, 3, 4);
    const idealSize = 94;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates around 82 for 1287 width`, () => {
    const unitSize = calculateUnitSize(1287, 845, 5, 6, 3, 4);
    const idealSize = 82;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates around 58 for 974 width`, () => {
    const unitSize = calculateUnitSize(974, 845, 5, 6, 3, 4);
    const idealSize = 58;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates around 65 for 635 width`, () => {
    const unitSize = calculateUnitSize(635, 845, 5, 6, 3, 4);
    const idealSize = 65;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates around 50 for a phone`, () => {
    const unitSize = calculateUnitSize(385, 845, 5, 6, 3, 4);
    const idealSize = 50;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});

describe('calculates sizes for level 2', () => {
  it(`calculates about 30 for a phone`, () => {
    const unitSize = calculateUnitSize(385, 845, 7, 8, 8, 8);
    const idealSize = 30;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 40 for 720 width`, () => {
    const unitSize = calculateUnitSize(720, 845, 7, 8, 8, 8);
    const idealSize = 40;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 41 for 1108 width`, () => {
    const unitSize = calculateUnitSize(1108, 845, 7, 8, 8, 8);
    const idealSize = 41;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 44 for 1459 width`, () => {
    const unitSize = calculateUnitSize(1459, 845, 7, 8, 8, 8);
    const idealSize = 44;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 55 for 3440 width`, () => {
    const unitSize = calculateUnitSize(3440, 1440, 7, 8, 8, 8);
    const idealSize = 55;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});

describe('calculates sizes for level 3', () => {
  it(`calculates about 30 for a laptop`, () => {
    const unitSize = calculateUnitSize(1512, 772, 15, 14, 9, 8);
    const idealSize = 30;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 28 for a small laptop`, () => {
    const unitSize = calculateUnitSize(1207, 845, 15, 14, 9, 8);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 16 for a tablet`, () => {
    const unitSize = calculateUnitSize(815, 845, 15, 14, 9, 8);
    const idealSize = 16;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 21 for a phone`, () => {
    const unitSize = calculateUnitSize(367, 845, 15, 14, 9, 8);
    const idealSize = 21;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});

describe('calculate sizes for level 4', () => {
  it(`calculates about 24 for a phone`, () => {
    const unitSize = calculateUnitSize(367, 845, 10, 11, 5, 6);
    const idealSize = 24;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 32 for a small laptop`, () => {
    const unitSize = calculateUnitSize(1014, 845, 10, 11, 5, 6);
    const idealSize = 32;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 45 for a laptop`, () => {
    const unitSize = calculateUnitSize(1507, 845, 10, 11, 5, 6);
    const idealSize = 45;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 55 for a big monitor`, () => {
    const unitSize = calculateUnitSize(1920, 1080, 10, 11, 5, 6);
    const idealSize = 55;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});

describe('calculates sizes for level 5', () => {
  it(`calculates about 28 for a laptop`, () => {
    const unitSize = calculateUnitSize(1512, 772, 18, 12, 9, 8);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 21 for a small laptop`, () => {
    const unitSize = calculateUnitSize(1179, 845, 18, 12, 9, 8);
    const idealSize = 21;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 25 for a tablet`, () => {
    const unitSize = calculateUnitSize(725, 845, 18, 12, 9, 8);
    const idealSize = 25;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 22 for a small tablet`, () => {
    const unitSize = calculateUnitSize(506, 845, 18, 12, 9, 8);
    const idealSize = 22;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 18 for a phone`, () => {
    const unitSize = calculateUnitSize(353, 845, 18, 12, 9, 8);
    const idealSize = 18;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});

describe('calculate sizes for level 6', () => {
  it(`calculates about 28 for a phone`, () => {
    const unitSize = calculateUnitSize(353, 845, 11, 8, 8, 5);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 28 for a 970 width`, () => {
    const unitSize = calculateUnitSize(970, 845, 11, 8, 8, 5);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 35 for a 1179 laptop`, () => {
    const unitSize = calculateUnitSize(1179, 845, 11, 8, 8, 5);
    const idealSize = 35;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 44 for a laptop`, () => {
    const unitSize = calculateUnitSize(1512, 772, 11, 8, 8, 5);
    const idealSize = 44;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 52 for a huge monitor`, () => {
    const unitSize = calculateUnitSize(3440, 1440, 11, 8, 8, 5);
    const idealSize = 52;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 28 for a phone`, () => {
    const unitSize = calculateUnitSize(353, 845, 11, 8, 8, 5);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});

describe('calculates sizes for level 7', () => {
  it(`calculates about 39 for a small laptop`, () => {
    const unitSize = calculateUnitSize(1179, 845, 10, 10, 8, 5);
    const idealSize = 39;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 28 for a tablet`, () => {
    const unitSize = calculateUnitSize(820, 1180, 10, 10, 8, 5);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 28 for a horizontal tablet`, () => {
    const unitSize = calculateUnitSize(412, 916, 10, 10, 8, 5);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
  it(`calculates about 28 for a small laptop`, () => {
    const unitSize = calculateUnitSize(1024, 600, 10, 10, 8, 5);
    const idealSize = 28;
    expect(unitSize).toBeLessThanOrEqual(upperLimit(idealSize));
    expect(unitSize).toBeGreaterThanOrEqual(lowerLimit(idealSize));
  });
});
