'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hotline, setHotline] = useState('+94771234567');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch hotline from store settings
  useEffect(() => {
    async function fetchHotline() {
      try {
        const supabase = createBrowserClient();
        const { data } = await supabase
          .from('store_settings')
          .select('value, is_enabled')
          .eq('key', 'hotline')
          .single();

        if (data && data.is_enabled && data.value) {
          const cleanNumber = data.value.replace(/[^0-9]/g, '');
          if (cleanNumber) {
            setHotline(cleanNumber);
          }
        }
      } catch {
        // Fallback to default
      }
    }
    fetchHotline();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const whatsappUrl = `https://wa.me/${hotline.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello PetSolutions.lk! I need assistance with pet care products.'
  )}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      
      {/* 1. Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="p-3 rounded-full bg-white text-text hover:text-accent hover:bg-white shadow-xl hover:shadow-2xl border border-secondary-alt/50 transition-all flex items-center justify-center group"
            style={{
              pointerEvents: 'auto',
              width: '46px',
              height: '46px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <ChevronUp size={22} className="transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. WhatsApp Support Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ pointerEvents: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {/* Tooltip on Desktop */}
        <AnimatePresence>
          {isTooltipVisible && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{
                position: 'absolute',
                right: '100%',
                marginRight: '12px',
                padding: '8px 14px',
                borderRadius: '12px',
                backgroundColor: '#1A1A2E',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>Chat with us on WhatsApp</span>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-4px',
                  transform: 'translateY(-50%) rotate(45deg)',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#1A1A2E',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with PetSolutions on WhatsApp"
          className="transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
            position: 'relative',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          {/* Subtle pulse wave */}
          <span 
            className="animate-ping" 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: '#25D366',
              opacity: 0.35,
              animationDuration: '2.5s',
            }}
          />

          {/* WhatsApp Custom SVG Icon */}
          <svg
            style={{ width: '28px', height: '28px', position: 'relative', zIndex: 10, fill: 'currentColor' }}
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </motion.div>

    </div>
  );
}
