import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePersonality } from '../context/PersonalityContext';
import Question from '../components/Question';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../utils/supabaseClient';
import PageAnimationWrapper from '../components/PageAnimationWrapper';

const Quiz = () => {
  const { currentQuestion, questions, setCurrentQuestion } = usePersonality();
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  // Get quizType from URL query param
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quizType = searchParams.get('type'); // 'mbti' or 'bigfive'

  useEffect(() => {
    // If questions not loaded, redirect home after short delay
    const timer = setTimeout(() => {
      if (!questions || questions.length === 0) {
        navigate('/');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [questions, navigate]);

  // Handle answering a question
  const handleAnswer = (questionIndex, selectedOptions) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = {
      questionText: questions[questionIndex].text,
      selectedOptions: selectedOptions.map(idx => questions[questionIndex].options[idx]?.text),
    };
    setUserAnswers(updatedAnswers);

    if (currentQuestion === questions.length - 1) {
      // Slight delay to ensure state updates before save
      setTimeout(() => {
        saveAnswersToSupabase(updatedAnswers);
        navigate('/results');
      }, 100);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Go back to previous question
  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Save all answers to Supabase
  const saveAnswersToSupabase = async (answersToSave) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        alert('You must be logged in to submit feedback');
        navigate('/login');
        return;
      }

      const userId = session.user.id;

      const formattedAnswers = answersToSave.filter(Boolean).map(answer => ({
        questionText: answer.questionText,
        selectedOptions: answer.selectedOptions,
      }));

      // Set update payload based on quizType
      let updatePayload = {};
      if (quizType === 'mbti') {
        updatePayload = { mbti_responses: formattedAnswers };
      } else if (quizType === 'bigfive') {
        updatePayload = { bigfive_responses: formattedAnswers };
      } else {
        console.warn('Unknown quiz type. Nothing was saved.');
        return;
      }

      console.log("Saving for userId:", userId);
      console.log("Quiz type:", quizType);
      console.log("Payload:", updatePayload);

      // Use upsert to insert or update
      const { error } = await supabase
        .from('userinfo')
        .upsert([{ id: userId, ...updatePayload }]);

      if (error) {
        console.error('Error saving answers:', error.message, error.details);
      } else {
        console.log('Answers saved successfully');
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
    <PageAnimationWrapper>
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-center text-xl font-semibold mb-4">
        {quizType ? `Starting ${quizType.toUpperCase()} Quiz` : 'No quiz type selected'}
      </h1>
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
    </PageAnimationWrapper>
  );
};

export default Quiz;
