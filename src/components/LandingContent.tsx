'use client';

import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "🔒",
    title: "Secure Banking",
    description: "Bank with confidence knowing your money is protected by state-of-the-art security."
  },
  {
    icon: "⚡",
    title: "Instant Transfers",
    description: "Send and receive money instantly, anywhere in the world."
  },
  {
    icon: "📊",
    title: "Smart Analytics",
    description: "Track your spending and manage your finances with powerful insights."
  }
];

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">FinTech</div>
            <div className="space-x-6">
              <Link href="/auth" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link href="/auth" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Banking Made <span className="text-blue-600">Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience the future of banking with our secure, fast, and intuitive platform.
          </p>
          <div className="animate-bounce-subtle">
            <Link href="/auth" 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-blue-600 text-2xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}