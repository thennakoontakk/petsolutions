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
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { Product } from '@/lib/types';

interface WeeklyDealsConfig {
  is_enabled: boolean;
  banner_title: string;
  banner_subtitle: string;
  badge_text: string;
  deal_product_ids: string[];
}

export default function AdminDealsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deals Settings State
  const [isEnabled, setIsEnabled] = useState(true);
  const [bannerTitle, setBannerTitle] = useState('Weekly Deals & Special Offers');
  const [bannerSubtitle, setBannerSubtitle] = useState('Limited-time discounts on top veterinary care & pet food essentials');
  const [badgeText, setBadgeText] = useState('Deal of the Week');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Search in product catalog
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const supabase = createBrowserClient();

        // 1. Fetch all products
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

        // 2. Fetch weekly deals settings
        const { data: settingData } = await supabase
          .from('store_settings')
          .select('value, is_enabled')
          .eq('key', 'weekly_deals')
          .single();

        if (settingData) {
          const enabledStatus = settingData.is_enabled !== false;
          setIsEnabled(enabledStatus);

          if (settingData.value) {
            try {
              const config: WeeklyDealsConfig = typeof settingData.value === 'string' ? JSON.parse(settingData.value) : settingData.value;
              setIsEnabled(settingData.is_enabled !== false && config.is_enabled !== false);
              if (config.banner_title) setBannerTitle(config.banner_title);
              if (config.banner_subtitle !== undefined) setBannerSubtitle(config.banner_subtitle);
              if (config.badge_text) setBadgeText(config.badge_text.replace(/^[🔥⚡✨🎉\s]+/, '').trim() || config.badge_text);
              if (Array.isArray(config.deal_product_ids)) {
                setSelectedProductIds(config.deal_product_ids);
              }
            } catch {
              // fallback
            }
          }
        }
      } catch (err) {
        console.error('Error loading deals manager data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handlers for managing selected deal products
  const handleAddProduct = (productId: string) => {
    if (!selectedProductIds.includes(productId)) {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...selectedProductIds];
    const temp = newIds[index - 1];
    newIds[index - 1] = newIds[index];
    newIds[index] = temp;
    setSelectedProductIds(newIds);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedProductIds.length - 1) return;
    const newIds = [...selectedProductIds];
    const temp = newIds[index + 1];
    newIds[index + 1] = newIds[index];
    newIds[index] = temp;
    setSelectedProductIds(newIds);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const supabase = createBrowserClient();
      const payload: WeeklyDealsConfig = {
        is_enabled: isEnabled,
        banner_title: bannerTitle.trim() || 'Weekly Deals & Special Offers',
        banner_subtitle: bannerSubtitle.trim(),
        badge_text: badgeText.trim() || 'Deal of the Week',
        deal_product_ids: selectedProductIds,
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
      showToast('Weekly Deals updated and published successfully!');
    } catch (err: any) {
      console.error('Error saving deals settings:', err);
      alert(err.message || 'Error saving weekly deals.');
    } finally {
      setSaving(false);
    }
  };

  // Get full product objects for selected IDs
  const selectedProducts = selectedProductIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // Filter available products for the picker
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
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-success text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-slide-down">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
            <Flame className="text-error" /> Weekly Deals & Advertising Offers
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Curate weekly featured deal products displayed on the Homepage below the Hero banner.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-xs font-bold py-2.5 px-6 flex items-center gap-2 shadow-md hover:shadow-lg self-start sm:self-auto"
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
        <div className="py-12 text-center text-xs text-text-muted">Loading Weekly Deals Configuration...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* 1. Banner Settings Card */}
          <div className="glass p-6 rounded-2xl border border-white/40 space-y-4">
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

            <div className="grid grid-1 md:grid-3 gap-4">
              <div>
                <label className="label">Promo Badge Label</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. 🔥 Deal of the Week"
                  className="input w-full text-xs font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Banner Title</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. Weekly Deals & Special Offers"
                  className="input w-full text-xs font-bold"
                />
              </div>

              <div className="md:col-span-3">
                <label className="label">Banner Subtitle / Description</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. Limited-time discounts on top veterinary care & pet food essentials"
                  className="input w-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Selected Weekly Deal Products */}
          <div className="glass p-6 rounded-2xl border border-white/40 space-y-4">
            <div className="flex items-center justify-between border-b border-secondary/40 pb-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                  <Flame size={16} className="text-error" /> Selected Deal Products ({selectedProducts.length})
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  These 4-5 products will be displayed on the homepage deals showcase in this exact order.
                </p>
              </div>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="py-8 text-center bg-secondary/15 rounded-2xl border border-dashed border-secondary-alt/40">
                <Package size={28} className="mx-auto text-text-light mb-2" />
                <p className="text-xs font-bold text-text">No products added to Weekly Deals yet.</p>
                <p className="text-[11px] text-text-muted mt-1">Pick products from the catalog below to add them to this week's offers.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedProducts.map((product, idx) => {
                  const minPrice = product.variants && product.variants.length > 0
                    ? Math.min(...product.variants.map((v) => Number(v.price)))
                    : 0;
                  const comparePrice = product.variants && product.variants.length > 0
                    ? product.variants[0].compare_at_price
                    : null;

                  return (
                    <div
                      key={`selected-deal-${product.id}`}
                      className="p-3.5 bg-white/70 hover:bg-white rounded-2xl border border-secondary-alt/30 flex items-center justify-between gap-4 transition-all shadow-xs"
                    >
                      {/* Order number & Thumbnail */}
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>

                        <div className="w-12 h-12 bg-white rounded-xl border border-secondary-alt/30 p-1 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                          <Image
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-text line-clamp-1">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-text-muted">
                            {product.category && <span className="font-semibold text-accent">{product.category.name}</span>}
                            <span>·</span>
                            <span className="font-bold text-text">{formatPrice(minPrice)}</span>
                            {comparePrice && comparePrice > minPrice && (
                              <span className="line-through text-text-light">{formatPrice(comparePrice)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reorder and Delete Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-secondary/40 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Up"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === selectedProducts.length - 1}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-secondary/40 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Down"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="p-1.5 rounded-lg text-error hover:bg-error-light transition-colors ml-1"
                          title="Remove from Deals"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Catalog Product Picker */}
          <div className="glass p-6 rounded-2xl border border-white/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-secondary/40 pb-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                  <Layers size={16} className="text-accent" /> Add Products from Store Catalog
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">Search and click "Add to Deals" on any item.</p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Search products to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input w-full text-xs pr-8 py-2"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" />
              </div>
            </div>

            {/* Available Products Grid */}
            <div className="grid grid-1 sm:grid-2 lg:grid-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-text-muted">
                  No matching products found.
                </div>
              ) : (
                filteredCatalog.map((product) => {
                  const minPrice = product.variants && product.variants.length > 0
                    ? Math.min(...product.variants.map((v) => Number(v.price)))
                    : 0;

                  return (
                    <div
                      key={`available-${product.id}`}
                      className="p-3 bg-white/60 hover:bg-white rounded-xl border border-secondary-alt/25 flex items-center justify-between gap-2.5 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-lg border border-secondary-alt/30 p-1 flex-shrink-0 flex items-center justify-center">
                          <Image
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            width={36}
                            height={36}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-text truncate">{product.name}</p>
                          <p className="text-[10px] text-accent font-bold mt-0.5">{formatPrice(minPrice)}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProduct(product.id)}
                        className="btn btn-outline btn-sm text-[11px] py-1.5 px-3 flex items-center gap-1 font-bold hover:bg-accent hover:text-white hover:border-accent flex-shrink-0"
                      >
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </form>
      )}
    </div>
  );
}
