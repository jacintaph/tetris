import * as config from "./gameItems/variables.js";
export class GameLoopView {
  constructor(game) {
    // this.fps = 60;
    // this.cnv = null;
    // this.loop = null;
    // this.game = game;
    // this.renderStats;
    // this.saveScoreBox = document.getElementById("highScoreInput");
  }

  startScreen() {
    this.toggleScreen("startScreen", true);
  }

  start() {
    this.toggleScreen("startScreen", false);
    this.toggleScreen("gameScreen", true);
    this.toggleScreen("canvas", true);
  }

  config() {
    this.toggleScreen("startScreen", false);
    this.toggleScreen("config", true);
  }

  highScores() {
    this.renderHighScores();
    this.toggleScreen("startScreen", false);
    this.toggleScreen("highscores", true);
  }

  toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    if (toggle) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }

  clearScreen({ gameBoardState }) {
    const width = gameBoardState.ctx.canvas.width;
    const height = gameBoardState.ctx.canvas.height;
    gameBoardState.ctx.clearRect(0, 0, width, height);
  }

  renderBlock(ctx, x, y, width, height, color) {
    // renders block in a given ctx (either nextBlock ctx or game field ctx)
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
  }

  renderNextBlock({ nextBlock }) {
    const nextCanvas = document.getElementById("next");
    const nextCtx = nextCanvas.getContext("2d");
    // Clear the canvas
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    const blockSize = config.BLOCK_SIZE; // Adjust this size according to your design
    const offsetX =
      (nextCanvas.width - blockSize * nextBlock.obj.shape[0].length) / 2;
    const offsetY =
      (nextCanvas.height - blockSize * nextBlock.obj.shape.length) / 2;

    for (let y = 0; y < nextBlock.obj.shape.length; y++) {
      for (let x = 0; x < nextBlock.obj.shape[y].length; x++) {
        if (nextBlock.obj.shape[y][x]) {
          this.renderBlock(
            nextCtx,
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize,
            blockSize,
            nextBlock.obj.colour
          );
        }
      }
    }
  }

  renderStats(state) {
    document.getElementById("score").textContent = state.score;
    document.getElementById("lines").textContent = state.lines;
    document.getElementById("level").textContent = state.gameLevel;
  }

  renderPlayfield({ gameBoardState }) {
    const canvasWidth = gameBoardState.ctx.canvas.width;
    const canvasHeight = gameBoardState.ctx.canvas.height;
    gameBoardState.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let y = 0; y < gameBoardState.grid.length; y++) {
      for (let x = 0; x < gameBoardState.grid[y].length; x++) {
        // block = number which corresponds to block type
        const block = gameBoardState.grid[y][x];
        const colour = config.blockColours[block];

        if (block) {
          this.renderBlock(
            gameBoardState.ctx,
            x * config.BLOCK_SIZE,
            y * config.BLOCK_SIZE,
            config.BLOCK_SIZE,
            config.BLOCK_SIZE,
            colour
          );
        }
      }
    }

    gameBoardState.ctx.strokeStyle = "black";
    gameBoardState.ctx.lineWidth = 2;
    gameBoardState.ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  }

  renderMainScreen(state) {
    this.clearScreen(state);
    this.renderPlayfield(state);
    this.renderNextBlock(state);
    this.renderStats(state);
  }

  renderLostScreen() {
    const lostOverlay = document.getElementById("lost");
    lostOverlay.classList.toggle("active");
  }

  renderHighScores() {
    // Get highScores data from local storage if exists, otherwise empty array
    const highScores =
      JSON.parse(localStorage.getItem(config.HIGH_SCORES)) ?? [];

    // Sort the high scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Iterate through the top 10 high scores or the available number of high scores
    for (let i = 0; i < highScores.length; i++) {
      const rowId = `row_${i + 1}`;
      const row = document.getElementById(rowId);
      row.innerHTML = "";
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${highScores[i].username}</td>
        <td>${highScores[i].userScore}</td>
      `;
    }

    const numToShow = Math.min(highScores.length, 10);

    for (let i = 0; i < numToShow; i++) {
      const rowId = `row_${i + 1}`;
      const row = document.getElementById(rowId);

      // Get the cells in the row
      const cells = row.getElementsByTagName("td");

      // Update the content of the cells
      cells[0].value = i + 1; // Rank starts from 1
      cells[1].value = highScores[i].name; // Assuming you have a "name" property
      cells[2].value = highScores[i].score;
    }
  }
}
