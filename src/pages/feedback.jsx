import React, { useState } from 'react';
import './feedback.css';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim() || rating <= 0) {
      alert('Please provide both feedback and a rating!');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        console.log('No active session found, redirecting to login');
        alert('You must be logged in to submit feedback');
        navigate('/login');
        return;
      }

      const userId = session.user.id;
      console.log('Updating feedback for user ID:', userId);

      const { data: userData, error: userError } = await supabase
        .from('userinfo')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('User not found in database:', userError?.message || 'User record not found');
        alert('Your user account data could not be found. Please contact support.');
        return;
      }

      const { data, error } = await supabase
        .from('userinfo')
        .update({
          feedback: feedback,
          rating: parseInt(rating, 10) 
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error saving feedback:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        alert('Failed to save feedback. Please try again.');
        return;
      }

      console.log('Feedback update response:', data);

      if (!data || data.length === 0) {
        console.log('Update may have succeeded but returned empty array. Verifying...');

        const { data: checkData, error: checkError } = await supabase
          .from('userinfo')
          .select('feedback, rating')
          .eq('id', userId)
          .single();

        if (checkError) {
          console.error('Verification failed:', checkError);
        } else {
          console.log('Current database values:', checkData);

          if (checkData.feedback === feedback) {
            console.log('Update was successful despite empty response');
            setSubmitted(true);
            console.log('Feedback submitted successfully!');
            return;
          }
        }

        console.error('Update appears to have failed');
        alert('Failed to save your feedback. Please try again.');
        return;
      }

      setSubmitted(true);
      console.log('Feedback submitted successfully!');

    } catch (err) {
      console.error('Feedback submission error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setFeedback('');
    setRating(0);
    setSubmitted(false);
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">Feedback</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="feedback-form">
          <label htmlFor="feedback-input" className="feedback-label">
            We’d love to hear your thoughts!
          </label>
          <textarea
            id="feedback-input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            rows="5"
            className="feedback-textarea"
          />

          <div className="feedback-rating">
            <p className="feedback-rating-label">Rate your experience:</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? 'star filled' : 'star'}
                  onClick={() => handleStarClick(star)}
                  style={{ cursor: 'pointer', fontSize: '24px', marginRight: '5px' }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="feedback-submit-button">
            Submit
          </button>
        </form>
      ) : (
        <div className="feedback-thankyou">
          <h2>🎉 Thank you for your feedback!</h2>
          <p className="feedback-response"><strong>Your feedback:</strong> {feedback}</p>
          <p className="feedback-response"><strong>Your rating:</strong> {rating} ⭐</p>
          <button className="feedback-reset-button" onClick={handleReset}>
            Send Another Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;

