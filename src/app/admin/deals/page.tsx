'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Flame,
  Plus,
  Trash2,
  Save,
  Search,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Package,
  Layers,
  Tag,
  Percent,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { Product, WeeklyDealItem, WeeklyDealsConfig } from '@/lib/types';

const PRESET_OFFER_LABELS = [
  'Buy 1 get 2 FREE',
  'Buy 1 get 1 FREE',
  '20% OFF',
  '30% OFF',
  'Save LKR 1,500',
  'Special Combo',
  'Deal of the Week',
];

export default function AdminDealsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Deals Settings State
  const [isEnabled, setIsEnabled] = useState(true);
  const [bannerTitle, setBannerTitle] = useState('DEALS OF THE WEEK');
  const [bannerSubtitle, setBannerSubtitle] = useState(
    'While supplies last. Limited quantities on top veterinary care & pet food essentials.'
  );
  const [badgeText, setBadgeText] = useState('Deal of the Week');

  // Curated Deal Items with Offer Customization
  const [deals, setDeals] = useState<WeeklyDealItem[]>([]);

  // Search in product catalog
  const [searchQuery, setSearchQuery] = useState('');

  // Active expanded deal item for editing
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const supabase = createBrowserClient();

        // 1. Fetch all active products
        const { data: prodsData, error: prodsError } = await supabase
          .from('products')
          .select('*, categories(*), product_variants(*)')
          .eq('is_active', true)
          .order('name');

        if (prodsError) throw prodsError;

        if (prodsData) {
          const formatted = prodsData.map((p: any) => ({
            ...p,
            category: p.categories,
            variants: p.product_variants || [],
          }));
          setAllProducts(formatted);
        }

        // 2. Fetch weekly deals configuration
        const { data: settingData } = await supabase
          .from('store_settings')
          .select('value, is_enabled')
          .eq('key', 'weekly_deals')
          .single();

        if (settingData) {
          setIsEnabled(settingData.is_enabled !== false);

          if (settingData.value) {
            try {
              const config: any =
                typeof settingData.value === 'string'
                  ? JSON.parse(settingData.value)
                  : settingData.value;

              setIsEnabled(settingData.is_enabled !== false && config.is_enabled !== false);
              if (config.banner_title) setBannerTitle(config.banner_title);
              if (config.banner_subtitle !== undefined) setBannerSubtitle(config.banner_subtitle);
              if (config.badge_text) setBadgeText(config.badge_text);

              if (Array.isArray(config.deals) && config.deals.length > 0) {
                setDeals(config.deals);
              } else if (Array.isArray(config.deal_product_ids) && config.deal_product_ids.length > 0) {
                setDeals(
                  config.deal_product_ids.map((id: string) => ({
                    product_id: id,
                    offer_label: 'Deal of the Week',
                    deal_price: null,
                    promo_subtext: 'While supplies last',
                  }))
                );
              }
            } catch {
              // fallback
            }
          }
        }
      } catch (err) {
        console.error('Error loading deals manager data:', err);
        toast.error('Failed to load deals data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handlers for managing selected deal products
  const handleAddProduct = (productId: string) => {
    if (!deals.some((d) => d.product_id === productId)) {
      const newDeal: WeeklyDealItem = {
        product_id: productId,
        offer_label: 'Buy 1 get 2 FREE',
        deal_price: null,
        promo_subtext: 'While supplies last',
      };
      const updated = [...deals, newDeal];
      setDeals(updated);
      setActiveEditIndex(updated.length - 1);
      toast.success('Product added to Weekly Deals.');
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const updated = deals.filter((d) => d.product_id !== productId);
    setDeals(updated);
    if (activeEditIndex !== null && activeEditIndex >= updated.length) {
      setActiveEditIndex(updated.length > 0 ? updated.length - 1 : null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newDeals = [...deals];
    const temp = newDeals[index - 1];
    newDeals[index - 1] = newDeals[index];
    newDeals[index] = temp;
    setDeals(newDeals);
    setActiveEditIndex(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === deals.length - 1) return;
    const newDeals = [...deals];
    const temp = newDeals[index + 1];
    newDeals[index + 1] = newDeals[index];
    newDeals[index] = temp;
    setDeals(newDeals);
    setActiveEditIndex(index + 1);
  };

  const updateDealItem = (index: number, patch: Partial<WeeklyDealItem>) => {
    const newDeals = [...deals];
    newDeals[index] = { ...newDeals[index], ...patch };
    setDeals(newDeals);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const supabase = createBrowserClient();
      const payload: WeeklyDealsConfig = {
        is_enabled: isEnabled,
        banner_title: bannerTitle.trim() || 'DEALS OF THE WEEK',
        banner_subtitle: bannerSubtitle.trim(),
        badge_text: badgeText.trim() || 'Deal of the Week',
        deal_product_ids: deals.map((d) => d.product_id),
        deals: deals,
      };

      const { error } = await supabase
        .from('store_settings')
        .upsert(
          {
            key: 'weekly_deals',
            value: JSON.stringify(payload),
            is_enabled: isEnabled,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) throw error;
      toast.success('Weekly Deals & Offers updated and published successfully!');
    } catch (err: any) {
      console.error('Error saving deals settings:', err);
      toast.error(err.message || 'Error saving weekly deals.');
    } finally {
      setSaving(false);
    }
  };

  // Selected product objects mapping
  const dealProductsWithMeta = deals
    .map((deal) => {
      const prod = allProducts.find((p) => p.id === deal.product_id);
      return prod ? { product: prod, deal } : null;
    })
    .filter(Boolean) as { product: Product; deal: WeeklyDealItem }[];

  const selectedProductIds = deals.map((d) => d.product_id);

  // Filter available products for the catalog picker
  const filteredCatalog = allProducts.filter((p) => {
    if (selectedProductIds.includes(p.id)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-text flex items-center gap-2.5">
            <Flame className="text-error" /> Weekly Deals & Advertising Offers
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Curate products, specify custom promotion badges (e.g. &ldquo;Buy 1 get 2 FREE&rdquo;),
            deal prices, and reorder the smooth left-to-right carousel displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-xs font-black py-2.5 px-6 flex items-center gap-2 shadow-md hover:shadow-lg self-start sm:self-auto cursor-pointer"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <>
              <Save size={15} /> Save & Publish Deals
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-text-muted">
          Loading Weekly Deals Configuration...
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* ================================================================
              1. PROMOTIONAL BANNER SETTINGS CARD
              ================================================================ */}
          <div className="glass p-6 rounded-3xl border border-white/40 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-secondary/40 pb-3">
              <h3 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                <Sparkles size={16} className="text-accent" /> Promotional Banner Settings
              </h3>

              {/* Enable / Disable Toggle */}
              <button
                type="button"
                onClick={() => setIsEnabled(!isEnabled)}
                className="flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <span className={isEnabled ? 'text-success' : 'text-text-muted'}>
                  {isEnabled ? 'Section Enabled' : 'Section Hidden'}
                </span>
                {isEnabled ? (
                  <ToggleRight size={28} className="text-success" />
                ) : (
                  <ToggleLeft size={28} className="text-text-light" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label text-xs font-bold">Badge Text</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. Deal of the Week"
                  className="input w-full text-xs font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-xs font-bold">Banner Heading Title</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. DEALS OF THE WEEK"
                  className="input w-full text-xs font-black"
                />
              </div>

              <div className="md:col-span-3">
                <label className="label text-xs font-bold">Banner Subtitle / Promotional Subline</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. While supplies last. Limited quantities on top veterinary care & pet food essentials."
                  className="input w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* ================================================================
              2. CURATED DEALS & CUSTOM OFFER SPECIFICATIONS
              ================================================================ */}
          <div className="glass p-6 rounded-3xl border border-white/40 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-secondary/40 pb-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                  <Flame size={16} className="text-error" /> Curated Deal Products ({dealProductsWithMeta.length})
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Customize the offer tag, promotional price, and sequence for each product in the carousel.
                </p>
              </div>

              {dealProductsWithMeta.length > 0 && (
                <span className="text-[11px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  {dealProductsWithMeta.length} active in carousel
                </span>
              )}
            </div>

            {dealProductsWithMeta.length === 0 ? (
              <div className="py-12 text-center bg-secondary/15 rounded-2xl border border-dashed border-secondary-alt/40">
                <Package size={32} className="mx-auto text-text-light mb-2" />
                <p className="text-xs font-bold text-text">No products added to Weekly Deals yet.</p>
                <p className="text-[11px] text-text-muted mt-1">
                  Use the product picker below to select products and attach special offers.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dealProductsWithMeta.map(({ product, deal }, idx) => {
                  const minPrice =
                    product.variants && product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => Number(v.price)))
                      : 0;

                  const isExpanded = activeEditIndex === idx;

                  // Calculate discount percentage if deal_price set
                  const hasCustomPrice = deal.deal_price && deal.deal_price > 0;
                  const discountPercent =
                    hasCustomPrice && minPrice > (deal.deal_price || 0)
                      ? Math.round(((minPrice - (deal.deal_price || 0)) / minPrice) * 100)
                      : null;

                  return (
                    <div
                      key={`deal-item-${product.id}`}
                      className={`rounded-2xl border transition-all ${
                        isExpanded
                          ? 'bg-white border-accent shadow-sm'
                          : 'bg-white/70 hover:bg-white border-secondary-alt/30 shadow-2xs'
                      }`}
                    >
                      {/* Deal Header Row */}
                      <div className="p-3.5 flex items-center justify-between gap-3">
                        <div
                          className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1"
                          onClick={() => setActiveEditIndex(isExpanded ? null : idx)}
                        >
                          <span className="w-6 h-6 rounded-full bg-[#16335B] text-[#FFD800] font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>

                          <div className="w-12 h-12 bg-[#FEFCF3] rounded-xl border border-secondary-alt/30 p-1 shrink-0 overflow-hidden flex items-center justify-center relative">
                            <Image
                              src={product.image_url || '/placeholder.png'}
                              alt={product.name}
                              width={44}
                              height={44}
                              className="object-contain w-full h-full"
                            />
                          </div>

                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-text truncate">{product.name}</p>
                              {deal.offer_label && (
                                <span className="bg-[#16335B] text-[#FFD800] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                                  {deal.offer_label}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted">
                              <span>Regular: {formatPrice(minPrice)}</span>
                              {hasCustomPrice && (
                                <>
                                  <span>·</span>
                                  <span className="font-bold text-rose-600">
                                    Deal: {formatPrice(deal.deal_price!)} ({discountPercent}% OFF)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls: Reorder, Expand/Collapse & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-secondary/40 disabled:opacity-20 cursor-pointer"
                            title="Move Up in Carousel"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === dealProductsWithMeta.length - 1}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-secondary/40 disabled:opacity-20 cursor-pointer"
                            title="Move Down in Carousel"
                          >
                            <ArrowDown size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveEditIndex(isExpanded ? null : idx)}
                            className="px-2.5 py-1 text-xs font-bold text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
                          >
                            {isExpanded ? 'Done' : 'Edit Offer'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="p-1.5 rounded-lg text-error hover:bg-error-light transition-colors ml-1 cursor-pointer"
                            title="Remove from Deals"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Offer Customization Panel */}
                      {isExpanded && (
                        <div className="p-4 pt-1 border-t border-secondary/40 bg-secondary/10 rounded-b-2xl space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Offer Label Input & Preset Chips */}
                            <div className="md:col-span-2 space-y-2">
                              <label className="label text-xs font-bold flex items-center gap-1.5">
                                <Tag size={13} className="text-accent" /> Offer Callout Tag
                              </label>
                              <input
                                type="text"
                                value={deal.offer_label || ''}
                                onChange={(e) =>
                                  updateDealItem(idx, { offer_label: e.target.value })
                                }
                                placeholder="e.g. Buy 1 get 2 FREE, 25% OFF, Save LKR 1,500"
                                className="input w-full text-xs font-black uppercase"
                              />

                              {/* Preset Chips */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] text-text-muted font-semibold mr-1">Presets:</span>
                                {PRESET_OFFER_LABELS.map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => updateDealItem(idx, { offer_label: preset })}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                      deal.offer_label === preset
                                        ? 'bg-[#16335B] text-[#FFD800] border-[#16335B]'
                                        : 'bg-white text-text-muted border-secondary-alt/40 hover:border-accent hover:text-text'
                                    }`}
                                  >
                                    {preset}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Promotional Deal Price Override */}
                            <div className="space-y-2">
                              <label className="label text-xs font-bold flex items-center gap-1.5">
                                <Percent size={13} className="text-rose-600" /> Deal Price (LKR)
                              </label>
                              <input
                                type="number"
                                value={deal.deal_price ?? ''}
                                onChange={(e) =>
                                  updateDealItem(idx, {
                                    deal_price: e.target.value ? parseFloat(e.target.value) : null,
                                  })
                                }
                                placeholder={`Regular: ${minPrice}`}
                                className="input w-full text-xs font-bold"
                              />
                              <p className="text-[10px] text-text-muted">
                                {hasCustomPrice
                                  ? `Overrides price to ${formatPrice(deal.deal_price!)} (Regular: ${formatPrice(minPrice)})`
                                  : `Leave blank to use catalog regular price (${formatPrice(minPrice)})`}
                              </p>
                            </div>

                            {/* Promotional Subtext */}
                            <div className="md:col-span-3">
                              <label className="label text-xs font-bold">
                                Promotional Subtext (Optional)
                              </label>
                              <input
                                type="text"
                                value={deal.promo_subtext || ''}
                                onChange={(e) =>
                                  updateDealItem(idx, { promo_subtext: e.target.value })
                                }
                                placeholder="e.g. Earn 2x loyalty points · Limited stock available"
                                className="input w-full text-xs"
                              />
                            </div>
                          </div>

                          {/* Live Visual Card Preview */}
                          <div className="mt-3 p-3 bg-white rounded-xl border border-secondary-alt/30 flex items-center gap-3">
                            <Eye size={16} className="text-accent shrink-0" />
                            <span className="text-[11px] font-bold text-text shrink-0">Live Preview:</span>
                            <div className="flex items-center gap-2 overflow-hidden text-xs">
                              <span className="w-8 h-8 rounded-full bg-[#FFD800] border border-dashed border-amber-600 flex flex-col items-center justify-center text-[5px] font-black uppercase text-[#16335B] shrink-0">
                                <span>Deal</span>
                              </span>
                              <span className="font-bold text-[#16335B] truncate">{product.name}</span>
                              {deal.offer_label && (
                                <span className="px-2 py-0.5 rounded bg-[#16335B] text-[#FFD800] text-[9px] font-black uppercase">
                                  {deal.offer_label}
                                </span>
                              )}
                              <span className="font-black text-[#16335B]">
                                {formatPrice(deal.deal_price ?? minPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================================================================
              3. CATALOG PRODUCT PICKER
              ================================================================ */}
          <div className="glass p-6 rounded-3xl border border-white/40 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-secondary/40 pb-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                  <Layers size={16} className="text-accent" /> Add Products from Store Catalog
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Select products to feature in the Weekly Deals section.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full text-xs pr-8 py-2"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" />
              </div>
            </div>

            {/* Available Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[440px] overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="col-span-full py-10 text-center text-xs text-text-muted">
                  No matching products found.
                </div>
              ) : (
                filteredCatalog.map((product) => {
                  const minPrice =
                    product.variants && product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => Number(v.price)))
                      : 0;

                  return (
                    <div
                      key={`available-${product.id}`}
                      className="p-3 bg-white/70 hover:bg-white rounded-2xl border border-secondary-alt/25 flex items-center justify-between gap-3 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-11 h-11 bg-[#FEFCF3] rounded-xl border border-secondary-alt/30 p-1 shrink-0 flex items-center justify-center">
                          <Image
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            width={38}
                            height={38}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-text truncate">{product.name}</p>
                          <p className="text-[10px] text-accent font-black mt-0.5">
                            {formatPrice(minPrice)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProduct(product.id)}
                        className="btn btn-outline btn-sm text-[11px] py-1.5 px-3 flex items-center gap-1 font-bold hover:bg-accent hover:text-white hover:border-accent shrink-0 cursor-pointer"
                      >
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
