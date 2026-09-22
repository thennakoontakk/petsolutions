'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Heart, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import { useCart } from '@/lib/hooks/useCart';
import type { Product } from '@/lib/types';
import localCatalog from '@/../full_catalog_with_prices.json';

function LifestyleProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const variants = product.variants ?? [];
  const activeVariants = variants.filter((v) => v.is_active !== false);
  const prices = activeVariants.map((v) => Number(v.price));
  const comparePrices = activeVariants
    .filter((v) => v.compare_at_price)
    .map((v) => Number(v.compare_at_price));

  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const compareAtPrice = comparePrices.length ? Math.max(...comparePrices) : null;
  const isSingleVariant = activeVariants.length === 1;
  const singleVariantId = isSingleVariant ? activeVariants[0].id : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSingleVariant && singleVariantId) {
      setIsAdding(true);
      try {
        await addItem(singleVariantId, 1);
        toast.success('Added to cart!', {
          description: `${product.name} · ${formatPrice(lowestPrice)}`,
        });
      } catch {
        toast.error('Could not add item to cart. Please try again.');
      } finally {
        setTimeout(() => setIsAdding(false), 500);
      }
    } else {
      router.push(`/products/${product.slug}`);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const imageUrl = product.image_url || (product as any).images?.[0] || '/logo-icon.png';

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E7DFD5] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative">
      
      {/* Top Wishlist Heart */}
      <button
        type="button"
        onClick={toggleWishlist}
        aria-label="Save to wishlist"
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 border border-[#E7DFD5] flex items-center justify-center text-[#78716C] hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
      >
        <Heart
          size={15}
          className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}
        />
      </button>

      {/* 1:1 Product Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square w-full rounded-xl bg-[#FAF7F2] overflow-hidden shrink-0 group/img p-3"
      >
        <img
          src={imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          className="group-hover/img:scale-106 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Information */}
      <div className="mt-3 flex flex-col flex-1">
        {/* Category / Brand */}
        <p className="text-[10px] sm:text-[11px] font-bold text-[#F97316] uppercase tracking-wider truncate">
          {product.brand || (typeof product.category === 'object' && product.category !== null ? product.category.name : 'Veterinary Care')}
        </p>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block mt-1">
          <h3 className="font-heading font-bold text-xs sm:text-sm text-[#1C1917] line-clamp-2 min-h-[2.4rem] leading-snug group-hover:text-[#F97316] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* 5-Star Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                style={{ fill: '#FBBF24', color: '#FBBF24' }}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#78716C] font-semibold ml-0.5">(124)</span>
        </div>

        {/* Price & Strikethrough */}
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="font-heading font-black text-sm sm:text-base text-[#1C1917]">
            {formatPrice(lowestPrice)}
          </span>
          {compareAtPrice && compareAtPrice > lowestPrice && (
            <span className="text-[11px] text-[#A8A29E] line-through font-medium">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>

        {/* BRIGHT ORANGE FULL-WIDTH ADD TO CART BUTTON */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          style={{
            backgroundColor: '#F97316',
            color: '#FFFFFF',
          }}
          className="mt-3 w-full py-2.5 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-95 transition-all cursor-pointer shrink-0"
        >
          {isAdding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isSingleVariant ? (
            <>
              <ShoppingCart size={13} className="text-white" />
              <span>Add to Cart</span>
            </>
          ) : (
            <>
              <span>Select Options</span>
              <ArrowRight size={13} className="text-white" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('is_active', true)
          .limit(5);

        if (!error && data && data.length > 0) {
          const mapped = data.map((p: any) => ({
            ...p,
            category: Array.isArray(p.categories) ? p.categories[0] : p.categories,
            variants: p.product_variants || [],
          }));
          setProducts(mapped);
          return;
        }
      } catch {
        // fallback
      }

      // Fallback to local catalog
      if (Array.isArray(localCatalog) && localCatalog.length > 0) {
        const fallbackList: Product[] = localCatalog.slice(0, 5).map((item: any, idx: number) => ({
          id: `local-${idx}`,
          name: item.name,
          slug: item.slug,
          description: item.description,
          category_id: 'cat-1',
          pet_type: item.pet_type,
          brand: item.brand,
          image_url: `/images/storefront/${idx % 2 === 0 ? 'cat-dog-food.jpg' : 'cat-cat-food.jpg'}`,
          images: [],
          is_featured: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: item.category,
          variants: (item.variants || []).map((v: any, vIdx: number) => ({
            id: `var-${idx}-${vIdx}`,
            product_id: `local-${idx}`,
            size_label: v.size_label || 'Standard',
            price: v.price || 2450,
            compare_at_price: v.compare_at_price || null,
            stock: v.stock || 50,
            sku: `SKU-${idx}`,
            is_active: true,
            created_at: new Date().toISOString(),
          })),
        }));
        setProducts(fallbackList);
      }
    }

    loadFeatured();
  }, []);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8 sm:mb-10">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1.5">
            Top picks for your furry friends.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors group"
        >
          <span>View All Products</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 5-Column Grid matching reference comp */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {products.map((product) => (
          <LifestyleProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
