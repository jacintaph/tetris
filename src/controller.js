// import * as config from "./gameItems/variables.js";
import { Score } from "./game.js";
import { EventSubject, EventObserver } from "./observer.js";

export class Controller {
  constructor(Game, View) {
    if (Controller._instance) {
      return Controller._instance;
    }
    Controller._instance = this;

    this.game = Game;
    this.configuration = new Configuration();
    this.view = View;
    this.playing = false;
    this.paused = false;
    this.intervalId = null;
    this.audioOn = false;
  }

  openStartMenu() {
    this.eventSubject = new EventSubject();
    this.setEventListeners();
    this.setGameAudio();
    this.createObservers();
  }

  createObservers() {
    this.eventSubject.addObserver(
      "play",
      new EventObserver(() => {
        const state = this.game.currentGameState();
        this.view.renderStats(state);
        this.view.showGameScreen();
        this.game.boardCanvas.clear();
      })
    );

    this.eventSubject.addObserver(
      "config",
      new EventObserver(() => {
        this.view.showConfig();
      })
    );

    this.eventSubject.addObserver(
      "scores",
      new EventObserver(() => {
        this.view.showScores();
      })
    );

    this.eventSubject.addObserver(
      "exitGame",
      new EventObserver(() => {
        this.view.showExitScreen();
      })
    );

    this.eventSubject.addObserver(
      "configCloseBtn",
      new EventObserver(() => {
        this.game.updateGameSettings();
        this.view.toggleScreen("config", false);
        this.view.showStartScreen();
      })
    );

    this.eventSubject.addObserver(
      "scoresCloseBtn",
      new EventObserver(() => {
        this.view.toggleScreen("highscores", false);
        this.view.showStartScreen();
      })
    );

    this.eventSubject.addObserver(
      "confirmBtn",
      new EventObserver(() => {
        this.view.toggleScreen("dialogBox", false);
        this.processScore();
      })
    );

    this.eventSubject.addObserver(
      "scoreCancelBtn",
      new EventObserver(() => {
        this.view.toggleScreen("highScoreInput", false);
        this.view.toggleScreen("gameScreen", false);
        this.clearGame();
        this.view.showStartScreen();
      })
    );

    this.eventSubject.addObserver(
      "scoreSaveBtn",
      new EventObserver(() => {
        this.view.toggleScreen("usernameRequired", false);
        let userName = this.usernameInput.value;

        if (userName === "") {
          this.view.toggleScreen("usernameRequired", true);
        } else {
          this.game.score.saveHighScoreData(userName);
          this.view.toggleScreen("highScoreInput", false);
          this.view.toggleScreen("gameScreen", false);
          this.clearGame();

          this.view.showStartScreen();
        }
      })
    );

    this.eventSubject.addObserver(
      "cancelBtn",
      new EventObserver(() => {
        this.view.toggleScreen("dialogBox", false);
        this.view.toggleScreen("canvas", true);

        if (this.playing) {
          this.paused = false;
        }
        if (this.paused) {
          this.play();
        }
      })
    );

    this.eventSubject.addObserver(
      "startGameBtn",
      new EventObserver(() => {
        this.play();
      })
    );

    this.eventSubject.addObserver(
      "keyBoardPress",
      new EventObserver((event) => {
        this.keyBoardListener(event);
      })
    );
  }

