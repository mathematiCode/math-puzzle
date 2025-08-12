import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PiecesInPlayProvider, PiecesInPlayContext } from './PiecesInPlay';
import { CurrentLevelContext } from './CurrentLevel';
import { BoardSquaresContext } from './BoardSquares';
import { Piece } from '../types/piece';
import { useContext, useEffect } from 'react';

// Mock dependencies
vi.mock('@hotjar/browser', () => ({
  default: {
    event: vi.fn(),
  },
}));

vi.mock('../Game/utils/utilities', () => ({
  convertLocationToXAndY: vi.fn(location => {
    if (location === '(1,2)') return { x: 1, y: 2 };
    if (location === '(0,0)') return { x: 0, y: 0 };
    return { x: 0, y: 0 };
  }),
  getPieceNumber: vi.fn(id => {
    const match = id.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }),
}));

vi.mock('../Game/utils/getNewValidLocation', () => ({
  getNewValidLocation: vi.fn(
    (x, y, width, height, boardWidth, boardHeight) => ({
      correctedX: Math.max(0, Math.min(x, boardWidth - width)),
      correctedY: Math.max(0, Math.min(y, boardHeight - height)),
    })
  ),
}));

// Test component to access context
function TestComponent({ onContext }: { onContext: (context: any) => void }) {
  const context = useContext(PiecesInPlayContext);
  useEffect(() => {
    if (context) {
      onContext(context);
    }
  }, [context, onContext]);
  return <div>Test</div>;
}

