'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mapped: Product[] = data.map((p: any) => ({
            ...p,
            category: Array.isArray(p.categories) ? p.categories[0] : p.categories,
            variants: p.product_variants || [],
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <section className="py-12 sm:py-16 container mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8 sm:mb-10">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B7B] mt-1.5">
            Top picks for your furry friends.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-[#00ACDF] hover:underline flex items-center gap-1.5 transition-colors group"
        >
          <span>View All Products</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Grid matching /products */}
      {loading ? (
        <div className="product-catalog-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-3 rounded-2xl h-80 animate-pulse flex flex-col justify-between">
              <div className="w-full aspect-square bg-secondary/50 rounded-xl" />
              <div className="h-4 bg-secondary/50 w-2/3 rounded mt-3" />
              <div className="h-6 bg-secondary/50 w-1/3 rounded mt-2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass p-8 text-center rounded-2xl text-sm text-[#6B6B7B]">
          No featured products selected yet. Mark products as Featured in the Admin Console to display them here.
        </div>
      ) : (
        <div className="product-catalog-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

