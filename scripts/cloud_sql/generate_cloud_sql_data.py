import os
import re
import math
import pandas as pd
import numpy as np

SOURCE_EXCEL = r"C:\Users\aashi\Downloads\Location SummaryFINAL (1).xlsx"
TAXONOMY_EXCEL = r"C:\Users\aashi\Downloads\playR Website listings - sport.xlsx"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def slugify(text):
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_val(val):
    if pd.isna(val) or val is None:
        return None
    if isinstance(val, str):
        v = val.strip()
        return v if v else None
    return val

def clean_str(val):
    v = clean_val(val)
    if v is None:
        return ''
    s = str(v).strip()
    s = s.replace('\ufffd', "'")
    return s

def clean_num(val, default=0, is_float=False):
    if pd.isna(val) or val is None:
        return default
    try:
        f = float(val)
        if math.isnan(f):
            return default
        return f if is_float else int(f)
    except:
        return default

def sql_str_val(val):
    if val is None or val == '':
        return 'NULL'
    s = str(val).replace("'", "''")
    return f"'{s}'"

def sql_num_val(val):
    if val is None or pd.isna(val):
        return 'NULL'
    try:
        f = float(val)
        if math.isnan(f):
            return 'NULL'
        if f.is_integer():
            return str(int(f))
        return f"{f:.2f}"
    except:
        return 'NULL'

def sql_bool_val(val):
    if str(val).strip().lower() in ['yes', 'true', '1']:
        return 'TRUE'
    return 'FALSE'

print("Loading Excel source:", SOURCE_EXCEL)
df = pd.read_excel(SOURCE_EXCEL)
print(f"Loaded {len(df)} rows.")

# 1. BRANDS
brand_rows = [
    {'brand_id': 'playr', 'name': 'playR', 'slug': 'playr', 'category_type': 'official'},
    {'brand_id': 'playr-street', 'name': 'playR STREET', 'slug': 'playr-street', 'category_type': 'official'},
    {'brand_id': 'chennai-super-kings', 'name': 'playR x CHENNAI SUPER KINGS', 'slug': 'chennai-super-kings', 'category_type': 'ipl'},
    {'brand_id': 'lucknow-super-giants', 'name': 'playR x LUCKNOW SUPER GIANTS', 'slug': 'lucknow-super-giants', 'category_type': 'ipl'},
    {'brand_id': 'sunrisers-hyderabad', 'name': 'playR x SUNRISERS HYDERABAD', 'slug': 'sunrisers-hyderabad', 'category_type': 'ipl'},
    {'brand_id': 'seattle-orcas', 'name': 'playR x SEATTLE ORCAS', 'slug': 'seattle-orcas', 'category_type': 'other_leagues'},
    {'brand_id': 'up-yoddha', 'name': 'playR x UP YODDHA', 'slug': 'up-yoddha', 'category_type': 'other_leagues'},
]
brands_df = pd.DataFrame(brand_rows)

BRAND_TO_ID = {
    'playr': 'playr',
    'playr street': 'playr-street',
    'playr x chennai super kings': 'chennai-super-kings',
    'playr x lucknow super giants': 'lucknow-super-giants',
    'playr x sunrisers hyderabad': 'sunrisers-hyderabad',
    'playr x seattle orcas': 'seattle-orcas',
    'playr x up yoddha': 'up-yoddha',
}

# 2. CATEGORIES
# Build category taxonomy lookup
categories_map = {}
for _, row in df.iterrows():
    c1 = clean_str(row.get('Category 1'))
    c2 = clean_str(row.get('Category 2'))
    c3 = clean_str(row.get('Category 3'))
    if not (c1 and c2 and c3):
        continue
    cat_key = f"{c1}:{c2}:{c3}"
    if cat_key not in categories_map:
        cat_slug = slugify(c3)
        # Determine menu group
        menu_group = c2.title()
        href = f"/collections/{cat_slug}"
        categories_map[cat_key] = {
            'category_id': slugify(f"{c1}-{c2}-{c3}"),
            'category_1': c1,
            'category_2': c2,
            'category_3': c3,
            'slug': cat_slug,
            'menu_group': menu_group,
            'href': href
        }

categories_df = pd.DataFrame(list(categories_map.values()))

