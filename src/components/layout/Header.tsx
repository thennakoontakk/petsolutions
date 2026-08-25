'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Phone, Menu, ChevronDown, LayoutGrid, Sparkles, Shield, Pill, ArrowRight, Activity, Bone, Box } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import CartDrawer from '../cart/CartDrawer';
import ProfileDrawer from './ProfileDrawer';
import MobileNav from './MobileNav';
import { createBrowserClient } from '@/lib/supabase/client';

export default function Header() {
  const { totalItems } = useCart();
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
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
      <div className="w-full bg-white border-b border-secondary/40 z-40 relative">

        {/* 2. MIDDLE BRANDING & ACTIONS BAR */}
        <div className="container mx-auto px-4 header-middle-bar">
          {/* Logo & Mobile Menu wrapper */}
          <div className="flex items-center gap-1.5 header-logo-wrapper" style={{ gridColumn: 1 }}>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="btn btn-icon btn-ghost p-1.5 desktop-hidden"
              aria-label="Open navigation menu"
              style={{ color: 'var(--color-text)', padding: '6px' }}
            >
              <Menu size={22} />
            </button>
            <Link href="/" className="header-logo text-text hover:text-accent transition-colors" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Image 
                src="/logo-icon.png" 
                width={56} 
                height={56} 
                alt="PetSolutions Icon" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                priority
              />
              <Image 
                src="/logo-text.png" 
                width={120} 
                height={32} 
                alt="PetSolutions.lk" 
                className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                priority
              />
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
            <button
              onClick={() => setIsProfileDrawerOpen(true)}
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
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full text-text hover:text-accent hover:bg-secondary/40 transition-colors relative flex items-center justify-center"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag size={26} />
                {totalItems > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-8px',
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--white)',
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
                  </span>
                )}
              </div>
            </button>
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
          <nav className="container mx-auto px-4 flex items-center gap-1 py-1">
            
            {/* 1. All Categories (Mega Menu Trigger) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('all')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'all' ? null : 'all')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 category-nav-link text-xs font-bold transition-all ${
                  activeDropdown === 'all'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <LayoutGrid size={15} />
                <span>All Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'all' ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === 'all' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-[720px] bg-white rounded-2xl shadow-2xl border border-secondary-alt/40 p-6 z-50 glass-strong"
                  >
                    {/* Top Pet Filters Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-secondary/50">
                      <div>
                        <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-text flex items-center gap-1.5">
                          <LayoutGrid size={14} className="text-accent" />
                          <span>Shop by Category</span>
                        </h4>
                        <p className="text-[11px] text-text-muted mt-0.5">Explore our complete catalog of authorized veterinary pet essentials</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/products?pet_type=Dog"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="px-2.5 py-1 bg-secondary/60 hover:bg-accent hover:text-white rounded-lg text-[11px] font-bold text-text transition-colors"
                        >
                          🐶 Dogs Only
                        </Link>
                        <Link
                          href="/products?pet_type=Cat"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="px-2.5 py-1 bg-secondary/60 hover:bg-accent hover:text-white rounded-lg text-[11px] font-bold text-text transition-colors"
                        >
                          🐱 Cats Only
                        </Link>
                      </div>
                    </div>

                    {/* Uniform Categories Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {unifiedCategories.map((c) => {
                        const Icon = c.icon;
                        return (
                          <Link
                            key={`mega-item-${c.slug}`}
                            href={`/products?category=${c.slug}`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary/40 border border-transparent hover:border-secondary-alt/30 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary/60 text-accent group-hover:bg-accent group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 shadow-xs">
                              <Icon size={16} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate">{c.name}</p>
                              <p className="text-[10px] text-text-muted truncate mt-0.5">{c.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-secondary/40 flex items-center justify-between">
                      <p className="text-[11px] text-text-muted">
                        Direct islandwide delivery across Sri Lanka
                      </p>
                      <Link
                        href="/products"
                        onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                        className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5"
                      >
                        <span>Browse Complete Store Catalog</span>
                        <ArrowRight size={13} />
                      </Link>
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
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 category-nav-link text-xs font-bold transition-all ${
                  activeDropdown === 'dog'
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>🐶 Dogs</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'dog' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'dog' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-3 z-50 glass-strong"
                  >
                    <div className="px-3 py-1.5 mb-1.5 border-b border-secondary/30 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">For Dogs</span>
                      <span className="text-[10px] font-semibold text-accent">6 Categories</span>
                    </div>

                    <div className="space-y-1">
                      {unifiedCategories.map((c) => {
                        const Icon = c.icon;
                        return (
                          <Link
                            key={`dog-item-${c.slug}`}
                            href={`/products?category=${c.slug}&pet_type=Dog`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs text-text hover:text-accent hover:bg-secondary/40 rounded-xl transition-all font-medium group"
                          >
                            <div className="p-1 bg-secondary/50 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
                              <Icon size={14} />
                            </div>
                            <span className="truncate">{c.name}</span>
                          </Link>
                        );
                      })}
                      
                      <div className="pt-2 mt-2 border-t border-secondary/30">
                        <Link
                          href="/products?pet_type=Dog"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="flex items-center justify-between px-3 py-2 text-xs font-bold text-accent hover:bg-accent/10 rounded-xl transition-colors"
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
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 category-nav-link text-xs font-bold transition-all ${
                  activeDropdown === 'cat'
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>🐱 Cats</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'cat' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'cat' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-3 z-50 glass-strong"
                  >
                    <div className="px-3 py-1.5 mb-1.5 border-b border-secondary/30 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">For Cats</span>
                      <span className="text-[10px] font-semibold text-accent">6 Categories</span>
                    </div>

                    <div className="space-y-1">
                      {unifiedCategories.map((c) => {
                        const Icon = c.icon;
                        return (
                          <Link
                            key={`cat-item-${c.slug}`}
                            href={`/products?category=${c.slug}&pet_type=Cat`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs text-text hover:text-accent hover:bg-secondary/40 rounded-xl transition-all font-medium group"
                          >
                            <div className="p-1 bg-secondary/50 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
                              <Icon size={14} />
                            </div>
                            <span className="truncate">{c.name}</span>
                          </Link>
                        );
                      })}
                      
                      <div className="pt-2 mt-2 border-t border-secondary/30">
                        <Link
                          href="/products?pet_type=Cat"
                          onClick={() => { setCurrentCategory(null); closeDropdown(); }}
                          className="flex items-center justify-between px-3 py-2 text-xs font-bold text-accent hover:bg-accent/10 rounded-xl transition-colors"
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
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 category-nav-link text-xs font-bold transition-all ${
                  activeDropdown === 'pharmacy'
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:bg-secondary/60 hover:text-accent'
                }`}
              >
                <span>💊 Pharmacy & Care</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'pharmacy' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'pharmacy' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-secondary-alt/40 p-3 z-50 glass-strong"
                  >
                    <div className="px-3 py-1.5 mb-1.5 border-b border-secondary/30 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Clinical Care</span>
                      <span className="text-[10px] font-semibold text-accent">Authorized</span>
                    </div>

                    <div className="space-y-1">
                      {pharmacyCategories.map((c) => {
                        const Icon = c.icon;
                        return (
                          <Link
                            key={`pharm-item-${c.slug}`}
                            href={`/products?category=${c.slug}`}
                            onClick={() => { setCurrentCategory(c.slug); closeDropdown(); }}
                            className="flex items-start gap-2.5 px-3 py-2 text-text hover:text-accent hover:bg-secondary/40 rounded-xl transition-all group"
                          >
                            <div className="p-1.5 bg-secondary/50 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors mt-0.5 flex-shrink-0">
                              <Icon size={14} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-text group-hover:text-accent transition-colors truncate">{c.name}</p>
                              <p className="text-[10px] text-text-muted truncate">{c.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Quick Links */}
            <div className="h-4 w-px bg-secondary-alt/40 mx-1" />

            <Link
              href="/products?category=dry-wet-pet-food"
              onClick={() => setCurrentCategory('dry-wet-pet-food')}
              className={`px-3 py-2 rounded-lg category-nav-link text-xs font-semibold transition-all hover:bg-secondary/60 hover:text-accent ${
                currentCategory === 'dry-wet-pet-food' ? 'text-accent font-bold bg-secondary/60' : 'text-text'
              }`}
            >
              Pet Food
            </Link>

            <Link
              href="/products?category=medicated-shampoos-grooming"
              onClick={() => setCurrentCategory('medicated-shampoos-grooming')}
              className={`px-3 py-2 rounded-lg category-nav-link text-xs font-semibold transition-all hover:bg-secondary/60 hover:text-accent ${
                currentCategory === 'medicated-shampoos-grooming' ? 'text-accent font-bold bg-secondary/60' : 'text-text'
              }`}
            >
              Shampoos & Grooming
            </Link>

            <Link
              href="/products?category=cat-litter-hygiene"
              onClick={() => setCurrentCategory('cat-litter-hygiene')}
              className={`px-3 py-2 rounded-lg category-nav-link text-xs font-semibold transition-all hover:bg-secondary/60 hover:text-accent ${
                currentCategory === 'cat-litter-hygiene' ? 'text-accent font-bold bg-secondary/60' : 'text-text'
              }`}
            >
              Cat Litter
            </Link>

            {/* Explore / Shop All */}
            <div className="ml-auto flex items-center">
              <Link
                href="/products"
                onClick={() => setCurrentCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pathname === '/products' && !currentCategory && !searchQuery
                    ? 'bg-accent text-white shadow-xs'
                    : 'bg-white border border-secondary-alt/40 text-text hover:border-accent hover:text-accent'
                }`}
              >
                <span>Browse All</span>
                <ArrowRight size={12} />
              </Link>
            </div>

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
        }}
      />
    </>
  );
}
