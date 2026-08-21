'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShoppingBag, LogOut, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: {
    dog: Array<{ name: string; slug: string }>;
    cat: Array<{ name: string; slug: string }>;
    both: Array<{ name: string; slug: string }>;
  };
}

export default function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  
  const [expandedSection, setExpandedSection] = useState<'dog' | 'cat' | 'both' | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSection = (section: 'dog' | 'cat' | 'both') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            style={{ backgroundColor: 'var(--color-dominant)' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-secondary-alt/30 flex items-center justify-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Image src="/logo-icon.png" width={60} height={60} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '60px', width: 'auto' }} />
                <Image src="/logo-text.png" width={110} height={30} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '30px', width: 'auto' }} />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary/40 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* User Profile Summary */}
              <div className="p-4 bg-white/60 rounded-xl border border-secondary-alt/20 flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-full text-accent">
                  <User size={24} />
                </div>
                <div className="overflow-hidden">
                  {user ? (
                    <>
                      <p className="text-sm font-semibold text-text truncate">
                        {profile?.full_name || user.email}
                      </p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-text">Welcome, Guest!</p>
                      <Link
                        href="/auth/login"
                        onClick={onClose}
                        className="text-xs text-accent hover:underline font-medium"
                      >
                        Sign in to start shopping
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Standard Links */}
              <div className="space-y-3">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block font-heading font-semibold text-text hover:text-accent py-2 border-b border-secondary/30"
                >
                  Home
                </Link>
                
                <Link
                  href="/products"
                  onClick={onClose}
                  className="block font-heading font-semibold text-text hover:text-accent py-2 border-b border-secondary/30"
                >
                  Browse All Products
                </Link>

                {/* Categories Accordions */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                    Categories
                  </span>

                  {/* Dogs Accordion */}
                  <div className="border-b border-secondary/30">
                    <button
                      onClick={() => toggleSection('dog')}
                      className="w-full flex items-center justify-between py-2 text-text font-medium text-sm"
                    >
                      <span className="flex items-center gap-2">🐶 For Dogs</span>
                      {expandedSection === 'dog' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'dog' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {categories.dog.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              onClick={onClose}
                              className="block text-xs text-text-muted hover:text-accent py-1"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Cats Accordion */}
                  <div className="border-b border-secondary/30">
                    <button
                      onClick={() => toggleSection('cat')}
                      className="w-full flex items-center justify-between py-2 text-text font-medium text-sm"
                    >
                      <span className="flex items-center gap-2">🐱 For Cats</span>
                      {expandedSection === 'cat' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'cat' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {categories.cat.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              onClick={onClose}
                              className="block text-xs text-text-muted hover:text-accent py-1"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* General Accordion */}
                  <div className="border-b border-secondary/30">
                    <button
                      onClick={() => toggleSection('both')}
                      className="w-full flex items-center justify-between py-2 text-text font-medium text-sm"
                    >
                      <span className="flex items-center gap-2">🐾 General Care</span>
                      {expandedSection === 'both' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'both' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {categories.both.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              onClick={onClose}
                              className="block text-xs text-text-muted hover:text-accent py-1"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  href="/orders"
                  onClick={onClose}
                  className="block font-heading font-semibold text-text hover:text-accent py-2 border-b border-secondary/30"
                >
                  Shopping History
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 font-heading font-semibold text-accent py-2 border-b border-secondary/30"
                  >
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-secondary-alt/30 bg-secondary/20 space-y-4">
              <Link
                href="/cart"
                onClick={onClose}
                className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={18} /> Cart ({totalItems} items)
              </Link>
              {user && (
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline btn-danger w-full flex items-center justify-center gap-2 text-sm text-error hover:bg-error-light"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
