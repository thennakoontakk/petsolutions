'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const supabase = createBrowserClient();
        
        // Fetch featured products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(8);

        if (productsError) throw productsError;

        if (productsData) {
          // Map to match TypeScript type
          const formattedProducts = productsData.map((prod: any) => ({
            ...prod,
            category: prod.categories,
            variants: prod.product_variants || []
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-text">Featured Products</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-2" />
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

  if (products.length === 0) {
    return null; // Don't show the section if no featured products are found
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text mb-2">
            Featured Products
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mb-3" />
          <p className="text-sm md:text-base text-text-muted">
            Explore our handpicked premium selections recommended for your pets.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid-products">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
