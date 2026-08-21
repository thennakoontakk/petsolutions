'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  X,
  Plus,
  Trash2,
  Package,
  Sparkles,
  ExternalLink,
  FlaskConical,
  Stethoscope,
  FileText,
  ShieldAlert,
  Info,
  DollarSign,
  Layers,
  Dog,
  Cat,
  Check,
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils/slugify';
import type { Category, Product, ProductVariant, PetType } from '@/lib/types';
import ImageUploader from '@/components/ui/ImageUploader';

interface VariantInput {
  id?: string;
  size_label: string;
  price: string;
  compare_at_price: string;
  stock: number;
  is_active?: boolean;
}

interface AdminProductAccordionEditorProps {
  product: Product;
  categories: Category[];
  onSaved: (updatedProduct: Product) => void;
  onClose: () => void;
  onDeleteRequest?: (product: Product) => void;
}

export default function AdminProductAccordionEditor({
  product,
  categories,
  onSaved,
  onClose,
  onDeleteRequest,
}: AdminProductAccordionEditorProps) {
  const [name, setName] = useState(product.name || '');
  const [brand, setBrand] = useState(product.brand || '');
  const [description, setDescription] = useState(product.description || '');
  const [ingredients, setIngredients] = useState(product.ingredients || '');
  const [indications, setIndications] = useState(product.indications || '');
  const [directions, setDirections] = useState(product.directions || '');
  const [packaging, setPackaging] = useState(product.packaging || '');
  const [storageSafety, setStorageSafety] = useState(product.storage_safety || '');
  const [categoryId, setCategoryId] = useState(product.category_id || '');
  const [petType, setPetType] = useState<PetType>(product.pet_type || 'Cat/Dog');
  const [isFeatured, setIsFeatured] = useState(product.is_featured || false);
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [images, setImages] = useState<string[]>(product.images || []);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'ingredients' | 'indications' | 'directions' | 'packaging'
  >('overview');

  const [variants, setVariants] = useState<VariantInput[]>(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.map((v) => ({
        id: v.id,
        size_label: v.size_label,
        price: v.price?.toString() || '0',
        compare_at_price: v.compare_at_price ? v.compare_at_price.toString() : '',
        stock: v.stock ?? 0,
        is_active: v.is_active ?? true,
      }));
    }
    return [{ size_label: 'Standard', price: '0', compare_at_price: '', stock: 100, is_active: true }];
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if product changes
  useEffect(() => {
    setName(product.name || '');
    setBrand(product.brand || '');
    setDescription(product.description || '');
    setIngredients(product.ingredients || '');
    setIndications(product.indications || '');
    setDirections(product.directions || '');
    setPackaging(product.packaging || '');
    setStorageSafety(product.storage_safety || '');
    setCategoryId(product.category_id || '');
    setPetType(product.pet_type || 'Cat/Dog');
    setIsFeatured(product.is_featured || false);
    setImageUrl(product.image_url || '');
    setImages(product.images || []);

    if (product.variants && product.variants.length > 0) {
      setVariants(
        product.variants.map((v) => ({
          id: v.id,
          size_label: v.size_label,
          price: v.price?.toString() || '0',
          compare_at_price: v.compare_at_price ? v.compare_at_price.toString() : '',
          stock: v.stock ?? 0,
          is_active: v.is_active ?? true,
        }))
      );
    }
  }, [product]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size_label: '', price: '', compare_at_price: '', stock: 100, is_active: true },
    ]);
  };

  const handleRemoveVariant = async (index: number) => {
    const variantToRemove = variants[index];
    if (variantToRemove.id) {
      if (
        !confirm(
          `Are you sure you want to delete size "${variantToRemove.size_label || 'Variant'}" from database?`
        )
      ) {
        return;
      }
      try {
        const supabase = createBrowserClient();
        const { error: delErr } = await supabase
          .from('product_variants')
          .delete()
          .eq('id', variantToRemove.id);
        if (delErr) throw delErr;
      } catch (err: any) {
        alert(err.message || 'Failed to delete variant.');
        return;
      }
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    const validVariants = variants.filter(
      (v) => v.size_label.trim() && !isNaN(parseFloat(v.price))
    );
    if (validVariants.length === 0) {
      setError('Please provide at least one size variant with a valid label and price.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const slug = slugify(name);

      // 1. Update product in Supabase
      const { data: updatedProd, error: prodErr } = await supabase
        .from('products')
        .update({
          name: name.trim(),
          slug,
          brand: brand.trim() || null,
          description: description.trim() || null,
          ingredients: ingredients.trim() || null,
          indications: indications.trim() || null,
          directions: directions.trim() || null,
          packaging: packaging.trim() || null,
          storage_safety: storageSafety.trim() || null,
          category_id: categoryId,
          pet_type: petType,
          is_featured: isFeatured,
          image_url: imageUrl || null,
          images: images || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id)
        .select('*, categories(*)')
        .single();

      if (prodErr) throw prodErr;

      // 2. Manage variants
      const savedVariants: ProductVariant[] = [];
      for (const v of validVariants) {
        const payload = {
          product_id: product.id,
          size_label: v.size_label.trim(),
          price: parseFloat(v.price),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          stock: v.stock,
          is_active: v.is_active ?? true,
        };

        if (v.id) {
          const { data: uv, error: uvErr } = await supabase
            .from('product_variants')
            .update(payload)
            .eq('id', v.id)
            .select()
            .single();
          if (uvErr) throw uvErr;
          if (uv) savedVariants.push(uv);
        } else {
          const { data: iv, error: ivErr } = await supabase
            .from('product_variants')
            .insert(payload)
            .select()
            .single();
          if (ivErr) throw ivErr;
          if (iv) savedVariants.push(iv);
        }
      }

      // Format updated product object
      const fullUpdatedProduct: Product = {
        ...updatedProd,
        category: updatedProd.categories || categories.find((c) => c.id === categoryId),
        variants: savedVariants,
      };

      onSaved(fullUpdatedProduct);
      onClose();
    } catch (err: any) {
      console.error('Error updating product inline:', err);
      setError(err.message || 'Failed to save product changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-secondary/40 to-secondary/15 rounded-3xl p-5 md:p-7 border-2 border-accent/30 shadow-2xl shadow-accent/5 my-3 relative overflow-hidden text-text">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-secondary-alt/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shadow-md shadow-accent/20">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base md:text-lg text-text">
                Live Product Editor
              </h2>
              <span className="badge badge-accent text-[10px] font-bold py-0.5 px-2">
                Storefront View & Edit
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Edit pricing, imagery, variants, and clinical specs inline without leaving the catalog.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {product.slug && (
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="btn btn-outline btn-sm text-[11px] py-1.5 px-3 flex items-center gap-1 text-text-muted hover:text-accent"
              title="View on public storefront"
            >
              <ExternalLink size={13} /> View Live Storefront
            </Link>
          )}

          {onDeleteRequest && (
            <button
              type="button"
              onClick={() => onDeleteRequest(product)}
              className="btn btn-outline btn-sm text-[11px] py-1.5 px-2.5 text-error hover:bg-error/10 hover:border-error/30"
              title="Delete this product"
            >
              <Trash2 size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary-alt/40 text-text-muted hover:text-text transition-colors"
            title="Collapse / Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-error/10 border border-error/30 text-error text-xs rounded-2xl flex items-center gap-2">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main 2-Column Storefront Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (5 cols): Media & Imagery */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Primary Image */}
            <div className="glass p-4 rounded-2xl border border-white/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text flex items-center gap-1.5">
                  <Package size={14} className="text-accent" /> Primary Product Image
                </label>
                <span className="text-[10px] text-text-muted font-medium">Shown on listing cards</span>
              </div>
              <ImageUploader
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                multiple={false}
              />
            </div>

            {/* Gallery Images */}
            <div className="glass p-4 rounded-2xl border border-white/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text flex items-center gap-1.5">
                  <Layers size={14} className="text-accent" /> Additional Gallery Images
                </label>
                <span className="text-[10px] text-text-muted font-medium">Up to 6 images</span>
              </div>
              <ImageUploader
                value={images}
                onChange={(urls) => setImages(urls)}
                multiple={true}
                maxFiles={6}
              />
            </div>

            {/* Quick Toggle: Featured Status */}
            <div className="glass p-4 rounded-2xl border border-white/50 flex items-center justify-between gap-3">
              <div>
                <label
                  htmlFor={`is_featured_${product.id}`}
                  className="text-xs font-bold text-text cursor-pointer block"
                >
                  Featured on Homepage
                </label>
                <p className="text-[10px] text-text-muted">
                  Showcase in top recommendations and trending sections.
                </p>
              </div>
              <input
                type="checkbox"
                id={`is_featured_${product.id}`}
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 text-accent rounded-lg border-secondary-alt cursor-pointer focus:ring-accent accent-accent"
              />
            </div>
          </div>

          {/* Right Column (7 cols): Storefront Title, Brand, Pricing & Specifications */}
          <div className="lg:col-span-7 space-y-5">
            {/* Primary Details (Name, Brand, Categories, Pet) */}
            <div className="glass p-5 rounded-2xl border border-white/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="label text-xs font-bold">
                    Product Title <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Himalaya Liv.52 Pet Liquid Supplement"
                    className="input w-full font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Himalaya"
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input w-full text-xs font-semibold"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.parent_category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label text-xs font-bold">Target Pet</label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value as PetType)}
                    className="input w-full text-xs font-semibold"
                  >
                    <option value="Cat/Dog">Cat & Dog (Universal)</option>
                    <option value="Dog">Dog Only</option>
                    <option value="Cat">Cat Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold">Overview / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary overview of the product for customer presentation..."
                  className="input w-full text-xs"
                />
              </div>
            </div>

            {/* Sizes & Pricing Variants Editor */}
            <div className="glass p-5 rounded-2xl border border-white/50 space-y-3">
              <div className="flex items-center justify-between border-b border-secondary/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-accent" />
                  <h3 className="font-heading font-bold text-sm text-text">
                    Sizes, Pricing & Inventory
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="btn btn-outline btn-sm text-[11px] py-1 px-3 flex items-center gap-1 rounded-xl text-accent border-accent/40 hover:bg-accent/10"
                >
                  <Plus size={13} /> Add Size Variant
                </button>
              </div>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-secondary/30 rounded-xl border border-secondary-alt/25 grid grid-cols-12 gap-2.5 items-center relative group"
                  >
                    {/* Size label */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className="text-[10px] font-bold text-text-muted block">
                        Size Label <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 200ml, 1kg"
                        value={v.size_label}
                        onChange={(e) => handleVariantChange(idx, 'size_label', e.target.value)}
                        className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5 font-semibold"
                      />
                    </div>

                    {/* Price (LKR) */}
                    <div className="col-span-6 sm:col-span-3">
                      <label className="text-[10px] font-bold text-text-muted block">
                        Selling Price (LKR) <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        step="any"
                        placeholder="Rs."
                        value={v.price}
                        onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                        className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5 font-bold text-accent"
                      />
                    </div>

                    {/* Compare at price */}
                    <div className="col-span-6 sm:col-span-2">
                      <label className="text-[10px] font-bold text-text-muted block truncate">
                        Original (Strike)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="Regular"
                        value={v.compare_at_price}
                        onChange={(e) =>
                          handleVariantChange(idx, 'compare_at_price', e.target.value)
                        }
                        className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5 text-text-muted"
                      />
                    </div>

                    {/* Stock */}
                    <div className="col-span-10 sm:col-span-2">
                      <label className="text-[10px] font-bold text-text-muted block">
                        Stock Qty
                      </label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) =>
                          handleVariantChange(idx, 'stock', parseInt(e.target.value) || 0)
                        }
                        className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5"
                      />
                    </div>

                    {/* Delete variant */}
                    <div className="col-span-2 sm:col-span-1 flex justify-end pt-3 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-text-muted hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/10"
                        title="Delete variant"
                        disabled={variants.length === 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Veterinary & Clinical Specs Tabs (Storefront Style) */}
            <div className="glass p-5 rounded-2xl border border-white/50 space-y-4">
              <div className="flex items-center gap-2 border-b border-secondary/60 pb-2">
                <FileText size={16} className="text-accent" />
                <h3 className="font-heading font-bold text-sm text-text">
                  Veterinary & Clinical Specifications
                </h3>
              </div>

              {/* Tab navigation buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-secondary/30 rounded-xl border border-secondary-alt/20">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <Info size={13} /> Composition
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'ingredients'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <FlaskConical size={13} /> Ingredients
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('indications')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'indications'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <Stethoscope size={13} /> Indications
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('directions')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'directions'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <FileText size={13} /> Dosage & Directions
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('packaging')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'packaging'
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  <ShieldAlert size={13} /> Packaging & Safety
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-2">
                {activeTab === 'overview' && (
                  <div className="space-y-1">
                    <label className="label text-xs font-bold text-text">
                      Key Botanical & Clinical Composition
                    </label>
                    <textarea
                      rows={3}
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="e.g. Caper Bush (Himsra), Kasani (Chicory), Arjuna extracts, Vitamin E..."
                      className="input w-full text-xs"
                    />
                    <p className="text-[10px] text-text-muted">
                      Active herbs, pharmacological ingredients, and mineral formulation per unit.
                    </p>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-1">
                    <label className="label text-xs font-bold text-text">
                      Full Formulation & Ingredients
                    </label>
                    <textarea
                      rows={3}
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Detailed ingredient breakdown..."
                      className="input w-full text-xs"
                    />
                  </div>
                )}

                {activeTab === 'indications' && (
                  <div className="space-y-1">
                    <label className="label text-xs font-bold text-text">
                      Therapeutic Indications & Clinical Uses
                    </label>
                    <textarea
                      rows={3}
                      value={indications}
                      onChange={(e) => setIndications(e.target.value)}
                      placeholder="e.g. Liver dysfunction, appetite stimulant, supportive therapy in debility..."
                      className="input w-full text-xs"
                    />
                    <p className="text-[10px] text-text-muted">
                      Specific symptoms, diseases, and treatment conditions this product addresses.
                    </p>
                  </div>
                )}

                {activeTab === 'directions' && (
                  <div className="space-y-1">
                    <label className="label text-xs font-bold text-text">
                      Directions, Dosage & Feeding Guide
                    </label>
                    <textarea
                      rows={3}
                      value={directions}
                      onChange={(e) => setDirections(e.target.value)}
                      placeholder="e.g. Puppies / Small breeds: 5-8 ml twice daily; Adult / Large dogs: 10-15 ml twice daily."
                      className="input w-full text-xs"
                    />
                    <p className="text-[10px] text-text-muted">
                      Administration method, breed dosage guidelines, and duration.
                    </p>
                  </div>
                )}

                {activeTab === 'packaging' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs font-bold text-text">
                        Packaging & Presentation
                      </label>
                      <input
                        type="text"
                        value={packaging}
                        onChange={(e) => setPackaging(e.target.value)}
                        placeholder="e.g. 200-ml labeled liquid bottle"
                        className="input w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="label text-xs font-bold text-text">
                        Storage & Safety Warnings
                      </label>
                      <input
                        type="text"
                        value={storageSafety}
                        onChange={(e) => setStorageSafety(e.target.value)}
                        placeholder="e.g. Store at 15-30°C. For animal use only."
                        className="input w-full text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-secondary-alt/30">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-semibold">ID:</span>
            <code className="text-[10px] bg-secondary/50 px-2 py-0.5 rounded text-text font-mono">
              {product.id}
            </code>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm text-xs font-semibold py-2.5 px-5 rounded-xl text-text hover:bg-secondary/40"
            >
              Cancel & Collapse
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-accent/25"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save & Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
