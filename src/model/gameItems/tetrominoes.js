import * as constants from "./variables.js";

/**
 * @class Tetromino
 * @constructs
 * @classdesc The Tetris View class is responsible for all application UI updates. It is requested by the TetrisController throughout the game to re-render pages, update page elements, and to hide / show elements. 
 * @example
 * const instance = new Tetromino(1)
 */
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
