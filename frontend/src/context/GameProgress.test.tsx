/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/react';
import React from 'react';
import { render, act } from '@testing-library/react';
import { GameProgressProvider, useGameProgress } from './GameProgress';

// Keep the provider's side effects out of the unit test.
vi.mock('@hotjar/browser', () => ({
  default: { event: vi.fn() },
}));
vi.mock('../lib/api', () => ({
  syncLevelProgress: vi.fn(),
}));

function TestConsumer({ callback }: { callback: (ctx: any) => void }) {
  const ctx = useGameProgress();
  React.useEffect(() => {
    if (ctx) callback(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);
  return null;
}

const renderProvider = (callback: (ctx: any) => void) =>
  render(
    <GameProgressProvider>
      <TestConsumer callback={callback} />
    </GameProgressProvider>
  );

beforeEach(() => {
  window.localStorage.clear();
});

describe('setBoardSquaresForLevel (issue #117)', () => {
  it('saves a board snapshot for the given level', () => {
    let context: any;
    renderProvider(ctx => (context = ctx));
    const board = [
      ['invalid', ''],
      ['piece-1', 'piece-1'],
    ];
    act(() => {
      context.setBoardSquaresForLevel(1, board);
    });
    expect(context.gameProgress[1].boardSquares).toEqual(board);
    // Other levels keep their empty snapshot.
    expect(context.gameProgress[0].boardSquares).toEqual([]);
  });

  it('stores a deep copy so later board mutations do not corrupt the snapshot', () => {
    let context: any;
    renderProvider(ctx => (context = ctx));
    const board = [['piece-1', '']];
    act(() => {
      context.setBoardSquaresForLevel(0, board);
    });
    // Mutate the original array in place after saving.
    board[0][1] = 'piece-2';
    expect(context.gameProgress[0].boardSquares).toEqual([['piece-1', '']]);
  });

  it('resetLevel clears the saved board snapshot', () => {
    let context: any;
    renderProvider(ctx => (context = ctx));
    act(() => {
      context.setBoardSquaresForLevel(0, [['piece-1', '']]);
    });
    act(() => {
      context.resetLevel(0);
    });
    expect(context.gameProgress[0].boardSquares).toEqual([]);
  });
});
