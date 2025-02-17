import React, { createContext, useContext, useState } from 'react';
import { Piece } from '../types/piece';

export type SelectedPieceContextType = {
  id: any;
  height: number;
  width: number;
  selectedPiece: Piece | null;
  setSelectedPiece: (piece: Piece | null) => void;
};

export const SelectedPieceContext =
  createContext<SelectedPieceContextType | null>(null);

function SelectedPieceProvider({ children }: { children: React.ReactNode }) {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

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
