'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, User, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, user, isLoading: authLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user && !authLoading) {
      router.push(redirect);
    }
  }, [user, authLoading, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await signUp(email, password, fullName);
      if (res?.error) {
        setError(res.error);
      } else {
        setRegisteredEmail(email);
        setShowSuccess(true);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error creating account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="relative w-full max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-strong border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.06),_0_0_40px_rgba(245,166,35,0.02)] p-8 md:p-10 rounded-3xl text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 text-accent shadow-sm">
              <Mail size={32} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="absolute -top-1.5 -right-1.5 bg-green-500 text-white rounded-full p-1 border-2 border-white flex items-center justify-center w-6 h-6 shadow-sm"
              >
                <CheckCircle2 size={14} />
              </motion.div>
            </div>
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-text mb-2">
            Check your email!
          </h2>
          
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            We&apos;ve sent a verification link to <strong className="text-text font-semibold">{registeredEmail}</strong>. Please check your inbox and verify your email to log in.
          </p>

          <div className="flex flex-col gap-4 mt-6">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 hover:brightness-95 transition-all shadow-md shadow-accent/20 rounded-xl"
            >
              Open Gmail Inbox
            </a>
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
              className="btn btn-secondary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-all text-text rounded-xl border border-secondary-alt/30 hover:bg-secondary/40"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto px-4 py-8">
      {/* Background glowing/floating blobs */}
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
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', damping: 25, stiffness: 140 }}
        className="glass-strong border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.06),_0_0_40px_rgba(245,166,35,0.02)] p-8 md:p-10 rounded-3xl"
      >
        {/* Brand visual header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-accent-light text-accent rounded-2xl mb-4 shadow-sm border border-accent/10">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-text tracking-tight">
            Create Account
          </h2>
          <p className="text-xs text-text-muted mt-2">
            Join PetSolutions.lk to start adding items to your cart.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-error-light text-error text-xs rounded-xl border border-error/20 mb-5 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-text-light" />
              <input
                type="text"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-text-light" />
              <input
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-text-light" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-text-light" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-accent/20 rounded-xl mt-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                Register <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center mt-6 pt-4 border-t border-secondary/50 text-xs text-text-muted">
          Already have an account?{' '}
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-accent font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex items-center justify-center pt-0 pb-16 px-4 bg-dominant" style={{ minHeight: '80vh' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          </div>
        }>
          <RegisterFormContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
