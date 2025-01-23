/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';

export const CurrentLevelContext = createContext();

const initialLocation = null;
const numberOfLevels = levels.length;

function CurrentLevelProvider({ children }) {
  const [currentLevel, setCurrentLevel] = useState(0);

  const initialPieces = levels[currentLevel].pieces;

  const { width, height } = levels[currentLevel].dimensions;

  const sizeOfEachUnit = Math.round(500 / Math.max(width, height));

  console.log('updating immutable list with initialPieces', initialPieces);
  const immutablePiecesList = levels[currentLevel].pieces.map(
    (piece, index) => ({
      ...piece,
      location: initialLocation,
      color: colors[index % colors.length],
      id: `initial-${index}`,
      isRotated: false,
    })
  );

  function nextLevel() {
    if (currentLevel === numberOfLevels - 1) {
      return;
    } else {
      setCurrentLevel(currentLevel + 1);
    }
  }

  function previousLevel() {
    if (currentLevel === 0) {
      return;
    } else {
      setCurrentLevel(currentLevel - 1);
    }
  }

  return (
    <CurrentLevelContext.Provider
      value={{
        currentLevel,
        immutablePiecesList,
        initialPieces,
        sizeOfEachUnit,
        nextLevel,
        previousLevel,
        setCurrentLevel,
      }}
    >
      {children}
    </CurrentLevelContext.Provider>
  );
}

export default CurrentLevelProvider;
