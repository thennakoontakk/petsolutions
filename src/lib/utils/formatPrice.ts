/**
 * Format a numeric price to Sri Lankan Rupee display format.
 *
 * @example
 * formatPrice(12800)    // => "Rs. 12,800.00"
 * formatPrice(0)        // => "Rs. 0.00"
 * formatPrice(1500.5)   // => "Rs. 1,500.50"
 */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format price without decimals — useful for badges and compact displays.
 *
 * @example
 * formatPriceShort(12800) // => "Rs. 12,800"
 */
export function formatPriceShort(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Calculate percentage discount between compare-at and current price.
 *
 * @example
 * calcDiscount(2000, 1500) // => 25
 */
export function calcDiscount(compareAt: number, price: number): number {
  if (compareAt <= 0 || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
