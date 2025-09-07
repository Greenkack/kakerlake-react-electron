-- apps/main/src/db/migrations/001_init.sql
-- Complete schema migration extracted from Python sources
-- Schema Version 14: crm.py, database.py, product_db.py

-- Customers table - mirrors crm.py:create_tables_crm
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salutation TEXT,
    title TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT,
    address TEXT,
    house_number TEXT,
    zip_code TEXT,
    city TEXT,
    state TEXT,
    region TEXT,
    email TEXT,
    phone_landline TEXT,
    phone_mobile TEXT,
    income_tax_rate_percent REAL DEFAULT 0.0,
    creation_date TEXT,
    last_updated TEXT
);

-- Projects table - mirrors crm.py:create_tables_crm  
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    project_name TEXT NOT NULL,
    project_status TEXT,
    roof_type TEXT,
    roof_covering_type TEXT,
    free_roof_area_sqm REAL,
    roof_orientation TEXT,
    roof_inclination_deg INTEGER,
    building_height_gt_7m INTEGER,
    annual_consumption_kwh REAL,
    costs_household_euro_mo REAL,
    annual_heating_kwh REAL,
    costs_heating_euro_mo REAL,
    anlage_type TEXT,
    feed_in_type TEXT,
    module_quantity INTEGER,
    selected_module_id INTEGER,
    selected_inverter_id INTEGER,
    include_storage INTEGER,
    selected_storage_id INTEGER,
    selected_storage_storage_power_kw REAL,
    include_additional_components INTEGER,
    selected_wallbox_id INTEGER,
    selected_ems_id INTEGER,
    selected_optimizer_id INTEGER,
    selected_carport_id INTEGER,
    selected_notstrom_id INTEGER,
    selected_tierabwehr_id INTEGER,
    visualize_roof_in_pdf INTEGER,
    latitude REAL,
    longitude REAL,
    creation_date TEXT,
    last_updated TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Customer Documents table - mirrors database.py:_create_customer_documents_table
CREATE TABLE IF NOT EXISTS customer_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    project_id INTEGER,
    doc_type TEXT, -- e.g. 'offer_pdf', 'image', 'note', 'other'
    display_name TEXT,
    file_name TEXT,
    absolute_file_path TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- Products table - mirrors product_db.py:create_product_table with complete columns
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    model_name TEXT NOT NULL UNIQUE,
    brand TEXT,
    price_euro REAL,
    capacity_w REAL,
    storage_power_kw REAL,
    power_kw REAL,
    max_cycles INTEGER,
    warranty_years INTEGER,
    length_m REAL,
    width_m REAL,
    weight_kg REAL,
    efficiency_percent REAL,
    origin_country TEXT,
    description TEXT,
    pros TEXT,
    cons TEXT,
    rating REAL,
    image_base64 TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, 
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP, 
    datasheet_link_db_path TEXT, 
    additional_cost_netto REAL DEFAULT 0.0,
    -- Company reference for multi-tenant support
    company_id INTEGER,
    -- Extended module detail columns for PDF page 4
    cell_technology TEXT,          -- e.g. Monokristallin N-Type / TOPCon / HJT / PERC
    module_structure TEXT,         -- e.g. Glas-Glas / Glas-Folie
    cell_type TEXT,                -- e.g. 108 Halbzellen
    version TEXT,                  -- e.g. All-Black / Black Frame
    module_warranty_text TEXT,     -- e.g. "25 Jahre Produktgarantie | 30 Jahre Leistungsgarantie"
    -- Heat pump / service extensions
    labor_hours REAL               -- Labor hours for heat pump pricing logic
);

-- Indexes for performance (mirroring Python query patterns)
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_documents_project_id ON customer_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
