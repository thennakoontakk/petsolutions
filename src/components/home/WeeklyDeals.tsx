'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

interface WeeklyDealsSettings {
  is_enabled: boolean;
  banner_title: string;
  banner_subtitle: string;
  badge_text: string;
  deal_product_ids: string[];
}

export default function WeeklyDeals() {
  const [dealsSettings, setDealsSettings] = useState<WeeklyDealsSettings>({
    is_enabled: false,
    banner_title: 'Weekly Deals & Special Offers',
    banner_subtitle: 'Limited-time discounts on top veterinary care & pet food essentials',
    badge_text: 'Deal of the Week',
    deal_product_ids: [],
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeeklyDeals() {
      try {
        const supabase = createBrowserClient();

        // 1. Fetch weekly deals configuration from store_settings
        const { data: settingData } = await supabase
          .from('store_settings')
          .select('value, is_enabled')
          .eq('key', 'weekly_deals')
          .single();

        let config: any = {};
        let isSectionEnabled = true;
        let dealIds: string[] = [];

        if (settingData) {
          try {
            config = typeof settingData.value === 'string' ? JSON.parse(settingData.value) : (settingData.value || {});
          } catch {
            config = {};
          }
          isSectionEnabled = (settingData.is_enabled !== false) && (config.is_enabled !== false);
          dealIds = Array.isArray(config.deal_product_ids) ? config.deal_product_ids : [];
        }

        const parsedSettings: WeeklyDealsSettings = {
          is_enabled: isSectionEnabled,
          banner_title: config.banner_title || 'Weekly Deals & Special Offers',
          banner_subtitle: config.banner_subtitle || 'Limited-time discounts on top veterinary care & pet food essentials',
          badge_text: config.badge_text || 'Deal of the Week',
          deal_product_ids: dealIds,
        };

        setDealsSettings(parsedSettings);

        // If explicitly disabled by admin, stop and hide
        if (!isSectionEnabled) {
          setLoading(false);
          return;
        }

        // 2. Fetch deal products: either admin curated IDs, or top 4 products
        if (dealIds.length > 0) {
          const { data: prodsData, error: prodsError } = await supabase
            .from('products')
            .select('*, categories(*), product_variants(*)')
            .in('id', dealIds)
            .eq('is_active', true);

          if (!prodsError && prodsData) {
            const formatted = prodsData.map((p: any) => ({
              ...p,
              category: p.categories,
              variants: p.product_variants || [],
            }));

            // Sort products according to the order defined in deal_product_ids
            formatted.sort((a, b) => {
              const idxA = dealIds.indexOf(a.id);
              const idxB = dealIds.indexOf(b.id);
              return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
            });

            setProducts(formatted);
          }
        } else {
          // Initial fallback before admin customizes: fetch 4 active products
          const { data: prodsData } = await supabase
            .from('products')
            .select('*, categories(*), product_variants(*)')
            .eq('is_active', true)
            .limit(4);

          if (prodsData) {
            const formatted = prodsData.map((p: any) => ({
              ...p,
              category: p.categories,
              variants: p.product_variants || [],
            }));
            setProducts(formatted);
          }
        }
      } catch (err) {
        console.error('Error fetching weekly deals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyDeals();
  }, []);

  if (loading) {
    return null;
  }

  // If section is disabled or has no products added by admin, hide completely
  if (!dealsSettings.is_enabled || products.length === 0) {
    return null;
  }

  // Clean badge text: remove duplicate emoji if already entered by user
  const rawBadge = dealsSettings.badge_text || 'Deal of the Week';
  const cleanBadgeText = rawBadge.replace(/^[🔥⚡✨🎉\s]+/, '').trim() || rawBadge;

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden" style={{ backgroundColor: 'var(--color-dominant-alt)' }}>
      {/* Decorative background glow accents */}
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[250px] opacity-40 blur-3xl pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255, 200, 0, 0.25) 0%, rgba(0, 172, 223, 0.15) 100%)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Promotional Banner Header */}
        <div 
          className="p-6 sm:p-8 rounded-3xl mb-8 glass-strong border border-accent/30 shadow-lg relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 248, 214, 0.65) 100%)',
          }}
        >


          {/* Heading & CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-text">
                {dealsSettings.banner_title}
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
                {dealsSettings.banner_subtitle}
              </p>
            </div>

            <Link
              href="/products"
              className="btn btn-primary text-xs font-bold flex items-center gap-2 self-start md:self-auto shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <span>Explore All Offers</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Deals Product Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid-products"
        >
          {products.map((product) => (
            <ProductCard key={`deal-${product.id}`} product={product} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
