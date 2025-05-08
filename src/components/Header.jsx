import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user?.email) {
        const firstName = session.user.email.split('@')[0].split('.')[0];
        setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
      } else {
        setUserName('');
      }
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
      
      if (data.session?.user?.email) {
        const firstName = data.session.user.email.split('@')[0].split('.')[0];
        setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
      }
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
      console.log('Logged out successfully');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Unexpected error during logout:', error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-3 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1 rounded-full shadow-md">
              <img src="/src/assets/434x0w.webp" alt="Logo" className="h-10 w-10 rounded-full" />
            </div>
            <h1 className="text-xl font-bold md:text-2xl">
              <Link to="/" className="hover:text-indigo-100 transition-colors duration-200">
                Personality Assessment
              </Link>
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className="hover:text-indigo-100 transition-colors duration-200 font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/results" 
                    className="hover:text-indigo-100 transition-colors duration-200 font-medium"
                  >
                    Results
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="hover:text-indigo-100 transition-colors duration-200 font-medium"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/feedback" 
                    className="hover:text-indigo-100 transition-colors duration-200 font-medium"
                  >
                    Feedback
                  </Link>
                </li>
                
                {userName && (
                  <li className="pl-3 border-l border-indigo-300">
                    <div className="flex items-center space-x-2">
                      <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                        {userName.charAt(0)}
                      </div>
                      <span className="hidden lg:inline">{userName}</span>
                    </div>
                  </li>
                )}

                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isLoggedIn && isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 animated fadeIn">
            <nav>
              <ul className="flex flex-col space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="block hover:bg-indigo-600 px-3 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/results" 
                    className="block hover:bg-indigo-600 px-3 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Results
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="block hover:bg-indigo-600 px-3 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/feedback" 
                    className="block hover:bg-indigo-600 px-3 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Feedback
                  </Link>
                </li>
                
                {userName && (
                  <li className="pt-2 border-t border-indigo-600">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                        {userName.charAt(0)}
                      </div>
                      <span>{userName}</span>
                    </div>
                  </li>
                )}
                
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;