# Fix specific Seattle Orcas null sport functions
for idx, row in df.iterrows():
    func = clean_str(row.get('Function Sport'))
    if not func:
        sku = str(row.get('SKU', ''))
        if 'SO' in sku or 'SEATTLE' in str(row.get('Brand', '')).upper():
            df.at[idx, 'Function Sport'] = 'CRICKET, RUNNING and TRAINING, Lifestyle After Sports'

# 3. PRODUCTS (Parent level grouped by Article Code)
products_map = {}
variants_list = []
inventory_list = []
marketplace_list = []

for _, row in df.iterrows():
    sku = clean_str(row.get('SKU'))
    art_code = clean_str(row.get('Article Code'))
    style_code = clean_str(row.get('Style Code'))
    code = art_code if art_code else (style_code if style_code else sku)
    
    brand_raw = clean_str(row.get('Brand'))
    brand_id = BRAND_TO_ID.get(brand_raw.lower(), slugify(brand_raw))
    
    c1 = clean_str(row.get('Category 1'))
    c2 = clean_str(row.get('Category 2'))
    c3 = clean_str(row.get('Category 3'))
    cat_id = slugify(f"{c1}-{c2}-{c3}")
    
    prod_id = slugify(code)
    
    if prod_id not in products_map:
        title = clean_str(row.get('Title'))
        slug = prod_id
        products_map[prod_id] = {
            'product_id': prod_id,
            'article_code': art_code,
            'style_code': style_code,
            'title': title,
            'slug': slug,
            'brand_id': brand_id,
            'category_id': cat_id,
            'gender': clean_str(row.get('Gender')),
            'age_group': clean_str(row.get('Age group')),
            'sport_functions': clean_str(row.get('Function Sport')),
            'composition_material': clean_str(row.get('Composition / Material')),
            'technology_features': clean_str(row.get('Technology / Features')),
            'event': clean_str(row.get('Event')),
            'hsn_code': clean_str(row.get('HSN Code')),
            'bullet_point_1': clean_str(row.get('Bullet Point 1')),
            'bullet_point_2': clean_str(row.get('Bullet Point 2')),
            'bullet_point_3': clean_str(row.get('Bullet Point 3')),
            'bullet_point_4': clean_str(row.get('Bullet Point 4')),
            'bullet_point_5': clean_str(row.get('Bullet Point 5')),
            'description': clean_str(row.get('Description')),
            'google_drive_link': clean_str(row.get('Google Drive Link')),
            'country_of_origin': clean_str(row.get('Country of Origin')),
            'product_net_weight_gms': clean_num(row.get('Product Net Weight (gms)'), is_float=True),
            'product_length_cm': clean_num(row.get('Product Length (cm)'), is_float=True),
            'product_breadth_cm': clean_num(row.get('Product Breadth (cm)'), is_float=True),
            'product_height_cm': clean_num(row.get('Product Height (cm)'), is_float=True),
            'package_gross_weight_gms': clean_num(row.get('Package Gross Weight (gms)'), is_float=True),
            'package_length_cm': clean_num(row.get('Package Length (cm)'), is_float=True),
            'package_breadth_cm': clean_num(row.get('Package Breadth (cm)'), is_float=True),
            'package_height_cm': clean_num(row.get('Package Height (cm)'), is_float=True),
            'for_playr_website': True,
            'creation_date': clean_str(row.get('Creation Date'))
        }
    
    # 4. VARIANTS
    ean = clean_val(row.get('EAN Code'))
    ean_str = f"{int(float(ean))}" if ean and pd.notna(ean) else ""
    
    variants_list.append({
        'sku': sku,
        'product_id': prod_id,
        'article_code': art_code,
        'style_code': style_code,
        'marketplace_title': clean_str(row.get('Marketplace Tittle')),
        'colour': clean_str(row.get('Colour')),
        'size': clean_str(row.get('Size')),
        'mrp': clean_num(row.get('MRP'), default=0, is_float=True),
        'cost_price': clean_num(row.get('COST Price'), default=0, is_float=True),
        'gst': clean_str(row.get('GST')),
        'ean_code': ean_str,
        'asin': clean_str(row.get('ASIN')),
        'fsin': clean_str(row.get('FSIN')),
    })
    
    # 5. INVENTORY
    inventory_list.append({
        'sku': sku,
        'available_qty': clean_num(row.get('Available Qty')),
        'total_qty': clean_num(row.get('Total Qty')),
        'free_to_use': clean_num(row.get('FREE TO USE')),
        'delhi_stock': clean_num(row.get('Delhi Stock')),
        'bhiwandi_stock': clean_num(row.get('Bhiwandi Stock')),
        'iho_stock': clean_num(row.get('IHO Stock')),
        'bhu_stock': clean_num(row.get('BHU Stock')),
        'dhasa_stock': clean_num(row.get('DHASA Stock')),
        'elm_stock': clean_num(row.get('ELM Stock')),
        'jsp_stock': clean_num(row.get('JSP Stock')),
        'jwd_stock': clean_num(row.get('JWD Stock')),
        'rcp_stock': clean_num(row.get('RCP Stock')),
        'upw_stock': clean_num(row.get('UPW Stock')),
        'bwmis_stock': clean_num(row.get('BWMIS Stock')),
        'customer_location': clean_num(row.get('Customer Location')),
        'vendor_location': clean_num(row.get('Vendor Location')),
        'virtual_locations_inv_adj': clean_num(row.get('Virtual Locations/Inventory adjustment')),
        'damage_stock': clean_num(row.get('Damage/Stock')),
        'virtual_locations_production': clean_num(row.get('Virtual Locations/Production')),
        'quotation_qty': clean_num(row.get('Quotation Qty')),
        'confirmed_so_qty': clean_num(row.get('Confirmed SO qty')),
        'po_receipt_pending': clean_num(row.get('PO Receipt Pending')),
        'to_replenish': clean_num(row.get('To Replenish')),
        'opening_stock': clean_num(row.get('Opening Stock')),
        'purchase': clean_num(row.get('Purchase')),
        'purchase_return': clean_num(row.get('Purchase Return')),
        'net_purchase': clean_num(row.get('Net Purchase')),
        'sales': clean_num(row.get('Sales')),
        'sales_return': clean_num(row.get('Sales Return')),
        'net_sales': clean_num(row.get('Net Sales')),
        'closing_stock': clean_num(row.get('Closing Stock')),
        'pending_sos_customers': clean_num(row.get('Pending SOs customers')),
        'pending_pos_vendors': clean_num(row.get('Pending POs vendors')),
    })
    
    # 6. MARKETPLACE MAPPINGS
    def str_or_id(v):
        val = clean_val(v)
        if val is None or pd.isna(val):
            return ''
        try:
            f = float(val)
            if f.is_integer():
                return str(int(f))
            return str(f)
        except:
            return str(val).strip()

    marketplace_list.append({
        'sku': sku,
        'asin': clean_str(row.get('ASIN')),
        'fsin': clean_str(row.get('FSIN')),
        'myntra_id': str_or_id(row.get('Myntra')),
        'ajio_id': str_or_id(row.get('AJIO')),
        'fancode_id': str_or_id(row.get('Fancode')),
        'swiggy_id': str_or_id(row.get('Swiggy')),
        'bigbasket_id': str_or_id(row.get('Bigbasket')),
        'blinkit_id': str_or_id(row.get('Blinkit')),
        'zepto_id': str_or_id(row.get('Zepto')),
    })

