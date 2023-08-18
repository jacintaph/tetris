// Defines the constant variables in the Tetris game

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
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0],
    ],
    colour: "blue",
  },
  2: {
    type: "J",
    shape: [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0],
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
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    colour: "green",
  },
  5: {
    type: "T",
    shape: [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
    colour: "purple",
  },
  6: {
    type: "Z",
    shape: [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
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
  1: 20,
  2: 50,
  3: 200,
  4: 500
}