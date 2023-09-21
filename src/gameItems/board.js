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

    // creating two-dimensional griday - fill with 0's
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = 0;
      }
    }
    return grid;
  }
  
}
