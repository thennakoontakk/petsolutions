'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ArrowRight } from 'lucide-react';

interface CategoryItem {
  name: string;
  slug: string;
  desc?: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory?: string | null;
  pathname?: string;
  categories: {
    all?: CategoryItem[];
    dog: CategoryItem[];
    cat: CategoryItem[];
    pharmacy?: CategoryItem[];
  };
}

const DEFAULT_PHARMACY_CATEGORIES: CategoryItem[] = [
  { name: 'Parasite & Tick Control', slug: 'parasite-tick-control', desc: 'Flea, tick and mite defense' },
  { name: 'Wound Care & Topical Pharmacy', slug: 'wound-care-topical-pharmacy', desc: 'Sprays, antiseptics & healing ointments' },
  { name: 'Medicated Shampoos & Grooming', slug: 'medicated-shampoos-grooming', desc: 'Antifungal & antibacterial washes' },
  { name: 'Health & Supplements', slug: 'health-supplements', desc: 'Vitamins, syrups & joint care' },
];

export default function MobileNav({ 
  isOpen, 
  onClose, 
  currentCategory, 
  pathname, 
  categories 
}: MobileNavProps) {
  const [expandedSection, setExpandedSection] = useState<'all' | 'dog' | 'cat' | 'pharmacy' | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleSection = (section: 'all' | 'dog' | 'cat' | 'pharmacy') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const allCategories = categories.all && categories.all.length > 0 
    ? categories.all 
    : categories.dog;

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

          {/* Drawer matching desktop nav styling and brand colors */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
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
                  width={38} 
                  height={38} 
                  alt="PetSolutions Icon" 
                  className="w-9 h-9 object-contain"
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

            {/* Nav content: mirrors Desktop Category Navigation Bar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              
              {/* 1. All Categories Accordion */}
              <div className="border-b border-secondary/30 pb-1">
                <button
                  type="button"
                  onClick={() => toggleSection('all')}
                  aria-expanded={expandedSection === 'all'}
                  className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                    expandedSection === 'all'
                      ? 'text-accent bg-secondary/50'
                      : 'text-text hover:bg-secondary/30 hover:text-accent'
                  }`}
                >
                  <span>All Categories</span>
                  <ChevronDown
                    size={17}
                    className="text-text-muted transition-transform duration-200"
                    style={{
                      transform: expandedSection === 'all' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'all' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="pl-3 pr-1 py-1 space-y-1 overflow-hidden"
                    >
                      {allCategories.map((cat) => (
                        <Link
                          key={`all-${cat.slug}`}
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          onClick={onClose}
                          className="block p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                        >
                          <p className="text-xs font-bold text-text hover:text-accent transition-colors truncate">
                            {cat.name}
                          </p>
                          {cat.desc && (
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{cat.desc}</p>
                          )}
                        </Link>
                      ))}

                      <div className="pt-2 mt-1 border-t border-secondary/30">
                        <Link
                          href="/products"
                          onClick={onClose}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between p-2"
                        >
                          <span>Browse Complete Store Catalog</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Dogs Accordion */}
              <div className="border-b border-secondary/30 pb-1">
                <button
                  type="button"
                  onClick={() => toggleSection('dog')}
                  aria-expanded={expandedSection === 'dog'}
                  className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                    expandedSection === 'dog'
                      ? 'text-accent bg-secondary/50'
                      : 'text-text hover:bg-secondary/30 hover:text-accent'
                  }`}
                >
                  <span>Dogs</span>
                  <ChevronDown
                    size={17}
                    className="text-text-muted transition-transform duration-200"
                    style={{
                      transform: expandedSection === 'dog' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'dog' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="pl-3 pr-1 py-1 space-y-1 overflow-hidden"
                    >
                      {categories.dog.map((cat) => (
                        <Link
                          key={`dog-${cat.slug}`}
                          href={`/products?category=${encodeURIComponent(cat.slug)}&pet_type=Dog`}
                          onClick={onClose}
                          className="block p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                        >
                          <p className="text-xs font-bold text-text hover:text-accent transition-colors truncate">
                            {cat.name}
                          </p>
                          {cat.desc && (
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{cat.desc}</p>
                          )}
                        </Link>
                      ))}

                      <div className="pt-2 mt-1 border-t border-secondary/30">
                        <Link
                          href="/products?pet_type=Dog"
                          onClick={onClose}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between p-2"
                        >
                          <span>View All Dog Products</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Cats Accordion */}
              <div className="border-b border-secondary/30 pb-1">
                <button
                  type="button"
                  onClick={() => toggleSection('cat')}
                  aria-expanded={expandedSection === 'cat'}
                  className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                    expandedSection === 'cat'
                      ? 'text-accent bg-secondary/50'
                      : 'text-text hover:bg-secondary/30 hover:text-accent'
                  }`}
                >
                  <span>Cats</span>
                  <ChevronDown
                    size={17}
                    className="text-text-muted transition-transform duration-200"
                    style={{
                      transform: expandedSection === 'cat' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'cat' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="pl-3 pr-1 py-1 space-y-1 overflow-hidden"
                    >
                      {categories.cat.map((cat) => (
                        <Link
                          key={`cat-${cat.slug}`}
                          href={`/products?category=${encodeURIComponent(cat.slug)}&pet_type=Cat`}
                          onClick={onClose}
                          className="block p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                        >
                          <p className="text-xs font-bold text-text hover:text-accent transition-colors truncate">
                            {cat.name}
                          </p>
                          {cat.desc && (
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{cat.desc}</p>
                          )}
                        </Link>
                      ))}

                      <div className="pt-2 mt-1 border-t border-secondary/30">
                        <Link
                          href="/products?pet_type=Cat"
                          onClick={onClose}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between p-2"
                        >
                          <span>View All Cat Products</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Pharmacy & Care Accordion */}
              <div className="border-b border-secondary/30 pb-1">
                <button
                  type="button"
                  onClick={() => toggleSection('pharmacy')}
                  aria-expanded={expandedSection === 'pharmacy'}
                  className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                    expandedSection === 'pharmacy'
                      ? 'text-accent bg-secondary/50'
                      : 'text-text hover:bg-secondary/30 hover:text-accent'
                  }`}
                >
                  <span>Pharmacy & Care</span>
                  <ChevronDown
                    size={17}
                    className="text-text-muted transition-transform duration-200"
                    style={{
                      transform: expandedSection === 'pharmacy' ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'pharmacy' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="pl-3 pr-1 py-1 space-y-1 overflow-hidden"
                    >
                      {pharmacyCategories.map((cat) => (
                        <Link
                          key={`pharm-${cat.slug}`}
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          onClick={onClose}
                          className="block p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                        >
                          <p className="text-xs font-bold text-text hover:text-accent transition-colors truncate">
                            {cat.name}
                          </p>
                          {cat.desc && (
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{cat.desc}</p>
                          )}
                        </Link>
                      ))}

                      <div className="pt-2 mt-1 border-t border-secondary/30">
                        <Link
                          href="/products"
                          onClick={onClose}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between p-2"
                        >
                          <span>Browse All Care Products</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. Pet Food Direct Link */}
              <Link
                href="/products?category=dry-wet-pet-food"
                onClick={onClose}
                className={`block py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                  currentCategory === 'dry-wet-pet-food'
                    ? 'text-accent bg-secondary/50'
                    : 'text-text hover:bg-secondary/30 hover:text-accent'
                }`}
              >
                Pet Food
              </Link>

              {/* 6. Shampoos & Grooming Direct Link */}
              <Link
                href="/products?category=medicated-shampoos-grooming"
                onClick={onClose}
                className={`block py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                  currentCategory === 'medicated-shampoos-grooming'
                    ? 'text-accent bg-secondary/50'
                    : 'text-text hover:bg-secondary/30 hover:text-accent'
                }`}
              >
                Shampoos & Grooming
              </Link>

              {/* 7. Cat Litter Direct Link */}
              <Link
                href="/products?category=cat-litter-hygiene"
                onClick={onClose}
                className={`block py-2.5 px-2 rounded-xl text-base font-bold transition-all ${
                  currentCategory === 'cat-litter-hygiene'
                    ? 'text-accent bg-secondary/50'
                    : 'text-text hover:bg-secondary/30 hover:text-accent'
                }`}
              >
                Cat Litter
              </Link>

              {/* 8. Browse All Link */}
              <div className="pt-3">
                <Link
                  href="/products"
                  onClick={onClose}
                  className={`w-full py-2.5 px-4 rounded-xl text-base font-bold transition-all flex items-center justify-between ${
                    pathname === '/products' && !currentCategory
                      ? 'bg-accent text-white shadow-xs'
                      : 'bg-white border border-secondary-alt/40 text-text hover:border-accent hover:text-accent'
                  }`}
                >
                  <span>Browse All</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
