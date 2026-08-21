'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Search,
  RefreshCw,
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { createBrowserClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils/formatPrice';
import type { Category, Product } from '@/lib/types';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import AdminProductAccordionEditor from '@/components/admin/AdminProductAccordionEditor';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Accordion Expand State: Stores the currently opened product ID (single open mode)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
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

  // Delete Modal Handlers
  const handleOpenDelete = (product: Product) => {
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

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
      (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-accent text-white font-semibold text-xs rounded-2xl shadow-xl shadow-accent/20 border border-white/20 animate-fade-in flex items-center gap-2">
          <Sparkles size={16} />
          {toastMessage}
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
            <ShoppingCart className="text-accent" /> Products Catalog ({products.length})
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Click any product to expand the interactive live editor, veterinary clinical specs, and pricing.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchCategories();
              fetchProducts();
            }}
            className="btn btn-outline btn-sm p-2.5 rounded-xl text-text-muted hover:text-text"
            title="Refresh Catalog"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            href="/admin/products/new"
            className="btn btn-primary btn-sm flex items-center gap-1.5 text-xs font-bold py-2.5 px-4 shadow-lg shadow-accent/20"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 text-text-muted"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by product name, brand, or formula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-10 text-xs py-2"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input text-xs py-2 max-w-[220px]"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass p-5 md:p-6 rounded-3xl border border-white/40 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-text-muted space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto"></div>
            <p>Loading inventory catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted space-y-2">
            <Package size={32} className="mx-auto text-text-muted/40" />
            <p className="font-semibold text-text">No products match your search or filter.</p>
            <p className="text-[11px]">Try searching with a different keyword or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-secondary/50 text-text-muted font-bold">
                  <th className="py-3.5 px-3 w-10"></th>
                  <th className="py-3.5 px-3">Product</th>
                  <th className="py-3.5 px-3">Brand</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Pet</th>
                  <th className="py-3.5 px-3">Variants & Price</th>
                  <th className="py-3.5 px-3">Featured</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20">
                {filtered.map((product) => {
                  const isExpanded = expandedProductId === product.id;
                  const productVariants = product.variants || [];
                  const hasMultiple = productVariants.length > 1;
                  const priceLabel = hasMultiple
                    ? `From Rs. ${Math.min(
                        ...productVariants.map((v) => Number(v.price)),
                        0
                      ).toLocaleString()}`
                    : productVariants[0]
                    ? formatPrice(productVariants[0].price)
                    : 'N/A';

                  return (
                    <React.Fragment key={product.id}>
                      <tr
                        onClick={() => toggleAccordion(product.id)}
                        className={`transition-colors cursor-pointer select-none group ${
                          isExpanded
                            ? 'bg-accent/10 hover:bg-accent/15 border-l-4 border-accent'
                            : 'hover:bg-secondary/20'
                        }`}
                      >
                        {/* Expand / Collapse Indicator Chevron */}
                        <td className="py-3 px-3 text-center">
                          <div
                            className={`p-1 rounded-lg transition-transform duration-200 inline-flex items-center justify-center ${
                              isExpanded
                                ? 'bg-accent text-white rotate-180 shadow-sm'
                                : 'text-text-muted group-hover:text-accent'
                            }`}
                          >
                            <ChevronDown size={15} />
                          </div>
                        </td>

                        {/* Product Thumbnail + Name */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-secondary/40 border border-secondary-alt/20 flex-shrink-0 flex items-center justify-center">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <Package size={18} className="text-text-muted/50" />
                              )}
                            </div>
                            <div className="max-w-[220px] md:max-w-xs">
                              <span
                                className={`font-bold block truncate transition-colors ${
                                  isExpanded ? 'text-accent' : 'text-text group-hover:text-accent'
                                }`}
                                title={product.name}
                              >
                                {product.name}
                              </span>
                              {product.packaging && (
                                <span className="text-[10px] text-text-muted block truncate">
                                  {product.packaging}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-text-muted font-medium">
                          {product.brand || '—'}
                        </td>

                        <td className="py-3 px-3 text-text font-medium">
                          {product.category?.name || 'Uncategorized'}
                        </td>

                        <td className="py-3 px-3">
                          <span className="badge badge-accent text-[10px] font-bold py-0.5 px-2">
                            {product.pet_type}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-text block">{priceLabel}</span>
                            <span className="text-[10px] text-text-muted block max-w-[150px] truncate">
                              {productVariants.map((v) => v.size_label).join(', ') || 'No sizes'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`badge ${
                              product.is_featured ? 'badge-accent' : 'badge-default'
                            } text-[9px] uppercase tracking-wider font-bold`}
                          >
                            {product.is_featured ? 'Yes' : 'No'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div
                            className="flex gap-1.5 justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => toggleAccordion(product.id)}
                              className={`p-2 rounded-xl transition-colors ${
                                isExpanded
                                  ? 'bg-accent text-white'
                                  : 'hover:bg-accent/15 hover:text-accent text-text-muted'
                              }`}
                              title={isExpanded ? 'Collapse Editor' : 'Edit Inline'}
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(product)}
                              className="p-2 hover:bg-error/15 hover:text-error rounded-xl transition-colors text-text-muted"
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Accordion Body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr key={`expanded-${product.id}`} className="bg-secondary/10">
                            <td colSpan={8} className="p-0 border-b border-accent/20">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden p-3 md:p-4"
                              >
                                <AdminProductAccordionEditor
                                  product={product}
                                  categories={categories}
                                  onSaved={handleProductSaved}
                                  onClose={() => setExpandedProductId(null)}
                                  onDeleteRequest={(prod) => handleOpenDelete(prod)}
                                />
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        itemName={productToDelete?.name || ''}
        loading={deleting}
      />
    </div>
  );
}
