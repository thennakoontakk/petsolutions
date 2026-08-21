'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Filter, Eye, RefreshCw } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Could not update order status.');
    }
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
            <ClipboardList className="text-accent" /> Orders Operations
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Track customer orders, confirm payments, and update delivery statuses.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn btn-outline btn-sm p-2 rounded-xl text-text-muted hover:text-text"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter status tab bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-text-muted flex items-center gap-1 mr-2">
          <Filter size={14} /> Filter Status:
        </span>
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            statusFilter === 'All'
              ? 'bg-accent border-accent text-white shadow-sm'
              : 'border-secondary-alt/25 text-text-muted bg-white/40 hover:bg-secondary/40'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {statuses.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all uppercase text-[10px] tracking-wider ${
                statusFilter === status
                  ? 'bg-accent border-accent text-white shadow-sm'
                  : 'border-secondary-alt/25 text-text-muted bg-white/40 hover:bg-secondary/40'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid List/Table of Orders */}
      <div className="glass p-6 rounded-2xl border border-white/40">
        {loading ? (
          <div className="py-8 text-center text-xs text-text-muted">Loading order records...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-secondary/50 text-text-muted font-bold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const date = new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={order.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-accent">
                        <div>
                          <p>#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-[9px] font-normal text-text-muted font-sans">{date}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-text">{order.customer_name}</p>
                          <p className="text-[10px] text-text-muted">{order.customer_phone}</p>
                          <p className="text-[10px] text-text-muted truncate max-w-[120px]">{order.customer_email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs" title={order.shipping_address}>
                        <p className="line-clamp-2">{order.shipping_address}</p>
                        {order.notes && (
                          <p className="text-[10px] text-accent font-medium mt-1 bg-accent/5 p-1 rounded border border-accent/20">
                            📝 Note: {order.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1 text-[10px] text-text-muted">
                          {order.order_items?.map((item: any) => (
                            <p key={item.id}>
                              • {item.product_name} ({item.variant_label}) x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <p className="font-bold text-text">{formatPrice(order.total)}</p>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-secondary text-text-muted">
                            {order.payment_method === 'card' ? 'Online Card' : order.payment_method === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`py-1.5 px-2 text-[10px] uppercase font-bold tracking-wider rounded-lg border cursor-pointer transition-colors ${
                            order.status === 'delivered'
                              ? 'bg-success-light text-success border-success/30'
                              : order.status === 'pending'
                              ? 'bg-warning-light text-warning border-warning/30'
                              : order.status === 'cancelled'
                              ? 'bg-error-light text-error border-error/30'
                              : 'bg-info-light text-info border-info/30'
                          }`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status} className="bg-white text-text">
                              {status}
                            </option>
                          ))}
                        </select>
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
