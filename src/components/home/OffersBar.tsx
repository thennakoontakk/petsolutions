'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Sparkles, AlertCircle } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Offer } from '@/lib/types';

export default function OffersBar() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true);
        
        if (error) throw error;
        if (data) {
          setOffers(data as Offer[]);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      }
    }

    fetchOffers();
  }, []);

  if (!isVisible || offers.length === 0) return null;

  // Concatenate offers to create a continuous scroll message
  const offerMessage = offers
    .map((o) => `✨ ${o.title}: ${o.description || ''} ${o.code ? `(Use Code: ${o.code})` : ''}`)
    .join('  |  ');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: '35px' }}
        exit={{ opacity: 0, height: 0 }}
        className="w-full relative overflow-hidden flex items-center justify-between text-white"
        style={{
          backgroundColor: 'var(--color-accent)',
          zIndex: 35,
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        {/* Infinite marquee ticker */}
        <div className="flex-1 flex overflow-hidden whitespace-nowrap text-xs font-semibold select-none items-center relative">
          <div className="animate-marquee py-2 flex gap-4">
            <span>{offerMessage}</span>
            <span>{offerMessage}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-black/10 text-white/80 hover:text-white rounded-full transition-colors flex-shrink-0 mr-3 absolute right-0"
          style={{ zIndex: 10 }}
        >
          <X size={14} />
        </button>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          /* Adjust header position offset since bar is 35px high at top */
          body {
            padding-top: 35px;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
