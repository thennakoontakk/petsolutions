'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import type { PetType } from '@/lib/types';

/* --------------------------------------------------------------------------
   Filter State
   -------------------------------------------------------------------------- */
export interface FilterState {
  petType: PetType | 'All';
  categories: string[];
  priceMin: string;
  priceMax: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
}

export const defaultFilters: FilterState = {
  petType: 'All',
  categories: [],
  priceMin: '',
  priceMax: '',
  sortBy: 'newest',
};

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  /** Category list from database */
  availableCategories?: { id: string; name: string; slug: string }[];
  className?: string;
}

/* --------------------------------------------------------------------------
   Pet Type Tabs
   -------------------------------------------------------------------------- */
const petTypes: Array<PetType | 'All'> = ['All', 'Dog', 'Cat'];

/* --------------------------------------------------------------------------
   Sort Options
   -------------------------------------------------------------------------- */
const sortOptions: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function ProductFilter({
  filters,
  onFilterChange,
  availableCategories = [],
  className = '',
}: ProductFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = useCallback(
    (patch: Partial<FilterState>) => {
      onFilterChange({ ...filters, ...patch });
    },
    [filters, onFilterChange],
  );

  const toggleCategory = useCallback(
    (catKey: string) => {
      const cats = filters.categories.includes(catKey)
        ? filters.categories.filter((c) => c !== catKey)
        : [...filters.categories, catKey];
      update({ categories: cats });
    },
    [filters.categories, update],
  );

  const clearAll = useCallback(() => {
    onFilterChange({ ...defaultFilters });
  }, [onFilterChange]);

  const hasActiveFilters =
    filters.petType !== 'All' ||
    filters.categories.length > 0 ||
    filters.priceMin !== '' ||
    filters.priceMax !== '' ||
    filters.sortBy !== 'newest';

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* ── Pet Type Tabs ── */}
      <div>
        <label className="label" style={{ marginBottom: 'var(--space-3)' }}>
          Pet Type
        </label>
        <div className="flex gap-2">
          {petTypes.map((pt) => {
            const isActive = filters.petType === pt;
            return (
              <button
                key={pt}
                onClick={() => update({ petType: pt })}
                className="relative"
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  border: 'none',
                  background: isActive ? 'transparent' : 'transparent',
                  color: isActive
                    ? 'var(--color-accent-hover)'
                    : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'color 200ms',
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="pet-type-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-accent-light)',
                      border: '1.5px solid var(--color-accent)',
                      zIndex: 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{pt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Category Checkboxes ── */}
      {availableCategories.length > 0 && (
        <div>
          <label className="label" style={{ marginBottom: 'var(--space-3)' }}>
            Category
          </label>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {availableCategories.map((cat) => {
              const catKey = cat.slug || cat.id;
              const isChecked = filters.categories.includes(catKey);
              return (
                <label
                  key={cat.id || cat.slug}
                  className="flex items-center gap-2 cursor-pointer"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: isChecked
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                    padding: 'var(--space-1) 0',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(catKey)}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: 'var(--color-accent)',
                      cursor: 'pointer',
                    }}
                  />
                  {cat.name}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Price Range ── */}
      <div>
        <label className="label" style={{ marginBottom: 'var(--space-3)' }}>
          Price Range (Rs.)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => update({ priceMin: e.target.value })}
            className="input"
            style={{ flex: 1, padding: 'var(--space-2) var(--space-3)' }}
            min={0}
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => update({ priceMax: e.target.value })}
            className="input"
            style={{ flex: 1, padding: 'var(--space-2) var(--space-3)' }}
            min={0}
          />
        </div>
      </div>

      {/* ── Sort By ── */}
      <div>
        <label className="label" style={{ marginBottom: 'var(--space-3)' }}>
          Sort By
        </label>
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              update({ sortBy: e.target.value as FilterState['sortBy'] })
            }
            className="input"
            style={{
              paddingRight: 'var(--space-8)',
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute pointer-events-none"
            style={{
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
        </div>
      </div>

      {/* ── Clear All ── */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="btn btn-ghost text-sm w-full"
          onClick={clearAll}
          style={{ color: 'var(--color-error)', justifyContent: 'center' }}
        >
          <RotateCcw size={14} />
          Clear All Filters
        </motion.button>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Filter Panel ── */}
      <div
        className={`glass hide-mobile ${className}`}
        style={{ padding: 'var(--space-5)' }}
      >
        <h3
          className="font-heading font-semibold flex items-center gap-2"
          style={{
            fontSize: 'var(--text-base)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <SlidersHorizontal size={18} />
          Filters
        </h3>
        {filterContent}
      </div>

      {/* ── Mobile Filter Toggle ── */}
      <div className="hide-desktop" style={{ marginBottom: 'var(--space-4)' }}>
        <button
          className="btn btn-outline w-full"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span
              className="badge badge-accent"
              style={{ marginLeft: 'var(--space-2)' }}
            >
              Active
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0"
              style={{
                background: 'rgba(0,0,0,0.4)',
                zIndex: 'var(--z-overlay)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed glass-strong"
              style={{
                top: 0,
                bottom: 0,
                left: 0,
                width: '85%',
                maxWidth: 360,
                zIndex: 'var(--z-modal)',
                padding: 'var(--space-5)',
                overflowY: 'auto',
                borderRadius: '0 var(--radius-xl) var(--radius-xl) 0',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: 'var(--space-5)' }}
              >
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filters
                </h3>
                <button
                  className="btn btn-icon btn-ghost"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
