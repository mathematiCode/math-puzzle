# Frectangles Game in React + Typescript + Dnd-kit

This is a game that I've been planning since October and started building in January. See my [game design document.](https://docs.google.com/document/d/19n_Eb5vXucGJNiwmZuczLBsk5-oJEB7wVopWP7I0jtE/edit?usp=sharing)
Check out the deployed (although very much not done) site [here](frectangles.netlify.app)
. 

There will be many levels with the earlier/easier with whole numbers and smaller boards and the later ones including fractions, mixed numbers, and decimals. 

Target Age Range is 5th - 7th grade but it will also have some levels that are accessible to 3rd & 4th grade and would be a great activity to build number sense for older grades as well. 
<img width="979" alt="Image of Puzzle Pieces and Board. Each puzzle piece has action buttons including rotate, double width and halve height, and halve width and double height" src="https://github.com/user-attachments/assets/d77e651d-9ecb-4578-acfb-2f5a91934933" />


I am currently migrating my javascript code over to typescript. Then I will be digging into Dnd-kit to figure out how to create my own snap to grid modifier so my pieces are aligned to the grid when they are dragged from outside the grid. 
Here are some other items on my to do list for this project: 

- Deselect puzzle pieces on clickAway with a custom hook
- Perfect snapping to the grid when moving from outside the grid
- Perfect alignment with the grid with rotated shapes
- Make rotations always go clockwise
- Make the bounds of the game board the bounds of where you can move the pieces
- Make it impossible to put pieces on top of each other
- Add animations to reset function
- Make the sizeOfEachPiece variable dependent on the board size AND the screen size (right now it's just based on the board size)
- Make design responsive for mobile devices
- Hold a variable that keeps track of if the shape was just rotated to determine the transition time for the animation
- Add distributive property functionality
- Set up system to allow for fractional side lengths (will require some architechtural changes) 
- Add limits to the UI to show how many actions the user can use
- Add limits for actions to the level json and import them through context


