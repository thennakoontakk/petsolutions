'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
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
  availableCategories?: { id: string; name: string; slug: string }[];
  totalProducts?: number;
  filteredCount?: number;
  className?: string;
}

/* --------------------------------------------------------------------------
   Options
   -------------------------------------------------------------------------- */
const petTypes: Array<PetType | 'All'> = ['All', 'Dog', 'Cat'];

const sortOptions: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Alphabetical: A → Z' },
];

const pricePresets = [
  { label: 'Under Rs. 1,000', min: '', max: '1000' },
  { label: 'Rs. 1,000 - 2,500', min: '1000', max: '2500' },
  { label: 'Rs. 2,500 - 5,000', min: '2500', max: '5000' },
  { label: 'Rs. 5,000+', min: '5000', max: '' },
];

/* --------------------------------------------------------------------------
   Top Horizontal Product Filter Component
   -------------------------------------------------------------------------- */
export default function ProductFilter({
  filters,
  onFilterChange,
  availableCategories = [],
  totalProducts,
  filteredCount,
  className = '',
}: ProductFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const removeCategory = useCallback(
    (catKey: string) => {
      update({ categories: filters.categories.filter((c) => c !== catKey) });
    },
    [filters.categories, update],
  );

  const clearAll = useCallback(() => {
    onFilterChange({ ...defaultFilters });
  }, [onFilterChange]);

  // Counts of active filters
  const activeCategoryCount = filters.categories.length;
  const isPetFiltered = filters.petType !== 'All';
  const isPriceFiltered = filters.priceMin !== '' || filters.priceMax !== '';
  const isSortFiltered = filters.sortBy !== 'newest';

  const activeFilterCount =
    (isPetFiltered ? 1 : 0) +
    activeCategoryCount +
    (isPriceFiltered ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || isSortFiltered;

  // Resolve category name helper
  const getCategoryName = (slugOrId: string) => {
    const found = availableCategories.find(
      (c) => c.slug === slugOrId || c.id === slugOrId,
    );
    return found ? found.name : slugOrId;
  };

  const isFilterActive = isExpanded || activeFilterCount > 0;

  return (
    <div className={`w-full ${className}`}>
      {/* ── 1. MAIN HORIZONTAL TOOLBAR ── */}
      <div 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          border: '1px solid rgba(231, 229, 228, 0.9)',
          padding: '12px 16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Left section: Filter Toggle Button + Quick Pet Type Tabs */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Filters Toggle Button */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              type="button"
              style={{
                backgroundColor: isFilterActive ? '#1A1A2E' : '#F5F5F4',
                color: isFilterActive ? '#FFFFFF' : '#1A1A2E',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isFilterActive ? '0 2px 5px rgba(26, 26, 46, 0.2)' : 'none',
              }}
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span 
                  style={{
                    backgroundColor: '#00ACDF',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                size={14}
                style={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease',
                  opacity: 0.8,
                }}
              />
            </button>

            {/* Subtle vertical divider */}
            <div style={{ width: '1px', height: '22px', backgroundColor: '#E7E5E4' }} className="hidden sm:block" />

            {/* Quick Pet Type Pill Tabs */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F5F5F4',
                padding: '3px',
                borderRadius: '12px',
                border: '1px solid #E7E5E4',
              }}
            >
              {petTypes.map((pt) => {
                const isActive = filters.petType === pt;
                return (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => update({ petType: pt })}
                    style={{
                      position: 'relative',
                      padding: '6px 14px',
                      borderRadius: '9px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: isActive ? '#1A1A2E' : '#78716C',
                      transition: 'color 150ms ease',
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pet-tab-active"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: '#FFFFFF',
                          borderRadius: '9px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          zIndex: 0,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 1 }}>{pt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right section: Count & Sort Dropdown */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            {/* Showing Count */}
            {filteredCount !== undefined && totalProducts !== undefined && (
              <span style={{ fontSize: '12px', color: '#78716C', fontWeight: 500 }} className="hidden md:inline-block">
                {filteredCount} of {totalProducts} products
              </span>
            )}

            {/* Sort Dropdown */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  update({ sortBy: e.target.value as FilterState['sortBy'] })
                }
                aria-label="Sort products"
                style={{
                  appearance: 'none',
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #E7E5E4',
                  borderRadius: '12px',
                  padding: '8px 32px 8px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#1A1A2E',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                style={{
                  position: 'absolute',
                  right: '10px',
                  pointerEvents: 'none',
                  color: '#78716C',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. ACTIVE FILTER CHIPS ROW ── */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              marginTop: '10px',
              padding: '0 4px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px' }}>
              Active:
            </span>

            {/* Pet Type Chip */}
            {isPetFiltered && (
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFF9E6',
                  border: '1px solid #FFE082',
                  color: '#8C6D00',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <span>Pet: {filters.petType}</span>
                <button
                  type="button"
                  onClick={() => update({ petType: 'All' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: '#8C6D00' }}
                  aria-label="Remove pet filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Category Chips */}
            {filters.categories.map((catKey) => (
              <span
                key={catKey}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#E6F7FC',
                  border: '1px solid #B3E7F7',
                  color: '#007A9E',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <span>{getCategoryName(catKey)}</span>
                <button
                  type="button"
                  onClick={() => removeCategory(catKey)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: '#007A9E' }}
                  aria-label={`Remove ${getCategoryName(catKey)} category`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Price Range Chip */}
            {isPriceFiltered && (
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #D6D3D1',
                  color: '#44403C',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <span>
                  Price:{' '}
                  {filters.priceMin && filters.priceMax
                    ? `Rs. ${filters.priceMin} – ${filters.priceMax}`
                    : filters.priceMin
                    ? `Over Rs. ${filters.priceMin}`
                    : `Under Rs. ${filters.priceMax}`}
                </span>
                <button
                  type="button"
                  onClick={() => update({ priceMin: '', priceMax: '' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: '#44403C' }}
                  aria-label="Remove price filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Sort Chip (if not default) */}
            {isSortFiltered && (
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #E7E5E4',
                  color: '#57534E',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <span>
                  Sort:{' '}
                  {sortOptions.find((s) => s.value === filters.sortBy)?.label}
                </span>
                <button
                  type="button"
                  onClick={() => update({ sortBy: 'newest' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: '#57534E' }}
                  aria-label="Reset sort"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Clear All Button */}
            <button
              type="button"
              onClick={clearAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#E11D48',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. COLLAPSIBLE FILTER PANEL (Accordion Drawer) ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div 
              style={{
                marginTop: '12px',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid #E7E5E4',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Column 1: Categories (Takes 7 cols on desktop) */}
                <div className="md:col-span-7">
                  <div className="flex items-center justify-between mb-3">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Categories
                    </label>
                    {filters.categories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => update({ categories: [] })}
                        style={{ fontSize: '11px', color: '#00ACDF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Clear categories
                      </button>
                    )}
                  </div>

                  {availableCategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {availableCategories.map((cat) => {
                        const catKey = cat.slug || cat.id;
                        const isChecked = filters.categories.includes(catKey);
                        return (
                          <button
                            key={cat.id || cat.slug}
                            type="button"
                            onClick={() => toggleCategory(catKey)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 10px',
                              borderRadius: '12px',
                              textAlign: 'left',
                              fontSize: '12px',
                              cursor: 'pointer',
                              border: isChecked ? '1px solid #00ACDF' : '1px solid #E7E5E4',
                              backgroundColor: isChecked ? 'rgba(0, 172, 223, 0.08)' : '#FAFAF9',
                              color: isChecked ? '#007A9E' : '#1C1917',
                              fontWeight: isChecked ? 600 : 400,
                              transition: 'all 120ms ease',
                            }}
                          >
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: isChecked ? '1px solid #00ACDF' : '1px solid #D6D3D1',
                                backgroundColor: isChecked ? '#00ACDF' : '#FFFFFF',
                                color: '#FFFFFF',
                                flexShrink: 0,
                              }}
                            >
                              {isChecked && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span className="truncate">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: '#A8A29E' }}>Loading categories…</p>
                  )}
                </div>

                {/* Column 2: Price Range & Quick Presets (Takes 5 cols on desktop) */}
                <div className="md:col-span-5 md:border-l md:border-stone-200 md:pl-6">
                  <div className="flex items-center justify-between mb-3">
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Price Range (LKR)
                    </label>
                    {isPriceFiltered && (
                      <button
                        type="button"
                        onClick={() => update({ priceMin: '', priceMax: '' })}
                        style={{ fontSize: '11px', color: '#00ACDF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Reset price
                      </button>
                    )}
                  </div>

                  {/* Min / Max Inputs */}
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#A8A29E', fontWeight: 500 }}>
                        Rs.
                      </span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => update({ priceMin: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '32px',
                          paddingRight: '10px',
                          paddingTop: '6px',
                          paddingBottom: '6px',
                          fontSize: '12px',
                          backgroundColor: '#FAFAF9',
                          border: '1px solid #E7E5E4',
                          borderRadius: '10px',
                          outline: 'none',
                          color: '#1C1917',
                        }}
                        min={0}
                      />
                    </div>
                    <span style={{ color: '#D6D3D1', fontWeight: 500 }}>–</span>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#A8A29E', fontWeight: 500 }}>
                        Rs.
                      </span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => update({ priceMax: e.target.value })}
                        style={{
                          width: '100%',
                          paddingLeft: '32px',
                          paddingRight: '10px',
                          paddingTop: '6px',
                          paddingBottom: '6px',
                          fontSize: '12px',
                          backgroundColor: '#FAFAF9',
                          border: '1px solid #E7E5E4',
                          borderRadius: '10px',
                          outline: 'none',
                          color: '#1C1917',
                        }}
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {pricePresets.map((preset) => {
                      const isSelected =
                        filters.priceMin === preset.min &&
                        filters.priceMax === preset.max;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            update({
                              priceMin: isSelected ? '' : preset.min,
                              priceMax: isSelected ? '' : preset.max,
                            })
                          }
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: isSelected ? '1px solid #1A1A2E' : '1px solid #E7E5E4',
                            backgroundColor: isSelected ? '#1A1A2E' : '#FAFAF9',
                            color: isSelected ? '#FFFFFF' : '#44403C',
                            transition: 'all 120ms ease',
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Panel Footer: Reset All & Close/Apply */}
              <div 
                style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid #E7E5E4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={!hasActiveFilters}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: hasActiveFilters ? '#E11D48' : '#D6D3D1',
                    background: 'none',
                    border: 'none',
                    cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset All Filters</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    backgroundColor: '#00ACDF',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0, 172, 223, 0.25)',
                  }}
                >
                  <span>Apply & Close</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
