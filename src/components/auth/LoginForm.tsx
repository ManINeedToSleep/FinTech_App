'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data.token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-snow-white">Welcome Back</h2>
        <p className="mt-2 text-frost-blue">Sign in to access your account</p>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-frost-blue mb-1">
            Email
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-frost-blue mb-1">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg font-medium hover:bg-aurora-green/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={onToggle}
          className="text-frost-blue hover:text-aurora-green transition-colors"
        >
          Don&apos;t have an account? Sign up
        </button>
      </div>
    </div>
  );
} 