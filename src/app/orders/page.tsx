'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Package,
  Clock,
  Truck,
  ChevronDown,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  ShoppingBag,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils/formatPrice';
import { createBrowserClient } from '@/lib/supabase/client';
import { PRODUCT_IMAGE_MAP } from '@/lib/data/productImageMap';

/* ==========================================================================
   Types
   ========================================================================== */

interface ProductJoin {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

interface OrderItemWithProduct {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_label: string | null;
  quantity: number;
  unit_price: number;
  product?: ProductJoin | null;
}

interface OrderRecord {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  payment_method: string;
  shipping_address: string;
  customer_phone: string;
  customer_name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItemWithProduct[];
}

/* ==========================================================================
   Stepper Status Map
   ========================================================================== */

const STEPPER_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: ShoppingBag },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'On the Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PartyPopper },
] as const;

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed':
    case 'processing': return 1;
    case 'shipped': return 2;
    case 'delivered': return 3;
    case 'cancelled': return -1;
    default: return 0;
  }
}

/* ==========================================================================
   Image Resolver — uses PRODUCT_IMAGE_MAP for high-res images
   ========================================================================== */

function resolveItemImage(item: OrderItemWithProduct): string | null {
  // 1. Check if the joined product has a direct image_url via Supabase CDN
  if (item.product?.image_url && item.product.image_url.startsWith('http')) {
    return item.product.image_url;
  }

  // 2. Resolve from PRODUCT_IMAGE_MAP via slug or product_id
  if (item.product?.slug && PRODUCT_IMAGE_MAP[item.product.slug]) {
    return PRODUCT_IMAGE_MAP[item.product.slug].image_url;
  }
  if (item.product?.id && PRODUCT_IMAGE_MAP[item.product.id]) {
    return PRODUCT_IMAGE_MAP[item.product.id].image_url;
  }
  if (item.product_id && PRODUCT_IMAGE_MAP[item.product_id]) {
    return PRODUCT_IMAGE_MAP[item.product_id].image_url;
  }

  return null;
}

/* ==========================================================================
   Spring config for Framer Motion
   ========================================================================== */

const springTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* ==========================================================================
   Component
   ========================================================================== */

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reorderStatus, setReorderStatus] = useState<Record<string, boolean>>({});
  const [markingDelivered, setMarkingDelivered] = useState<Record<string, boolean>>({});

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/orders');
    }
  }, [user, authLoading, router]);

  // Fetch orders with product joins
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const supabase = createBrowserClient();

        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*, product:products(id, name, slug, image_url))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders((data as OrderRecord[]) || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Mark as delivered with optimistic UI
  const handleMarkDelivered = useCallback(
    async (orderId: string) => {
      setMarkingDelivered((prev) => ({ ...prev, [orderId]: true }));

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'delivered' } : o
        )
      );

      try {
        const supabase = createBrowserClient();
        const { error } = await supabase
          .from('orders')
          .update({ status: 'delivered' })
          .eq('id', orderId);

        if (error) throw error;

        toast.success('Order marked as delivered!', {
          description: 'Thank you for confirming receipt of your order.',
          icon: <PartyPopper size={18} />,
        });
      } catch (err) {
        console.error('Error marking delivered:', err);
        // Revert optimistic update
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: 'shipped' } : o
          )
        );
        toast.error('Could not update order status. Please try again.');
      } finally {
        setMarkingDelivered((prev) => ({ ...prev, [orderId]: false }));
      }
    },
    []
  );

  // Reorder handler
  const handleReorder = useCallback(
    async (order: OrderRecord) => {
      setReorderStatus((prev) => ({ ...prev, [order.id]: true }));

      try {
        for (const item of order.order_items) {
          if (item.variant_id) {
            await addItem(item.variant_id, item.quantity);
          }
        }
        router.push('/cart');
      } catch (err) {
        console.error('Error during reorder:', err);
        toast.error('Could not reorder all items. Some may be out of stock.');
      } finally {
        setReorderStatus((prev) => ({ ...prev, [order.id]: false }));
      }
    },
    [addItem, router]
  );

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'card': return 'Online Card Payment';
      case 'bank': return 'Bank Transfer';
      case 'cod':
      default: return 'Cash on Delivery';
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard size={13} />;
      default: return <Banknote size={13} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'On the Way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return { bg: '#FFF8D6', text: '#854D0E', border: '#FDE047' };
      case 'shipped': return { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' };
      case 'confirmed':
      case 'processing': return { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' };
      case 'pending': return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' };
      default: return { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
    }
  };

  // ── Auth gate ──
  if (authLoading || !user) {
    return (
      <>
        <Header />
        <main className="min-h-[80vh] py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ background: 'var(--color-secondary)' }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* ── Page Title ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="mb-8"
          >
            <h1
              className="font-heading font-extrabold text-text flex items-center gap-3"
              style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.5vw, 2rem)' }}
            >
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 42,
                  height: 42,
                  background: 'var(--color-accent-light)',
                  color: 'var(--color-accent-hover)',
                }}
              >
                <ClipboardList size={22} />
              </div>
              Your Orders
            </h1>
            <p className="text-text-muted text-sm mt-2 ml-[54px]">
              Track deliveries, confirm receipts, and reorder your favorites.
            </p>
          </motion.div>

          {/* ── Loading State ── */}
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid var(--color-secondary-alt)',
                    background: 'var(--white)',
                  }}
                >
                  {/* Skeleton header */}
                  <div className="p-5 flex flex-col md:flex-row justify-between gap-4" style={{ background: 'rgba(230,244,248,0.3)' }}>
                    <div className="space-y-3">
                      <div className="h-4 w-36 rounded-md animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                      <div className="h-3 w-24 rounded-md animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-20 rounded-lg animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                      <div className="h-8 w-24 rounded-lg animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                    </div>
                  </div>
                  {/* Skeleton stepper */}
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between gap-2">
                      {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex-1 flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full animate-pulse" style={{ background: 'var(--color-secondary)', animationDelay: `${s * 0.15}s` }} />
                          <div className="h-2 flex-1 rounded animate-pulse" style={{ background: 'var(--color-secondary)', animationDelay: `${s * 0.15}s` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Skeleton items */}
                  <div className="px-5 pb-5">
                    <div className="flex gap-3">
                      <div className="h-14 w-14 rounded-xl animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                        <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: 'var(--color-secondary)' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          /* ── Empty State ── */
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="text-center py-16 px-6 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--color-secondary-alt)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div
                className="flex items-center justify-center rounded-2xl mb-5"
                style={{
                  width: 72,
                  height: 72,
                  background: 'var(--color-accent-light)',
                  color: 'var(--color-accent-hover)',
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h2 className="font-heading font-bold text-lg text-text mb-1.5">
                No orders yet
              </h2>
              <p className="text-sm text-text-muted mb-6 max-w-xs">
                When you place your first order, it will appear here with full tracking details.
              </p>
              <Link
                href="/products"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <ShoppingBag size={15} />
                Browse Products
              </Link>
            </motion.div>

          /* ── Orders List ── */
          ) : (
            <div className="space-y-6">
              {orders.map((order, orderIndex) => {
                const isExpanded = expandedOrder === order.id;
                const stepIndex = getStepIndex(order.status);
                const isCancelled = order.status === 'cancelled';
                const statusColor = getStatusColor(order.status);

                const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: orderIndex * 0.08,
                      ease: easeOutExpo,
                    }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'var(--white)',
                      border: '1px solid var(--color-secondary-alt)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* ── Order Header ── */}
                    <div
                      className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(230,244,248,0.25), transparent)',
                        borderBottom: '1px solid var(--color-secondary)',
                      }}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="font-mono font-bold text-text"
                            style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
                          >
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 font-semibold rounded-full"
                            style={{
                              fontSize: '10.5px',
                              padding: '2px 10px',
                              background: statusColor.bg,
                              color: statusColor.text,
                              border: `1px solid ${statusColor.border}`,
                              letterSpacing: '0.02em',
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: statusColor.text,
                                display: 'inline-block',
                              }}
                            />
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-muted" style={{ fontSize: '12px' }}>
                          <Calendar size={12} />
                          {formattedDate}
                          <span style={{ color: 'var(--color-secondary-alt)' }}>·</span>
                          <span>{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-text-muted" style={{ fontSize: '10px', fontWeight: 500 }}>Total</p>
                          <p className="font-heading font-bold text-accent" style={{ fontSize: '16px' }}>
                            {formatPrice(order.total)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* ✓ Mark as Received — only when shipped */}
                          {order.status === 'shipped' && (
                            <motion.button
                              onClick={() => handleMarkDelivered(order.id)}
                              disabled={markingDelivered[order.id]}
                              whileTap={{ scale: 0.97 }}
                              className="inline-flex items-center gap-1.5 font-bold rounded-full cursor-pointer shadow-sm"
                              style={{
                                fontSize: '11.5px',
                                padding: '6px 14px',
                                background: 'var(--color-accent)',
                                color: 'var(--color-text)',
                                border: '1px solid var(--color-accent-hover)',
                                transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
                                opacity: markingDelivered[order.id] ? 0.7 : 1,
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent-hover)';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent)';
                              }}
                            >
                              {markingDelivered[order.id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-text" />
                              ) : (
                                <>
                                  <CheckCircle2 size={13} />
                                  Mark as Received
                                </>
                              )}
                            </motion.button>
                          )}

                          {/* Reorder */}
                          <motion.button
                            onClick={() => handleReorder(order)}
                            disabled={reorderStatus[order.id]}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 font-semibold rounded-full cursor-pointer"
                            style={{
                              fontSize: '11.5px',
                              padding: '6px 14px',
                              background: 'transparent',
                              color: 'var(--color-text)',
                              border: '1px solid var(--color-secondary-alt)',
                              transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-secondary)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                            }}
                          >
                            {reorderStatus[order.id] ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-accent" />
                            ) : (
                              <>
                                <RotateCcw size={12} />
                                Reorder
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* ── 4-Step Delivery Stepper ── */}
                    {!isCancelled && (
                      <div className="px-5 py-4" style={{ background: 'rgba(254,252,243,0.4)' }}>
                        <div className="flex items-center w-full">
                          {STEPPER_STEPS.map((step, i) => {
                            const isActive = i <= stepIndex;
                            const isCurrent = i === stepIndex;
                            const StepIcon = step.icon;

                            return (
                              <div
                                key={step.key}
                                className="flex items-center"
                                style={{ flex: i < STEPPER_STEPS.length - 1 ? 1 : 'none' }}
                              >
                                {/* Step circle */}
                                <motion.div
                                  initial={false}
                                  animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    background: isActive ? 'var(--color-accent)' : 'var(--color-secondary)',
                                  }}
                                  transition={springTransition}
                                  className="relative flex items-center justify-center rounded-full shrink-0"
                                  style={{
                                    width: 30,
                                    height: 30,
                                    boxShadow: isCurrent
                                      ? '0 0 0 3px rgba(255,200,0,0.35)'
                                      : 'none',
                                  }}
                                >
                                  <StepIcon
                                    size={14}
                                    style={{
                                      color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                                    }}
                                  />
                                  {isCurrent && isActive && (
                                    <motion.span
                                      className="absolute inset-0 rounded-full"
                                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                      style={{ background: 'var(--color-accent)' }}
                                    />
                                  )}
                                </motion.div>

                                {/* Step label (hidden on mobile except current) */}
                                <span
                                  className="font-bold ml-1.5 hidden md:inline whitespace-nowrap"
                                  style={{
                                    fontSize: '10.5px',
                                    color: isActive
                                      ? 'var(--color-text)'
                                      : 'var(--color-text-light)',
                                  }}
                                >
                                  {step.label}
                                </span>

                                {/* Connector line */}
                                {i < STEPPER_STEPS.length - 1 && (
                                  <div
                                    className="flex-1 mx-2 md:mx-3 relative"
                                    style={{ height: 2 }}
                                  >
                                    <div
                                      className="absolute inset-0 rounded-full"
                                      style={{ background: 'var(--color-secondary)' }}
                                    />
                                    <motion.div
                                      className="absolute inset-y-0 left-0 rounded-full"
                                      initial={false}
                                      animate={{
                                        width: i < stepIndex ? '100%' : '0%',
                                      }}
                                      transition={{
                                        duration: 0.6,
                                        ease: easeOutExpo,
                                        delay: i * 0.15,
                                      }}
                                      style={{ background: 'var(--color-accent)' }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Mobile current label */}
                        <p
                          className="md:hidden text-center mt-2 font-bold"
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text)',
                          }}
                        >
                          {stepIndex >= 0 ? STEPPER_STEPS[stepIndex]?.label : 'Cancelled'}
                        </p>
                      </div>
                    )}

                    {/* Cancelled banner */}
                    {isCancelled && (
                      <div
                        className="px-5 py-3 text-center font-semibold"
                        style={{
                          fontSize: '12px',
                          background: '#FEF2F2',
                          color: '#991B1B',
                          borderBottom: '1px solid #FECACA',
                        }}
                      >
                        This order has been cancelled
                      </div>
                    )}

                    {/* ── Product Items Preview ── */}
                    <div className="px-5 py-4">
                      <div className="space-y-3">
                        {order.order_items.slice(0, 3).map((item) => {
                          const imageUrl = resolveItemImage(item);

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              {/* Product thumbnail */}
                              <div
                                className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                                style={{
                                  width: 56,
                                  height: 56,
                                  background: 'var(--color-secondary)',
                                  border: '1px solid var(--color-secondary-alt)',
                                }}
                              >
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <Package
                                    size={20}
                                    style={{ color: 'var(--color-text-light)' }}
                                  />
                                )}
                              </div>

                              {/* Product details */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className="font-semibold text-text truncate"
                                  style={{ fontSize: '13px' }}
                                >
                                  {item.product_name}
                                </p>
                                <p className="text-text-muted" style={{ fontSize: '11px' }}>
                                  {item.variant_label && (
                                    <span>{item.variant_label} · </span>
                                  )}
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              {/* Item total */}
                              <div className="text-right shrink-0">
                                <p className="font-semibold text-text" style={{ fontSize: '13px' }}>
                                  {formatPrice(item.unit_price * item.quantity)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-text-muted" style={{ fontSize: '10px' }}>
                                    {formatPrice(item.unit_price)} each
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {order.order_items.length > 3 && !isExpanded && (
                          <p className="text-text-muted text-center" style={{ fontSize: '11px' }}>
                            +{order.order_items.length - 3} more item{order.order_items.length - 3 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ── Invoice / Details Toggle ── */}
                    <div
                      style={{ borderTop: '1px solid var(--color-secondary)' }}
                    >
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="w-full px-5 py-3 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-muted)',
                          background: 'transparent',
                          border: 'none',
                          transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(230,244,248,0.35)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        {isExpanded ? 'Hide Details' : 'View Invoice & Details'}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: easeOutExpo }}
                        >
                          <ChevronDown size={14} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: easeOutExpo }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-5 pb-5 space-y-4"
                              style={{ borderTop: '1px solid var(--color-secondary)' }}
                            >
                              {/* Extra items (beyond the 3 preview) */}
                              {order.order_items.length > 3 && (
                                <div className="space-y-3 pt-4">
                                  <p
                                    className="font-semibold text-text-muted uppercase"
                                    style={{ fontSize: '10px', letterSpacing: '0.08em' }}
                                  >
                                    All Items
                                  </p>
                                  {order.order_items.slice(3).map((item) => {
                                    const imageUrl = resolveItemImage(item);
                                    return (
                                      <div key={item.id} className="flex items-center gap-3">
                                        <div
                                          className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                                          style={{
                                            width: 48,
                                            height: 48,
                                            background: 'var(--color-secondary)',
                                            border: '1px solid var(--color-secondary-alt)',
                                          }}
                                        >
                                          {imageUrl ? (
                                            <img
                                              src={imageUrl}
                                              alt={item.product_name}
                                              className="w-full h-full object-cover"
                                              loading="lazy"
                                            />
                                          ) : (
                                            <Package size={16} style={{ color: 'var(--color-text-light)' }} />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-text truncate" style={{ fontSize: '12px' }}>
                                            {item.product_name}
                                          </p>
                                          <p className="text-text-muted" style={{ fontSize: '10px' }}>
                                            {item.variant_label && <span>{item.variant_label} · </span>}
                                            Qty: {item.quantity}
                                          </p>
                                        </div>
                                        <p className="font-semibold text-text shrink-0" style={{ fontSize: '12px' }}>
                                          {formatPrice(item.unit_price * item.quantity)}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Order Summary */}
                              <div
                                className="rounded-xl p-4 space-y-2.5"
                                style={{
                                  background: 'rgba(230,244,248,0.3)',
                                  border: '1px solid var(--color-secondary)',
                                }}
                              >
                                <p
                                  className="font-semibold text-text-muted uppercase mb-3"
                                  style={{ fontSize: '10px', letterSpacing: '0.08em' }}
                                >
                                  Order Summary
                                </p>

                                <div className="flex justify-between" style={{ fontSize: '12px' }}>
                                  <span className="text-text-muted">Subtotal</span>
                                  <span className="font-medium text-text">{formatPrice(order.subtotal)}</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between" style={{ fontSize: '12px' }}>
                                    <span className="text-text-muted">Discount</span>
                                    <span className="font-semibold" style={{ color: '#D97706' }}>
                                      -{formatPrice(order.discount)}
                                    </span>
                                  </div>
                                )}
                                <div
                                  className="flex justify-between pt-2.5"
                                  style={{
                                    fontSize: '13px',
                                    borderTop: '1px dashed var(--color-secondary-alt)',
                                  }}
                                >
                                  <span className="font-bold text-text">Total</span>
                                  <span className="font-bold text-accent" style={{ fontSize: '14px' }}>
                                    {formatPrice(order.total)}
                                  </span>
                                </div>
                              </div>

                              {/* Delivery & Payment Details */}
                              <div
                                className="rounded-xl p-4 space-y-3"
                                style={{
                                  background: 'rgba(230,244,248,0.3)',
                                  border: '1px solid var(--color-secondary)',
                                }}
                              >
                                <p
                                  className="font-semibold text-text-muted uppercase mb-3"
                                  style={{ fontSize: '10px', letterSpacing: '0.08em' }}
                                >
                                  Delivery & Payment
                                </p>

                                {order.shipping_address && (
                                  <div className="flex items-start gap-2.5" style={{ fontSize: '12px' }}>
                                    <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-text-muted)' }} />
                                    <div>
                                      <p className="text-text-muted" style={{ fontSize: '10px', fontWeight: 600 }}>
                                        Shipping Address
                                      </p>
                                      <p className="text-text">{order.shipping_address}</p>
                                    </div>
                                  </div>
                                )}

                                {order.customer_phone && (
                                  <div className="flex items-start gap-2.5" style={{ fontSize: '12px' }}>
                                    <Phone size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-text-muted)' }} />
                                    <div>
                                      <p className="text-text-muted" style={{ fontSize: '10px', fontWeight: 600 }}>
                                        Contact Number
                                      </p>
                                      <p className="text-text">{order.customer_phone}</p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start gap-2.5" style={{ fontSize: '12px' }}>
                                  {getPaymentIcon(order.payment_method)}
                                  <div>
                                    <p className="text-text-muted" style={{ fontSize: '10px', fontWeight: 600 }}>
                                      Payment Method
                                    </p>
                                    <p className="text-text">{formatPaymentMethod(order.payment_method)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
