import levels from '../levels.json';

/**
 * Creates an array with the same length as the number of levels in levels.json
 * Each element can be customized based on your needs
 *
 * @param defaultValue - The default value to populate each array element with
 * @returns An array with length equal to the number of levels
 */
export function getLevelsArray<T>(defaultValue: T): T[] {
  return new Array(levels.length).fill(defaultValue);
}

/**
 * Creates an array of level progress objects, one for each level
 * @returns An array of level progress objects
 */
export function getInitialGameProgressArray() {
  return getLevelsArray({
    completed: false,
    attempts: 0,
    bestTime: undefined,
    solution: undefined,
  });
}

/**
 * Creates an array of booleans for level completion status
 * @returns An array of booleans (false for each level)
 */
export function getLevelCompletionArray(): boolean[] {
  return getLevelsArray(false);
}

/**
 * Creates an array of numbers for level attempts
 * @returns An array of numbers (0 for each level)
 */
export function getLevelAttemptsArray(): number[] {
  return getLevelsArray(0);
}

/**
 * Gets the total number of levels
 * @returns The number of levels in levels.json
 */
export function getTotalLevels(): number {
  return levels.length;
}

/**
 * Gets all level IDs from levels.json
 * @returns An array of level IDs
 */
export function getLevelIds(): number[] {
  return levels.map(level => level.id);
}

/**
 * Gets the stable, order-independent id for the level at a given index.
 *
 * Progress/analytics are tracked by this id (not the index) so levels can be
 * reordered or inserted without scrambling historical data (issue #105).
 *
 * @param index - Zero-based position of the level in levels.json
 * @returns The level's stable id
 */
export function getLevelId(index: number): number {
  return levels[index].id;
}
