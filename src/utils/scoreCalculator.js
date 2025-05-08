// scroeCalculator.js
export function calculateBigFiveScores(answers) {
  const traits = ['O', 'C', 'E', 'A', 'N'];
  const scores = {};
  const maxScore = 80;

  traits.forEach((trait, index) => {
    let score = answers[index] || 0;
    score = Math.min(Math.max(score, 0), maxScore); // Ensure score is between 0 and 80
    scores[trait] = score;
  });

  return scores;
}

export function calculateMbtiScores(answers) {
  const scores = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const maxScore = 80;

  answers.forEach(letter => {
    if (scores.hasOwnProperty(letter)) {
      scores[letter]++;
    }
  });

  // Scale scores to be out of 80
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(Math.max(scores[key], 0), maxScore);
  });

  return scores;
}