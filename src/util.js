"use strict";

import { GameLoopView } from "./programView.js";
import { Controller } from "./controller.js";
import { Game } from "./game.js";

// Instantiate New Game Loop View
// Includes rendering function
const gameLoop = new GameLoopView();
const game = new Game();
const controller = new Controller(game, gameLoop);

function play() {
  controller.play();
}

/* -------- Event Listeners -------- */
const playBtn = document.getElementById("startBtn");
const configBtn = document.getElementById("configBtn");
const scoresBtn = document.getElementById("scoresBtn");
const exitBtn = document.getElementById("exitBtn");
const configCloseBtn = document.getElementById("configCloseBtn");
const scoresCloseBtn = document.getElementById("scoresCloseBtn");

function startGame() {
  gameLoop.start();
}

function configuration() {
  gameLoop.config();
}

function exitApp() {
  const shouldExit = confirm("Are you sure you want to exit?");

  if (shouldExit) {
    document.body.innerHTML =
      '<div class="startScreen";">Thank you for playing. You can now close this window.</div>';
  }
}

function closeScreen() {
  const container = document.getElementById("container");
  const childElements = container.children;

  // Set all children other than startScreen to hidden
  for (let i = 0; i < childElements.length - 1; i++) {
    const element = childElements[i];
    if (element.id !== "startScreen") {
      gameLoop.toggleScreen(element.id, false);
    }
  }
  gameLoop.startScreen();
}

playBtn.addEventListener("click", startGame);
configBtn.addEventListener("click", configuration);
scoresBtn.addEventListener("click", displayHighScores);

exitBtn.addEventListener("click", exitApp);

configCloseBtn.addEventListener("click", closeScreen);
scoresCloseBtn.addEventListener("click", closeScreen);

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