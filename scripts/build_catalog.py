import json
import os
import re
import pandas as pd
import openpyxl

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

SHOPIFY_CACHE = os.path.join(SCRIPT_DIR, 'shopify_live_products.json')
EXCEL_PRODUCT_PATH = r'C:\Users\aashi\Downloads\Location SummaryFINAL (1).xlsx'
EXCEL_LISTINGS_PATH = r'C:\Users\aashi\Downloads\playR Website listings - sport.xlsx'
OUTPUT_TS_PATH = os.path.join(PROJECT_ROOT, 'apps', 'playr', 'src', 'lib', 'sku-catalog.ts')
BLUORNG_DATA_PATH = os.path.join(PROJECT_ROOT, 'apps', 'playr', 'src', 'lib', 'bluorng-data.ts')

def slugify(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_str(val):
    if pd.isna(val) or val is None:
        return ''
    s = str(val).strip()
    s = s.replace('\ufffd', "'").replace('’', "'").replace('‘', "'")
    s = s.replace('\r\n', '\n').replace('\r', '\n')
    return s

def clean_title(val):
    s = clean_str(val)
    if s.isupper() and len(s) > 4:
        s = s.title()
    return s

# Load live shopify products
shopify_prods = []
if os.path.exists(SHOPIFY_CACHE):
    with open(SHOPIFY_CACHE, 'r', encoding='utf-8') as f:
        shopify_prods = json.load(f)

shopify_by_sku = {}
shopify_by_title = {}
shopify_by_handle = {}

for p in shopify_prods:
    h = p.get('handle', '').lower()
    if h:
        shopify_by_handle[h] = p
    t = clean_str(p.get('title', '')).lower()
    if t:
        shopify_by_title[t] = p
    for v in p.get('variants', []):
        sku = clean_str(v.get('sku')).lower()
        if sku:
            shopify_by_sku[sku] = p

# Read existing bluorng-data.ts to preserve handcrafted image URLs
existing_images_by_handle = {}
if os.path.exists(BLUORNG_DATA_PATH):
    with open(BLUORNG_DATA_PATH, 'r', encoding='utf-8') as f:
        existing_ts = f.read()
    for block in re.finditer(r'handle:\s*[\'"]([^\'"]+)[\'"].*?images:\s*\[(.*?)\]', existing_ts, re.DOTALL):
        h = block.group(1).lower()
        raw_imgs = block.group(2)
        urls = []
        for line in raw_imgs.split('\n'):
            line = line.strip().strip(',')
            if line.startswith(('\'', '"')):
                urls.append(line.strip('\'"'))
            elif line.startswith('img('):
                m = re.search(r'img\([\'"]([^\'"]+)[\'"]\)', line)
                if m:
                    urls.append(f"https://cdn.shopify.com/s/files/1/0679/5939/0427/files/{m.group(1)}")
        if urls:
            existing_images_by_handle[h] = urls

print(f"Loaded {len(existing_images_by_handle)} existing handle image mappings.")

# Load product Excel
df = pd.read_excel(EXCEL_PRODUCT_PATH)
print(f"Loaded {len(df)} rows from {EXCEL_PRODUCT_PATH}")

# Function mapping to slugs
FUNCTION_MAPPING = {
    'gym fitness yoga': ['gym-fitness-yoga', 'fitness-gym-yoga'],
    'running and training': ['running-training'],
    'cricket': ['cricket'],
    'cycling': ['cycling'],
    'lifestyle after sports': ['lifestyle-after-sports'],
    'kabbadi': ['kabaddi'],
    'kabaddi': ['kabaddi'],
    'football': ['football'],
    'pickleball': ['pickleball'],
    'swimming': ['swimming'],
    'outdoor and adventure': ['outdoor-adventure'],
    'golf': ['golf'],
    'home and office': ['home-office'],
    'basketball': ['basketball'],
}

BRAND_MAPPING = {
    'playr': 'playr',
    'playr street': 'playr-street',
    'playr x chennai super kings': 'chennai-super-kings',
    'playr x lucknow super giants': 'lucknow-super-giants',
    'playr x seattle orcas': 'seattle-orcas',
    'playr x sunrisers hyderabad': 'sunrisers-hyderabad',
    'playr x up yoddha': 'up-yoddha',
    'playr x up yoddhas': 'up-yoddha',
}

# Group variants by Article Code (fallback to Style Code, then SKU)
products_dict = {}

for _, row in df.iterrows():
    art = clean_str(row.get('Article Code'))
    style = clean_str(row.get('Style Code'))
    sku = clean_str(row.get('SKU'))
    code = art if art else (style if style else sku)
    if not code:
        continue
    
    handle = slugify(code)
    
    brand = clean_str(row.get('Brand'))
    func_str = clean_str(row.get('Function Sport'))
    if not func_str and ('SO' in sku or 'SEATTLE' in brand.upper()):
        func_str = 'CRICKET, RUNNING and TRAINING, Lifestyle After Sports'

    avail_qty = 0
    try:
        raw_qty = row.get('Available Qty')
        if pd.notna(raw_qty):
            avail_qty = int(float(raw_qty))
    except:
        avail_qty = 0
    
    if handle not in products_dict:
        # Collect base fields
        title = clean_title(row.get('Title'))
        cat1 = clean_str(row.get('Category 1'))
        cat2 = clean_str(row.get('Category 2'))
        cat3 = clean_str(row.get('Category 3'))
        gender = clean_str(row.get('Gender'))
        age = clean_str(row.get('Age group'))
        
        mrp_raw = row.get('MRP')
        price = 0
        try:
            if pd.notna(mrp_raw):
                price = int(float(mrp_raw))
        except:
            price = 999
        
        desc = clean_str(row.get('Description'))
        
        bullets = []
        for i in range(1, 6):
            bp = clean_str(row.get(f'Bullet Point {i}'))
            if bp and bp != 'nan':
                bullets.append(bp)
        
        drive_link = clean_str(row.get('Google Drive Link'))
        
        products_dict[handle] = {
            'handle': handle,
            'code': code,
            'style_code': style,
            'title': title,
            'price': price,
            'compareAt': None,
            'cat1': cat1,
            'cat2': cat2,
            'cat3': cat3,
            'function_raw': func_str,
            'brand': brand,
            'gender': gender,
            'age': age,
            'description': desc,
            'details': bullets,
            'drive_link': drive_link,
            'colors': set(),
            'sizes': set(),
            'skus': set(),
            'total_available': 0
        }
    
    products_dict[handle]['total_available'] += avail_qty

    col = clean_str(row.get('Colour'))
    if col and col != 'nan':
        products_dict[handle]['colors'].add(col)
    
    sz = clean_str(row.get('Size'))
    if sz and sz != 'nan':
        products_dict[handle]['sizes'].add(sz)

    s = clean_str(row.get('SKU'))
    if s and s != 'nan':
        products_dict[handle]['skus'].add(s)

print(f"Aggregated {len(products_dict)} distinct products.")

# Build BluorngProduct items
output_products = []

for handle, p in products_dict.items():
    # Determine type
    if p['cat3']:
        ptype = p['cat3'].title()
    elif p['cat2']:
        ptype = p['cat2'].title()
    elif p['cat1']:
        ptype = p['cat1'].title()
    else:
        ptype = 'Apparel'
    
    # Collections list
    collections_set = set()
    collections_set.add('all-products')
    
    # Primary Category
    if p['cat1']:
        collections_set.add(slugify(p['cat1']))
    # Subcategory 2
    if p['cat2']:
        collections_set.add(slugify(p['cat2']))
    # Subcategory 3
    if p['cat3']:
        collections_set.add(slugify(p['cat3']))
    
    # Brand
    brand_key = p['brand'].lower()
    if brand_key in BRAND_MAPPING:
        collections_set.add(BRAND_MAPPING[brand_key])
    if p['brand']:
        collections_set.add(slugify(p['brand']))
    
    # Function Sport
    if p['function_raw']:
        for raw_f, slugs in FUNCTION_MAPPING.items():
            if raw_f in p['function_raw'].lower():
                for s in slugs:
                    collections_set.add(s)
    
    # Gender
    if p['gender']:
        g_lower = p['gender'].lower()
        if 'men' in g_lower and 'women' not in g_lower:
            collections_set.add('men')
        elif 'women' in g_lower:
            collections_set.add('women')
        elif 'unisex' in g_lower:
            collections_set.add('unisex')
            collections_set.add('men')
            collections_set.add('women')
        elif 'boy' in g_lower:
            collections_set.add('boys')
            collections_set.add('kids')
        elif 'girl' in g_lower:
            collections_set.add('girls')
            collections_set.add('kids')
    
    # Age group
    if p['age']:
        a_lower = p['age'].lower()
        if 'kid' in a_lower:
            collections_set.add('kids')
        elif 'adult' in a_lower:
            collections_set.add('adult')
    
    # Match Images
    images = []
    
    # 1. Existing manually verified handle image
    if handle in existing_images_by_handle:
        images = existing_images_by_handle[handle]
    
    # 2. Check Shopify by variant SKU
    if not images:
        for sku_val in p['skus']:
            if sku_val.lower() in shopify_by_sku:
                shop_prod = shopify_by_sku[sku_val.lower()]
                imgs = [img['src'] for img in shop_prod.get('images', []) if img.get('src')]
                if imgs:
                    images = imgs
                    break
    
    # 3. Check Shopify by code / style / handle
    if not images:
        if p['code'].lower() in shopify_by_sku:
            shop_prod = shopify_by_sku[p['code'].lower()]
            images = [img['src'] for img in shop_prod.get('images', []) if img.get('src')]
        elif p['style_code'].lower() in shopify_by_sku:
            shop_prod = shopify_by_sku[p['style_code'].lower()]
            images = [img['src'] for img in shop_prod.get('images', []) if img.get('src')]
        elif handle in shopify_by_handle:
            shop_prod = shopify_by_handle[handle]
            images = [img['src'] for img in shop_prod.get('images', []) if img.get('src')]
        elif p['title'].lower() in shopify_by_title:
            shop_prod = shopify_by_title[p['title'].lower()]
            images = [img['src'] for img in shop_prod.get('images', []) if img.get('src')]
    
    is_placeholder = False
    if not images:
        # Fallback to category hero image or generic placeholder
        is_placeholder = True
        images = [
            'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214'
        ]
    
    is_sold_out = p['total_available'] <= 0

    item = {
        'handle': handle,
        'title': p['title'],
        'price': p['price'],
        'compareAt': None,
        'type': ptype,
        'collections': sorted(list(collections_set)),
        'images': images,
        'description': p['description'] if p['description'] else f"{p['title']} by playR.",
        'details': p['details'] if p['details'] else [p['title']],
        'colors': sorted(list(p['colors'])) if p['colors'] else None,
        'sizes': sorted(list(p['sizes'])) if p['sizes'] else None,
        'soldOut': True if is_sold_out else None,
        'placeholder': is_placeholder if is_placeholder else None
    }
    output_products.append(item)

print(f"Generated {len(output_products)} products.")
matched_images_count = sum(1 for p in output_products if not p.get('placeholder'))
print(f"Products with real images: {matched_images_count} / {len(output_products)}")

# Write sku-catalog.ts
lines = []
lines.append("// Generated playR full product catalog from 'Location SummaryFINAL (1).xlsx'")
lines.append("// Conforming to 'playR Website listings - sport.xlsx' taxonomy")
lines.append("import { BluorngProduct } from './bluorng-data';\n")
lines.append("export const skuCatalog: BluorngProduct[] = [")

for p in output_products:
    lines.append("  {")
    lines.append(f"    handle: {json.dumps(p['handle'])},")
    lines.append(f"    title: {json.dumps(p['title'])},")
    lines.append(f"    price: {p['price']}, compareAt: null,")
    lines.append(f"    type: {json.dumps(p['type'])},")
    lines.append(f"    collections: {json.dumps(p['collections'])},")
    lines.append(f"    images: {json.dumps(p['images'])},")
    if p.get('colors'):
        lines.append(f"    colors: {json.dumps(p['colors'])},")
    if p.get('sizes'):
        lines.append(f"    sizes: {json.dumps(p['sizes'])},")
    if p.get('soldOut'):
        lines.append("    soldOut: true,")
    if p.get('placeholder'):
        lines.append("    placeholder: true,")
    lines.append(f"    description: {json.dumps(p['description'])},")
    lines.append(f"    details: {json.dumps(p['details'])},")
    lines.append("  },")

lines.append("];\n")

with open(OUTPUT_TS_PATH, 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print(f"Wrote catalog to {OUTPUT_TS_PATH}")
