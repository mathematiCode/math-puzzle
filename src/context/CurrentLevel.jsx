/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import levels from '../levels.json';
import { colors } from '../CONSTANTS';
export const CurrentLevelContext = createContext();

const initialLocation = null;
const numberOfLevels = levels.length;

function CurrentLevelProvider({ children }) {
  const [currentLevel, setCurrentLevel] = useState(0);

  const { width, height } = levels[currentLevel].dimensions;

  const sizeOfEachUnit = Math.round(450 / Math.max(width, height));

  let levelPosition = undefined;
  if (currentLevel === numberOfLevels - 1) {
    levelPosition = 'last';
  } else if (currentLevel === 0) {
    levelPosition = 'first';
  } else {
    levelPosition = 'middle';
  }

  const initialPieces = levels[currentLevel].pieces.map((piece, index) => ({
    ...piece,
    location: initialLocation,
    color: colors[index % colors.length],
    id: `initial-${index}`,
    isRotated: false,
  }));

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
        initialPieces,
        levelPosition,
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
