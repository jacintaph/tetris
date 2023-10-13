/**
 * @class Board
 * @constructs
 * @param {object} ctx An object containing parameters and methods to render graphics inside a HTML Canvas element
 * @param {integer} width The board width
 * @param {integer} height The board height

 * @classdesc The Board class creates an empty board (array) for the Tetris game board, according to the height and width parameters given.
 * @example
 * const instance = new Board(ctx, 10, 12)
 */
export class Board {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.grid = this.emptyBoard();
  }

  emptyBoard() {
    const rows = this.height;
    const cols = this.width;
    let grid = [];

    // Create two-dimensional zero'd array
    for (let i = 0; i < rows; i++) {
      grid[i] = []; // create empty column for every row
      for (let j = 0; j < cols; j++) {
        grid[i][j] = 0;
      }
    }

    return grid;
  }
}
