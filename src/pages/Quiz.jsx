// Quiz.jsx
import React, { useEffect, useState } from 'react';
import { usePersonality } from '../context/PersonalityContext';
import Question from '../components/Question';
import ProgressBar from '../components/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Quiz = () => {
  const { currentQuestion, questions, setCurrentQuestion, userId } = usePersonality();
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!questions || questions.length === 0) {
        navigate('/');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [questions, navigate]);

  // Handle answering a question
  const handleAnswer = (questionIndex, selectedOptions) => {
    setUserAnswers(prev => {
      // Create a new array with the same length as before
      const newAnswers = [...prev];
      // Update the answer for this specific question
      // console.log("questions:",questions);
      // console.log("qind: ",questionIndex[0]);
      newAnswers[questionIndex] = {
        questionText: questions[questionIndex[0]].text,
        selectedOptions: selectedOptions
      };
      return newAnswers;
    });

    // Move to the next question
    // console.log("currentque: ",currentQuestion);
    if (currentQuestion === questions.length - 1) {
      saveAnswersToSupabase();
      setTimeout(() => navigate('/results'), 80);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Go back to the previous question
  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Save all answers to Supabase
  const saveAnswersToSupabase = async () => {
    console.log("userAns: ",userAnswers);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        console.log('No active session found, redirecting to login');
        alert('You must be logged in to submit feedback');
        navigate('/login');
        return;
      }

      const userId = session.user.id;
      console.log("userAn:" ,userAnswers);
      // Format the selected options data for storage
      const formattedAnswers = userAnswers.filter(Boolean).map(answer => ({
        questionText: answer.questionText,
        selectedOptions: answer.selectedOptions
      }));

      // Save to Supabase
      const { error } = await supabase
        .from('userinfo')
        .update({
          selected_options: formattedAnswers,
        })
        .eq('id', userId)

      if (error) {
        console.error('Error saving answers:', error);
      }
    } catch (error) {
      console.error('Failed to save answers:', error);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 text-lg">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      <Question
        question={questions[currentQuestion]}
        questionIndex={currentQuestion}
        onAnswer={handleAnswer}
        savedSelections={userAnswers[currentQuestion]?.selectedOptions || []}
        onBack={goBack}
        showBack={currentQuestion > 0}
        isLastQuestion={currentQuestion === questions.length - 1}
        isFirstQuestion={currentQuestion === 0}
      />
    </div>
  );
};

export default Quiz;