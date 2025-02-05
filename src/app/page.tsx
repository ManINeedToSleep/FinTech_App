'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function Page() {
  useEffect(() => {
    gsap.from('.hero-text', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out'
    });
  }, []);

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 -mt-12">
      <div className="text-center space-y-8 max-w-4xl">
        <h1 className="hero-text text-6xl font-bold text-snow-white [text-shadow:_0_1px_12px_rgb(0_0_0_/_20%)]">
          Welcome to <span className="text-aurora-green">FinTech</span>
        </h1>
        <p className="hero-text text-xl text-frost-blue [text-shadow:_0_1px_8px_rgb(0_0_0_/_20%)]">
          Your modern financial companion for smart money management
        </p>
        <div className="hero-text flex gap-4 justify-center">
          <Link 
            href="/auth" 
            className="px-8 py-3 bg-aurora-green text-nordic-blue rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            Get Started
          </Link>
          <Link 
            href="/about" 
            className="px-8 py-3 border-2 border-frost-blue text-frost-blue rounded-full hover:bg-frost-blue hover:text-nordic-blue transition-colors shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}