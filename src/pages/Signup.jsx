import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundLayout from '../components/BackgroundLayout';
import { supabase } from '../utils/supabaseClient';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }
    
    checkAuthStatus();
  }, [navigate]);

  const validate = async () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) {
      newErrors.email = 'Enter a valid email';
    }

    if (formData.email.includes('@')) {
      try {
        const { data } = await supabase
          .from('userinfo')
          .select('email')
          .eq('email', formData.email)
          .single();
        
        if (data) {
          newErrors.email = 'This email is already registered';
        }
      } catch (error) {
        console.error('Email check error:', error);
      }
    }

    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const validationErrors = await validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        setErrors({ general: error.message });
        setLoading(false);
        return;
      }

      const user = data.user;

      if (user) {
        console.log('User registered:', user);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { data: insertData, error: insertError } = await supabase
            .from('userinfo')
            .insert([
              {
                id: user.id,              
                name: formData.name,
                email: formData.email,
                feedback: null,          
              }
            ])
            .select(); 
      
          if (insertError) {
            console.error('Failed to insert user info:', insertError);
            console.error('Error code:', insertError.code);
            console.error('Error details:', insertError.details);
          } else {
            console.log('User info saved successfully:', insertData);
          }
        } catch (err) {
          console.error('Unexpected error saving user info:', err);
        }
      }

      console.log('User registered and info saved:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', password: '' });

      await supabase.auth.signOut();
      setTimeout(() => {
        navigate('/login');
      }, 150000);
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-md w-full border">
          <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Create an Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center">{errors.general}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            {submitted && (
              <p className="text-green-600 text-sm text-center mt-4">
                Signup successful! Redirecting to login...
              </p>
            )}
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default Signup;