describe('PiecesInPlay updateDimensions', () => {
  let mockContext: any;
  let mockPiecesInPlay: Piece[];

  const mockCurrentLevelContext = {
    currentLevel: 0,
    initialPieces: [
      {
        id: 'sample-0',
        width: 3,
        height: 2,
        location: 'instructions',
        color: 'hsl(0, 61%, 66%)',
        isRotated: false,
      },
      {
        id: 'i-1',
        width: 2,
        height: 3,
        location: null,
        color: 'red',
        isRotated: false,
      },
      {
        id: 'b-2',
        width: 1,
        height: 2,
        location: '(1,2)',
        color: 'blue',
        isRotated: false,
      },
    ],
    boardDimensions: { boardWidth: 5, boardHeight: 5 },
    levelId: 1,
    levelPosition: 'middle' as const,
    sizeOfEachUnit: 1,
    previousLevel: vi.fn(),
    nextLevel: vi.fn(),
    setSizeOfEachUnit: vi.fn(),
    setCurrentLevel: vi.fn(),
  };

  const mockBoardSquaresContext = {
    boardSquares: Array(5)
      .fill(null)
      .map(() => Array(5).fill('')),
    setBoardSquares: vi.fn(),
    addPieceToBoard: vi.fn(),
    removePieceFromBoard: vi.fn(),
    resetBoardSquares: vi.fn(),
    countOverlappingSquares: vi.fn(() => ({
      outerOverlaps: 0,
      innerOverlaps: 0,
      squaresOutsideBoard: 0,
    })),
    getUnstablePieces: vi.fn(() => []),
    checkIfPassedLevel: vi.fn(() => false),
  };

  beforeEach(() => {
    mockPiecesInPlay = [
      {
        id: 'sample-0',
        width: 3,
        height: 2,
        location: 'instructions',
        color: 'hsl(0, 61%, 66%)',
        isRotated: false,
      },
      {
        id: 'i-1',
        width: 2,
        height: 3,
        location: null,
        color: 'red',
        isRotated: false,
      },
      {
        id: 'b-2',
        width: 1,
        height: 2,
        location: '(1,2)',
        color: 'blue',
        isRotated: false,
      },
    ] as Piece[];

    const freshMockCurrentLevelContext = {
      ...mockCurrentLevelContext,
      initialPieces: mockPiecesInPlay as any, // Cast to avoid type issues in test
    };

    render(
      <CurrentLevelContext.Provider value={freshMockCurrentLevelContext}>
        <BoardSquaresContext.Provider value={mockBoardSquaresContext}>
          <PiecesInPlayProvider>
            <TestComponent
              onContext={context => {
                mockContext = context;
              }}
            />
          </PiecesInPlayProvider>
        </BoardSquaresContext.Provider>
      </CurrentLevelContext.Provider>
    );
  });

  // Helper function to wait for state updates
  const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0));

  describe('Valid piece updates', () => {
    it('should update dimensions for a valid piece ID', async () => {
      const pieceId = 'i-1';
      const newWidth = 4;
      const newHeight = 2;

      mockContext.updateDimensions(pieceId, newWidth, newHeight);
      await waitForUpdate();

      const updatedPiece = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === pieceId
      );
      expect(updatedPiece).toBeDefined();
      expect(updatedPiece.width).toBe(newWidth);
      expect(updatedPiece.height).toBe(newHeight);
    });

    it('should update dimensions for a board piece', async () => {
      const pieceId = 'b-2';
      const newWidth = 3;
      const newHeight = 1;

      mockContext.updateDimensions(pieceId, newWidth, newHeight);
      await waitForUpdate();

      const updatedPiece = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === pieceId
      );
      expect(updatedPiece).toBeDefined();
      expect(updatedPiece.width).toBe(newWidth);
      expect(updatedPiece.height).toBe(newHeight);
    });

    it('should preserve other piece properties when updating dimensions', () => {
      const pieceId = 'i-1';
      const originalPiece = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === pieceId
      );
      const newWidth = 5;
      const newHeight = 3;

      mockContext.updateDimensions(pieceId, newWidth, newHeight);

      const updatedPiece = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === pieceId
      );
      expect(updatedPiece.id).toBe(originalPiece.id);
      expect(updatedPiece.location).toBe(originalPiece.location);
      expect(updatedPiece.color).toBe(originalPiece.color);
      expect(updatedPiece.isRotated).toBe(originalPiece.isRotated);
    });

    it('should not affect other pieces when updating one piece', () => {
      const pieceId = 'i-1';
      const otherPieceId = 'b-2';
      const originalOtherPiece = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === otherPieceId
      );

      mockContext.updateDimensions(pieceId, 4, 2);

      const unchangedPiece = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === otherPieceId
      );
      expect(unchangedPiece.width).toBe(originalOtherPiece.width);
      expect(unchangedPiece.height).toBe(originalOtherPiece.height);
    });
  });

  describe('Invalid piece ID handling', () => {
    it('should log error and return early for non-existent piece ID', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const pieceId = 'non-existent-id';
      const newWidth = 4;
      const newHeight = 2;

      mockContext.updateDimensions(pieceId, newWidth, newHeight);

      expect(consoleSpy).toHaveBeenCalledWith('Piece not found');
      expect(mockContext.piecesInPlay).toEqual(mockPiecesInPlay); // No changes

      consoleSpy.mockRestore();
    });

    it('should handle empty string piece ID', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const pieceId = '';
      const newWidth = 4;
      const newHeight = 2;

      mockContext.updateDimensions(pieceId, newWidth, newHeight);

      expect(consoleSpy).toHaveBeenCalledWith('Piece not found');
      consoleSpy.mockRestore();
    });

    it('should handle null piece ID', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const pieceId = null as any;
      const newWidth = 4;
      const newHeight = 2;

      mockContext.updateDimensions(pieceId, newWidth, newHeight);

      expect(consoleSpy).toHaveBeenCalledWith('Piece not found');
      consoleSpy.mockRestore();
    });
  });

  describe('Multiple updates', () => {
    it('should handle multiple consecutive updates to the same piece', async () => {
      const pieceId = 'b-2';

      const piece1Before = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === pieceId
      );
      expect(piece1Before.width).toBe(1); // Original width
      expect(piece1Before.height).toBe(2); // Original height

      await mockContext.updateDimensions(pieceId, 3, 4);
      await mockContext.updateDimensions(pieceId, 5, 2);
      await mockContext.updateDimensions(pieceId, 1, 1);

      const piece1 = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === 'i-1'
      );
      const piece2 = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === 'b-2'
      );
      expect(piece1.width).toBe(2);
      expect(piece1.height).toBe(3);
      expect(piece2.width).toBe(1);
      expect(piece2.height).toBe(1);
    });

    it('should handle updates to different pieces', async () => {
      // Get pieces before updates
      const piece1Before = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === 'i-1'
      );
      expect(piece1Before.width).toBe(2); // Original width
      expect(piece1Before.height).toBe(3); // Original width

      const piece2Before = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === 'b-2'
      );
      expect(piece2Before.width).toBe(1); // Original width
      expect(piece2Before.height).toBe(2); // Original width

      await mockContext.updateDimensions('i-1', 3, 4);
      await mockContext.updateDimensions('b-2', 2, 3);
      const piece1 = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === 'i-1'
      );
      const piece2 = mockContext.piecesInPlay.find(
        (p: Piece) => p.id === 'b-2'
      );
      expect(piece1.width).toBe(3);
      expect(piece1.height).toBe(4);
      expect(piece2.width).toBe(2);
      expect(piece2.height).toBe(3);
    });
  });
});
