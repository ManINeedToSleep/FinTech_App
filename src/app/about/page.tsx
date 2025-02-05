'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, faChartLine, faCoins,
  faWallet, faBolt, faArrowTrendUp 
} from '@fortawesome/free-solid-svg-icons';
import CosmicBackground from '@/components/background/CosmicBackground';
import FloatingIcons from '@/components/background/FloatingIcons';

// Define feature cards data structure
const features = [
  {
    icon: faShieldHalved,
    title: 'Secure Transactions',
    description: 'Bank-grade security for all your financial operations',
    color: 'frost-blue' // Uses our custom color palette
  },
  {
    icon: faChartLine,
    title: 'Real-time Analytics',
    description: 'Track your spending patterns with detailed insights',
    color: 'aurora-green'
  },
  {
    icon: faCoins,
    title: 'Smart Savings',
    description: 'Automated tools to help you save more effectively',
    color: 'northern-pink'
  },
  {
    icon: faWallet,
    title: 'Multiple Accounts',
    description: 'Manage all your accounts in one place',
    color: 'aurora-green'
  },
  {
    icon: faBolt,
    title: 'Instant Transfers',
    description: 'Quick and easy money transfers between accounts',
    color: 'frost-blue'
  },
  {
    icon: faArrowTrendUp,
    title: 'Investment Tools',
    description: 'Tools and insights for smarter investing',
    color: 'northern-pink'
  }
];

export default function About() {
  // State to handle hydration mismatch between server and client
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner while component is mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-nordic-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green"></div>
      </div>
    );
  }

  return (
    // Main container with Nordic theme background
    <div className="min-h-screen bg-nordic-blue relative">
      {/* Animated background components */}
      <CosmicBackground /> {/* Renders stars and aurora effects */}
      <FloatingIcons />    {/* Renders floating financial icons */}

      {/* Main content container with proper z-index to appear above background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-snow-white mb-4">
            Welcome to Fintech Financial Bank
          </h1>
          <p className="text-xl text-frost-blue max-w-2xl mx-auto">
            Experience the future of banking with our modern financial platform
          </p>
        </div>

        {/* Features Grid - Responsive layout with 1, 2, or 3 columns based on screen size */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            // Individual feature card with hover effect and glass morphism
            <div
              key={index}
              className="glass-card p-6 rounded-xl border border-frost-blue/10 transform hover:scale-105 transition-all duration-300"
            >
              {/* Feature icon with dynamic color based on feature definition */}
              <div className={`text-${feature.color} text-3xl mb-4`}>
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              {/* Feature title and description */}
              <h3 className="text-xl font-semibold text-snow-white mb-2">
                {feature.title}
              </h3>
              <p className="text-frost-blue">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <Link
            href="/auth"
            className="bg-aurora-green text-nordic-blue px-8 py-3 rounded-lg font-medium hover:bg-aurora-green/90 transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
} 
