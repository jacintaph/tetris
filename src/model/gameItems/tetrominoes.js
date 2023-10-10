import * as constants from "./variables.js";

export class Tetromino {
  constructor(index) {
    this.index = index;
    this.setBlockShape();
  }

  setBlockShape() {
    this.obj = { ...constants.blocks[this.index] }; // create shallow cpy
    this.obj.shape = this.obj.shape.map((row) => [...row]);
  }

  // i need this to be bottom left of shape
  setBlockPosition(width) {
    this.x = Math.floor((width - this.obj.shape[0].length) / 2); // center in the board
    this.y = this.obj.shape.length - 1;
  }

  copy() {
    // Shallow copy of obj.shape
    return this.obj.shape.map((row) => [...row]);
  }
}
