import { createServerClient as createSSRServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { resolveProductImage } from '@/lib/data/productImageMap';

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * Must be called within a server context where cookies() is available.
 * 
 * This is async because Next.js 15 makes cookies() an async function.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local'
    );
  }

  const rawClient = createSSRServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll is called from a Server Component where cookies
          // cannot be set. This is safe to ignore when just reading
          // session data in Server Components.
        }
      },
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

  return rawClient;
}

