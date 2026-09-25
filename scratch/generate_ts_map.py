import urllib.request
import json
import os

req = urllib.request.Request(
    'https://jnakxlejkmyptoffvhsa.supabase.co/rest/v1/products?select=id,name,slug,image_url',
    headers={
        'apikey': 'sb_publishable_bdZoe5MN7YgLgfS5dnZCdg_L2Y1PqFB',
        'Authorization': 'Bearer sb_publishable_bdZoe5MN7YgLgfS5dnZCdg_L2Y1PqFB'
    }
)
with urllib.request.urlopen(req) as resp:
    db_prods = json.loads(resp.read().decode('utf-8'))

with open(r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\scratch\upload_report.json', 'r', encoding='utf-8') as f:
    upload_data = json.load(f)

u_prods = upload_data['products']
report_by_id = {p['id']: p for p in u_prods}
report_by_slug = {p['slug']: p for p in u_prods}

mapping_entries = []
old_path_entries = []

for p in db_prods:
    up = report_by_id.get(p['id']) or report_by_slug.get(p['slug'])
    if not up:
        continue
    
    slug = p['slug']
    pid = p['id']
    primary = up['primary_url']
    gallery = up['gallery_urls']
    old_img = p.get('image_url')
    
    mapping_entries.append({
        'slug': slug,
        'id': pid,
        'name': p['name'],
        'image_url': primary,
        'images': gallery
    })
    
    if old_img and old_img.startswith('/images/'):
        old_path_entries.append((old_img, primary))

lines = [
    "// Generated automatically - maps all products to their 2K Supabase Storage URLs",
    "export interface ProductImageEntry {",
    "  image_url: string;",
    "  images: string[];",
    "}",
    "",
    "export const PRODUCT_IMAGE_MAP: Record<string, ProductImageEntry> = {"
]

for m in mapping_entries:
    slug = m['slug']
    pid = m['id']
    prim = m['image_url']
    gals = json.dumps(m['images'])
    lines.append(f"  '{slug}': {{")
    lines.append(f"    image_url: '{prim}',")
    lines.append(f"    images: {gals},")
    lines.append("  },")
    lines.append(f"  '{pid}': {{")
    lines.append(f"    image_url: '{prim}',")
    lines.append(f"    images: {gals},")
    lines.append("  },")

lines.append("};")
lines.append("")
lines.append("export const OLD_IMAGE_PATH_MAP: Record<string, string> = {")

for old_p, new_p in old_path_entries:
    lines.append(f"  '{old_p}': '{new_p}',")
    # Also add without leading slash just in case
    if old_p.startswith('/'):
        lines.append(f"  '{old_p[1:]}': '{new_p}',")

lines.append("};")
lines.append("")
lines.append("/**")
lines.append(" * Normalizes any product so it always has valid high-res Supabase Storage URLs")
lines.append(" */")
lines.append("export function resolveProductImage<T extends { id?: string; slug?: string; image_url?: string | null; images?: string[] }>(product: T): T {")
lines.append("  if (!product) return product;")
lines.append("")
lines.append("  // If already a valid remote Supabase CDN url, return as-is")
lines.append("  if (product.image_url && product.image_url.startsWith('http') && product.image_url.includes('supabase.co')) {")
lines.append("    return product;")
lines.append("  }")
lines.append("")
lines.append("  const match = (product.slug && PRODUCT_IMAGE_MAP[product.slug]) ||")
lines.append("                (product.id && PRODUCT_IMAGE_MAP[product.id]) ||")
lines.append("                (product.image_url && OLD_IMAGE_PATH_MAP[product.image_url] ? { image_url: OLD_IMAGE_PATH_MAP[product.image_url], images: [OLD_IMAGE_PATH_MAP[product.image_url]] } : null);")
lines.append("")
lines.append("  if (match) {")
lines.append("    return {")
lines.append("      ...product,")
lines.append("      image_url: match.image_url,")
lines.append("      images: (product.images && product.images.length > 0 && product.images[0].startsWith('http'))")
lines.append("        ? product.images")
lines.append("        : match.images,")
lines.append("    };")
lines.append("  }")
lines.append("")
lines.append("  return product;")
lines.append("}")

target_file = r'c:\Users\thenn\OneDrive\Desktop\PetSolutions.lk\petsolutions-app\src\lib\data\productImageMap.ts'
os.makedirs(os.path.dirname(target_file), exist_ok=True)
with open(target_file, 'w', encoding='utf-8') as out:
    out.write("\n".join(lines) + "\n")

print(f"Generated {target_file} successfully with {len(mapping_entries)} products!")
