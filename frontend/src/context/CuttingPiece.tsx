import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Tracks which piece (if any) is currently in "cut mode" — i.e. the player has
 * clicked the Cut tool and is placing a cut line on that piece. At most one
 * piece is being cut at a time, identified by its id (null = not cutting).
 */
export type CuttingPieceContextType = {
  cuttingPieceId: string | null;
  setCuttingPieceId: (pieceId: string | null) => void;
};

export const CuttingPieceContext =
  createContext<CuttingPieceContextType | null>(null);

export function CuttingPieceProvider({ children }: { children: ReactNode }) {
  const [cuttingPieceId, setCuttingPieceId] = useState<string | null>(null);

  return (
    <CuttingPieceContext.Provider value={{ cuttingPieceId, setCuttingPieceId }}>
      {children}
    </CuttingPieceContext.Provider>
  );
}

export const useCuttingPiece = () => {
  const context = useContext(CuttingPieceContext);
  if (!context) {
    throw new Error(
      'useCuttingPiece must be used within a CuttingPieceProvider'
    );
  }
  return context;
};
