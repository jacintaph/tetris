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
