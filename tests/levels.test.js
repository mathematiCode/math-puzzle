import { describe, it, expect } from 'vitest';
import levels from '../src/levels.json';

// Function to test area equivalence
function testAreaEquivalence(level) {
  let totalValidArea = 0;
  let totalPieceArea = 0;

  // Calculate total area of valid board sections
  level.boardSections.forEach(sectionList => {
    sectionList.forEach(section => {
      if (section.valid) {
        totalValidArea += section.width * section.height;
      }
    });
  });

  // Calculate total area of pieces
  level.pieces.forEach(piece => {
    totalPieceArea += piece.width * piece.height;
  });

  // Assert that the areas are equal
  expect(totalValidArea).toBe(totalPieceArea);
  if (totalPieceArea < totalValidArea) {
    console.log(
      `You need to add ${
        totalValidArea - totalPieceArea
      } more area to the pieces`
    );
  } else if (totalPieceArea > totalValidArea) {
    console.log(
      `You need to remove ${
        totalPieceArea - totalValidArea
      } area from the pieces`
    );
  }
}

function testMatchingHeights(level) {
  // Calculate total width and height of board
  level.boardSections.forEach(sectionList => {
    sectionList.forEach(section => {
      // check if each section.height is equal to the first section height
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

// Vitest test suite
describe('Puzzle Game Level Area Tests', () => {
  levels.forEach(level => {
    it(`pieces area adds up to total area for level ${level.id}`, () => {
      testAreaEquivalence(level);
    });
    it(`each row has a constant height for level ${level.id}`, () => {
      testMatchingHeights(level);
    });
    it(`all rows should add up to the total height for level ${level.id}`, () => {
      testHeightsAddUp(level);
    });
    it(`all sections should add up to the total width for level ${level.id}`, () => {
      testWidthsAddUp(level);
    });
  });
});
