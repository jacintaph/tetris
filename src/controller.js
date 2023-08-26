export class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.playing = false;
    this.paused = false;
    this.intervalId = null;

    document.addEventListener("keydown", this.processKeyDown.bind(this));
    // document.addEventListener("keyup", this.processKeyUp.bind(this));
  }

  processKeyDown(event) {
    const state = this.game.currentGameState();
    const dialogBox = document.getElementById("dialogBox");
    let dialogBoxVisible = true;

    if (dialogBox.classList.contains("hidden")) {
      dialogBoxVisible = false;
    }

    switch (event.keyCode) {
      case 80: // 'P' (pause)
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

  // processKeyUp(event) {
  //   switch (event.keyCode) {
  //     case 40: // DOWN ARROW
  //       // this.startTimer();
  //       break;
  //   }
  

  startTimer() {
    const speed = 1000 - this.game.currentGameState().gameLevel * 100;
    const duration = 5000;
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
      this.view.renderLostScreen(state);
      this.stopTimer();
    } else {
      this.view.renderMainScreen(state);
    }
  }

  play() {
    this.startTimer();
    this.updateView();
    this.playing = true;
    this.paused = false;
  }

  clearGame() {
    this.playing = false;
    this.paused = false;
    this.game.newGame(); // reset game and next block
    this.game.newNextBlockCanvas();
  }
}
