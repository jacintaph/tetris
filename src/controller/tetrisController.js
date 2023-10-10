import { EventSubject, EventObserver } from "./observer.js";
import { Configuration } from "./configuration.js";

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

  openStartMenu() {
    // create new instance of EventSubject (Observer pattern)
    this.eventSubject = new EventSubject();
    this.setEventListeners();
    this.setGameAudio();
    this.createObservers();
  }

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

  setEventListeners() {
    // This function sets event listeners via DOM element ID's
    // The event subject sets a 'notify' method when the event trigger occurs
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

    // In your controller or wherever you want to subscribe to the event
    document.addEventListener("movesAI", () => {
      this.movesAI();
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

  // movesAI() {
  //   if (!this.game.aIMode && this.playing) {
  //     const moves = this.game.movesAI;
  //     let currentIndex = 0;

  //     const executeNextMove = () => {
  //       if (currentIndex < moves.length) {
  //         const move = moves[currentIndex];

  //         switch (move) {
  //           case "rotate": // up
  //             this.game.rotateBlock();
  //             this.updateView();
  //             break;
  //           case "left": // left
  //             this.game.moveBlockLeft();
  //             this.updateView();
  //             break;
  //           case "right": // right
  //             this.game.moveBlockRight();
  //             this.updateView();
  //             break;
  //           case "down": // down
  //             this.game.moveBlockDown();
  //             this.updateView();
  //             break;
  //         }
  //         currentIndex++;

  //         setTimeout(executeNextMove, 200);
  //       }
  //     };
  //     executeNextMove();
  //   }
  // }

  /*   NO BREAK but it works */
  // movesAI() {
  //   if (!this.game.aIMode && this.playing) {
  //     for (let i = 0; i <= this.game.movesAI.length - 1; i++) {
  //       let move = this.game.movesAI[i];
  //       console.log("Moves: ", move);
  //       switch (move) {
  //         case "rotate": // up
  //           this.game.rotateBlock();
  //           this.updateView();
  //           break;
  //         case "left": // left
  //           this.game.moveBlockLeft();
  //           this.updateView();
  //           break;
  //         case "right": // right
  //           this.game.moveBlockRight();
  //           this.updateView();
  //           break;
  //         case "down": // down
  //           this.game.moveBlockDown();
  //           this.updateView();
  //           break;
  //       }
  //       setTimeout(() => {
  //         console.log("Delayed code");
  //       }, 2000);
  //     }
  //   }
  // }

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
        console.log("Moves: ", move);

        // Execute the move asynchronously
        await this.executeMove(move);

        // Introduce a delay between moves
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

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

  stopTimer() {
    // clear the interval when timer stopped
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
    // update the game state
    this.game.moveBlockDown();

    if (this.game.fullRowEvent === true) {
      // trigger sound event if full row
      this.fullRowSound.play();
      this.game.fullRowEvent = false;
    }

    this.updateView();
  }

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
