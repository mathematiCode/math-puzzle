import { describe, it, expect } from 'vitest';
import levels from '../src/levels.json';

function testAreaEquivalence(level) {
  let totalValidArea = 0;
  let totalPieceArea = 0;

  level.boardSections.forEach(sectionList => {
    sectionList.forEach(section => {
      if (section.valid) {
        totalValidArea += section.width * section.height;
      }
    });
  });

  level.pieces.forEach(piece => {
    totalPieceArea += piece.width * piece.height;
  });

  expect(totalValidArea).toBe(totalPieceArea);
}

function testMatchingHeights(level) {
  level.boardSections.forEach(sectionList => {
    sectionList.forEach(section => {
      expect(section.height).toBe(sectionList[0].height);
    });
  });
}

function testHeightsAddUp(level) {
  let totalHeight = 0;
  level.boardSections.forEach(sectionList => {
    totalHeight += sectionList[0].height;
  });

  expect(totalHeight).toBe(level.dimensions.height);
}

function testWidthsAddUpForARow(row, levelWidth) {
  let totalWidth = 0;
  row.forEach(section => {
    totalWidth += section.width;
  });
  expect(totalWidth).toBe(levelWidth);
}

function testWidthsAddUp(level) {
  level.boardSections.forEach(row => {
    testWidthsAddUpForARow(row, level.dimensions.width);
  });
}

function checkXValues(level) {
  level.boardSections.forEach(row => {
    let expectedX = 0;
    row.forEach(section => {
      expect(section.x).toBe(expectedX);
      expectedX += section.width;
    });
  });
}

function checkYValues(level) {
  let expectedY = 0;
  level.boardSections.forEach(row => {
    expect(row[0].y).toBe(expectedY);
    expectedY += row[0].height;
  });
}

describe('Checking total area', () => {
  levels.forEach(level => {
    it(`pieces area matches total area for level ${level.id}`, () => {
      testAreaEquivalence(level);
    });
  });
});

describe('Checking x and y values', () => {
  levels.forEach(level => {
    it(`correct x values for level ${level.id}`, () => {
      checkXValues(level);
    });
    it(`correct y values for level ${level.id}`, () => {
      checkYValues(level);
    });
  });
});

describe('Checking widths and heights', () => {
  levels.forEach(level => {
    it(`constant row height for level ${level.id}`, () => {
      testMatchingHeights(level);
    });
    it(`rows add up to total height for level ${level.id}`, () => {
      testHeightsAddUp(level);
    });
    it(`sections add up to total width for level ${level.id}`, () => {
      testWidthsAddUp(level);
    });
  });
});
