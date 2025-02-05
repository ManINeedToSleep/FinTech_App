'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import FloatingIcons from '@/components/background/FloatingIcons';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <FloatingIcons />

      {/* Auth Form */}
      <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10">
        {isLogin ? 
          <LoginForm onToggle={() => setIsLogin(false)} /> : 
          <RegisterForm onToggle={() => setIsLogin(true)} />
        }
      </div>
    </div>
  );
} 