'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit3,
  Trash2,
  ShoppingBag,
  Search,
  RefreshCw,
  Package,
  Sparkles,
  ChevronDown,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { Category, Product, PetType } from '@/lib/types';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import AdminProductAccordionEditor from '@/components/admin/AdminProductAccordionEditor';

type SortOption =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc';

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
type PetFilter = 'all' | 'Dog' | 'Cat' | 'Cat/Dog';
type ViewMode = 'table' | 'grid';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPet, setSelectedPet] = useState<PetFilter>('all');
  const [selectedStock, setSelectedStock] = useState<StockFilter>('all');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Accordion Expand State: Stores the currently opened product ID for inline editor
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'error' } | null>(null);

  // Live state tracking for featured toggles
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('categories').select('*').order('display_order');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*), product_variants(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = data.map((p: any) => ({
          ...p,
          category: p.categories,
          variants: p.product_variants || [],
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error('Error loading products list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Helper: compute total stock for a product
  const getProductStock = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
  };

  // Helper: compute min price
  const getProductMinPrice = (product: Product): number => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => Number(v.price) || 0));
  };

  // KPI calculations
  const kpis = useMemo(() => {
    const total = products.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let featured = 0;

    products.forEach((p) => {
      const stock = getProductStock(p);
      if (stock === 0) {
        outOfStock++;
      } else if (stock <= 5) {
        lowStock++;
      } else {
        inStock++;
      }

      if (p.is_featured) featured++;
    });

    return { total, inStock, lowStock, outOfStock, featured };
  }, [products]);

  // Filtering & Sorting
  const filteredAndSortedProducts = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    const filtered = products.filter((p) => {
      // Search
      if (searchLower) {
        const nameMatch = p.name?.toLowerCase().includes(searchLower);
        const brandMatch = p.brand?.toLowerCase().includes(searchLower);
        const catMatch = p.category?.name?.toLowerCase().includes(searchLower);
        const formulaMatch = p.ingredients?.toLowerCase().includes(searchLower);
        const packagingMatch = p.packaging?.toLowerCase().includes(searchLower);
        if (!nameMatch && !brandMatch && !catMatch && !formulaMatch && !packagingMatch) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
        return false;
      }

      // Pet Type
      if (selectedPet !== 'all' && p.pet_type !== selectedPet) {
        return false;
      }

      // Featured
      if (onlyFeatured && !p.is_featured) {
        return false;
      }

      // Stock
      const stock = getProductStock(p);
      if (selectedStock === 'in_stock' && stock <= 5) return false;
      if (selectedStock === 'low_stock' && (stock === 0 || stock > 5)) return false;
      if (selectedStock === 'out_of_stock' && stock > 0) return false;

      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price_asc':
          return getProductMinPrice(a) - getProductMinPrice(b);
        case 'price_desc':
          return getProductMinPrice(b) - getProductMinPrice(a);
        case 'name_asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name_desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'stock_asc':
          return getProductStock(a) - getProductStock(b);
        case 'stock_desc':
          return getProductStock(b) - getProductStock(a);
        default:
          return 0;
      }
    });
  }, [products, search, selectedCategory, selectedPet, selectedStock, onlyFeatured, sortBy]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedPet, selectedStock, onlyFeatured, sortBy, pageSize]);

  // Pagination calculation
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedProducts.slice(start, start + pageSize);
  }, [filteredAndSortedProducts, currentPage, pageSize]);

  // Instant Feature Toggle
  const handleToggleFeatured = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingFeaturedId(product.id);
    const newStatus = !product.is_featured;

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase
        .from('products')
        .update({ is_featured: newStatus })
        .eq('id', product.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_featured: newStatus } : p))
      );
      showToast(newStatus ? `"${product.name}" marked as Featured.` : `"${product.name}" removed from Featured.`);
    } catch (err: any) {
      console.error('Error updating featured status:', err);
      showToast('Failed to update featured status.', 'error');
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  // Single Delete
  const handleOpenDelete = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
      if (error) throw error;

      if (expandedProductId === productToDelete.id) {
        setExpandedProductId(null);
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(`Product "${productToDelete.name}" was deleted successfully.`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please make sure no active orders reference it.');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Accordion Row
  const toggleAccordion = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  // Callback when a product is saved inline
  const handleProductSaved = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Updated "${updatedProduct.name}" successfully.`);
    setExpandedProductId(null);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedPet('all');
    setSelectedStock('all');
    setOnlyFeatured(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedPet !== 'all' ||
    selectedStock !== 'all' ||
    onlyFeatured ||
    sortBy !== 'newest';

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
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="admin-hero-title-row">
              <h1 className="admin-hero-title">Products Catalog</h1>
              <span className="admin-hero-badge">
                {products.length} Products
              </span>
            </div>
            <p className="admin-hero-subtitle">
              Manage inventory, pricing, clinical formulas, and display visibility across PetSolutions.lk.
            </p>
          </div>
        </div>

        <div className="admin-hero-actions">
          <button
            onClick={() => {
              fetchCategories();
              fetchProducts();
              showToast('Catalog refreshed.');
            }}
            disabled={loading}
            className="admin-action-btn"
            style={{ width: '38px', height: '38px', borderRadius: '12px' }}
            title="Refresh Catalog"
            aria-label="Refresh catalog"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <Link
            href="/"
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
            <span>Live Store</span>
            <ExternalLink size={13} />
          </Link>

          <Link
            href="/admin/products/new"
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
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive KPI Metric Cards (Instant Filter Buttons) */}
      <div className="admin-kpi-grid">
        {/* All Products */}
        <div
          onClick={() => {
            setSelectedStock('all');
            setOnlyFeatured(false);
          }}
          className={`admin-kpi-card ${selectedStock === 'all' && !onlyFeatured ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>All Catalog</span>
            <Package size={15} className="text-text-muted" />
          </div>
          <div className="admin-kpi-value">{kpis.total}</div>
          <div className="admin-kpi-footer">Total items listed</div>
        </div>

        {/* In Stock */}
        <div
          onClick={() => {
            setSelectedStock('in_stock');
            setOnlyFeatured(false);
          }}
          className={`admin-kpi-card ${selectedStock === 'in_stock' && !onlyFeatured ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>In Stock</span>
            <span className="status-dot status-dot-emerald" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#059669' }}>
            {kpis.inStock}
          </div>
          <div className="admin-kpi-footer">Available for purchase</div>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => {
            setSelectedStock('low_stock');
            setOnlyFeatured(false);
          }}
          className={`admin-kpi-card ${selectedStock === 'low_stock' && !onlyFeatured ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Low Stock</span>
            <span className="status-dot status-dot-amber" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#D97706' }}>
            {kpis.lowStock}
          </div>
          <div className="admin-kpi-footer">5 or fewer units left</div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => {
            setSelectedStock('out_of_stock');
            setOnlyFeatured(false);
          }}
          className={`admin-kpi-card ${selectedStock === 'out_of_stock' && !onlyFeatured ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Out of Stock</span>
            <span className="status-dot status-dot-rose" />
          </div>
          <div className="admin-kpi-value" style={{ color: '#E11D48' }}>
            {kpis.outOfStock}
          </div>
          <div className="admin-kpi-footer">Immediate restock needed</div>
        </div>

        {/* Featured */}
        <div
          onClick={() => {
            setOnlyFeatured(!onlyFeatured);
            setSelectedStock('all');
          }}
          className={`admin-kpi-card ${onlyFeatured ? 'active' : ''}`}
        >
          <div className="admin-kpi-header">
            <span>Featured Items</span>
            <Star size={15} className={onlyFeatured ? 'fill-amber-500 text-amber-500' : 'text-amber-500'} />
          </div>
          <div className="admin-kpi-value" style={{ color: '#B45309' }}>
            {kpis.featured}
          </div>
          <div className="admin-kpi-footer">Homepage highlights</div>
        </div>
      </div>

      {/* 3. Search, Filter Toolbar & View Switcher */}
      <div className="admin-toolbar-wrap">
        <div className="admin-toolbar-main">
          {/* Search Box */}
          <div className="admin-search-box">
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                color: 'var(--color-text-muted)',
              }}
            >
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search products, brand, formulation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="admin-filter-group">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Pet Target Select (NO EMOJIS) */}
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value as PetFilter)}
              className="admin-select"
            >
              <option value="all">All Pets</option>
              <option value="Dog">Dogs Only</option>
              <option value="Cat">Cats Only</option>
              <option value="Cat/Dog">Cat & Dog (Both)</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="admin-select"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="stock_desc">Stock: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
            </select>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="admin-select"
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>

            {/* View Mode Toggle (Table vs Grid) */}
            <div className="admin-view-toggle">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`admin-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                title="Table View"
                aria-label="Table View"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`admin-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Strip */}
        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid rgba(189, 223, 234, 0.4)',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            <div>
              Showing <strong style={{ color: 'var(--color-text)' }}>{totalItems}</strong> matching products
            </div>
            <button
              onClick={handleResetFilters}
              style={{
                color: 'var(--color-brand-blue)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <X size={13} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Main Inventory Catalog (Data Table or Grid View) */}
      {loading ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(189, 223, 234, 0.55)',
            padding: '64px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-accent border-t-transparent mx-auto" />
          <p style={{ marginTop: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Loading inventory catalog...
          </p>
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(189, 223, 234, 0.55)',
            padding: '64px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Package size={44} style={{ margin: '0 auto 12px auto', color: 'var(--color-text-light)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
            No products match your filters
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 16px auto' }}>
            Try broadening your search criteria or resetting filters to display all catalog items.
          </p>
          <button
            onClick={handleResetFilters}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '12px', fontSize: '12px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="admin-table-container">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '56px', textAlign: 'center' }}>#</th>
                  <th style={{ minWidth: '280px' }}>Product</th>
                  <th style={{ minWidth: '160px' }}>Category & Target</th>
                  <th style={{ minWidth: '140px' }}>Stock Status</th>
                  <th style={{ minWidth: '130px' }}>Price & Sizes</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>Featured</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, index) => {
                  const isExpanded = expandedProductId === product.id;
                  const productVariants = product.variants || [];
                  const hasMultiple = productVariants.length > 1;
                  const totalStock = getProductStock(product);
                  const minPrice = getProductMinPrice(product);
                  const productIndex = String((currentPage - 1) * pageSize + index + 1).padStart(2, '0');

                  const priceLabel = hasMultiple
                    ? `From Rs. ${minPrice.toLocaleString()}`
                    : productVariants[0]
                    ? formatPrice(productVariants[0].price)
                    : 'N/A';

                  return (
                    <React.Fragment key={product.id}>
                      <tr
                        className={isExpanded ? 'row-expanded' : ''}
                        onClick={() => toggleAccordion(product.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Index */}
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                          #{productIndex}
                        </td>

                        {/* Product Details */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="admin-product-thumb">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  sizes="46px"
                                />
                              ) : (
                                <Package size={20} style={{ color: 'var(--color-text-light)' }} />
                              )}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    color: isExpanded ? 'var(--color-brand-blue)' : 'var(--color-text)',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '320px',
                                  }}
                                  title={product.name}
                                >
                                  {product.name}
                                </span>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {product.brand && (
                                  <span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    {product.brand}
                                  </span>
                                )}
                                {product.brand && product.packaging && <span>•</span>}
                                {product.packaging && (
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                    {product.packaging}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Target Pet (NO EMOJIS) */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '12px' }}>
                              {product.category?.name || 'Uncategorized'}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                width: 'fit-content',
                                backgroundColor:
                                  product.pet_type === 'Dog'
                                    ? '#FEF3C7'
                                    : product.pet_type === 'Cat'
                                    ? '#EEF2FF'
                                    : '#ECFDF5',
                                color:
                                  product.pet_type === 'Dog'
                                    ? '#92400E'
                                    : product.pet_type === 'Cat'
                                    ? '#3730A3'
                                    : '#065F46',
                              }}
                            >
                              {product.pet_type === 'Dog'
                                ? 'Dogs'
                                : product.pet_type === 'Cat'
                                ? 'Cats'
                                : 'Cat & Dog'}
                            </span>
                          </div>
                        </td>

                        {/* Stock Status */}
                        <td>
                          {totalStock > 5 ? (
                            <span className="admin-stock-badge admin-stock-in">
                              <span className="status-dot status-dot-emerald" />
                              <span>{totalStock} in stock</span>
                            </span>
                          ) : totalStock > 0 ? (
                            <span className="admin-stock-badge admin-stock-low">
                              <span className="status-dot status-dot-amber" />
                              <span>{totalStock} low stock</span>
                            </span>
                          ) : (
                            <span className="admin-stock-badge admin-stock-out">
                              <span className="status-dot status-dot-rose" />
                              <span>Out of stock</span>
                            </span>
                          )}
                        </td>

                        {/* Price & Variants */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '13px', color: 'var(--color-text)' }}>
                              {priceLabel}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {productVariants.length} {productVariants.length === 1 ? 'size' : 'sizes'}
                            </span>
                          </div>
                        </td>

                        {/* Featured Star */}
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleToggleFeatured(product, e)}
                            disabled={togglingFeaturedId === product.id}
                            className={`admin-action-btn admin-action-btn-star ${product.is_featured ? 'featured' : ''}`}
                            title={product.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                            aria-label={product.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                          >
                            <Star size={15} className={product.is_featured ? 'fill-amber-500' : ''} />
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {/* Live View */}
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="admin-action-btn"
                              title="View in Customer Store"
                              aria-label="View in Customer Store"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            {/* Accordion Toggle / Edit */}
                            <button
                              type="button"
                              onClick={() => toggleAccordion(product.id)}
                              className="admin-action-btn"
                              style={{
                                backgroundColor: isExpanded ? 'var(--color-brand-blue)' : undefined,
                                color: isExpanded ? '#FFFFFF' : undefined,
                              }}
                              title={isExpanded ? 'Collapse Editor' : 'Edit Product'}
                              aria-label={isExpanded ? 'Collapse Editor' : 'Edit Product'}
                            >
                              <ChevronDown
                                size={15}
                                style={{
                                  transition: 'transform 200ms ease',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                              />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenDelete(product, e)}
                              className="admin-action-btn admin-action-btn-danger"
                              title="Delete Product"
                              aria-label="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline Accordion Row Editor */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0, backgroundColor: 'rgba(254, 252, 243, 0.5)' }}>
                            <div style={{ padding: '20px 24px', borderTop: '1.5px solid var(--color-brand-blue)' }}>
                              <AdminProductAccordionEditor
                                product={product}
                                categories={categories}
                                onSaved={handleProductSaved}
                                onClose={() => setExpandedProductId(null)}
                                onDeleteRequest={(p) => handleOpenDelete(p)}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="admin-grid-layout">
          {paginatedProducts.map((product) => {
            const productVariants = product.variants || [];
            const hasMultiple = productVariants.length > 1;
            const totalStock = getProductStock(product);
            const minPrice = getProductMinPrice(product);
            const isExpanded = expandedProductId === product.id;

            const priceLabel = hasMultiple
              ? `From Rs. ${minPrice.toLocaleString()}`
              : productVariants[0]
              ? formatPrice(productVariants[0].price)
              : 'N/A';

            return (
              <div key={product.id} className="admin-product-card">
                {/* Thumbnail Header with Badges */}
                <div style={{ position: 'relative', width: '100%', height: '180px', background: 'var(--color-dominant)' }}>
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
                      <Package size={36} />
                    </div>
                  )}

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        color: 'var(--color-text)',
                      }}
                    >
                      {product.pet_type === 'Dog'
                        ? 'Dogs'
                        : product.pet_type === 'Cat'
                        ? 'Cats'
                        : 'Cat & Dog'}
                    </span>
                  </div>

                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(product, e)}
                      className={`admin-action-btn admin-action-btn-star ${product.is_featured ? 'featured' : ''}`}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                      title={product.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                    >
                      <Star size={15} className={product.is_featured ? 'fill-amber-500' : ''} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {product.brand || product.category?.name || 'Veterinary'}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: 'var(--color-text)',
                      marginTop: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '14px', color: 'var(--color-text)' }}>
                        {priceLabel}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {productVariants.length} {productVariants.length === 1 ? 'size' : 'sizes'}
                      </div>
                    </div>

                    <div>
                      {totalStock > 5 ? (
                        <span className="admin-stock-badge admin-stock-in" style={{ padding: '3px 8px', fontSize: '10px' }}>
                          <span className="status-dot status-dot-emerald" />
                          <span>{totalStock} in stock</span>
                        </span>
                      ) : totalStock > 0 ? (
                        <span className="admin-stock-badge admin-stock-low" style={{ padding: '3px 8px', fontSize: '10px' }}>
                          <span className="status-dot status-dot-amber" />
                          <span>{totalStock} left</span>
                        </span>
                      ) : (
                        <span className="admin-stock-badge admin-stock-out" style={{ padding: '3px 8px', fontSize: '10px' }}>
                          <span className="status-dot status-dot-rose" />
                          <span>Out of stock</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(189, 223, 234, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(product.id)}
                      className="btn btn-outline btn-sm"
                      style={{ borderRadius: '10px', fontSize: '11px', height: '32px', padding: '0 12px' }}
                    >
                      <Edit3 size={13} />
                      <span>{isExpanded ? 'Close' : 'Quick Edit'}</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="admin-action-btn"
                        title="View Live Store"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleOpenDelete(product, e)}
                        className="admin-action-btn admin-action-btn-danger"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Inline editor in Grid view if expanded */}
                  {isExpanded && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid var(--color-brand-blue)' }}>
                      <AdminProductAccordionEditor
                        product={product}
                        categories={categories}
                        onSaved={handleProductSaved}
                        onClose={() => setExpandedProductId(null)}
                        onDeleteRequest={(p) => handleOpenDelete(p)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Pagination Controls */}
      {totalPages > 1 && (
        <div className="admin-pagination-bar">
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong style={{ color: 'var(--color-text)' }}>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong style={{ color: 'var(--color-text)' }}>{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
            <strong style={{ color: 'var(--color-text)' }}>{totalItems}</strong> products
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="admin-action-btn"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: '1px solid var(--color-secondary-alt)',
                opacity: currentPage === 1 ? 0.3 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span style={{ padding: '0 4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        backgroundColor: currentPage === page ? 'var(--color-brand-blue)' : 'transparent',
                        color: currentPage === page ? '#FFFFFF' : 'var(--color-text-muted)',
                        border: currentPage === page ? '1px solid var(--color-brand-blue)' : '1px solid transparent',
                      }}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="admin-action-btn"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: '1px solid var(--color-secondary-alt)',
                opacity: currentPage === totalPages ? 0.3 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        itemName={productToDelete ? productToDelete.name : ''}
        loading={deleting}
      />
    </div>
  );
}
