// src/pages/Results.jsx
import React, { useEffect, useState } from 'react';
import { usePersonality } from '../context/PersonalityContext';
import PersonalityType from '../components/PersonalityType';
import ResultCard from '../components/ResultCard';
import personalityData from "../assets/data/personalityData.js";
import { useNavigate } from 'react-router-dom';
import BigFiveChart from '../components/charts/BigFiveChart';
import html2pdf from 'html2pdf.js';
import { supabase } from '../utils/supabaseClient.js';

const Results = () => {
  const { answers, quizType, resetQuiz } = usePersonality();
  const navigate = useNavigate();
  const [isSaving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const score = answers.reduce((a, b) => a + b, 0);
  const personality = personalityData[quizType]?.find((p) => score >= p.min && score <= p.max);

  const saveResultsToSupabase = async () => {
    if (!personality) return;
    setSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        console.log('No active session found, redirecting to login');
        setSaveStatus({
          type: 'error',
          message: 'You must be logged in to save results'
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      const userId = session.user.id;

      const resultData = {
        quiz_type: quizType,
        type: personality.type,
        description: personality.description,
        strength: personality.strength,
        weakness: personality.weakness,
        improvement: personality.imporvement,
      };

      const { data, error } = await supabase
        .from('userinfo')
        .update({
          results: resultData,
          score: parseInt(score, 10),
        })
        .select('id')
        .eq('id', userId);

      if (error) {
        console.error('Error saving results:', error);
        setSaveStatus({
          type: 'error',
          message: 'Failed to save your results'
        });
      } else {
        console.log('Results saved successfully!');
        setSaveStatus({
          type: 'success',
          message: 'Results saved successfully!'
        });
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setSaveStatus({
        type: 'error',
        message: 'An unexpected error occurred'
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (personality) {
      saveResultsToSupabase();
    }
  }, [personality]);

  const downloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('results-content');
    
    const opt = {
      margin: 10,
      filename: `personality-results-${quizType}-${personality?.type}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
      setIsDownloading(false);
    });
  };

  // If no personality data is available
  if (!personality) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Results Found</h1>
          <p className="text-gray-600 mb-6">It seems you haven't completed a quiz yet or there was an issue with your results.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-300"
          >
            Take a Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Status message */}
        {saveStatus && (
          <div className={`mb-4 p-3 rounded-lg text-white text-center ${saveStatus.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {saveStatus.message}
          </div>
        )}
        
        {/* Results content for PDF */}
        <div id="results-content" className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden">
          <div className="flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">Your Personality Results</h1>
          </div>
          
          <div className="mb-8">
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">Assessment Type</h2>
              <div className="flex justify-center">
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-lg font-medium">
                  {quizType === 'mbti' ? 'Myers-Briggs Type Indicator (MBTI)' : 'Big Five Personality Traits'}
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <PersonalityType type={personality.type} />
            </div>
            
            <ResultCard 
              title={personality.type} 
              description={personality.description} 
              Strength={personality.Strength}
              strength={personality.strength} 
              Weakness={personality.Weakness} 
              weakness={personality.weakness}
              Imporvement={personality.Imporvement} 
              imporvement={personality.imporvement}
            />
          </div>

          {quizType === 'bigfive' && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Big Five Trait Analysis</h2>
              <div className="bg-white p-4 rounded-xl shadow-inner">
                <BigFiveChart />
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center text-gray-600">
            <p>Score: {score} points</p>
            <p className="text-sm mt-2">Results generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">What would you like to do next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-70"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download as PDF
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                resetQuiz();
                navigate('/');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Take Another Quiz
            </button>
            
            <button
              onClick={() => navigate('/feedback')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Share Feedback
            </button>
          </div>
        </div>
        
        {/* Share and Explore Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Learn More About Your Personality Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Additional Resources</h3>
              <p className="text-gray-700 mb-4">Explore more in-depth information about your personality type and how to leverage your natural strengths.</p>
              <a 
                href="#" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
              >
                Explore Resources
              </a>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-purple-800 mb-3">Share Your Results</h3>
              <p className="text-gray-700 mb-4">Share your personality type with friends and colleagues to improve understanding and communication.</p>
              <div className="flex space-x-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                  </svg>
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;