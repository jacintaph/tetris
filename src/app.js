"use strict";

import { Game } from "./model.js";
import { Controller } from "./controller.js";
import { View } from "./view.js";

/* -------- Event Listeners -------- */
const playBtn = document.getElementById("startBtn");
const configBtn = document.getElementById("configBtn");
const scoresBtn = document.getElementById("scoresBtn");
const exitBtn = document.getElementById("exitBtn");
const configCloseBtn = document.getElementById("configCloseBtn");
const scoresCloseBtn = document.getElementById("scoresCloseBtn");

// Instantiate application components
const gameModel = new Game();
const gameView = new View();
const controller = new Controller(gameModel, gameView);

function play() {
  controller.play();
}

function startGame() {
  controller.clearGame();
  gameView.start();
}

function configuration() {
  gameView.config();
}

function highScores() {
  gameView.highScores();
}

function exitApp() {
  const shouldExit = confirm("Are you sure you want to exit?");

  if (shouldExit) {
    document.body.innerHTML =
      '<div class="startScreen";">Thank you for playing. You can now close this window.</div>';
  }
}

playBtn.addEventListener("click", startGame);
configBtn.addEventListener("click", configuration);
scoresBtn.addEventListener("click", highScores);

exitBtn.addEventListener("click", exitApp);

configCloseBtn.addEventListener("click", () => {
  gameView.toggleScreen("config", false);
  gameView.toggleScreen("startScreen", true);
});

scoresCloseBtn.addEventListener("click", () => {
  gameView.toggleScreen("highscores", false);
  gameView.toggleScreen("startScreen", true);
});

// Config section input validation
const quantityInputs = document.querySelectorAll(".quantity");

// Listen for input event
quantityInputs.forEach(function (input) {
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
});

window.play = play;
