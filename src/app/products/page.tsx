'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilter from '@/components/products/ProductFilter';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Product, Category } from '@/lib/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Filter State from URL
  const initialCategory = searchParams.get('category') || '';
  const initialPetType = searchParams.get('pet_type') || '';

  const [filters, setFilters] = useState<any>({
    petType: initialPetType || 'All',
    categories: initialCategory ? [initialCategory] : [],
    priceMin: '',
    priceMax: '',
    sortBy: 'newest',
  });

  // Fetch all products & categories
  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createBrowserClient();
        
        // 1. Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');
        
        if (catError) throw catError;
        setCategories(catData || []);

        // 2. Fetch products with their variants
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('is_active', true);

        if (prodError) throw prodError;

        if (prodData) {
          const formatted = prodData.map((p: any) => ({
            ...p,
            category: p.categories,
            variants: p.product_variants || [],
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Update filters if URL parameters change
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const pet = searchParams.get('pet_type') || '';
    
    setFilters((prev: any) => ({
      ...prev,
      petType: pet || 'All',
      categories: cat ? [cat] : [],
    }));
  }, [searchParams]);

  const searchQuery = searchParams.get('search') || '';

  // Apply filters
  useEffect(() => {
    let result = products.filter(
      (p) => !p.name.toLowerCase().includes('saalayo') && !p.slug.toLowerCase().includes('saalayo')
    );

    // Search Query Filter
    if (searchQuery) {
      const term = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Pet Type Filter
    if (filters.petType && filters.petType !== 'All') {
      result = result.filter(
        (p) => p.pet_type === filters.petType || p.pet_type === 'Cat/Dog'
      );
    }

    // Category Filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => p.category && filters.categories.includes(p.category.slug));
    }

    // Price Filter
    if (filters.priceMin !== '') {
      const minPrice = parseFloat(filters.priceMin);
      result = result.filter((p) => {
        const pVariants = p.variants || [];
        const minVariantPrice = Math.min(...pVariants.map((v) => Number(v.price)), 0);
        return minVariantPrice >= minPrice;
      });
    }
    if (filters.priceMax !== '') {
      const maxPrice = parseFloat(filters.priceMax);
      result = result.filter((p) => {
        const pVariants = p.variants || [];
        const minVariantPrice = Math.min(...pVariants.map((v) => Number(v.price)), 0);
        return minVariantPrice <= maxPrice;
      });
    }

    // Sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => {
        const aVariants = a.variants || [];
        const bVariants = b.variants || [];
        const aMin = Math.min(...aVariants.map((v) => Number(v.price)), 0);
        const bMin = Math.min(...bVariants.map((v) => Number(v.price)), 0);
        return aMin - bMin;
      });
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => {
        const aVariants = a.variants || [];
        const bVariants = b.variants || [];
        const aMax = Math.max(...aVariants.map((v) => Number(v.price)), 0);
        const bMax = Math.max(...bVariants.map((v) => Number(v.price)), 0);
        return bMax - aMax;
      });
    } else if (filters.sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, filters, searchQuery]);


  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // Update URL query parameters based on filters
    const params = new URLSearchParams();
    if (newFilters.petType && newFilters.petType !== 'All') {
      params.set('pet_type', newFilters.petType);
    }
    if (newFilters.categories.length === 1) {
      params.set('category', newFilters.categories[0]);
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Page Header Title */}
      <div className="mb-6">
        <h1 className="section-heading text-2xl md:text-3xl font-heading font-bold text-[#1A1A2E]">
          Our Products
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Sri Lanka's trusted veterinary pharmacy & clinical pet nutrition catalog.
        </p>
      </div>

      {/* Top Horizontal Product Filter Bar & Collapsible Drawer */}
      <div className="mb-8">
        <ProductFilter
          availableCategories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
        />
      </div>

      {/* Main Full-Width Product Grid */}
      <main className="w-full">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="glass p-4 rounded-2xl h-80 animate-pulse flex flex-col justify-between">
                <div className="w-full h-1/2 bg-secondary/50 rounded-xl" />
                <div className="h-4 bg-secondary/50 w-2/3 rounded mt-4" />
                <div className="h-4 bg-secondary/50 w-1/3 rounded mt-2" />
                <div className="h-10 bg-secondary/50 w-full rounded-xl mt-6" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
    </>
  );
}
