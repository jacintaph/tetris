import * as constants from "./gameItems.js";

export class Tetromino {
  constructor(index) {
    this.block = constants.blocks[index];
  }

  get letter() {
    return this.block.type;
  }

  get shape() {
    return this.block.shape;
  }

  get colour() {
    return this.block.colour;
  }
}
