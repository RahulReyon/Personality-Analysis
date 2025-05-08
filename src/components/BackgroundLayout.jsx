import React from 'react';
import Home from '../pages/Home'; // Home component ka correct path de dena!

const BackgroundLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Home page as background */}
      <div className="absolute inset-0 z-0">
        <Home />
      </div>

      {/* NO blur, NO overlay now */}

      {/* Form Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;
