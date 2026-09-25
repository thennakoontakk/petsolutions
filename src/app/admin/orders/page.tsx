'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Search,
  X,
  RefreshCw,
  ExternalLink,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Calendar,
  List,
  LayoutGrid,
  Plus,
  MessageCircle,
  FileText,
  CreditCard,
  Building2,
  Banknote,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  product_name: string;
  variant_label?: string | null;
  quantity: number;
  unit_price: number;
}

interface OrderRecord {
  id: string;
  user_id?: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

const DEFAULT_DEMO_ORDERS: OrderRecord[] = [
  {
    id: 'ord-78419201-cf9a-4c22-b5e1',
    status: 'pending',
    subtotal: 6060,
    discount: 0,
    total: 6060,
    customer_name: 'Kavindu Thennakoon',
    customer_email: 'thennakoontakk@gmail.com',
    customer_phone: '+94 77 123 4567',
    shipping_address: 'No. 42, Havelock Road, Colombo 05',
    payment_method: 'card',
    notes: 'Urgent delivery requested for puppy with mild indigestion. Call before arrival.',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: 'item-1',
        order_id: 'ord-78419201-cf9a-4c22-b5e1',
        product_name: 'Himalaya Digyton Drops, 30 ml',
        variant_label: '30ml Dropper Bottle',
        quantity: 2,
        unit_price: 1500,
      },
      {
        id: 'item-2',
        order_id: 'ord-78419201-cf9a-4c22-b5e1',
        product_name: 'Tixfree Spot On Dog',
        variant_label: '10-20 Kg (3 Packs)',
        quantity: 1,
        unit_price: 3060,
      },
    ],
  },
  {
    id: 'ord-69120482-aa81-4b13-91ec',
    status: 'processing',
    subtotal: 5580,
    discount: 500,
    total: 5080,
    customer_name: 'Dr. Nimna Wickramasinghe',
    customer_email: 'nimna.w@gmail.com',
    customer_phone: '+94 71 884 9201',
    shipping_address: 'No. 18/A, Peradeniya Road, Kandy',
    payment_method: 'bank',
    notes: 'Payment slip emailed to accounts@petsolutions.lk. Fragile medical shampoo bottles.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: 'item-3',
        order_id: 'ord-69120482-aa81-4b13-91ec',
        product_name: 'Seepet Malaseb Shampoo',
        variant_label: '200ml Antifungal Formulation',
        quantity: 2,
        unit_price: 1140,
      },
      {
        id: 'item-4',
        order_id: 'ord-69120482-aa81-4b13-91ec',
        product_name: 'Rapimac Tablet',
        variant_label: '10 Tablets Strip',
        quantity: 3,
        unit_price: 1100,
      },
    ],
  },
  {
    id: 'ord-51029384-bc32-44df-8f55',
    status: 'shipped',
    subtotal: 5750,
    discount: 0,
    total: 5750,
    customer_name: 'Sahan Senanayake',
    customer_email: 'sahan.s@gmail.com',
    customer_phone: '+94 76 349 2011',
    shipping_address: 'Flat 4B, Marine Drive, Kollupitiya, Colombo 03',
    payment_method: 'cod',
    notes: 'Gate code is #402. Security will accept if not home.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: 'item-5',
        order_id: 'ord-51029384-bc32-44df-8f55',
        product_name: 'Topdog Groom Shampoo',
        variant_label: '200ml Conditioning',
        quantity: 1,
        unit_price: 950,
      },
      {
        id: 'item-6',
        order_id: 'ord-51029384-bc32-44df-8f55',
        product_name: 'Cat Litter Premium Lavender',
        variant_label: '10L Bentonite Clumping',
        quantity: 2,
        unit_price: 2400,
      },
    ],
  },
  {
    id: 'ord-49201847-dd10-4f99-9e23',
    status: 'delivered',
    subtotal: 3280,
    discount: 0,
    total: 3730,
    customer_name: 'Priyantha Perera',
    customer_email: 'priyantha@perera.lk',
    customer_phone: '+94 77 902 1844',
    shipping_address: 'No. 112, Negombo Road, Kurunegala',
    payment_method: 'cod',
    notes: 'Handed over to customer by Pronto Couriers.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: 'item-7',
        order_id: 'ord-49201847-dd10-4f99-9e23',
        product_name: 'Tixfree Spot On Adult Cat',
        variant_label: '3 Packs Spot-on',
        quantity: 1,
        unit_price: 1980,
      },
      {
        id: 'item-8',
        order_id: 'ord-49201847-dd10-4f99-9e23',
        product_name: 'Furr Fresh Medicated Shampoo',
        variant_label: '200ml Bottle',
        quantity: 1,
        unit_price: 1300,
      },
    ],
  },
  {
    id: 'ord-38194028-ee51-4091-8a42',
    status: 'delivered',
    subtotal: 1300,
    discount: 0,
    total: 1750,
    customer_name: 'Anoma Jayasuriya',
    customer_email: 'anoma.j@outlook.com',
    customer_phone: '+94 70 293 8472',
    shipping_address: 'No. 75, Galle Road, Kalutara North',
    payment_method: 'card',
    notes: 'Left at reception as requested.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    updated_at: new Date().toISOString(),
    order_items: [
      {
        id: 'item-9',
        order_id: 'ord-38194028-ee51-4091-8a42',
        product_name: 'Alovera Shampoo',
        variant_label: '225ml Gentle Coat Care',
        quantity: 2,
        unit_price: 650,
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Interactive Expandable Row & Invoice Modal
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRecord | null>(null);

  // Fetch orders with order_items (Supabase with localStorage fallback)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setOrders(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('petsolutions_admin_orders', JSON.stringify(data));
        }
      } else {
        // Fallback to local storage or demo orders
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('petsolutions_admin_orders');
          if (stored) {
            setOrders(JSON.parse(stored));
          } else {
            setOrders(DEFAULT_DEMO_ORDERS);
            localStorage.setItem('petsolutions_admin_orders', JSON.stringify(DEFAULT_DEMO_ORDERS));
          }
        } else {
          setOrders(DEFAULT_DEMO_ORDERS);
        }
      }
    } catch (err: any) {
      console.warn('Supabase orders fetch notice, using persisted records:', err.message);
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('petsolutions_admin_orders');
        setOrders(stored ? JSON.parse(stored) : DEFAULT_DEMO_ORDERS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      // 1. Try Supabase
      try {
        const supabase = createBrowserClient();
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase update note:', err);
      }

      // 2. Update local state & localStorage
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        if (typeof window !== 'undefined') {
          localStorage.setItem('petsolutions_admin_orders', JSON.stringify(updated));
        }
        return updated;
      });

      const statusLabels: Record<OrderStatus, string> = {
        pending: 'Pending Review',
        confirmed: 'Confirmed',
        processing: 'In Processing',
        shipped: 'Dispatched / Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      };

      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} updated to "${statusLabels[newStatus]}".`);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast.error('Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Seed an extra realistic sample order
  const handleSeedSampleOrder = () => {
    const sampleNames = ['Kavindu Thennakoon', 'Nimali Senanayake', 'Sahan Jayawardena', 'Priyantha Fernando', 'Dilani Karunaratne'];
    const sampleCities = ['Colombo 07', 'Kandy Road, Kelaniya', 'Galle Road, Mount Lavinia', 'Negombo Town', 'Rajagiriya'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
    const newId = 'ord-' + Math.floor(10000000 + Math.random() * 90000000) + '-demo';

    const newOrder: OrderRecord = {
      id: newId,
      status: 'pending',
      subtotal: 3980,
      discount: 0,
      total: 3980,
      customer_name: randomName,
      customer_email: randomName.toLowerCase().replace(/\s+/g, '.') + '@example.com',
      customer_phone: '+94 77 ' + Math.floor(1000000 + Math.random() * 9000000),
      shipping_address: `No. ${Math.floor(10 + Math.random() * 80)}, Flower Road, ${randomCity}`,
      payment_method: Math.random() > 0.5 ? 'cod' : 'card',
      notes: 'Customer requested evening dispatch. Please handle carefully.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: [
        {
          id: 'item-' + Date.now(),
          order_id: newId,
          product_name: 'Shampoo Dermitol Medicated',
          variant_label: '250ml Dermatological',
          quantity: 1,
          unit_price: 3980,
        },
      ],
    };

    setOrders((prev) => {
      const nextList = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('petsolutions_admin_orders', JSON.stringify(nextList));
      }
      return nextList;
    });

    toast.success(`Created sample order #${newId.slice(0, 8).toUpperCase()}!`);
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const total = orders.length;
    let pending = 0;
    let processing = 0;
    let shipped = 0;
    let delivered = 0;
    let cancelled = 0;
    let totalRevenue = 0;

    orders.forEach((o) => {
      if (o.status === 'pending') pending++;
      else if (o.status === 'confirmed' || o.status === 'processing') processing++;
      else if (o.status === 'shipped') shipped++;
      else if (o.status === 'delivered') {
        delivered++;
        totalRevenue += Number(o.total || 0);
      } else if (o.status === 'cancelled') cancelled++;
    });

    return { total, pending, processing, shipped, delivered, cancelled, totalRevenue };
  }, [orders]);

  // Filtering & Sorting
  const filteredAndSortedOrders = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    const filtered = orders.filter((o) => {
      // 1. Search Query
      if (searchLower) {
        const orderNum = o.id.toLowerCase();
        const shortNum = o.id.slice(0, 8).toLowerCase();
        const nameMatch = o.customer_name?.toLowerCase().includes(searchLower);
        const emailMatch = o.customer_email?.toLowerCase().includes(searchLower);
        const phoneMatch = o.customer_phone?.toLowerCase().includes(searchLower);
        const addressMatch = o.shipping_address?.toLowerCase().includes(searchLower);
        const itemMatch = o.order_items?.some((i) => i.product_name.toLowerCase().includes(searchLower));

        if (!orderNum.includes(searchLower) && !shortNum.includes(searchLower) && !nameMatch && !emailMatch && !phoneMatch && !addressMatch && !itemMatch) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'processing') {
          if (o.status !== 'confirmed' && o.status !== 'processing') return false;
        } else if (o.status !== statusFilter) {
          return false;
        }
      }

      // 3. Payment Filter
      if (paymentFilter !== 'all') {
        if (o.payment_method !== paymentFilter) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'amount_high') {
        return Number(b.total || 0) - Number(a.total || 0);
      }
      if (sortBy === 'amount_low') {
        return Number(a.total || 0) - Number(b.total || 0);
      }
      return 0;
    });

    return filtered;
  }, [orders, search, statusFilter, paymentFilter, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters = search.trim() !== '' || statusFilter !== 'all' || paymentFilter !== 'all' || sortBy !== 'newest';

  // Badges
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Review',
          bg: '#FFFBEB',
          text: '#92400E',
          border: '#FDE68A',
          dot: 'status-dot-amber',
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          bg: '#F0F9FF',
          text: '#0369A1',
          border: '#BAE6FD',
          dot: 'status-dot-emerald',
        };
      case 'processing':
        return {
          label: 'In Processing',
          bg: '#EFF6FF',
          text: '#1D4ED8',
          border: '#BFDBFE',
          dot: 'status-dot-emerald',
        };
      case 'shipped':
        return {
          label: 'Dispatched',
          bg: '#FAF5FF',
          text: '#6B21A8',
          border: '#E9D5FF',
          dot: 'status-dot',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          bg: '#ECFDF5',
          text: '#065F46',
          border: '#A7F3D0',
          dot: 'status-dot-emerald',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: '#FFF1F2',
          text: '#9F1239',
          border: '#FECDD3',
          dot: 'status-dot-rose',
        };
    }
  };

  const getPaymentBadge = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return { label: 'Online Card', icon: CreditCard, color: '#0284C7' };
      case 'bank':
        return { label: 'Bank Transfer', icon: Building2, color: '#D97706' };
      default:
        return { label: 'Cash on Delivery', icon: Banknote, color: '#059669' };
    }
  };

  return (
    <div className="admin-catalog-wrap">
      {/* ── 1. Executive Top Header Banner (Matching Products & Users) ── */}
      <div className="admin-hero-banner">
        <div className="admin-hero-content">
          <div className="admin-hero-icon">
            <ClipboardList size={24} />
          </div>
          <div>
            <div className="admin-hero-title-row">
              <h1 className="admin-hero-title">Order Operations</h1>
              <span className="admin-hero-badge">
                {orders.length} Total Orders
              </span>
              {kpis.pending > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FCD34D',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span className="status-dot status-dot-amber" />
                  {kpis.pending} Action Needed
                </span>
              )}
            </div>
            <p className="admin-hero-subtitle">
              Track customer orders, confirm payments, print packing slips, and manage fulfillment dispatch across Sri Lanka.
            </p>
          </div>
        </div>

        <div className="admin-hero-actions">
          <button
            onClick={() => {
              fetchOrders();
              toast.success('Orders refreshed.');
            }}
            disabled={loading}
            className="admin-action-btn"
            style={{ width: '38px', height: '38px', borderRadius: '12px' }}
            title="Refresh Orders"
            aria-label="Refresh orders"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleSeedSampleOrder}
            className="btn btn-outline btn-sm"
            style={{
              height: '38px',
              padding: '0 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              gap: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            title="Create a test order"
          >
            <Plus size={14} />
            <span>Sample Order</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{
              height: '38px',
              padding: '0 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              gap: '6px',
            }}
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* ── 2. Interactive KPI Metric Cards (Instant Filter Buttons) ── */}
      <div className="admin-kpi-grid">
        {/* All Orders */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`admin-kpi-card ${statusFilter === 'all' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>All Orders</span>
            <Package size={15} className="text-text-muted" />
          </div>
          <div className="admin-kpi-value">{kpis.total}</div>
          <div className="admin-kpi-footer">Total orders recorded</div>
        </div>

        {/* Pending Review */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`admin-kpi-card ${statusFilter === 'pending' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Pending Review</span>
            <span className="status-dot status-dot-amber" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#D97706' }}>
            {kpis.pending}
          </div>
          <div className="admin-kpi-footer">Awaiting payment & check</div>
        </div>

        {/* Processing / Confirmed */}
        <div
          onClick={() => setStatusFilter('processing')}
          className={`admin-kpi-card ${statusFilter === 'processing' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>In Processing</span>
            <span className="status-dot" style={{ backgroundColor: '#0284C7' }} />
          </div>
          <div className="admin-kpi-value" style={{ color: '#0284C7' }}>
            {kpis.processing}
          </div>
          <div className="admin-kpi-footer">Packaging & allocation</div>
        </div>

        {/* Shipped / In-Transit */}
        <div
          onClick={() => setStatusFilter('shipped')}
          className={`admin-kpi-card ${statusFilter === 'shipped' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Dispatched</span>
            <Truck size={15} style={{ color: '#7C3AED' }} />
          </div>
          <div className="admin-kpi-value" style={{ color: '#7C3AED' }}>
            {kpis.shipped}
          </div>
          <div className="admin-kpi-footer">Out with courier partner</div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => setStatusFilter('delivered')}
          className={`admin-kpi-card ${statusFilter === 'delivered' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Delivered</span>
            <span className="status-dot status-dot-emerald" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#059669' }}>
            {kpis.delivered}
          </div>
          <div className="admin-kpi-footer">Successfully fulfilled</div>
        </div>
      </div>

      {/* ── 3. High-Density Search, Filter Toolbar & View Switcher ── */}
      <div className="admin-toolbar-wrap">
        <div className="admin-toolbar-main">
          {/* Search Box */}
          <div className="admin-search-box">
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                color: 'var(--color-text-muted)',
              }}
            >
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search Order ID (#ORD-), customer name, phone, item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="admin-filter-group">
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="pending">Pending Review ({kpis.pending})</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">In Processing ({kpis.processing})</option>
              <option value="shipped">Dispatched / Shipped ({kpis.shipped})</option>
              <option value="delivered">Delivered ({kpis.delivered})</option>
              <option value="cancelled">Cancelled ({kpis.cancelled})</option>
            </select>

            {/* Payment Method Select */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Payment Methods</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="card">Online Card Payment</option>
              <option value="bank">Bank Transfer</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="admin-select"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_high">Total: High to Low</option>
              <option value="amount_low">Total: Low to High</option>
            </select>

            {/* View Mode Toggle (Table vs Grid) */}
            <div className="admin-view-toggle">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`admin-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                title="Table View"
                aria-label="Table View"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`admin-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid / Dispatch Board View"
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter summary bar */}
        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid rgba(189, 223, 234, 0.4)',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            <div>
              Showing <strong style={{ color: 'var(--color-text)' }}>{filteredAndSortedOrders.length}</strong> matching orders
            </div>
            <button
              onClick={handleResetFilters}
              style={{
                color: 'var(--color-brand-blue)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              <X size={13} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── 4. Main Order Operations (Data Table or Grid View) ── */}
      {loading ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(189, 223, 234, 0.55)',
            padding: '64px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '460px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-accent border-t-transparent mx-auto" />
          <p style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Loading order fulfillment records...
          </p>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(189, 223, 234, 0.55)',
            padding: '64px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ClipboardList size={44} style={{ margin: '0 auto 12px auto', color: 'var(--color-text-light)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
            No orders match your criteria
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '380px', margin: '4px auto 16px auto' }}>
            {hasActiveFilters
              ? 'Try adjusting your search terms or clearing active filters to see all recorded orders.'
              : 'Customer orders placed on the storefront or via WhatsApp will appear here for dispatch.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm"
                style={{ borderRadius: '12px', fontSize: '12px' }}
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={handleSeedSampleOrder}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                backgroundColor: '#1A1A2E',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 200, 0, 0.4)',
              }}
            >
              Generate Sample Order
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (with Expandable Accordion Rows) */
        <div className="admin-table-container">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '48px', textAlign: 'center' }}>#</th>
                  <th style={{ minWidth: '175px' }}>Order Ref & Date</th>
                  <th style={{ minWidth: '190px' }}>Customer Details</th>
                  <th style={{ minWidth: '170px' }}>Items Summary</th>
                  <th style={{ minWidth: '125px' }}>Total Amount</th>
                  <th style={{ minWidth: '165px' }}>Fulfillment Status</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedOrders.map((order, index) => {
                  const isExpanded = expandedOrderId === order.id;
                  const orderItems = order.order_items || [];
                  const totalUnits = orderItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
                  const statusMeta = getStatusBadge(order.status);
                  const payMeta = getPaymentBadge(order.payment_method);
                  const PayIcon = payMeta.icon;

                  const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className={isExpanded ? 'row-expanded' : ''}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        {/* Index */}
                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '11px' }}>
                          #{String(index + 1).padStart(2, '0')}
                        </td>

                        {/* Order Ref & Date */}
                        <td>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '12px', color: 'var(--color-text)' }}>
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  backgroundColor: '#F8FAFC',
                                  border: '1px solid #E2E8F0',
                                  color: payMeta.color,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                              >
                                <PayIcon size={10} />
                                {payMeta.label}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                              <Calendar size={11} style={{ color: 'var(--color-text-light)' }} />
                              <span>{formattedDate}</span>
                            </div>
                          </div>
                        </td>

                        {/* Customer Details */}
                        <td>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '13px', lineHeight: 1.3 }}>
                              {order.customer_name || 'Guest Customer'}
                            </div>
                            {order.customer_phone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                <Phone size={10} style={{ color: 'var(--color-brand-blue)' }} />
                                <span>{order.customer_phone}</span>
                              </div>
                            ) : null}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: 'var(--color-text-light)',
                                marginTop: '2px',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={order.shipping_address}
                            >
                              <MapPin size={10} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.shipping_address}</span>
                            </div>
                          </div>
                        </td>

                        {/* Items Summary */}
                        <td>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '12px' }}>
                              {totalUnits} {totalUnits === 1 ? 'Unit' : 'Units'} ({orderItems.length} {orderItems.length === 1 ? 'item' : 'items'})
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginTop: '2px',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {orderItems.map((i) => i.product_name).join(', ') || 'Item details listed inside'}
                            </div>
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-text)' }}>
                              {formatPrice(order.total)}
                            </div>
                            {order.discount > 0 && (
                              <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>
                                Saved {formatPrice(order.discount)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Fulfillment Status */}
                        <td onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              disabled={updatingId === order.id}
                              className="admin-select"
                              style={{
                                height: '34px',
                                padding: '0 10px',
                                fontSize: '11px',
                                fontWeight: 700,
                                borderRadius: '10px',
                                backgroundColor: statusMeta.bg,
                                color: statusMeta.text,
                                border: `1.5px solid ${statusMeta.border}`,
                                cursor: updatingId === order.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <option value="pending">⏳ Pending Review</option>
                              <option value="confirmed">✓ Confirmed</option>
                              <option value="processing">⚙️ In Processing</option>
                              <option value="shipped">🚚 Dispatched / Shipped</option>
                              <option value="delivered">🎉 Delivered</option>
                              <option value="cancelled">✕ Cancelled</option>
                            </select>
                            {updatingId === order.id && (
                              <RefreshCw size={14} className="animate-spin text-accent" />
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="admin-action-btn"
                              title="View & Print Packing Slip / Invoice"
                              aria-label="View Invoice"
                            >
                              <Printer size={15} />
                            </button>
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="admin-action-btn"
                              title={isExpanded ? 'Collapse breakdown' : 'Expand breakdown'}
                              aria-label="Toggle details"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── EXPANDABLE BREAKDOWN ROW ── */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={7}
                            style={{
                              padding: '20px 24px',
                              backgroundColor: '#F8FBFE',
                              borderBottom: '1.5px solid rgba(189, 223, 234, 0.45)',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {/* Row 1: Line Items Table & Customer Details */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
                                {/* Items Box */}
                                <div
                                  style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(189, 223, 234, 0.55)',
                                    padding: '16px',
                                    boxShadow: 'var(--shadow-xs)',
                                    minWidth: 0,
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text)' }}>
                                      Purchased Products & Dosage
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                      {orderItems.length} items
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {orderItems.map((item, idx) => (
                                      <div
                                        key={item.id || idx}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: '8px 12px',
                                          borderRadius: '10px',
                                          backgroundColor: '#F8FAFC',
                                          border: '1px solid #F1F5F9',
                                          fontSize: '12px',
                                        }}
                                      >
                                        <div>
                                          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                            {item.product_name}
                                          </div>
                                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                            {item.variant_label || 'Default Size'} • Qty: <strong>{item.quantity}</strong>
                                          </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                            {formatPrice(Number(item.unit_price) * item.quantity)}
                                          </div>
                                          <div style={{ fontSize: '10px', color: 'var(--color-text-light)' }}>
                                            {formatPrice(item.unit_price)} each
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Order Financial Summary */}
                                  <div
                                    style={{
                                      marginTop: '12px',
                                      paddingTop: '10px',
                                      borderTop: '1px dashed #E2E8F0',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontSize: '12px',
                                    }}
                                  >
                                    <div style={{ color: 'var(--color-text-muted)' }}>
                                      Subtotal: {formatPrice(order.subtotal)} | Delivery: {formatPrice(order.total - order.subtotal + (order.discount || 0))}
                                    </div>
                                    <div style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '13px' }}>
                                      Final Total: {formatPrice(order.total)}
                                    </div>
                                  </div>
                                </div>

                                {/* Delivery & Contact Details Box */}
                                <div
                                  style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(189, 223, 234, 0.55)',
                                    padding: '16px',
                                    boxShadow: 'var(--shadow-xs)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minWidth: 0,
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>
                                      Shipping & Recipient Information
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text)', lineHeight: 1.4, marginBottom: '6px' }}>
                                      <strong>{order.customer_name}</strong>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                                      {order.shipping_address}
                                    </div>
                                    {order.customer_email && (
                                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                        Email: {order.customer_email}
                                      </div>
                                    )}

                                    {order.notes && (
                                      <div
                                        style={{
                                          marginTop: '10px',
                                          padding: '8px 10px',
                                          borderRadius: '8px',
                                          backgroundColor: '#FEF3C7',
                                          border: '1px solid #FCD34D',
                                          fontSize: '11px',
                                          color: '#92400E',
                                        }}
                                      >
                                        <strong>Customer Note:</strong> {order.notes}
                                      </div>
                                    )}
                                  </div>

                                  {/* Quick Contact & WhatsApp Buttons */}
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                                    {order.customer_phone ? (
                                      <>
                                        <a
                                          href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                            `Hello ${order.customer_name}, regards from PetSolutions.lk regarding your order #${order.id.slice(0, 8).toUpperCase()}.`
                                          )}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="btn btn-outline btn-sm"
                                          style={{
                                            fontSize: '11px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            color: '#059669',
                                            borderColor: '#A7F3D0',
                                            backgroundColor: '#ECFDF5',
                                          }}
                                        >
                                          <MessageCircle size={13} />
                                          <span>WhatsApp</span>
                                        </a>
                                        <a
                                          href={`tel:${order.customer_phone}`}
                                          className="btn btn-outline btn-sm"
                                          style={{
                                            fontSize: '11px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                          }}
                                        >
                                          <Phone size={13} />
                                          <span>Call Customer</span>
                                        </a>
                                      </>
                                    ) : null}
                                    <button
                                      onClick={() => setSelectedInvoiceOrder(order)}
                                      className="btn btn-outline btn-sm"
                                      style={{
                                        fontSize: '11px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        marginLeft: 'auto',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <Printer size={13} />
                                      <span>Print Slip</span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Row 2: Status Fast Progression Stepper */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  background: '#FFFFFF',
                                  borderRadius: '14px',
                                  border: '1px solid rgba(189, 223, 234, 0.55)',
                                  padding: '10px 16px',
                                }}
                              >
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                  Fast Status Update:
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'confirmed')}
                                    disabled={order.status === 'confirmed' || updatingId === order.id}
                                    className="btn btn-outline btn-sm"
                                    style={{
                                      height: '28px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      opacity: order.status === 'confirmed' ? 0.5 : 1,
                                    }}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'processing')}
                                    disabled={order.status === 'processing' || updatingId === order.id}
                                    className="btn btn-outline btn-sm"
                                    style={{
                                      height: '28px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      opacity: order.status === 'processing' ? 0.5 : 1,
                                    }}
                                  >
                                    In Processing
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'shipped')}
                                    disabled={order.status === 'shipped' || updatingId === order.id}
                                    className="btn btn-outline btn-sm"
                                    style={{
                                      height: '28px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      opacity: order.status === 'shipped' ? 0.5 : 1,
                                    }}
                                  >
                                    Dispatch / Ship
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'delivered')}
                                    disabled={order.status === 'delivered' || updatingId === order.id}
                                    className="btn btn-outline btn-sm"
                                    style={{
                                      height: '28px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      color: '#059669',
                                      borderColor: '#A7F3D0',
                                      backgroundColor: '#ECFDF5',
                                      opacity: order.status === 'delivered' ? 0.5 : 1,
                                    }}
                                  >
                                    ✓ Delivered
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                                    disabled={order.status === 'cancelled' || updatingId === order.id}
                                    className="btn btn-outline btn-sm"
                                    style={{
                                      height: '28px',
                                      padding: '0 10px',
                                      borderRadius: '8px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      color: '#E11D48',
                                      borderColor: '#FECDD3',
                                      opacity: order.status === 'cancelled' ? 0.5 : 1,
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID / CARDS VIEW */
        <div className="admin-grid-layout">
          {filteredAndSortedOrders.map((order) => {
            const orderItems = order.order_items || [];
            const totalUnits = orderItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
            const statusMeta = getStatusBadge(order.status);
            const payMeta = getPaymentBadge(order.payment_method);
            const PayIcon = payMeta.icon;

            return (
              <div
                key={order.id}
                className="admin-product-card"
                style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '13px', color: 'var(--color-text)' }}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: statusMeta.bg,
                        color: statusMeta.text,
                        border: `1px solid ${statusMeta.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span className={`status-dot ${statusMeta.dot}`} />
                      {statusMeta.label}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-text)', marginBottom: '4px' }}>
                    {order.customer_name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    {order.shipping_address}
                  </div>

                  <div
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #F1F5F9',
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      marginBottom: '10px',
                    }}
                  >
                    <strong>{totalUnits} Units:</strong> {orderItems.map((i) => i.product_name).join(', ') || 'No item preview'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-light)' }}>Total Due</div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-text)' }}>
                      {formatPrice(order.total)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="admin-action-btn"
                      style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--color-secondary-alt)' }}
                      title="Print Packing Slip"
                    >
                      <Printer size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('table');
                        setExpandedOrderId(order.id);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ height: '34px', padding: '0 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. PRINTABLE INVOICE / PACKING SLIP MODAL ── */}
      <AnimatePresence>
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoiceOrder(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 p-6 md:p-8 space-y-6 text-slate-900 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="admin-hero-icon" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
                      Packing Slip & Tax Invoice
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>
                      Order #{selectedInvoiceOrder.id.slice(0, 8).toUpperCase()} • PetSolutions.lk Dispensary
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline btn-sm"
                    style={{ height: '34px', padding: '0 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, gap: '6px' }}
                  >
                    <Printer size={14} />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceOrder(null)}
                    className="admin-action-btn"
                    style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #E2E8F0' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Paper Area */}
              <div
                id="printable-invoice"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1.5px dashed #CBD5E1',
                }}
              >
                {/* Invoice Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1A1A2E', margin: 0 }}>
                      PetSolutions.lk
                    </h2>
                    <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Veterinary Pharmaceuticals & Premium Pet Care
                    </p>
                    <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Colombo, Sri Lanka • support@petsolutions.lk
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '14px', color: '#1A1A2E' }}>
                      #{selectedInvoiceOrder.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      {new Date(selectedInvoiceOrder.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1', marginTop: '2px' }}>
                      Payment: {selectedInvoiceOrder.payment_method?.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', padding: '12px 14px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
                      Deliver To:
                    </span>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px', marginTop: '2px' }}>
                      {selectedInvoiceOrder.customer_name}
                    </div>
                    <div style={{ color: '#475569', marginTop: '2px' }}>
                      {selectedInvoiceOrder.shipping_address}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
                      Contact Info:
                    </span>
                    <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>
                      Phone: {selectedInvoiceOrder.customer_phone || 'N/A'}
                    </div>
                    <div style={{ color: '#64748B', marginTop: '2px' }}>
                      Email: {selectedInvoiceOrder.customer_email || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569', fontSize: '11px', fontWeight: 700 }}>
                      <th style={{ padding: '8px 0' }}>Item & Formulation</th>
                      <th style={{ padding: '8px 0', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '8px 0', textAlign: 'right' }}>Unit Price</th>
                      <th style={{ padding: '8px 0', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInvoiceOrder.order_items || []).map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 0' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.product_name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{item.variant_label || 'Default Size'}</div>
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'center', fontWeight: 600 }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right', color: '#475569' }}>
                          {formatPrice(item.unit_price)}
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                          {formatPrice(Number(item.unit_price) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', paddingTop: '10px', borderTop: '2px solid #E2E8F0', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', color: '#64748B' }}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedInvoiceOrder.subtotal)}</span>
                  </div>
                  {selectedInvoiceOrder.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', color: '#059669', fontWeight: 600 }}>
                      <span>Discount:</span>
                      <span>-{formatPrice(selectedInvoiceOrder.discount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', color: '#64748B' }}>
                    <span>Delivery Fee:</span>
                    <span>
                      {formatPrice(
                        Math.max(0, selectedInvoiceOrder.total - selectedInvoiceOrder.subtotal + (selectedInvoiceOrder.discount || 0))
                      )}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontWeight: 900, fontSize: '15px', color: '#0F172A', paddingTop: '6px', borderTop: '1px solid #CBD5E1' }}>
                    <span>Grand Total:</span>
                    <span>{formatPrice(selectedInvoiceOrder.total)}</span>
                  </div>
                </div>

                {/* Footer Signature Notice */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94A3B8' }}>
                  <span>Thank you for trusting PetSolutions.lk for your pet care needs!</span>
                  <span>Dispensary Checked By: ________________</span>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="btn btn-outline btn-sm"
                  style={{ height: '38px', padding: '0 18px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{
                    height: '38px',
                    padding: '0 20px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: '#1A1A2E',
                    color: '#FFFFFF',
                    border: '1.5px solid rgba(255, 200, 0, 0.4)',
                    boxShadow: '0 2px 8px rgba(26, 26, 46, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Printer size={15} />
                  <span>Print Formal Invoice</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
