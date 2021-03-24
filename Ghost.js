/* this class is for tacking ghost's position and direction and 
whether pacman eat powerpill and other fuction*/

//import directions and all kinds of ghosts
import { DIRECTIONS , OBJECT_TYPE} from '../setup.js';
//import random method from ghostmoves
import { randomMovement } from './ghostmoves.js'; 

class Ghost {
    constructor(speed = 5, startPos, movement, name) {
        /*each ghost has name, random movement, 
            starting position, and speed*/
        this.name = name;
        this.movement = movement;
        this.startPos = startPos;
        this.pos = startPos;//when pacman get ghost, we move them back to starting position
        this.dir = DIRECTIONS.ArrowRight;
        this.speed = speed;
        this.timer = 0;
        this.isScared = false; //when pacman eat the powerpill,ghosts are scared.
        this.rotation = false; //when ghosts are turning, change position.
    }

    shouldMove() {
        if (this.timer === this.speed) {
            this.timer = 0;//if it deoes, set timer to 0 and return ture
            return true;
        }
        this.timer++;
    }

    getNextMove(objectExist) {
        // Call move method to get the radom movement for next step
        const { nextMovePos, direction } = this.movement(
            this.pos,
            this.dir,
            objectExist
        );
        return { nextMovePos, direction }; //return random movement and direction 
    }
	
	makeMove() {
    const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];//use array to speciy the class we want to move
    let classesToAdd = [OBJECT_TYPE.GHOST, this.name];
	//check if the ghost is scared

    if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];
	//if ghost is scared, add classes new array from object type scared
    return { classesToRemove, classesToAdd };
  }

  setNewPos(nextMovePos, direction) {
	  //take it to next position direction
    this.pos = nextMovePos;
    this.dir = direction;
  }


}

export default Ghost;