'use client';

import { useEffect, useState } from 'react';

export default function CosmicBackground() {
  const [stars, setStars] = useState<{ left: string; top: string; delay: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="cosmic-background">
      <div className="stars">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
      <div className="aurora-container">
        <div className="aurora-1" />
        <div className="aurora-2" />
        <div className="aurora-3" />
      </div>
    </div>
  );
} 