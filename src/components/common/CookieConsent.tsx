'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent was already recorded
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay on first load so it appears gracefully
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[9990] p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#BDDFEA] shadow-[0_12px_40px_rgba(26,26,46,0.15)] text-[#1A1A2E]"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100/80 text-amber-600 flex-shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1A1A2E]">
                  We Value Your Privacy &amp; Security
                </h3>
                <button
                  onClick={handleEssentialOnly}
                  className="p-1 rounded-full text-text-muted hover:text-[#1A1A2E] hover:bg-gray-100 transition-colors"
                  aria-label="Dismiss cookie notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#2D2D3F] mt-1 leading-relaxed">
                PetSolutions.lk uses cookies to keep your shopping cart active, maintain secure sign-ins, and ensure encrypted payment processing with authorized gateways. Learn more in our{' '}
                <Link href="/cookie-policy" className="text-[#00ACDF] font-bold underline hover:text-[#0090BB]">
                  Cookie Policy
                </Link>.
              </p>
              
              <div className="flex items-center gap-2 mt-3.5 pt-2 border-t border-gray-100">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2 px-3 rounded-xl bg-accent hover:bg-accent-hover text-[#1A1A2E] font-bold text-xs transition-all shadow-xs cursor-pointer text-center"
                >
                  Accept All
                </button>
                <button
                  onClick={handleEssentialOnly}
                  className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2D2D3F] font-semibold text-xs transition-colors cursor-pointer"
                >
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
