import * as constants from "./variables.js";

export class Tetromino {
  constructor(index, boardWidth) {
    this.obj = constants.blocks[index];
    this.x = Math.floor((boardWidth - this.shape[0].length) / 2); // Initialise block coords
    this.y = -1;
    this.width = boardWidth;
  }

  get letter() {
    return this.obj.type;
  }

  get shape() {
    return this.obj.shape;
  }

  get colour() {
    return this.obj.colour;
  }

  position() {
    // board width in terms of individual block pieces
    const boardWidth = Math.floor(this.width / constants.BLOCK_SIZE);

    this.x = Math.floor((boardWidth - this.shape[0].length) / 2); // center horizontal
    this.y = -1; // start off screen
  }
}
