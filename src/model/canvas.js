import { Board } from "./gameItems/board.js";
import * as config from "./gameItems/variables.js";

/**
 * @class Canvas
 * @constructs
 * @param {integer} width The canvas width to render the game board
 * @param {integer} height The canvas height to render the game board
 * @param {string} id The HTML element id to select
 * @classdesc The Canvas class is responsible for providing canvas parameters to help create the boardCanvas and NextBlockCanvas instances.
 * @example
 * const instance = new Canvas(width, height, id)
 */
export class Canvas {
  constructor(width, height, id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height); // clear the canvas
  }
}

/**
 * @class BoardCanvas
 * @constructs
 * @param {integer} width The canvas width to render the game board
 * @param {integer} height The canvas height to render the game board
 * @classdesc The Board class extends Canvas, and sets proportionate game board dimensions and creates the game board instance
 * @example
 * const instance = new BoardCanvas(width, height)
 */
export class BoardCanvas extends Canvas {
  constructor(width, height) {
    super(width, height, "board"); // retrieve width and height from parent class

    this.setDimensions();
  }

  setDimensions() {
    // scale canvas size according to block size
    this.ctx.canvas.width = this.width * config.BLOCK_SIZE;
    this.ctx.canvas.height = this.height * config.BLOCK_SIZE;
  }

  getBoard() {
    let gameBoard = new Board(this.ctx, this.width, this.height);
    return gameBoard;
  }
}

/**
 * @class NextBlockCanvas
 * @constructs
 * @classdesc The NextBlockCanvas is responsible for the canvas to render the next Tetris Block. It extends Canvas to receive dimensions
 * @example
 * const instance = new NextBlockCanvas
 */
export class NextBlockCanvas extends Canvas {
  constructor() {
    super(0, 0, "next"); // zero out the width and height for more appropriate canvas sizing

    if (NextBlockCanvas._instance) {
      return NextBlockCanvas._instance;
    }

    NextBlockCanvas._instance = this;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
}
