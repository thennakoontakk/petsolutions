'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ShoppingCart, Clock, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPriceShort } from '@/lib/utils/formatPrice';
import { PRODUCT_IMAGE_MAP, OLD_IMAGE_PATH_MAP } from '@/lib/data/productImageMap';
import { useCart } from '@/lib/hooks/useCart';
import { toast } from 'sonner';
import type { Product, WeeklyDealItem, WeeklyDealsConfig } from '@/lib/types';

interface PopulatedDeal {
  deal: WeeklyDealItem;
  product: Product;
}

/** Resolves genuine 2K Supabase Storage image URL or mapped local path */
function getProductImageUrl(product: Product): string {
  if (PRODUCT_IMAGE_MAP[product.id]?.image_url) {
    return PRODUCT_IMAGE_MAP[product.id].image_url;
  }
  if (product.slug && PRODUCT_IMAGE_MAP[product.slug]?.image_url) {
    return PRODUCT_IMAGE_MAP[product.slug].image_url;
  }
  if (product.image_url && OLD_IMAGE_PATH_MAP[product.image_url]) {
    return OLD_IMAGE_PATH_MAP[product.image_url];
  }
  if (product.image_url && OLD_IMAGE_PATH_MAP[`/images/products/${product.image_url.split('/').pop()}`]) {
    return OLD_IMAGE_PATH_MAP[`/images/products/${product.image_url.split('/').pop()}`];
  }
  if (product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/'))) {
    return product.image_url;
  }
  return '/placeholder.png';
}

function PawPlaceholder() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-[#FAF7F2]">
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-25"
      >
        <ellipse cx="32" cy="42" rx="10" ry="8" fill="#FFC800" />
        <circle cx="20" cy="26" r="6" fill="#FFC800" />
        <circle cx="44" cy="26" r="6" fill="#FFC800" />
        <circle cx="14" cy="38" r="5" fill="#FFC800" />
        <circle cx="50" cy="38" r="5" fill="#FFC800" />
      </svg>
    </div>
  );
}

