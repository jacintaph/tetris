// Define constant variables
/**
 * @var {string}
 * @description the name of the local storage object for the top highscores
 */
export const HIGH_SCORES = "highScores";

/**
 * @var {integer}
 * @description The number of highscores to show on the highscore page
 */
export const TOTAL = 10;

/**
 * @var {array}
 * @description The different numbers of rotations that a Tetromino can achieve i.e., 1 rotation, 2 rotations etc
 */
export const rotations = [0, 1, 2, 3];

// Define all tetromino types
/**
 * @var {object}
 * @description All Tetromino types sorted by index ID, including shape, name, and colour
 */
export const blocks = {
  0: {
    type: "I",
    shape: [[1, 1, 1, 1]],
    colour: "lightBlue",
  },
  1: {
    type: "L",
    shape: [
      [2, 0, 0],
      [2, 2, 2],
    ],
    colour: "blue",
  },
  2: {
    type: "J",
    shape: [
      [0, 0, 3],
      [3, 3, 3],
    ],
    colour: "orange",
  },
  3: {
    type: "O",
    shape: [
      [4, 4],
      [4, 4],
    ],
    colour: "yellow",
  },
  4: {
    type: "S",
    shape: [
      [0, 5, 5],
      [5, 5, 0],
    ],
    colour: "green",
  },
  5: {
    type: "T",
    shape: [
      [0, 6, 0],
      [6, 6, 6],
    ],
    colour: "purple",
  },
  6: {
    type: "Z",
    shape: [
      [7, 7, 0],
      [0, 7, 7],
    ],
    colour: "red",
  },
  7: {
    type: "ITwo",
    shape: [[8, 8, 8]],
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

/**
 * @var {integer}
 * @description The block size used when rendering Tetrominos to the canvas/board.
 */
export const BLOCK_SIZE = 30;

/**
 * @var {object}
 * @description The scoring system used in the Tetris game. For each number of lines cleared 1-4, the associated score is mapped.
 */
export const pointSystem = {
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
};

/**
 * @var {object}
 * @description The individual Tetromino colours mapped to the Tetromino index.
 */
export const blockColours = {
  1: "cyan",
  2: "blue",
  3: "orange",
  4: "yellow",
  5: "green",
  6: "purple",
  7: "red",
  8: "cyan",
  9: "blue",
};
