'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ShieldCheck, Phone, CreditCard, Sparkles, X } from 'lucide-react';

interface Announcement {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  badge?: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'delivery',
    icon: Truck,
    badge: 'Fast Dispatch',
    text: 'Islandwide Express Doorstep Delivery Across Sri Lanka',
  },
  {
    id: 'auth',
    icon: ShieldCheck,
    badge: '100% Genuine',
    text: 'Authorized Veterinary Brands & Direct Clinical Stock',
  },
  {
    id: 'hotline',
    icon: Phone,
    badge: 'Order Helpline',
    text: 'Order Hotline: +94 77 123 4567 (8:30 AM – 8:30 PM)',
  },
  {
    id: 'payment',
    icon: CreditCard,
    badge: 'Flexible Pay',
    text: 'Cash on Delivery (COD) & Secure Card Payments Islandwide',
  },
  {
    id: 'nutrition',
    icon: Sparkles,
    badge: 'Vet Care',
    text: 'Direct Authentic Veterinary Nutrition & Wellness Care',
  },
];

interface UtilityBarProps {
  initialVisible?: boolean;
  onClose?: () => void;
}

export default function UtilityBar({ initialVisible = true, onClose }: UtilityBarProps) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <div
      className="w-full relative z-30 border-b border-black/10 select-none overflow-hidden"
      style={{
        backgroundColor: '#FFC800',
        color: '#1A1A2E',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <div className="container mx-auto px-4 py-1.5 flex items-center justify-between min-h-[34px] max-w-7xl">
        {/* Left spacer for visual optical balance */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 pointer-events-none w-6" aria-hidden="true" />

        {/* Center: Contained Cycling Pill */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-2 text-xs font-semibold max-w-full text-center"
              style={{ color: '#1A1A2E' }}
            >
              {current.badge && (
                <span
                  className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/10 text-[#1A1A2E]"
                >
                  {current.badge}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-bold truncate">
                <Icon size={14} className="flex-shrink-0 text-[#1A1A2E]" />
                <span className="truncate">{current.text}</span>
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Close button */}
        <div className="flex items-center justify-end flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors flex items-center justify-center text-[#1A1A2E]"
            aria-label="Dismiss announcement ribbon"
            title="Dismiss Announcement"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
