// Defines the constant variables in the Tetris game

// Define all tetromino types
export const blocks = {
  0: {
    type: "I",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
    ],
    colour: "lightBlue",
  },
  1: {
    type: "L",
    shape: [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ],
    colour: "blue",
  },
  2: {
    type: "J",
    shape: [
      [0, 0, 0, 1],
      [0, 1, 1, 1],
    ],
    colour: "orange",
  },
  3: {
    type: "O",
    shape: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
    ],
    colour: "yellow",
  },
  4: {
    type: "S",
    shape: [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
    ],
    colour: "green",
  },
  5: {
    type: "T",
    shape: [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
    ],
    colour: "purple",
  },
  6: {
    type: "Z",
    shape: [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
    ],
    colour: "red",
  },
  7: {
    type: "ITwo",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
    ],
    colour: "lightBlue",
  },
  8: {
    type: "LTwo",
    shape: [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
    ],
    colour: "blue",
  },
};

export const BLOCK_SIZE = 30;
