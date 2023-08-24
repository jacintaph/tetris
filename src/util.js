"use strict";

import { Tetromino } from "./tetrominoes.js";
import { GameLoopView } from "./program.js";
import * as config from "./gameItems.js";
import { Board } from "./board.js";
import { Controller } from "./controller.js"
import { Game } from "./game.js"

// Instantiate New Game Loop View
// Includes rendering function
const gameLoop = new GameLoopView();

// Instantiate new Game class
const game = new Game();
const controller = new Controller(game, gameLoop);
let playBtnFg = false;

function play() {
  controller.play();
  playBtnFg = true; // track btn press to prevent multiple instances
}

/* -------- Event Listeners -------- */
const playBtn = document.getElementById("startBtn");
const configBtn = document.getElementById("configBtn");
const scoresBtn = document.getElementById("scoresBtn");
const exitBtn = document.getElementById("exitBtn");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.querySelectorAll(".closeBtn");
const gameScreen = document.getElementById("gameScreen");

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

function exitGame() {
  // const dialogBox = document.getElementById("dialogBox");
  gameLoop.toggleScreen("dialogBox", false); // works

  const container = document.getElementById("container");
  const childElements = container.children;

  // Set all children other than startScreen to hidden
  for (let i = 0; i < childElements.length - 1; i++) {
    const element = childElements[i];
    if (element.id !== "startScreen") {
      gameLoop.toggleScreen(element.id, false);
    }
  }
  controller.clearGame();
  gameLoop.startScreen();
}

// Function to display the high scores in a table
function displayHighScores(scores) {
  const highScoresTableBody = document.getElementById("scoreBody");
  highScoresTableBody.innerHTML = "";

  scores.forEach((score) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${score.rank}</td>
      <td>${score.name}</td>
      <td>${score.score}</td>
    `;
    highScoresTableBody.appendChild(row);
  });
}

// Fetch the static test high scores and display them
function highScores() {
  gameLoop.highScores();
  fetch("scores.json")
    .then((response) => response.json())
    .then((data) => {
      displayHighScores(data);
    })
    .catch((error) => console.error("Error fetching high scores:", error));
}

playBtn.addEventListener("click", startGame);
configBtn.addEventListener("click", configuration);
scoresBtn.addEventListener("click", highScores);

exitBtn.addEventListener("click", exitApp);

confirmBtn.addEventListener("click", exitGame);

// Close buttons
for (const btn of closeBtn) {
  btn.addEventListener("click", closeScreen);
}

// Cancel button Dialog Box
cancelBtn.addEventListener("click", function () {
  gameLoop.toggleScreen("dialogBox", false);
  gameLoop.toggleScreen("canvas", true);

  if (controller.playing) {
    controller.paused = false;
  }
  if (controller.paused) {
    controller.play();
  }
});

// Show Dialog Box or Pause overlay
document.addEventListener("keydown", function (event) {
  // Only allow esc key press with on the game screen
  if (!gameScreen.classList.contains("hidden")) {
    // check if it was esc key press
    if (event.key === "Escape" || event.key === "Esc") {
      gameLoop.toggleScreen("canvas", false);
      gameLoop.toggleScreen("dialogBox", true);
    }
  }
});

// Config section input validation
const quantityInputs = document.querySelectorAll(".quantity");

// Listen for input event
quantityInputs.forEach(function (input) {
  input.addEventListener("input", function () {
    const inputValue = parseFloat(this.value);
    const minValue = parseFloat(this.min);
    const maxValue = parseFloat(this.max);

    // Check if the input value is outside the allowed range
    if (inputValue < minValue) {
      this.value = this.min;
    } else if (inputValue > maxValue) {
      this.value = this.max;
    }
  });
});

// Access Config Screen Input options
const boardWidth = document.getElementById("width");
const boardHeight = document.getElementById("height");
const gameLevel = document.getElementById("gameLevel");

// Access Config Screen dropdown options
const gameMode = document.getElementById("gameModeOption");
const playerMode = document.getElementById("playerModeOption");

// Inputs Object
const inputValues = {
  widthValue: boardWidth.value,
  heightValue: boardHeight.value,
  gameLevelValue: gameLevel.value,
  gameModeValue: gameMode.value,
  playerModeValue: playerMode.value,
};

function updateInputValue(elementName, valueRef) {
  elementName.addEventListener("input", function () {
    inputValues[valueRef] = elementName.value;
    updateDisplayValues();

    updateCanvasSize();
  });
}

function updateDisplayValues() {
  document.getElementById("level").textContent = inputValues.gameLevelValue;
  document.getElementById("gameMode").textContent = inputValues.gameModeValue;
  document.getElementById("playerMode").textContent =
    inputValues.playerModeValue;
}

// Add event listener to all inputs
// Updates canvas size at the same time
updateInputValue(boardWidth, "widthValue");
updateInputValue(boardHeight, "heightValue");
updateInputValue(gameLevel, "gameLevelValue");
updateInputValue(gameMode, "gameModeValue");
updateInputValue(playerMode, "playerModeValue");

updateDisplayValues();

function updateCanvasSize() {
  // Update canvas sizing
  ctx.canvas.width = inputValues.widthValue * config.BLOCK_SIZE;
  ctx.canvas.height = inputValues.heightValue * config.BLOCK_SIZE;

  // Scale blocks
  ctx.scale(config.BLOCK_SIZE, config.BLOCK_SIZE);
}

window.play = play;
const width = inputValues.widthValue;
const height = inputValues.heightValue;

document.addEventListener("keydown", function (event) {
  if (event.key === "p" || event.key === "P") {
    const pauseOverlay = document.getElementById("pause");
    pauseOverlay.classList.toggle("active"); // Toggle the 'active' class
  }
});