// app.js
"use strict";

import { TetrisModel } from "./model/tetrisModel.js";
import { TetrisController } from "./controller/tetrisController.js";
import { TetrisView } from "./view/tetrisView.js";

/**
 * @class App
 * @constructs
 * @classdesc This is the main class of the Tetris application. It is responsible for instantiating the TetrisController class, from which the game logic and UI is created. 
 * @example
 * const instance = new App()
 */
class App {
  constructor() {
    // Instantiate application MVC components
    const gameModel = new TetrisModel();
    const gameView = new TetrisView();
    this.tetrisController = new TetrisController(gameModel, gameView);
  }

  run() {
    // Begin the game by initialising game listeners 
    this.tetrisController.startGameListeners();
  }
}

const app = new App();

app.run();
