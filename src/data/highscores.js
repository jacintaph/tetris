export const TOTAL = 10;
export const HIGH_SCORES = "highScores";

export function getHighScores() {
  const scoresString = localStorage.getItem(HIGH_SCORES);
  // set default empty array if no recorded high scores
  const scores = JSON.parse(scoresString) ?? [];
  // console.log("scores: ", scores);
  // get lowest score or return 0 if not exists
  const lowestScore = scores[TOTAL - 1]?.score ?? 0;
  // console.log("lowest score: ", lowestScore);
  return { scores, lowestScore };
}

export function compareScores(userScore) {
  let { scores, lowestScore } = getHighScores();
  // console.log(scores);
  // console.log(lowestScore);
  if (userScore > lowestScore) {
    // Wait for the overlay to be displayed before showing the prompt
    setTimeout(() => {
      saveHighScore(userScore, scores);
    }, 0); // Use a very short delay
  }
}

export function saveHighScore(userScore, highScores) {
  const saveScoreBox = document.getElementById("highScoreInput");
  
  saveScoreBox.classList.remove("hidden");
  
  const save = document.getElementById("saveConfirmBtn");
  const cancel = document.getElementById("saveCancelBtn");
  save.addEventListener("click", function () {
    saveScoreBox.classList.add("hidden");
  });

  cancel.addEventListener("click", function () {
    saveScoreBox.classList.add("hidden");
    return;
  });


  const newScore = { userScore, name };

  // 1. Add to list
  highScores.push(newScore);

  // 2. Sort the list
  highScores.sort((a, b) => b.userScore - a.userScore);

  // 3. Select new list
  highScores.splice(TOTAL);

  // 4. Save to local storage
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  // resolve(newScore);
}
