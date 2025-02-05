'use client';

import { useEffect, useState } from 'react';

export default function CosmicBackground() {
  const [stars, setStars] = useState<{ left: string; top: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate more stars for better effect
    const newStars = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-nordic-blue/90" />
      
      {/* Stars */}
      <div className="stars absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Aurora Effects */}
      <div className="aurora-container absolute inset-0">
        <div className="aurora-1 absolute inset-0 opacity-30 animate-aurora" 
          style={{
            background: 'linear-gradient(45deg, #7CFCD0 0%, #FF61A6 50%, #7CFCD0 100%)',
            filter: 'blur(60px)',
            transform: 'translateY(-50%)',
          }}
        />
        <div className="aurora-2 absolute inset-0 opacity-20 animate-aurora-delayed" 
          style={{
            background: 'linear-gradient(-45deg, #E2E8F0 0%, #7CFCD0 50%, #FF61A6 100%)',
            filter: 'blur(60px)',
            transform: 'translateY(-50%)',
            animationDelay: '-5s',
          }}
        />
        <div className="aurora-3 absolute inset-0 opacity-10 animate-aurora-delayed-2" 
          style={{
            background: 'linear-gradient(90deg, #FF61A6 0%, #7CFCD0 50%, #E2E8F0 100%)',
            filter: 'blur(60px)',
            transform: 'translateY(-50%)',
            animationDelay: '-10s',
          }}
        />
      </div>
    </div>
  );
} 