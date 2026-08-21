'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  itemName: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Product',
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Dark High-Contrast Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
        />

        {/* Solid High-Contrast Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 p-6 space-y-5 text-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>

          {/* Warning Icon & Header */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex-shrink-0">
              <AlertTriangle size={26} />
            </div>
            <div className="space-y-1 pr-6">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {title}
              </h3>
              <p className="text-xs text-red-600 font-medium">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          {/* Target Item Badge */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
              Selected Item To Delete
            </span>
            <span className="font-bold text-slate-900 line-clamp-2 text-sm">
              {itemName}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete this product? All variants, pricing information, and stock details will be removed from your catalog.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              ) : (
                <>
                  <Trash2 size={15} /> Delete Product
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
