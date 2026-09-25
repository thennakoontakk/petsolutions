'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListCollapse,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  X,
  XCircle,
  Check,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Shield,
  Pill,
  Sparkles,
  Activity,
  Bone,
  Box,
  Tag,
  LayoutGrid,
  List,
  Copy,
  Package,
  Layers,
  ArrowUpDown,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils/slugify';
import type { Category, PetType } from '@/lib/types';

// Map specific slugs to curated category icons
const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'parasite-tick-control': Shield,
  'health-supplements': Pill,
  'wound-care-topical-pharmacy': Activity,
  'medicated-shampoos-grooming': Sparkles,
  'dry-wet-pet-food': Bone,
  'cat-litter-hygiene': Box,
};

type SortOption = 'order_asc' | 'order_desc' | 'name_asc' | 'name_desc' | 'products_desc' | 'products_asc';
type PetFilter = 'all' | 'Cat/Dog' | 'Dog' | 'Cat';
type ViewMode = 'table' | 'grid';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState('');
  const [selectedPet, setSelectedPet] = useState<PetFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('order_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form input states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formParent, setFormParent] = useState<PetType>('Cat/Dog');
  const [formOrder, setFormOrder] = useState<string>('0');
  const [formDescription, setFormDescription] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Guard Modal
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch categories & product associations
  const fetchData = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('products').select('id, category_id, is_active'),
      ]);

      if (catRes.error) throw catRes.error;
      const cats = catRes.data || [];
      const prods = prodRes.data || [];

      // Count products per category
      const counts: Record<string, number> = {};
      prods.forEach((p: any) => {
        if (p.category_id) {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1;
        }
      });

      setProductCounts(counts);
      setCategories(cats);
    } catch (err: any) {
      console.error('Error fetching categories & products:', err);
      showToast('Failed to load category data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute KPI metrics
  const kpis = useMemo(() => {
    const total = categories.length;
    const totalProducts = Object.values(productCounts).reduce((acc, curr) => acc + curr, 0);
    const shared = categories.filter((c) => c.parent_category === 'Cat/Dog').length;
    const dog = categories.filter((c) => c.parent_category === 'Dog').length;
    const cat = categories.filter((c) => c.parent_category === 'Cat').length;

    return { total, totalProducts, shared, dog, cat };
  }, [categories, productCounts]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormParent('Cat/Dog');
    // Default to next highest display order
    const nextOrder = categories.length > 0 
      ? Math.max(...categories.map((c) => c.display_order || 0)) + 1 
      : 1;
    setFormOrder(nextOrder.toString());
    setFormDescription('');
    setAutoSlug(true);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormParent(category.parent_category || 'Cat/Dog');
    setFormOrder((category.display_order ?? 0).toString());
    setFormDescription(category.description || '');
    setAutoSlug(false);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  // Auto-generate slug when typing name
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (autoSlug) {
      setFormSlug(slugify(val));
    }
  };

  // Save Category (Create or Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category Name is required.');
      return;
    }

    const finalSlug = formSlug.trim() || slugify(formName);
    if (!finalSlug) {
      setFormError('A valid URL slug is required.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const supabase = createBrowserClient();
      const payload = {
        name: formName.trim(),
        slug: finalSlug,
        parent_category: formParent,
        display_order: parseInt(formOrder, 10) || 0,
        description: formDescription.trim() || null,
      };

      if (editingCategory) {
        // UPDATE
        const { data, error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id)
          .select()
          .single();

        if (error) throw error;

        setCategories((prev) =>
          prev
            .map((c) => (c.id === editingCategory.id ? (data as Category) : c))
            .sort((a, b) => a.display_order - b.display_order)
        );
        showToast(`Updated "${formName}" successfully.`);
      } else {
        // CREATE
        const { data, error } = await supabase
          .from('categories')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        setCategories((prev) =>
          [...prev, data as Category].sort((a, b) => a.display_order - b.display_order)
        );
        showToast(`Created category "${formName}".`);
      }

      setIsFormModalOpen(false);
    } catch (err: any) {
      console.error('Error saving category:', err);
      setFormError(err.message || 'Error saving category. Ensure the slug is unique.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Category confirmation
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);
      if (error) throw error;

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      showToast(`Category "${categoryToDelete.name}" deleted.`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      console.error('Error deleting category:', err);
      showToast('Could not delete category. Ensure no products are linked.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Copy slug to clipboard
  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    showToast(`Copied slug "${slug}" to clipboard.`);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Filter & Sort Logic
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Search query
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.slug.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query))
      );
    }

    // Pet audience filter
    if (selectedPet !== 'all') {
      result = result.filter((c) => c.parent_category === selectedPet);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'order_asc') return (a.display_order ?? 0) - (b.display_order ?? 0);
      if (sortBy === 'order_desc') return (b.display_order ?? 0) - (a.display_order ?? 0);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'products_desc') return (productCounts[b.id] || 0) - (productCounts[a.id] || 0);
      if (sortBy === 'products_asc') return (productCounts[a.id] || 0) - (productCounts[b.id] || 0);
      return 0;
    });

    return result;
  }, [categories, search, selectedPet, sortBy, productCounts]);

  const hasActiveFilters = search.trim() !== '' || selectedPet !== 'all' || sortBy !== 'order_asc';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedPet('all');
    setSortBy('order_asc');
  };

  return (
    <div className="admin-catalog-wrap">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 font-bold text-xs ${
              toastMessage.type === 'error'
                ? 'bg-error text-white border-red-400 shadow-error/25'
                : 'bg-accent text-white border-white/20 shadow-accent/25'
            }`}
          >
            {toastMessage.type === 'error' ? <XCircle size={17} /> : <Sparkles size={17} />}
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Executive Top Header Banner */}
      <div className="admin-hero-banner">
        <div className="admin-hero-content">
          <div className="admin-hero-icon">
            <ListCollapse size={24} />
          </div>
          <div>
            <div className="admin-hero-title-row">
              <h1 className="admin-hero-title">Category Architecture</h1>
              <span className="admin-hero-badge">
                {categories.length} Categories
              </span>
            </div>
            <p className="admin-hero-subtitle">
              Structure catalog navigation, control customer storefront dropdowns, and organize pet care inventory.
            </p>
          </div>
        </div>

        <div className="admin-hero-actions">
          <button
            onClick={() => {
              fetchData();
              showToast('Categories synchronized.');
            }}
            disabled={loading}
            className="admin-action-btn"
            style={{ width: '38px', height: '38px', borderRadius: '12px' }}
            title="Refresh Categories"
            aria-label="Refresh categories"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            href="/products"
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{
              height: '38px',
              padding: '0 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              gap: '6px',
            }}
          >
            <span>Live Store Catalog</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleOpenCreate}
            className="btn btn-primary btn-sm"
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: '#1A1A2E',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 200, 0, 0.4)',
              boxShadow: '0 2px 8px rgba(26, 26, 46, 0.15)',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive KPI Metric Cards (Instant Filter Action) */}
      <div className="admin-kpi-grid">
        {/* Total Categories */}
        <div
          onClick={() => {
            setSelectedPet('all');
            setSearch('');
          }}
          className={`admin-kpi-card ${selectedPet === 'all' && !search ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>All Categories</span>
            <Layers size={15} className="text-text-muted" />
          </div>
          <div className="admin-kpi-value">{kpis.total}</div>
          <div className="admin-kpi-footer">Active storefront sections</div>
        </div>

        {/* Assigned Products */}
        <div
          onClick={() => {
            setSortBy('products_desc');
            showToast('Sorted by products count.');
          }}
          className="admin-kpi-card"
        >
          <div className="admin-kpi-header">
            <span>Catalog Items</span>
            <Package size={15} className="text-text-muted" />
          </div>
          <div className="admin-kpi-value text-accent">{kpis.totalProducts}</div>
          <div className="admin-kpi-footer">Products categorized</div>
        </div>

        {/* Shared (Dog & Cat) */}
        <div
          onClick={() => {
            setSelectedPet(selectedPet === 'Cat/Dog' ? 'all' : 'Cat/Dog');
          }}
          className={`admin-kpi-card ${selectedPet === 'Cat/Dog' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>🐾 Shared Care</span>
            <span className="status-dot status-dot-emerald"></span>
          </div>
          <div className="admin-kpi-value">{kpis.shared}</div>
          <div className="admin-kpi-footer">Dog & Cat dual departments</div>
        </div>

        {/* Dog Specialties */}
        <div
          onClick={() => {
            setSelectedPet(selectedPet === 'Dog' ? 'all' : 'Dog');
          }}
          className={`admin-kpi-card ${selectedPet === 'Dog' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>🐶 Dog Only</span>
            <span className="status-dot status-dot-amber"></span>
          </div>
          <div className="admin-kpi-value">{kpis.dog}</div>
          <div className="admin-kpi-footer">Canine focused categories</div>
        </div>

        {/* Cat Specialties */}
        <div
          onClick={() => {
            setSelectedPet(selectedPet === 'Cat' ? 'all' : 'Cat');
          }}
          className={`admin-kpi-card ${selectedPet === 'Cat' ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>🐱 Cat Only</span>
            <span className="status-dot status-dot-rose"></span>
          </div>
          <div className="admin-kpi-value">{kpis.cat}</div>
          <div className="admin-kpi-footer">Feline focused categories</div>
        </div>
      </div>

      {/* 3. High-Density Toolbar & Quick Filter Suite */}
      <div className="admin-toolbar-wrap">
        <div className="admin-toolbar-main">
          {/* Search Box */}
          <div className="admin-search-box">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search category name, description, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Toggle */}
          <div className="admin-filter-group">
            {/* Pet Section Filter */}
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value as PetFilter)}
              className="admin-select"
              aria-label="Filter by target pet"
            >
              <option value="all">🐾 All Pet Targets</option>
              <option value="Cat/Dog">🐾 Shared (Dog & Cat)</option>
              <option value="Dog">🐶 Dog Only</option>
              <option value="Cat">🐱 Cat Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="admin-select"
              aria-label="Sort categories"
            >
              <option value="order_asc">Display Order (1 → 10)</option>
              <option value="order_desc">Display Order (10 → 1)</option>
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="products_desc">Most Products</option>
              <option value="products_asc">Fewest Products</option>
            </select>

            {/* View Mode Toggle */}
            <div className="admin-view-toggle">
              <button
                onClick={() => setViewMode('table')}
                className={`admin-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                title="Detailed Table View"
                aria-label="Table view"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`admin-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Visual Cards View"
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-secondary/40 text-xs flex-wrap">
            <span className="text-text-muted font-medium">Active filters:</span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/30 text-text font-semibold border border-secondary-alt">
                Search: &quot;{search}&quot;
                <button onClick={() => setSearch('')} className="hover:text-error">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedPet !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/30 text-text font-semibold border border-secondary-alt">
                Target: {selectedPet === 'Cat/Dog' ? 'Shared (Dog & Cat)' : selectedPet}
                <button onClick={() => setSelectedPet('all')} className="hover:text-error">
                  <X size={12} />
                </button>
              </span>
            )}
            {sortBy !== 'order_asc' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/30 text-text font-semibold border border-secondary-alt">
                Sorted
                <button onClick={() => setSortBy('order_asc')} className="hover:text-error">
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-accent hover:underline font-bold text-xs ml-auto"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Main Category Representation (Table or Grid) */}
      {loading ? (
        <div
          className="admin-table-container p-12 text-center space-y-4"
          style={{
            minHeight: '460px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-accent border-t-transparent"></div>
          <p className="text-xs text-text-muted font-medium">Synchronizing live category architecture...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="admin-table-container p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mx-auto text-text-muted border border-secondary-alt">
            <Layers size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-base text-text">No categories found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              {hasActiveFilters
                ? 'No categories match the active filter criteria. Try clearing your filters.'
                : 'No categories have been created yet. Click "+ Add Category" above to create your first department.'}
            </p>
          </div>
          {hasActiveFilters && (
            <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
              Clear All Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="admin-table-container">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '64px', textAlign: 'center' }}>Order</th>
                  <th style={{ minWidth: '220px' }}>Category Name & Info</th>
                  <th style={{ width: '160px' }}>Target Audience</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Products</th>
                  <th style={{ width: '180px' }}>Slug / Route</th>
                  <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => {
                  const IconComp = CATEGORY_ICON_MAP[cat.slug] || Layers;
                  const count = productCounts[cat.id] || 0;

                  return (
                    <tr key={cat.id}>
                      {/* Display Order */}
                      <td style={{ textAlign: 'center' }}>
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200">
                          {cat.display_order ?? 0}
                        </span>
                      </td>

                      {/* Category Name & Details */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
                            <IconComp size={17} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-heading font-bold text-xs text-text truncate">
                                {cat.name}
                              </p>
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                                <CheckCircle2 size={9} /> Live
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                              {cat.description || 'No description provided.'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Target Audience */}
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${
                            cat.parent_category === 'Dog'
                              ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                              : cat.parent_category === 'Cat'
                              ? 'bg-purple-50 text-purple-800 border-purple-200/80'
                              : 'bg-teal-50 text-teal-800 border-teal-200/80'
                          }`}
                        >
                          {cat.parent_category === 'Dog' ? (
                            <>
                              <span className="status-dot status-dot-amber" style={{ width: '6px', height: '6px' }}></span>
                              🐶 Dog Only
                            </>
                          ) : cat.parent_category === 'Cat' ? (
                            <>
                              <span className="status-dot status-dot-rose" style={{ width: '6px', height: '6px' }}></span>
                              🐱 Cat Only
                            </>
                          ) : (
                            <>
                              <span className="status-dot status-dot-emerald" style={{ width: '6px', height: '6px' }}></span>
                              🐾 Shared (Dog & Cat)
                            </>
                          )}
                        </span>
                      </td>

                      {/* Linked Products Count */}
                      <td style={{ textAlign: 'center' }}>
                        <Link
                          href={`/products?category=${cat.slug}`}
                          target="_blank"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all hover:scale-105 ${
                            count > 0
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                          title={`View ${count} products in catalog`}
                        >
                          <Package size={11} />
                          <span>{count} Items</span>
                        </Link>
                      </td>

                      {/* URL Slug */}
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 select-all truncate max-w-[130px]">
                            {cat.slug}
                          </span>
                          <button
                            onClick={() => handleCopySlug(cat.slug)}
                            className="p-1 text-text-muted hover:text-text hover:bg-slate-100 rounded transition-colors"
                            title="Copy slug"
                          >
                            {copiedSlug === cat.slug ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200"
                            title="Edit Category"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setCategoryToDelete(cat);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="admin-grid-layout">
          {filteredCategories.map((cat) => {
            const IconComp = CATEGORY_ICON_MAP[cat.slug] || Layers;
            const count = productCounts[cat.id] || 0;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-secondary-alt/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-text">
                          {cat.name}
                        </h4>
                        <span className="font-mono text-[10px] text-text-muted">
                          Order #{cat.display_order ?? 0}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cat.parent_category === 'Dog'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : cat.parent_category === 'Cat'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      {cat.parent_category === 'Dog' ? '🐶 Dog' : cat.parent_category === 'Cat' ? '🐱 Cat' : '🐾 Shared'}
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {cat.description || 'No descriptive summary added yet.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-secondary/30 text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      <span>/{cat.slug}</span>
                      <button onClick={() => handleCopySlug(cat.slug)} className="hover:text-text">
                        <Copy size={11} />
                      </button>
                    </div>

                    <Link
                      href={`/products?category=${cat.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                    >
                      <Package size={13} />
                      <span>{count} Products</span>
                    </Link>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-secondary/40">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700">
                    <CheckCircle2 size={12} /> Nav Dropdown Active
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-text-muted hover:text-error hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          5. ADD / EDIT CATEGORY MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setIsFormModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 flex flex-col max-h-[88vh] text-slate-900 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSaveCategory} className="flex flex-col h-full max-h-[88vh]">
                {/* Header */}
                <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                      {editingCategory ? <Edit3 size={18} /> : <Plus size={18} />}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        {editingCategory ? 'Edit Category' : 'Create New Category'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {editingCategory
                          ? `Updating settings for "${editingCategory.name}"`
                          : 'Add an authorized department to the PetSolutions.lk storefront'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    disabled={saving}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                  {/* Error Message */}
                  {formError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                      <AlertTriangle size={15} className="flex-shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Category Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parasite & Tick Control"
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-blue focus:ring-3 focus:ring-brand-blue/15 outline-none transition-all text-slate-900"
                    />
                  </div>

                  {/* Slug with Auto-generate switch */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoSlug(!autoSlug);
                          if (!autoSlug && formName) {
                            setFormSlug(slugify(formName));
                          }
                        }}
                        className="text-[11px] font-semibold text-brand-blue hover:underline"
                      >
                        {autoSlug ? '🔒 Auto-syncing from Name' : '✏️ Custom Slug'}
                      </button>
                    </div>
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-brand-blue focus-within:ring-3 focus-within:ring-brand-blue/15 transition-all overflow-hidden">
                      <span className="inline-flex items-center px-3 bg-slate-100 text-slate-500 font-mono text-[11px] border-r border-slate-200 select-none">
                        /category/
                      </span>
                      <input
                        type="text"
                        required
                        value={formSlug}
                        onChange={(e) => {
                          setAutoSlug(false);
                          setFormSlug(e.target.value);
                        }}
                        placeholder="parasite-tick-control"
                        className="flex-1 h-10 px-3 text-xs font-mono bg-transparent outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Parent Section & Display Order (2 Cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Parent Target Section
                      </label>
                      <select
                        value={formParent}
                        onChange={(e) => setFormParent(e.target.value as PetType)}
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-blue focus:ring-3 focus:ring-brand-blue/15 outline-none transition-all font-semibold text-slate-900"
                      >
                        <option value="Cat/Dog">🐾 Shared (Cat & Dog)</option>
                        <option value="Dog">🐶 Dog Only</option>
                        <option value="Cat">🐱 Cat Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Display Order (Position)
                      </label>
                      <input
                        type="number"
                        value={formOrder}
                        onChange={(e) => setFormOrder(e.target.value)}
                        className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-blue focus:ring-3 focus:ring-brand-blue/15 outline-none transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Storefront Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short description displayed under dropdown menus and category headers..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-blue focus:ring-3 focus:ring-brand-blue/15 outline-none transition-all resize-none text-slate-900"
                    />
                  </div>

                  {/* Real-Time Live Preview */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Live Storefront Dropdown Preview
                    </span>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                        {React.createElement(CATEGORY_ICON_MAP[formSlug] || Layers, { size: 17 })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-bold text-xs text-slate-900 truncate">
                          {formName || 'Category Name Preview'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {formDescription || 'Short description of category items...'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        #{formOrder || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer Actions */}
                <div className="flex items-center justify-end gap-3 p-4 sm:px-6 border-t border-slate-100 bg-slate-50/70 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    disabled={saving}
                    className="btn btn-ghost btn-sm text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl"
                    style={{ height: '38px', padding: '0 16px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    style={{
                      height: '38px',
                      padding: '0 18px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: '#1A1A2E',
                      color: '#FFFFFF',
                      border: '1.5px solid rgba(255, 200, 0, 0.4)',
                      boxShadow: '0 2px 8px rgba(26, 26, 46, 0.15)',
                    }}
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    ) : (
                      <>
                        <Check size={15} />
                        <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          6. SMART DELETE CONFIRMATION MODAL (WITH PRODUCT DEPENDENCY GUARD)
          ========================================================================= */}
      <AnimatePresence>
        {isDeleteModalOpen && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 p-6 space-y-5 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex-shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1 pr-6">
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Delete Category
                  </h3>
                  <p className="text-xs text-red-600 font-medium">
                    Permanent catalog change
                  </p>
                </div>
              </div>

              {/* Selected Category Info */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  Target Category
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {categoryToDelete.name}
                </span>
                <div className="text-[11px] text-slate-500 font-mono">
                  Slug: {categoryToDelete.slug}
                </div>
              </div>

              {/* Product Dependency Check */}
              {(productCounts[categoryToDelete.id] || 0) > 0 ? (
                <div className="p-3.5 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle size={15} />
                    <span>Dependency Warning: {productCounts[categoryToDelete.id]} Products Assigned</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    This category currently contains {productCounts[categoryToDelete.id]} active catalog products. You must reassign or remove these products first before this category can be safely deleted.
                  </p>
                  <Link
                    href={`/products?category=${categoryToDelete.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline"
                  >
                    View affected products in store <ExternalLink size={12} />
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to delete this category? There are currently 0 products assigned to it, so it can be safely removed.
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  style={{ height: '38px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting || (productCounts[categoryToDelete.id] || 0) > 0}
                  className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  style={{
                    backgroundColor: (productCounts[categoryToDelete.id] || 0) > 0 ? '#E2E8F0' : '#DC2626',
                    color: (productCounts[categoryToDelete.id] || 0) > 0 ? '#94A3B8' : '#FFFFFF',
                    height: '38px',
                    cursor: (productCounts[categoryToDelete.id] || 0) > 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {deleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  ) : (
                    <>
                      <Trash2 size={15} /> Delete Category
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
