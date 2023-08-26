import * as constants from "./variables.js";

export class Tetromino {
  constructor(index, boardWidth) {
    this.index = index;
    this.obj = { ...constants.blocks[index] }; // create shallow cpy
    this.obj.shape = this.obj.shape.map((row) => [...row]);
    this.x = Math.floor((boardWidth - this.obj.shape[0].length) / 2); // Initialise block coords
    this.y = -1;
    this.width = boardWidth;
  }

  position() {
    // board width in terms of individual block pieces
    const boardWidth = Math.floor(this.width / constants.BLOCK_SIZE);

    this.x = Math.floor((boardWidth - this.obj.shape[0].length) / 2); // center horizontal
    this.y = -1; // start off screen
  }
}
