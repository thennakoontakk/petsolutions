'use client';

import { useState, useEffect, use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetail from '@/components/products/ProductDetail';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createBrowserClient();
        
        // Fetch product with categories and variants
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        if (data) {
          const formatted: Product = {
            ...data,
            category: data.categories,
            variants: data.product_variants || [],
          };
          setProduct(formatted);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        console.error('Error fetching product detail:', err);
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return (
    <>
      <Header />
      <main className="min-h-[80vh] py-6 md:py-10">
        <div className="container mx-auto px-4">

          {loading ? (
            <div className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-8 animate-pulse">
              <div className="w-full md:w-1/2 aspect-square bg-secondary/50 rounded-2xl" />
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-4 bg-secondary/50 w-1/4 rounded" />
                <div className="h-8 bg-secondary/50 w-3/4 rounded" />
                <div className="h-6 bg-secondary/50 w-1/3 rounded" />
                <div className="h-32 bg-secondary/50 w-full rounded-xl" />
                <div className="h-10 bg-secondary/50 w-1/3 rounded-xl" />
              </div>
            </div>
          ) : error || !product ? (
            <div className="glass p-12 text-center rounded-2xl space-y-4 max-w-md mx-auto">
              <h2 className="font-heading font-bold text-xl text-text">Product Not Found</h2>
              <p className="text-xs text-text-muted">
                The product you are looking for might have been removed or is temporarily unavailable.
              </p>
              <Link href="/products" className="btn btn-primary inline-block">
                Back to Shop
              </Link>
            </div>
          ) : (
            <ProductDetail product={product} />
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
