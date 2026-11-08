'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CheckCircle, CreditCard, Truck, Sparkles, Clock } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice, formatPriceShort } from '@/lib/utils/formatPrice';
import { calculateLineItemPricing } from '@/lib/utils/dealPricing';
import { createBrowserClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const { items, subtotal, promotionalDiscount, finalSubtotal, totalItems, clearCart } = useCart();
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'cod', // COD is the primary active payment method
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    id: string;
    total: number;
    subtotal: number;
    discount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fill in profile details if available
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone ? profile.phone.replace(/[^\d+\s]/g, '') : '',
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

  // Delivery Fee calculation (Free above Rs. 10,000)
  const deliveryFee = finalSubtotal >= 10000 ? 0 : 450;
  const finalTotal = Math.max(0, finalSubtotal + deliveryFee);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error as user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Phone input: strictly allow only numbers, spaces, and '+'
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = rawValue.replace(/[^\d+\s]/g, '');
    setFormData((prev) => ({ ...prev, phone: sanitized }));

    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors: { name?: string; phone?: string; email?: string; address?: string } = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Please enter a valid full name (at least 3 characters).';
    }

    // 2. Phone validation (only digits allowed, minimum 9 digits)
    const digitsOnly = formData.phone.replace(/[^\d]/g, '');
    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone number is required.';
    } else if (digitsOnly.length < 9 || digitsOnly.length > 12) {
      errors.phone = 'Please enter a valid 10-digit mobile number (e.g. 077 123 4567).';
    }

    // 3. Email validation (if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // 4. Delivery address validation
    if (!formData.address.trim()) {
      errors.address = 'Delivery address is required.';
    } else if (formData.address.trim().length < 8) {
      errors.address = 'Please enter your complete street address and city.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please resolve the errors highlighted below in your shipping information.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createBrowserClient();

      // 1. Create order in 'orders' table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          subtotal,
          discount: promotionalDiscount,
          total: finalTotal,
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim() || null,
          customer_phone: formData.phone.trim(),
          shipping_address: formData.address.trim(),
          payment_method: 'cod',
          notes: formData.notes.trim() || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items in 'order_items' table
      const orderItemsToInsert = items.map((item) => {
        const pricing = calculateLineItemPricing(item);
        return {
          order_id: orderData.id,
          product_id: item.variant?.product?.id || null,
          variant_id: item.variant_id,
          product_name: item.variant?.product?.name || 'Product',
          variant_label: item.variant?.size_label || 'Default Size',
          quantity: item.quantity,
          unit_price: pricing.unitEffectivePrice,
          deal_label: item.deal_label || pricing.dealTag || null,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      const confirmedTotal = finalTotal;
      const confirmedSubtotal = subtotal;
      const confirmedDiscount = promotionalDiscount;

      // 3. Clear shopping cart
      await clearCart();

      // Show success screen
      setOrderSuccess({
        id: orderData.id,
        total: confirmedTotal,
        subtotal: confirmedSubtotal,
        discount: confirmedDiscount,
      });
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
        <main className="min-h-[80vh] flex items-center justify-center py-12 mt-4 bg-[#FEFCF3]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 text-center rounded-2xl max-w-lg mx-auto space-y-6 flex flex-col items-center justify-center border border-secondary-alt/40 shadow-xl"
          >
            <div className="p-4 bg-success-light text-success rounded-full ring-8 ring-success-light/40">
              <CheckCircle size={56} />
            </div>
            <div className="space-y-3 w-full">
              <h2 className="font-heading font-extrabold text-2xl text-text">Order Placed Successfully!</h2>
              <p className="text-xs text-text-muted">
                Thank you for your purchase. Your order reference ID is{' '}
                <span className="font-mono font-bold text-accent">#{orderSuccess.id.slice(0, 8).toUpperCase()}</span>.
              </p>

              <div className="bg-[#FAF8F5] p-4 rounded-xl text-left text-xs space-y-2 border border-secondary/50">
                <div className="flex justify-between border-b border-secondary-alt/20 pb-2">
                  <span className="text-text-muted">Payment Method:</span>
                  <span className="font-bold text-text flex items-center gap-1.5">
                    <Truck size={14} className="text-accent" /> Cash on Delivery (COD)
                  </span>
                </div>
                <div className="flex justify-between border-b border-secondary-alt/20 pb-2">
                  <span className="text-text-muted">Order Status:</span>
                  <span className="badge badge-success text-[10px]">
                    Pending Delivery (Pay on Arrival)
                  </span>
                </div>
                {orderSuccess.discount > 0 && (
                  <div className="flex justify-between border-b border-secondary-alt/20 pb-2 text-emerald-700 font-semibold">
                    <span>Promotional Savings:</span>
                    <span>-{formatPrice(orderSuccess.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-secondary-alt/20 pb-2">
                  <span className="text-text-muted">Total to Pay:</span>
                  <span className="font-extrabold text-accent text-sm">
                    {formatPrice(orderSuccess.total)}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-text-muted">Deliver to:</span>
                  <span className="font-medium text-text text-right max-w-[220px] truncate">{formData.address}</span>
                </div>
              </div>

              <div className="p-3.5 bg-accent/10 border border-accent/20 rounded-xl text-[11px] text-text text-left">
                📦 <span className="font-semibold">Next Steps:</span> Our veterinary team will inspect and carefully dispatch your order. Please have the cash amount ready for the delivery courier.
              </div>
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
      <main className="min-h-[80vh] py-6 md:py-10 bg-[#FEFCF3]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/cart" className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors">
              <ArrowLeft size={14} /> Back to Cart
            </Link>
          </div>

          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text mb-6">
            Checkout
          </h1>

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
                <div className="glass p-6 rounded-2xl space-y-4 border border-secondary-alt/40 bg-white">
                  <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
                    1. Shipping Information
                  </h3>

                  {error && (
                    <div className="p-3 bg-error-light text-error text-xs rounded-xl border border-error/20">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input w-full ${fieldErrors.name ? 'border-error ring-1 ring-error' : ''}`}
                      />
                      {fieldErrors.name && (
                        <p className="text-[11px] text-error mt-1 font-medium">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">
                        Contact Phone <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        name="phone"
                        required
                        placeholder="e.g. 0771234567"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`input w-full ${fieldErrors.phone ? 'border-error ring-1 ring-error' : ''}`}
                      />
                      {fieldErrors.phone ? (
                        <p className="text-[11px] text-error mt-1 font-medium">{fieldErrors.phone}</p>
                      ) : (
                        <p className="text-[10px] text-text-muted mt-1">Numbers only. e.g. 077 123 4567</p>
                      )}
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
                      className={`input w-full ${fieldErrors.email ? 'border-error ring-1 ring-error' : ''}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-error mt-1 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      Delivery Address <span className="text-error">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      placeholder="House / Flat No, Street Address, City, Postal Code"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`input w-full ${fieldErrors.address ? 'border-error ring-1 ring-error' : ''}`}
                    />
                    {fieldErrors.address && (
                      <p className="text-[11px] text-error mt-1 font-medium">{fieldErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Gate code, landmark, or delivery timing instructions"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="glass p-6 rounded-2xl space-y-4 border border-secondary-alt/40 bg-white">
                  <div className="flex items-center justify-between border-b border-secondary/50 pb-2">
                    <h3 className="font-heading font-bold text-base text-text">
                      2. Payment Method
                    </h3>
                    <span className="text-[11px] text-accent font-bold bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                      COD Active Islandwide
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Cash on Delivery (Active & Selected) */}
                    <div
                      className="p-4 rounded-xl border-2 border-accent bg-accent/5 ring-2 ring-accent/20 transition-all flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-accent/15 rounded-lg text-accent">
                          <Truck size={18} />
                        </div>
                        <div className="w-4 h-4 rounded-full border border-accent flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-accent rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-text">Cash on Delivery (COD)</p>
                          <span className="text-[9.5px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <p className="text-[10px] text-text-muted mt-0.5">Pay in cash when your package arrives at your doorstep</p>
                      </div>
                    </div>

                    {/* Online Card (Coming Soon - Disabled) */}
                    <div
                      className="p-4 rounded-xl border-2 border-secondary-alt/40 bg-secondary/15 opacity-60 cursor-not-allowed transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-secondary/40 rounded-lg text-text-muted">
                          <CreditCard size={18} />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={10} /> Coming Soon
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-muted">Online Card Payment</p>
                        <p className="text-[10px] text-text-muted mt-0.5">Visa / MasterCard gateway integration in progress</p>
                      </div>
                    </div>
                  </div>

                  {/* COD Instruction Box */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-secondary/50 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-accent">
                      <Truck size={14} /> Doorstep Cash Payment
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      You will pay directly to the delivery courier when receiving your package. Please keep the exact amount ready upon delivery.
                    </p>
                  </div>
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
                      <span>Placing Your Order...</span>
                    </div>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Place Order - Cash on Delivery ({formatPrice(finalTotal)})</span>
                    </>
                  )}
                </button>

                {/* Compliance agreement text */}
                <p className="text-center text-xs text-text-muted mt-2">
                  By placing your order, you agree to our{' '}
                  <Link href="/terms" target="_blank" className="text-[#00ACDF] font-semibold underline hover:text-[#0090BB]">
                    Terms &amp; Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" target="_blank" className="text-[#00ACDF] font-semibold underline hover:text-[#0090BB]">
                    Privacy Policy
                  </Link>.
                </p>
              </form>

              {/* Order items preview sidebar */}
              <aside className="w-full lg:w-96 flex-shrink-0 bg-white p-6 rounded-2xl space-y-4 border border-secondary-alt/40 shadow-sm sticky top-24">
                <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
                  Order Summary
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const pricing = calculateLineItemPricing(item);
                    return (
                      <div key={item.variant_id} className="flex justify-between items-start gap-2 text-xs py-2 border-b border-secondary/20 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-text">{item.variant?.product?.name}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[10.5px] text-text-muted">
                              Size: <strong className="text-text font-semibold">{item.variant?.size_label || 'Standard'}</strong> × {item.quantity}
                            </span>
                            {pricing.dealTag && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                🔥 {pricing.dealTag}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {pricing.lineDiscount > 0 ? (
                            <>
                              <p className="font-bold text-text">
                                {formatPrice(pricing.netLineTotal)}
                              </p>
                              <p className="text-[10px] text-muted line-through">
                                {formatPrice(pricing.grossLineTotal)}
                              </p>
                            </>
                          ) : (
                            <span className="font-bold text-text">
                              {formatPrice(pricing.grossLineTotal)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Breakdown */}
                <div className="border-t border-secondary/50 pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-text">{formatPrice(subtotal)}</span>
                  </div>

                  {promotionalDiscount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                      <span>Deal & BOGO Savings</span>
                      <span>-{formatPrice(promotionalDiscount)}</span>
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