products_df = pd.DataFrame(list(products_map.values()))
variants_df = pd.DataFrame(variants_list)
inventory_df = pd.DataFrame(inventory_list)
marketplace_df = pd.DataFrame(marketplace_list)

print(f"Generated:")
print(f"  - Brands: {len(brands_df)}")
print(f"  - Categories: {len(categories_df)}")
print(f"  - Parent Products: {len(products_df)}")
print(f"  - Product Variants: {len(variants_df)}")
print(f"  - Inventory Records: {len(inventory_df)}")
print(f"  - Marketplace Mappings: {len(marketplace_df)}")

# Save CSVs
brands_csv = os.path.join(OUTPUT_DIR, 'cloudsql_brands.csv')
categories_csv = os.path.join(OUTPUT_DIR, 'cloudsql_categories.csv')
products_csv = os.path.join(OUTPUT_DIR, 'cloudsql_products.csv')
variants_csv = os.path.join(OUTPUT_DIR, 'cloudsql_variants.csv')
inventory_csv = os.path.join(OUTPUT_DIR, 'cloudsql_inventory.csv')
marketplace_csv = os.path.join(OUTPUT_DIR, 'cloudsql_marketplace_mappings.csv')
flat_csv = os.path.join(OUTPUT_DIR, 'cloudsql_products_complete_flat.csv')

