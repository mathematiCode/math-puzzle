/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';

export const CurrentLevelContext = createContext();

const initialLocation = null;

function CurrentLevelProvider({ children }) {
  const [currentLevel, setCurrentLevel] = useState(0);

  const initialPieces = levels[currentLevel].pieces;

  const { width, height } = levels[currentLevel].dimensions;

  const sizeOfEachUnit = Math.round(500 / Math.max(width, height));

  const immutablePiecesList = initialPieces.map((piece, index) => ({
    ...piece,
    location: initialLocation,
    color: colors[index % colors.length],
    id: `initial-${index}`,
    isRotated: false,
  }));

  return (
    <CurrentLevelContext.Provider
      value={{
        currentLevel,
        immutablePiecesList,
        initialPieces,
        sizeOfEachUnit,
        setCurrentLevel,
      }}
    >
      {children}
    </CurrentLevelContext.Provider>
  );
}

export default CurrentLevelProvider;
