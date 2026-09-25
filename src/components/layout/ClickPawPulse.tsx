'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PawClick {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export default function ClickPawPulse() {
  const [paws, setPaws] = useState<PawClick[]>([]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // Only react to primary mouse button / touch
    if (e.button !== 0) return;

    const newPaw: PawClick = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      rotation: Math.floor(Math.random() * 30) - 15, // Subtle organic -15deg to +15deg
    };

    // Keep up to 8 active clicks to ensure 60fps performance
    setPaws((prev) => [...prev.slice(-7), newPaw]);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [handlePointerDown]);

  const removePaw = useCallback((id: number) => {
    setPaws((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <AnimatePresence>
        {paws.map((paw) => (
          <div
            key={paw.id}
            style={{
              position: 'absolute',
              left: paw.x,
              top: paw.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              width: '96px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 1. Shockwave Pulse Ripple Ring */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0.85 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                borderRadius: '9999px',
                border: '2.5px solid rgba(249, 115, 22, 0.6)',
                boxShadow: '0 0 20px rgba(255, 200, 0, 0.45)',
              }}
            />

            {/* 2. Big Paw Icon with Energetic Pulse & Pop */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0, rotate: paw.rotation }}
              animate={{
                scale: [0.2, 1.25, 0.98, 1.12],
                opacity: [0, 1, 0.92, 0],
                rotate: paw.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.75,
                times: [0, 0.22, 0.5, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={() => removePaw(paw.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter:
                  'drop-shadow(0 6px 18px rgba(249, 115, 22, 0.5)) drop-shadow(0 2px 6px rgba(255, 200, 0, 0.4))',
              }}
            >
              <svg
                width="88"
                height="88"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`paw-fill-${paw.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFC800" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>

                {/* Main Large Palm / Heel Pad */}
                <path
                  d="M32 29 C23.5 29, 17 35.5, 19 47 C20.2 53.5, 25.5 57, 32 57 C38.5 57, 43.8 53.5, 45 47 C47 35.5, 40.5 29, 32 29 Z"
                  fill={`url(#paw-fill-${paw.id})`}
                />

                {/* 4 Expressive Toe Pads */}
                <ellipse
                  cx="18.5"
                  cy="23"
                  rx="5"
                  ry="6.8"
                  transform="rotate(-18 18.5 23)"
                  fill={`url(#paw-fill-${paw.id})`}
                />
                <ellipse
                  cx="27.5"
                  cy="17"
                  rx="5.2"
                  ry="7.2"
                  transform="rotate(-6 27.5 17)"
                  fill={`url(#paw-fill-${paw.id})`}
                />
                <ellipse
                  cx="36.5"
                  cy="17"
                  rx="5.2"
                  ry="7.2"
                  transform="rotate(6 36.5 17)"
                  fill={`url(#paw-fill-${paw.id})`}
                />
                <ellipse
                  cx="45.5"
                  cy="23"
                  rx="5"
                  ry="6.8"
                  transform="rotate(18 45.5 23)"
                  fill={`url(#paw-fill-${paw.id})`}
                />
              </svg>
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
