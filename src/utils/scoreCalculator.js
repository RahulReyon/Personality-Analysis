// scoreCalculator.js
import { supabase } from './supabaseClient'; // adjust path to your client

export function calculateBigFiveScores(answers) {
  const traits = ['O', 'C', 'E', 'A', 'N'];
  const scores = {};
  const maxScore = 80;

  traits.forEach((trait, index) => {
    let score = answers[index] || 0;
    score = Math.min(Math.max(score, 0), maxScore);
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

  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(Math.max(scores[key], 0), maxScore);
  });

  return scores;
}

// ✅ New function to save scores to Supabase
export async function saveScoresToSupabase(userId, mbtiScores, bigFiveScores) {
  const { data, error } = await supabase
    .from('mbti_quiz_responses')
    .upsert({
      user_id: userId,
      ...mbtiScores,
      ...bigFiveScores,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id' // update if the user already has a row
    });

  if (error) {
    console.error('Error saving scores to Supabase:', error);
    throw error;
  }

  return data;
}
