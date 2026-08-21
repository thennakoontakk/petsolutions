'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../products/ProductCard';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const supabase = createBrowserClient();
        
        // Fetch top active products
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('is_active', true)
          .limit(4);

        if (error) throw error;

        if (data) {
          const formatted = data.map((prod: any) => ({
            ...prod,
            category: prod.categories,
            variants: prod.product_variants || []
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error('Error fetching best sellers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-heading font-extrabold text-2xl text-text">Best Sellers</h2>
            <div className="w-12 h-1 bg-accent mx-auto rounded-full mt-3" />
          </div>
          <div className="grid grid-2 md:grid-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass p-4 rounded-2xl h-80 animate-pulse flex flex-col justify-between">
                <div className="w-full h-1/2 bg-secondary/50 rounded-xl" />
                <div className="h-4 bg-secondary/50 w-2/3 rounded mt-4" />
                <div className="h-4 bg-secondary/50 w-1/3 rounded mt-2" />
                <div className="h-10 bg-secondary/50 w-full rounded-xl mt-6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white/40 border-b border-secondary-alt/20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-error-light text-error text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
              <Flame size={12} className="animate-pulse" /> Popular Choices
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-text">
              Best Selling Products
            </h2>
            <p className="text-xs text-text-muted mt-1">Customers' favorite foods, litters, and medical care essentials</p>
          </div>
          
          <Link 
            href="/products" 
            className="btn btn-outline btn-sm text-xs font-bold flex items-center gap-1.5"
          >
            View All Catalog <ArrowRight size={14} />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid-products">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
