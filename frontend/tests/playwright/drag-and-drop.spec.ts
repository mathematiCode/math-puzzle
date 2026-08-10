import { test, expect } from '@playwright/test';
import {
  openFreshGame,
  pieceLocator,
  boardSquare,
  dragPieceTo,
  startDraggingPiece,
} from './helpers';

test.describe('Game load', () => {
  test('shows the board and level pieces on load', async ({ page }) => {
    await openFreshGame(page, 0);

    await expect(page.getByText('Level 1')).toBeVisible();
    await expect(page.getByTestId('board-wrapper')).toBeVisible();

    // Level 1 has four playable pieces (ids i-1 … i-4); sample piece is only in instructions.
    await expect(pieceLocator(page, 'i-1')).toBeVisible();
    await expect(pieceLocator(page, 'i-2')).toBeVisible();
    await expect(pieceLocator(page, 'i-3')).toBeVisible();
    await expect(pieceLocator(page, 'i-4')).toBeVisible();
  });
});

test.describe('Drag and drop', () => {
  test('shows a drag overlay for the dragged piece while moving', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    const piece = pieceLocator(page, 'i-4');
    const { startX, startY } = await startDraggingPiece(page, piece);

    const overlay = page.getByTestId('drag-overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute('data-piece-id', 'i-4');

    // Source piece is hidden while the overlay represents it under the pointer.
    await expect(piece).toBeHidden();

    const midX = startX + 120;
    const midY = startY + 80;
    await page.mouse.move(midX, midY, { steps: 10 });

    const overlayBox = await overlay.boundingBox();
    expect(overlayBox).toBeTruthy();
    // Overlay should stay near the cursor (dnd-kit DragOverlay follows the pointer).
    expect(Math.abs(overlayBox!.x - midX)).toBeLessThan(120);
    expect(Math.abs(overlayBox!.y - midY)).toBeLessThan(120);

    await page.mouse.up();
  });

  test('drops a piece from the tray onto the board at the target square', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    // i-4 is 2×1 — easy to place on the valid top-right area starting at (2,0).
    const trayPiece = pieceLocator(page, 'i-4');
    const target = boardSquare(page, 2, 0);

    await dragPieceTo(page, trayPiece, target);

    // On the board, id flips from i-* to b-* using the piecesInPlay index.
    const placedPiece = pieceLocator(page, 'b-4');
    await expect(placedPiece).toBeVisible();
    await expect(pieceLocator(page, 'i-4')).toHaveCount(0);

    // Piece should be gone from the tray.
    const tray = page.getByTestId('pieces-container');
    await expect(tray.getByTestId('i-4')).toHaveCount(0);
    await expect(tray.getByTestId('b-4')).toHaveCount(0);
  });

  test('moves a piece already on the board to a new square', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    await dragPieceTo(
      page,
      pieceLocator(page, 'i-4'),
      boardSquare(page, 2, 0)
    );
    await expect(pieceLocator(page, 'b-4')).toBeVisible();

    // Drop well away from the first placement. Collision detection uses the
    // piece's top-left, so aim for a square that stays under that corner.
    await dragPieceTo(
      page,
      pieceLocator(page, 'b-4'),
      boardSquare(page, 0, 4)
    );

    // Same piece id should still be on the board after the move.
    await expect(pieceLocator(page, 'b-4')).toBeVisible();
    await expect(pieceLocator(page, 'i-4')).toHaveCount(0);

    const piecesInPlay = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('piecesInPlay') || '[]')
    );
    const moved = piecesInPlay.find(
      (p: { id: string }) => p.id === 'b-4'
    );
    expect(moved?.location).toBe('(0,4)');
  });

  test('records overlapping piece ids when two pieces share squares', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    // Place the small 2×1 piece, then drop another piece on top of it.
    await dragPieceTo(
      page,
      pieceLocator(page, 'i-4'),
      boardSquare(page, 2, 2)
    );
    await expect(pieceLocator(page, 'b-4')).toBeVisible();

    await dragPieceTo(
      page,
      pieceLocator(page, 'i-1'),
      boardSquare(page, 2, 2)
    );
    await expect(pieceLocator(page, 'b-1')).toBeVisible();

    // Both pieces remain on the board; shared cells should list both ids.
    const boardSquares = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('boardSquares') || '[]')
    );
    const sharedCell: string = boardSquares[2][2];
    expect(sharedCell).toContain('b-4');
    expect(sharedCell).toContain('b-1');
    expect(sharedCell.split(', ').length).toBeGreaterThanOrEqual(2);

    const piecesInPlay = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('piecesInPlay') || '[]')
    );
    const overlapping = piecesInPlay.filter(
      (p: { id: string; isStable?: boolean }) =>
        p.id === 'b-1' || p.id === 'b-4'
    );
    expect(overlapping.some((p: { isStable?: boolean }) => p.isStable === false)).toBe(
      true
    );
  });
});
