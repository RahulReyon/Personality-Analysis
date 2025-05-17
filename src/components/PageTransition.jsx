import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const PageTransition = ({ children }) => {
  const containerRef = useRef();

  useEffect(() => {
    // Animate fade in on mount
    anime({
      targets: containerRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutQuad',
      duration: 600,
    });

    return () => {
      // Optional: animate fade out on unmount (if you want)
      // But React unmounts immediately, so you need extra handling
    };
  }, []);

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default PageTransition;
