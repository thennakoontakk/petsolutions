'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Menu, X, LayoutDashboard, ShoppingCart, 
  ListCollapse, Tag, ClipboardList, Settings, LogOut, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingCart },
    { name: 'Categories', path: '/admin/categories', icon: ListCollapse },
    { name: 'Offers & Discounts', path: '/admin/offers', icon: Tag },
    { name: 'Orders List', path: '/admin/orders', icon: ClipboardList },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/admin');
      } else if (!isAdmin) {
        // Not an admin
      }
    }
  }, [user, isAdmin, isLoading, router]);

  // Close mobile sidebar on path change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Not logged in or not admin check
  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-dominant px-4">
        <div className="glass p-8 text-center rounded-2xl max-w-md space-y-6 flex flex-col items-center justify-center">
          <div className="p-4 bg-error-light text-error rounded-full">
            <ShieldAlert size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-extrabold text-xl text-text">Access Denied</h2>
            <p className="text-xs text-text-muted">
              You do not have administrative privileges to access this area. If you believe this is an error, please contact support.
            </p>
          </div>
          <div className="w-full flex gap-3">
            <Link href="/" className="btn btn-outline w-full text-xs">
              Go to Storefront
            </Link>
            <Link href="/auth/login" className="btn btn-primary w-full text-xs">
              Login as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dominant flex">
      {/* Sidebar Navigation (Desktop only) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Mobile Header indicator */}
        <header className="md:hidden h-14 bg-text-dark text-white px-4 flex items-center justify-between shadow-md" style={{ backgroundColor: '#1A1A2E' }}>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white"
              aria-label="Open admin menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/logo-icon.png" width={28} height={28} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '28px', width: 'auto' }} />
              <Image src="/logo-text.png" width={90} height={22} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '22px', width: 'auto' }} />
            </Link>
          </div>
          <div className="flex items-center gap-1 bg-accent/20 border border-accent/30 px-2 py-0.5 rounded-full">
            <ShieldAlert size={10} className="text-accent" />
            <span className="text-[8px] font-bold text-accent uppercase">Admin</span>
          </div>
        </header>

        {/* Content body */}
        <main className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-text-dark text-white z-50 md:hidden flex flex-col justify-between"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              <div>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Image src="/logo-icon.png" width={28} height={28} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '28px', width: 'auto' }} />
                    <Image src="/logo-text.png" width={90} height={22} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '22px', width: 'auto' }} />
                  </Link>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all relative ${
                          isActive ? 'text-text-dark bg-accent font-bold' : 'text-text-light hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User / Logout */}
              <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
                <div className="px-4 py-2">
                  <p className="text-xs font-bold truncate text-white">{profile?.full_name || 'Admin'}</p>
                  <p className="text-[10px] text-text-light truncate">Administrator</p>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] text-text-light hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ArrowLeft size={12} /> Back to Store
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] text-error hover:bg-error/15 transition-colors text-left"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
