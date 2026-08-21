'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Save,
  ShoppingCart,
  FlaskConical,
  Stethoscope,
  Pill,
  ShieldAlert,
  Package,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils/slugify';
import type { Category, Product } from '@/lib/types';
import ImageUploader from '@/components/ui/ImageUploader';

interface VariantInput {
  id?: string;
  size_label: string;
  price: string;
  compare_at_price: string;
  stock: number;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  categories: Category[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories,
}: ProductModalProps) {
  const isEditing = Boolean(product?.id);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [indications, setIndications] = useState('');
  const [directions, setDirections] = useState('');
  const [packaging, setPackaging] = useState('');
  const [storageSafety, setStorageSafety] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [petType, setPetType] = useState('Cat/Dog');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantInput[]>([
    { size_label: 'Default', price: '', compare_at_price: '', stock: 100 },
  ]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'pricing' | 'images'>('basic');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or Populate form on open
  useEffect(() => {
    if (!isOpen) return;

    setError(null);
    setActiveTab('basic');

    if (product) {
      // Edit mode
      setName(product.name || '');
      setBrand(product.brand || '');
      setDescription(product.description || '');
      setIngredients(product.ingredients || '');
      setIndications(product.indications || '');
      setDirections(product.directions || '');
      setPackaging(product.packaging || '');
      setStorageSafety(product.storage_safety || '');
      setCategoryId(product.category_id || (categories[0]?.id ?? ''));
      setPetType(product.pet_type || 'Cat/Dog');
      setIsFeatured(product.is_featured || false);
      setImageUrl(product.image_url || '');
      setImages(product.images || []);

      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((v) => ({
            id: v.id,
            size_label: v.size_label,
            price: v.price.toString(),
            compare_at_price: v.compare_at_price ? v.compare_at_price.toString() : '',
            stock: v.stock || 0,
          }))
        );
      } else {
        setVariants([{ size_label: 'Default', price: '', compare_at_price: '', stock: 100 }]);
      }
    } else {
      // Add mode
      setName('');
      setBrand('');
      setDescription('');
      setIngredients('');
      setIndications('');
      setDirections('');
      setPackaging('');
      setStorageSafety('');
      setCategoryId(categories[0]?.id ?? '');
      setPetType('Cat/Dog');
      setIsFeatured(false);
      setImageUrl('');
      setImages([]);
      setVariants([{ size_label: 'Default', price: '', compare_at_price: '', stock: 100 }]);
    }
  }, [isOpen, product, categories]);

  const handleAddVariant = () => {
    setVariants([...variants, { size_label: '', price: '', compare_at_price: '', stock: 100 }]);
  };

  const handleRemoveVariant = async (index: number) => {
    const variantToRemove = variants[index];

    if (variantToRemove.id && isEditing) {
      if (!confirm('This variant exists in the database. Deleting it will take effect immediately. Continue?')) return;
      try {
        const supabase = createBrowserClient();
        const { error } = await supabase.from('product_variants').delete().eq('id', variantToRemove.id);
        if (error) throw error;
      } catch (err: any) {
        alert(err.message || 'Failed to delete variant.');
        return;
      }
    }

    if (variants.length === 1) {
      setVariants([{ size_label: '', price: '', compare_at_price: '', stock: 100 }]);
    } else {
      setVariants(variants.filter((_, idx) => idx !== index));
    }
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !categoryId) {
      setError('Please fill in Product Name and Category.');
      setActiveTab('basic');
      return;
    }

    const validVariants = variants.filter((v) => v.size_label.trim() && v.price);
    if (validVariants.length === 0) {
      setError('Please add at least one variant with a Size label and Price.');
      setActiveTab('pricing');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const slug = slugify(name);

      if (isEditing && product?.id) {
        // 1. Update Product
        const { error: prodError } = await supabase
          .from('products')
          .update({
            name,
            slug,
            brand: brand || null,
            description: description || null,
            ingredients: ingredients || null,
            indications: indications || null,
            directions: directions || null,
            packaging: packaging || null,
            storage_safety: storageSafety || null,
            category_id: categoryId,
            pet_type: petType,
            is_featured: isFeatured,
            image_url: imageUrl || null,
            images: images,
          })
          .eq('id', product.id);

        if (prodError) throw prodError;

        // 2. Upsert/Update Variants
        for (const v of validVariants) {
          const payload = {
            product_id: product.id,
            size_label: v.size_label,
            price: parseFloat(v.price),
            compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
            stock: v.stock,
          };

          if (v.id) {
            const { error: varErr } = await supabase
              .from('product_variants')
              .update(payload)
              .eq('id', v.id);
            if (varErr) throw varErr;
          } else {
            const { error: varErr } = await supabase
              .from('product_variants')
              .insert(payload);
            if (varErr) throw varErr;
          }
        }
      } else {
        // 1. Insert New Product
        const { data: newProd, error: prodError } = await supabase
          .from('products')
          .insert({
            name,
            slug,
            brand: brand || null,
            description: description || null,
            ingredients: ingredients || null,
            indications: indications || null,
            directions: directions || null,
            packaging: packaging || null,
            storage_safety: storageSafety || null,
            category_id: categoryId,
            pet_type: petType,
            is_featured: isFeatured,
            image_url: imageUrl || null,
            images: images,
          })
          .select()
          .single();

        if (prodError) throw prodError;

        // 2. Insert Variants
        const variantsToInsert = validVariants.map((v) => ({
          product_id: newProd.id,
          size_label: v.size_label,
          price: parseFloat(v.price),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          stock: v.stock,
        }));

        const { error: varError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert);

        if (varError) throw varError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving product modal:', err);
      setError(err.message || 'Failed to save product. Please check for duplicate names.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Solid Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={saving ? undefined : onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window: Compact max-w-2xl, warm cream background, brand blue border, and strict flex scrolling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="relative w-full max-w-2xl rounded-3xl border-2 border-[#00ACDF] shadow-[0_25px_60px_rgba(0,0,0,0.18),_0_0_30px_rgba(0,172,223,0.22)] z-10 flex flex-col max-h-[86vh] overflow-hidden text-slate-900"
          style={{ backgroundColor: '#F5EFEB' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header (Sticky top) */}
          <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-[#E2D8CA] flex items-center justify-between bg-[#EFE8DE] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#00ACDF]/15 text-[#00ACDF] border border-[#00ACDF]/30 rounded-2xl">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-[280px] sm:max-w-md">
                  {isEditing ? `Editing: "${product?.name}"` : 'Create a new product listing in your catalog.'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={saving}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#E2D8CA] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Navigation (Sticky below header) */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 pt-2.5 pb-2 border-b border-[#E2D8CA] bg-[#E8E0D4] overflow-x-auto no-scrollbar flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'basic'
                  ? 'bg-[#00ACDF] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-[#DDD4C6]'
              }`}
            >
              <Sparkles size={13} /> Basic Details
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-[#00ACDF] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-[#DDD4C6]'
              }`}
            >
              <FlaskConical size={13} /> Veterinary & Specs
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'pricing'
                  ? 'bg-[#00ACDF] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-[#DDD4C6]'
              }`}
            >
              <Layers size={13} /> Sizes & Pricing ({variants.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'images'
                  ? 'bg-[#00ACDF] text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-[#DDD4C6]'
              }`}
            >
              <ImageIcon size={13} /> Images ({images.length + (imageUrl ? 1 : 0)})
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-7 space-y-5 bg-[#F5EFEB]">
              {error && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 flex items-center justify-between">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError(null)}><X size={14} /></button>
                </div>
              )}

              {/* TAB 1: BASIC DETAILS */}
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div className="grid grid-1 md:grid-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Himalaya Liv.52 Pet Liquid"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Brand / Manufacturer
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Himalaya, Zoetis, Virbac"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-1 md:grid-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.parent_category})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Pet Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={petType}
                        onChange={(e) => setPetType(e.target.value)}
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                      >
                        <option value="Cat/Dog">Cat/Dog (Both)</option>
                        <option value="Dog">Dog Only</option>
                        <option value="Cat">Cat Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Product Overview / Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Comprehensive summary of the product, benefits, and specifications..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white border border-[#D8CFC0] rounded-xl p-3.5 text-xs text-slate-900 leading-relaxed focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#EFE8DE] rounded-xl border border-[#E2D8CA]">
                    <input
                      type="checkbox"
                      id="modal_is_featured_solid"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-[#00ACDF] border-[#D8CFC0] rounded focus:ring-[#00ACDF]"
                    />
                    <label htmlFor="modal_is_featured_solid" className="text-xs font-bold text-slate-800 select-none cursor-pointer">
                      Feature this product on the homepage carousel & promotions
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: VETERINARY & CLINICAL SPECS */}
              {activeTab === 'specs' && (
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <FlaskConical size={14} className="text-[#00ACDF]" /> Key Ingredients & Composition
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Caper Bush (Himsra), Chicory (Kasani), Glycine-chelated iron 20 mg..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="w-full bg-white border border-[#D8CFC0] rounded-xl p-3 text-xs text-slate-900 focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Active compounds, botanical extracts, vitamins, and minerals.</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <Stethoscope size={14} className="text-[#00ACDF]" /> Indications & Clinical Uses
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Appetite stimulant, liver protection, nutritional support in anaemic states..."
                      value={indications}
                      onChange={(e) => setIndications(e.target.value)}
                      className="w-full bg-white border border-[#D8CFC0] rounded-xl p-3 text-xs text-slate-900 focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Medical conditions, target benefits, and clinical applications.</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <Pill size={14} className="text-[#00ACDF]" /> Directions & Dosage Guide
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Small dogs: 5-8 ml twice daily; Large dogs: 10-15 ml twice daily. As directed by a veterinarian."
                      value={directions}
                      onChange={(e) => setDirections(e.target.value)}
                      className="w-full bg-white border border-[#D8CFC0] rounded-xl p-3 text-xs text-slate-900 font-mono focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Weight-based dosage, frequency, and feeding instructions.</p>
                  </div>

                  <div className="grid grid-1 md:grid-2 gap-5">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                        <Package size={14} className="text-[#00ACDF]" /> Packaging & Presentation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 200-ml bottle, 50 chewable tablets"
                        value={packaging}
                        onChange={(e) => setPackaging(e.target.value)}
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                        <ShieldAlert size={14} className="text-[#00ACDF]" /> Storage & Safety Precautions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Store below 30°C; Keep away from children; Animal use only"
                        value={storageSafety}
                        onChange={(e) => setStorageSafety(e.target.value)}
                        className="w-full bg-white border border-[#D8CFC0] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/15 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SIZES & PRICING */}
              {activeTab === 'pricing' && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-[#E2D8CA]">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-900">
                        Product Sizes, Pricing & Stock
                      </h3>
                      <p className="text-xs text-slate-500">
                        Configure size variants (e.g. 200ml, 1Kg, 50s) with accurate LKR prices.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3.5 py-1.5 bg-[#00ACDF] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#0090BB] transition-colors shadow-sm"
                    >
                      <Plus size={13} /> Add Size Variant
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {variants.map((v, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-2xl border border-[#D8CFC0] relative space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#00ACDF] bg-[#00ACDF]/10 border border-[#00ACDF]/20 px-2.5 py-0.5 rounded-lg">
                            Size Variant #{index + 1}
                          </span>
                          {variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(index)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Remove variant"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-1 sm:grid-3 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Size / Pack Label <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 200ml, 1Kg, 50s"
                              value={v.size_label}
                              onChange={(e) => handleVariantChange(index, 'size_label', e.target.value)}
                              className="w-full bg-[#F5EFEB] border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#00ACDF] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Selling Price (LKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="Price in Rs."
                              value={v.price}
                              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                              className="w-full bg-[#F5EFEB] border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:bg-white focus:border-[#00ACDF] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Compare Price (Optional)
                            </label>
                            <input
                              type="number"
                              placeholder="Discount strike price"
                              value={v.compare_at_price}
                              onChange={(e) => handleVariantChange(index, 'compare_at_price', e.target.value)}
                              className="w-full bg-[#F5EFEB] border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#00ACDF] outline-none"
                            />
                          </div>
                        </div>

                        <div className="max-w-[200px]">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                            className="w-full bg-[#F5EFEB] border border-[#D8CFC0] rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#00ACDF] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: IMAGES */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Main Product Image
                    </label>
                    <ImageUploader
                      value={imageUrl}
                      onChange={(url) => setImageUrl(url)}
                      multiple={false}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Primary thumbnail shown on store listings and product cards.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E2D8CA]">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Product Detail Gallery Images
                    </label>
                    <ImageUploader
                      value={images}
                      onChange={(urls) => setImages(urls)}
                      multiple={true}
                      maxFiles={6}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Additional product shots and packaging photos for customer zoom & inspection.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer (Sticky bottom) */}
            <div className="p-3.5 px-5 sm:p-4 sm:px-6 border-t border-[#E2D8CA] flex items-center justify-between bg-[#EFE8DE] flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-[#D8CFC0] rounded-xl transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2.5 sm:gap-3">
                {activeTab !== 'pricing' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'basic') setActiveTab('specs');
                      else if (activeTab === 'specs') setActiveTab('pricing');
                      else if (activeTab === 'images') setActiveTab('pricing');
                    }}
                    className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-slate-700 hover:bg-[#E2D8CA] rounded-xl transition-colors"
                  >
                    Next Step →
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 sm:px-6 sm:py-2.5 text-xs font-bold rounded-xl bg-[#00ACDF] text-white hover:bg-[#0090BB] transition-all flex items-center gap-2 shadow-lg shadow-[#00ACDF]/25"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  ) : (
                    <>
                      <Save size={15} /> {isEditing ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
