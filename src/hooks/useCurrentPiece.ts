import { useContext } from 'react';
import { useSelectedPiece } from '../context/SelectedPiece';
import { PiecesInPlayContext } from '../context/PiecesInPlay';

// Helper function to get current piece from PiecesInPlay context
export function useCurrentPiece() {
  const { selectedPiece } = useSelectedPiece();
  const piecesInPlayContext = useContext(PiecesInPlayContext);

  if (!piecesInPlayContext) {
    throw new Error(
      'PiecesInPlayContext must be used within a PiecesInPlayProvider'
    );
  }

  if (!selectedPiece) {
    return null;
  }

  // Find the piece in PiecesInPlay by ID
  const currentPiece = piecesInPlayContext.piecesInPlay.find(
    piece => piece.id === selectedPiece.id
  );

  return currentPiece || null;
}
