/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

export const SelectedPieceContext = createContext();

function SelectedPieceProvider({ children }) {
  const [selectedPiece, setSelectedPiece] = useState(null);

  return (
    <SelectedPieceContext.Provider value={{ selectedPiece, setSelectedPiece }}>
      {children}
    </SelectedPieceContext.Provider>
  );
}

export default SelectedPieceProvider;
