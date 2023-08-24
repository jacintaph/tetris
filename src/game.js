import * as config from "./gameItems.js";
import { Board } from "./board.js";
import { Tetromino } from "./tetrominoes.js";

export class Game {
  constructor() {
    this.newGame();
  }

  newGame() {
    const { width, height, gameLevel, gameMode, playerMode } =
      this.getUserSettings();
    this.width = width;
    this.height = height;
    this.gameBoard = this.getGameBoard(width, height);
    this.score = 0;
    this.lines = 0;
    this.gameLevel = gameLevel;
    this.gameMode = gameMode;
    this.playerMode = playerMode;
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

  getGameBoard(width, height) {
    let canvas = document.getElementById("board");
    let ctx = canvas.getContext("2d");

    ctx.canvas.width = width * config.BLOCK_SIZE;
    ctx.canvas.height = height * config.BLOCK_SIZE;
    // ctx.scale(config.BLOCK_SIZE, config.BLOCK_SIZE);

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
    let blocks = this.currentBlock.shape;

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

  updateScore(linesCleared) {
    if (linesCleared > 0) {
      this.score += config.pointSystem[linesCleared] * (this.level + 1);
      this.lines += linesCleared;
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
      this.currentBlock.y -= 1;
      this.freezeBlock();
      this.updatePieces();
    }

    if (this.hasCollision()) {
      this.full = true;
    }
  }

  rotateBlock() {
    this.rotateBlocks();

    if (this.hasCollision()) {
      this.rotateBlocks(false);
    }
  }

  rotateBlocks(clockwise = true) {
    const blocks = this.currentBlock.shape;
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
    let blocks = this.currentBlock.shape;
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
    let blocks = this.currentBlock.shape;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.gameBoard.grid[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }
}
