import levels from './levels.json';

export const currentLevel = 1;
export const initialPieces = levels[currentLevel].pieces;
// export const sizeOfEachUnit = 45;

const { width, height } = levels[currentLevel].dimensions;
console.log('dimensions', width, height);

export const sizeOfEachUnit = Math.round(500 / Math.max(width, height));

export const colors = [
  'hsl(178, 100%, 32%)',
  'hsl(0, 61%, 66%)',
  'hsl(185, 78%, 80%)',
  'hsl(38, 87%, 66%)',
];
