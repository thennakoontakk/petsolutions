import type { CartItem, CartItemDealMetadata, DealType } from '@/lib/types';

export interface ParsedDealInfo {
  deal_type: DealType;
  buyQty: number;
  freeQty: number;
  percentage?: number;
  dealPrice?: number;
  label: string;
}

/**
 * Parses promotional offer text (e.g. "Buy 1 get 1 FREE", "20% OFF")
 * and deal_price overrides into structured deal instructions.
 */
export function parseDealOffer(
  offerLabel?: string | null,
  dealPrice?: number | null
): ParsedDealInfo | null {
  const hasCustomPrice = Boolean(dealPrice && Number(dealPrice) > 0);
  const cleanLabel = (offerLabel || '').trim();

  // If deal_price override is set
  if (hasCustomPrice) {
    return {
      deal_type: 'custom_price',
      dealPrice: Number(dealPrice),
      buyQty: 1,
      freeQty: 0,
      label: cleanLabel || 'Special Deal Price',
    };
  }

  if (!cleanLabel) return null;

  // Check "Buy X Get Y Free" pattern (e.g. "Buy 1 get 1 FREE", "Buy 1 get 2 FREE", "Buy 2 get 1 FREE")
  const bogoMatch = cleanLabel.match(/buy\s+(\d+)\s+get\s+(\d+)\s+free/i);
  if (bogoMatch) {
    const buyQty = Math.max(1, parseInt(bogoMatch[1], 10));
    const freeQty = Math.max(1, parseInt(bogoMatch[2], 10));
    return {
      deal_type: 'bogo',
      buyQty,
      freeQty,
      label: cleanLabel,
    };
  }

  // Check percentage discount pattern: e.g. "20% off", "30% OFF"
  const pctMatch = cleanLabel.match(/(\d+)\s*%\s*(?:off|discount)?/i);
  if (pctMatch) {
    const percentage = Math.min(100, Math.max(1, parseInt(pctMatch[1], 10)));
    return {
      deal_type: 'percentage',
      percentage,
      buyQty: 1,
      freeQty: 0,
      label: cleanLabel,
    };
  }

  return {
    deal_type: 'custom_price',
    buyQty: 1,
    freeQty: 0,
    label: cleanLabel,
  };
}

export interface LineItemPriceCalculation {
  unitRegularPrice: number;
  unitEffectivePrice: number;
  grossLineTotal: number;
  lineDiscount: number;
  netLineTotal: number;
  freeItemsCount: number;
  dealTag: string | null;
}

/**
 * Computes the gross price, promotional savings, and net total for a single cart item.
 */
export function calculateLineItemPricing(item: CartItem): LineItemPriceCalculation {
  const regularPrice = Number(item.variant?.price || 0);
  const qty = Number(item.quantity) || 0;
  const grossLineTotal = regularPrice * qty;

  if (qty <= 0 || regularPrice <= 0) {
    return {
      unitRegularPrice: regularPrice,
      unitEffectivePrice: regularPrice,
      grossLineTotal: 0,
      lineDiscount: 0,
      netLineTotal: 0,
      freeItemsCount: 0,
      dealTag: null,
    };
  }

  // 1. Custom Deal Price Override
  if (
    item.applied_deal_price &&
    Number(item.applied_deal_price) > 0 &&
    Number(item.applied_deal_price) < regularPrice
  ) {
    const dealPrice = Number(item.applied_deal_price);
    const lineDiscount = Math.max(0, (regularPrice - dealPrice) * qty);
    const netLineTotal = Math.max(0, grossLineTotal - lineDiscount);
    return {
      unitRegularPrice: regularPrice,
      unitEffectivePrice: dealPrice,
      grossLineTotal,
      lineDiscount,
      netLineTotal,
      freeItemsCount: 0,
      dealTag: item.deal_label || 'Special Deal Price',
    };
  }

  // 2. BOGO Promotion (Buy X Get Y Free)
  if (item.deal_type === 'bogo' && item.deal_label) {
    const parsed = parseDealOffer(item.deal_label, item.applied_deal_price);
    if (parsed && parsed.deal_type === 'bogo') {
      const bundleSize = parsed.buyQty + parsed.freeQty; // e.g. 1 + 1 = 2, or 1 + 2 = 3
      const completedBundles = Math.floor(qty / bundleSize);
      const freeItemsCount = completedBundles * parsed.freeQty;

      if (freeItemsCount > 0) {
        const lineDiscount = Math.min(grossLineTotal, freeItemsCount * regularPrice);
        const netLineTotal = Math.max(0, grossLineTotal - lineDiscount);
        const unitEffectivePrice = qty > 0 ? netLineTotal / qty : regularPrice;

        return {
          unitRegularPrice: regularPrice,
          unitEffectivePrice,
          grossLineTotal,
          lineDiscount,
          netLineTotal,
          freeItemsCount,
          dealTag: `${item.deal_label} (${freeItemsCount} Free)`,
        };
      }
    }
  }

  // 3. Percentage Discount
  if (item.deal_type === 'percentage' && item.deal_label) {
    const parsed = parseDealOffer(item.deal_label, item.applied_deal_price);
    if (parsed?.percentage && parsed.percentage > 0) {
      const discountRatio = parsed.percentage / 100;
      const unitDiscount = regularPrice * discountRatio;
      const lineDiscount = unitDiscount * qty;
      const netLineTotal = Math.max(0, grossLineTotal - lineDiscount);
      return {
        unitRegularPrice: regularPrice,
        unitEffectivePrice: regularPrice - unitDiscount,
        grossLineTotal,
        lineDiscount,
        netLineTotal,
        freeItemsCount: 0,
        dealTag: item.deal_label,
      };
    }
  }

  // Regular item without active promotions
  return {
    unitRegularPrice: regularPrice,
    unitEffectivePrice: regularPrice,
    grossLineTotal,
    lineDiscount: 0,
    netLineTotal: grossLineTotal,
    freeItemsCount: 0,
    dealTag: null,
  };
}

export interface CartTotalsCalculation {
  subtotal: number;
  promotionalDiscount: number;
  finalSubtotal: number;
  deliveryFee: number;
  finalTotal: number;
  freeDeliveryThreshold: number;
  amountUntilFreeDelivery: number;
}

/**
 * Calculates complete cart financial totals across all items.
 */
export function calculateCartTotals(
  items: CartItem[],
  freeDeliveryThreshold = 10000,
  standardDeliveryFee = 450
): CartTotalsCalculation {
  let subtotal = 0;
  let promotionalDiscount = 0;

  for (const item of items) {
    const calc = calculateLineItemPricing(item);
    subtotal += calc.grossLineTotal;
    promotionalDiscount += calc.lineDiscount;
  }

  const finalSubtotal = Math.max(0, subtotal - promotionalDiscount);
  const deliveryFee = finalSubtotal > 0 && finalSubtotal >= freeDeliveryThreshold ? 0 : (finalSubtotal > 0 ? standardDeliveryFee : 0);
  const finalTotal = Math.max(0, finalSubtotal + deliveryFee);
  const amountUntilFreeDelivery = Math.max(0, freeDeliveryThreshold - finalSubtotal);

  return {
    subtotal,
    promotionalDiscount,
    finalSubtotal,
    deliveryFee,
    finalTotal,
    freeDeliveryThreshold,
    amountUntilFreeDelivery,
  };
}
