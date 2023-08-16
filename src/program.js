export class GameLoop {
  constructor() {
    this.fps = 60;
    this.ctx = null;
    this.cnv = null;
    this.loop = null;
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
}
