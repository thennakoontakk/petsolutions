/* ==========================================================================
   PetSolutions.lk — Core Type Definitions
   ========================================================================== */

/** Supported pet types throughout the platform */
export type PetType = 'Cat' | 'Dog' | 'Cat/Dog';

/* --------------------------------------------------------------------------
   Category
   -------------------------------------------------------------------------- */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_category: PetType;
  display_order: number;
  created_at: string;
}

/* --------------------------------------------------------------------------
   Product & Variants
   -------------------------------------------------------------------------- */
export interface ProductVariant {
  id: string;
  product_id: string;
  size_label: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  sku: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  pet_type: PetType;
  brand: string | null;
  image_url: string | null;
  images: string[];
  /** Veterinary & clinical information */
  ingredients?: string | null;
  indications?: string | null;
  directions?: string | null;
  packaging?: string | null;
  storage_safety?: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  /** Joined from categories table */
  category?: Category;
  /** Joined from product_variants table */
  variants?: ProductVariant[];
}

/* --------------------------------------------------------------------------
   Offers / Promotions
   -------------------------------------------------------------------------- */
export type DiscountType = 'percentage' | 'fixed';
export type OfferAppliesTo = 'all' | 'category' | 'product';

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number | null;
  code: string | null;
  applies_to: OfferAppliesTo;
  target_id: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

/* --------------------------------------------------------------------------
   Orders
   -------------------------------------------------------------------------- */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_label: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;

  /** Joined from order_items table */
  items?: OrderItem[];
}

/* --------------------------------------------------------------------------
   Cart
   -------------------------------------------------------------------------- */
export interface CartItem {
  id: string;
  user_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;

  /** Joined variant with nested product */
  variant?: ProductVariant & {
    product?: Product;
  };
}

/* --------------------------------------------------------------------------
   User / Profile
   -------------------------------------------------------------------------- */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  is_admin: boolean;
  created_at: string;
}

/* --------------------------------------------------------------------------
   Utility / Helper Types
   -------------------------------------------------------------------------- */

/** For paginated API responses */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Common API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/** Cart context state shape used by the useCart hook */
export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

/** Auth context state shape used by the useAuth hook */
export interface AuthState {
  user: import('@supabase/supabase-js').User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
}
