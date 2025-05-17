import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import PageAnimationWrapper from '../components/PageAnimationWrapper';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate('/login'); // Not logged in
      } else {
        setUserId(data.user.id);
      }
    }
    getUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!age || !gender || !userId) {
      setError('All fields are required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('userinfo')
        .upsert({
          id: userId,
          age: parseInt(age),
          gender,
        }, { onConflict: ['id'] });

      if (error) {
        setError('Failed to save profile info');
        console.error(error);
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Unexpected error. Try again.');
    }
  };

  return (
    <PageAnimationWrapper>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border p-2 rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </PageAnimationWrapper>
  );
};

export default CompleteProfile;
