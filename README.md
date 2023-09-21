# Tetris Game

![Tetris Game Screenshot](/src/icons/mainMenu.png)

## Table of Contents

- [Introduction](#introduction)
- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [How to Play](#how-to-play)
- [Game Controls](#game-controls)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Introduction

Welcome to Tetris, a classic puzzle game built using vanilla JavaScript, CSS, and HTML. Tetris is a problem solving video game where players manipulate falling pieces (Tetrominoes made out of blocks) to create complete rows. The objective is to clear as many rows as possible and achieve the highest score.

## Features

![Tetris Game Screenshot](/src/icons/gamePlay.png)

## File List

| File Name                 | Description                                                                                                                              | Line Number |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| index.html                | The main HTML file defining the game structure, and referencing the CSS and JS files.                                                    | 216         |
| styles.css                | A CSS file responsible for styling the elements and layout of the game.                                                                  | 216         |
| app.js                    | The main JS file that initialises and manages the Tetris game. It coordinated the MVC design pattern implementation.                     | 216         |
| tetrisController.js       | This file handles user input, keyboard events, and game interactions. It serves as the "Controller".                                     | 216         |
| tetrisModel.js            | This file defines the game's data model. It includes all game business logic. It serves as the "Model".                                  | 216         |
| tetrisView.js             | This file is responsible for rendering the game's UI. It interacts with the HTML Canvas elements amongst others, to serve as the "View". | 216         |
| board.js                  | This file contains the Board class, containing key game Board attributes.                                                                | 216         |
| tetrominoes.js            | This file contains the Tetromino class, defining key Tetromino object attributes.                                                        | 216         |
| variables.js              | This file contains game constants e.g., Tetromino shapes and colours, and the scoring system.                                            | 216         |
| canvas.js                 | This file contains the Canvas class and child nextBlock and BoardCanvas classes. These are used to render the playing field.             | 216         |
| configuration.js          | This file contains the Configuration class, which holds logic to receive and validate user input in the Configuration screen.            | 216         |
| observer.js               | This file contains the Observer design pattern classes, for configuring event listening.                                                 | 216         |
| score.js                  | This file holds all logic to request and manipulate the highScore data and user score.                                                   | 216         |
| artificialIntelligence.js | This file contains game logic for the AI player mode.                                                                                    | 216         |

### Total Lines =

## Naming Conventions

- **Classes:** CapitalCamelCase. Classes have been named to describe the strongest logic shown i.e., TetrisModel for the MVC game model, 'Observer' for the implementation of the Observer design pattern, 'Tetromino' for the unique logic concerning Tetromino pieces.

- **Objects:** lowerCamelCase. Object naming follows a noun/adjective patterning, with names either describing what the object is or its state.

- **Functions:** lowerCamelCase. Functions have been named in a verb - noun pattern, where the first word is often an action description e.g., 'show', followed by a noun 'StartScreen'.

- **Variables:** lowerCamelCase. Similar to objects, all variables have been named according to their noun or state.

## Getting Started

Follow these instructions to get a copy of the Tetris game up and running on your local machine.

### Prerequisites

- Web browser: Chrome or Edge

## Demo

You can play the game online by visiting [Game Demo](https://tetriswebgame.netlify.app/).

## How to Play

- Use the left and right arrow keys to move the falling tetromino horizontally.
- Press the down arrow key to make the tetromino fall faster.
- Use the up arrow key to rotate the tetromino.
- Clear complete rows by filling them with tetrominoes. Completed rows will disappear.
- The game ends when the stack of tetrominoes reaches the top.

## Game Controls

- Left Arrow Key: Move tetromino left.
- Right Arrow Key: Move tetromino right.
- Down Arrow Key: Drop tetromino faster.
- Up Arrow Key: Rotate tetromino.
- P: Pause/unpause the game.
- R: Restart the game.

## Acknowledgments

Special thanks to the creators of the original Tetris game.

- Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=68698">Pixabay</a>

- Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6435">Pixabay</a>

- Sound Effect from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6071">Pixabay</a>
- <a target="_blank" href="https://icons8.com/icon/9414/no-audio">No Audio</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
- <a target="_blank" href="https://icons8.com/icon/9982/audio">Audio</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
