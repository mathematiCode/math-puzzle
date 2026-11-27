import levels from '../Game/levels.json';
import { ToolLimits, ToolName } from '../types/tools';
import { useCurrentLevel } from '../context/CurrentLevel';
import { useGameProgress } from '../context/GameProgress';

/**
 * Reads the current level's per-tool usage caps (from levels.json `limits`) and
 * how many uses remain, and records a use. Each toolbar action is allowed only a
 * limited number of times per level; the count decrements with every use and the
 * tool is disabled once it hits zero (issues #37/#38).
 *
 * A level with no `limits` entry (or a tool missing from it) is treated as
 * unlimited, so the game keeps working if a level is authored without caps.
 */
export function useToolLimits() {
  const { currentLevel } = useCurrentLevel();
  const { gameProgress, incrementToolUsage } = useGameProgress();

  const limits = levels[currentLevel]?.limits as Partial<ToolLimits> | undefined;
  const usage = gameProgress[currentLevel]?.toolUsage ?? {};

  /** The authored cap for a tool, or null when the tool is unlimited. */
  function getLimit(tool: ToolName): number | null {
    return limits?.[tool] ?? null;
  }

  /** Uses left for a tool (Infinity when unlimited); never negative. */
  function getRemaining(tool: ToolName): number {
    const limit = getLimit(tool);
    if (limit == null) return Infinity;
    return Math.max(0, limit - (usage[tool] ?? 0));
  }

  function hasRemaining(tool: ToolName): boolean {
    return getRemaining(tool) > 0;
  }

  /** Record one use of a tool against the current level. */
  function recordToolUse(tool: ToolName): void {
    incrementToolUsage(currentLevel, tool);
  }

  return { getLimit, getRemaining, hasRemaining, recordToolUse };
}
