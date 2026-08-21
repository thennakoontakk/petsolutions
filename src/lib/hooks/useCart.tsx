'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { CartItem, ProductVariant, Product } from '@/lib/types';

/* --------------------------------------------------------------------------
   Constants
   -------------------------------------------------------------------------- */
const LOCAL_STORAGE_KEY = 'petsolutions_cart';

/* --------------------------------------------------------------------------
   State shape & actions
   -------------------------------------------------------------------------- */
interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // variantId
  | { type: 'UPDATE_QTY'; payload: { variantId: string; quantity: number } }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.variant_id === action.payload.variant_id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.variant_id === action.payload.variant_id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.variant_id !== action.payload),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.variant_id === action.payload.variantId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

/* --------------------------------------------------------------------------
   Context value
   -------------------------------------------------------------------------- */
interface CartContextValue {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

/** Build a local-only CartItem (for guests). */
function makeLocalCartItem(
  variantId: string,
  quantity: number,
  variant?: ProductVariant & { product?: Product }
): CartItem {
  return {
    id: `local_${variantId}`,
    user_id: 'guest',
    variant_id: variantId,
    quantity,
    created_at: new Date().toISOString(),
    variant,
  };
}

function readLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}

/* --------------------------------------------------------------------------
   Provider
   -------------------------------------------------------------------------- */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
  });

  // ---------- hydrate cart on mount ----------
  useEffect(() => {
    async function hydrate() {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Authenticated → fetch from Supabase
        const { data } = await supabase
          .from('cart_items')
          .select(
            '*, variant:product_variants(*, product:products(id, name, slug, image_url, images, pet_type))'
          )
          .eq('user_id', session.user.id);

        dispatch({ type: 'SET_ITEMS', payload: (data as CartItem[]) ?? [] });
      } else {
        // Guest → localStorage
        const localItems = readLocalCart();
        dispatch({ type: 'SET_ITEMS', payload: localItems });

        // Update / refresh variant details for guest items from database
        if (localItems.length > 0) {
          try {
            const updatedItems = await Promise.all(
              localItems.map(async (item) => {
                const { data, error } = await supabase
                  .from('product_variants')
                  .select('*, product:products(id, name, slug, image_url, images, pet_type)')
                  .eq('id', item.variant_id)
                  .single();
                if (!error && data) {
                  return { ...item, variant: data as any };
                }
                return item;
              })
            );
            dispatch({ type: 'SET_ITEMS', payload: updatedItems });
          } catch (err) {
            console.error('Failed to hydrate guest cart details from database:', err);
          }
        }
      }
    }

    hydrate();
  }, []);

  // ---------- persist local cart whenever items change ----------
  useEffect(() => {
    if (!state.isLoading) {
      // Always mirror to localStorage so guest ↔ login sync is easy
      writeLocalCart(state.items);
    }
  }, [state.items, state.isLoading]);

  // ---------- actions ----------
  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if already in cart
        const existing = state.items.find((i) => i.variant_id === variantId);
        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('user_id', session.user.id)
            .eq('variant_id', variantId);
        } else {
          await supabase.from('cart_items').insert({
            user_id: session.user.id,
            variant_id: variantId,
            quantity,
          });
        }

        // Re-fetch to get joined data
        const { data } = await supabase
          .from('cart_items')
          .select(
            '*, variant:product_variants(*, product:products(id, name, slug, image_url, images, pet_type))'
          )
          .eq('user_id', session.user.id);

        dispatch({ type: 'SET_ITEMS', payload: (data as CartItem[]) ?? [] });
      } else {
        // Guest — optimistic local update
        let variantData = undefined;
        try {
          const { data, error } = await supabase
            .from('product_variants')
            .select('*, product:products(id, name, slug, image_url, images, pet_type)')
            .eq('id', variantId)
            .single();
          if (!error && data) {
            variantData = data;
          }
        } catch (err) {
          console.error('Failed to fetch variant details for guest cart item:', err);
        }

        const item = makeLocalCartItem(variantId, quantity, variantData as any);
        dispatch({ type: 'ADD_ITEM', payload: item });
      }
    },
    [state.items]
  );

  const removeItem = useCallback(async (variantId: string) => {
    const supabase = createBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    dispatch({ type: 'REMOVE_ITEM', payload: variantId });

    if (session?.user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id)
        .eq('variant_id', variantId);
    }
  }, []);

  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (quantity < 1) {
        return removeItem(variantId);
      }

      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      dispatch({ type: 'UPDATE_QTY', payload: { variantId, quantity } });

      if (session?.user) {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', session.user.id)
          .eq('variant_id', variantId);
      }
    },
    [removeItem]
  );

  const clearCart = useCallback(async () => {
    const supabase = createBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    dispatch({ type: 'CLEAR' });
    writeLocalCart([]);

    if (session?.user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);
    }
  }, []);

  // ---------- derived ----------
  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce((sum, i) => {
        const price = i.variant?.price ?? 0;
        return sum + price * i.quantity;
      }, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      isLoading: state.isLoading,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      state.items,
      state.isLoading,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* --------------------------------------------------------------------------
   Hook
   -------------------------------------------------------------------------- */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
