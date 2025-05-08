import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonality } from '../context/PersonalityContext';
import { supabase } from '../utils/supabaseClient';
import { Brain, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { setQuizType } = usePersonality();
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState('');
  const [userName, setUserName] = useState('');

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
//          setTimeout(() => navigate('/login'), 2000);
        } else {
          console.log('User is logged in:', session.user.email);
          // Extract first name from email (before the @ symbol)
          const firstName = session.user.email.split('@')[0].split('.')[0];
          setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
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
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg text-indigo-800">Checking your login status...</p>
      </div>
    );
  }

  if (redirectMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-lg text-red-600 font-medium mb-4">{redirectMessage}</p>
          <p className="text-gray-600">Redirecting you to the login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personality Assessment</h1>
          <p className="text-xl text-gray-600 mb-2">Welcome{userName ? `, ${userName}` : ''}!</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover more about yourself through scientifically validated personality assessments.
            These insights can help improve your self-awareness and personal development.
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* MBTI Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-indigo-600 py-3 px-6">
              <h2 className="text-xl font-bold text-white">Myers-Briggs Type Indicator</h2>
            </div>
            <div className="p-6">
              <div className="mb-4 text-gray-700">
                <p className="mb-4">Identify your personality type among 16 different possibilities based on how you perceive the world and make decisions.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">16 Personality Types</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">~10 Minutes</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">Self-Discovery</span>
                </div>
              </div>
              <button 
                onClick={() => startQuiz('mbti')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center"
              >
                Start MBTI Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Big Five Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-green-600 py-3 px-6">
              <h2 className="text-xl font-bold text-white">Big Five Personality Test</h2>
            </div>
            <div className="p-6">
              <div className="mb-4 text-gray-700">
                <p className="mb-4">Measure the five core dimensions of your personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">5 Dimensions</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">~8 Minutes</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Scientific Basis</span>
                </div>
              </div>
              <button 
                onClick={() => startQuiz('bigfive')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center"
              >
                Start Big Five Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-8">Why Take a Personality Assessment?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Self-Awareness</h3>
              <p className="text-gray-600">Gain insights into your natural preferences, strengths, and potential blind spots.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Personal Growth</h3>
              <p className="text-gray-600">Use your assessment results to identify areas for development and growth.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Better Relationships</h3>
              <p className="text-gray-600">Understand how you interact with others and improve your communication.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>Your data is securely stored and only accessible to you.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;