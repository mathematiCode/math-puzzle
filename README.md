# Frectangles Game in React + Typescript + Dnd-kit

This is a game that I've been planning since October and started building in January. See my [game design document.](https://docs.google.com/document/d/19n_Eb5vXucGJNiwmZuczLBsk5-oJEB7wVopWP7I0jtE/edit?usp=sharing)

Check out the deployed (although very much not done) site [here.](frectangles.netlify.app)
 

There will be many levels with the earlier/easier with whole numbers and smaller boards and the later ones possibly including fractions, mixed numbers, and decimals. 

Target Age Range is 5th - 7th grade but it will also have some levels that are accessible to 3rd & 4th grade and would be a great activity to build number sense for older grades as well. I was very inspired by Stick and Split when planning this game. This would be a great game to play after mastering Stick and Split because the concepts build on Stick and Split but my game requires some more complex mathematical thinking. 
<img width="979" alt="Image of Puzzle Pieces and Board. Each puzzle piece has action buttons including rotate, double width and halve height, and halve width and double height" src="https://github.com/user-attachments/assets/d77e651d-9ecb-4578-acfb-2f5a91934933" />

Here are some other items on my to do list for this project: 

Priority Fixes and Features

- When a piece is dragged across the board, make the transition time 0 so it doesn't appear to re-animate from it's original location after it's already been dragged away.
- Make the rotation appear to be about the origin, not re-rendering it at the top left of the original rectangle.
- Make the shift after a rotation that causes a piece to be un-aligned with the grid more graceful/animated.
- Make the original piece disappear as soon as it's being dragged in the air.
- Handle case where a rotation causes a piece to go partly off the board.
- Handle UX for a piece that is too tall or too long to fit on the board
- Detect and prevent/handle collisions between pieces.

Features to Add Later

- Add animation for collisions
- Add animations to reset function
- Deselect puzzle pieces on clickAway with a custom hook
- Add distributive property functionality
- Add a win screen/ message
- Add game instructions & rules
- Add something to hint to the user that they can click the pieces to see the possible actions.
- Add limits to the UI to show how many actions the user can use
- Add limits to the level json and import them through context

Much Later or Possibly not at all

- Set up system to allow for fractional side lengths
- Add sound effects for collisions and piece placements

Bugs to Fix

- Sometimes there is an empty border and it appears the actual piece is displaced but it's border is still there. Upon inspection of the CSS the motion.div from rectangle was mysteriously getting a transform3d style from somewhere(?) so I used !important to set transform3d to 0px in all directions as a temporary fix.
- Layout issues on mobile caused by pieces being on top or underneath the board. 


April 2025 Update
I have paused on working on this game to develop my understanding of backend tools like Node and Express, Git and Tailwind as these are common requirements for the jobs I'm applying for. I plan to pick this back up in late April and hope to be finished with it by the end of June. 
These are some of the things I've been working on during this break
- [Lesson Links Hackathon Project in React](https://github.com/JoleneKearse/lessonLinks)
- [To do list with Node, Express, React, and Tailwind](https://github.com/mathematiCode/To-Do-List)
  
