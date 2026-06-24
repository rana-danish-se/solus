'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useAuthStore from '../../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const { login, isLoading: loading, error, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      const id = setTimeout(() => setChecking(false), 0);
      return () => { clearTimeout(id); clearError(); };
    }
  }, [isAuthenticated, router, clearError]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
        <div className="animate-spin w-8 h-8 border-4 border-glow border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();

    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] text-[#1C1C1E] font-sans relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-glow/10 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-highlight/10 rounded-full blur-3xl mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-md p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-highlight/20 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(94,92,230,0.08)]">
        
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="mb-4 relative">
            <Image 
              src="/logo_dark.png" 
              alt="Solus Logo" 
              width={150}
              height={150}
              priority
            />
          </div>
          <p className="text-highlight text-sm font-medium tracking-wide uppercase mt-2">Workspace Authentication</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-highlight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-glow/50 focus:border-glow transition-all duration-300 text-foreground shadow-sm placeholder:text-highlight/50"
              placeholder="admin@solus.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-highlight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-glow/50 focus:border-glow transition-all duration-300 text-foreground shadow-sm placeholder:text-highlight/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-3.5 cursor-pointer px-4 bg-glow hover:bg-[#4d4bd6] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-[0_4px_14px_0_rgb(94,92,230,0.39)] hover:shadow-[0_6px_20px_rgba(94,92,230,0.23)] hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
