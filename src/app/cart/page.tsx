'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, subtotal } = useCart();

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-6 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text mb-6">
            Your Shopping Cart
          </h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 md:p-12 text-center rounded-2xl max-w-lg mx-auto space-y-6 flex flex-col items-center justify-center"
            >
              <div className="p-4 bg-accent/10 rounded-full text-accent">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading font-semibold text-lg">Your cart is currently empty</h2>
                <p className="text-xs text-text-muted">
                  Add items to your cart to purchase them. You can view all available items in our shop.
                </p>
              </div>
              <Link href="/products" className="btn btn-primary flex items-center gap-2">
                <ArrowLeft size={16} /> Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="cart-layout">
              
              {/* Items List */}
              <div className="w-full space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItem key={item.variant_id} item={item} mode="full" />
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar */}
              <aside className="w-full lg:w-96 flex-shrink-0">
                <CartSummary subtotal={subtotal} />
              </aside>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
