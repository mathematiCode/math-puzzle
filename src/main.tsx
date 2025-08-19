import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { PiecesInPlayProvider } from './context/PiecesInPlay';
import { CurrentLevelProvider } from './context/CurrentLevel';
import { BoardSquaresProvider } from './context/BoardSquares';
import { LevelProgressProvider } from './context/LevelProgress';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <CurrentLevelProvider>
        <LevelProgressProvider>
          <BoardSquaresProvider>
            <PiecesInPlayProvider>
              <App />
            </PiecesInPlayProvider>
          </BoardSquaresProvider>
        </LevelProgressProvider>
      </CurrentLevelProvider>
    </ErrorBoundary>
  </StrictMode>
);
