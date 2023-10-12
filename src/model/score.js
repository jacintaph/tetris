import * as config from "./gameItems/variables.js";

export class Score {
  constructor() {
    if (Score._instance) {
      return Score._instance;
    }

    Score._instance = this;

    this.userScore = 0;
  }

  getHighScores() {
    const scoresString = localStorage.getItem(config.HIGH_SCORES); // retrieve from local storage
    // set default empty array if no recorded high scores
    const scores = JSON.parse(scoresString) ?? [];
    const topScores = scores.slice(0, 10);
    // get lowest score or return 0 if not exists
    const lowestScore = scores[topScores.length - 1]?.userScore ?? 0;

    return { scores, lowestScore };
  }

  isHighScore() {
    let { scores, lowestScore } = this.getHighScores();

    if (
      this.userScore > lowestScore ||
      (scores.length < 9 && this.userScore > 0)
    ) {
      return true; // if user's score is within the top 10, it's a highscore
    }

    return false;
  }

  saveHighScoreData(userName) {
    let { scores } = this.getHighScores();
    const newScore = { userScore: this.userScore, userName };
    // Add score to list and sort
    scores.push(newScore);
    scores.sort((a, b) => b.userScore - a.userScore);
    // Select new list and save to local storage
    scores.splice(config.TOTAL); // only save 10 scores
    localStorage.setItem(config.HIGH_SCORES, JSON.stringify(scores));
  }

  clearScore() {
    this.userScore = 0;
  }
}
