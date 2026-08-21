'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, ShoppingCart } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils/slugify';
import type { Category, Product, ProductVariant } from '@/lib/types';
import ImageUploader from '@/components/ui/ImageUploader';

interface VariantInput {
  id?: string;
  size_label: string;
  price: string;
  compare_at_price: string;
  stock: number;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [variants, setVariants] = useState<VariantInput[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load product and categories
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createBrowserClient();
        
        // 1. Load Categories
        const { data: catData, error: catError } = await supabase.from('categories').select('*').order('name');
        if (catError) throw catError;
        setCategories(catData || []);

        // 2. Load Product
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .eq('id', id)
          .single();

        if (prodError) throw prodError;
        
        if (prodData) {
          setName(prodData.name);
          setBrand(prodData.brand || '');
          setDescription(prodData.description || '');
          setIngredients(prodData.ingredients || '');
          setIndications(prodData.indications || '');
          setDirections(prodData.directions || '');
          setPackaging(prodData.packaging || '');
          setStorageSafety(prodData.storage_safety || '');
          setCategoryId(prodData.category_id || '');
          setPetType(prodData.pet_type);
          setIsFeatured(prodData.is_featured || false);
          setImageUrl(prodData.image_url || '');
          setImages(prodData.images || []);
          
          if (prodData.product_variants) {
            const formattedVars = prodData.product_variants.map((v: any) => ({
              id: v.id,
              size_label: v.size_label,
              price: v.price.toString(),
              compare_at_price: v.compare_at_price ? v.compare_at_price.toString() : '',
              stock: v.stock || 0,
            }));
            setVariants(formattedVars);
          }
        }
      } catch (err: any) {
        console.error('Error loading product details:', err);
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadData();
    }
  }, [id]);

  const handleAddVariant = () => {
    setVariants([...variants, { size_label: '', price: '', compare_at_price: '', stock: 100 }]);
  };

  const handleRemoveVariant = async (index: number) => {
    const variantToRemove = variants[index];
    
    if (variantToRemove.id) {
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
    
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: keyof VariantInput, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId) {
      setError('Please fill in Name and Category.');
      return;
    }
    
    // Check variants
    const validVariants = variants.filter(v => v.size_label && v.price);
    if (validVariants.length === 0) {
      setError('Please add at least one variant with size label and price.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const slug = slugify(name);

      // 1. Update product
      const { error: prodError } = await supabase
        .from('products')
        .update({
          name,
          slug,
          brand,
          description,
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
        .eq('id', id);

      if (prodError) throw prodError;

      // 2. Manage variants (Upsert or separate inserts/updates)
      for (const v of validVariants) {
        const variantPayload = {
          product_id: id,
          size_label: v.size_label,
          price: parseFloat(v.price),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          stock: v.stock,
        };

        if (v.id) {
          // Update existing
          const { error } = await supabase
            .from('product_variants')
            .update(variantPayload)
            .eq('id', v.id);
          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('product_variants')
            .insert(variantPayload);
          if (error) throw error;
        }
      }

      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Error saving product details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-secondary/40 rounded-full transition-colors text-text-muted hover:text-text">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
            <ShoppingCart size={24} className="text-accent" /> Edit Product
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Modify product information, image, or pricing details.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error-light text-error text-xs rounded-xl border border-error/20 max-w-3xl">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start max-w-5xl">
        
        {/* Left Side: General Info */}
        <div className="flex-1 w-full glass p-6 rounded-2xl border border-white/40 space-y-4" style={{ flex: '1 1 auto', minWidth: '320px' }}>
          <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
            Product Details
          </h3>

          <div className="grid grid-1 md:grid-2 gap-4">
            <div>
              <label className="label">Product Name <span className="text-error">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Josi Cat Crunchy Chicken"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Brand / Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. JosiCat"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid grid-1 md:grid-2 gap-4">
            <div>
              <label className="label">Category <span className="text-error">*</span></label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input w-full"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.parent_category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Pet Type <span className="text-error">*</span></label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="input w-full"
              >
                <option value="Cat/Dog">Cat/Dog (Both)</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Product Image (Optional)</label>
            <ImageUploader
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              multiple={false}
            />
            <p className="text-[9px] text-text-muted mt-1">Upload the main image for the product storefront listing.</p>
          </div>

          <div>
            <label className="label">Product Gallery Images (Optional)</label>
            <ImageUploader
              value={images}
              onChange={(urls) => setImages(urls)}
              multiple={true}
              maxFiles={6}
            />
            <p className="text-[9px] text-text-muted mt-1">Upload additional images for the product detail gallery.</p>
          </div>

          <div>
            <label className="label">Product Description</label>
            <textarea
              rows={4}
              placeholder="Comprehensive summary of the product, key highlights, and overview."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Veterinary & Specification Fields */}
          <div className="pt-3 border-t border-secondary/50 space-y-4">
            <h4 className="font-heading font-bold text-sm text-text flex items-center gap-2">
              Veterinary & Clinical Specifications
            </h4>

            <div>
              <label className="label">Key Ingredients & Composition</label>
              <textarea
                rows={3}
                placeholder="e.g. Caper Bush (Himsra) and Chicory (Kasani); Glycine-chelated iron 20 mg..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="input w-full text-xs"
              />
              <p className="text-[10px] text-text-muted mt-1">Active ingredients, botanical extracts, vitamins, and minerals per dose/tablet.</p>
            </div>

            <div>
              <label className="label">Indications & Uses</label>
              <textarea
                rows={3}
                placeholder="e.g. Appetite stimulant and hepatoprotective product; supportive use during anaemia, debility..."
                value={indications}
                onChange={(e) => setIndications(e.target.value)}
                className="input w-full text-xs"
              />
              <p className="text-[10px] text-text-muted mt-1">Medical conditions, clinical uses, and therapeutic benefits.</p>
            </div>

            <div>
              <label className="label">Directions & Dosage</label>
              <textarea
                rows={3}
                placeholder="e.g. Small-breed dogs: 5-8 ml twice daily; Large-breed dogs: 10-15 ml twice daily. As directed by a veterinarian."
                value={directions}
                onChange={(e) => setDirections(e.target.value)}
                className="input w-full text-xs"
              />
              <p className="text-[10px] text-text-muted mt-1">Dosage by weight/breed, feeding instructions, and frequency.</p>
            </div>

            <div className="grid grid-1 md:grid-2 gap-4">
              <div>
                <label className="label">Packaging & Presentation</label>
                <input
                  type="text"
                  placeholder="e.g. 200-ml labeled liquid bottle, 50 Tablets bottle"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  className="input w-full text-xs"
                />
                <p className="text-[10px] text-text-muted mt-1">Official bottle/pack size or presentation format.</p>
              </div>

              <div>
                <label className="label">Storage & Safety Precautions</label>
                <input
                  type="text"
                  placeholder="e.g. Store at 15-30°C; Keep out of reach of children; For animal use only"
                  value={storageSafety}
                  onChange={(e) => setStorageSafety(e.target.value)}
                  className="input w-full text-xs"
                />
                <p className="text-[10px] text-text-muted mt-1">Temperature warnings, cautionary instructions.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-accent border-secondary-alt rounded focus:ring-accent"
            />
            <label htmlFor="is_featured" className="text-xs font-semibold text-text select-none cursor-pointer">
              Feature this product on homepage carousel
            </label>
          </div>
        </div>

        {/* Right Side: Sizes / Variants list */}
        <div className="w-full lg:w-96 glass p-6 rounded-2xl border border-white/40 space-y-4">
          <div className="flex justify-between items-center border-b border-secondary/50 pb-2">
            <h3 className="font-heading font-bold text-base text-text">
              Sizes & Pricing
            </h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="btn btn-outline btn-sm text-[10px] py-1 px-2.5 flex items-center gap-1"
            >
              <Plus size={12} /> Add Size
            </button>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {variants.map((v, index) => (
              <div key={index} className="p-3 bg-secondary/20 rounded-xl space-y-2 border border-secondary-alt/20 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="absolute top-2 right-2 text-text-muted hover:text-error transition-colors"
                >
                  <Trash2 size={12} />
                </button>
                
                <div>
                  <label className="text-[10px] font-bold text-text-muted">Size / Weight Label <span className="text-error">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500g, 10Kg, 225ml"
                    value={v.size_label}
                    onChange={(e) => handleVariantChange(index, 'size_label', e.target.value)}
                    className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5"
                  />
                </div>

                <div className="grid grid-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted">Price (LKR) <span className="text-error">*</span></label>
                    <input
                      type="number"
                      required
                      placeholder="LKR"
                      value={v.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-muted">Original Price</label>
                    <input
                      type="number"
                      placeholder="Discount ref"
                      value={v.compare_at_price}
                      onChange={(e) => handleVariantChange(index, 'compare_at_price', e.target.value)}
                      className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-text-muted">Stock Quantity</label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                    className="input w-full py-1 text-xs px-2.5 h-8 mt-0.5"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
