import { test, expect } from '@playwright/test';
import {
  openFreshGame,
  pieceLocator,
  pieceIdByLabel,
  boardSquare,
  dragPieceTo,
  startDraggingPiece,
} from './helpers';

test.describe('Game load', () => {
  test('shows the board and level pieces on load', async ({ page }) => {
    await openFreshGame(page, 0);

    await expect(page.getByText('Level 1')).toBeVisible();
    await expect(page.getByTestId('board-wrapper')).toBeVisible();

    // Level 1 has four playable pieces, labelled 1…4 by their order path;
    // the sample piece only appears in the instructions modal.
    await expect(pieceLocator(page, '1')).toBeVisible();
    await expect(pieceLocator(page, '2')).toBeVisible();
    await expect(pieceLocator(page, '3')).toBeVisible();
    await expect(pieceLocator(page, '4')).toBeVisible();
  });
});

test.describe('Drag and drop', () => {
  test('shows a drag overlay for the dragged piece while moving', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    const piece = pieceLocator(page, '4');
    const { startX, startY } = await startDraggingPiece(page, piece);

    const overlay = page.getByTestId('drag-overlay');
    await expect(overlay).toBeVisible();
    // The overlay advertises which piece it represents by its order-path label.
    await expect(overlay).toHaveAttribute('data-piece-id', '4');

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

    // Piece 4 is 2×1 — easy to place on the valid top-right area starting at (2,0).
    const tray = page.getByTestId('pieces-container');
    const board = page.getByTestId('board-wrapper');
    const trayPiece = tray.getByTestId('4');
    const target = boardSquare(page, 2, 0);

    await dragPieceTo(page, trayPiece, target);

    // Label stays stable; location moves it from tray to board.
    await expect(board.getByTestId('4')).toBeVisible();
    await expect(tray.getByTestId('4')).toHaveCount(0);

    const placedLocation = await page.evaluate(() => {
      const pieces = JSON.parse(
        window.localStorage.getItem('piecesInPlay') || '[]'
      );
      return pieces.find(
        (p: { order: number[] }) => p.order.join('.') === '4'
      )?.location;
    });
    expect(placedLocation).toBe('(2,0)');
  });

  test('moves a piece already on the board to a new square', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    const board = page.getByTestId('board-wrapper');

    await dragPieceTo(page, pieceLocator(page, '4'), boardSquare(page, 2, 0));
    await expect(board.getByTestId('4')).toBeVisible();
    // Wait for tray→board layout animation to finish before the next drag.
    await expect(page.getByTestId('drag-overlay')).toHaveCount(0);
    await expect
      .poll(async () => {
        const pieces = await page.evaluate(() =>
          JSON.parse(window.localStorage.getItem('piecesInPlay') || '[]')
        );
        return pieces.find(
          (p: { order: number[] }) => p.order.join('.') === '4'
        )?.location;
      })
      .toBe('(2,0)');

    await dragPieceTo(
      page,
      board.getByTestId('4'),
      boardSquare(page, 0, 4)
    );

    await expect(board.getByTestId('4')).toBeVisible();

    await expect
      .poll(async () => {
        const pieces = await page.evaluate(() =>
          JSON.parse(window.localStorage.getItem('piecesInPlay') || '[]')
        );
        return pieces.find(
          (p: { order: number[] }) => p.order.join('.') === '4'
        )?.location;
      })
      .toBe('(0,4)');
  });

  test('a piece dropped back in the tray stays hidden until its copy animates home (issue #84)', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    const tray = page.getByTestId('pieces-container');
    const piece = tray.getByTestId('1');

    const pieceBox = await piece.boundingBox();
    const trayBox = await tray.boundingBox();
    if (!pieceBox || !trayBox) throw new Error('missing bounding boxes');

    // Grab the piece and release it elsewhere *inside the tray* (not over any
    // board square), so dnd-kit reports no drop target and the piece returns to
    // the tray with a drop animation. Release near the tray's left edge, well
    // away from the board (which sits to the right) — collision detection rates
    // droppables by the dragged piece's rect, so a release near the board edge
    // would otherwise land the piece on a square.
    const startX = pieceBox.x + 8;
    const startY = pieceBox.y + 8;
    const dropX = trayBox.x + 15;
    const dropY = trayBox.y + trayBox.height - 20;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 30, startY + 30, { steps: 5 });
    await page.mouse.move(dropX, dropY, { steps: 15 });
    await page.mouse.up();

    // While the released copy animates back to the home slot, the real piece
    // must NOT appear in its final place — only the animating overlay is shown.
    const overlay = page.getByTestId('drag-overlay');
    await expect(overlay).toBeVisible();
    await expect(piece).toBeHidden();

    // Once the animation finishes the overlay is gone and the single real piece
    // is visible again, still in the tray (never placed on the board).
    await expect(overlay).toHaveCount(0);
    await expect(piece).toBeVisible();
    await expect(tray.getByTestId('1')).toHaveCount(1);

    const location = await page.evaluate(() => {
      const pieces = JSON.parse(
        window.localStorage.getItem('piecesInPlay') || '[]'
      );
      return pieces.find((p: { order: number[] }) => p.order.join('.') === '1')
        ?.location;
    });
    expect(location).toBeNull();
  });

  test('records overlapping piece ids when two pieces share squares', async ({
    page,
  }) => {
    await openFreshGame(page, 0);

    const board = page.getByTestId('board-wrapper');

    // Place the small 2×1 piece, then drop another piece on top of it.
    await dragPieceTo(page, pieceLocator(page, '4'), boardSquare(page, 2, 2));
    await expect(board.getByTestId('4')).toBeVisible();

    await dragPieceTo(page, pieceLocator(page, '1'), boardSquare(page, 2, 2));
    await expect(board.getByTestId('1')).toBeVisible();

    // The board grid stores pieces by their opaque id; resolve the ids first.
    const id4 = await pieceIdByLabel(page, '4');
    const id1 = await pieceIdByLabel(page, '1');
    expect(id4).toBeTruthy();
    expect(id1).toBeTruthy();

    // Both pieces remain on the board; shared cells should list both ids.
    const boardSquares = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('boardSquares') || '[]')
    );
    const sharedCell: string = boardSquares[2][2];
    expect(sharedCell).toContain(id4);
    expect(sharedCell).toContain(id1);
    expect(sharedCell.split(', ').length).toBeGreaterThanOrEqual(2);

    const piecesInPlay = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('piecesInPlay') || '[]')
    );
    const overlapping = piecesInPlay.filter((p: { order: number[] }) => {
      const label = p.order.join('.');
      return label === '1' || label === '4';
    });
    expect(
      overlapping.some((p: { isStable?: boolean }) => p.isStable === false)
    ).toBe(true);
  });

  test('does not place a piece partially off the board (issue #59)', async ({
    page,
  }) => {
    // Level 2 is non-rectangular: rows 0–2 are only 5 wide (cols 5–6 are
    // off-shape), while the lower rows are 7 wide. Dropping the 3×3 piece
    // (label 2) with its top-left at (4,0) would hang cols 5–6 off the board.
    await openFreshGame(page, 1);

    const board = page.getByTestId('board-wrapper');
    const tray = page.getByTestId('pieces-container');

    await dragPieceTo(page, tray.getByTestId('2'), boardSquare(page, 4, 0));
    // Let any drop / return-to-tray animation settle.
    await expect(page.getByTestId('drag-overlay')).toHaveCount(0);

    // Invariant: no placed piece may cover an 'invalid' (off-shape) or
    // out-of-bounds square. The piece is rejected and returns to the tray.
    const { offBoard, placedLabels } = await page.evaluate(() => {
      const pieces = JSON.parse(
        window.localStorage.getItem('piecesInPlay') || '[]'
      );
      const boardSquares: string[][] = JSON.parse(
        window.localStorage.getItem('boardSquares') || '[]'
      );
      const offBoard: string[] = [];
      const placedLabels: string[] = [];
      for (const piece of pieces) {
        const location: string | null = piece.location;
        if (!location || location === 'instructions') continue;
        placedLabels.push(piece.order.join('.'));
        const [x, y] = location
          .replace(/[()]/g, '')
          .split(',')
          .map(Number);
        for (let row = y; row < y + piece.height; row++) {
          for (let col = x; col < x + piece.width; col++) {
            const cell = boardSquares?.[row]?.[col];
            if (cell === undefined || cell === 'invalid') {
              offBoard.push(piece.order.join('.'));
            }
          }
        }
      }
      return { offBoard, placedLabels };
    });

    expect(offBoard).toEqual([]);
    // The rejected piece stays in the tray rather than landing off the board.
    expect(placedLabels).not.toContain('2');
    await expect(tray.getByTestId('2')).toBeVisible();
    await expect(board.getByTestId('2')).toHaveCount(0);
  });
});
