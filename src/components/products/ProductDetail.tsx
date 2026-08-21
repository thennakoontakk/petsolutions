'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  ChevronRight,
  Minus,
  Plus,
  Package,
  AlertTriangle,
  XCircle,
  Dog,
  Cat,
  FlaskConical,
  Stethoscope,
  FileText,
  Pill,
  ShieldAlert,
  Sparkles,
  Info,
} from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/types';
import { formatPrice, calcDiscount } from '@/lib/utils/formatPrice';
import SizeSelector from './SizeSelector';
import AddToCartButton from './AddToCartButton';

/* --------------------------------------------------------------------------
   Paw SVG Placeholder (large)
   -------------------------------------------------------------------------- */
function PawPlaceholderLarge() {
  return (
    <div
      className="flex-center w-full h-full"
      style={{
        background: 'var(--color-dominant-alt)',
        borderRadius: 'var(--radius-xl)',
        minHeight: 400,
      }}
    >
      <svg
        width="96"
        height="96"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.25 }}
      >
        <ellipse cx="32" cy="42" rx="10" ry="8" fill="#F5A623" />
        <circle cx="20" cy="26" r="6" fill="#F5A623" />
        <circle cx="44" cy="26" r="6" fill="#F5A623" />
        <circle cx="14" cy="38" r="5" fill="#F5A623" />
        <circle cx="50" cy="38" r="5" fill="#F5A623" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Stock Indicator
   -------------------------------------------------------------------------- */
function StockIndicator({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-error)' }}>
        <XCircle size={16} />
        Out of Stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>
        <AlertTriangle size={16} />
        Low Stock — Only {stock} left
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
      <Package size={16} />
      In Stock
    </span>
  );
}

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */
interface ProductDetailProps {
  product: Product;
  /** If true, shows a login prompt modal when auth is required */
  onAuthRequired?: () => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */
export default function ProductDetail({
  product,
  onAuthRequired,
}: ProductDetailProps) {
  const variants = product.variants ?? [];
  const activeVariants = variants.filter((v) => v.is_active);

  // Selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    activeVariants[0] ?? null,
  );

