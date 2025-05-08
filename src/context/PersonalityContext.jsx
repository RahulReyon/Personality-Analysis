// PersonalityContext.jsx
import React, { createContext, useContext, useState } from 'react';
import mbtiQuestions from '../assets/data/mbtiQuestions';
import bigFiveQuestions from '../assets/data/bigFiveQuestions';

export const PersonalityContext = createContext();

export const PersonalityProvider = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizType, setQuizType] = useState('mbti');
  const [mbtiResult, setMbtiResult] = useState(null);
  const [bigFiveResult, setBigFiveResult] = useState(null);

  const questions = quizType === 'mbti' ? mbtiQuestions : bigFiveQuestions;

  const handleAnswer = (score) => {
    setAnswers((prev) => [...prev, score]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate and store result
      if (quizType === 'mbti') {
        setMbtiResult(calcMBTIResult([...answers, score]));
      } else {
        setBigFiveResult(calcBigFiveResult([...answers, score]));
      }
    }
  };

  const calcMBTIResult = (answersArray) => {
    // Example placeholder for actual calculation
    const result = {
      I: 0,
      E: 0,
      N: 0,
      S: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    answersArray.forEach((score, index) => {
      // Example logic to calculate MBTI traits based on answers
      if (index % 8 === 0) {
      result.I += score;
      result.E += 100 - score;
      } else if (index % 8 === 1) {
      result.N += score;
      result.S += 100 - score;
      } else if (index % 8 === 2) {
      result.T += score;
      result.F += 100 - score;
      } else if (index % 8 === 3) {
      result.J += score;
      result.P += 100 - score;
      } else if (index % 8 === 4) {
      result.E += score;
      result.I += 100 - score;
      } else if (index % 8 === 5) {
      result.S += score;
      result.N += 100 - score;
      } else if (index % 8 === 6) {
      result.F += score;
      result.T += 100 - score;
      } else if (index % 8 === 7) {
      result.P += score;
      result.J += 100 - score;
      }


   
      Object.keys(result).forEach((key) => {
        result[key] = Math.round(result[key] / (answersArray.length / 8)); // Normalize scores
      });
    });
    return result;
  };


  const calcBigFiveResult = (answersArray) => {
    const traits = [
      { trait: 'Openness', value: 0 },
      { trait: 'Conscientiousness', value: 0 },
      { trait: 'Extraversion', value: 0 },
      { trait: 'Agreeableness', value: 0 },
      { trait: 'Neuroticism', value: 0 }
    ];

    answersArray.forEach((score, index) => {
      const traitIndex = index % 5; // Distribute answers across the 5 traits
      traits[traitIndex].value += score;
    });

    // Normalize the values to get an average score for each trait
    traits.forEach((trait) => {
      trait.value = Math.round(trait.value / (answersArray.length) * 80); // Assuming scores are out of 80
      trait.value = Math.max(0, Math.min(80, trait.value)); // Clamp between 0 and 80
    });

    return traits;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setMbtiResult(null);
    setBigFiveResult(null);
  };

  return (
    <PersonalityContext.Provider
      value={{
        currentQuestion,
        setCurrentQuestion, // <-- ADD THIS
        questions,
        answers,
        setAnswers, // <-- ADD THIS TOO
        quizType,
        setQuizType,
        handleAnswer,
        resetQuiz,
        mbtiResult,
        bigFiveResult
      }}
    >
      {children}
    </PersonalityContext.Provider>
  );
};

export const usePersonality = () => useContext(PersonalityContext);