"use strict";

import { Tetromino } from "./tetrominoes.js";
import { GameLoop } from "./program.js";

const gameLoop = new GameLoop();

/* -------- Event Listeners -------- */
const playBtn = document.getElementById("startBtn");
const configBtn = document.getElementById("configBtn");
const scoresBtn = document.getElementById("scoresBtn");
const exitBtn = document.getElementById("exitBtn");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.querySelector(".overlay");

function startGame() {
  gameLoop.start();
}

function config() {
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
  const dialogBox = document.getElementById("dialogBox");
  gameLoop.toggleScreen("dialogBox", false);
  // overlay.classList.remove("hidden");

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
configBtn.addEventListener("click", config);
scoresBtn.addEventListener("click", highScores);

exitBtn.addEventListener("click", exitApp);
confirmBtn.addEventListener("click", exitGame);
closeBtn.addEventListener("click", closeScreen);

cancelBtn.addEventListener("click", function () {
  gameLoop.toggleScreen("dialogBox", false);
});

document.addEventListener("keydown", function () {
  // check if it was esc key press
  gameLoop.toggleScreen("dialogBox", true);
});

// Config section input validation
const quantityInputs = document.querySelectorAll('input[id="quantity"]');

// Listen for input event
quantityInputs.forEach(function (input) {
  input.addEventListener("input", function () {
    const inputValue = parseFloat(this.value);
    console.log(inputValue);
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
