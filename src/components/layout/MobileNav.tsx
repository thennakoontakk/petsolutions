'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShoppingBag, LogOut, ChevronDown, Shield, Phone, Pill, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';

interface CategoryItem {
  name: string;
  slug: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: {
    dog: CategoryItem[];
    cat: CategoryItem[];
    both?: CategoryItem[];
    pharmacy?: CategoryItem[];
  };
}

const DEFAULT_PHARMACY_CATEGORIES: CategoryItem[] = [
  { name: 'Parasite & Tick Control', slug: 'parasite-tick-control' },
  { name: 'Wound Care & Topical Pharmacy', slug: 'wound-care-topical-pharmacy' },
  { name: 'Medicated Shampoos & Grooming', slug: 'medicated-shampoos-grooming' },
  { name: 'Health & Supplements', slug: 'health-supplements' },
];

export default function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  
  const [expandedSection, setExpandedSection] = useState<'dog' | 'cat' | 'pharmacy' | 'both' | null>(null);

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

  const toggleSection = (section: 'dog' | 'cat' | 'pharmacy' | 'both') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  const pharmacyCategories = categories.pharmacy && categories.pharmacy.length > 0 
    ? categories.pharmacy 
    : DEFAULT_PHARMACY_CATEGORIES;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer with Apple / Linear grade spring physics */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 350, mass: 0.8 }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            style={{ backgroundColor: 'var(--color-dominant)' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-secondary-alt/30 flex items-center justify-between">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <Image 
                  src="/logo-icon.png" 
                  width={40} 
                  height={40} 
                  alt="PetSolutions Icon" 
                  className="w-10 h-10 object-contain"
                />
                <span className="font-heading font-extrabold text-lg text-text tracking-tight">
                  PetSolutions<span style={{ color: 'var(--color-brand-blue)' }}>.lk</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary/40 rounded-full transition-colors text-text"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* User Profile Summary */}
              <div className="p-3.5 bg-white rounded-xl border border-secondary-alt/30 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-accent/15 rounded-full text-text flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    {user ? (
                      <>
                        <p className="text-xs font-bold text-text truncate">
                          {profile?.full_name || user.email}
                        </p>
                        <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-text">Welcome, Pet Parent!</p>
                        <p className="text-[10px] text-text-muted">Sign in for fast checkout</p>
                      </>
                    )}
                  </div>
                </div>

                {user ? (
                  <Link
                    href="/orders"
                    onClick={onClose}
                    className="text-[11px] font-bold text-accent hover:underline flex-shrink-0"
                    style={{ color: 'var(--color-brand-blue)' }}
                  >
                    My Account
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-accent text-text hover:bg-accent-hover transition-colors flex-shrink-0"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Quick Action Links Bar */}
              <div className="space-y-2">
                {/* WhatsApp Helpline Pill */}
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(37, 211, 102, 0.08)',
                    borderColor: 'rgba(37, 211, 102, 0.25)',
                    color: '#0D6832',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <Phone size={12} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text">Vet WhatsApp Helpline</span>
                      <span className="block text-[10px] text-text-muted font-normal">+94 77 123 4567</span>
                    </div>
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    Chat
                  </span>
                </a>

                {/* Cart Shortcut with Item Badge */}
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-secondary-alt/40 hover:border-accent transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-accent/20 text-text">
                      <ShoppingBag size={16} />
                    </div>
                    <span className="font-heading font-semibold text-xs text-text">Shopping Cart</span>
                  </div>
                  {totalItems > 0 ? (
                    <span 
                      className="text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-brand-blue)' }}
                    >
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  ) : (
                    <span className="text-[11px] text-text-muted">Empty</span>
                  )}
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block font-heading font-semibold text-sm text-text hover:text-accent py-2 border-b border-secondary/30"
                >
                  Home
                </Link>
                
                <Link
                  href="/products"
                  onClick={onClose}
                  className="block font-heading font-semibold text-sm text-text hover:text-accent py-2 border-b border-secondary/30"
                >
                  Browse All Products
                </Link>

                {/* Categories Section */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                    Shop by Pet & Health
                  </span>

                  {/* 1. Dogs Accordion */}
                  <div className="border-b border-secondary/30">
                    <button
                      type="button"
                      onClick={() => toggleSection('dog')}
                      aria-expanded={expandedSection === 'dog'}
                      aria-controls="mobile-nav-section-dog"
                      className="w-full flex items-center justify-between py-2 text-text font-semibold text-xs"
                    >
                      <span className="flex items-center gap-2">🐶 For Dogs</span>
                      <ChevronDown
                        size={15}
                        className="text-text-muted"
                        style={{
                          transform: expandedSection === 'dog' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'dog' && (
                        <motion.div
                          id="mobile-nav-section-dog"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {categories.dog.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${encodeURIComponent(cat.slug)}&pet_type=Dog`}
                              onClick={onClose}
                              className="block text-xs text-text-muted hover:text-accent py-1 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Cats Accordion */}
                  <div className="border-b border-secondary/30">
                    <button
                      type="button"
                      onClick={() => toggleSection('cat')}
                      aria-expanded={expandedSection === 'cat'}
                      aria-controls="mobile-nav-section-cat"
                      className="w-full flex items-center justify-between py-2 text-text font-semibold text-xs"
                    >
                      <span className="flex items-center gap-2">🐱 For Cats</span>
                      <ChevronDown
                        size={15}
                        className="text-text-muted"
                        style={{
                          transform: expandedSection === 'cat' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'cat' && (
                        <motion.div
                          id="mobile-nav-section-cat"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {categories.cat.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${encodeURIComponent(cat.slug)}&pet_type=Cat`}
                              onClick={onClose}
                              className="block text-xs text-text-muted hover:text-accent py-1 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Pharmacy & Clinical Care Accordion */}
                  <div className="border-b border-secondary/30">
                    <button
                      type="button"
                      onClick={() => toggleSection('pharmacy')}
                      aria-expanded={expandedSection === 'pharmacy'}
                      aria-controls="mobile-nav-section-pharmacy"
                      className="w-full flex items-center justify-between py-2 text-text font-semibold text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <span className="p-0.5 rounded bg-brand-blue/10 text-brand-blue">
                          <Pill size={13} style={{ color: 'var(--color-brand-blue)' }} />
                        </span>
                        Pharmacy & Clinical Care
                      </span>
                      <ChevronDown
                        size={15}
                        className="text-text-muted"
                        style={{
                          transform: expandedSection === 'pharmacy' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'pharmacy' && (
                        <motion.div
                          id="mobile-nav-section-pharmacy"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {pharmacyCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${encodeURIComponent(cat.slug)}&special=pharmacy`}
                              onClick={onClose}
                              className="block text-xs text-text-muted hover:text-accent py-1 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 4. General Care Accordion (Both Dogs & Cats) */}
                  {categories.both && categories.both.length > 0 && (
                    <div className="border-b border-secondary/30">
                      <button
                        type="button"
                        onClick={() => toggleSection('both')}
                        aria-expanded={expandedSection === 'both'}
                        aria-controls="mobile-nav-section-both"
                        className="w-full flex items-center justify-between py-2 text-text font-semibold text-xs"
                      >
                        <span className="flex items-center gap-2">🐾 General Pet Care</span>
                        <ChevronDown
                          size={15}
                          className="text-text-muted"
                          style={{
                            transform: expandedSection === 'both' ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedSection === 'both' && (
                          <motion.div
                            id="mobile-nav-section-both"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="pl-4 pb-2 space-y-1 overflow-hidden"
                          >
                            {categories.both.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                                onClick={onClose}
                                className="block text-xs text-text-muted hover:text-accent py-1 transition-colors"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <Link
                  href="/orders"
                  onClick={onClose}
                  className="block font-heading font-semibold text-sm text-text hover:text-accent py-2 border-b border-secondary/30"
                >
                  Shopping History & Orders
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 font-heading font-semibold text-sm text-accent py-2 border-b border-secondary/30"
                  >
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-secondary-alt/30 bg-secondary/20 space-y-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm font-bold shadow-md"
              >
                <ShoppingBag size={18} /> View Cart ({totalItems} items)
              </Link>
              {user && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-outline btn-danger w-full flex items-center justify-center gap-2 text-xs font-semibold text-error hover:bg-error-light"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
