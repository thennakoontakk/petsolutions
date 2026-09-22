'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ListCollapse, 
  ClipboardList, 
  LogOut, 
  ArrowLeft, 
  Settings, 
  Flame, 
  Tag,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export interface AdminNavItem {
  name: string;
  path: string;
  icon: any;
  roles?: ('owner' | 'staff')[];
}

export const adminNavItems: AdminNavItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: ShoppingCart },
  { name: 'Categories', path: '/admin/categories', icon: ListCollapse, roles: ['owner', 'staff'] },
  { name: 'Orders List', path: '/admin/orders', icon: ClipboardList },
  { name: 'Users & Staff', path: '/admin/users', icon: Users, roles: ['owner'] },
  { name: 'Weekly Deals', path: '/admin/deals', icon: Flame, roles: ['owner'] },
  { name: 'Offers & Discounts', path: '/admin/offers', icon: Tag, roles: ['owner'] },
  { name: 'Settings', path: '/admin/settings', icon: Settings, roles: ['owner'] },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({ isOpen = true }: AdminSidebarProps) {
  const pathname = usePathname();
  const { profile, role, signOut } = useAuth();

  const currentRole = role === 'staff' ? 'staff' : 'owner';

  const roleMeta = {
    owner: { label: 'Store Owner', short: 'Owner', icon: '👑', color: '#FFC107' },
    staff: { label: 'Staff / Dispatch', short: 'Staff', icon: '📦', color: '#60A5FA' },
  }[currentRole];

  // Group 1: Core Store Management
  const corePaths = ['/admin', '/admin/products', '/admin/categories', '/admin/orders', '/admin/users'];
  const coreItems = adminNavItems.filter(
    (item) => corePaths.includes(item.path) && (!item.roles || item.roles.includes(currentRole))
  );

  // Group 2: Marketing & Promotions
  const promoPaths = ['/admin/deals', '/admin/offers'];
  const promoItems = adminNavItems.filter(
    (item) => promoPaths.includes(item.path) && (!item.roles || item.roles.includes(currentRole))
  );

  // Group 3: System Settings
  const settingsItem = adminNavItems.find((item) => item.path === '/admin/settings');
  const showSettings = !!settingsItem && (!settingsItem.roles || settingsItem.roles.includes(currentRole));

  // Helper to render a navigation item with 100% matching height and positions
  const renderNavItem = (item: AdminNavItem) => {
    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        href={item.path}
        style={{
          height: '44px',
          minHeight: '44px',
          maxHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: isActive ? 600 : 500,
          position: 'relative',
          userSelect: 'none',
          transition: 'all 160ms ease',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          color: isActive ? '#FFFFFF' : '#B8B8C8',
          justifyContent: isOpen ? 'flex-start' : 'center',
          padding: isOpen ? '0 14px' : '0',
          width: isOpen ? '100%' : '44px',
          margin: isOpen ? '0' : '0 auto',
        }}
        className="group hover:text-white hover:bg-white/[0.07]"
      >
        {/* Left Accent indicator bar for active item when expanded */}
        {isActive && isOpen && (
          <div 
            style={{
              position: 'absolute',
              left: '4px',
              top: '9px',
              bottom: '9px',
              width: '3.5px',
              borderRadius: '9999px',
              backgroundColor: '#FFC107',
            }} 
          />
        )}

        {/* Active Pill Outline */}
        {isActive && (
          <motion.div
            layoutId="admin-active-pill"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 0,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        )}

        <Icon 
          size={18} 
          style={{
            color: isActive ? '#FFC107' : undefined,
            zIndex: 1,
            flexShrink: 0,
          }}
          className="transition-transform duration-200 group-hover:scale-110"
        />

        {isOpen && (
          <span 
            style={{ 
              zIndex: 1, 
              marginLeft: '14px',
              letterSpacing: '0.015em',
            }} 
            className="truncate"
          >
            {item.name}
          </span>
        )}

        {/* Floating Tooltip in Compact Mode */}
        {!isOpen && (
          <div 
            style={{
              position: 'absolute',
              left: 'calc(100% + 12px)',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#1E1E34',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 70,
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            {item.name}
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside
      className="hidden md:flex flex-col bg-text-dark text-white border-r border-white/10 flex-shrink-0 relative transition-all duration-300 ease-out select-none overflow-hidden"
      style={{
        backgroundColor: '#1A1A2E',
        width: isOpen ? '16rem' : '4.75rem',
        minWidth: isOpen ? '16rem' : '4.75rem',
        maxWidth: isOpen ? '16rem' : '4.75rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        maxHeight: '100vh',
        zIndex: 30,
      }}
    >
      {/* ── 1. FIXED HEIGHT HEADER (IDENTICAL 76px IN BOTH MODES) ── */}
      <div 
        style={{
          height: '76px',
          minHeight: '76px',
          maxHeight: '76px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: isOpen ? '0 18px' : '0',
          justifyContent: isOpen ? 'space-between' : 'center',
          flexShrink: 0,
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Image 
            src="/logo-icon.png" 
            width={32} 
            height={32} 
            alt="PetSolutions Icon" 
            style={{ objectFit: 'contain', height: '32px', width: 'auto' }} 
          />
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <Image 
                src="/logo-text.png" 
                width={96} 
                height={24} 
                alt="PetSolutions.lk" 
                style={{ objectFit: 'contain', height: '24px', width: 'auto' }} 
              />
            </motion.div>
          )}
        </Link>

        {isOpen && (
          <div 
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
            title={`${roleMeta.icon} ${roleMeta.label}`}
          >
            <span style={{ fontSize: '11px' }}>{roleMeta.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: roleMeta.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {roleMeta.short}
            </span>
          </div>
        )}
      </div>

      {/* ── 2. SCROLL-FREE NAVIGATION (IDENTICAL Y-POSITIONS IN BOTH MODES) ── */}
      <div 
        className="admin-sidebar-nav flex-1 overflow-y-auto overflow-x-hidden scrollbar-none no-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          padding: isOpen ? '16px 14px' : '16px 10px',
        }}
      >
        {/* Group 1: Core Store Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {coreItems.map(renderNavItem)}
        </div>

        {/* Group Divider (Identical height & margin in both modes) */}
        {promoItems.length > 0 && (
          <div 
            style={{
              width: isOpen ? '100%' : '28px',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              margin: '10px auto',
              flexShrink: 0,
            }} 
          />
        )}

        {/* Group 2: Marketing & Promotions */}
        {promoItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {promoItems.map(renderNavItem)}
          </div>
        )}

        {/* Flexible spacer (Distributes extra vertical space identically) */}
        <div style={{ flex: 1, minHeight: '16px' }} />

        {/* Group 3: Settings (Anchored right above user footer) */}
        {showSettings && settingsItem && (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            {renderNavItem(settingsItem)}
          </div>
        )}
      </div>

      {/* ── 3. USER PROFILE & FOOTER ACTIONS (NO EXPAND BUTTON) ── */}
      <div 
        style={{
          padding: isOpen ? '14px 16px' : '14px 10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: isOpen ? 'stretch' : 'center',
          flexShrink: 0,
        }}
      >
        {isOpen ? (
          <>
            <div style={{ padding: '0 4px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.25 }} className="truncate">
                {profile?.full_name || 'Admin User'}
              </p>
              <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px', fontWeight: 500 }} className="truncate">
                Administrator
              </p>
            </div>

            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                href="/"
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 120ms ease',
                }}
                className="hover:text-white hover:bg-white/[0.08]"
              >
                <ArrowLeft size={13} />
                <span>Back to Store</span>
              </Link>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={signOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FB7185',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 120ms ease',
                }}
                className="hover:bg-rose-500/15"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/"
              target="_blank"
              title="Back to Store"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 120ms ease',
              }}
              className="hover:text-white hover:bg-white/10"
            >
              <ArrowLeft size={16} />
            </Link>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={signOut}
              title="Sign Out"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FB7185',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
              className="hover:bg-rose-500/20"
            >
              <LogOut size={16} />
            </motion.button>
          </>
        )}
      </div>
    </aside>
  );
}
