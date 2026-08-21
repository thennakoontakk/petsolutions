'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Phone, Menu } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import CartDrawer from '../cart/CartDrawer';
import ProfileDrawer from './ProfileDrawer';
import MobileNav from './MobileNav';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Offer } from '@/lib/types';

export default function Header() {
  const { totalItems } = useCart();
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showPromo, setShowPromo] = useState(true);
  const [settings, setSettings] = useState({
    promo_text: { value: '✨ Free Delivery on orders over Rs. 5,000!   |   🐾 100% Genuine Pet Care Products', is_enabled: true },
    tagline: { value: 'Premium Pet Store', is_enabled: true },
    hotline: { value: '+94 77 123 4567', is_enabled: true },
  });
  
  const [categories, setCategories] = useState<{
    dog: Array<{ name: string; slug: string }>;
    cat: Array<{ name: string; slug: string }>;
    both: Array<{ name: string; slug: string }>;
  }>({
    dog: [
      { name: 'Dry & Wet Pet Food', slug: 'dry-wet-pet-food' },
      { name: 'Parasite & Tick Control', slug: 'parasite-tick-control' },
      { name: 'Medicated Shampoos', slug: 'medicated-shampoos-grooming' },
      { name: 'Health & Supplements', slug: 'health-supplements' },
    ],
    cat: [
      { name: 'Dry & Wet Pet Food', slug: 'dry-wet-pet-food' },
      { name: 'Cat Litter & Hygiene', slug: 'cat-litter-hygiene' },
      { name: 'Parasite & Tick Control', slug: 'parasite-tick-control' },
    ],
    both: [
      { name: 'Wound Care & Pharmacy', slug: 'wound-care-topical-pharmacy' },
      { name: 'Medicated Shampoos', slug: 'medicated-shampoos-grooming' },
    ]
  });

  // Fetch settings & active offers/promos for the header
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
          .select('name, slug, parent_category')
          .order('display_order', { ascending: true });
          
        if (!catError && catData) {
          const dogList: any[] = [];
          const catList: any[] = [];
          const bothList: any[] = [];
          
          catData.forEach((item: any) => {
            const formattedItem = { name: item.name, slug: item.slug };
            if (item.parent_category === 'Dog') {
              dogList.push(formattedItem);
            } else if (item.parent_category === 'Cat') {
              catList.push(formattedItem);
            } else {
              bothList.push(formattedItem);
            }
          });
          
          setCategories({
            dog: dogList.length > 0 ? dogList : categories.dog,
            cat: catList.length > 0 ? catList : categories.cat,
            both: bothList.length > 0 ? bothList : categories.both,
          });
        }

        // Fetch active offers
        const { data: offersData, error: offersError } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true);
        if (!offersError && offersData) {
          setOffers(offersData as Offer[]);
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

  const activePromoMessage = offers.length > 0
    ? offers.map((o) => `✨ ${o.title}: ${o.description || ''} ${o.code ? `[Code: ${o.code}]` : ''}`).join('   |   ')
    : settings.promo_text.value;

  const showPromoTicker = settings.promo_text.is_enabled && showPromo;

  const menuItems = [
    { name: 'All Products', path: '/products' },
    { name: 'Dog Food', path: '/products?category=dog-food-dry' },
    { name: 'Cat Food', path: '/products?category=cat-food-dry' },
    { name: 'Tick & Flea', path: '/products?category=tick-flea-treatment' },
    { name: 'Cat Litter', path: '/products?category=cat-litter' },
    { name: 'Shampoo & Grooming', path: '/products?category=shampoo-grooming' },
    { name: 'Supplements', path: '/products?category=vitamins-supplements' },
  ];

  return (
    <>
      <div className="w-full bg-white border-b border-secondary/40 z-40 relative">
        
        {/* 1. TOP PROMO TICKER BAR (Statically stacked) */}
        {showPromoTicker && (
          <div 
            className="w-full bg-accent text-white py-2 px-4 relative overflow-hidden flex items-center justify-between text-[11px] font-bold tracking-wide select-none"
            style={{ backgroundColor: 'var(--color-accent)', height: '34px' }}
          >
            <div className="flex-1 flex overflow-hidden items-center justify-center" style={{ whiteSpace: 'nowrap' }}>
              <div className="animate-header-marquee" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                <span style={{ whiteSpace: 'nowrap' }}>{activePromoMessage}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowPromo(false)} 
              className="hover:bg-black/10 p-0.5 rounded-full text-white/80 hover:text-white transition-colors"
            >
              &times;
            </button>
          </div>
        )}

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
        <div className="w-full bg-secondary-alt/10 border-t border-secondary/30 mobile-hidden">
          <nav className="container mx-auto px-4 flex items-center justify-center md:justify-start gap-1 overflow-x-auto py-1 scrollbar-none">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-4 py-2 category-nav-link transition-colors hover:text-accent ${
                    isActive ? 'text-accent border-b-2 border-accent' : 'text-text'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={isProfileDrawerOpen} 
        onClose={() => setIsProfileDrawerOpen(false)} 
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} categories={categories} />

      <style jsx global>{`
        @keyframes header-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-header-marquee {
          display: inline-block;
          animation: header-marquee 28s linear infinite;
        }
      `}</style>
    </>
  );
}
