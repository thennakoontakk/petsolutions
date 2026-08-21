/**
 * Convert an arbitrary string to a URL-safe slug.
 *
 * - Lowercases
 * - Replaces accented chars with ASCII equivalents
 * - Strips non-alphanumeric characters (except hyphens)
 * - Collapses multiple hyphens
 * - Trims leading/trailing hyphens
 *
 * @example
 * slugify("Royal Canin  — Adult (Cat)") // => "royal-canin-adult-cat"
 * slugify("Premium Dog Food 3.5kg")     // => "premium-dog-food-3-5kg"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')    // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[&]/g, '-and-')           // & → "and"
    .replace(/[+]/g, '-plus-')          // + → "plus"
    .replace(/[^a-z0-9\s-]/g, '')       // remove non-alphanumeric
    .replace(/[\s_]+/g, '-')            // spaces / underscores → hyphens
    .replace(/-+/g, '-')               // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');          // trim hyphens from ends
}
