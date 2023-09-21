import * as config from "./gameItems/variables.js";
import { Board } from "./gameItems/board.js";
import { Tetromino } from "./gameItems/tetrominoes.js";
// import { Score } from "./score.js"  implement when moving to model folder

class Canvas {
  constructor(width, height, id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

class BoardCanvas extends Canvas {
  constructor(width, height) {
    super(width, height, "board");

    this.setDimensions();
  }

  setDimensions() {
    this.ctx.canvas.width = this.width * config.BLOCK_SIZE;
    this.ctx.canvas.height = this.height * config.BLOCK_SIZE;
  }

  getBoard() {
    let gameBoard = new Board(this.ctx, this.width, this.height);
    return gameBoard;
  }
}

class NextBlockCanvas extends Canvas {
  constructor() {
    super(0, 0, "next");

    if (NextBlockCanvas._instance) {
      return NextBlockCanvas._instance;
    }

    NextBlockCanvas._instance = this;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
}

export class Game {
  constructor() {
    if (Game._instance) {
      return Game._instance;
    }
    Game._instance = this;

    this.createNewGame();
    this.score = new Score();
    this.aI = new AI();
    this.nextBlockCanvas = new NextBlockCanvas();
    this.fullRowEvent = new Event("fullRow");
    this.gameOverEvent = new Event("gameOver");
  }

  createNewGame() {
    this.updateGameSettings();
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
    this.boardCanvas = new BoardCanvas(this.width, this.height);
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
    let index = 0;
    if (this.gameMode === "NORMAL") {
      index = Math.floor(Math.random() * 7);
    } else if (this.gameMode === "EXTENDED") {
      index = Math.floor(Math.random() * 9);
    }
    let block = new Tetromino(index, width);
    // block.setBlockPosition(width);

    return block;
  }

  currentGameState() {
    const gameBoardState = this.boardCanvas.getBoard();
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
    if (linesCleared > 0) {
      this.score.userScore += config.pointSystem[linesCleared];
      this.lines += linesCleared;
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
    let score = new Score();
    if (this.boardFull) {
      return;
    }

    this.currentBlock.y += 1;

    if (this.blockCollision()) {
      // Check for and Clear any full rows
      this.currentBlock.y -= 1;
      this.freezeBlock();
      this.clearFullRows();
      this.setNextBlock();
    }

    // Collision straight away = full board
    if (this.blockCollision()) {
      this.boardFull = true;
      document.dispatchEvent(this.gameOverEvent);
      return;
    }
  }

  clearFullRows() {
    const grid = this.gameBoard.grid;
    let numRowsCleared = 0;

    for (let y = grid.length - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell !== 0)) {
        // This row is full
        document.dispatchEvent(this.fullRowEvent);

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

    if (this.blockCollision()) {
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

// Move to controllers

// Artifical Intelligence Mode Based On A Genetic Algorithm
class AI {
  constructor() {
    this.possibleMoves = [];
  }

  calcFieldHeights() {
    // returns an array of heights of each column
  }

  calcEmptySpace() {}

  getPossibleMoves() {}

  getBestMove() {
    return {};
  }

  calcMoveScore(board) {
    // lower pieces and fewer gaps are preferred
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

// while Tetromino not in optimal position
// move tetromino L/R/rotate

export class Score {
  constructor() {
    if (Score._instance) {
      return Score._instance;
    }

    Score._instance = this;

    this.userScore = 0;
  }

  getHighScores() {
    const scoresString = localStorage.getItem(config.HIGH_SCORES);
    // set default empty array if no recorded high scores
    const scores = JSON.parse(scoresString) ?? [];
    // get lowest score or return 0 if not exists
    const topScores = scores.slice(0, 10);
    const lowestScore = scores[topScores.length - 1]?.userScore ?? 0;

    return { scores, lowestScore };
  }

  isHighScore() {
    let { scores, lowestScore } = this.getHighScores();

    if (
      this.userScore > lowestScore ||
      (scores.length < 9 && this.userScore > 0)
    ) {
      return true;
    }

    return false;
  }

  saveHighScoreData(userName) {
    let { scores } = this.getHighScores();
    const newScore = { userScore: this.userScore, userName };

    // Add to list and sort
    scores.push(newScore);
    scores.sort((a, b) => b.userScore - a.userScore);
    // Select new list and save to local storage
    scores.splice(config.TOTAL);
    localStorage.setItem(config.HIGH_SCORES, JSON.stringify(scores));
  }

  clearScore() {
    this.userScore = 0;
  }
}
