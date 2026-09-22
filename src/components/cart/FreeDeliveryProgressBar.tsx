'use client';

import { motion } from 'framer-motion';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';

interface FreeDeliveryProgressBarProps {
  subtotal: number;
  threshold?: number;
  className?: string;
}

export const FREE_DELIVERY_THRESHOLD = 10000;

export default function FreeDeliveryProgressBar({
  subtotal,
  threshold = FREE_DELIVERY_THRESHOLD,
  className = '',
}: FreeDeliveryProgressBarProps) {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  const remaining = Math.max(0, threshold - safeSubtotal);
  const percentage = Math.min(100, (safeSubtotal / threshold) * 100);
  const isUnlocked = safeSubtotal >= threshold;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-300 ${
        isUnlocked
          ? 'bg-gradient-to-r from-emerald-50 to-[#E6F4F8] border-emerald-300/80 shadow-sm'
          : 'bg-[#FEFCF3] border-[#BDDFEA]/70 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
              isUnlocked
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-[#E6F4F8] text-[#00ACDF]'
            }`}
          >
            {isUnlocked ? <CheckCircle2 size={16} /> : <Truck size={16} />}
          </div>
          <span className="text-xs sm:text-sm font-heading font-semibold text-[#1A1A2E]">
            {isUnlocked ? (
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                🎉 Congratulations! You have unlocked FREE Islandwide Delivery!
              </span>
            ) : (
              <span>
                Add{' '}
                <strong className="text-[#00ACDF] font-bold">
                  Rs. {remaining.toLocaleString()}
                </strong>{' '}
                more to unlock <span className="font-bold text-[#1A1A2E]">FREE Islandwide Delivery!</span>
              </span>
            )}
          </span>
        </div>

        {isUnlocked ? (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFC800] text-[#1A1A2E] shadow-sm">
            <Sparkles size={12} /> Free Shipping
          </span>
        ) : (
          <span className="text-xs font-mono font-bold text-[#00ACDF] shrink-0">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      {/* Progress Track & Animated Fill Bar */}
      <div className="w-full h-2.5 bg-[#E6F4F8] rounded-full overflow-hidden p-0.5 relative border border-[#BDDFEA]/40">
        <motion.div
          className={`h-full rounded-full ${
            isUnlocked
              ? 'bg-gradient-to-r from-[#00ACDF] to-emerald-500 shadow-sm'
              : 'bg-[#00ACDF]'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[11px] text-[#6B6B7B]">
        <span>Rs. 0</span>
        <span className="font-medium text-[#1A1A2E]">Target: Rs. {threshold.toLocaleString()}</span>
      </div>
    </div>
  );
}
