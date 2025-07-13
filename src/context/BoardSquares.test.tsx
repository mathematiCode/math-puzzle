/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/react';
import React from 'react';
import { render, act } from '@testing-library/react';
import { BoardSquaresProvider, BoardSquaresContext } from './BoardSquares';
import { CurrentLevelContext } from './CurrentLevel';
import { getInitialBoardSquares } from '../utils/getInitialBoardSquares';

function TestConsumer({ callback }: { callback: (ctx: any) => void }) {
  const ctx = React.useContext(BoardSquaresContext);
  React.useEffect(() => {
    if (ctx) callback(ctx);
    // eslint-disable-next-line
  }, [ctx]);
  return null;
}

const mockCurrentLevelContextValue = {
  currentLevel: 0,
  initialPieces: [
    {
      width: 2,
      height: 1,
      id: 'initial-1',
      location: null,
      isRotated: false,
      color: 'red',
    },
  ],
  boardDimensions: { boardWidth: 3, boardHeight: 3 },
  levelPosition: 'first' as 'first',
  sizeOfEachUnit: 1,
  nextLevel: () => {},
  previousLevel: () => {},
  setCurrentLevel: () => {},
  setSizeOfEachUnit: () => {},
};

const renderWithLevel = (callback: (ctx: any) => void) =>
  render(
    <CurrentLevelContext.Provider value={mockCurrentLevelContextValue}>
      <BoardSquaresProvider>
        <TestConsumer callback={callback} />
      </BoardSquaresProvider>
    </CurrentLevelContext.Provider>
  );

describe('addPieceToBoard', () => {
  it('adds a 2x2 piece to the board', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    act(() => {
      context.setBoardSquares(getInitialBoardSquares(0));
    });
    act(() => {
      context.addPieceToBoard(2, 0, 2, 2); // Only valid area in top left is (2,0)-(3,1)
    });
    expect(context.boardSquares).toEqual([
      ['invalid', 'invalid', 'full', 'full', 'empty'],
      ['invalid', 'invalid', 'full', 'full', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ]);
  });

  it('Adds only (3,2) to the board', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    act(() => {
      context.setBoardSquares(getInitialBoardSquares(0));
    });
    act(() => {
      context.addPieceToBoard(3, 2, 1, 1); // Only (3,2) should be set to 'full'
    });
    expect(context.boardSquares).toEqual([
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'full', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ]);
  });

  it('handles addition at the edge of the board', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    act(() => {
      context.setBoardSquares(getInitialBoardSquares(0));
    });
    act(() => {
      context.addPieceToBoard(4, 4, 2, 2); // Only (4,4),(4,5),(5,4),(5,5) should be set to 'full'
    });
    expect(context.boardSquares).toEqual([
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'full'],
      ['empty', 'empty', 'empty', 'empty', 'full'],
    ]);
  });

  it('logs an error if adding a piece to an invalid square', () => {
    let context: any;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithLevel(ctx => (context = ctx));
    act(() => {
      context.setBoardSquares(getInitialBoardSquares(0));
    });
    act(() => {
      context.addPieceToBoard(0, 0, 1, 1); // (0,0) is 'invalid'
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Piece was placed on invalid squares.'
    );
    errorSpy.mockRestore();
  });
});

describe('removePieceFromBoard', () => {
  it('removes a 2x2 piece from the board', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    // Start with a board where a 2x2 piece has been added at (2,0)
    const board = getInitialBoardSquares(0);
    board[0][2] = 'full';
    board[0][3] = 'full';
    board[1][2] = 'full';
    board[1][3] = 'full';
    act(() => {
      context.setBoardSquares(board.map(row => [...row]));
    });
    act(() => {
      context.removePieceFromBoard(2, 0, 2, 2);
    });
    expect(context.boardSquares).toEqual([
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ]);
  });

  it('removes only (3,2) from the board', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    // Start with a board where (3,2) is 'full'
    const board = getInitialBoardSquares(0);
    board[2][3] = 'full';
    act(() => {
      context.setBoardSquares(board.map(row => [...row]));
    });
    act(() => {
      context.removePieceFromBoard(3, 2, 1, 1);
    });
    expect(context.boardSquares).toEqual([
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ]);
  });

  it('handles removal at the edge of the board', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    // Start with a board where (4,4),(5,4) are 'full'
    const board = getInitialBoardSquares(0);
    board[4][4] = 'full';
    board[5][4] = 'full';
    act(() => {
      context.setBoardSquares(board.map(row => [...row]));
    });
    act(() => {
      context.removePieceFromBoard(4, 4, 1, 2);
    });
    expect(context.boardSquares).toEqual([
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['invalid', 'invalid', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
    ]);
  });

  it('does not throw if piece being removed is partially out of bounds', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    // Start with a board where (5,5) is 'full'
    const board = getInitialBoardSquares(0);
    if (board[5] && board[5][4] !== undefined) board[5][4] = 'full';
    act(() => {
      context.setBoardSquares(board.map(row => [...row]));
    });
    act(() => {
      expect(() => context.removePieceFromBoard(4, 5, 2, 2)).not.toThrow();
    });
    expect(context.boardSquares[4][4]).toBe('empty');
  });
});

describe('resetBoardSquares', () => {
  it('resets the board to the initial state for the current level', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    // Fill the board with 'full' squares
    act(() => {
      context.setBoardSquares(Array(6).fill(Array(6).fill('full')));
    });
    // Reset the board
    act(() => {
      context.resetBoardSquares(0);
    });
    // Use the real initial board for level 0
    expect(context.boardSquares).toEqual(getInitialBoardSquares(0));
  });

  it('resets after pieces have been added or removed', () => {
    let context: any;
    renderWithLevel(ctx => (context = ctx));
    // Add a piece
    act(() => {
      context.setBoardSquares(getInitialBoardSquares(0));
      context.addPieceToBoard(0, 0, 2, 2);
    });
    // Remove a piece
    act(() => {
      context.removePieceFromBoard(0, 0, 1, 1);
    });
    // Reset the board
    act(() => {
      context.resetBoardSquares(0);
    });
    expect(context.boardSquares).toEqual(getInitialBoardSquares(0));
  });
});
