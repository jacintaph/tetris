// Artifical Intelligence Mode Based On A Genetic Algorithm
import * as config from "./gameItems/variables.js";
import { TetrisModel } from "./tetrisModel.js";

// NOT YET IMPLEMENTED
export class AI {
  constructor() {}

  positionTetromino(dropData) {
    var rotation = dropData["tetromino_rotation"];

    // PERFORM ROTATIONS
    switch (rotation) {
      case 1:
        this.rotateBlock();
        break;
      case 2:
        this.rotateBlock();
        this.rotateBlock();
        break;
      case 3:
        this.rotateBlock();
        this.rotateBlock();
        this.rotateBlock();
        break;
    }
  }

  rotateBlocksAI(clockwise = true, tetromino) {
    const rows = tetromino.length;
    const cols = tetromino[0].length;

    const newBlocks = new Array(cols)
      .fill(null)
      .map(() => new Array(rows).fill(0));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (clockwise) {
          // Rotate clockwise
          newBlocks[x][rows - 1 - y] = tetromino[y][x];
        } else {
          // Rotate anti-clockwise
          newBlocks[cols - 1 - x][y] = tetromino[y][x];
        }
      }
    }

    //   // Update the shape of the current block with the new rotated shape
    //   // this.currentBlock.obj.shape = newBlocks;
    return newBlocks;
  }

  fieldheight(board) {
    // Returns the height on the field of the highest placed tetromino on the field.
    let height = 0;
    let max = 0;
    for (let col = 0; col < board[0].length; col++) {
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][col] !== 0) {
          height = board.length - i;
        }
      }
      if (height > max) {
        max = height;
      }
    }

    return max; // Return 0 if the field is empty
  }

  countGaps(board) {
    // Check each column one by one to make sure there are no gaps in the column.
    let gapCount = 0;
    let blockFg = false;
    for (let col = 0; col < board[0].length; col++) {
      blockFg = false;
      for (let row = 0; row < board.length; row++) {
        if (board[row][col] !== 0) {
          blockFg = true;
        } else if (blockFg) {
          gapCount++; // Increment gap count if there's a block after a gap
        }
      }
    }
    return gapCount;
  }

  getAllDrops(rotations, board) {
    var drops = [];
    // for each rotation
    for (let i = 0; i < 4; i++) {
      var tetromino = rotations[i];
      // for each column
      for (let col = 0; col <= board[0].length - 1; col++) {
        var f = this.copyBoard(board);
        var row = this.drop(f, tetromino, col);
        if (row != -1) {
          drops.push({
            field: f,
            rows_cleared: this.clearRowsAI(f),
            field_gaps: this.countGaps(f),
            field_height: this.fieldheight(f),
            tetromino_rotation: i,
            tetromino_column: col,
            tetromino_row: row,
          });
        }
      }
    }
    return drops;
  }

  getBestDrop(drops) {
    // Assuming 'drops' is an array of objects

    // First filter by number of rows cleared
    const maxRowsCleared = Math.max(...drops.map((drop) => drop.rows_cleared));
    const filteredByRowsCleared = drops.filter(
      (drop) => drop.rows_cleared === maxRowsCleared
    );
    // Next, find drops with the lowest field height among the filtered ones
    const lowestHeight = Math.min(
      ...filteredByRowsCleared.map((drop) => drop.field_height)
    );
    const filteredByHeight = filteredByRowsCleared.filter(
      (drop) => drop.field_height === lowestHeight
    );

    // First, find all drops with the least amount of gaps
    const lowestGaps = Math.min(
      ...filteredByHeight.map((drop) => drop.field_gaps)
    );
    const filteredByGaps = filteredByHeight.filter(
      (drop) => drop.field_gaps === lowestGaps
    );

    // Finally, find drops with the lowest tetromino row among the remaining ones
    const lowestRow = Math.max(
      ...filteredByGaps.map((drop) => drop.tetromino_row)
    );
    const lowestRowDrops = filteredByGaps.filter(
      (drop) => drop.tetromino_row === lowestRow
    );

    if (lowestRowDrops.length > 0) {
      // Return the first drop with the lowest gaps, lowest height, and lowest row
      return lowestRowDrops[0];
    } else {
      return drops[0];
    }
  }

  getAIMoves(drop) {
    var rotation = drop["tetromino_rotation"];
    var column = drop["tetromino_column"];
    var row = drop["tetromino_row"];
    var moves = [];

    for (let i = 0; i < rotation; i++) {
      moves.push("rotate");
    }

    let x = this.currentBlock.x;
    while (x != column) {
      var direction = x > column ? "left" : "right";
      x = direction === "left" ? x - 1 : x + 1;
      moves.push(direction);
    }
    moves.push("down");
    moves.push("down");
    moves.push("down");
    moves.push("down");

    return moves;
  }

  clearRowsAI(grid) {
    // const grid = this.gameBoard.grid;
    let numRowsCleared = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        // if every cell not = 0 then row is full

        grid.splice(y, 1); // Remove the full row
        grid.unshift(Array.from({ length: this.width }, () => 0)); // create new row filled with 0's to beginning of array (mimic row removal)
        numRowsCleared++;
        y++; // Recheck the same row since it has shifted down
      }
    }
    return numRowsCleared;
  }

  copyBoard(board) {
    // Deep copy of gameBoard.grid
    return board.map((row) => [...row]);
  }
}
