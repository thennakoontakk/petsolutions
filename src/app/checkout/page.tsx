'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CheckCircle, CreditCard, Landmark, Truck, Tag, Sparkles, X } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/utils/formatPrice';
import { createBrowserClient } from '@/lib/supabase/client';
import FreeDeliveryProgressBar from '@/components/cart/FreeDeliveryProgressBar';

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'card', // 'card', 'cod', or 'bank'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Promo Code Engine State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    amount: number;
    title: string;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Fill in profile details if available
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      }));
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user, profile]);

  // Direct to login if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Delivery Fee calculation (Free above Rs. 10,000)
  const deliveryFee = subtotal >= 10000 ? 0 : 450;
  const discountAmount = appliedPromo ? appliedPromo.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    setIsApplyingPromo(true);
    setPromoError(null);

    try {
      const supabase = createBrowserClient();
      const { data: offerData } = await supabase
        .from('offers')
        .select('*')
        .ilike('code', cleanCode)
        .eq('is_active', true)
        .single();

      let validPromo = null;

      if (offerData) {
        if (offerData.min_order_amount && subtotal < Number(offerData.min_order_amount)) {
          setPromoError(`Minimum order of Rs. ${Number(offerData.min_order_amount).toLocaleString()} required for this code.`);
          setIsApplyingPromo(false);
          return;
        }

        const discVal = Number(offerData.discount_value);
        const calculatedDisc = offerData.discount_type === 'percentage' 
          ? (subtotal * discVal) / 100 
          : discVal;

        validPromo = {
          code: offerData.code || cleanCode,
          discountType: offerData.discount_type as 'percentage' | 'fixed',
          discountValue: discVal,
          amount: Math.min(subtotal, calculatedDisc),
          title: offerData.title,
        };
      } else {
        // Built-in verified promo codes fallback
        const builtIns: Record<string, { type: 'percentage' | 'fixed'; val: number; min: number; title: string }> = {
          'WELCOME10': { type: 'percentage', val: 10, min: 2000, title: '10% Welcome Discount' },
          'VETCARE500': { type: 'fixed', val: 500, min: 5000, title: 'Rs. 500 Vet Care Special' },
          'SAVER15': { type: 'percentage', val: 15, min: 15000, title: '15% Mega Saver Discount' },
        };

        const found = builtIns[cleanCode];
        if (found) {
          if (subtotal < found.min) {
            setPromoError(`Minimum order of Rs. ${found.min.toLocaleString()} required for code ${cleanCode}.`);
            setIsApplyingPromo(false);
            return;
          }
          const calc = found.type === 'percentage' ? (subtotal * found.val) / 100 : found.val;
          validPromo = {
            code: cleanCode,
            discountType: found.type,
            discountValue: found.val,
            amount: Math.min(subtotal, calc),
            title: found.title,
          };
        }
      }

      if (validPromo) {
        setAppliedPromo(validPromo);
        setPromoCodeInput('');
      } else {
        setPromoError('Invalid or expired promo code. Try WELCOME10 or VETCARE500.');
      }
    } catch {
      setPromoError('Failed to validate promo code. Please try again.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const handlePaymentChange = (method: 'card' | 'cod' | 'bank') => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all required fields (Name, Phone, Address).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      
      // Online card payments in test mode are marked as confirmed immediately
      const initialStatus = formData.paymentMethod === 'card' ? 'confirmed' : 'pending';

      // 1. Create order in 'orders' table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: initialStatus,
          subtotal,
          discount: discountAmount,
          total: finalTotal,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items in 'order_items' table
      const orderItemsToInsert = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.variant?.product?.id || null,
        variant_id: item.variant_id,
        product_name: item.variant?.product?.name || 'Product',
        variant_label: item.variant?.size_label || 'Default Size',
        quantity: item.quantity,
        unit_price: item.variant?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Clear shopping cart
      await clearCart();

      // Show success screen
      setOrderSuccess(orderData.id);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'There was a problem placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-[80vh] flex items-center justify-center py-12 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 text-center rounded-2xl max-w-lg mx-auto space-y-6 flex flex-col items-center justify-center border border-white/60 shadow-xl"
          >
            <div className="p-4 bg-success-light text-success rounded-full ring-8 ring-success-light/40">
              <CheckCircle size={56} />
            </div>
            <div className="space-y-3 w-full">
              <h2 className="font-heading font-extrabold text-2xl text-text">Order Placed Successfully!</h2>
              <p className="text-xs text-text-muted">
                Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-accent">#{orderSuccess.slice(0, 8).toUpperCase()}</span>.
              </p>
              
              <div className="bg-secondary/30 p-4 rounded-xl text-left text-xs space-y-2 border border-secondary-alt/20">
                <div className="flex justify-between border-b border-secondary-alt/20 pb-2">
                  <span className="text-text-muted">Payment Method:</span>
                  <span className="font-semibold text-text">
                    {formData.paymentMethod === 'card' ? 'Online Card (Test Gateway Approved)' : formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-secondary-alt/20 pb-2">
                  <span className="text-text-muted">Order Status:</span>
                  <span className="badge badge-success text-[10px]">
                    {formData.paymentMethod === 'card' ? 'Confirmed' : 'Pending Confirmation'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Deliver to:</span>
                  <span className="font-medium text-text text-right max-w-[200px] truncate">{formData.address}</span>
                </div>
              </div>

              {formData.paymentMethod === 'bank' && (
                <div className="bg-secondary/40 p-4 rounded-xl text-left text-xs space-y-2 border border-secondary-alt/30">
                  <p className="font-bold text-accent">Bank Transfer Instructions:</p>
                  <p className="text-[11px]"><span className="font-semibold text-text">Bank:</span> Sampath Bank</p>
                  <p className="text-[11px]"><span className="font-semibold text-text">Branch:</span> Colombo Fort</p>
                  <p className="text-[11px]"><span className="font-semibold text-text">Account Name:</span> PetSolutions (PVT) LTD</p>
                  <p className="text-[11px]"><span className="font-semibold text-text">Account Number:</span> 0112 3456 7890</p>
                  <p className="text-[10px] text-text-muted italic mt-1">Please transfer the total amount and WhatsApp the slip to +94 77 123 4567 with your Order ID.</p>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-[11px] text-text text-left">
                  ✅ <span className="font-semibold">Test Gateway Simulation:</span> Payment was processed and verified instantly. You can track this order in your customer dashboard.
                </div>
              )}
            </div>
            
            <div className="pt-2 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/products" className="btn btn-outline text-xs w-full py-3">
                Continue Shopping
              </Link>
              <Link href="/orders" className="btn btn-primary text-xs w-full py-3">
                Track My Order
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/cart" className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors">
              <ArrowLeft size={14} /> Back to Cart
            </Link>
          </div>

          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text mb-4">
            Checkout
          </h1>

          {/* Free Delivery Target Progress Bar */}
          <FreeDeliveryProgressBar subtotal={subtotal} className="mb-6 max-w-4xl" />

          {items.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl max-w-md mx-auto space-y-4">
              <h2 className="font-heading font-bold text-lg">No items to checkout</h2>
              <p className="text-xs text-text-muted">Your cart is empty. Please add items to place an order.</p>
              <Link href="/products" className="btn btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="cart-layout">
              
              {/* Form container */}
              <form onSubmit={handleSubmitOrder} className="flex-1 w-full space-y-6">
                
                {/* 1. Shipping Details */}
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
                    1. Shipping Information
                  </h3>
                  
                  {error && (
                    <div className="p-3 bg-error-light text-error text-xs rounded-xl border border-error/20">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-1 md:grid-2 gap-4">
                    <div>
                      <label className="label">Full Name <span className="text-error">*</span></label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="label">Contact Phone <span className="text-error">*</span></label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. +94 77 123 4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>

                  <div>
                    <label className="label">Delivery Address <span className="text-error">*</span></label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      placeholder="Your complete street address, city, and postal code"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>

                  <div>
                    <label className="label">Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Gate code, drop-off instructions, or delivery timing preferences"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="glass p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-secondary/50 pb-2">
                    <h3 className="font-heading font-bold text-base text-text">
                      2. Payment Method
                    </h3>
                    <span className="text-[11px] text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
                      Instant Approval Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Card / Online Payment (Instant Test Payment) */}
                    <div
                      onClick={() => handlePaymentChange('card')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        formData.paymentMethod === 'card'
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                          : 'border-secondary-alt/30 hover:border-accent/40 bg-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-accent/15 rounded-lg text-accent">
                          <CreditCard size={18} />
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === 'card' ? 'border-accent' : 'border-secondary-alt'
                        }`}>
                          {formData.paymentMethod === 'card' && (
                            <div className="w-2.5 h-2.5 bg-accent rounded-full" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text">Online Card</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Visa / MasterCard (Instant Test Gateway)</p>
                      </div>
                    </div>

                    {/* COD */}
                    <div
                      onClick={() => handlePaymentChange('cod')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        formData.paymentMethod === 'cod'
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                          : 'border-secondary-alt/30 hover:border-accent/40 bg-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-accent/15 rounded-lg text-accent">
                          <Truck size={18} />
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === 'cod' ? 'border-accent' : 'border-secondary-alt'
                        }`}>
                          {formData.paymentMethod === 'cod' && (
                            <div className="w-2.5 h-2.5 bg-accent rounded-full" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text">Cash on Delivery</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Pay in cash when order arrives</p>
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div
                      onClick={() => handlePaymentChange('bank')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        formData.paymentMethod === 'bank'
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                          : 'border-secondary-alt/30 hover:border-accent/40 bg-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-accent/15 rounded-lg text-accent">
                          <Landmark size={18} />
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === 'bank' ? 'border-accent' : 'border-secondary-alt'
                        }`}>
                          {formData.paymentMethod === 'bank' && (
                            <div className="w-2.5 h-2.5 bg-accent rounded-full" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text">Bank Transfer</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Direct deposit with bank slip</p>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="p-3.5 bg-secondary/30 rounded-xl border border-secondary-alt/30 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-accent">
                        <CreditCard size={14} /> Instant Test Gateway Active
                      </div>
                      <p className="text-[11px] text-text-muted">
                        No credit card numbers required during testing. Clicking the button below will immediately approve the payment and create a confirmed order.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment & Placing Order...</span>
                    </div>
                  ) : (
                    formData.paymentMethod === 'card' 
                      ? `Pay Now & Place Order (${formatPrice(finalTotal)})`
                      : `Place Order (${formatPrice(finalTotal)})`
                  )}
                </button>

              </form>

              {/* Order items preview sidebar */}
              <aside className="w-full lg:w-96 flex-shrink-0 glass p-6 rounded-2xl space-y-4">
                <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
                  Order Summary
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variant_id} className="flex justify-between items-start gap-2 text-xs py-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-text">{item.variant?.product?.name}</p>
                        <p className="text-[10px] text-text-muted">Size: {item.variant?.size_label} x {item.quantity}</p>
                      </div>
                      <span className="font-medium flex-shrink-0">
                        {formatPrice((item.variant?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Coupon Engine Box */}
                <div className="border-t border-secondary/50 pt-3">
                  <label className="text-[11px] font-bold text-text mb-1.5 flex items-center gap-1">
                    <Tag size={12} className="text-accent" /> Have a Promo Code?
                  </label>
                  
                  {appliedPromo ? (
                    <div className="p-2.5 bg-success/10 border border-success/30 rounded-xl flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-success">{appliedPromo.code}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-success text-white rounded-md font-bold">APPLIED</span>
                        </div>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">{appliedPromo.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="p-1 hover:bg-error/10 text-error rounded-md transition-colors"
                        title="Remove coupon"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="input text-xs uppercase flex-1 py-2 px-3 tracking-wider font-mono"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingPromo || !promoCodeInput.trim()}
                        className="btn btn-primary btn-sm text-xs px-3 font-bold"
                      >
                        {isApplyingPromo ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}

                  {promoError && (
                    <p className="text-[10px] text-error mt-1.5 font-medium">{promoError}</p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="border-t border-secondary/50 pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-success font-semibold">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Delivery</span>
                    {deliveryFee === 0 ? (
                      <span className="text-success font-semibold flex items-center gap-1">
                        <Sparkles size={11} /> FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-text">{formatPrice(deliveryFee)}</span>
                    )}
                  </div>

                  <hr className="border-secondary/40 my-2" />
                  <div className="flex justify-between font-heading font-bold text-sm">
                    <span>Total Amount</span>
                    <span className="text-accent text-base">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </aside>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
