'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import AdminSidebar, { adminNavItems } from '@/components/layout/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Menu, X, LogOut, ArrowLeft, ExternalLink, Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, role, switchRole, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const currentRole = role === 'staff' ? 'staff' : 'owner';
  const visibleNavItems = adminNavItems.filter(item => !item.roles || item.roles.includes(currentRole));

  const roleMeta = {
    owner: { label: 'Store Owner', icon: '👑', color: 'bg-accent/20 text-text border-accent/40' },
    staff: { label: 'Staff / Dispatch', icon: '📦', color: 'bg-blue-500/15 text-blue-800 border-blue-400/40' },
  }[currentRole];

  // Load saved sidebar state from localStorage safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem('petsolutions_admin_sidebar_open');
      if (saved !== null) {
        setDesktopSidebarOpen(saved === 'true');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('petsolutions_admin_sidebar_open', String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut: Ctrl + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleDesktopSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <div className="h-screen flex items-center justify-center bg-dominant">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
          <span className="text-xs font-semibold text-text-muted">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  // Not logged in or not admin check
  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-dominant px-4">
        <div className="glass p-8 text-center rounded-2xl max-w-md space-y-6 flex flex-col items-center justify-center shadow-lg">
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
    <div className="min-h-screen bg-dominant flex overflow-x-hidden">
      {/* Sidebar Navigation (Desktop only - Dual Mode: Expanded 16rem / Compact 4.75rem Rail) */}
      <AdminSidebar isOpen={desktopSidebarOpen} onToggle={toggleDesktopSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Desktop Top Header Bar - Always Sticky & Reliable */}
        <header
          className="hidden md:flex h-14 border-b px-6 items-center justify-between sticky top-0 w-full z-40 transition-all"
          style={{
            backgroundColor: 'rgba(254, 252, 243, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderColor: 'var(--color-secondary-alt, #BDDFEA)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={toggleDesktopSidebar}
              className="p-2 px-3 rounded-xl border border-secondary/80 bg-white hover:bg-secondary/40 text-text text-xs font-semibold flex items-center gap-2 transition-all shadow-xs flex-shrink-0 cursor-pointer"
              title={desktopSidebarOpen ? 'Compact sidebar (Ctrl+B)' : 'Expand sidebar (Ctrl+B)'}
              aria-label="Toggle sidebar"
            >
              <Menu size={15} className="text-text" />
              <span className="text-text font-medium text-[11px]">
                {desktopSidebarOpen ? 'Compact' : 'Expand'}
              </span>
            </motion.button>

            <div className="h-4 w-[1px] bg-secondary/80 flex-shrink-0" />

            {/* Current Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-text-muted truncate">
              <span>Admin</span>
              <span>/</span>
              <span className="font-bold text-text">
                {pathname.startsWith('/admin/users')
                  ? 'Users & Staff'
                  : pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* RBAC Role Pill */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide ${roleMeta.color}`}>
              <span>{roleMeta.icon}</span>
              <span>{roleMeta.label}</span>
            </div>

            {/* Owner-Only Quick Access: Users & Staff Management */}
            {currentRole === 'owner' && (
              <Link
                href="/admin/users"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  pathname.startsWith('/admin/users')
                    ? 'bg-accent text-text border-accent/80 font-bold shadow-xs'
                    : 'bg-white hover:bg-secondary/40 text-text border-secondary/80 shadow-xs'
                }`}
                title="Manage Registered Customers & Staff"
              >
                <Users size={14} className="text-text" />
                <span className="hidden sm:inline">Users & Staff</span>
              </Link>
            )}

            <Link
              href="/"
              target="_blank"
              className="btn btn-ghost btn-sm text-xs text-text-muted hover:text-text flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded-xl hover:bg-secondary/40 transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink size={13} />
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-secondary flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-accent text-text font-extrabold flex items-center justify-center text-xs" style={{ color: '#1A1A2E' }}>
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-semibold text-text max-w-[120px] truncate">
                {profile?.full_name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Header - Always Sticky & Reliable */}
        <header
          className="md:hidden h-14 text-white px-4 flex items-center justify-between shadow-md sticky top-0 z-30"
          style={{ backgroundColor: '#1A1A2E' }}
        >
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
              aria-label="Open admin menu"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center gap-1.5">
              <Image src="/logo-icon.png" width={28} height={28} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '28px', width: 'auto' }} />
              <Image src="/logo-text.png" width={90} height={22} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '22px', width: 'auto' }} />
            </Link>
          </div>
          <div className="flex items-center gap-1 bg-accent/20 border border-accent/30 px-2.5 py-0.5 rounded-full">
            <span>{roleMeta.icon}</span>
            <span className="text-[9px] font-bold text-accent uppercase tracking-wider">{roleMeta.label}</span>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 bottom-0 left-0 w-72 text-white z-50 md:hidden flex flex-col justify-between shadow-2xl"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              <div className="overflow-y-auto flex-1">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Image src="/logo-icon.png" width={28} height={28} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '28px', width: 'auto' }} />
                    <Image src="/logo-text.png" width={90} height={22} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '22px', width: 'auto' }} />
                  </Link>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1.5">
                  {visibleNavItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all relative ${
                          isActive ? 'text-text-dark bg-accent font-bold shadow-xs' : 'text-text-light hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User / Logout */}
              <div className="p-4 border-t border-white/10 space-y-2 bg-black/30">
                <div className="px-3 py-2 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-accent text-text font-extrabold flex items-center justify-center text-xs" style={{ color: '#1A1A2E' }}>
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate text-white">{profile?.full_name || 'Admin User'}</p>
                    <p className="text-[10px] text-accent font-semibold truncate">{roleMeta.icon} {roleMeta.label}</p>
                  </div>
                </div>

                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-light hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Store
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error/15 transition-colors text-left"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
