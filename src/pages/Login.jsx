import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundLayout from '../components/BackgroundLayout';
import { supabase } from '../utils/supabaseClient';
import PageAnimationWrapper from '../components/PageAnimationWrapper';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          navigate('/complete-profile');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }
    checkAuthStatus();
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      if (data?.user) {
        navigate('/complete-profile');
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <PageAnimationWrapper>
    <BackgroundLayout>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/your-homepage-image.jpg')` }}>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="p-8 max-w-md w-full bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Login to Your Account</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>

            <p className="text-center mt-4 text-sm text-gray-600">
              Forgot your password?{' '}
              <Link to="/reset-password" className="text-blue-600 hover:underline">
                Reset here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </BackgroundLayout>
    </PageAnimationWrapper>
  );
};

export default Login;
