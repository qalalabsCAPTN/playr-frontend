import zipfile
import io
import csv
import re
import html
import os
import json

CSV_ZIP_PATH = r"C:\Users\aashi\Downloads\products_export_1.zip"
OUTPUT_TS_PATH = r"apps\playr\src\lib\sku-catalog.ts"

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
    full_text = f"{title} {p_type} {vendor} {tags_str}".lower()
    cols = set()

    # Baseline collections
    cols.add('shop-all')
    cols.add('all-products')

    # =========================================================
    # 1. SPORTS / ACTIVITIES (Header Sports Tab & Filtering)
    # =========================================================
    # Cricket
    if any(k in full_text for k in ['cricket', 'bat', 'willow', 'wicket', 'icc', 'ipl', 'leather ball', 'tennis ball', 'batting', 'keeping leg guard', 'batting gloves', 'csk', 'lsg', 'srh', 'yoddha', 'orcas']):
        cols.add('cricket')

    # Swimming
    if any(k in full_text for k in ['swim', 'swimming', 'goggle', 'diving', 'pool', 'swim cap', 'ear plugs', 'nose clip']):
        cols.add('swimming')
        cols.add('swim-caps')
        cols.add('swimming-goggles')

    # Pickleball
    if any(k in full_text for k in ['pickleball', 'paddle']):
        cols.add('pickleball')
        cols.add('paddle')
        cols.add('paddle-raquet')

    # Running & Training
    if any(k in full_text for k in ['running', 'marathon', 'jogging', 'training', 'activewear']):
        cols.add('running-training')

    # Gym, Fitness & Yoga
    if any(k in full_text for k in ['gym', 'yoga', 'fitness', 'workout', 'resistance band', 'weights', 'exercise', 'training']):
        cols.add('gym-fitness-yoga')
        cols.add('fitness-gym-yoga')

    # Cycling
    if any(k in full_text for k in ['cycling', 'cycle', 'atom', 'stallion', 'bff', 'fat tyre', 'speed', 'air pump']):
        cols.add('cycling')

    # Football
    if any(k in full_text for k in ['football', 'soccer', 'goalkeeper', 'fussballliebe', 'messi', 'real madrid', 'manchester united', 'arsenal', 'argentina', 'ucl', 'euro 24']):
        cols.add('football')

    # Basketball
    if 'basketball' in full_text:
        cols.add('basketball')

    # Golf
    if 'golf' in full_text:
        cols.add('golf')

    # Volleyball
    if 'volleyball' in full_text:
        cols.add('volleyball')

    # Kabaddi
    if any(k in full_text for k in ['kabaddi', 'yoddha', 'pkl']):
        cols.add('kabaddi')

    # Outdoor & Adventure
    if any(k in full_text for k in ['outdoor', 'adventure', 'trekking', 'camping', 'hiking']):
        cols.add('outdoor-adventure')

    # Lifestyle After Sports
    if any(k in full_text for k in ['lifestyle', 'casual', 'after sports', 'street', 'varsity', 'hooded jacket']):
        cols.add('lifestyle-after-sports')

    # =========================================================
    # 2. CATEGORY - APPARELS
    # =========================================================
    is_apparel = False

    # Topwear
    if any(k in full_text for k in ['t-shirt', 't-shirt tee', 'tee', 'polo', 'jersey', 'singlet', 'top', 'hoodie', 'jacket', 'sweatshirt', 'sweaters', 'tank top', 'track top', 'match whites', 'upper']):
        cols.add('topwear')
        cols.add('apparel')
        is_apparel = True
        if any(k in full_text for k in ['polo']):
            cols.add('t-shirt-polo')
        elif any(k in full_text for k in ['jersey', 'match whites']):
            cols.add('jersey')
        elif any(k in full_text for k in ['hoodie', 'sweatshirt', 'sweaters']):
            cols.add('hoodie')
        elif any(k in full_text for k in ['jacket', 'track top']):
            cols.add('jacket')
        elif any(k in full_text for k in ['singlet', 'tank top']):
            cols.add('singlet')
        else:
            cols.add('t-shirt-tee')

    # Bottomwear
    if any(k in full_text for k in ['short', 'shorts', 'pant', 'pants', 'jogger', 'joggers', 'trouser', 'tights', 'track pant', 'lower', 'skin pant', 'skirt']):
        cols.add('bottomwear')
        cols.add('apparel')
        is_apparel = True
        if any(k in full_text for k in ['short', 'shorts']):
            cols.add('shorts')
        elif any(k in full_text for k in ['jogger', 'joggers']):
            cols.add('jogger')
        elif any(k in full_text for k in ['tights', 'skin pant']):
            cols.add('skin-pants')
        else:
            cols.add('pants')

    # Suit & Tracksuits
    if any(k in full_text for k in ['suit', 'track suit', 'tracksuit']):
        cols.add('suit')
        cols.add('apparel')
        cols.add('track-set')
        is_apparel = True

    # Innerwear & Compression
    if any(k in full_text for k in ['sports bra', 'inner bra', 'innerwear', 'skin', 'skin pant', 'skin shorts', 'skin singlet', 'skin tee']):
        cols.add('innerwear')
        cols.add('apparel')
        is_apparel = True

    # =========================================================
    # 3. CATEGORY - EQUIPMENT
    # =========================================================
    is_equipment = False

    # Bat
    if any(k in full_text for k in ['english willow', 'kashmir willow', 'popular willow', 'tennis bat', 'cricket bat', 'bat']):
        if not any(k in full_text for k in ['batting gloves', 'batting leg guard']):
            cols.add('bat')
            cols.add('equipment')
            is_equipment = True
            if 'english willow' in full_text:
                cols.add('english-willow')
            elif 'kashmir willow' in full_text:
                cols.add('kashmir-willow')
            elif 'popular willow' in full_text or 'tennis bat' in full_text:
                cols.add('popular-willow')

    # Ball
    if any(k in full_text for k in ['leather ball', 'tennis ball', 'deco ball', 'cricket ball', 'football', 'basketball', 'ball']):
        cols.add('ball')
        cols.add('equipment')
        is_equipment = True
        if 'leather' in full_text:
            cols.add('leather-ball')
        elif 'tennis' in full_text:
            cols.add('tennis-ball')

    # Gloves
    if any(k in full_text for k in ['batting gloves', 'keeping gloves', 'goalkeeper gloves', 'gloves']):
        cols.add('gloves')
        cols.add('equipment')
        is_equipment = True

    # Guard
    if any(k in full_text for k in ['thigh guard', 'leg guard', 'guard', 'pad']):
        cols.add('guard')
        cols.add('equipment')
        is_equipment = True

    # Band / Resistance
    if any(k in full_text for k in ['resistance band', 'resistance bands', 'wrist band', 'bands', 'band']):
        cols.add('band')
        cols.add('resistance')
        cols.add('equipment')
        is_equipment = True

    # Yoga Mat
    if any(k in full_text for k in ['yoga mat', 'exercise mat', 'mat']):
        cols.add('yoga-mat')
        cols.add('mat')
        cols.add('equipment')
        is_equipment = True

    # Eyewear / Goggles
    if any(k in full_text for k in ['goggle', 'goggles', 'eyewear']):
        cols.add('eyewear')
        cols.add('goggles')
        cols.add('swimming-goggles')
        cols.add('equipment')
        is_equipment = True

    # Paddle / Raquet
    if any(k in full_text for k in ['paddle', 'pickleball', 'carbon fiber', 'glass fiber']):
        cols.add('paddle')
        cols.add('paddle-raquet')
        cols.add('equipment')
        is_equipment = True
        if 'carbon fiber' in full_text or 't700' in full_text:
            cols.add('carbon-fiber')
        elif 'glass fiber' in full_text:
            cols.add('glass-fiber')

    # Sets & Combos
    if any(k in full_text for k in ['combo', 'set', 'cricket set', 'bath & towel set']):
        cols.add('set')
        cols.add('combo')
        cols.add('equipment')
        is_equipment = True

    # =========================================================
    # 4. CATEGORY - ACCESSORIES
    # =========================================================
    # Bags
    if any(k in full_text for k in ['backpack', 'back pack', 'bag', 'duffle', 'kitbag', 'sling bag', 'string bag', 'sports gym bag', 'travel luggage']):
        cols.add('bag')
        cols.add('accessories')
        if any(k in full_text for k in ['backpack', 'back pack', 'laptop backpack']):
            cols.add('backpack')
        elif 'kitbag' in full_text:
            cols.add('kitbag')
        elif 'sling' in full_text:
            cols.add('sling')

    # Headwear / Caps
    if any(k in full_text for k in ['cap', 'hat', 'headwear', 'woolie', 'beanie', 'swim cap', 'swimming cap']):
        cols.add('headwear')
        cols.add('caps')
        cols.add('accessories')
        if 'hat' in full_text:
            cols.add('hat')

    # Drinkware
    if any(k in full_text for k in ['bottle', 'sipper', 'shaker', 'mug', 'ceramic mug', 'bottles']):
        cols.add('drinkware')
        cols.add('accessories')
        if 'sipper' in full_text or 'bottle' in full_text:
            cols.add('sipper')
        if 'shaker' in full_text:
            cols.add('shaker')
        if 'mug' in full_text:
            cols.add('mug')

    # Socks
    if any(k in full_text for k in ['sock', 'socks', 'crew socks', 'ankle socks', 'knee sock']):
        cols.add('socks')
        cols.add('accessories')
        if 'crew' in full_text:
            cols.add('crew-socks')
        elif 'ankle' in full_text:
            cols.add('ankle-socks')

    # Cushion & Living
    if any(k in full_text for k in ['cushion', 'back cushion', 'neck cushion', 'eye cushion', 'cushion cover']):
        cols.add('cushion')
        cols.add('accessories')

    # Towels
    if any(k in full_text for k in ['towel', 'bath & towel set']):
        cols.add('towel')
        cols.add('accessories')

    # Footwear
    if any(k in full_text for k in ['shoes', 'slipper', 'flip flops', 'sandals']):
        cols.add('footwear')
        cols.add('accessories')

    # =========================================================
    # 5. BRANDS & CLUBS (Header Brand & Club Tabs)
    # =========================================================
    v_low = vendor.lower()
    
    # Chennai Super Kings
    if 'chennai' in v_low or 'csk' in full_text:
        cols.add('chennai-super-kings')
        cols.add('playr-x-chennai-super-kings')
        cols.add('csk')

    # Lucknow Super Giants
    if 'lucknow' in v_low or 'lsg' in full_text:
        cols.add('lucknow-super-giants')
        cols.add('playr-x-lucknow-super-giants')
        cols.add('lsg')

    # Sunrisers Hyderabad
    if 'sunrisers' in v_low or 'srh' in full_text:
        cols.add('sunrisers-hyderabad')
        cols.add('playr-x-sunrisers-hyderabad')
        cols.add('srh')

    # Mumbai Indians
    if 'mumbai' in v_low or 'mi' in full_text:
        cols.add('mumbai-indians')
        cols.add('playr-x-mumbai-indians')

    # Rajasthan Royals
    if 'rajasthan' in v_low or 'rr' in full_text or 'royals' in full_text:
        cols.add('rajasthan-royals')
        cols.add('playr-x-rajasthan-royals')

    # Punjab Kings
    if 'punjab' in v_low or 'pbks' in full_text:
        cols.add('punjab-kings')
        cols.add('playr-x-punjab-kings')

    # Kolkata Knight Riders
    if 'kolkata' in v_low or 'kkr' in full_text or 'knight riders' in full_text:
        cols.add('kolkata-knight-riders')
        cols.add('playr-x-kolkata-knight-riders')

    # Gujarat Titans
    if 'gujarat' in v_low or 'gt' in full_text:
        cols.add('gujarat-titans')
        cols.add('playr-x-gujarat-titans')

    # Seattle Orcas
    if 'seattle' in v_low or 'orcas' in full_text:
        cols.add('seattle-orcas')
        cols.add('playr-x-seattle-orcas')

    # UP Yoddhas
    if 'yoddha' in v_low or 'yoddhas' in full_text:
        cols.add('up-yoddha')
        cols.add('up-yoddhas')
        cols.add('playr-x-up-yoddha')

    # Adidas
    if 'adidas' in v_low or 'adidas' in full_text:
        cols.add('adidas')

    # Reebok
    if 'reebok' in v_low or 'reebok' in full_text:
        cols.add('reebok')

    # ICC
    if 'icc' in v_low or 'icc' in full_text:
        cols.add('icc')

    # playR Street
    if 'street' in full_text:
        cols.add('playr-street')

    # Base playR brand
    cols.add('playr')
    cols.add('playr-official-merchandise')

    # =========================================================
    # 6. DEMOGRAPHICS (Men, Women, Kids, Unisex)
    # =========================================================
    if 'women' in full_text or 'womens' in full_text or 'women\'s' in full_text or 'girls' in full_text:
        cols.add('women')
    elif 'kids' in full_text or 'junior' in full_text or 'boys' in full_text or 'boy' in full_text or 'girl' in full_text:
        cols.add('kids')
    elif 'men' in full_text or 'mens' in full_text or 'men\'s' in full_text:
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
                        'type': r[type_idx] or 'Activewear',
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

    # Include all valid products that have images and a valid price
    clean_catalog = []
    skipped_no_img = 0
    skipped_no_price = 0

    for h, p in products.items():
        if not p['images']:
            skipped_no_img += 1
            continue
        if p['min_price'] is None or p['min_price'] <= 0:
            skipped_no_price += 1
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

        # Determine clean display type
        display_type = p['type'].strip() if p['type'] else 'Sportswear'
        if display_type in ['PPLR_HIDDEN_PRODUCT', '']:
            display_type = 'Sportswear'

        # Check if product is customizable jersey/apparel
        is_customizable = any(k in f"{clean_title} {display_type} {cols}".lower() for k in [
            'jersey', 'custom', 'fanwear', 'match edition', 'match whites', 'singlet', 't-shirt', 'tee', 'polo'
        ])

        clean_catalog.append({
            'handle': h,
            'title': clean_title,
            'price': int(p['min_price']),
            'compareAt': int(p['compare_price']) if p['compare_price'] and p['compare_price'] > p['min_price'] else None,
            'type': display_type,
            'collections': cols,
            'images': p['images'],
            'description': body_text[:400].strip(),
            'details': bullets[:6] if bullets else ['Official playR High Performance Gear', 'Ergonomic fit engineered for active movement'],
            'colors': colors_list if colors_list else None,
            'sizes': sizes_list if sizes_list else None,
            'customizable': is_customizable,
            'seoTitle': seo_title,
            'seoDescription': seo_desc,
        })

    print(f"Clean, copy-edited catalog count: {len(clean_catalog)} products (skipped {skipped_no_img} with no images, {skipped_no_price} with no price).")

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
        if item.get('colors'):
            ts_code += f"    colors: {json.dumps(item['colors'])},\n"
        if item.get('sizes'):
            ts_code += f"    sizes: {json.dumps(item['sizes'])},\n"
        if item.get('customizable'):
            ts_code += f"    customizable: true,\n"
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
