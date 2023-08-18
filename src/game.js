import * as config from "./gameItems.js";
import { Board } from "./board.js";
import { Tetromino } from "./tetrominoes.js";

export default class Game {
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
    this.complete = false;
    this.currentBlock = this.getBlock(this.width);
    this.nextBlock = this.getBlock(this.width);
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
    ctx.scale(config.BLOCK_SIZE, config.BLOCK_SIZE);

    let gameBoard = new Board(ctx, width, height);

    return gameBoard;
  }

  getBlock(width) {
    const index = Math.floor(Math.random() * 7);
    let block = new Tetromino(index, width);
  }

  get gameLevel() {
    return Math.floor(this.lines * 0.1);
  }

  // returns current game conditions and variables
  // keep an eye on this 
  currentGameState() {
    const gameBoardState = this.getGameBoard();

    const { x: pieceX, y: pieceY } = this.currentBlock;
    let blocks = this.currentBlock.shape;

    for (let y = 0; y < this.gameBoard.grid.length; y++) { // board height
        gameBoardState.grid[y] = [];

      for (let x = 0; x < this.gameBoard.grid[y].length; x++) {
        gameBoardState.grid[y][x] = this.gameBoard.grid[y][x];
      }
    }

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
            gameBoardState.grid[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }

    return {
      gameBoardState,
      score: this.score,
      lines: this.lines,
      gameLevel: this.gameLevel,
      nextBlock: this.nextBlock,
      complete: this.complete,
    };
  }


  // Logic for moving pieces
  
}
