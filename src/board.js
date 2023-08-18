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
    let arr = [];

    // creating two-dimensional array - fill with 0's
    for (let i = 0; i < rows; i++) {
      arr[i] = [];
      for (let j = 0; j < cols; j++) {
        arr[i][j] = 0;
      }
    }
    return arr;
    // return Array.from({ length: rows }, () => Array(cols).fill(0));
  }
  
}
