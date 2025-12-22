import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Snowflake, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/app';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.errors[0].message);
      setLoading(false);
      return;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password');
          } else {
            setError(error.message);
          }
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered. Try logging in instead.');
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans text-foreground"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-32 pb-20 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_40px_rgba(34,211,238,0.4)] flex items-center justify-center">
              <Snowflake size={40} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-cyan-200/70 text-center mb-8">
            {isLogin ? 'Sign in to access your BrainFreeze app' : 'Start your mental clarity journey'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-cyan-500/30 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-cyan-500/30 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-6 text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center bg-black/30 backdrop-blur-sm border-t border-white/10">
        <p className="text-xs text-cyan-200/50 uppercase tracking-widest">
          © 2024 BrainFreeze. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Auth;
