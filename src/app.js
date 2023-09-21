// app.js
"use strict";

import { TetrisModel } from "./model/tetrisModel.js";
import { TetrisController } from "./controller/tetrisController.js";
import { TetrisView } from "./view/tetrisView.js";

class App {
  constructor() {
    // Instantiate application MVC components
    const gameModel = new TetrisModel();
    const gameView = new TetrisView();
    this.tetrisController = new TetrisController(gameModel, gameView);
  }

  run() {
    // Begin the game by opening the start menu
    this.tetrisController.openStartMenu();
  }
}

const app = new App();

app.run();
