'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, ListCollapse, ClipboardList, ShieldAlert, LogOut, ArrowLeft, Settings, Flame } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Weekly Deals', path: '/admin/deals', icon: Flame },
    { name: 'Products', path: '/admin/products', icon: ShoppingCart },
    { name: 'Categories', path: '/admin/categories', icon: ListCollapse },
    { name: 'Orders List', path: '/admin/orders', icon: ClipboardList },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 bg-text-dark text-white border-r border-white/10"
      style={{ backgroundColor: '#1A1A2E', zIndex: 30 }}
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex flex-col gap-3">
        <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
          <Image src="/logo-icon.png" width={28} height={28} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '28px', width: 'auto' }} />
          <Image src="/logo-text.png" width={90} height={22} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '22px', width: 'auto' }} />
        </Link>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/20 border border-accent/30 rounded-full w-fit">
          <ShieldAlert size={12} className="text-accent" />
          <span className="text-[9px] font-bold tracking-wider text-accent uppercase">Admin Console</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all relative ${
                isActive ? 'text-text' : 'text-text-light hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-active-pill"
                  className="absolute inset-0 bg-accent rounded-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <Icon size={16} className={`relative z-10 ${isActive ? 'text-text' : 'text-text-light'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info / Exit */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
        <div className="px-4 py-2">
          <p className="text-xs font-bold truncate text-white">{profile?.full_name || 'Admin'}</p>
          <p className="text-[10px] text-text-light truncate">Administrator</p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] text-text-light hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] text-error hover:bg-error/15 transition-colors text-left"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
