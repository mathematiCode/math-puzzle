import { describe, it, expect } from 'vitest';
import { getLevelIds, getLevelId } from './getLevelsArray';

describe('level ids', () => {
  // Progress/analytics are keyed by a level's stable id (issue #105), so a
  // reused id would silently merge two different levels' tracking data. When
  // adding a level, always give it a brand-new, never-used id.
  it('are unique across all levels', () => {
    const ids = getLevelIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('are all positive integers', () => {
    for (const id of getLevelIds()) {
      expect(Number.isInteger(id)).toBe(true);
      expect(id).toBeGreaterThan(0);
    }
  });

  it('getLevelId returns the id at each index', () => {
    const ids = getLevelIds();
    ids.forEach((id, index) => {
      expect(getLevelId(index)).toBe(id);
    });
  });
});
