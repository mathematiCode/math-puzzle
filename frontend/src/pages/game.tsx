import ErrorBoundary from '../components/ErrorBoundary';
import { CurrentLevelProvider } from '../context/CurrentLevel';
import { GameProgressProvider } from '../context/GameProgress';
import { BoardSquaresProvider } from '../context/BoardSquares';
import { PiecesInPlayProvider } from '../context/PiecesInPlay';
import { SelectedPieceProvider } from '../context/SelectedPiece';
import GameInterface from '../Game/GameInterface';

function Game() {
  return (
    <ErrorBoundary>
      <CurrentLevelProvider>
        <GameProgressProvider>
          <BoardSquaresProvider>
            <PiecesInPlayProvider>
              <SelectedPieceProvider>
                <ErrorBoundary>
                  <GameInterface />
                </ErrorBoundary>
              </SelectedPieceProvider>
            </PiecesInPlayProvider>
          </BoardSquaresProvider>
        </GameProgressProvider>
      </CurrentLevelProvider>
    </ErrorBoundary>
  );
}

export default Game;
