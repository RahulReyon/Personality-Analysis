import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Question = ({ question, onAnswer, onBack, showBack, isLastQuestion, isFirstQuestion }) => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedIndexes([]); // Reset selection when question changes
  }, [question]);

  const handleCheckboxChange = (idx) => {
    setSelectedIndexes((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx); // Deselect
      } else {
        return [...prev, idx]; // Select
      }
    });
  };

  const handleNextOrSubmit = () => {
    const totalScore = selectedIndexes.reduce((sum, idx) => sum + question.options[idx].score, 0);
    onAnswer(totalScore);
  };

  const handleBack = () => {
    if (showBack) onBack();
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-4">{question.text}</h2>
      <div className="flex flex-col gap-3 mb-4">
        {question.options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2 text-md font-medium">
            <input
              type="checkbox"
              checked={selectedIndexes.includes(idx)}
              onChange={() => handleCheckboxChange(idx)}
              className="w-5 h-5 text-indigo-600"
            />
            {opt.text}
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        {isFirstQuestion && (
          <button
            onClick={handleHome}
            className="px-6 py-2 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-700"
          >
            Home
          </button>
        )}
        {showBack && !isFirstQuestion && (
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-xl font-semibold text-white bg-gray-500 hover:bg-gray-700"
          >
            Back
          </button>
        )}
        
        <button
          onClick={handleNextOrSubmit}
          className={`px-6 py-2 rounded-xl font-semibold text-white ${
            isLastQuestion ? 'bg-blue-600 hover:bg-blue-800' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLastQuestion ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Question;  