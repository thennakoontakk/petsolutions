'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, PackageSearch } from 'lucide-react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

/* --------------------------------------------------------------------------
   Skeleton Card
   -------------------------------------------------------------------------- */
function SkeletonCard() {
  return (
    <div
      className="glass overflow-hidden"
      style={{ borderRadius: 'var(--radius-xl)' }}
    >
      <div
        className="animate-shimmer"
        style={{ aspectRatio: '4 / 3', width: '100%' }}
      />
      <div className="p-4 flex-col gap-2" style={{ display: 'flex' }}>
        <div
          className="animate-shimmer"
          style={{
            height: 12,
            width: '40%',
            borderRadius: 'var(--radius-sm)',
          }}
        />
        <div
          className="animate-shimmer"
          style={{
            height: 16,
            width: '80%',
            borderRadius: 'var(--radius-sm)',
          }}
        />
        <div
          className="animate-shimmer"
          style={{
            height: 16,
            width: '60%',
            borderRadius: 'var(--radius-sm)',
          }}
        />
        <div
          className="animate-shimmer"
          style={{
            height: 20,
            width: '50%',
            borderRadius: 'var(--radius-sm)',
            marginTop: 'var(--space-2)',
          }}
        />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Empty State
   -------------------------------------------------------------------------- */
function EmptyState() {
  return (
    <motion.div
      className="flex-col flex-center text-center p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ gridColumn: '1 / -1', minHeight: 300 }}
    >
      <div
        className="flex-center"
        style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-secondary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <PackageSearch size={36} style={{ color: 'var(--color-text-light)' }} />
      </div>
      <h3
        className="font-heading font-semibold text-lg"
        style={{ marginBottom: 'var(--space-2)' }}
      >
        No products found
      </h3>
      <p className="text-muted text-sm" style={{ maxWidth: 360 }}>
        Try adjusting your filters or search terms to find what you&apos;re
        looking for.
      </p>
    </motion.div>
  );
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function ProductGrid({
  products,
  isLoading = false,
  className = '',
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className={className}>
      {/* ── View Toggle ── */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'var(--space-4)' }}
      >
        <p className="text-sm text-muted">
          {isLoading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
        </p>

        <div className="flex gap-1">
          <button
            className={`btn btn-icon btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`btn btn-icon btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* ── Product Grid / List ── */}
      <motion.div
        layout
        className={viewMode === 'list' ? '' : 'product-catalog-grid'}
        style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'list' ? '1fr' : undefined,
        }}
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <SkeletonCard />
              </motion.div>
            ))
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
