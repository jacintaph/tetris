import * as config from "../model/gameItems/variables.js";

export class TetrisView {
  constructor() {
    if (TetrisView._instance) {
      return TetrisView._instance;
    }
    TetrisView._instance = this;
  }

  // The following function toggle off the current screen +/- toggle on the screen requested
  // This will be the screen name in the function title

  showStartScreen() {
    this.toggleScreen("startScreen", true);
  }

  showGameScreen() {
    this.toggleScreen("startScreen", false);
    this.toggleScreen("gameScreen", true);
    this.toggleScreen("canvas", true);
  }

  showConfig() {
    this.toggleScreen("startScreen", false);
    this.toggleScreen("config", true);
  }

  showScores() {
    this.renderHighScoresTable();
    this.toggleScreen("startScreen", false);
    this.toggleScreen("highscores", true);
  }

  showExitScreen() {
    this.toggleScreen("startScreen", false);
    this.toggleScreen("closeScreen", true);
  }

  showEscScreen() {
    // only show esc screen if currently on the game screen
    if (!document.getElementById("gameScreen").classList.contains("hidden")) {
      this.toggleScreen("canvas", false);
      this.toggleScreen("dialogBox", true);
    }
  }

  togglePauseScreen() {
    document.getElementById("pause").classList.toggle("active");
  }

  toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    if (toggle) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }

  toggleAudio(audioOn) {
    // gamePlay is the game audio
    const gamePlay = document.getElementById("gamePlay");

    if (audioOn) {
      gamePlay.pause();
    } else {
      gamePlay.play();
    }

    // toggle the respective audio icons with the audio toggle
    this.toggleAudioIcons(audioOn);
    audioOn = !audioOn;

    return audioOn;
  }

  toggleAudioIcons(audioOn) {
    const audioOnIcon = document.getElementById("audioOff");
    const audioOffIcon = document.getElementById("audioOn");

    if (audioOn) {
      audioOnIcon.classList.remove("hidden");
      audioOffIcon.classList.add("hidden");
    } else {
      audioOnIcon.classList.add("hidden");
      audioOffIcon.classList.remove("hidden");
    }
  }

  // clear the gameBoardState canvas
  renderClearScreen({ gameBoardState }) {
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
    // Clear the nextBlock canvas
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    const blockSize = config.BLOCK_SIZE;

    // start the block in the "middle" of the nextBlock canvas
    const offsetX =
      (nextCanvas.width - blockSize * nextBlock.obj.shape[0].length) / 2;
    const offsetY =
      (nextCanvas.height - blockSize * nextBlock.obj.shape.length) / 2;

    for (let y = 0; y < nextBlock.obj.shape.length; y++) {
      for (let x = 0; x < nextBlock.obj.shape[y].length; x++) {
        if (nextBlock.obj.shape[y][x]) {
          // render each individual tile of the Tetromino
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
    // render the stats bar
    document.getElementById("score").textContent = state.score;
    document.getElementById("lines").textContent = state.lines;
    document.getElementById("level").textContent = state.gameLevel;
    document.getElementById("playerMode").textContent = state.playerMode;
    document.getElementById("gameMode").textContent = state.gameMode;
  }

  renderPlayfield({ gameBoardState }) {
    // render the main tetris board
    const canvasWidth = gameBoardState.ctx.canvas.width;
    const canvasHeight = gameBoardState.ctx.canvas.height;
    gameBoardState.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // for each cell in the game board grid
    for (let y = 0; y < gameBoardState.grid.length; y++) {
      for (let x = 0; x < gameBoardState.grid[y].length; x++) {
        // block = number which corresponds to block type
        const block = gameBoardState.grid[y][x];
        const colour = config.blockColours[block];

        // if the current cell is not = 0 = not empty
        if (block) {
          // show a Tetromino tile
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
    // this "updates" the view
    this.renderClearScreen(state);
    this.renderPlayfield(state);
    this.renderNextBlock(state);
    this.renderStats(state);
  }

  renderLostScreen() {
    // Game over screen when board is full
    const lostOverlay = document.getElementById("lost");
    lostOverlay.classList.toggle("active");
  }

  renderHighScoresTable() {
    // Get highScores data from local storage if exists, otherwise empty array
    const highScores =
      JSON.parse(localStorage.getItem(config.HIGH_SCORES)) ?? [];

    // Sort the high scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Iterate through the top 10 high scores
    for (let i = 0; i < highScores.length; i++) {
      this.renderHighScore(i, highScores);
    }
  }

  renderHighScore(index, highScores) {
    // renders an individual score from the highscore array
    const rowId = `row_${index + 1}`;
    const row = document.getElementById(rowId);
    row.innerHTML = "";
    // renders rank, name, and score
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${highScores[index].userName}</td>
        <td>${highScores[index].userScore}</td>
      `;
    const cells = row.getElementsByTagName("td");

    // Update the content of the cells
    cells[0].value = index + 1; // Rank starts from 1
    cells[1].value = highScores[index].name;
    cells[2].value = highScores[index].score;
  }
}
