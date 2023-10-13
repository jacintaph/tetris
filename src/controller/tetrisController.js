import { EventSubject, EventObserver } from "./observer.js";
import { Configuration } from "./configuration.js";
import { CustomError } from "./error.js";

/**
 * @class TetrisController
 * @constructs
 * @param {class} Game The Tetris Model class containing game logic
 * @param {class} View The Tetris View class containing UI logic
 * @classdesc The Tetris controller class (MVC Controller) responsible for receiving user input and communicating with the Model and View to control game logic and the user interface.
 * @example
 * const instance = new TetrisController(gameModelInstance, gameViewInstance)
 */
export class TetrisController {
  constructor(Game, View) {
    if (TetrisController._instance) {
      return TetrisController._instance;
    }
    TetrisController._instance = this;

    this.game = Game;
    this.configuration = new Configuration();
    this.view = View;
    this.playing = false;
    this.paused = false;
    this.intervalId = null;
    this.audioOn = false;
  }

  /**
   * @description Initialises event listeners and observers
   */
  startGameListeners() {
    // create new instance of EventSubject (Observer pattern)
    this.eventSubject = new EventSubject();
    this.setEventListeners();
    this.setGameAudio();
    this.createObservers();
  }

  /**
   * @description Creates observers for html button events and keyboard events
   */
  createObservers() {
    // This function creates new observers for different events
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

  /**
   *
   * @description Sets JavaScript event listeners for all game events e.g. button clicks
   */
  setEventListeners() {
    // This function sets event listeners via DOM element ID's
    // The event subject sets a 'notify' method when the event trigger occurs
    this.usernameInput = document.getElementById("username");

    // Play btn on Main Menu Start Screen
    const playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("play")) {
          throw new CustomError("Error Initialising Game.");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const configBtn = document.getElementById("configBtn");
    configBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("config")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const scoresBtn = document.getElementById("scoresBtn");
    scoresBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("scores")) {
          throw new CustomError("Error Initialising Game.");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const exitBtn = document.getElementById("exitBtn");
    exitBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("exitGame")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const configCloseBtn = document.getElementById("configCloseBtn");
    configCloseBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("configCloseBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const scoresCloseBtn = document.getElementById("scoresCloseBtn");
    scoresCloseBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("scoresCloseBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("confirmBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const cancelBtn = document.getElementById("cancelBtn");
    cancelBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("cancelBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const save = document.getElementById("saveConfirmBtn");
    save.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("scoreSaveBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    const cancel = document.getElementById("saveCancelBtn");
    cancel.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("scoreCancelBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      try {
        if (!this.eventSubject.notify("keyBoardPress", event)) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);

        const recoveryOption = confirm(
          "Do you want to reset the game settings by reloading the page?"
        );

        if (recoveryOption) {
          window.location.reload();
        }
      }
    });

    // Green start button on Game Screen
    const startGameBtn = document.getElementById("startBtn");
    startGameBtn.addEventListener("click", () => {
      try {
        if (!this.eventSubject.notify("startGameBtn")) {
          throw new CustomError("Error Initialising Game. ");
        }
      } catch (error) {
        alert(error.message);
        console.error(error.message);
      }
    });
  }

  /**
   *
   * @description Sets JavaScript event listeners for game audio events e.g. sounds to play when a full row is made, or the game is over
   */
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

    // In your controller or wherever you want to subscribe to the event
    document.addEventListener("movesAI", () => {
      this.movesAI();
    });

    console.log("Game Event Listeners Initialised...Ready to play Tetris!");
  }

  /**
   *
   * @description Checks if a final user score is a high score (in the top 10), if so, it opens a dialog box to record a username
   */
  processScore() {
    const state = this.game.currentGameState();
    // get final User Score and compare to the Leaderboard
    const isHighScore = this.game.score.isHighScore(state.score);

    if (isHighScore) {
      // user has qualified for a high score
      this.view.toggleScreen("canvas", false);
      document.getElementById("highScoreInput").classList.remove("hidden");

      // auto username = "AI" if in AI mode
      if (this.game.aIMode) {
        this.usernameInput.value = "AI";
      }
    } else {
      // not a highscoore, so continue exiting game
      this.clearGame();
      this.view.toggleScreen("gameScreen", false);
      this.view.showStartScreen();
    }
  }

  /**
   *
   * @param {event} event
   */
  keyBoardListener(event) {
    // This function contains switch statements for different key presses
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
          this.audioOn = this.view.toggleAudio(true); // also pause audio
          this.view.togglePauseScreen();
        }
        if (!dialogBoxVisible) {
          if (this.playing) {
            // also pause game movements/block movements
            this.pause();
          } else if (this.paused) {
            // if already paused, resume the game
            this.play();
          }
        }
        break;
      case 27: // 'ESC' (exit to start menu)
        if (this.playing) {
          this.pause(); // pause the game play
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
      // disable arrow key movements if in AI mode or if not playing game
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

  /**
   *
   * @description In AI mode this function loops through each move for the Tetromino and calls a function to execute the move
   */
  async movesAI() {
    if (this.game.aIMode && this.playing) {
      for (let i = 0; i <= this.game.movesAI.length - 1; i++) {
        // Collision straight away = full board
        if (this.game.blockCollision()) {
          this.game.boardFull = true; // set board is full attribute to true
          document.dispatchEvent(this.game.gameOverEvent); // trigger game over event
          return;
        }

        let move = this.game.movesAI[i];
        // Execute the move asynchronously
        await this.executeMove(move);
        // Introduce a delay between moves
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  /**
   *
   * @description In AI mode, this function is called within movesAI() and calls the Tetromino movement functions to place the Tetromino
   */
  async executeMove(move) {
    switch (move) {
      case "rotate": // up
        this.game.rotateBlock();
        this.updateView();
        // setTimeout(function () {}, 100);
        break;
      case "left": // left
        this.game.moveBlockLeft();
        this.updateView();
        // setTimeout(function () {}, 100);
        break;
      case "right": // right
        this.game.moveBlockRight();
        this.updateView();
        // setTimeout(function () {}, 100);
        break;
      case "down": // down
        this.game.moveBlockDown();
        this.updateView();
        break;
    }
    setTimeout(function () {}, 100);
  }

  /**
   *
   * @description Starts the interval timer during gameplay, which updates the state every interval and updates the game speed
   */
  startTimer() {
    // start timer 'interval clicks' for block downward movement
    // speed increases at higher levels
    const speed = 1000 - this.game.currentGameState().gameLevel * 100;
    if (!this.intervalId) {
      this.intervalId = setInterval(
        () => {
          this.updateState(); // update state with each 'interval'
        },
        speed > 0 ? speed : 100
      );
    }
  }

  /**
   *
   * @description Clears the interval when the timer is stopped
   */
  stopTimer() {
    // clear the interval when timer stopped
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   *
   * @description Starts the game timer, updates the UI and sets variables play and pause to true and false, respectively
   */
  play() {
    this.startTimer();
    this.updateView();
    this.playing = true;
    this.paused = false;
  }

  /**
   *
   * @description In AI mode, this function is called within movesAI() and calls the Tetromino movement functions to place the Tetromino
   */
  pause() {
    this.playing = false;
    this.paused = true;
    this.stopTimer();
    this.updateView();
  }

  /**
   *
   * @description In AI mode, this function is called within movesAI() and calls the Tetromino movement functions to place the Tetromino
   */
  clearGame() {
    this.playing = false;
    this.paused = false;
    this.game.createNewGame(); // reset game and next block
    this.game.score.clearScore();
    this.game.nextBlockCanvas.clear();
  }

  /**
   *
   * @description In AI mode, this function is called within movesAI() and calls the Tetromino movement functions to place the Tetromino
   */
  updateState() {
    // update the game state
    this.game.moveBlockDown();

    if (this.game.fullRowEvent === true) {
      // trigger sound event if full row
      this.fullRowSound.play();
      this.game.fullRowEvent = false;
    }

    this.updateView();
  }

  /**
   *
   * @description In AI mode, this function is called within movesAI() and calls the Tetromino movement functions to place the Tetromino
   */
  updateView() {
    const state = this.game.currentGameState(); // get current game state

    if (state.complete) {
      // if game is complete
      this.view.renderMainScreen(state);
      this.view.renderLostScreen();
      this.stopTimer();

      setTimeout(() => {
        // close lost screen after 3 seconds
        this.view.renderLostScreen();
        this.processScore();
      }, 3000);
    } else {
      this.view.renderMainScreen(state); // render game screen
    }
  }
}
