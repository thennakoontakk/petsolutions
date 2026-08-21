'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, ClipboardList, TrendingUp, Clock, CheckCircle, Plus, ListCollapse, Tag, Settings } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';

interface StatItem {
  title: string;
  value: string | number;
  icon: any;
  trend: string;
  trendColor: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createBrowserClient();
        
        // 1. Fetch total products count
        const { count: productsCount, error: prodErr } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        if (prodErr) throw prodErr;

        // 2. Fetch orders list
        const { data: ordersData, error: ordersErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersErr) throw ordersErr;

        // Calculate order statistics
        const totalOrders = ordersData?.length || 0;
        const pendingOrders = ordersData?.filter((o) => o.status === 'pending').length || 0;
        const totalRevenue = ordersData?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;

        setStats([
          {
            title: 'Total Revenue',
            value: formatPrice(totalRevenue),
            icon: TrendingUp,
            trend: '+12% from last month',
            trendColor: 'text-success',
          },
          {
            title: 'Total Orders',
            value: totalOrders,
            icon: ClipboardList,
            trend: '+8% this week',
            trendColor: 'text-success',
          },
          {
            title: 'Pending Orders',
            value: pendingOrders,
            icon: Clock,
            trend: 'Needs attention',
            trendColor: pendingOrders > 0 ? 'text-warning' : 'text-text-muted',
          },
          {
            title: 'Catalog Products',
            value: productsCount || 0,
            icon: ShoppingCart,
            trend: 'Active inventory',
            trendColor: 'text-text-muted',
          },
        ]);

        // Get 5 most recent orders
        if (ordersData) {
          setRecentOrders(ordersData.slice(0, 5));
        }

      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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
      {/* Title */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
          <LayoutDashboard className="text-accent" /> Dashboard
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Store overview, statistics, and recent updates.
        </p>
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
          <h3 className="font-heading font-bold text-base text-text">Quick Operations</h3>
          <p className="text-[10px] text-text-muted">Direct navigation and action shortcuts</p>
        </div>
        <div className="grid grid-2 md:grid-3 gap-6">
          <Link href="/admin/products" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">Manage Products</h4>
              <p className="text-[10px] text-text-muted mt-0.5">View, edit, and delete products catalog.</p>
            </div>
          </Link>
          
          <Link href="/admin/products/new" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-success-light/20 text-success rounded-xl">
              <Plus size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">Add Product</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Insert new items, sizes, and pricing.</p>
            </div>
          </Link>

          <Link href="/admin/categories" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-info-light/20 text-info rounded-xl">
              <ListCollapse size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">Product Categories</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Manage pet types, sections, and ordering.</p>
            </div>
          </Link>

          <Link href="/admin/offers" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-error-light/20 text-error rounded-xl">
              <Tag size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">Offers & Discounts</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Create active coupon codes and banners.</p>
            </div>
          </Link>

          <Link href="/admin/orders" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <ClipboardList size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">Customer Orders</h4>
              <p className="text-[10px] text-text-muted mt-0.5">View and update pending order shipping.</p>
            </div>
          </Link>

          <Link href="/admin/settings" className="glass p-5 rounded-2xl border border-white/40 flex items-start gap-4 text-left hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 bg-warm-gold/10 text-text rounded-xl" style={{ color: 'var(--color-text-dark)' }}>
              <Settings size={18} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-text">Store Settings</h4>
              <p className="text-[10px] text-text-muted mt-0.5">Edit hotline, taglines, and scroll banners.</p>
            </div>
          </Link>
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
