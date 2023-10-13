import * as config from "./gameItems/variables.js";
import { BoardCanvas, NextBlockCanvas } from "./canvas.js";
import { Tetromino } from "./gameItems/tetrominoes.js";
import { Score } from "./score.js";
import { AI } from "./artificialIntelligence.js";
import { CustomError } from "../controller/error.js";

/**
 * @class TetrisModel
 * @constructs
 * @classdesc The Tetris model class (MVC Model) is responsible for containing all game logic. This includes (but is not limited to) Tetromino movements, and board rules. It is implemented by the Tetris Controller class.
 * @example
 * const instance = new TetrisModel()
 */
export class TetrisModel {
  constructor() {
    if (TetrisModel._instance) {
      return TetrisModel._instance;
    }
    TetrisModel._instance = this;

    this.createNewGame();
    this.score = new Score();
    this.aI = new AI();
    this.nextBlockCanvas = new NextBlockCanvas();
    this.fullRowEvent = new Event("fullRow");
    this.gameOverEvent = new Event("gameOver");
    this.movesAIEvent = new Event("movesAI");
  }

  createNewGame() {
    // create a new game, reset key attributes
    this.updateGameSettings(); // update game attributes as per config page
    // Errors would've been thrown above if not valid
    console.log("Game settings Updated.");

    this.lines = 0;
    this.boardFull = false;
    this.currentBlock = this.getBlock(this.width);
    this.nextBlock = this.getBlock(this.width);
    this.aIMode = false;
    this.moveBlockAI = false;
  }

  getUserSettings() {
    // Get the user-selected game level value from the input element / or auto default value
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const gameLevelInput = document.getElementById("gameLevel");
    const gameMode = document.getElementById("gameModeOption");
    const playerMode = document.getElementById("playerModeOption");
    this.boardHeight = heightInput.value;

    return {
      width: widthInput.value,
      height: heightInput.value,
      gameLevel: gameLevelInput.value,
      gameMode: gameMode.value,
      playerMode: playerMode.value,
    };
  }

  updateGameSettings() {
    try {
      const { width, height, gameLevel, gameMode, playerMode } =
        this.getUserSettings();
      this.width = width;
      this.height = height;
      this.boardCanvas = new BoardCanvas(this.width, this.height); // create a new game board

      if (!this.boardCanvas) {
        throw new CustomError(
          "Error updating game settings."
        );
      }

      this.gameBoard = this.boardCanvas.getBoard();

      if (!this.gameBoard) {
        throw new CustomError(
          "Error updating game settings."
        );
      }

      this.gameLevel = gameLevel;
      this.gameMode = gameMode;
      this.playerMode = playerMode;
      if (this.playerMode === "AI") {
        this.aIMode = true;
      } else {
        this.aIMode = false;
      }
    } catch (error) {
      alert(error.message);
      console.error(error.message);

      // Implement a fault recovery strategy here
      const recoveryOption = confirm("Do you want to reset the game settings by reloading the page?");

      if (recoveryOption) {
        window.location.reload();
      }
    }
  }

  getBlock(width) {
    // returns a new Tetromino (randomly selected)
    let index = 0;
    if (this.gameMode === "NORMAL") {
      index = Math.floor(Math.random() * 7);
    } else if (this.gameMode === "EXTENDED") {
      index = Math.floor(Math.random() * 9);
    }
    let block = new Tetromino(index, width);
    block.setBlockPosition(width);

    return block;
  }

  rotateOne(block) {
    return this.rotateBlocksAI(true, block);
  }

  rotateTwo(block) {
    var newBlock = this.rotateBlocksAI(true, block);
    return this.rotateBlocksAI(true, newBlock);
  }

  rotateThree(block) {
    var newBlock = this.rotateBlocksAI(true, block);
    newBlock = this.rotateBlocksAI(true, newBlock);
    return this.rotateBlocksAI(true, newBlock);
  }

