// app.js
"use strict";

import { Game } from "./game.js";
import { Controller } from "./controller.js";
import { View } from "./view.js";

class App {
  constructor() {
    // Instantiate application components
    const gameModel = new Game();
    const gameView = new View();
    this.controller = new Controller(gameModel, gameView);
  }

  run() {
    this.controller.openStartMenu();
  }
}

const app = new App();

app.run();