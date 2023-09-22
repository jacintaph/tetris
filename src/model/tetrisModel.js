import * as config from "./gameItems/variables.js";
import { BoardCanvas, NextBlockCanvas } from "./canvas.js";
import { Tetromino } from "./gameItems/tetrominoes.js";
import { Score } from "./score.js";
import { AI } from "./artificialIntelligence.js";

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
  }

  createNewGame() {
    // create a new game, reset key attributes
    this.updateGameSettings(); // update game attributes as per config page
    this.lines = 0;
    this.boardFull = false;
    this.currentBlock = this.getBlock(this.width);
    this.nextBlock = this.getBlock(this.width);
    this.aIMode = false;
  }

  getUserSettings() {
    // Get the user-selected game level value from the input element / or auto default value
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const gameLevelInput = document.getElementById("gameLevel");
    const gameMode = document.getElementById("gameModeOption");
    const playerMode = document.getElementById("playerModeOption");

    return {
      width: widthInput.value,
      height: heightInput.value,
      gameLevel: gameLevelInput.value,
      gameMode: gameMode.value,
      playerMode: playerMode.value,
    };
  }

  updateGameSettings() {
    const { width, height, gameLevel, gameMode, playerMode } =
      this.getUserSettings();
    this.width = width;
    this.height = height;
    this.boardCanvas = new BoardCanvas(this.width, this.height); // create a new game board
    this.gameBoard = this.boardCanvas.getBoard();
    this.gameLevel = gameLevel;
    this.gameMode = gameMode;
    this.playerMode = playerMode;
    if (this.playerMode === "AI") {
      this.aIMode = true;
    } else {
      this.aIMode = false;
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

  currentGameState() {
    // returns the current state of the game board (i.e., what pieces are on the board)
    let gameBoardState = this.boardCanvas.getBoard();
    const { x: pieceX, y: pieceY } = this.currentBlock; // coordinates of top left corner
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

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          const targetY = pieceY + y;
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
      this.clearFullRows();
      this.setNextBlock();
    }

    // Collision straight away = full board
    if (this.blockCollision()) {
      this.boardFull = true; // set board is full attribute to true
      document.dispatchEvent(this.gameOverEvent); // trigger game over event
      return;
    }
  }

  rotateBlock() {
    this.rotateBlocks();

    if (this.blockCollision()) {
      this.rotateBlocks(false); // "Revert" rotation if block has collision
    }
  }

  rotateBlocks(clockwise = true) {
    let block = this.currentBlock.obj;
    let blocks = block.shape;
    const length = blocks.length;
    const x = Math.floor(length / 2);
    const y = length - 1;

    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        const tempBlock = blocks[i][j];

        // perform rotation by replacing current block value with the value after the rotation is complete
        if (clockwise) {
          // rotate clockwise 90 deg
          blocks[i][j] = blocks[y - j][i];
          blocks[y - j][i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[j][y - i];
          blocks[j][y - i] = tempBlock;
        } else {
          // rotate anti-clockwise 90 deg
          blocks[i][j] = blocks[j][y - i];
          blocks[j][y - i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[y - j][i];
          blocks[y - j][i] = tempBlock;
        }
      }
    }
  }

  clearFullRows() {
    const grid = this.gameBoard.grid;
    let numRowsCleared = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        // if every cell not = 0 then row is full
        document.dispatchEvent(this.fullRowEvent); // trigger full row event

        grid.splice(y, 1); // Remove the full row
        grid.unshift(Array.from({ length: this.width }, () => 0)); // create new row filled with 0's to beginning of array (mimic row removal)
        numRowsCleared++;
        y++; // Recheck the same row since it has shifted down
      }
    }

    if (numRowsCleared > 0) {
      this.updateStats(numRowsCleared); // update user score +/- game level
    }
  }

  blockCollision() {
    const { x: pieceX, y: pieceY } = this.currentBlock;
    let blocks = this.currentBlock.obj.shape;

    // for each tile in the Tetromino
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          (this.gameBoard.grid[pieceY + y] === undefined ||
            this.gameBoard.grid[pieceY + y][pieceX + x] === undefined ||
            this.gameBoard.grid[pieceY + y][pieceX + x])
        ) {
          return true; // the block has collided with another block or user attempts to move off the board (undefined)
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
}
