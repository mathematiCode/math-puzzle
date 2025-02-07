import React, { createContext, useState } from 'react';

type SelectedPieceContextType = {
  selectedPiece: string | null;
  setSelectedPiece: (piece: string | null) => void;
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

export default SelectedPieceProvider;
