import zipfile
import io
import csv
import re
import html
import os
import json

CSV_ZIP_PATH = r"C:\Users\aashi\Downloads\products_export_1.zip"
THEME_ZIP_PATH = r"C:\Users\aashi\Downloads\theme_export__playr-in-copy-of-playr-main-by-dbdev__25SEP2026-0909am.zip"
OUTPUT_TS_PATH = r"apps\playr\src\lib\sku-catalog.ts"
BLUORNG_DATA_PATH = r"apps\playr\src\lib\bluorng-data.ts"

def clean_copy_title(title):
    if not title:
        return ""
    t = html.unescape(title)
    # Fix broken Unicode encoding artifacts
    t = t.replace('\ufffd', "'").replace('\u00a0', ' ')
    t = re.sub(r'[\u2018\u2019]', "'", t)
    t = re.sub(r'[\u201c\u201d]', '"', t)
    t = re.sub(r'[\u2013\u2014]', ' – ', t)
    t = re.sub(r'\s+', ' ', t).strip()

    # Brand nomenclature: strictly 'playR'
    t = re.sub(r'\bplayr\b', 'playR', t, flags=re.IGNORECASE)
    t = re.sub(r'\bPLAYR\b', 'playR', t)

    # Remove clumsy repetitive marketplace title spam
    t = re.sub(r'\s*[-–—]\s*(?:Lightweight|Durable|Breathable|Comfortable|Multipurpose|All Season|Comfort Fit|Daily Use|For Men & Women|For Men|For Women|For Kids|For Adult|Official Merchandise).*$', '', t, flags=re.IGNORECASE)
    t = re.sub(r'\s*[-–—]\s*(?:For Gym Training|For Running|For Sports|For Outdoor Activities|For Travel Use|Daily Use).*$', '', t, flags=re.IGNORECASE)

    # Remove awkward stuttering repetitions (e.g. 'Pack of 3 Pack of 3', 'T-Shirt T-Shirt')
    t = re.sub(r'\b(Pack of \d+)\s+\1\b', r'\1', t, flags=re.IGNORECASE)
    t = re.sub(r'\b(T-Shirt|Tee)\s+\1\b', r'\1', t, flags=re.IGNORECASE)
    t = re.sub(r'\b(Cap)\s+\1\b', r'\1', t, flags=re.IGNORECASE)

    # Clean double dashes and trailing punctuation
    t = re.sub(r'\s*[-–—]\s*[-–—]\s*', ' – ', t)
    t = re.sub(r'\s*[-–—]\s*$', '', t).strip()
    t = re.sub(r'[,;]\s*$', '', t).strip()
    return t

def clean_copy_description(raw_html):
    if not raw_html:
        return "", []
    text = html.unescape(raw_html)

    # Extract bullet points from list items if present
    list_items = re.findall(r'<li[^>]*>(.*?)</li>', text, flags=re.DOTALL | re.IGNORECASE)
    cleaned_bullets = []
    for item in list_items:
        clean = re.sub(r'<[^>]+>', ' ', item)
        clean = clean.replace('\ufffd', "'").replace('&nbsp;', ' ')
        clean = re.sub(r'\s+', ' ', clean).strip()
        # Remove leading checkmarks/bullets
        clean = re.sub(r'^[✔️•\-\*\s]+', '', clean).strip()
        if clean and len(clean) > 4:
            cleaned_bullets.append(clean)

    # Convert paragraphs and breaks
    clean_body = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    clean_body = re.sub(r'</p>', '\n\n', clean_body, flags=re.IGNORECASE)
    clean_body = re.sub(r'<[^>]+>', ' ', clean_body)
    clean_body = clean_body.replace('\ufffd', "'").replace('&nbsp;', ' ')
    clean_body = re.sub(r'[ \t]+', ' ', clean_body)
    clean_body = re.sub(r'\n{3,}', '\n\n', clean_body).strip()

    # If no bullet points in HTML, extract sentences as feature bullets
    if not cleaned_bullets and clean_body:
        sentences = [s.strip() for s in clean_body.split('. ') if len(s.strip()) > 15]
        cleaned_bullets = sentences[:5]

    return clean_body, cleaned_bullets

