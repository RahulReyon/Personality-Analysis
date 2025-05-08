import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
          <Route path="/" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;