export default function WeeklyDeals() {
  const { addItem } = useCart();
  const [config, setConfig] = useState<WeeklyDealsConfig | null>(null);
  const [dealItems, setDealItems] = useState<PopulatedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Live countdown to Sunday midnight (Weekly reset)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 is Sunday
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      const target = new Date(now);
      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(23, 59, 59, 999);

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadWeeklyDeals = useCallback(async () => {
    try {
      const supabase = createBrowserClient();
      const { data: settingData, error: settingError } = await supabase
        .from('store_settings')
        .select('value, is_enabled')
        .eq('key', 'weekly_deals')
        .maybeSingle();

      // Strict Check: Section must be active in admin console
      if (settingError || !settingData || settingData.is_enabled === false) {
        setLoading(false);
        return;
      }

      let parsed: WeeklyDealsConfig | null = null;
      if (typeof settingData.value === 'string') {
        try {
          parsed = JSON.parse(settingData.value);
        } catch {
          parsed = null;
        }
      } else if (settingData.value) {
        parsed = settingData.value as WeeklyDealsConfig;
      }

      if (!parsed || parsed.is_enabled === false) {
        setLoading(false);
        return;
      }

      setConfig(parsed);

      const rawDeals: WeeklyDealItem[] =
        Array.isArray(parsed.deals) && parsed.deals.length > 0
          ? parsed.deals
          : Array.isArray(parsed.deal_product_ids)
          ? parsed.deal_product_ids.map((id) => ({
              product_id: id,
              offer_label: parsed?.badge_text || 'Deal of the Week',
              deal_price: null,
            }))
          : [];

      // Strict Check: Must have at least 1 curated deal
      if (rawDeals.length === 0) {
        setDealItems([]);
        setLoading(false);
        return;
      }

      const productIds = rawDeals.map((d) => d.product_id).filter(Boolean);

      const { data: prodsData, error: prodsError } = await supabase
        .from('products')
        .select('*, categories(*), product_variants(*)')
        .in('id', productIds)
        .eq('is_active', true);

      if (!prodsError && prodsData) {
        const prodsMap = new Map<string, Product>();
        prodsData.forEach((p: any) => {
          prodsMap.set(p.id, {
            ...p,
            category: p.categories,
            variants: p.product_variants || [],
          });
        });

        const populated: PopulatedDeal[] = [];
        for (const d of rawDeals) {
          const prod = prodsMap.get(d.product_id);
          if (prod) {
            populated.push({ deal: d, product: prod });
          }
        }
        setDealItems(populated);
      }
    } catch (err) {
      console.error('Failed to load weekly deals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeeklyDeals();

    // Auto-refresh when user focuses on the tab (e.g. returns from admin console)
    window.addEventListener('focus', loadWeeklyDeals);

    // Supabase Realtime listener to update storefront immediately when admin saves
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('store_settings_weekly_deals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings', filter: 'key=eq.weekly_deals' },
        () => {
          loadWeeklyDeals();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('focus', loadWeeklyDeals);
      supabase.removeChannel(channel);
    };
  }, [loadWeeklyDeals]);

  // Strict Condition: Only render if enabled AND has active curated products
  if (loading || !config || !config.is_enabled || dealItems.length === 0) {
    return null;
  }

  const handleAddToCart = async (item: PopulatedDeal) => {
    const { product } = item;
    const defaultVariant = product.variants?.[0];

    if (!defaultVariant?.id) {
      toast.error('Product variant currently unavailable.');
      return;
    }

    setAddingId(product.id);
    try {
      await addItem(defaultVariant.id, 1);
      toast.success(`Claimed offer on ${product.name}! Added to cart.`);
    } catch {
      toast.error('Could not add to cart.');
    } finally {
      setTimeout(() => setAddingId(null), 600);
    }
  };

  return (
    <section className="py-8 sm:py-12 container mx-auto px-4">
      {/* ── Natural Resting Tremor & Smooth Hover Expansion ── */}
      <style jsx global>{`
        @keyframes weekly-deal-resting-shake {
          0%, 80%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          82% {
            transform: translateY(-2px) rotate(-0.4deg);
          }
          84% {
            transform: translateY(2px) rotate(0.4deg);
          }
          86% {
            transform: translateY(-1px) rotate(-0.3deg);
          }
          88% {
            transform: translateY(1px) rotate(0.2deg);
          }
          90% {
            transform: translateY(0) rotate(0deg);
          }
        }

        .weekly-deal-card {
          animation: weekly-deal-resting-shake 4.5s ease-in-out infinite;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }

        .weekly-deal-card:hover {
          animation: none !important;
          transform: translateY(-4px) scale(1.025) !important;
          box-shadow: 0 16px 36px -8px rgba(26, 26, 46, 0.12), 0 4px 12px rgba(26, 26, 46, 0.04) !important;
        }
      `}</style>

      {/* ── Premium Rounded Showcase Banner Island (Matching BrandStory container) ── */}
      <div 
        className="relative overflow-hidden w-full border border-[#FFDE6A]/80 shadow-[0_20px_50px_-12px_rgba(255,200,0,0.14),0_8px_24px_rgba(26,26,46,0.04)]"
        style={{
          borderRadius: '36px',
          background: 'linear-gradient(135deg, #FFFDF2 0%, #FFFBEA 45%, #FFF5D8 100%)',
        }}
      >
        {/* Subtle decorative glow elements */}
        <div 
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FFC800]/15 filter blur-3xl pointer-events-none" 
        />
        <div 
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#00ACDF]/10 filter blur-3xl pointer-events-none" 
        />

        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          
          {/* ── Section Header inside Island Card ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#FFDE6A]/50">
            <div>
              {/* Clean Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A2E] text-[#FFC800] text-xs font-black uppercase tracking-wider mb-2 shadow-xs">
                <Flame size={14} className="text-[#FFC800] fill-[#FFC800] animate-pulse" />
                <span>{config.badge_text || 'WEEKLY DEALS'}</span>
              </div>

              {/* Crisp readable dark heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#1A1A2E] tracking-tight">
                {config.banner_title || 'Deals of the Week'}
              </h2>

              {config.banner_subtitle && (
                <p className="text-xs sm:text-sm text-[#555566] mt-1 max-w-xl font-medium">
                  {config.banner_subtitle}
                </p>
              )}
            </div>

            {/* Clean Glass Countdown Box */}
            <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#BDDFEA]/80 shadow-xs self-start sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A2E]">
                <Clock size={15} className="text-[#FFC800]" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Resets in:</span>
              </div>

              <div className="flex items-center gap-1 text-center font-mono">
                <div className="bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-slate-200">
                  <span className="text-xs font-black text-[#1A1A2E]">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="block text-[8px] text-slate-500 font-sans font-bold uppercase">Days</span>
                </div>
                <span className="text-slate-400 font-bold text-xs">:</span>
                <div className="bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-slate-200">
                  <span className="text-xs font-black text-[#1A1A2E]">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[8px] text-slate-500 font-sans font-bold uppercase">Hrs</span>
                </div>
                <span className="text-slate-400 font-bold text-xs">:</span>
                <div className="bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-slate-200">
                  <span className="text-xs font-black text-[#1A1A2E]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[8px] text-slate-500 font-sans font-bold uppercase">Min</span>
                </div>
                <span className="text-slate-400 font-bold text-xs">:</span>
                <div className="bg-[#FFF8D6] px-2 py-0.5 rounded-lg border border-[#FFC800]/50 shadow-2xs">
                  <span className="text-xs font-black text-[#1A1A2E]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[8px] text-[#B8860B] font-sans font-bold uppercase">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Deals Grid: Centered, Compact, Matching Store Theme without Awkward Blank Spaces ── */}
          <div className="flex flex-wrap items-stretch justify-center gap-3.5 sm:gap-5">
            {dealItems.map(({ product, deal }, idx) => {
              const minPrice =
                product.variants && product.variants.length > 0
                  ? Math.min(...product.variants.map((v) => Number(v.price)))
                  : 0;

              const hasCustomPrice = deal.deal_price && deal.deal_price > 0;
              const effectivePrice = hasCustomPrice ? deal.deal_price! : minPrice;
              const discountPercent =
                hasCustomPrice && minPrice > effectivePrice
                  ? Math.round(((minPrice - effectivePrice) / minPrice) * 100)
                  : null;

              const resolvedImageUrl = getProductImageUrl(product);

              return (
                <div
                  key={`weekly-deal-card-${product.id}-${idx}`}
                  className={`weekly-deal-card relative bg-white border border-[#BDDFEA]/80 rounded-[22px] sm:rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-between shadow-[0_4px_18px_rgba(26,26,46,0.06)] ${
                    dealItems.length === 1
                      ? 'w-full max-w-[270px]'
                      : 'w-[calc(50%-7px)] sm:w-[210px] md:w-[225px] lg:w-[235px] max-w-[245px] shrink-0'
                  }`}
                  style={{
                    animationDelay: `${idx * 1.4}s`,
                  }}
                >
                  <div>
                    {/* Top Row: Offer Badge & Discount Tag */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A1A2E] text-[#FFC800] text-[10px] font-extrabold uppercase tracking-wide truncate max-w-[120px] sm:max-w-none">
                        <Flame size={11} className="text-[#FFC800] fill-[#FFC800] shrink-0" />
                        <span className="truncate">{deal.offer_label || 'Special Offer'}</span>
                      </span>

                      {discountPercent ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#EF4444] border border-[#FCA5A5]/40 text-[10px] font-extrabold shrink-0">
                          -{discountPercent}%
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-[#00ACDF] bg-[#E6F4F8] border border-[#BDDFEA]/60 px-2 py-0.5 rounded-full shrink-0">
                          Deal
                        </span>
                      )}
                    </div>

                    {/* Clean Product Image Container */}
                    <div
                      className="relative w-full overflow-hidden shrink-0"
                      style={{
                        aspectRatio: '1 / 1',
                        borderRadius: '16px',
                        backgroundColor: '#FAF7F2',
                      }}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="block relative w-full h-full group/img"
                      >
                        {resolvedImageUrl ? (
                          <Image
                            src={resolvedImageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-contain p-2.5 sm:p-3 group-hover/img:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <PawPlaceholder />
                        )}
                      </Link>
                    </div>

                    {/* Clean Typography */}
                    <div className="mt-3 space-y-0.5">
                      {product.brand && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                          {product.brand}
                        </span>
                      )}

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xs sm:text-[13px] font-bold text-[#1A1A2E] line-clamp-2 hover:text-[#00ACDF] transition-colors leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.4rem]"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {deal.promo_subtext ? (
                        <p className="text-[10px] text-[#00ACDF] font-semibold line-clamp-1 pt-0.5">
                          ✨ {deal.promo_subtext}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          Authorized supply
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Button (Using exact Brand Yellow button from ProductCard) */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-[#1A1A2E] truncate">
                        {formatPriceShort(effectivePrice)}
                      </div>
                      {hasCustomPrice && minPrice > effectivePrice && (
                        <div className="text-[10px] text-slate-400 line-through truncate">
                          {formatPriceShort(minPrice)}
                        </div>
                      )}
                    </div>

                    {/* ── Signature Brand Yellow (#FFC800) Button matching other cards ── */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart({ product, deal })}
                      disabled={addingId === product.id}
                      className="product-card-action-btn shrink-0"
                      style={{
                        backgroundColor: '#FFC800',
                        color: '#1A1A2E',
                        borderRadius: '9999px',
                        boxShadow: '0 3px 10px rgba(255, 200, 0, 0.3)',
                        fontWeight: 800,
                        fontSize: '11px',
                        padding: '6px 13px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                      title="Add to cart"
                    >
                      {addingId === product.id ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-[#1A1A2E]" />
                          <span className="product-card-action-text font-bold text-[10px] sm:text-[11px]">Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} className="text-[#1A1A2E]" />
                          <span className="product-card-action-text font-bold text-[10px] sm:text-[11px]">
                            Claim<span className="hidden sm:inline">&nbsp;Deal</span>
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer View All Link inside Island Container */}
          <div className="mt-7 pt-4 border-t border-[#FFDE6A]/40 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1A2E] hover:text-[#00ACDF] hover:underline underline-offset-4 tracking-wide uppercase transition-colors"
            >
              <span>Explore all catalog products & seasonal offers</span>
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
