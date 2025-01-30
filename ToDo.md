1/11/2025

- read in piecesInPlay and position them accordingly ✅
- add color to the arrays somehow ✅
- add DragOverlay ✅
- Make the pieces that are on the board not display in the initial spot ✅

1/12/2025

- Make the pieces on the board still moveable. ✅
- Fix DragOverlay ✅

1/13/2025

- Fix Lag of the Rectangle Component ✅
- Make the pieces follow right beneath the mouse when moving pieces already on the grid.✅

1/14/2025

- add buttons to change width and height ✅

1/15/2025

- set up contexts to make other features possible.

1/16/2025

- implement functions to select puzzle pieces and actually change their width and height ✅

1/17/2025

- Implement piece rotations 😵‍💫
- Make the pieces look 3D (rounded edges, border, shadow) ✅

1/18/2025

- make the board generate based on the coordinate points ✅

1/19 - 1/20

- Spent a lot of time researching different popover components from different component libraries trying to find one that would allow me to put buttons inside and a custom component as the trigger. Also tried to create my own component with the native popover API but I couldn't get the popover to be right below each puzzle piece. So instead I used the devtools to figure out how it was done on powerpoint, which is where I got inspiration for the popover in the first place. I found that they used their own component library called Fluent UI so I was able to use that as well.

1/21/2025

- Make or use a popover component for actions toolbar ✅
- Add popover component to the pieceOnBoardComponents ✅
- Implement action buttons and delete original action buttons ✅

1/22/2025

- Make reset game reset the pieces to their original widths and heights ✅

1/23/2025

- add another level ✅
- Implement a global variable for the sizeOfEachPiece dependent on the board size and screen size (only based on board size so far) ✅
- Reorganized some of the App.jsx file into smaller components like DragAndDropArea ✅
- Add tooltips to the action buttons ✅

1/24/2025

- Refactored by moving actionsToolbarPopover into a separate component ✅

1/27/2025

- Adjusted CSS to show full borders for any level dynamically ✅

1/28/2025

- Added unit tests to test each level and make sure its written correctly in the JSON file. ✅

In General

- Deselect puzzle pieces on clickAway with a custom hook
- Perfect snapping to the grid when moving from outside the grid
- Perfect alignment with the grid with rotated shapes
- Make rotations always go clockwise
- Make the bounds of the game board the bounds of where you can move the pieces
- Make it impossible to put pieces on top of each other
- Add animations to reset function
- Implement piece rotations
- Implement a global variable for the sizeOfEachPiece dependent on the board size and screen size
- Hold a variable that keeps track of if the shape was just rotated to determine the transition time for the animation
- Add distributive property functionality
- Set up system to allow for fractional side lengths
- Add limits to the UI to show how many actions the user can use
- Add limits to the level json and import them through context

Bugs to Fix

- When moving a piece with the spacebar and keyboard, and then pressing reset game, that piece stays on the board.

Things to Figure Out

- Why does the puzzle piece rotate/rerender so much when I drag it?
- Can I prevent the re-rotating somehow?
- How should I implement the UI for distributive property operations?
- Why do the pieces animate into place when switching from level 1 to level 2 but not any other levels?
