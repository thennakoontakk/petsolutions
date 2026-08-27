'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center px-3.5 py-1 bg-error-light text-error text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <span>Popular Choices</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
            Best Selling Products
          </h2>
          <p className="text-sm md:text-base text-text-muted mt-2">
            Customers' favorite foods, litters, and medical care essentials
          </p>
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

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link 
            href="/products" 
            className="btn btn-outline btn-md text-sm font-bold inline-flex items-center gap-2 px-6 py-2.5 rounded-full hover:bg-accent hover:text-text hover:border-accent transition-all"
          >
            <span>View All Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
