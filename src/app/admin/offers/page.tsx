'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Calendar, Percent } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { Offer } from '@/lib/types';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'fixed'
  const [discountValue, setDiscountValue] = useState('');
  const [code, setCode] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !discountValue) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      const { data, error } = await supabase
        .from('offers')
        .insert({
          title,
          description,
          discount_type: discountType,
          discount_value: parseFloat(discountValue),
          min_order_amount: minOrder ? parseFloat(minOrder) : null,
          code: code.trim().toUpperCase() || null,
          start_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
          end_date: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setOffers([data as Offer, ...offers]);
      setTitle('');
      setDescription('');
      setDiscountValue('');
      setCode('');
      setMinOrder('');
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      console.error('Error creating offer:', err);
      setError(err.message || 'Error creating offer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
      setOffers(offers.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert('Could not delete offer.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
          <Tag className="text-accent" /> Offers & Discounts
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Create percentage discounts, cash rewards, and promo banner offers.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Create form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-96 glass p-6 rounded-2xl border border-white/40 space-y-4">
          <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
            Create Offer
          </h3>
          
          {error && (
            <div className="p-3 bg-error-light text-error text-xs rounded-xl border border-error/20">
              {error}
            </div>
          )}

          <div>
            <label className="label">Offer Title <span className="text-error">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Summer Special 10% Off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full text-xs"
            />
          </div>

          <div className="grid grid-2 gap-2">
            <div>
              <label className="label">Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="input w-full text-xs"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Price (LKR)</option>
              </select>
            </div>
            <div>
              <label className="label">Value <span className="text-error">*</span></label>
              <input
                type="number"
                required
                placeholder="Value"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
          </div>

          <div className="grid grid-2 gap-2">
            <div>
              <label className="label">Promo Code</label>
              <input
                type="text"
                placeholder="e.g. SAVE10"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
            <div>
              <label className="label">Min Purchase</label>
              <input
                type="number"
                placeholder="LKR"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
          </div>

          <div className="grid grid-2 gap-2">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="label">Offer Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Displays on the banner ticker..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus size={14} /> Add Offer
              </>
            )}
          </button>
        </form>

        {/* Right Side: List of Offers */}
        <div className="flex-1 w-full glass p-6 rounded-2xl border border-white/40">
          <h3 className="font-heading font-bold text-base text-text mb-6">
            Active Offers ({offers.length})
          </h3>

          {loading ? (
            <div className="py-4 text-center text-xs text-text-muted">Loading...</div>
          ) : offers.length === 0 ? (
            <div className="py-4 text-center text-xs text-text-muted">No active promotional offers.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-secondary/50 text-text-muted font-bold">
                    <th className="py-3 px-4">Offer</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Minimum</th>
                    <th className="py-3 px-4">Validity</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => {
                    const start = new Date(o.start_date).toLocaleDateString();
                    const end = new Date(o.end_date).toLocaleDateString();
                    
                    return (
                      <tr key={o.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-text">{o.title}</p>
                            <p className="text-[10px] text-text-muted">{o.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-accent">
                          {o.discount_type === 'percentage' ? `${o.discount_value}%` : formatPrice(o.discount_value)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">{o.code || '-'}</td>
                        <td className="py-3 px-4 text-text-muted">
                          {o.min_order_amount ? formatPrice(o.min_order_amount) : 'None'}
                        </td>
                        <td className="py-3 px-4 text-text-muted">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {start} - {end}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="p-1.5 hover:bg-error-light hover:text-error rounded-lg transition-colors text-text-muted"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
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
    </div>
  );
}
