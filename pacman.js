import { DIRECTIONS , OBJECT_TYPE } from '../setup.js';

//Pacman class contains all the logic regarding the movement of Pacman, its speed and directions
//As well as it checks for collisions with walls and ghostLairs
class Pacman {

	constructor(speed, startPos) {
		//speed and startPosition values are set by constructor parameters
		this.pos = startPos;
		this.speed = speed;
		
		//direction is NULL initially, it will be changed when KeyBoard button is pressed
		this.dir = null;
		
		//the timer is used to control the speed  
		//e.g.: speed=5 -> pacman is rendered each time the timer reaches 5
		this.timer = 0;
		
		//initially Pacman has no powerPill by default
		this.powerPill = false;
		
		//rotation allows Pacman.img to change its direction, unlike the ghosts images
		this.rotation = true;
	}

	//checks if Pacman is ready to move or not, and increment the timer
    readyToMove() {
		 // if no key is pressed - don't move, bc we shouldn't move initially
		if (!this.dir) return;

		if (this.timer === this.speed) {
		  this.timer = 0;
		  return true;
		} 
		this.timer++;
	}

	//calculates the next move of pacman
	//objectExist parameter is from gameBoard.js
    getNextMove(objectExist) {
		//dir.movement is from a nested object DIRECTIONS of Setup.js
		let nextPos = this.pos + this.dir.movement;
		
		// checks if pacman collides a WALL or a GHOSTLAIR
		if (objectExist(nextPos, OBJECT_TYPE.WALL) || objectExist(nextPos, OBJECT_TYPE.GHOSTLAIR)) {
			nextPos = this.pos;
		}
		
		//return the object itself
		return { nextPos, direction: this.dir };
	}

	//removes the pacman at the current position and create it at the new position
	makeMove() {
		const classesToRemove = [OBJECT_TYPE.PACMAN];
		const classesToAdd = [OBJECT_TYPE.PACMAN]; //grap a class again, add it to the new position
		return { classesToRemove, classesToAdd };
	}
	
	//reassigns the position of the pacman
	setNewPos(nextPos) {
		this.pos = nextPos;
	}
	
	//takes an event "e" and objectExist parameter from gameBoard.js
	handleKeyInput = (e, objectExist) => {
		let dir;

		//check which key is pressed (up, down, left, right are 37..40 )
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			dir = DIRECTIONS[e.key];
		} else {
			return;
		}
		
		//pacman continue to move if no walls ahead
		const nextMovePos = this.pos + dir.movement;
		
		//checks for wall collide
		if (objectExist(nextMovePos, OBJECT_TYPE.WALL)) {
			return;
		}
		
		this.dir = dir;
	};
}

export default Pacman;