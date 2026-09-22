'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Phone, Menu, ChevronDown, LayoutGrid, Sparkles, Shield, Pill, ArrowRight, Activity, Bone, Box, X } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import CartDrawer from '../cart/CartDrawer';
import ProfileDrawer from './ProfileDrawer';
import MobileNav from './MobileNav';
import UtilityBar from './UtilityBar';
import { createBrowserClient } from '@/lib/supabase/client';

export default function Header() {
  const { totalItems } = useCart();
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Scroll-triggered header styling
  const [isScrolled, setIsScrolled] = useState(false);

  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState({
    tagline: { value: 'Premium Pet Store', is_enabled: true },
    hotline: { value: '+94 77 123 4567', is_enabled: true },
  });
  
  const [rawCategories, setRawCategories] = useState<Array<{ name: string; slug: string }>>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  
  // Master Uniform Categories List (Consistent across all dropdowns)
  const masterCategoryList = [
    { name: 'Dry & Wet Pet Food', slug: 'dry-wet-pet-food', icon: Bone, desc: 'Premium kibbles, gravies & cans' },
    { name: 'Cat Litter & Hygiene', slug: 'cat-litter-hygiene', icon: Box, desc: 'Odor control litters & scoops' },
    { name: 'Parasite & Tick Control', slug: 'parasite-tick-control', icon: Shield, desc: 'Spot-on, sprays & collars' },
    { name: 'Medicated Shampoos & Grooming', slug: 'medicated-shampoos-grooming', icon: Sparkles, desc: 'Antifungal, antibacterial & washes' },
    { name: 'Health & Supplements', slug: 'health-supplements', icon: Pill, desc: 'Vitamins, tonics & immune care' },
    { name: 'Wound Care & Topical Pharmacy', slug: 'wound-care-topical-pharmacy', icon: Activity, desc: 'Sprays, antiseptics & ointments' },
  ];

  // Dynamic category list combining DB categories if present
  const unifiedCategories = rawCategories.length > 0
    ? rawCategories.map((rc) => {
        const matching = masterCategoryList.find((m) => m.slug === rc.slug);
        return {
          name: rc.name,
          slug: rc.slug,
          icon: matching?.icon || Sparkles,
          desc: matching?.desc || 'Authorized pet care essentials',
        };
      })
    : masterCategoryList;

  const pharmacyCategories = [
    { name: 'Parasite & Tick Control', slug: 'parasite-tick-control', icon: Shield, desc: 'Flea, tick and mite defense' },
    { name: 'Wound Care & Topical Pharmacy', slug: 'wound-care-topical-pharmacy', icon: Activity, desc: 'Sprays, antiseptics & healing ointments' },
    { name: 'Medicated Shampoos & Grooming', slug: 'medicated-shampoos-grooming', icon: Sparkles, desc: 'Antifungal & antibacterial washes' },
    { name: 'Health & Supplements', slug: 'health-supplements', icon: Pill, desc: 'Vitamins, syrups & joint care' },
  ];

  // Fetch settings & categories for the header
  useEffect(() => {
    async function fetchHeaderData() {
      try {
        const supabase = createBrowserClient();
        
        // Fetch store settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('store_settings')
          .select('*');
          
        if (!settingsError && settingsData) {
          const newSettings = { ...settings };
          settingsData.forEach((item: any) => {
            if (item.key in newSettings) {
              newSettings[item.key as keyof typeof newSettings] = {
                value: item.value,
                is_enabled: item.is_enabled,
              };
            }
          });
          setSettings(newSettings);
        }

        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('name, slug, parent_category, display_order')
          .order('display_order', { ascending: true });
          
        if (!catError && catData) {
          setRawCategories(catData.map((item: any) => ({ name: item.name, slug: item.slug })));
        }
      } catch (err) {
        console.error('Error fetching header details:', err);
      }
    }
    fetchHeaderData();
  }, []);

  // Scroll listener — triggers header blur/shadow after 10px
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync search input with URL search parameter and handle auto-focus
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('search') || '');
      setCurrentCategory(params.get('category'));
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);

    // Auto-focus search input if search query is present on catalog page
    if (pathname === '/products') {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      if (search) {
        const inputEl = document.querySelector('.header-search-input') as HTMLInputElement;
        if (inputEl) {
          inputEl.focus();
          const len = inputEl.value.length;
          inputEl.setSelectionRange(len, len);
        }
      }
    }

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const menuItems = [
    { name: 'All Products', path: '/products', slug: '' },
    ...(rawCategories.length > 0
      ? rawCategories.map((c) => ({
          name: c.name,
          path: `/products?category=${encodeURIComponent(c.slug)}`,
          slug: c.slug,
        }))
      : [
          { name: 'Dog Food', path: '/products?category=dog-food-dry', slug: 'dog-food-dry' },
          { name: 'Cat Food', path: '/products?category=cat-food-dry', slug: 'cat-food-dry' },
          { name: 'Tick & Flea', path: '/products?category=tick-flea-treatment', slug: 'tick-flea-treatment' },
          { name: 'Cat Litter', path: '/products?category=cat-litter', slug: 'cat-litter' },
          { name: 'Shampoo & Grooming', path: '/products?category=shampoo-grooming', slug: 'shampoo-grooming' },
          { name: 'Supplements', path: '/products?category=vitamins-supplements', slug: 'vitamins-supplements' },
        ]),
  ];

  const [activeDropdown, setActiveDropdown] = useState<'all' | 'dog' | 'cat' | 'pharmacy' | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'all' | 'dog' | 'cat' | 'pharmacy') => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
    setDropdownTimeout(timer);
  };

  const closeDropdown = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setActiveDropdown(null);
  };

  return (
    <>
      <div
        className={`w-full z-40 relative transition-all duration-[280ms] ${
          isScrolled
            ? 'sticky top-0 bg-white/92 backdrop-blur-md border-b border-secondary/40 header-scrolled'
            : 'bg-white border-b border-secondary/40'
        }`}
        style={{ willChange: 'box-shadow, background-color' }}
      >

        {/* 1. TOP ANNOUNCEMENT RIBBON BANNER (Contained 4s Cycling Pills) */}
        <UtilityBar />

        {/* 2. MIDDLE BRANDING & ACTIONS BAR */}
        <div className="container mx-auto px-4 header-middle-bar">
          {/* Logo & Mobile Menu wrapper */}
          <div className="flex items-center gap-1.5 header-logo-wrapper min-w-0 flex-shrink" style={{ gridColumn: 1 }}>
            <motion.button
              onClick={() => setIsMobileNavOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              className="btn btn-icon btn-ghost p-1.5 desktop-hidden flex-shrink-0"
              aria-label="Open navigation menu"
              style={{ color: 'var(--color-text)', padding: '6px' }}
            >
              <Menu size={22} />
            </motion.button>
            <Link 
              href="/" 
              className="header-logo text-text hover:text-accent transition-colors min-w-0 flex-shrink" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Image 
                src="/logo-icon.png" 
                width={46} 
                height={46} 
                alt="PetSolutions Icon" 
                className="header-logo-icon object-contain flex-shrink-0"
                style={{ maxWidth: '46px', maxHeight: '46px' }}
                priority
              />
              {/* Full wordmark image on tablet and desktop (>=640px) */}
              <Image 
                src="/logo-text.png" 
                width={220} 
                height={55} 
                alt="PetSolutions.lk" 
                className="hidden sm:inline-block h-8 sm:h-9 md:h-10 w-auto object-contain flex-shrink-0"
                style={{ width: 'auto', maxWidth: '220px' }}
                priority
              />
              {/* Responsive compact typography on mobile (<640px) for zero 390px collision */}
              <span className="inline-block sm:hidden font-heading font-extrabold text-base text-text tracking-tight truncate min-w-0">
                PetSolutions<span style={{ color: 'var(--color-brand-blue)' }}>.lk</span>
              </span>
            </Link>
          </div>

          {/* User actions */}
          <div className="header-actions">
            {/* Phone Info */}
            {settings.hotline.is_enabled && (
              <div className="hidden lg:flex items-center gap-2">
                <div className="p-2 bg-accent/10 text-accent rounded-full">
                  <Phone size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-text-muted uppercase leading-none">Order Hotline</p>
                  <p className="text-xs font-bold text-text mt-0.5">{settings.hotline.value}</p>
                </div>
              </div>
            )}

            {/* Profile Drawer Button */}
            <motion.button
              onClick={() => setIsProfileDrawerOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-2 rounded-full text-text hover:text-accent hover:bg-secondary/40 transition-colors flex items-center justify-center relative"
              aria-label="User Account"
              title={user ? (profile?.full_name || 'My Account') : 'Account'}
            >
              <User size={26} />
              {user && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success)',
                    border: '1.5px solid var(--white)',
                  }}
                />
              )}
            </motion.button>

            {/* Cart Button */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-2 rounded-full text-text hover:text-accent hover:bg-secondary/40 transition-colors relative flex items-center justify-center"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag size={26} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-8px',
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-text)',
                        fontWeight: 800,
                        fontSize: '10px',
                        minWidth: '18px',
                        height: '18px',
                        padding: '0 3px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--white)',
                        zIndex: 10,
                        lineHeight: 1,
                      }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <input
              type="text"
              placeholder="Search for dog food, cat litter, vitamins, shampoo..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                
                const params = new URLSearchParams(window.location.search);
                if (val.trim()) {
                  params.set('search', val);
                } else {
                  params.delete('search');
                }
                
                if (pathname === '/products') {
                  router.replace(`/products?${params.toString()}`, { scroll: false });
                } else {
                  router.push(`/products?${params.toString()}`);
                }
              }}
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* 3. CATEGORY NAVIGATION BAR (Hidden on mobile) */}
        <div className="w-full bg-secondary-alt/15 border-t border-secondary/40 mobile-hidden relative">
          <nav className="container mx-auto px-4 flex items-center justify-between py-2 flex-wrap">
            
            {/* 1. All Categories (Mega Menu Trigger) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('all')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'all' ? null : 'all')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 category-nav-link text-[19px] lg:text-[20px] font-bold transition-all ${
                  activeDropdown === 'all'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>All Categories</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === 'all' ? 'rotate-180' : ''}`} />
              </button>

              {/* All Categories Dropdown Menu (Matches exact size & layout of other hover cards) */}
              <AnimatePresence>
                {activeDropdown === 'all' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-80 max-w-[95vw] bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-4 z-50 glass-strong"
                    style={{ width: '20rem', maxWidth: '95vw' }}
                  >
                    {/* Top Header */}
                    <div className="pb-2.5 mb-2.5 border-b border-secondary/40">
                      <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-text">
                        Shop by Category
                      </h4>
                      <p className="text-[11px] text-text-muted mt-0.5">Explore our complete catalog of veterinary essentials</p>
                    </div>

                    {/* Categories List */}
                    <div className="space-y-1">
                      {unifiedCategories.map((c) => (
                        <Link
                          key={`mega-item-${c.slug}`}
                          href={`/products?category=${c.slug}`}
                          onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                          className="p-2 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-secondary-alt/30 transition-all group block"
                        >
                          <p className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate">{c.name}</p>
                          <p className="text-[10px] text-text-muted truncate mt-0.5">{c.desc}</p>
                        </Link>
                      ))}

                      {/* Bottom Action Footer */}
                      <div className="pt-2.5 mt-2.5 border-t border-secondary/40 w-full">
                        <Link
                          href="/products"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between w-full py-1"
                        >
                          <span>Browse Complete Store Catalog</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Dogs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('dog')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'dog' ? null : 'dog')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 category-nav-link text-[19px] lg:text-[20px] font-bold transition-all ${
                  activeDropdown === 'dog'
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>Dogs</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === 'dog' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'dog' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-80 max-w-[95vw] bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-4 z-50 glass-strong"
                  >
                    <div className="pb-2.5 mb-2.5 border-b border-secondary/40">
                      <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-text">For Dogs</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">Explore dog nutrition and healthcare</p>
                    </div>

                    <div className="space-y-1">
                      {unifiedCategories.map((c) => {
                        return (
                          <Link
                            key={`dog-item-${c.slug}`}
                            href={`/products?category=${c.slug}&pet_type=Dog`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="p-2 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-secondary-alt/30 transition-all group block"
                          >
                            <p className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate">{c.name}</p>
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{c.desc}</p>
                          </Link>
                        );
                      })}
                      
                      <div className="pt-2.5 mt-2.5 border-t border-secondary/40 w-full">
                        <Link
                          href="/products?pet_type=Dog"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between w-full py-1"
                        >
                          <span>View All Dog Products</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Cats Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('cat')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'cat' ? null : 'cat')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 category-nav-link text-[19px] lg:text-[20px] font-bold transition-all ${
                  activeDropdown === 'cat'
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>Cats</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === 'cat' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'cat' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-80 max-w-[95vw] bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-4 z-50 glass-strong"
                  >
                    <div className="pb-2.5 mb-2.5 border-b border-secondary/40">
                      <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-text">For Cats</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">Explore cat food, litter and hygiene</p>
                    </div>

                    <div className="space-y-1">
                      {unifiedCategories.map((c) => {
                        return (
                          <Link
                            key={`cat-item-${c.slug}`}
                            href={`/products?category=${c.slug}&pet_type=Cat`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="p-2 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-secondary-alt/30 transition-all group block"
                          >
                            <p className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate">{c.name}</p>
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{c.desc}</p>
                          </Link>
                        );
                      })}
                      
                      <div className="pt-2.5 mt-2.5 border-t border-secondary/40 w-full">
                        <Link
                          href="/products?pet_type=Cat"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between w-full py-1"
                        >
                          <span>View All Cat Products</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Pharmacy & Care Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('pharmacy')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'pharmacy' ? null : 'pharmacy')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 category-nav-link text-[19px] lg:text-[20px] font-bold transition-all ${
                  activeDropdown === 'pharmacy'
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>Pharmacy & Care</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === 'pharmacy' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'pharmacy' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-80 max-w-[95vw] bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-4 z-50 glass-strong"
                  >
                    <div className="pb-2.5 mb-2.5 border-b border-secondary/40">
                      <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-text">Clinical Care & Pharmacy</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">Authorized veterinary supplies & treatments</p>
                    </div>

                    <div className="space-y-1">
                      {pharmacyCategories.map((c) => {
                        return (
                          <Link
                            key={`pharm-item-${c.slug}`}
                            href={`/products?category=${c.slug}`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="p-2 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-secondary-alt/30 transition-all group block"
                          >
                            <p className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate">{c.name}</p>
                            <p className="text-[10px] text-text-muted truncate mt-0.5">{c.desc}</p>
                          </Link>
                        );
                      })}

                      <div className="pt-2.5 mt-2.5 border-t border-secondary/40 w-full">
                        <Link
                          href="/products"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="text-xs font-bold text-accent hover:underline flex items-center justify-between w-full py-1"
                        >
                          <span>Browse All Care Products</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Quick Links */}
            <Link
              href="/products?category=dry-wet-pet-food"
              onClick={() => setCurrentCategory('dry-wet-pet-food')}
              className={`px-3 py-1.5 rounded-lg category-nav-link text-[19px] lg:text-[20px] font-bold transition-all hover:bg-secondary/60 hover:text-accent ${
                currentCategory === 'dry-wet-pet-food' ? 'text-accent font-bold bg-secondary/60' : 'text-text'
              }`}
            >
              Pet Food
            </Link>

            <Link
              href="/products?category=medicated-shampoos-grooming"
              onClick={() => setCurrentCategory('medicated-shampoos-grooming')}
              className={`px-3 py-1.5 rounded-lg category-nav-link text-[19px] lg:text-[20px] font-bold transition-all hover:bg-secondary/60 hover:text-accent ${
                currentCategory === 'medicated-shampoos-grooming' ? 'text-accent font-bold bg-secondary/60' : 'text-text'
              }`}
            >
              Shampoos & Grooming
            </Link>

            <Link
              href="/products?category=cat-litter-hygiene"
              onClick={() => setCurrentCategory('cat-litter-hygiene')}
              className={`px-3 py-1.5 rounded-lg category-nav-link text-[19px] lg:text-[20px] font-bold transition-all hover:bg-secondary/60 hover:text-accent ${
                currentCategory === 'cat-litter-hygiene' ? 'text-accent font-bold bg-secondary/60' : 'text-text'
              }`}
            >
              Cat Litter
            </Link>

            {/* Explore / Shop All */}
            <Link
              href="/products"
              onClick={() => setCurrentCategory(null)}
              className={`px-4 py-1.5 rounded-full text-[17px] lg:text-[18px] font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/products' && !currentCategory && !searchQuery
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-white border border-secondary-alt/40 text-text hover:border-accent hover:text-accent'
              }`}
            >
              <span>Browse All</span>
              <ArrowRight size={15} />
            </Link>

          </nav>
        </div>

      </div>

      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)} 
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Mobile Nav Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        categories={{
          dog: unifiedCategories.map((c) => ({ name: c.name, slug: c.slug })),
          cat: unifiedCategories.map((c) => ({ name: c.name, slug: c.slug })),
          both: unifiedCategories.map((c) => ({ name: c.name, slug: c.slug })),
          pharmacy: pharmacyCategories.map((c) => ({ name: c.name, slug: c.slug })),
        }}
      />
    </>
  );
}
