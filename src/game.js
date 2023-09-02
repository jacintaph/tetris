import * as config from "./gameItems/variables.js";
import { Board } from "./gameItems/board.js";
import { Tetromino } from "./gameItems/tetrominoes.js";

export class Game {
  constructor() {
    this.newGame();
  }

  newGame() {
    this.updateGameSettings();
    this.score = 0;
    this.lines = 0;
    this.full = false;
    this.currentBlock = this.getBlock(this.width);
    this.nextBlock = this.getBlock(this.width);
  }

  newNextBlockCanvas() {
    const nextCanvas = document.getElementById("next");
    const nextCtx = nextCanvas.getContext("2d");

    // Clear the canvas
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
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
    this.gameBoard = this.getGameBoard(width, height);
    this.gameLevel = gameLevel;
    this.gameMode = gameMode;
    this.playerMode = playerMode;

    // Render initial Config settings
    document.getElementById("level").textContent = this.gameLevel;
    document.getElementById("playerMode").textContent = this.playerMode;
    document.getElementById("gameMode").textContent = this.gameMode;
  }

  getGameBoard(width, height) {
    let canvas = document.getElementById("board");
    let ctx = canvas.getContext("2d");

    ctx.canvas.width = width * config.BLOCK_SIZE;
    ctx.canvas.height = height * config.BLOCK_SIZE;

    let gameBoard = new Board(ctx, width, height);
    return gameBoard;
  }

  getBlock(width) {
    const index = Math.floor(Math.random() * 7);
    let block = new Tetromino(index, width);
    return block;
  }

  gameLevel() {
    return Math.floor(this.lines * 0.1);
  }

  currentGameState() {
    const gameBoardState = this.getGameBoard(this.width, this.height);
    // coords of top left corner
    const { x: pieceX, y: pieceY } = this.currentBlock;
    let blocks = this.currentBlock.obj.shape;

    for (let y = 0; y < this.gameBoard.grid.length; y++) {
      // board height
      gameBoardState.grid[y] = [];

      for (let x = 0; x < this.gameBoard.grid[y].length; x++) {
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
      score: this.score,
      lines: this.lines,
      gameLevel: this.gameLevel,
      nextBlock: this.nextBlock,
      complete: this.full,
    };
  }

  updateStats(linesCleared) {
    if (linesCleared > 0) {
      this.score += config.pointSystem[linesCleared];
      this.lines += linesCleared;
      this.gameLevel = Math.floor(this.lines / 10) + 1;
    }
  }

  updatePieces() {
    this.currentBlock = this.nextBlock;
    this.nextBlock = this.getBlock(this.width);
  }

  moveBlockLeft() {
    this.currentBlock.x -= 1;

    if (this.hasCollision()) {
      this.currentBlock.x += 1;
    }
  }

  moveBlockRight() {
    this.currentBlock.x += 1;

    if (this.hasCollision()) {
      this.currentBlock.x -= 1;
    }
  }

  moveBlockDown() {
    if (this.full) {
      return;
    }
    this.currentBlock.y += 1;

    if (this.hasCollision()) {
      // Check for and Clear any full rows
      this.currentBlock.y -= 1;
      this.freezeBlock();
      this.clearFullRows();
      this.updatePieces();
    }

    // Collision straight away = full board
    if (this.hasCollision()) {
      this.full = true;
      return;
    }
  }

  clearFullRows() {
    const grid = this.gameBoard.grid;
    let numRowsCleared = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        // This row is full
        grid.splice(y, 1); // Remove the full row
        grid.unshift(Array.from({ length: this.width }, () => 0));
        numRowsCleared++;
        y++; // Recheck the same row since it has shifted down
      }
    }

    if (numRowsCleared > 0) {
      this.updateStats(numRowsCleared);
    }
  }

  rotateBlock() {
    this.rotateBlocks();

    if (this.hasCollision()) {
      this.rotateBlocks(false);
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
        const temp = blocks[i][j];

        if (clockwise) {
          blocks[i][j] = blocks[y - j][i];
          blocks[y - j][i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[j][y - i];
          blocks[j][y - i] = temp;
        } else {
          blocks[i][j] = blocks[j][y - i];
          blocks[j][y - i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[y - j][i];
          blocks[y - j][i] = temp;
        }
      }
    }
  }

  hasCollision() {
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
    const { x: pieceX, y: pieceY } = this.currentBlock;
    let blocks = this.currentBlock.obj.shape;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.gameBoard.grid[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }
}
