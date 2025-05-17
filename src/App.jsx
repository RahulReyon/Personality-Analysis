import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import About from './pages/About';
import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Feedback from './pages/feedback';
import ResetPassword from './components/ResetPassword';
import { supabase } from './utils/supabaseClient';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard'

const AuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const publicPaths = ['/', '/login', '/signup', '/reset-password'];
    const currentPath = location.pathname;
    
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (!session && 
            !publicPaths.includes(currentPath) && 
            currentPath !== '/signup' && 
            currentPath !== '/login') {
          console.log('AuthRedirect: User not logged in, redirecting to signup');
          navigate('/signup');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
        navigate('/signup');
      }
    }
    
    checkAuth();
  }, [navigate, location.pathname]);

  return isLoading ? null : null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <AuthRedirect />
        <Routes>
          <Route path="/" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/complete-profile" element={<PageTransition><CompleteProfile /></PageTransition>} />
          <Route path="/feedback" element={<PageTransition><Feedback /></PageTransition>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;