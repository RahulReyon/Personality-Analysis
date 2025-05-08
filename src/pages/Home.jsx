import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonality } from '../context/PersonalityContext';
import { supabase } from '../utils/supabaseClient';

const Home = () => {
  const navigate = useNavigate();
  const { setQuizType } = usePersonality();

  const [checkingLogin, setCheckingLogin] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState('');

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking authentication status:', error.message);
          setRedirectMessage('An error occurred while checking login status.');
          navigate('/login');
          return;
        }
        
        if (!session) {
          console.log('No active session found');
          setRedirectMessage('Please login first...');
        } else {
          console.log('User is logged in:', session.user.email);
          setCheckingLogin(false); 
        }
      } catch (err) {
        console.error('Unexpected error checking auth status:', err);
        setRedirectMessage('An error occurred. Please try again.');
        navigate('/login');
      }
    }
    
    checkAuthStatus();
  }, [navigate]);

  const startQuiz = (type) => {
    setQuizType(type);
    navigate('/quiz');
  };

  if (checkingLogin) {
    return null;
  }

  if (redirectMessage) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-lg text-red-600 font-medium">{redirectMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Personality Assignment</h1>
      <p className="mb-6 text-gray-700">This project aims to analyse the personality type of individual respondent based upon digital platforms used by him/her.</p>
      <div className="flex flex-col gap-4">
        <button onClick={() => startQuiz('mbti')} className="bg-indigo-600 text-white p-3 rounded-xl">
          Start Myers-Briggs Type Indicator [MBTI] Quiz
        </button>
        <button onClick={() => startQuiz('bigfive')} className="bg-green-600 text-white p-3 rounded-xl">
          Start Big Five Quiz
        </button>
      </div>
    </div>
  );
};

export default Home;

