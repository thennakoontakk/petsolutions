'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Pill, Activity, Sparkles, Bone, Box } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

const categoryMeta: Record<string, { name: string; icon: any; color: string; bg: string; defaultOrder: number }> = {
  'parasite-tick-control': {
    name: 'Parasite & Tick Control',
    icon: Shield,
    color: '#E05A47',
    bg: 'rgba(224, 90, 71, 0.12)',
    defaultOrder: 1,
  },
  'health-supplements': {
    name: 'Health & Supplements',
    icon: Pill,
    color: '#D29C22',
    bg: 'rgba(210, 156, 34, 0.12)',
    defaultOrder: 2,
  },
  'wound-care-topical-pharmacy': {
    name: 'Wound Care & Pharmacy',
    icon: Activity,
    color: '#D94D4D',
    bg: 'rgba(217, 77, 77, 0.12)',
    defaultOrder: 3,
  },
  'medicated-shampoos-grooming': {
    name: 'Medicated Shampoos',
    icon: Sparkles,
    color: '#3A9D7B',
    bg: 'rgba(58, 157, 123, 0.12)',
    defaultOrder: 4,
  },
  'dry-wet-pet-food': {
    name: 'Dry & Wet Pet Food',
    icon: Bone,
    color: '#E28743',
    bg: 'rgba(226, 135, 67, 0.12)',
    defaultOrder: 5,
  },
  'cat-litter-hygiene': {
    name: 'Cat Litter & Hygiene',
    icon: Box,
    color: '#7E60B8',
    bg: 'rgba(126, 96, 184, 0.12)',
    defaultOrder: 6,
  },
};

export default function CategoryShowcase() {
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<
    Array<{
      slug: string;
      name: string;
      icon: any;
      color: string;
      bg: string;
      count: number;
    }>
  >([]);

  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        const supabase = createBrowserClient();
        
        // Fetch categories and count active products in each
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('id, name, slug, display_order');

        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('id, category_id')
          .eq('is_active', true);

        if (catError || !catData) throw catError;

        // Calculate count per category
        const countsMap: Record<string, number> = {};
        if (prodData) {
          prodData.forEach((p: any) => {
            if (p.category_id) {
              countsMap[p.category_id] = (countsMap[p.category_id] || 0) + 1;
            }
          });
        }

        const formatted = catData
          .map((cat: any) => {
            const meta = categoryMeta[cat.slug] || {
              name: cat.name,
              icon: Sparkles,
              color: '#3A9D7B',
              bg: 'rgba(58, 157, 123, 0.12)',
              defaultOrder: cat.display_order || 99,
            };
            return {
              slug: cat.slug,
              name: meta.name || cat.name,
              icon: meta.icon,
              color: meta.color,
              bg: meta.bg,
              count: countsMap[cat.id] || 0,
              order: cat.display_order || meta.defaultOrder,
            };
          })
          .sort((a, b) => a.order - b.order);

        setCategoriesWithCounts(formatted);
      } catch (err) {
        console.error('Error fetching category showcase:', err);
        // Fallback to default list if fetch fails
        const fallback = Object.entries(categoryMeta).map(([slug, meta]) => ({
          slug,
          name: meta.name,
          icon: meta.icon,
          color: meta.color,
          bg: meta.bg,
          count: 0,
        }));
        setCategoriesWithCounts(fallback);
      }
    }

    fetchCategoryCounts();
  }, []);

  const displayList = categoriesWithCounts.length > 0 
    ? categoriesWithCounts 
    : Object.entries(categoryMeta).map(([slug, meta]) => ({
        slug,
        name: meta.name,
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
        count: 0,
      }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 150, damping: 18 } as const,
    },
  };

  return (
    <section className="py-16 bg-white/30 backdrop-blur-md" style={{ backgroundColor: 'var(--color-dominant-alt)' }}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold text-accent tracking-widest">Browse Departments</span>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-text mt-1">
            Shop by Category
          </h2>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full mt-3" />
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {displayList.map((cat) => {
            const IconComponent = cat.icon;
            
            return (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass p-5 rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-white/50 shadow-md hover:shadow-xl hover:border-accent/30 h-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  {/* Styled Icon Wrapper */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 flex-shrink-0"
                    style={{ 
                      backgroundColor: cat.bg, 
                      color: cat.color,
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-text mb-1 block line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                    {cat.name}
                  </h3>
                  
                  <span className="text-[9px] sm:text-[10px] font-bold text-text-muted bg-white/70 border border-secondary-alt/25 px-2.5 py-0.5 rounded-full mt-1">
                    {cat.count > 0 ? `${cat.count} ${cat.count === 1 ? 'Item' : 'Items'}` : 'View All'}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

