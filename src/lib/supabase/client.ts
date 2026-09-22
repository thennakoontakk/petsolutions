'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { resolveProductImage } from '@/lib/data/productImageMap';

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

  // Ensure all products resolve to high-res Supabase Storage URLs
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
              if (Array.isArray(res.data)) {
                res.data = res.data.map(resolveProductImage);
              } else {
                res.data = resolveProductImage(res.data);
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

