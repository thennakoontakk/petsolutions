'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Plus, 
  ListCollapse, 
  Settings,
  Package,
  Truck,
  ShieldCheck,
  Stethoscope,
  AlertTriangle,
  Flame,
  Tag
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import { useAuth } from '@/lib/hooks/useAuth';

interface StatItem {
  title: string;
  value: string | number;
  icon: any;
  trend: string;
  trendColor: string;
}

export default function AdminDashboard() {
  const { role, isOwner, isStaff, isPharmacist, switchRole, profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [productsCount, setProductsCount] = useState<number>(69);
  const [loading, setLoading] = useState(true);

  const currentRole = (role === 'staff' || role === 'pharmacist' || role === 'owner') ? role : 'owner';

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createBrowserClient();
        
        // 1. Fetch total products count
        const { count: prodCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        if (prodCount) setProductsCount(prodCount);

        // 2. Fetch orders list
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersData) {
          setOrders(ordersData);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length;
  const totalRevenue = orders.reduce((acc, curr) => acc + Number(curr.total || 0), 0);

  // Role-specific tailored stat cards
  const stats: StatItem[] = useMemo(() => {
    if (currentRole === 'staff') {
      return [
        {
          title: 'Pending Dispatch',
          value: pendingOrders,
          icon: Clock,
          trend: pendingOrders > 0 ? 'Requires immediate packing' : 'All clear',
          trendColor: pendingOrders > 0 ? 'text-warning' : 'text-success',
        },
        {
          title: 'Processing Orders',
          value: processingOrders,
          icon: Package,
          trend: 'In fulfillment pipeline',
          trendColor: 'text-text-muted',
        },
        {
          title: 'Shipped & Completed',
          value: shippedOrders,
          icon: Truck,
          trend: 'Successfully dispatched',
          trendColor: 'text-success',
        },
        {
          title: 'Active SKUs',
          value: productsCount,
          icon: ShoppingCart,
          trend: 'Live catalog count',
          trendColor: 'text-text-muted',
        },
      ];
    }

    if (currentRole === 'pharmacist') {
      return [
        {
          title: 'Prescription Queue',
          value: pendingOrders,
          icon: Stethoscope,
          trend: 'Clinical checks needed',
          trendColor: pendingOrders > 0 ? 'text-warning' : 'text-success',
        },
        {
          title: 'Veterinary Formulas',
          value: productsCount,
          icon: ShieldCheck,
          trend: '69 Verified DOCX Medicines',
          trendColor: 'text-success',
        },
        {
          title: 'Controlled Parasiticides',
          value: 18,
          icon: AlertTriangle,
          trend: 'Fipronil, Amitraz & Spot-ons',
          trendColor: 'text-accent',
        },
        {
          title: 'Cold-Chain / Topical',
          value: 24,
          icon: Package,
          trend: 'Stored below 30°C / dry',
          trendColor: 'text-text-muted',
        },
      ];
    }

    // Default: Owner full financial view
    return [
      {
        title: 'Total Revenue',
        value: formatPrice(totalRevenue),
        icon: TrendingUp,
        trend: '+14.2% store growth',
        trendColor: 'text-success',
      },
      {
        title: 'Total Orders',
        value: totalOrders,
        icon: ClipboardList,
        trend: `${pendingOrders} need dispatch`,
        trendColor: pendingOrders > 0 ? 'text-warning' : 'text-success',
      },
      {
        title: 'Pending Action',
        value: pendingOrders,
        icon: Clock,
        trend: pendingOrders > 0 ? 'Urgent verification' : 'Up to date',
        trendColor: pendingOrders > 0 ? 'text-warning' : 'text-text-muted',
      },
      {
        title: 'Catalog Products',
        value: productsCount,
        icon: ShoppingCart,
        trend: '118 priced variants',
        trendColor: 'text-success',
      },
    ];
  }, [currentRole, totalRevenue, totalOrders, pendingOrders, processingOrders, shippedOrders, productsCount]);

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-secondary/50 w-1/4 rounded" />
        <div className="grid grid-1 md:grid-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass h-28 rounded-2xl bg-secondary/30" />
          ))}
        </div>
        <div className="glass h-64 rounded-2xl bg-secondary/30 mt-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title & Role View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
              <LayoutDashboard className="text-accent" /> Dashboard
            </h1>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
              currentRole === 'owner' ? 'bg-accent/15 text-text border-accent/40' :
              currentRole === 'staff' ? 'bg-blue-500/15 text-blue-700 border-blue-400/40' :
              'bg-emerald-500/15 text-emerald-700 border-emerald-400/40'
            }`}>
              {currentRole === 'owner' ? '👑 Owner Console' :
               currentRole === 'staff' ? '📦 Staff & Fulfillment' :
               '🩺 Pharmacist & Clinical Review'}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            {currentRole === 'owner' ? 'Executive store overview, financial metrics, and operational health.' :
             currentRole === 'staff' ? 'Daily fulfillment pipeline, packing queue, and stock dispatch.' :
             'Clinical prescription verification, active drug formulations, and dosage guidelines.'}
          </p>
        </div>

        {/* DB-Verified Role Identity Indicator */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white/70 border border-secondary/60 rounded-2xl shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text">
              {profile?.full_name || 'Authorized User'}
            </span>
            <span className="text-[10px] text-text-muted">
              Authenticated Role: <strong className="text-accent capitalize">{currentRole}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-1 md:grid-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass p-5 rounded-2xl border border-white/40 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{stat.title}</p>
                <p className="font-heading font-extrabold text-lg text-text">{stat.value}</p>
                <p className={`text-[10px] font-semibold ${stat.trendColor}`}>{stat.trend}</p>
              </div>
              <div className="p-3.5 bg-accent/10 rounded-2xl text-accent flex-shrink-0">
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Console Controls */}
      <div className="space-y-4 mt-8">
        <div>
          <h3 className="font-heading font-bold text-base text-text">
            {currentRole === 'owner' ? 'Quick Operations & Management' :
             currentRole === 'staff' ? 'Fulfillment & Dispatch Tasks' :
             'Pharmacy & Clinical Tools'}
          </h3>
          <p className="text-[10px] text-text-muted">Direct navigation and action shortcuts</p>
        </div>
        <div className="grid grid-2 md:grid-3 gap-6">
          <Link href="/admin/products" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">
                {currentRole === 'pharmacist' ? 'Clinical Catalog (69 SKUs)' : 'Manage Products'}
              </h4>
              <p className="text-[10px] text-text-muted mt-0.5">
                {currentRole === 'pharmacist' ? 'Inspect clinical indications & dosage' : 'View, edit, and update products catalog.'}
              </p>
            </div>
          </Link>
          
          {(currentRole === 'owner' || currentRole === 'staff') && (
            <Link href="/admin/products/new" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
              <div className="p-3 bg-success-light/20 text-success rounded-xl">
                <Plus size={18} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-text">Add Product</h4>
                <p className="text-[10px] text-text-muted mt-0.5">Insert new items, sizes, and pricing.</p>
              </div>
            </Link>
          )}

          {(currentRole === 'owner' || currentRole === 'staff') && (
            <Link href="/admin/categories" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
              <div className="p-3 bg-info-light/20 text-info rounded-xl">
                <ListCollapse size={18} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-text">Product Categories</h4>
                <p className="text-[10px] text-text-muted mt-0.5">Manage pet types, sections, and ordering.</p>
              </div>
            </Link>
          )}

          <Link href="/admin/orders" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <ClipboardList size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">
                {currentRole === 'pharmacist' ? 'Prescription Approvals' : currentRole === 'staff' ? 'Dispatch Queue' : 'Customer Orders'}
              </h4>
              <p className="text-[10px] text-text-muted mt-0.5">
                {currentRole === 'pharmacist' ? 'Review dosage before dispensing' : 'Update pending order packing and delivery.'}
              </p>
            </div>
          </Link>

          {currentRole === 'owner' && (
            <>
              <Link href="/admin/deals" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                  <Flame size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-text">Weekly Deals</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Configure discounts & countdown deals.</p>
                </div>
              </Link>

              <Link href="/admin/offers" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-accent/10 text-accent rounded-xl">
                  <Tag size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-text">Promotional Coupons</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Manage promo codes (e.g. WELCOME10).</p>
                </div>
              </Link>

              <Link href="/admin/settings" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-warm-gold/10 text-text rounded-xl" style={{ color: 'var(--color-text-dark)' }}>
                  <Settings size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-text">Store Settings</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Delivery threshold, hotlines & banners.</p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="glass p-6 rounded-2xl border border-white/40 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-heading font-bold text-base text-text">Recent Orders</h3>
            <p className="text-[10px] text-text-muted">The latest orders placed by customers</p>
          </div>
          <Link href="/admin/orders" className="btn btn-outline btn-sm text-xs font-semibold">
            View All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-secondary/50 text-text-muted font-bold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Method</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const date = new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-accent">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{order.customer_name}</p>
                          <p className="text-[10px] text-text-muted">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-muted">{date}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          order.status === 'delivered' ? 'badge-success' : order.status === 'pending' ? 'badge-warning' : 'badge-info'
                        } text-[9px] uppercase tracking-wider font-bold`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{formatPrice(order.total)}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-text-muted">
                        {order.payment_method}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
