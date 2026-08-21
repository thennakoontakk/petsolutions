'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ArrowRight, ShoppingCart, RotateCcw, Calendar, CheckCircle2, Package, Clock, Eye } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils/formatPrice';
import { createBrowserClient } from '@/lib/supabase/client';

interface OrderItem {
  id: string;
  product_name: string;
  variant_label: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  payment_method: string;
  shipping_address: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reorderStatus, setReorderStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/orders');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const supabase = createBrowserClient();
        
        // Fetch orders with order items
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
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

  if (authLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const handleReorder = async (order: Order) => {
    setReorderStatus((prev) => ({ ...prev, [order.id]: true }));
    
    try {
      // Add each item in order to cart
      for (const item of order.order_items) {
        if (item.variant_id) {
          await addItem(item.variant_id, item.quantity);
        }
      }
      
      // Redirect to cart
      router.push('/cart');
    } catch (err) {
      console.error('Error during reorder:', err);
      alert('Could not reorder all items. Some items might be out of stock.');
    } finally {
      setReorderStatus((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="text-success" size={16} />;
      case 'pending':
        return <Clock className="text-warning" size={16} />;
      case 'shipped':
        return <Package className="text-accent" size={16} />;
      case 'confirmed':
      case 'processing':
        return <Package className="text-info" size={16} />;
      default:
        return <Package className="text-info" size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-success';
      case 'processing':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'card':
        return 'Online Card (Instant Approval)';
      case 'bank':
        return 'Bank Transfer';
      case 'cod':
      default:
        return 'Cash on Delivery';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text mb-6 flex items-center gap-2">
            <ClipboardList className="text-accent" /> Shopping History
          </h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="glass p-6 rounded-2xl h-32 animate-pulse bg-secondary/30" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl space-y-6 flex flex-col items-center justify-center">
              <div className="p-4 bg-accent/10 rounded-full text-accent">
                <ClipboardList size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading font-semibold text-lg">No orders found</h2>
                <p className="text-xs text-text-muted">You haven't placed any orders yet. Explore our catalog and place your first order!</p>
              </div>
              <Link href="/products" className="btn btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div
                    key={order.id}
                    className="glass rounded-2xl border border-secondary-alt/25 overflow-hidden transition-all duration-300"
                  >
                    {/* Order summary bar */}
                    <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 border-b border-secondary/40">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-text truncate max-w-[150px]">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`badge ${getStatusClass(order.status)} text-[10px]`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Calendar size={12} /> {formattedDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[10px] text-text-muted">Total Amount</p>
                          <p className="font-heading font-bold text-base text-accent">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="p-2 hover:bg-secondary/40 rounded-full transition-colors text-text-muted hover:text-text"
                            title="View Items"
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleReorder(order)}
                            disabled={reorderStatus[order.id]}
                            className="btn btn-outline btn-sm flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3"
                          >
                            {reorderStatus[order.id] ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-accent" />
                            ) : (
                              <>
                                <RotateCcw size={12} /> Reorder
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Order Items Expandable section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-secondary-alt/20 bg-secondary/10 overflow-hidden"
                        >
                          <div className="p-5 space-y-4">
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                              Items Ordered ({order.order_items.length})
                            </h4>

                            <div className="space-y-3">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-secondary/35 text-xs last:border-0">
                                  <div>
                                    <p className="font-semibold text-text">{item.product_name}</p>
                                    <p className="text-[10px] text-text-muted">
                                      Size: {item.variant_label} x {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{formatPrice(item.unit_price * item.quantity)}</p>
                                    <p className="text-[10px] text-text-muted">({formatPrice(item.unit_price)} each)</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white/40 p-4 rounded-xl border border-secondary-alt/25 mt-4 text-xs space-y-2">
                              <p><span className="font-semibold text-text">Shipping Address:</span> {order.shipping_address}</p>
                              <p><span className="font-semibold text-text">Payment Method:</span> {formatPaymentMethod(order.payment_method)}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
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
