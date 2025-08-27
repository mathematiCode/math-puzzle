/**
 * Generates random vibration animation properties for unstable puzzle pieces.
 * Each piece gets a random delay and starts vibrating from a random position in the sequence.
 */
export function getRandomVibrationAnimation() {
  const xSequence = [0, -1, 1, -1, 1, 0];
  const ySequence = [0, 1, -1, 1, -1, 0];

  // Randomize the starting direction by rotating the arrays
  const getRandomSequence = (arr: number[]) => {
    const offset = Math.floor(Math.random() * arr.length);
    return [...arr.slice(offset), ...arr.slice(0, offset)];
  };

  return {
    x: getRandomSequence(xSequence),
    y: getRandomSequence(ySequence),
    transition: {
      duration: 0.2,
      repeat: Infinity,
      ease: 'linear',
      delay: Math.random() * 0.3, // Random delay between 0-0.5 seconds
    },
  };
}
