import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error logging out:', error.message);
        return;
      }
      console.log('Logged out successfully1');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Unexpected error during logout:', error.message);
    }
  };

  return (
    <header className="bg-gray-500 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/src/assets/434x0w.webp" alt="Logo" className="h-12 w-12 rounded-full" />
          <h1 className="text-2xl font-bold">Personality Application</h1>
        </div>

        {isLoggedIn && (<nav>
          <ul className="flex items-center space-x-6">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/results" className="hover:underline">Results</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/feedback" className="hover:underline">Feedback</Link></li>

            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </li>

          </ul>
        </nav>)}
      </div>
    </header>
  );
}

export default Header