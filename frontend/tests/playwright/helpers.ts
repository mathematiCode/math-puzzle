import { expect, type Locator, type Page } from '@playwright/test';

/** Level index 0 is shown as "Level 1" in the UI. */
export async function openFreshGame(page: Page, levelIndex = 0) {
  await page.addInitScript((level: number) => {
    window.localStorage.clear();
    window.localStorage.setItem('currentLevel', String(level));
  }, levelIndex);

  await page.goto('/game');
  await expect(page.getByTestId('pieces-container')).toBeVisible();
  await expect(page.getByTestId('board-wrapper')).toBeVisible();
}

export function pieceLocator(page: Page, pieceId: string) {
  return page.getByTestId(pieceId);
}

export function boardSquare(page: Page, x: number, y: number) {
  return page.locator(`[id="(${x},${y})"]`);
}

/**
 * dnd-kit needs intermediate pointer moves past its activation distance
 * (20px in this app). Playwright's dragTo can skip those.
 *
 * Collision detection rates droppables from the dragged piece's top-left.
 * Grabbing near the source top-left keeps that corner aligned with the cursor
 * so drops land on the intended board square.
 */
export async function dragPieceTo(
  page: Page,
  source: Locator,
  target: Locator
) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) {
    throw new Error('Could not get bounding boxes for drag');
  }

  const startX = sourceBox.x + Math.min(8, sourceBox.width / 4);
  const startY = sourceBox.y + Math.min(8, sourceBox.height / 4);
  const endX = targetBox.x + Math.min(8, targetBox.width / 4);
  const endY = targetBox.y + Math.min(8, targetBox.height / 4);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // Move far enough to satisfy the 20px activation constraint, then to target.
  await page.mouse.move(startX + 30, startY + 30, { steps: 5 });
  await page.mouse.move(endX, endY, { steps: 20 });
  await page.mouse.up();
}

export async function startDraggingPiece(page: Page, source: Locator) {
  const sourceBox = await source.boundingBox();
  if (!sourceBox) {
    throw new Error('Could not get bounding box for piece');
  }

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 40, startY + 40, { steps: 10 });

  return { startX, startY };
}