def slugify(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def determine_collections(tags_str, p_type, title, vendor):
    tags = [t.strip().lower() for t in tags_str.split(',') if t.strip()]
    full_text = f"{title} {p_type} {vendor} {tags_str}".lower()
    cols = set()

    # Always in shop-all and new-in
    cols.add('shop-all')
    cols.add('all-products')

    # Functions / Sports
    if any(k in full_text for k in ['swim', 'goggle', 'pool', 'diving']):
        cols.add('swimming')
    if any(k in full_text for k in ['cricket', 'csk', 'srh', 'lsg', 'bat', 'willow', 'wicket']):
        cols.add('cricket')
    if any(k in full_text for k in ['pickleball', 'paddle']):
        cols.add('pickleball')
    if any(k in full_text for k in ['gym', 'yoga', 'fitness', 'workout', 'resistance band']):
        cols.add('gym-fitness-yoga')
    if any(k in full_text for k in ['running', 'marathon', 'jogging', 'training', 'activewear']):
        cols.add('running-training')
    if any(k in full_text for k in ['cycling', 'cycle']):
        cols.add('cycling')
    if any(k in full_text for k in ['football', 'soccer']):
        cols.add('football')
    if any(k in full_text for k in ['golf']):
        cols.add('golf')
    if any(k in full_text for k in ['outdoor', 'adventure', 'trekking', 'camping']):
        cols.add('outdoor-adventure')
    if any(k in full_text for k in ['lifestyle', 'casual']):
        cols.add('lifestyle-after-sports')

    # Brands
    v_low = vendor.lower()
    if 'chennai' in v_low or 'csk' in full_text:
        cols.add('chennai-super-kings')
    elif 'lucknow' in v_low or 'lsg' in full_text:
        cols.add('lucknow-super-giants')
    elif 'sunrisers' in v_low or 'srh' in full_text:
        cols.add('sunrisers-hyderabad')
    elif 'seattle' in v_low or 'orcas' in full_text:
        cols.add('seattle-orcas')
    elif 'yoddha' in v_low:
        cols.add('up-yoddha')
    elif 'mumbai indians' in v_low:
        cols.add('mumbai-indians')
    elif 'rajasthan' in v_low:
        cols.add('rajasthan-royals')
    elif 'punjab' in v_low:
        cols.add('punjab-kings')
    elif 'kolkata' in v_low:
        cols.add('kolkata-knight-riders')
    elif 'street' in full_text:
        cols.add('playr-street')
    else:
        cols.add('playr')

    # Categories
    if any(k in full_text for k in ['t-shirt', 'tee', 'polo', 'jersey', 'singlet', 'top', 'hoodie', 'jacket']):
        cols.add('topwear')
    if any(k in full_text for k in ['short', 'pant', 'jogger', 'trouser', 'tights', 'trackpant']):
        cols.add('bottomwear')
    if any(k in full_text for k in ['cap', 'hat', 'headwear']):
        cols.add('caps')
        cols.add('headwear')
    if any(k in full_text for k in ['backpack', 'bag', 'duffle', 'kitbag', 'sling']):
        cols.add('bag')
        cols.add('accessories')
    if any(k in full_text for k in ['sipper', 'shaker', 'bottle', 'mug']):
        cols.add('drinkware')
        cols.add('accessories')
    if any(k in full_text for k in ['sock', 'socks']):
        cols.add('accessories')

    # Demographics
    if 'women' in full_text or 'womens' in full_text:
        cols.add('women')
    elif 'kids' in full_text or 'junior' in full_text or 'boys' in full_text or 'girls' in full_text:
        cols.add('kids')
    elif 'men' in full_text or 'mens' in full_text:
        cols.add('men')
    else:
        cols.add('unisex')

    return sorted(list(cols))

def main():
    print(f"Reading Shopify product export: {CSV_ZIP_PATH}...")
    zf = zipfile.ZipFile(CSV_ZIP_PATH)
    with zf.open('products_export_1.csv') as f:
        wrapper = io.TextIOWrapper(f, encoding='utf-8')
        reader = csv.reader(wrapper)
        headers = next(reader)

        h_idx = headers.index('Handle')
        t_idx = headers.index('Title')
        b_idx = headers.index('Body (HTML)')
        v_idx = headers.index('Vendor')
        type_idx = headers.index('Type')
        tags_idx = headers.index('Tags')
        status_idx = headers.index('Status')
        sku_idx = headers.index('Variant SKU')
        price_idx = headers.index('Variant Price')
        compare_idx = headers.index('Variant Compare At Price')
        opt1_val_idx = headers.index('Option1 Value')
        opt2_val_idx = headers.index('Option2 Value')
        img_idx = headers.index('Image Src')
        seo_title_idx = headers.index('SEO Title')
        seo_desc_idx = headers.index('SEO Description')

        products = {}
        current_handle = None

        for r in reader:
            h = r[h_idx]
            if h:
                current_handle = h
                if h not in products:
                    products[h] = {
                        'handle': h,
                        'title': r[t_idx],
                        'body_html': r[b_idx],
                        'vendor': r[v_idx],
                        'type': r[type_idx] or 'Sportswear',
                        'tags': r[tags_idx],
                        'status': r[status_idx].lower() if status_idx < len(r) else '',
                        'seo_title': r[seo_title_idx] if seo_title_idx < len(r) else '',
                        'seo_desc': r[seo_desc_idx] if seo_desc_idx < len(r) else '',
                        'variants': [],
                        'images': [],
                        'sizes': set(),
                        'colors': set(),
                        'min_price': None,
                        'compare_price': None,
                    }

            if not current_handle:
                continue

            prod = products[current_handle]
            sku = r[sku_idx] if sku_idx < len(r) else ''
            price_str = r[price_idx] if price_idx < len(r) else ''
            comp_str = r[compare_idx] if compare_idx < len(r) else ''
            opt1 = r[opt1_val_idx] if opt1_val_idx < len(r) else ''
            opt2 = r[opt2_val_idx] if opt2_val_idx < len(r) else ''
            img_url = r[img_idx] if img_idx < len(r) else ''

            if price_str:
                try:
                    p_val = float(price_str)
                    if prod['min_price'] is None or p_val < prod['min_price']:
                        prod['min_price'] = p_val
                except:
                    pass
            if comp_str:
                try:
                    c_val = float(comp_str)
                    if prod['compare_price'] is None or c_val > prod['compare_price']:
                        prod['compare_price'] = c_val
                except:
                    pass

            if opt1 and opt1 != 'Default Title':
                prod['sizes'].add(opt1)
            if opt2 and opt2 != 'Default Title':
                prod['colors'].add(opt2)

            if img_url and img_url not in prod['images']:
                prod['images'].append(img_url)

    print(f"Total raw products in export: {len(products)}")

    # Filter to active or valid products with images and price
    clean_catalog = []
    skipped_no_img = 0

    for h, p in products.items():
        # Keep active products, or draft products that have real images and valid price
        if p['status'] not in ('active', 'draft', ''):
            continue
        if not p['images']:
            skipped_no_img += 1
            continue
        if p['min_price'] is None or p['min_price'] <= 0:
            continue

        clean_title = clean_copy_title(p['title'])
        body_text, bullets = clean_copy_description(p['body_html'])
        cols = determine_collections(p['tags'], p['type'], clean_title, p['vendor'])

        seo_title = p['seo_title'].strip() if p['seo_title'] else f"{clean_title} | playR"
        seo_title = seo_title.replace('\ufffd', "'")
        seo_desc = p['seo_desc'].strip() if p['seo_desc'] else body_text[:155].strip()
        seo_desc = seo_desc.replace('\ufffd', "'")

        colors_list = sorted(list(p['colors']))
        sizes_list = sorted(list(p['sizes']))

        clean_catalog.append({
            'handle': h,
            'title': clean_title,
            'price': int(p['min_price']),
            'compareAt': int(p['compare_price']) if p['compare_price'] and p['compare_price'] > p['min_price'] else None,
            'type': p['type'] or 'Activewear',
            'collections': cols,
            'images': p['images'],
            'description': body_text[:400].strip(),
            'details': bullets[:6] if bullets else ['Official playR High Performance Gear', 'Ergonomic fit engineered for active movement'],
            'colors': colors_list if colors_list else None,
            'seoTitle': seo_title,
            'seoDescription': seo_desc,
        })

    print(f"Clean, copy-edited catalog count: {len(clean_catalog)} products (skipped {skipped_no_img} with no images).")

    # Generate TypeScript file
    ts_code = """// playR Master Catalog — Cleaned and copy-edited from Shopify Master Export
import { BluorngProduct } from './bluorng-data';

export const skuCatalog: BluorngProduct[] = [
"""
    for item in clean_catalog:
        ts_code += "  {\n"
        ts_code += f"    handle: {json.dumps(item['handle'])},\n"
        ts_code += f"    title: {json.dumps(item['title'])},\n"
        ts_code += f"    price: {item['price']},\n"
        ts_code += f"    compareAt: {item['compareAt'] if item['compareAt'] is not None else 'null'},\n"
        ts_code += f"    type: {json.dumps(item['type'])},\n"
        ts_code += f"    collections: {json.dumps(item['collections'])},\n"
        ts_code += f"    images: {json.dumps(item['images'])},\n"
        ts_code += f"    description: {json.dumps(item['description'])},\n"
        ts_code += f"    details: {json.dumps(item['details'])},\n"
        if item['colors']:
            ts_code += f"    colors: {json.dumps(item['colors'])},\n"
        if item.get('seoTitle'):
            ts_code += f"    seoTitle: {json.dumps(item['seoTitle'])},\n"
        if item.get('seoDescription'):
            ts_code += f"    seoDescription: {json.dumps(item['seoDescription'])},\n"
        ts_code += "  },\n"

    ts_code += "];\n"

    with open(OUTPUT_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(ts_code)

    print(f"Successfully generated {OUTPUT_TS_PATH} with {len(clean_catalog)} copy-edited products!")

if __name__ == '__main__':
    main()
