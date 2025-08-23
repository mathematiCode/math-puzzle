General Tests

- All pieces and the game board should appear on level load or on page load
- The pieces and the board should be the correct ones (like level 1 if starting at the beginning)
- Clicking Next Level should change the pieces and the game board to the correct level
- CLick Previous Level should change the pieces and the game board to the correct level
- Clicking "How to Play" should open the instructions modal
- Clicking the X or outside of the modal should close the instructions modal
- Dragging a piece makes it disappear from it's original location, and appear to be under the users mouse for the entire drag event

Piece Manipulations for initialPuzzlePiece's

- Clicking a piece should trigger the actions toolbar to appear
- Clicking a piece, and clicking the rotate button should rotate that piece
- Clicking a piece and clicking the "Double width and halve height" button should do that when possible
- Clicking a piece and clicking the "Double height and halve width" button should do that when possible
- Dragging a piece from the InitialPiecesContainer onto the board should result in it staying in it's new location on the board
- Dragging a piece from the InitialPiecesContainer should just drop it right back where it came from
- Dragging a piece to a spot that's partially off the board should shift it to a valid spot on the board.
- Dragging a piece to be on partially overlapping another piece, should result in the piece going back to it's original container.

Piece Manipulations for PieceOnBoard's

- Clicking a piece should trigger the actions toolbar to appear
- Clicking a piece, and clicking the rotate button should rotate that piece
- Clicking a piece and clicking the "Double width and halve height" button should do that when possible
- Clicking a piece and clicking the "Double height and halve width" button should do that when possible
- Dragging a piece already on the board to another location on the board should update it's location to it's new spot
- Dragging a piece on the board to somewhere off the board should remove it from the board and into the initialPiecesContainer
- Dragging a piece to a spot that's partially off the board should shift it to a valid spot on the board.
- Dragging a piece to be on partially overlapping another piece, should result in the piece going back to it's previous spot.

Tests for Future Features and Fixes

- Collisions are handled appropriately
- Winning game state is evaluated correctly
- Losing game state is evaluated correctly
- Splitting one piece into two maintains the rest of the pieces and their ability to be manipulated
  - Specifically test splitting one piece into two and then using the tools on one of the other pieces with a higher index to ensure that none of the actions are tied to it's previous index (which would change when we split one piece into two)
- Combining two pieces into one maintains the rest of the pieces and their ability to be manipulated
- Unit squares should maintain their width and height throughout all transitions and animations
