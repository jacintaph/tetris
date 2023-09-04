import * as config from "./gameItems/variables.js";
export class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.playing = false;
    this.paused = false;
    this.intervalId = null;

    this.setEventListeners();
  }

  setEventListeners() {
    this.gameScreen = document.getElementById("gameScreen");
    this.confirmBtn = document.getElementById("confirmBtn");
    this.cancelBtn = document.getElementById("cancelBtn");
    this.pauseOverlay = document.getElementById("pause");
    this.save = document.getElementById("saveConfirmBtn");
    this.cancel = document.getElementById("saveCancelBtn");
    this.usernameInput = document.getElementById("username");
    this.saveScoreBox = document.getElementById("highScoreInput");
    this.userScore;
    this.highScores;

    document.addEventListener("keydown", this.processKeyDown.bind(this));

    this.configCloseBtn = document.getElementById("configCloseBtn");
    this.configCloseBtn.addEventListener("click", () => {
      this.game.updateGameSettings();
    });

    this.confirmBtn.addEventListener("click", () => {
      this.exitGame();
    });

    this.cancelBtn.addEventListener("click", () => {
      this.view.toggleScreen("dialogBox", false);
      this.view.toggleScreen("canvas", true);

      if (this.playing) {
        this.paused = false;
      }
      if (this.paused) {
        this.play();
      }
    });

    this.save.addEventListener("click", () => {
      this.view.toggleScreen("usernameRequired", false);

      const username = this.usernameInput.value;
      if (username === "") {
        this.view.toggleScreen("usernameRequired", true);
      } else {
        this.saveHighScore(username, this.userScore, this.highScores);
        this.view.toggleScreen("highScoreInput", false);
        this.view.toggleScreen("gameScreen", false);
        this.clearGame();
        this.view.startScreen();
      }
    });

    this.cancel.addEventListener("click", () => {
      this.view.toggleScreen("highScoreInput", false);
      this.view.toggleScreen("gameScreen", false);
      this.clearGame();
      this.view.startScreen();
    });
  }

  escKeyFunction() {
    if (!this.gameScreen.classList.contains("hidden")) {
      this.view.toggleScreen("canvas", false);
      this.view.toggleScreen("dialogBox", true);
    }
  }

  exitGame() {
    this.view.toggleScreen("dialogBox", false);
    this.saveHighScoreStats();
  }

  saveHighScoreStats() {
    const state = this.game.currentGameState();
    // get Final User Score and compare to the Leaderboard
    const result = this.compareScores(state.score);
    // Show Save High Score Dialog box if high score
    if (result != null) {
      this.view.toggleScreen("canvas", false);
      this.userScore = result.userScore;
      this.highScores = result.scores;
      this.saveScoreBox.classList.remove("hidden");
    } else {
      this.clearGame();
      this.view.toggleScreen("gameScreen", false);
      this.view.startScreen();
    }
  }

  processKeyDown(event) {
    const dialogBox = document.getElementById("dialogBox");
    let dialogBoxVisible = true;

    if (dialogBox.classList.contains("hidden")) {
      dialogBoxVisible = false;
    }

    switch (event.keyCode) {
      case 80: // 'P' (pause)
        if (this.saveScoreBox.classList.contains("hidden")) {
          this.pauseOverlay.classList.toggle("active");
        }
        if (!dialogBoxVisible) {
          if (this.playing) {
            this.pause();
          } else if (this.paused) {
            this.play();
          }
        }
        break;
      case 27: // 'ESC' (exit to start menu)
        if (this.playing) {
          this.pause();
        }
        this.escKeyFunction();
        break;
      case 37: // left
        this.game.moveBlockLeft();
        this.updateView();
        break;
      case 38: // up
        this.game.rotateBlock();
        this.updateView();
        break;
      case 39: // right
        this.game.moveBlockRight();
        this.updateView();
        break;
      case 40: // down
        // this.stopTimer();
        this.game.moveBlockDown();
        this.updateView();
        break;
    }
  }

  startTimer() {
    const speed = 1000 - this.game.currentGameState().gameLevel * 100;
    if (!this.intervalId) {
      this.intervalId = setInterval(
        () => {
          this.update();
        },
        speed > 0 ? speed : 100
      );
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause() {
    this.playing = false;
    this.paused = true;
    this.stopTimer();
    this.updateView();
  }

  update() {
    this.game.moveBlockDown();
    this.updateView();
  }

  updateView() {
    const state = this.game.currentGameState();
    if (state.complete) {
      this.view.renderMainScreen(state);
      this.view.renderLostScreen();
      this.stopTimer();

      setTimeout(() => {
        this.view.renderLostScreen();
        this.saveHighScoreStats();
      }, 1500);
    } else {
      this.view.renderMainScreen(state);
    }
  }

  play() {
    this.startTimer();
    this.getHighScores();
    this.updateView();
    this.playing = true;
    this.paused = false;
    // localStorage.clear();
  }

  clearGame() {
    this.playing = false;
    this.paused = false;
    this.game.newGame(); // reset game and next block
    this.game.newNextBlockCanvas();
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

  compareScores(userScore) {
    let { scores, lowestScore } = this.getHighScores();

    if (userScore > lowestScore) {
      return { userScore, scores };
    } else {
      return null;
    }
  }

  saveHighScore(username, userScore, highScores) {
    const newScore = { userScore, username };
    // Add to list and sort
    highScores.push(newScore);
    highScores.sort((a, b) => b.userScore - a.userScore);
    // Select new list and save to local storage
    highScores.splice(config.TOTAL);
    localStorage.setItem(config.HIGH_SCORES, JSON.stringify(highScores));
  }
}