brands_df.to_csv(brands_csv, index=False)
categories_df.to_csv(categories_csv, index=False)
products_df.to_csv(products_csv, index=False)
variants_df.to_csv(variants_csv, index=False)
inventory_df.to_csv(inventory_csv, index=False)
marketplace_df.to_csv(marketplace_csv, index=False)
df.to_csv(flat_csv, index=False)
print("Saved all CSV files to:", OUTPUT_DIR)

# 7. GENERATE DDL SCHEMA
schema_sql_content = """-- ====================================================================
-- StreetPlayR / playR Cloud SQL Schema
-- Target: PostgreSQL 14+ (also compatible with Cloud SQL for Postgres)
-- Generated from: Location SummaryFINAL (1).xlsx & playR Website listings - sport.xlsx
-- ====================================================================

CREATE TABLE IF NOT EXISTS brands (
    brand_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    category_type VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR(128) PRIMARY KEY,
    category_1 VARCHAR(64) NOT NULL,
    category_2 VARCHAR(64) NOT NULL,
    category_3 VARCHAR(64) NOT NULL,
    slug VARCHAR(128) NOT NULL,
    menu_group VARCHAR(64) NOT NULL,
    href VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(128) PRIMARY KEY,
    article_code VARCHAR(64),
    style_code VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(brand_id),
    category_id VARCHAR(128) NOT NULL REFERENCES categories(category_id),
    gender VARCHAR(32),
    age_group VARCHAR(32),
    sport_functions TEXT,
    composition_material TEXT,
    technology_features TEXT,
    event VARCHAR(64),
    hsn_code VARCHAR(32),
    bullet_point_1 TEXT,
    bullet_point_2 TEXT,
    bullet_point_3 TEXT,
    bullet_point_4 TEXT,
    bullet_point_5 TEXT,
    description TEXT,
    google_drive_link TEXT,
    country_of_origin VARCHAR(64),
    product_net_weight_gms NUMERIC(10, 2),
    product_length_cm NUMERIC(10, 2),
    product_breadth_cm NUMERIC(10, 2),
    product_height_cm NUMERIC(10, 2),
    package_gross_weight_gms NUMERIC(10, 2),
    package_length_cm NUMERIC(10, 2),
    package_breadth_cm NUMERIC(10, 2),
    package_height_cm NUMERIC(10, 2),
    for_playr_website BOOLEAN DEFAULT TRUE,
    creation_date VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
    sku VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(128) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    article_code VARCHAR(64),
    style_code VARCHAR(64),
    marketplace_title TEXT,
    colour VARCHAR(64),
    size VARCHAR(32),
    mrp NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    gst VARCHAR(32),
    ean_code VARCHAR(64),
    asin VARCHAR(64),
    fsin VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_locations (
    sku VARCHAR(64) PRIMARY KEY REFERENCES product_variants(sku) ON DELETE CASCADE,
    available_qty INT DEFAULT 0,
    total_qty INT DEFAULT 0,
    free_to_use INT DEFAULT 0,
    delhi_stock INT DEFAULT 0,
    bhiwandi_stock INT DEFAULT 0,
    iho_stock INT DEFAULT 0,
    bhu_stock INT DEFAULT 0,
    dhasa_stock INT DEFAULT 0,
    elm_stock INT DEFAULT 0,
    jsp_stock INT DEFAULT 0,
    jwd_stock INT DEFAULT 0,
    rcp_stock INT DEFAULT 0,
    upw_stock INT DEFAULT 0,
    bwmis_stock INT DEFAULT 0,
    customer_location INT DEFAULT 0,
    vendor_location INT DEFAULT 0,
    virtual_locations_inv_adj INT DEFAULT 0,
    damage_stock INT DEFAULT 0,
    virtual_locations_production INT DEFAULT 0,
    quotation_qty INT DEFAULT 0,
    confirmed_so_qty INT DEFAULT 0,
    po_receipt_pending INT DEFAULT 0,
    to_replenish INT DEFAULT 0,
    opening_stock INT DEFAULT 0,
    purchase INT DEFAULT 0,
    purchase_return INT DEFAULT 0,
    net_purchase INT DEFAULT 0,
    sales INT DEFAULT 0,
    sales_return INT DEFAULT 0,
    net_sales INT DEFAULT 0,
    closing_stock INT DEFAULT 0,
    pending_sos_customers INT DEFAULT 0,
    pending_pos_vendors INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_mappings (
    sku VARCHAR(64) PRIMARY KEY REFERENCES product_variants(sku) ON DELETE CASCADE,
    asin VARCHAR(64),
    fsin VARCHAR(64),
    myntra_id VARCHAR(64),
    ajio_id VARCHAR(64),
    fancode_id VARCHAR(64),
    swiggy_id VARCHAR(64),
    bigbasket_id VARCHAR(64),
    blinkit_id VARCHAR(64),
    zepto_id VARCHAR(64),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid indexing & storefront queries
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_size ON product_variants(size);
CREATE INDEX IF NOT EXISTS idx_variants_colour ON product_variants(colour);
CREATE INDEX IF NOT EXISTS idx_inventory_available ON inventory_locations(available_qty);
"""