  currentGameState() {
    // returns the current state of the game board (i.e., what pieces are on the board)
    let gameBoardState = this.boardCanvas.getBoard();

    const { x: pieceX, y: pieceY } = this.currentBlock; // coordinates of bottom left corner
    let blocks = this.currentBlock.obj.shape; // Tetromino shape in array form

    // Iterate over current board and copy state to gameBoardState
    for (let y = 0; y < this.gameBoard.grid.length; y++) {
      // for each board row
      gameBoardState.grid[y] = [];

      for (let x = 0; x < this.gameBoard.grid[y].length; x++) {
        // for each board column
        gameBoardState.grid[y][x] = this.gameBoard.grid[y][x];
      }
    }

    for (let y = blocks.length - 1; y >= 0; y--) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          // mapping out the block
          const targetY = pieceY - (blocks.length - 1 - y);
          const targetX = pieceX + x;
          // Check if the target position is within bounds and not occupied
          if (
            targetY >= 0 &&
            targetY < this.height &&
            targetX >= 0 &&
            targetX < this.width &&
            gameBoardState.grid[targetY][targetX] === 0
          ) {
            gameBoardState.grid[targetY][targetX] = blocks[y][x];
          }
        }
      }
    }

    return {
      gameBoardState,
      score: this.score.userScore,
      lines: this.lines,
      gameLevel: this.gameLevel,
      playerMode: this.playerMode,
      gameMode: this.gameMode,
      nextBlock: this.nextBlock,
      complete: this.boardFull,
    };
  }

  updateStats(linesCleared) {
    // Update user score if >0 rows were cleared
    if (linesCleared > 0) {
      this.score.userScore += config.pointSystem[linesCleared];
      this.lines += linesCleared;
      // Increment game level by 1 for every 10 rows cleared
      this.gameLevel = Math.floor(this.lines / 10) + 1;
    }
  }

  setNextBlock() {
    this.currentBlock = this.nextBlock;
    this.nextBlock = this.getBlock(this.width);
    if (this.aIMode) {
      var blockCpy = this.currentBlock.copy();
      var boardCopy = this.copyBoard(this.gameBoard.grid);

      var block1 = this.rotateOne(blockCpy);
      var block2 = this.rotateTwo(blockCpy);
      var block3 = this.rotateThree(blockCpy);

      var rotations = [blockCpy, block1, block2, block3];

      this.nextBlock = this.getBlock(this.width);
      var drops = this.getAllDrops(rotations, boardCopy);

      this.bestDrop = this.getBestDrop(drops);
      this.movesAI = this.getAIMoves(this.bestDrop);

      document.dispatchEvent(this.movesAIEvent);
    }
  }

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

  fieldHeight(board) {
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
            field_height: this.fieldHeight(f),
            tetromino_rotation: i,
            tetromino_column: col,
            tetromino_row: row,
          });
        }
      }
    }
    return drops;
  }

  // getBestDrop(drops) {
  //   // First filter by number of rows cleared
  //   const maxRowsCleared = Math.max(...drops.map((drop) => drop.rows_cleared));
  //   const filteredByRowsCleared = drops.filter(
  //     (drop) => drop.rows_cleared === maxRowsCleared
  //   );
  //   // Next, find drops with the lowest field height among the filtered ones
  //   const lowestHeight = Math.min(
  //     ...filteredByRowsCleared.map((drop) => drop.field_height)
  //   );
  //   const filteredByHeight = filteredByRowsCleared.filter(
  //     (drop) => drop.field_height === lowestHeight
  //   );

  //   // First, find all drops with the least amount of gaps
  //   const lowestGaps = Math.min(
  //     ...filteredByHeight.map((drop) => drop.field_gaps)
  //   );
  //   const filteredByGaps = filteredByHeight.filter(
  //     (drop) => drop.field_gaps === lowestGaps
  //   );

  //   // Finally, find drops with the lowest tetromino row among the remaining ones
  //   const lowestRow = Math.max(
  //     ...filteredByGaps.map((drop) => drop.tetromino_row)
  //   );
  //   const lowestRowDrops = filteredByGaps.filter(
  //     (drop) => drop.tetromino_row === lowestRow
  //   );

  //   if (lowestRowDrops.length > 0) {
  //     // Return the first drop with the lowest gaps, lowest height, and lowest row
  //     return lowestRowDrops[0];
  //   } else {
  //     // Handle the case where there are no matching drops
  //     return drops[0];
  //   }
  // }
  getBestDrop(drops) {
    // First filter by number of rows cleared
    const maxRowsCleared = Math.max(...drops.map((drop) => drop.rows_cleared));
    const filteredByRowsCleared = drops.filter(
      (drop) => drop.rows_cleared === maxRowsCleared
    );

    // First, find all drops with the least amount of gaps
    const lowestGaps = Math.min(
      ...filteredByRowsCleared.map((drop) => drop.field_gaps)
    );
    const filteredByGaps = filteredByRowsCleared.filter(
      (drop) => drop.field_gaps === lowestGaps
    );

    // Next, find drops with the lowest field height among the filtered ones
    const lowestHeight = Math.min(
      ...filteredByGaps.map((drop) => drop.field_height)
    );
    const filteredByHeight = filteredByGaps.filter(
      (drop) => drop.field_height === lowestHeight
    );

    // Finally, find drops with the lowest tetromino row among the remaining ones
    const lowestRow = Math.max(
      ...filteredByHeight.map((drop) => drop.tetromino_row)
    );
    const lowestRowDrops = filteredByHeight.filter(
      (drop) => drop.tetromino_row === lowestRow
    );

    if (lowestRowDrops.length > 0) {
      // Return the first drop with the lowest gaps, lowest height, and lowest row
      return lowestRowDrops[0];
    } else {
      // Handle the case where there are no matching drops
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

    if (row >= this.boardHeight / 2) {
      moves.push("down");
      moves.push("down");
      moves.push("down");
      moves.push("down");
    }

    return moves;
  }

  moveBlockLeft() {
    this.currentBlock.x -= 1;

    if (this.blockCollision()) {
      this.currentBlock.x += 1;
    }
  }

  moveBlockRight() {
    this.currentBlock.x += 1;

    if (this.blockCollision()) {
      this.currentBlock.x -= 1;
    }
  }

  moveBlockDown() {
    if (this.boardFull) {
      // stop block movement if board is full
      return;
    }
    this.currentBlock.y += 1;

    if (this.blockCollision()) {
      // Check for and clear any full rows

      this.currentBlock.y -= 1;
      this.freezeBlock();

      var numRowsCleared = this.clearFullRows(this.gameBoard.grid);
      if (numRowsCleared > 0) {
        this.updateStats(numRowsCleared); // update user score +/- game level
      }

      this.setNextBlock();
    }

    // Collision straight away = full board
    if (this.blockCollision()) {
      this.boardFull = true; // set board is full attribute to true
      document.dispatchEvent(this.gameOverEvent); // trigger game over event
      console.log("here");
      return;
    }
  }

  rotateBlock() {
    this.rotateBlocks();

    if (this.blockCollision()) {
      this.rotateBlocks(false); // "Revert" rotation if block has collision
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
          newBlocks[x][rows - 1 - y] = tetromino[y][x];
        } else {
          newBlocks[cols - 1 - x][y] = tetromino[y][x];
        }
      }
    }

    return newBlocks;
  }

  rotateBlocks(clockwise = true) {
    let block = this.currentBlock.obj;
    let blocks = block.shape;
    const rows = blocks.length;
    const cols = blocks[0].length;

    const newBlocks = new Array(cols)
      .fill(null)
      .map(() => new Array(rows).fill(0));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (clockwise) {
          // Rotate clockwise
          newBlocks[x][rows - 1 - y] = blocks[y][x];
        } else {
          // Rotate anti-clockwise
          newBlocks[cols - 1 - x][y] = blocks[y][x];
        }
      }
    }

    // Update the shape of the current block with the new rotated shape
    this.currentBlock.obj.shape = newBlocks;
  }

  clearFullRows(grid) {
    let numRowsCleared = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        document.dispatchEvent(this.fullRowEvent);

        grid.splice(y, 1); // Remove the full row
        grid.unshift(Array.from({ length: this.width }, () => 0));
        numRowsCleared++;
        y++;
      }
    }
    return numRowsCleared;
  }

  clearRowsAI(grid) {
    let numRowsCleared = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        grid.splice(y, 1); // Remove the full row
        grid.unshift(Array.from({ length: this.width }, () => 0));
        numRowsCleared++;
        y++;
      }
    }
    return numRowsCleared;
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  blockCollision() {
    const { x: pieceX, y: pieceY } = this.currentBlock;
    let blocks = this.currentBlock.obj.shape;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          (this.gameBoard.grid[pieceY + y] === undefined ||
            this.gameBoard.grid[pieceY + y][pieceX + x] === undefined ||
            this.gameBoard.grid[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  freezeBlock() {
    const { x: pieceX, y: pieceY } = this.currentBlock; // current block coordinates (top left corner)
    let blocks = this.currentBlock.obj.shape;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          // if there's a tile, it "locks" the piece in to the current grid position, by assigning the block value to the grid target value (original coord + current grid position considered)
          this.gameBoard.grid[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }

  testTetromino(tetromino, row, column) {
    var height = tetromino.length;
    var width = tetromino[0].length;
    for (let ti = height - 1; ti >= 0; ti--) {
      for (let tj = 0; tj < width; tj++) {
        if (
          tetromino[ti][tj] !== 0 &&
          this.gameBoard.grid[row][column + tj] !== 0
        ) {
          return false;
        }
      }
      row--;
    }
    return true;
  }

  placeTetromino(board, tetromino, row, column) {
    // Place a tetromino at the specified row and column.
    // The bottom left corner of the tetromino will be placed at the specified
    // row and column. This function does not perform checks and will overwrite
    // filled spaces in the field.

    var height = tetromino.length;
    var width = tetromino[0].length;
    // good above

    for (let ti = height - 1; ti >= 0; ti--) {
      for (let tj = 0; tj < width; tj++) {
        if (tetromino[ti][tj] !== 0) {
          board[row][column + tj] = tetromino[ti][tj];
        }
      }
      row--;
    }
    return board;
  }

  getTetrominoDropRow(tetromino, column) {
    var height = tetromino.length;
    let lastFit = -1;

    for (let row = height; row < this.gameBoard.grid.length; row++) {
      if (this.testTetromino(tetromino, row, column)) {
        lastFit = row;
      } else {
        return lastFit;
      }
    }
    return lastFit;
  }

  drop(board, tetromino, column) {
    var row = this.getTetrominoDropRow(tetromino, column);
    if (row != -1) {
      var board = this.placeTetromino(board, tetromino, row, column);
    }

    return row;
  }
}
