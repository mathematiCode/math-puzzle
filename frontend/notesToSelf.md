Figure out how to derive isStable from the piece dimensions and board dimensions AND update it every time the piece dimensions change. ✅

Figure out why pieces are stretching out and shrinking dramatically ✅

Move pieces that end up partially off the board when they don't need to be. ✅

When a piece is placed partially off the board and is then shifted to be fully on the board, it doesn't use the updated location when calling addPieceToBoard so not all squares are marked as filled by that piece.

Piece starts spazzing sometimes when you double the width or the height in certain situations.

An update of dimensions (double and halving) that results in an overlap should also trigger the vibration animation.

I have these contexts

      <CurrentLevelProvider>
        <GameProgressProvider> // Which levels were passed and the solutions PiecesInPlay array for each passed level
          <BoardSquaresProvider> // A 2D array showing which pieces are where on the grid. Has a checkIfLevelPassed function
            <PiecesInPlayProvider> // An array of the puzzle pieces with their dimensions and locations
              <SelectedPieceProvider>
                <ErrorBoundary>
                  <GameInterface />
                </ErrorBoundary>
              </SelectedPieceProvider>
            </PiecesInPlayProvider>
          </BoardSquaresProvider>
        </GameProgressProvider>
      </CurrentLevelProvider>

All three of these save to local storage. I want to be able to check if the user passed the level either after each move, or each time a piece gets added to boardSquares, and then update GameProgress that they passed the level and pass the solution (piecesInPlay array).
