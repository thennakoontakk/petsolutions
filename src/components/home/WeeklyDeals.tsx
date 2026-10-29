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

/**
 * Cheapest active variant — the same basis used for the displayed price, so the
 * price a shopper sees is the price that actually lands in the cart.
 */
function getCheapestVariant(product: Product) {
  const active = (product.variants ?? []).filter((v) => v.is_active);
  const pool = active.length > 0 ? active : product.variants ?? [];
  if (pool.length === 0) return null;
  return pool.reduce((cheapest, v) => (Number(v.price) < Number(cheapest.price) ? v : cheapest), pool[0]);
}

function PawPlaceholder() {
  return (
    <div className="flex-center w-full h-full">
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.2 }}
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

function TimeUnit({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className={`wd-unit${accent ? ' wd-accent' : ''}`}>
      <b>{String(value).padStart(2, '0')}</b>
      <i>{label}</i>
    </div>
  );
}

export default function WeeklyDeals() {
  const { addItem } = useCart();
  const [config, setConfig] = useState<WeeklyDealsConfig | null>(null);
  const [dealItems, setDealItems] = useState<PopulatedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Live countdown to Sunday midnight (weekly reset)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

      // Strict check: the section must be active in the admin console
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

        // Preserve the order curated in the admin console
        const populated: PopulatedDeal[] = [];
        for (const d of rawDeals) {
          const prod = prodsMap.get(d.product_id);
          if (prod) populated.push({ deal: d, product: prod });
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

    // Auto-refresh when the shopper returns to the tab (e.g. from the admin console)
    window.addEventListener('focus', loadWeeklyDeals);

    // Realtime: repaint instantly when the admin saves
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

  if (loading || !config || !config.is_enabled || dealItems.length === 0) {
    return null;
  }

  const handleAddToCart = async (item: PopulatedDeal) => {
    const { product } = item;
    const variant = getCheapestVariant(product);

    if (!variant?.id) {
      toast.error('Product variant currently unavailable.');
      return;
    }

    setAddingId(product.id);
    try {
      await addItem(variant.id, 1);
      toast.success(`Claimed offer on ${product.name}! Added to cart.`);
    } catch {
      toast.error('Could not add to cart.');
    } finally {
      setTimeout(() => setAddingId(null), 700);
    }
  };

  const gridMode =
    dealItems.length === 1 ? '1' : dealItems.length === 2 ? '2' : dealItems.length === 3 ? '3' : 'many';

  return (
    <section id="weekly-deals" className="wd-section">
      <div className="container">
        <div className="wd-shell">
          <div className="wd-inner">
            {/* ── Header ── */}
            <div className="wd-head">
              <div className="wd-head-main">
                <div className="wd-badge">
                  <Flame size={11} style={{ fill: '#FFD84D', flexShrink: 0 }} />
                  <span>{config.badge_text || 'Weekly Deals'}</span>
                </div>

                <h2 className="wd-title">{config.banner_title || 'Deals of the Week'}</h2>

                {config.banner_subtitle && <p className="wd-sub">{config.banner_subtitle}</p>}
              </div>

              {/* Countdown — one calm pill instead of four competing boxes */}
              <div className="wd-timer">
                <div className="wd-timer-label">
                  <div className="wd-timer-eyebrow">
                    <Clock size={10} />
                    <span>Ends in</span>
                  </div>
                  <div className="wd-timer-live">
                    <span className="wd-live-dot" />
                    <span>Live offer</span>
                  </div>
                </div>

                <div className="wd-clock">
                  <TimeUnit value={timeLeft.days} label="Days" />
                  <span className="wd-colon">:</span>
                  <TimeUnit value={timeLeft.hours} label="Hrs" />
                  <span className="wd-colon">:</span>
                  <TimeUnit value={timeLeft.minutes} label="Min" />
                  {timeLeft.days === 0 && (
                    <>
                      <span className="wd-colon">:</span>
                      <TimeUnit value={timeLeft.seconds} label="Sec" accent />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Deal cards ── */}
            <div className="wd-grid" data-count={gridMode}>
              {dealItems.map(({ product, deal }, idx) => {
                const cheapest = getCheapestVariant(product);
                const minPrice = cheapest ? Number(cheapest.price) : 0;
                const inStock = (product.variants ?? []).some((v) => v.stock > 0);

                const hasCustomPrice = Boolean(deal.deal_price && deal.deal_price > 0);
                const effectivePrice = hasCustomPrice ? Number(deal.deal_price) : minPrice;
                const saving = hasCustomPrice && minPrice > effectivePrice ? minPrice - effectivePrice : 0;

                // Only ever show a percentage we can prove from the price itself
                const discountPercent =
                  saving > 0 && minPrice > 0 ? Math.round((saving / minPrice) * 100) : null;

                const resolvedImageUrl = getProductImageUrl(product);
                const isAdding = addingId === product.id;

                return (
                  <article
                    key={`weekly-deal-card-${product.id}-${idx}`}
                    className="wd-card"
                    style={{ animationDelay: `${Math.min(idx, 7) * 70}ms` }}
                  >
                    {/* Image stage */}
                    <div className="wd-stage">
                      <Link
                        href={`/products/${product.slug}`}
                        className="wd-stage-link"
                        aria-label={product.name}
                      >
                        {resolvedImageUrl ? (
                          <Image
                            src={resolvedImageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="wd-img"
                          />
                        ) : (
                          <PawPlaceholder />
                        )}
                      </Link>

                      {/* Offer callout — exactly the label typed in the admin console */}
                      {deal.offer_label && (
                        <span className="wd-offer">
                          <Flame size={9} style={{ fill: '#FFD84D', flexShrink: 0 }} />
                          <span>{deal.offer_label}</span>
                        </span>
                      )}

                      {/* Discount stamp, only when the deal price proves it */}
                      {discountPercent !== null && (
                        <span className="wd-stamp">
                          <b>-{discountPercent}%</b>
                          <i>off</i>
                        </span>
                      )}

                      {!inStock && (
                        <div className="wd-veil">
                          <span>Sold out</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="wd-body">
                      {product.brand && <span className="wd-brand">{product.brand}</span>}

                      <Link
                        href={`/products/${product.slug}`}
                        title={product.name}
                        className="wd-name"
                      >
                        {product.name}
                      </Link>

                      {deal.promo_subtext && (
                        <p className="wd-promo">
                          <Sparkles size={9} style={{ flexShrink: 0 }} />
                          <span>{deal.promo_subtext}</span>
                        </p>
                      )}

                      {/* Price block pinned to the bottom so every card lines up */}
                      <div className="wd-buy">
                        <div className="wd-price-row">
                          <span className="wd-price">{formatPriceShort(effectivePrice)}</span>
                          {saving > 0 && <span className="wd-was">{formatPriceShort(minPrice)}</span>}
                        </div>

                        {saving > 0 ? (
                          <span className="wd-save">Save {formatPriceShort(saving)}</span>
                        ) : (
                          <span className="wd-note">Genuine stock</span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddToCart({ product, deal })}
                          disabled={isAdding || !inStock}
                          aria-label={
                            inStock
                              ? `Add ${product.name} to cart for ${formatPriceShort(effectivePrice)}`
                              : `${product.name} is sold out`
                          }
                          className="wd-cta"
                        >
                          {isAdding ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Adding…</span>
                            </>
                          ) : !inStock ? (
                            <span>Sold out</span>
                          ) : (
                            <>
                              <ShoppingCart size={13} />
                              <span>Claim Deal</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div className="wd-foot">
              <p className="wd-foot-note">
                Hand-picked by our veterinary team · prices valid while the timer runs
              </p>

              <Link href="/products" className="wd-foot-link">
                <span>Explore all products</span>
                <ChevronRight size={13} className="wd-chev" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
