import { useSelectedPiece } from '../context/SelectedPiece';
import { usePiecesInPlay } from '../context/PiecesInPlay';

// Helper function to get current piece from PiecesInPlay context
export function useCurrentPiece() {
  const { selectedPiece } = useSelectedPiece();
  const { piecesInPlay } = usePiecesInPlay();

  if (!selectedPiece) {
    return null;
  }

  // Find the piece in PiecesInPlay by ID
  const currentPiece = piecesInPlay.find(
    piece => piece.id === selectedPiece.id
  );

  return currentPiece || null;
}
