import { test, expect } from '@playwright/test';
import { openFreshGame, pieceLocator, boardSquare } from './helpers';

test.describe('Piece drop preview', () => {
  test('shows a translucent preview at the landing square while dragging', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    const piece = pieceLocator(page, 'i-4');
    const sourceBox = await piece.boundingBox();
    const target = boardSquare(page, 2, 0);
    const targetBox = await target.boundingBox();
    if (!sourceBox || !targetBox) throw new Error('missing bounding boxes');

    const startX = sourceBox.x + 8;
    const startY = sourceBox.y + 8;
    const endX = targetBox.x + 8;
    const endY = targetBox.y + 8;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 30, startY + 30, { steps: 5 });
    await page.mouse.move(endX, endY, { steps: 20 });

    // Preview ghost should be visible while hovering over the board, before drop.
    const preview = page.getByTestId('piece-preview');
    await expect(preview).toBeVisible();

    await page.mouse.up();

    // Preview disappears after the piece is dropped.
    await expect(page.getByTestId('piece-preview')).toHaveCount(0);
  });
});
