import { test, expect, type Page } from '@playwright/test';
import { openFreshGame, pieceLocator, boardSquare, dragPieceTo } from './helpers';

function movesForLevel(page: Page, level: number) {
  return page.evaluate((lvl) => {
    const progress = JSON.parse(
      window.localStorage.getItem('gameProgress') || '[]'
    );
    return progress[lvl]?.moves;
  }, level);
}

test.describe('Move tracking (issue #115)', () => {
  test('counts each placement as a move in GameProgress', async ({ page }) => {
    await openFreshGame(page, 0);
    const board = page.getByTestId('board-wrapper');

    // First placement: tray -> board. Pieces are addressed by their order-path
    // label ("4"), not their opaque uuid id.
    await dragPieceTo(page, pieceLocator(page, '4'), boardSquare(page, 2, 0));
    await expect(board.getByTestId('4')).toBeVisible();
    await expect(page.getByTestId('drag-overlay')).toHaveCount(0);
    await expect.poll(() => movesForLevel(page, 0)).toBe(1);

    // Moving the placed piece is another move.
    await dragPieceTo(page, board.getByTestId('4'), boardSquare(page, 0, 4));
    await expect(page.getByTestId('drag-overlay')).toHaveCount(0);
    await expect.poll(() => movesForLevel(page, 0)).toBe(2);
  });

  test('stores an anonymous clientId for backend sync', async ({ page }) => {
    await openFreshGame(page, 0);
    const board = page.getByTestId('board-wrapper');

    await dragPieceTo(page, pieceLocator(page, '4'), boardSquare(page, 2, 0));
    await expect(board.getByTestId('4')).toBeVisible();

    const clientId = await page.evaluate(() =>
      window.localStorage.getItem('clientId')
    );
    expect(clientId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });
});
