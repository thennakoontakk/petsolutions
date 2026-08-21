'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Creates a singleton Supabase client for browser-side usage.
 * Safe to call multiple times — returns the same instance.
 */
export function createBrowserClient(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local'
    );
  }

  const rawClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  // Intercept client queries to mock/inject the 3 images for the SmartHeart Power Pack Adult product
  const originalFrom = rawClient.from;
  rawClient.from = function (this: any, table: string) {
    const queryBuilder = originalFrom.apply(this, arguments as any);
    if (table === 'products') {
      const qBuilder = queryBuilder as any;
      const originalSelect = qBuilder.select;
      qBuilder.select = function (this: any) {
        const filterBuilder = originalSelect.apply(this, arguments as any);
        const originalThen = filterBuilder.then;
        filterBuilder.then = function (this: any, onfulfilled: any, onrejected: any) {
          return originalThen.call(this, (res: any) => {
            if (res && res.data) {
              const modifyProduct = (p: any) => {
                if (p && (p.slug === 'smartheart-power-pack-adult' || p.id === '94e4da03-d940-479e-a2da-e625aafbc302')) {
                  p.image_url = '/images/products/1.jpeg';
                  p.images = ['/images/products/1.jpeg', '/images/products/2.jpeg', '/images/products/3.jpeg'];
                }
              };
              if (Array.isArray(res.data)) {
                res.data.forEach(modifyProduct);
              } else {
                modifyProduct(res.data);
              }
            }
            return onfulfilled ? onfulfilled(res) : res;
          }, onrejected);
        };
        return filterBuilder;
      };
    }
    return queryBuilder;
  } as any;




  client = rawClient;

  return client;
}

