import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCurrentPiece } from './useCurrentPiece';
import { useSelectedPiece } from '../context/SelectedPiece';
import { PiecesInPlayContext } from '../context/PiecesInPlay';
import { Piece } from '../types/piece';

// Mock the context hooks
vi.mock('../context/SelectedPiece');
vi.mock('../context/PiecesInPlay');

const mockUseSelectedPiece = useSelectedPiece as any;
const mockPiecesInPlayContext = PiecesInPlayContext as any;

describe('useCurrentPiece', () => {
  const mockPiece: Piece = {
    id: 'test-piece',
    width: 3,
    height: 2,
    location: '(0,0)',
    color: 'red',
    isRotated: false,
    isStable: true,
  };

  const mockPiecesInPlay = [
    { ...mockPiece, width: 4, height: 3 }, // Updated dimensions
    {
      id: 'other-piece',
      width: 2,
      height: 1,
      location: null,
      color: 'blue',
      isRotated: false,
      isStable: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no piece is selected', () => {
    mockUseSelectedPiece.mockReturnValue({
      selectedPiece: null,
      setSelectedPiece: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentPiece());

    expect(result.current).toBeNull();
  });

  it('should return the current piece from PiecesInPlay when a piece is selected', () => {
    mockUseSelectedPiece.mockReturnValue({
      selectedPiece: mockPiece,
      setSelectedPiece: vi.fn(),
    });

    // Mock the context to return the piecesInPlay array
    const mockContextValue = {
      piecesInPlay: mockPiecesInPlay,
      movePiece: vi.fn(),
      updateDimensions: vi.fn(),
      resetPieces: vi.fn(),
      setPiecesForNewLevel: vi.fn(),
      setPieceStability: vi.fn(),
    };

    // Mock useContext to return our mock context value
    const mockUseContext = vi.fn().mockReturnValue(mockContextValue);
    vi.spyOn(require('react'), 'useContext').mockImplementation(mockUseContext);

    const { result } = renderHook(() => useCurrentPiece());

    expect(result.current).toEqual(mockPiecesInPlay[0]); // Should return the piece with updated dimensions
    expect(result.current?.width).toBe(4); // Updated width
    expect(result.current?.height).toBe(3); // Updated height
  });

  it('should return null when selected piece is not found in PiecesInPlay', () => {
    mockUseSelectedPiece.mockReturnValue({
      selectedPiece: { ...mockPiece, id: 'non-existent' },
      setSelectedPiece: vi.fn(),
    });

    const mockContextValue = {
      piecesInPlay: mockPiecesInPlay,
      movePiece: vi.fn(),
      updateDimensions: vi.fn(),
      resetPieces: vi.fn(),
      setPiecesForNewLevel: vi.fn(),
      setPieceStability: vi.fn(),
    };

    const mockUseContext = vi.fn().mockReturnValue(mockContextValue);
    vi.spyOn(require('react'), 'useContext').mockImplementation(mockUseContext);

    const { result } = renderHook(() => useCurrentPiece());

    expect(result.current).toBeNull();
  });
});
