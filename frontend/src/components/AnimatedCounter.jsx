import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ 
  target, 
  duration = 2000, 
  className = "", 
  suffix = "" 
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setCurrent(Math.floor(target * easeOutCubic));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return (
    <span className={className}>
      {current}{suffix}
    </span>
  );
};

export default AnimatedCounter;