// Artifical Intelligence Mode Based On A Genetic Algorithm
// NOT YET IMPLEMENTED
export class AI {
  constructor() {
    this.possibleMoves = [];
  }

  calcFieldHeights() {
    // returns an array of heights of each column
  }

  calcEmptySpace() {
    // returns amount of empty space/gaps amongst blocks from a move
  }

  getPossibleMoves() {
    // returns all possible positions the current Tetromino can be placed in
  }

  getBestMove() {
    // returns the best possible move/position for the current Tetromino
    return {};
  }

  calcMoveScore(board) {
    // for a given move, calculate the score as per field height, and space, and/or rows complete
    let score = 0;

    for (let row = 0; row < this.game.height; row++) {
      let isRowFull = true;
      let hasGap = false;

      for (let col = 0; col < this.game.width; col++) {
        if (board[row][col] === 0) {
          isRowFull = false;
        }

        if (
          board[row][col] === 1 &&
          (row === this.game.height - 1 || board[row + 1][col] === 1)
        ) {
          hasGap = true;
        }
      }

      if (isRowFull) {
        score += 1;
      }

      if (!hasGap) {
        score += 0.1;
      }
    }
    return score;
  }
}
