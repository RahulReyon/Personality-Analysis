import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const PageAnimationWrapper = ({ children }) => {
  const wrapperRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    // Animate container fade, scale, and slide
    anime({
      targets: wrapperRef.current,
      opacity: [0, 1],
      scale: [0.95, 1],
      translateY: [30, 0],
      duration: 1000,
      easing: 'easeOutExpo',
    });

    // Animate all direct children of the wrapper with stagger
    elementsRef.current = wrapperRef.current
      ? Array.from(wrapperRef.current.children)
      : [];

    anime({
      targets: elementsRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(150, { start: 400 }),
      duration: 800,
      easing: 'easeOutBack',
    });
  }, []);

  return (
    <div ref={wrapperRef} style={{ opacity: 0, transform: 'translateY(30px) scale(0.95)' }}>
      {children}
    </div>
  );
};

export default PageAnimationWrapper;