  // Tab state for product specification details
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'indications' | 'directions' | 'safety'>('overview');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Image gallery
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    if (product.image_url) imgs.push(product.image_url);
    if (product.images?.length) {
      product.images.forEach((img) => {
        if (!imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
  }, [product.image_url, product.images]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = allImages[activeImageIdx] ?? null;

  // Price info
  const price = selectedVariant?.price ?? 0;
  const compareAt = selectedVariant?.compare_at_price ?? null;
  const discount = compareAt ? calcDiscount(compareAt, price) : 0;
  const stock = selectedVariant?.stock ?? 0;

  const handleVariantChange = useCallback((v: ProductVariant) => {
    setSelectedVariant(v);
    setQuantity(1);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  }, [product.name]);

  const petIcon = product.pet_type === 'Dog' ? Dog : product.pet_type === 'Cat' ? Cat : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* ── Breadcrumb ── */}
      <nav
        className="flex items-center gap-1 text-xs text-muted flex-wrap mb-6"
      >
        <Link href="/" className="btn-ghost" style={{ padding: '2px 4px', borderRadius: 'var(--radius-sm)' }}>
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/products" className="btn-ghost" style={{ padding: '2px 4px', borderRadius: 'var(--radius-sm)' }}>
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="btn-ghost"
              style={{ padding: '2px 4px', borderRadius: 'var(--radius-sm)' }}
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="truncate max-w-[160px] sm:max-w-[280px]" style={{ color: 'var(--color-text)' }}>
          {product.name}
        </span>
      </nav>

      {/* ── Main Content ── */}
      <div className="grid grid-1 lg:grid-2 gap-8 md:gap-12 items-start">
        {/* ── Image Gallery ── */}
        <div>
          {/* Main Image */}
          <div
            className="glass overflow-hidden relative"
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--radius-xl)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <AnimatePresence mode="wait">
              {activeImage ? (
                <motion.div
                  key={activeImage}
                  className="relative w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              ) : (
                <PawPlaceholderLarge />
              )}
            </AnimatePresence>

            {/* Discount badge */}
            {discount > 0 && (
              <span
                className="badge absolute"
                style={{
                  top: 'var(--space-4)',
                  right: 'var(--space-4)',
                  background: 'var(--color-error)',
                  color: 'var(--white)',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  padding: 'var(--space-2) var(--space-3)',
                }}
              >
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2" style={{ overflowX: 'auto' }}>
              {allImages.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImageIdx(i)}
                  className="relative overflow-hidden"
                  style={{
                    width: 72,
                    height: 72,
                    flexShrink: 0,
                    borderRadius: 'var(--radius-md)',
                    border:
                      i === activeImageIdx
                        ? '2px solid var(--color-accent)'
                        : '2px solid transparent',
                    transition: 'border-color 200ms',
                    cursor: 'pointer',
                  }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Pet Type Badge */}
          <div className="flex items-center gap-2">
            {petIcon && (
              <span
                className="badge badge-accent"
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {(() => { const Icon = petIcon; return <Icon size={14} />; })()}
                {product.pet_type}
              </span>
            )}
            {product.category && (
              <span className="badge">{product.category.name}</span>
            )}
          </div>

          {/* Brand */}
          {product.brand && (
            <span
              className="text-sm text-muted font-medium"
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {product.brand}
            </span>
          )}

          {/* Product Name */}
          <h1
            className="font-heading font-bold"
            style={{
              fontSize: 'var(--text-3xl)',
              lineHeight: 1.2,
              color: 'var(--color-text)',
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-heading font-bold"
              style={{
                fontSize: 'var(--text-2xl)',
                color: 'var(--color-accent)',
              }}
            >
              {formatPrice(price)}
            </span>
            {compareAt && discount > 0 && (
              <span
                className="text-muted"
                style={{
                  textDecoration: 'line-through',
                  fontSize: 'var(--text-lg)',
                }}
              >
                {formatPrice(compareAt)}
              </span>
            )}
            {discount > 0 && (
              <span className="badge badge-error">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          {selectedVariant && <StockIndicator stock={stock} />}

          {/* Divider */}
          <hr className="divider" />

          {/* Packaging pill if available */}
          {product.packaging && (
            <div className="flex items-center gap-2 text-xs text-text-muted bg-secondary/30 px-3 py-1.5 rounded-lg border border-secondary-alt/20">
              <Package size={14} className="text-accent" />
              <span><strong>Packaging:</strong> {product.packaging}</span>
            </div>
          )}

          {/* Size / Variant Selector */}
          {activeVariants.length > 0 && (
            <div>
              <h3
                className="font-heading font-semibold"
                style={{
                  fontSize: 'var(--text-base)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {activeVariants.length > 1 ? 'Select Size' : 'Size'}
              </h3>
              <SizeSelector
                variants={activeVariants}
                selectedId={selectedVariant?.id ?? null}
                onChange={handleVariantChange}
              />
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3
              className="font-heading font-semibold"
              style={{
                fontSize: 'var(--text-base)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Quantity
            </h3>
            <div
              className="flex items-center"
              style={{
                background: 'var(--color-secondary)',
                borderRadius: 'var(--radius-lg)',
                display: 'inline-flex',
                overflow: 'hidden',
              }}
            >
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-semibold"
                style={{
                  minWidth: 40,
                  textAlign: 'center',
                  fontSize: 'var(--text-base)',
                }}
              >
                {quantity}
              </motion.span>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex gap-3 flex-wrap"
            style={{ marginTop: 'var(--space-2)' }}
          >
            <AddToCartButton
              variantId={selectedVariant?.id ?? ''}
              quantity={quantity}
              disabled={!selectedVariant || stock <= 0}
              fullWidth
              onAuthRequired={onAuthRequired}
            />
          </div>

          {/* Share */}
          <button
            className="btn btn-ghost text-sm"
            onClick={handleShare}
            style={{ alignSelf: 'flex-start' }}
          >
            <Share2 size={16} />
            Share Product
          </button>
        </div>
      </div>

      {/* ── Product Specifications & Veterinary Information Tabs ── */}
      <div className="mt-12 glass p-6 md:p-8 rounded-3xl border border-white/40 space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-secondary/60 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-muted hover:text-text hover:bg-secondary/40'
            }`}
          >
            <FileText size={16} />
            Product Overview
          </button>

          {product.ingredients && (
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'ingredients'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-secondary/40'
              }`}
            >
              <FlaskConical size={16} />
              Composition & Ingredients
            </button>
          )}

          {product.indications && (
            <button
              onClick={() => setActiveTab('indications')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'indications'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-secondary/40'
              }`}
            >
              <Stethoscope size={16} />
              Indications & Uses
            </button>
          )}

          {product.directions && (
            <button
              onClick={() => setActiveTab('directions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'directions'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-secondary/40'
              }`}
            >
              <Pill size={16} />
              Directions & Dosage
            </button>
          )}

          {(product.storage_safety || product.packaging) && (
            <button
              onClick={() => setActiveTab('safety')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'safety'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text hover:bg-secondary/40'
              }`}
            >
              <ShieldAlert size={16} />
              Packaging & Safety
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[140px] pt-2">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                <Sparkles size={18} className="text-accent" /> Product Description
              </h3>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                {product.description || 'No additional description provided for this product.'}
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && product.ingredients && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                <FlaskConical size={18} className="text-accent" /> Key Ingredients & Formula Composition
              </h3>
              <div className="p-4 bg-secondary/30 rounded-2xl border border-secondary-alt/20">
                <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                  {product.ingredients}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'indications' && product.indications && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                <Stethoscope size={18} className="text-accent" /> Indications & Clinical Uses
              </h3>
              <div className="p-4 bg-secondary/30 rounded-2xl border border-secondary-alt/20">
                <p className="text-sm text-text leading-relaxed whitespace-pre-line">
                  {product.indications}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'directions' && product.directions && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                <Pill size={18} className="text-accent" /> Directions for Use & Dosage Guide
              </h3>
              <div className="p-4 bg-secondary/30 rounded-2xl border border-secondary-alt/20">
                <p className="text-sm text-text leading-relaxed whitespace-pre-line font-mono text-xs md:text-sm">
                  {product.directions}
                </p>
              </div>
              <p className="text-[11px] text-text-muted italic flex items-center gap-1.5">
                <Info size={14} className="text-accent flex-shrink-0" />
                Always consult your veterinarian for customized dosage based on your pet&apos;s specific health condition and body weight.
              </p>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="grid grid-1 md:grid-2 gap-4">
              {product.packaging && (
                <div className="p-4 bg-secondary/30 rounded-2xl border border-secondary-alt/20 space-y-2">
                  <h4 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                    <Package size={16} className="text-accent" /> Packaging & Presentation
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {product.packaging}
                  </p>
                </div>
              )}

              {product.storage_safety && (
                <div className="p-4 bg-secondary/30 rounded-2xl border border-secondary-alt/20 space-y-2">
                  <h4 className="font-heading font-bold text-sm text-text flex items-center gap-2">
                    <ShieldAlert size={16} className="text-accent" /> Storage & Safety Precautions
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {product.storage_safety}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
