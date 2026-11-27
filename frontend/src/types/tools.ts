/**
 * The mathematical tools in the actions toolbar. Each level caps how many times
 * each tool may be used (see each level's `limits` in levels.json). `combine`
 * isn't built yet but is included so its per-level limit can be authored now.
 */
export const TOOL_NAMES = [
  'rotate',
  'horizontalStretch',
  'verticalStretch',
  'cut',
  'combine',
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];

/** Per-level cap on how many times each tool may be used. */
export type ToolLimits = Record<ToolName, number>;

/** How many times each tool has been used so far on a level. */
export type ToolUsage = Partial<Record<ToolName, number>>;
