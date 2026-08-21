'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, User, Shield, Sparkles, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [fillState, setFillState] = useState<'idle' | 'typing'>('idle');

  const redirect = searchParams.get('redirect') || '/';

  // If user is already authenticated, redirect
  useEffect(() => {
    if (user && !authLoading) {
      setSuccess('Redirecting...');
      const timer = setTimeout(() => {
        router.push(redirect);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, redirect, router]);

  // Shake effect on error
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await signIn(email, password);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess('Successfully signed in! Welcome back.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to simulate fast typing for demo accounts
  const handleQuickLogin = async (type: 'admin' | 'user') => {
    if (fillState === 'typing' || isSubmitting) return;
    
    setFillState('typing');
    setError(null);
    setSuccess(null);
    
    const targetEmail = type === 'admin' ? 'admin@petsolutions.lk' : 'user@petsolutions.lk';
    const targetPassword = type === 'admin' ? 'AdminPassword123' : 'UserPassword123';
    
    // Clear first
    setEmail('');
    setPassword('');
    
    // Quick typing animation
    let currentEmail = '';
    let currentPassword = '';
    
    // Simulate typing email
    for (let i = 0; i <= targetEmail.length; i++) {
      await new Promise((r) => setTimeout(r, 20));
      currentEmail = targetEmail.slice(0, i);
      setEmail(currentEmail);
    }
    
    await new Promise((r) => setTimeout(r, 100));
    
    // Simulate typing password
    for (let i = 0; i <= targetPassword.length; i++) {
      await new Promise((r) => setTimeout(r, 15));
      currentPassword = targetPassword.slice(0, i);
      setPassword(currentPassword);
    }
    
    await new Promise((r) => setTimeout(r, 200));
    setFillState('idle');
    
    // Trigger submit
    setIsSubmitting(true);
    try {
      const res = await signIn(targetEmail, targetPassword);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess('Successfully signed in! Welcome back.');
      }
    } catch (err: any) {
      setError('An error occurred during quick sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-4 py-8">
      {/* Background glowing/floating blobs (scoped inside page container) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-accent/15 blur-[80px] animate-blob-1" />
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 rounded-full bg-accent-hover/10 blur-[100px] animate-blob-2" />
      </div>

      <style jsx global>{`
        @keyframes blob-drift-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-drift-2 {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-50px, 50px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        .animate-blob-1 {
          animation: blob-drift-1 12s infinite ease-in-out;
        }
        .animate-blob-2 {
          animation: blob-drift-2 16s infinite ease-in-out;
        }
      `}</style>

      {/* Back button */}
      <div className="mb-4 sm:mb-6 flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-muted hover:text-accent font-semibold transition-all p-1.5 sm:p-0 rounded-full hover:bg-secondary/40 sm:hover:bg-transparent"
          title="Back to Storefront"
          aria-label="Back to Storefront"
        >
          <ArrowLeft size={22} className="flex-shrink-0" />
          <span className="mobile-hidden-inline">Back to Storefront</span>
        </Link>
      </div>

      {/* Main glass card wrapper */}
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 25, stiffness: 140 }}
        className="glass-strong border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.06),_0_0_40px_rgba(245,166,35,0.02)] p-8 md:p-10 rounded-3xl"
      >
        {/* Brand visual header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-accent-light text-accent rounded-2xl mb-4 shadow-sm border border-accent/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-text tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-text-muted mt-2">
            Sign in to PetSolutions.lk to access your pet supply orders & cart.
          </p>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-error-light text-error text-xs font-medium rounded-xl border border-error/15 mb-6 flex items-start gap-2"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-success-light text-success text-xs font-medium rounded-xl border border-success/15 mb-6 flex items-start gap-2"
            >
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-dark tracking-wide uppercase block">Email Address</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-accent transition-colors duration-200" />
              <input
                type="email"
                placeholder="email@example.com"
                required
                disabled={isSubmitting || fillState === 'typing'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full pl-11 pr-4 py-3 bg-secondary/25 border border-secondary-alt/50 rounded-xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-text-dark tracking-wide uppercase block">Password</label>
              <Link href="/auth/register" className="text-[11px] font-semibold text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-accent transition-colors duration-200" />
              <input
                type="password"
                placeholder="••••••••"
                required
                disabled={isSubmitting || fillState === 'typing'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pl-11 pr-4 py-3 bg-secondary/25 border border-secondary-alt/50 rounded-xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || fillState === 'typing'}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn btn-primary w-full py-3.5 mt-2 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 rounded-xl shadow-md cursor-pointer transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4.5 w-4.5 border-b-2 border-white"></div>
            ) : (
              <>
                Sign In <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer registration link */}
        <div className="text-center mt-6 pt-5 border-t border-secondary-alt/30 text-xs text-text-muted">
          New to PetSolutions?{' '}
          <Link href={`/auth/register?redirect=${encodeURIComponent(redirect)}`} className="text-accent font-bold hover:underline">
            Create Account
          </Link>
        </div>

        {/* Quick Testing Credentials Assistant Panel */}
        <div className="mt-8 pt-6 border-t border-dashed border-secondary-alt/40 bg-accent-light/30 rounded-2xl p-4.5 border-0">
          <div className="flex items-center gap-1.5 mb-3 text-accent">
            <Shield size={14} className="shrink-0" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest">Quick Developer Logins</span>
          </div>
          <p className="text-[10px] text-text-muted leading-relaxed mb-4">
            Use these one-click shortcuts to bypass email verification and sign in instantly for testing.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickLogin('admin')}
              disabled={isSubmitting || fillState === 'typing'}
              className="px-3.5 py-2.5 bg-white hover:bg-accent/10 text-accent hover:text-accent-hover text-[11px] font-extrabold rounded-xl border border-accent/20 hover:border-accent/40 shadow-sm flex flex-col items-center justify-center gap-1 text-center transition-all duration-200"
            >
              <span className="font-heading tracking-tight uppercase">Admin Demo</span>
              <span className="text-[8.5px] opacity-75 font-normal normal-case">Full access</span>
            </button>
            <button
              onClick={() => handleQuickLogin('user')}
              disabled={isSubmitting || fillState === 'typing'}
              className="px-3.5 py-2.5 bg-white hover:bg-accent/10 text-text-dark hover:text-accent text-[11px] font-extrabold rounded-xl border border-secondary-alt/60 hover:border-accent/30 shadow-sm flex flex-col items-center justify-center gap-1 text-center transition-all duration-200"
            >
              <span className="font-heading tracking-tight uppercase">Customer Demo</span>
              <span className="text-[8.5px] opacity-75 font-normal normal-case">Standard buyer</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex items-center justify-center pt-0 pb-16 px-4 bg-dominant" style={{ minHeight: '80vh' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        }>
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