  setEventListeners() {
    this.usernameInput = document.getElementById("username");

    // Play btn on Main Menu Start Screen
    const playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", () => {
      this.eventSubject.notify("play");
    });

    const configBtn = document.getElementById("configBtn");
    configBtn.addEventListener("click", () => {
      this.eventSubject.notify("config");
    });

    const scoresBtn = document.getElementById("scoresBtn");
    scoresBtn.addEventListener("click", () => {
      this.eventSubject.notify("scores");
    });

    const exitBtn = document.getElementById("exitBtn");
    exitBtn.addEventListener("click", () => {
      this.eventSubject.notify("exitGame");
    });

    const configCloseBtn = document.getElementById("configCloseBtn");
    configCloseBtn.addEventListener("click", () => {
      this.eventSubject.notify("configCloseBtn");
    });

    const scoresCloseBtn = document.getElementById("scoresCloseBtn");
    scoresCloseBtn.addEventListener("click", () => {
      this.eventSubject.notify("scoresCloseBtn");
    });

    const confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.addEventListener("click", () => {
      this.eventSubject.notify("confirmBtn");
    });

    const cancelBtn = document.getElementById("cancelBtn");
    cancelBtn.addEventListener("click", () => {
      this.eventSubject.notify("cancelBtn");
    });

    const save = document.getElementById("saveConfirmBtn");
    save.addEventListener("click", () => {
      this.eventSubject.notify("scoreSaveBtn");
    });

    const cancel = document.getElementById("saveCancelBtn");
    cancel.addEventListener("click", () => {
      this.eventSubject.notify("scoreCancelBtn");
    });

    document.addEventListener("keydown", (event) => {
      this.eventSubject.notify("keyBoardPress", event);
    });

    // Green start button on Game Screen
    const startGameBtn = document.getElementById("startBtn");
    startGameBtn.addEventListener("click", () => {
      this.eventSubject.notify("startGameBtn");
    });
  }

  setGameAudio() {
    this.fullRowSound = document.getElementById("fullRow");
    this.gameOverSound = document.getElementById("gameOver");

    // Subscribe to the fullRowEvent
    document.addEventListener("fullRow", () => {
      if (this.audioOn) {
        this.fullRowSound.play();
      }
    });

    // Subscribe to the gameOverEvent
    document.addEventListener("gameOver", () => {
      if (this.audioOn) {
        this.gameOverSound.play();
        this.audioOn = this.view.toggleAudio(true);
      }
    });
  }

  processScore() {
    const state = this.game.currentGameState();
    // get final User Score and compare to the Leaderboard
    const isHighScore = this.game.score.isHighScore(state.score);

    if (isHighScore) {
      // user has qualified for a high score
      this.view.toggleScreen("canvas", false);
      document.getElementById("highScoreInput").classList.remove("hidden");

      if (this.game.aIMode) {
        this.usernameInput.value = "AI";
      }
    } else {
      this.clearGame();
      const state = this.game.currentGameState();
      this.view.toggleScreen("gameScreen", false);
      this.view.showStartScreen();
    }
  }

  keyBoardListener(event) {
    const dialogBox = document.getElementById("dialogBox");
    let dialogBoxVisible = true;

    if (dialogBox.classList.contains("hidden")) {
      dialogBoxVisible = false;
    }

    switch (event.keyCode) {
      case 80: // 'P' (pause)
        if (
          document.getElementById("highScoreInput").classList.contains("hidden")
        ) {
          this.audioOn = this.view.toggleAudio(true);
          this.view.togglePauseScreen();
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
          this.audioOn = this.view.toggleAudio(true);
        }
        this.view.showEscScreen();
        break;
      case 77: // 'M' toggle game audio
        if (this.playing) {
          this.audioOn = this.view.toggleAudio(this.audioOn);
        } else {
          this.audioOn = this.view.toggleAudio(true);
        }
        break;
    }

    if (!this.game.aIMode && this.playing) {
      switch (event.keyCode) {
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
          this.game.moveBlockDown();
          this.updateView();
          break;
      }
    }
  }

  startTimer() {
    const speed = 1000 - this.game.currentGameState().gameLevel * 100;
    if (!this.intervalId) {
      this.intervalId = setInterval(
        () => {
          this.updateState();
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

  play() {
    this.startTimer();
    this.updateView();
    this.playing = true;
    this.paused = false;
    // localStorage.clear();
  }

  pause() {
    this.playing = false;
    this.paused = true;
    this.stopTimer();
    this.updateView();
  }

  clearGame() {
    this.playing = false;
    this.paused = false;
    this.game.createNewGame(); // reset game and next block
    this.game.score.clearScore();
    this.game.nextBlockCanvas.clear();
  }

  updateState() {
    this.game.moveBlockDown();

    if (this.game.fullRowEvent === true) {
      this.fullRowSound.play();
      this.game.fullRowEvent = false;
    }

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
        this.processScore();
      }, 3000);
    } else {
      this.view.renderMainScreen(state);
    }
  }
}

class Configuration {
  constructor() {
    if (Configuration._instance) {
      return Configuration._instance;
    }
    Configuration._instance = this;

    this.setEventListeners();
  }

  setEventListeners() {
    const quantityInputs = document.querySelectorAll(".quantity");
    quantityInputs.forEach((input) => {
      this.inputValidation(input);
    });
  }

  inputValidation(input) {
    let inputValue = parseFloat(input.value);
    let minValue = parseFloat(input.min);
    let maxValue = parseFloat(input.max);
    let isTyping = false;

    input.addEventListener("input", function () {
      inputValue = parseFloat(this.value);
      isTyping = true;
    });

    input.addEventListener("blur", function () {
      // Prevent immediate change if user still typing
      if (isTyping) {
        isTyping = false;
        // Check if the input value is outside the allowed range
        if (inputValue < minValue) {
          this.value = this.min;
        } else if (inputValue > maxValue) {
          this.value = this.max;
        }
      }
    });
  }
}
