/* first we import data that we will use in creating the game board*/
import {GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST} from '../setup.js'

/*We create a class called GameBoard that contains the initial values and the implementation of its behaviour*/

class GameBoard {
	// create a constructor
	constructor(DOMGrid){
		this.dotCount = 0; // indicates a counter for the fruits
		this.grid = [] // an array of the positions
		this.DOMGrid = DOMGrid;// will recieve the given value when creating the instance of the class
		
	}
	/* We create a function that check the status of the game and return a boolean value to indicate whether the player won or lost */
	showGameStatus(gameWin){
		const div = document.createElement('div'); //create a div
		div.classList.add('game-status');// add game-status class to that div
		if(gameWin){
			div.innerHTML = 'You Win!';
		}
		else{
			div.innerHTML = 'Game Over';
		}
		// alter the content of the div, print 'you win' if player win otherwise print game over
		this.DOMgrid.appendChild(div); //finally we attach the div created to the grid.
	}
	//create a function that rotates the pacman
	rotateDiv(pos, degree){
		this.grid[pos].style.transform = `rotate(${degree}degree)`;
	}
	//create a function that check whether an object exists
	objectExist(pos, object) {
		return this.grid[pos].classList.contains(object);
	}
	static createGameBoard(DOMGrid, level){
		const board = new this(DOMGrid);
		board.createGrid(level);
		return board;
	}	
	/*now we are going to create a method that creates the grid*/
	createGrid(level) {
    		this.dotCount = 0; //set the counter to zero each time the game starts
    		this.grid = [];// set the grid to an empty array too when the game starts 
    		this.DOMGrid.innerHTML = ''; //reset the grid also.
	//this css statement will make the grid dynamic based on the given values of the grid size and the cell size.
		this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px);`;

    		level.forEach((square) => {
      			const div = document.createElement('div'); //create a div
			div.classList.add('square', CLASS_LIST[square]);// set the class to the div according to the given class list
			div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;// set some styling particularly width and height.
			this.DOMGrid.appendChild(div);// we attach the div to the grid
			this.grid.push(div);// add the div to the array
			// Add dots
      			if (CLASS_LIST[square] === OBJECT_TYPE.DOT) this.dotCount++;
    		});
   	}	

}

export default GameBoard;
