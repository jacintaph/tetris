// Defines the constant variables in the Tetris game
export const HIGH_SCORES = "highScores";
export const TOTAL = 10;
// Define all tetromino types
export const blocks = {
  0: {
    type: "I",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    colour: "lightBlue",
  },
  1: {
    type: "L",
    shape: [
      [0, 0, 0],
      [2, 0, 0],
      [2, 2, 2],
    ],
    colour: "blue",
  },
  2: {
    type: "J",
    shape: [
      [0, 0, 0],
      [0, 0, 3],
      [3, 3, 3],
    ],
    colour: "orange",
  },
  3: {
    type: "O",
    shape: [
      [0, 0, 0, 0],
      [0, 4, 4, 0],
      [0, 4, 4, 0],
      [0, 0, 0, 0],
    ],
    colour: "yellow",
  },
  4: {
    type: "S",
    shape: [
      [0, 0, 0],
      [0, 5, 5],
      [5, 5, 0],
    ],
    colour: "green",
  },
  5: {
    type: "T",
    shape: [
      [0, 0, 0],
      [0, 6, 0],
      [6, 6, 6],
    ],
    colour: "purple",
  },
  6: {
    type: "Z",
    shape: [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ],
    colour: "red",
  },
  7: {
    type: "ITwo",
    shape: [
      [0, 0, 0],
      [8, 8, 8],
      [0, 0, 0],
    ],
    colour: "lightBlue",
  },
  8: {
    type: "LTwo",
    shape: [
      [9, 0],
      [9, 9],
    ],
    colour: "blue",
  },
};

export const BLOCK_SIZE = 30;

export const pointSystem = {
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
};

export const blockColours = {
  1: "cyan",
  2: "blue",
  3: "orange",
  4: "yellow",
  5: "green",
  6: "purple",
  7: "red",
};
