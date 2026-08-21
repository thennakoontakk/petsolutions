'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  LogOut, 
  Shield, 
  Package, 
  ShoppingBag, 
  ArrowRight, 
  Phone, 
  MapPin, 
  LogIn, 
  UserPlus, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export default function ProfileDrawer({ isOpen, onClose, onOpenCart }: ProfileDrawerProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : 'U';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            style={{ position: 'fixed', zIndex: 1000 }}
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-l border-white/20 flex flex-col justify-between"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              zIndex: 1001,
              backgroundColor: 'rgba(254, 252, 243, 0.96)',
            }}
          >
            {/* ── 1. Top Header ── */}
            <div>
              <div className="p-4 sm:p-5 border-b border-secondary-alt/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-accent/15 text-accent rounded-xl">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-lg text-text">
                      {user ? 'My Account' : 'Account'}
                    </h2>
                    <p className="text-[11px] text-text-muted">
                      {user ? 'Manage your profile & orders' : 'Welcome to PetSolutions'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary/40 rounded-full transition-colors text-muted hover:text-text"
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* ── 2. Content Body ── */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-170px)]">
                {user ? (
                  <div className="flex flex-col gap-5">
                    {/* User Profile Card */}
                    <div className="glass p-5 rounded-2xl border border-secondary-alt/30 bg-white/60 shadow-sm flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-accent/20 border-2 border-accent text-accent font-heading font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-text truncate">
                            {profile?.full_name || 'Pet Parent'}
                          </h3>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                              <Shield size={10} /> Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted truncate mt-0.5">{user.email}</p>
                        {profile?.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-text-light mt-1">
                            <Phone size={11} />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile?.address && (
                          <div className="flex items-center gap-1.5 text-[11px] text-text-light mt-0.5 truncate">
                            <MapPin size={11} />
                            <span className="truncate">{profile.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation Menu Options */}
                    <div className="flex flex-col gap-2.5">
                      <p className="text-[11px] uppercase tracking-wider font-extrabold text-text-light px-1">
                        Quick Actions
                      </p>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={onClose}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-accent/10 border border-secondary-alt/30 hover:border-accent/30 transition-all group shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/15 text-accent rounded-lg group-hover:scale-110 transition-transform">
                              <Shield size={18} />
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-text group-hover:text-accent transition-colors">
                                Admin Console
                              </h4>
                              <p className="text-[10px] text-text-muted">
                                Manage catalog, orders & settings
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-text-light group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        onClick={onClose}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-accent/10 border border-secondary-alt/30 hover:border-accent/30 transition-all group shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary/60 text-text rounded-lg group-hover:scale-110 transition-transform">
                            <Package size={18} />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-text group-hover:text-accent transition-colors">
                              Order History
                            </h4>
                            <p className="text-[10px] text-text-muted">
                              View past purchases & track packages
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-light group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenCart) onOpenCart();
                        }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-accent/10 border border-secondary-alt/30 hover:border-accent/30 transition-all group shadow-xs text-left w-full"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary/60 text-text rounded-lg group-hover:scale-110 transition-transform">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-text group-hover:text-accent transition-colors flex items-center gap-2">
                              Shopping Cart
                              {totalItems > 0 && (
                                <span className="px-1.5 py-0.2 bg-accent text-white text-[9px] font-extrabold rounded-full">
                                  {totalItems}
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-text-muted">
                              {totalItems > 0 ? `${totalItems} items ready to checkout` : 'Your cart is empty'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-light group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <Link
                        href="/products"
                        onClick={onClose}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-accent/10 border border-secondary-alt/30 hover:border-accent/30 transition-all group shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary/60 text-text rounded-lg group-hover:scale-110 transition-transform">
                            <Sparkles size={18} />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-text group-hover:text-accent transition-colors">
                              Explore Products
                            </h4>
                            <p className="text-[10px] text-text-muted">
                              Browse pet food, treatments & grooming
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-light group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* ── Not Logged In State ── */
                  <div className="flex flex-col gap-6 text-center py-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/15 text-accent flex items-center justify-center shadow-inner">
                      <User size={32} />
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-lg text-text">
                        Welcome to PetSolutions!
                      </h3>
                      <p className="text-xs text-text-muted mt-1.5 max-w-xs mx-auto leading-relaxed">
                        Sign in to access your order history, save favorite items, and enjoy faster checkout.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Link
                        href="/auth/login"
                        onClick={onClose}
                        className="btn btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-accent/20 hover:scale-[1.02] transition-transform"
                      >
                        <LogIn size={16} /> Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={onClose}
                        className="btn btn-outline py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border-secondary-alt hover:border-accent hover:bg-white/40 transition-all"
                      >
                        <UserPlus size={16} /> Create an Account
                      </Link>
                    </div>

                    <div className="border-t border-secondary-alt/30 pt-5 text-left flex flex-col gap-2">
                      <p className="text-[11px] uppercase tracking-wider font-extrabold text-text-light px-1">
                        Help & Exploration
                      </p>
                      <Link
                        href="/products"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-accent/10 border border-secondary-alt/20 text-xs font-semibold text-text group"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles size={14} className="text-accent" /> Browse All Products
                        </span>
                        <ArrowRight size={14} className="text-text-light group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── 3. Bottom Footer Action ── */}
            {user && (
              <div className="p-4 sm:p-5 border-t border-secondary-alt/30 bg-white/40">
                <button
                  onClick={async () => {
                    await signOut();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-error bg-error/10 hover:bg-error/20 transition-all cursor-pointer"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
