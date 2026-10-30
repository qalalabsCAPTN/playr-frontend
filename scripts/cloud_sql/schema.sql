-- ====================================================================
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
