import { test as base, expect } from '@playwright/test';
import { dragPieceToLocation } from '../tests/test-helpers/dragPieceToLocation';

// Use a custom test with slowMo for headed mode
const test = base.extend({
  contextOptions: async ({ contextOptions }, use) => {
    await use({ ...contextOptions, viewport: { width: 1200, height: 900 } });
  },
  launchOptions: async ({ launchOptions }, use) => {
    await use({ ...launchOptions, slowMo: 300, headless: false });
  },
});

test.describe('Drag and Drop', () => {
  test('should drag the second puzzle piece and place it on the (2,0) square', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/game');

    dragPieceToLocation(page, 1, '(2,1)');
    await expect(page.locator('[data-testid="piece-on-board"]')).toBeVisible();
  });
  test('should drag all pieces onto the board', async ({ page }) => {
    await page.goto('http://localhost:3000/game');

    await dragPieceToLocation(page, 1, '(2,1)');
    await dragPieceToLocation(page, 1, '(0,5)');
    await dragPieceToLocation(page, 0, '(0,2)');
    await dragPieceToLocation(page, 0, '(3,4)');
    const piecesOnBoard = page.locator('[data-testid="piece-on-board"]');
    await expect(piecesOnBoard).toHaveCount(4);
    await expect(piecesOnBoard.first()).toBeVisible();
    await expect(piecesOnBoard.nth(1)).toBeVisible();
  });
});
