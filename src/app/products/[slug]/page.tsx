import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { resolveProductImage } from '@/lib/data/productImageMap';
import type { Product } from '@/lib/types';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*), product_variants(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;

    const formatted: Product = {
      ...data,
      category: data.categories,
      variants: data.product_variants || [],
    };

    return resolveProductImage(formatted);
  } catch (err) {
    console.error('Error fetching product in getProductBySlug:', err);
    return null;
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://petsolutions.lk';
  const productUrl = `${siteUrl}/products/${slug}`;

  if (!product) {
    return {
      title: 'Product Details | PetSolutions.lk',
      description: 'Discover premium pet supplies, dog and cat foods, supplements, and veterinary essentials at PetSolutions.lk in Sri Lanka.',
    };
  }

  const cleanDescription = (product.description || '')
    .replace(/[#*`_\[\]]/g, '')
    .slice(0, 155)
    .trim();

  const description = cleanDescription
    ? `${cleanDescription}... Fast islandwide delivery in Sri Lanka.`
    : `Buy ${product.name} online at PetSolutions.lk. Fast doorstep delivery islandwide across Sri Lanka.`;

  const imageUrl = product.image_url || `${siteUrl}/logo-icon.png`;

  return {
    title: `${product.name} | PetSolutions.lk`,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} — PetSolutions.lk`,
      description,
      url: productUrl,
      siteName: 'PetSolutions.lk',
      locale: 'en_LK',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | PetSolutions.lk`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://petsolutions.lk';
  const productUrl = `${siteUrl}/products/${slug}`;

  // Find lowest price and stock status
  const activeVariants = (product?.variants || []).filter((v) => v.is_active !== false);
  const lowestPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.price))
    : 0;
  const inStock = activeVariants.some((v) => (v.stock ?? 1) > 0);

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image_url || `${siteUrl}/logo-icon.png`,
        description: product.description || product.name,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'PetSolutions.lk',
        },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'LKR',
          price: lowestPrice,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'PetSolutions.lk',
          },
        },
      }
    : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${siteUrl}/products`,
      },
      ...(product
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: productUrl,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