schema_path = os.path.join(OUTPUT_DIR, 'schema.sql')
with open(schema_path, 'w', encoding='utf-8') as f:
    f.write(schema_sql_content)
print("Written schema.sql to:", schema_path)

# 8. GENERATE SEED SCRIPT (batch INSERTs)
seed_path = os.path.join(OUTPUT_DIR, 'seed_products.sql')
with open(seed_path, 'w', encoding='utf-8') as sf:
    sf.write("-- Cloud SQL Seed Script for StreetPlayR / playR Products\n")
    sf.write("BEGIN;\n\n")
    
    # Brands
    sf.write("-- 1. BRANDS\n")
    for _, b in brands_df.iterrows():
        sf.write(f"INSERT INTO brands (brand_id, name, slug, category_type) VALUES ({sql_str_val(b['brand_id'])}, {sql_str_val(b['name'])}, {sql_str_val(b['slug'])}, {sql_str_val(b['category_type'])}) ON CONFLICT (brand_id) DO UPDATE SET name = EXCLUDED.name;\n")
    sf.write("\n")
    
    # Categories
    sf.write("-- 2. CATEGORIES\n")
    for _, c in categories_df.iterrows():
        sf.write(f"INSERT INTO categories (category_id, category_1, category_2, category_3, slug, menu_group, href) VALUES ({sql_str_val(c['category_id'])}, {sql_str_val(c['category_1'])}, {sql_str_val(c['category_2'])}, {sql_str_val(c['category_3'])}, {sql_str_val(c['slug'])}, {sql_str_val(c['menu_group'])}, {sql_str_val(c['href'])}) ON CONFLICT (category_id) DO UPDATE SET slug = EXCLUDED.slug;\n")
    sf.write("\n")
    
    # Products
    sf.write("-- 3. PRODUCTS (Parent Items)\n")
    for _, p in products_df.iterrows():
        sf.write(f"""INSERT INTO products (
            product_id, article_code, style_code, title, slug, brand_id, category_id,
            gender, age_group, sport_functions, composition_material, technology_features,
            event, hsn_code, bullet_point_1, bullet_point_2, bullet_point_3, bullet_point_4, bullet_point_5,
            description, google_drive_link, country_of_origin,
            product_net_weight_gms, product_length_cm, product_breadth_cm, product_height_cm,
            package_gross_weight_gms, package_length_cm, package_breadth_cm, package_height_cm,
            for_playr_website, creation_date
        ) VALUES (
            {sql_str_val(p['product_id'])}, {sql_str_val(p['article_code'])}, {sql_str_val(p['style_code'])}, {sql_str_val(p['title'])}, {sql_str_val(p['slug'])}, {sql_str_val(p['brand_id'])}, {sql_str_val(p['category_id'])},
            {sql_str_val(p['gender'])}, {sql_str_val(p['age_group'])}, {sql_str_val(p['sport_functions'])}, {sql_str_val(p['composition_material'])}, {sql_str_val(p['technology_features'])},
            {sql_str_val(p['event'])}, {sql_str_val(p['hsn_code'])}, {sql_str_val(p['bullet_point_1'])}, {sql_str_val(p['bullet_point_2'])}, {sql_str_val(p['bullet_point_3'])}, {sql_str_val(p['bullet_point_4'])}, {sql_str_val(p['bullet_point_5'])},
            {sql_str_val(p['description'])}, {sql_str_val(p['google_drive_link'])}, {sql_str_val(p['country_of_origin'])},
            {sql_num_val(p['product_net_weight_gms'])}, {sql_num_val(p['product_length_cm'])}, {sql_num_val(p['product_breadth_cm'])}, {sql_num_val(p['product_height_cm'])},
            {sql_num_val(p['package_gross_weight_gms'])}, {sql_num_val(p['package_length_cm'])}, {sql_num_val(p['package_breadth_cm'])}, {sql_num_val(p['package_height_cm'])},
            TRUE, {sql_str_val(p['creation_date'])}
        ) ON CONFLICT (product_id) DO UPDATE SET title = EXCLUDED.title;\n""")
    sf.write("\n")
    
    # Variants
    sf.write("-- 4. PRODUCT VARIANTS\n")
    for _, v in variants_df.iterrows():
        sf.write(f"""INSERT INTO product_variants (
            sku, product_id, article_code, style_code, marketplace_title, colour, size, mrp, cost_price, gst, ean_code, asin, fsin
        ) VALUES (
            {sql_str_val(v['sku'])}, {sql_str_val(v['product_id'])}, {sql_str_val(v['article_code'])}, {sql_str_val(v['style_code'])},
            {sql_str_val(v['marketplace_title'])}, {sql_str_val(v['colour'])}, {sql_str_val(v['size'])},
            {sql_num_val(v['mrp'])}, {sql_num_val(v['cost_price'])}, {sql_str_val(v['gst'])},
            {sql_str_val(v['ean_code'])}, {sql_str_val(v['asin'])}, {sql_str_val(v['fsin'])}
        ) ON CONFLICT (sku) DO UPDATE SET mrp = EXCLUDED.mrp, cost_price = EXCLUDED.cost_price;\n""")
    sf.write("\n")
    
    # Inventory
    sf.write("-- 5. INVENTORY LOCATIONS\n")
    for _, inv in inventory_df.iterrows():
        sf.write(f"""INSERT INTO inventory_locations (
            sku, available_qty, total_qty, free_to_use, delhi_stock, bhiwandi_stock, iho_stock, bhu_stock,
            customer_location, vendor_location, virtual_locations_inv_adj, damage_stock, virtual_locations_production,
            closing_stock, pending_sos_customers, pending_pos_vendors
        ) VALUES (
            {sql_str_val(inv['sku'])}, {sql_num_val(inv['available_qty'])}, {sql_num_val(inv['total_qty'])}, {sql_num_val(inv['free_to_use'])},
            {sql_num_val(inv['delhi_stock'])}, {sql_num_val(inv['bhiwandi_stock'])}, {sql_num_val(inv['iho_stock'])}, {sql_num_val(inv['bhu_stock'])},
            {sql_num_val(inv['customer_location'])}, {sql_num_val(inv['vendor_location'])}, {sql_num_val(inv['virtual_locations_inv_adj'])},
            {sql_num_val(inv['damage_stock'])}, {sql_num_val(inv['virtual_locations_production'])},
            {sql_num_val(inv['closing_stock'])}, {sql_num_val(inv['pending_sos_customers'])}, {sql_num_val(inv['pending_pos_vendors'])}
        ) ON CONFLICT (sku) DO UPDATE SET available_qty = EXCLUDED.available_qty;\n""")
    sf.write("\n")
    
    # Marketplace mappings
    sf.write("-- 6. MARKETPLACE MAPPINGS\n")
    for _, m in marketplace_df.iterrows():
        sf.write(f"""INSERT INTO marketplace_mappings (
            sku, asin, fsin, myntra_id, ajio_id, fancode_id, swiggy_id, bigbasket_id, blinkit_id, zepto_id
        ) VALUES (
            {sql_str_val(m['sku'])}, {sql_str_val(m['asin'])}, {sql_str_val(m['fsin'])},
            {sql_str_val(m['myntra_id'])}, {sql_str_val(m['ajio_id'])}, {sql_str_val(m['fancode_id'])},
            {sql_str_val(m['swiggy_id'])}, {sql_str_val(m['bigbasket_id'])}, {sql_str_val(m['blinkit_id'])}, {sql_str_val(m['zepto_id'])}
        ) ON CONFLICT (sku) DO UPDATE SET asin = EXCLUDED.asin;\n""")
    sf.write("\nCOMMIT;\n")

print("Generated seed_products.sql to:", seed_path)
