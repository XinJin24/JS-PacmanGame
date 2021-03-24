import { DIRECTIONS , OBJECT_TYPE} from '../setup.js';


export function randomMovement(position, direction, objectExist) {
	//export it to ghost class
    /*three elements are involved with 
        movement, current position, direction, and the object*/
    let dir = direction;
    let nextMovePos = position + dir.movement;
    // Create an array from the diretions objects keys
    const keys = Object.keys(DIRECTIONS); // take a ramdon key from array

    while (
        objectExist(nextMovePos, OBJECT_TYPE.WALL) || // check if wall and ghost exist
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)//check it if the next step is ghost
    ) {
        // Get a random key from that array to generate ramdon movemnet 
        const key = keys[Math.floor(Math.random() * keys.length)];//grap a random number in array
        dir = DIRECTIONS[key];
        // go to new ramdon movement.
        nextMovePos = position + dir.movement;
    }
    return { nextMovePos, direction: dir }; //return position
}