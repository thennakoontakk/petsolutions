import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://petsolutions.lk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 2. Fetch dynamic products & categories from Supabase
  let productEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at, is_active')
        .eq('is_active', true);

      if (products && products.length > 0) {
        productEntries = products
          .filter((p) => p.slug)
          .map((p) => ({
            url: `${baseUrl}/products/${p.slug}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
          }));
      }

      // Fetch categories
      const { data: categories } = await supabase
        .from('categories')
        .select('slug, updated_at');

      if (categories && categories.length > 0) {
        categoryEntries = categories
          .filter((c) => c.slug)
          .map((c) => ({
            url: `${baseUrl}/products?category=${c.slug}`,
            lastModified: c.updated_at ? new Date(c.updated_at) : currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }));
      }
    } catch (err) {
      console.error('Error generating dynamic sitemap from Supabase:', err);
    }
  }

  return [...staticPages, ...categoryEntries, ...productEntries];
}
