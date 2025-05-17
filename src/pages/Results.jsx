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
import PageAnimationWrapper from '../components/PageAnimationWrapper';
import { Link } from 'react-router-dom';

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
        improvement: personality.improvement,
      };

      const updateData = {
        score: parseInt(score, 10),
      };

      if (quizType === 'mbti') {
        updateData.mbti_results = resultData;
      } else if (quizType === 'bigfive') {
        updateData.bigfive_results = resultData;
      }

      const { error } = await supabase
        .from('userinfo')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        setSaveStatus({
          type: 'error',
          message: 'Failed to save your results'
        });
      } else {
        setSaveStatus({
          type: 'success',
          message: 'Results saved successfully!'
        });
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
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

  if (!personality) {
    return (
      <PageAnimationWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p>No results found. Please complete a quiz first.</p>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        </div>
      </PageAnimationWrapper>
    );
  }

  return (
    <PageAnimationWrapper>
      <div className="min-h-screen p-6 bg-gray-100">
        {saveStatus && (
          <div className={`p-4 mb-4 rounded ${saveStatus.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>{saveStatus.message}</div>
        )}

        <div id="results-content" className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Your Personality Type: {personality.type}</h1>

          <PersonalityType type={personality.type} />

          <ResultCard 
            title={personality.type} 
            description={personality.description} 
            Strength={personality.Strength}
            strength={personality.strength} 
            Weakness={personality.Weakness} 
            weakness={personality.weakness}
            Imporvement={personality.Imporvement} 
            imporvement={personality.improvement}
          />

          {quizType === 'bigfive' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Big Five Trait Breakdown</h2>
              <BigFiveChart />
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <p>Score: {score}</p>
            <p className="mt-1">Results generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button
              onClick={() => {
                resetQuiz();
                navigate('/');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Take Another Quiz
            </button>
                      <button>
                     <Link
                        to="/dashboard"
                        className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 transition duration-300"
                     >
                           View Your Full Dashboard
                      </Link>
                    </button>
                    </div>
          </div>
      </div>

    </PageAnimationWrapper>
    
  );
};

export default Results;
