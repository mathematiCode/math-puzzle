import { expect } from '@playwright/test';
import { convertLocationToXAndY } from '../../src/utilities';

/**
 * Utility to drag a puzzle piece to a board location.
 * @param page Playwright page object
 * @param pieceIndex Index of the piece in [data-testid="initial-piece"]
 * @param targetId The id of the board square to drop on, e.g. "(2,1)"
 */
export async function dragPieceToLocation(page, pieceIndex, targetId) {
  const pieces = page.locator('[data-testid="initial-piece"]');
  const piece = pieces.nth(pieceIndex);
  await expect(piece).toBeVisible();

  // Find the droppable target by id
  // const dropTarget = page.locator(`#\\(${targetId.replace(',', '\\,')}\\)`);
  const { x, y } = convertLocationToXAndY(targetId);

  const dropTarget = page.locator(`#\\(${x}\\,${y}\\)`);

  await expect(dropTarget).toBeVisible();

  // Slow manual drag for visibility
  const pieceBox = await piece.boundingBox();
  const targetBox = await dropTarget.boundingBox();
  if (pieceBox && targetBox) {
    await page.mouse.move(
      pieceBox.x + pieceBox.width / 2,
      pieceBox.y + pieceBox.height / 2
    );
    await page.waitForTimeout(5);
    await page.mouse.down();
    await page.waitForTimeout(5);
    // Move in steps for visible drag
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const x = pieceBox.x + (targetBox.x - pieceBox.x) * (i / steps);
      const y = pieceBox.y + (targetBox.y - pieceBox.y) * (i / steps);
      await page.mouse.move(x, y);
      await page.waitForTimeout(10);
    }
    await page.mouse.up();
    await page.waitForTimeout(0);
  } else {
    throw new Error('Could not find bounding boxes for drag and drop');
  }
}
