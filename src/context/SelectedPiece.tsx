import { createContext, useContext, useState, ReactNode } from 'react';
import { Piece } from '../types/piece';

export type SelectedPieceContextType = {
  selectedPiece: Piece | null;
  setSelectedPiece: (piece: Piece | null) => void;
};

export const SelectedPieceContext =
  createContext<SelectedPieceContextType | null>(null);

function SelectedPieceProvider({ children }: { children: ReactNode }) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  return (
    <SelectedPieceContext.Provider value={{ selectedPiece, setSelectedPiece }}>
      {children}
    </SelectedPieceContext.Provider>
  );
}

export const useSelectedPiece = () => {
  const context = useContext(SelectedPieceContext);
  if (!context) {
    throw new Error(
      'useSelectedPiece must be used within a SelectedPieceProvider'
    );
  }
  return context;
};

export default SelectedPieceProvider;
