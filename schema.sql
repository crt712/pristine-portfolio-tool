-- Pristine Portfolio Tool - Complete Database Schema
-- Execute with: wrangler d1 execute pristine-portfolio-db --file=schema.sql

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('owner', 'admin', 'contributor', 'viewer')) DEFAULT 'viewer',
    status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
    last_login DATETIME,
    preferences TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    category TEXT CHECK (category IN ('deodorant', 'skincare', 'haircare', 'other')) DEFAULT 'other',
    status TEXT CHECK (status IN ('concept', 'development', 'testing', 'pre_launch', 'active', 'discontinued')) DEFAULT 'concept',
    launch_date DATETIME,
    brand TEXT DEFAULT 'Pristine',
    size TEXT,
    target_price REAL,
    current_version TEXT DEFAULT '1.0',
    regulatory_status TEXT CHECK (regulatory_status IN ('compliant', 'pending', 'needs_review', 'non_compliant')) DEFAULT 'pending',
    created_by TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Formulas table  
CREATE TABLE formulas (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    version TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('draft', 'testing', 'approved', 'production', 'archived')) DEFAULT 'draft',
    base_formula TEXT,
    innovation_deltas TEXT DEFAULT '{}',
    ph_range TEXT,
    organic_content REAL CHECK (organic_content >= 0 AND organic_content <= 100),
    total_percentage REAL DEFAULT 0,
    created_by TEXT NOT NULL,
    approved_by TEXT,
    approval_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    UNIQUE(product_id, version)
);

-- Ingredients table
CREATE TABLE ingredients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    inci_name TEXT,
    cas_number TEXT,
    category TEXT CHECK (category IN ('active', 'base', 'fragrance', 'preservative', 'emulsifier', 'other')) DEFAULT 'other',
    function TEXT,
    supplier TEXT,
    cost_per_kg REAL,
    min_percentage REAL CHECK (min_percentage >= 0 AND min_percentage <= 100),
    max_percentage REAL CHECK (max_percentage >= 0 AND max_percentage <= 100),
    regulatory_restrictions TEXT DEFAULT '{}',
    safety_data TEXT DEFAULT '{}',
    certifications TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- BOM Items table
CREATE TABLE bom_items (
    id TEXT PRIMARY KEY,
    formula_id TEXT NOT NULL,
    ingredient_id TEXT NOT NULL,
    percentage REAL NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formula_id) REFERENCES formulas(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
    UNIQUE(formula_id, ingredient_id)
);

-- Vendors table
CREATE TABLE vendors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('co_packer', 'ingredient_supplier', 'packaging', 'fulfillment', 'other')) DEFAULT 'other',
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT DEFAULT '{}',
    website TEXT,
    status TEXT CHECK (status IN ('active', 'inactive', 'pending', 'blacklisted')) DEFAULT 'pending',
    capabilities TEXT DEFAULT '[]',
    certifications TEXT DEFAULT '[]',
    score REAL CHECK (score >= 0 AND score <= 100),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cost Profiles table
CREATE TABLE cost_profiles (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    volume_tier INTEGER NOT NULL,
    unit_cost REAL NOT NULL,
    tooling_cost REAL DEFAULT 0,
    moq INTEGER,
    lead_time_days INTEGER,
    setup_fee REAL DEFAULT 0,
    shipping_cost REAL DEFAULT 0,
    projected_msrp REAL,
    gross_margin REAL,
    effective_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    UNIQUE(product_id, vendor_id, volume_tier)
);

-- Packaging Specs table
CREATE TABLE packaging_specs (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    component_type TEXT CHECK (component_type IN ('tube', 'cap', 'label', 'box', 'insert')) NOT NULL,
    material TEXT,
    size TEXT,
    color TEXT,
    supplier TEXT,
    cost_per_unit REAL,
    moq INTEGER,
    lead_time_days INTEGER,
    certifications TEXT DEFAULT '[]',
    sustainability_notes TEXT,
    status TEXT CHECK (status IN ('approved', 'testing', 'pending', 'rejected')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Claims Register table
CREATE TABLE claims_register (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    claim_text TEXT NOT NULL,
    claim_type TEXT CHECK (claim_type IN ('efficacy', 'safety', 'sustainability', 'ingredient', 'other')) DEFAULT 'other',
    regulatory_status TEXT CHECK (regulatory_status IN ('allowed', 'restricted', 'not_allowed', 'pending_review')) DEFAULT 'pending_review',
    substantiation_required BOOLEAN DEFAULT TRUE,
    substantiation_status TEXT CHECK (substantiation_status IN ('complete', 'in_progress', 'not_started', 'not_required')) DEFAULT 'not_started',
    test_protocol TEXT,
    evidence_files TEXT DEFAULT '[]',
    regulatory_body TEXT CHECK (regulatory_body IN ('FDA', 'FTC', 'IFRA', 'Made_Safe', 'Leaping_Bunny', 'EWG')),
    review_date DATETIME,
    expiry_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Testing Results table
CREATE TABLE testing_results (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    formula_id TEXT,
    test_type TEXT CHECK (test_type IN ('efficacy', 'safety', 'stability', 'consumer', 'sensory')) NOT NULL,
    protocol TEXT,
    sample_size INTEGER,
    test_duration TEXT,
    results_summary TEXT,
    success_criteria TEXT,
    pass_fail TEXT CHECK (pass_fail IN ('pass', 'fail', 'conditional')),
    score REAL,
    test_lab TEXT,
    test_date DATETIME,
    report_file TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (formula_id) REFERENCES formulas(id)
);

-- Fulfillment Partners table
CREATE TABLE fulfillment_partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('3PL', 'FBA', 'direct', 'dropship')) NOT NULL,
    contact_info TEXT DEFAULT '{}',
    cost_per_order REAL,
    cost_per_unit REAL,
    storage_cost REAL,
    setup_fee REAL DEFAULT 0,
    min_monthly_orders INTEGER,
    capabilities TEXT DEFAULT '[]',
    regions_served TEXT DEFAULT '[]',
    integration_api TEXT,
    status TEXT CHECK (status IN ('active', 'inactive', 'testing')) DEFAULT 'testing',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fulfillment Rules table
CREATE TABLE fulfillment_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    priority INTEGER DEFAULT 100,
    conditions TEXT DEFAULT '{}',
    action TEXT NOT NULL,
    product_types TEXT DEFAULT '[]',
    order_value_min REAL,
    order_value_max REAL,
    channels TEXT DEFAULT '[]',
    regions TEXT DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_by TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Marketing Campaigns table
CREATE TABLE marketing_campaigns (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    name TEXT NOT NULL,
    channel TEXT CHECK (channel IN ('SEO', 'paid_ads', 'social', 'influencer', 'email', 'content', 'PR')) NOT NULL,
    budget_allocated REAL DEFAULT 0,
    budget_spent REAL DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    status TEXT CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'planning',
    target_audience TEXT,
    goals TEXT DEFAULT '{}',
    results TEXT DEFAULT '{}',
    roi REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sales Projections table
CREATE TABLE sales_projections (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    period_type TEXT CHECK (period_type IN ('monthly', 'quarterly', 'yearly')) NOT NULL,
    period_start DATETIME NOT NULL,
    period_end DATETIME NOT NULL,
    channel TEXT CHECK (channel IN ('shopify', 'amazon', 'etsy', 'wholesale', 'retail', 'total')) NOT NULL,
    projected_units INTEGER DEFAULT 0,
    projected_revenue REAL DEFAULT 0,
    actual_units INTEGER DEFAULT 0,
    actual_revenue REAL DEFAULT 0,
    variance_units INTEGER DEFAULT 0,
    variance_revenue REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(product_id, period_start, period_end, channel)
);

-- AI Insights table
CREATE TABLE ai_insights (
    id TEXT PRIMARY KEY,
    type TEXT CHECK (type IN ('concept_forward', 'concept_reverse', 'formula_optimization', 'cost_optimization', 'market_analysis', 'risk_alert')) NOT NULL,
    product_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected', 'implemented')) DEFAULT 'pending',
    proposed_changes TEXT DEFAULT '{}',
    impact_estimate TEXT DEFAULT '{}',
    reviewed_by TEXT,
    review_date DATETIME,
    implementation_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Change Log table
CREATE TABLE change_log (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT CHECK (action IN ('create', 'update', 'delete')) NOT NULL,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT NOT NULL,
    change_reason TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_formulas_product_id ON formulas(product_id);
CREATE INDEX idx_formulas_status ON formulas(status);
CREATE INDEX idx_bom_items_formula_id ON bom_items(formula_id);
CREATE INDEX idx_cost_profiles_product_id ON cost_profiles(product_id);
CREATE INDEX idx_cost_profiles_vendor_id ON cost_profiles(vendor_id);
CREATE INDEX idx_claims_product_id ON claims_register(product_id);
CREATE INDEX idx_testing_product_id ON testing_results(product_id);
CREATE INDEX idx_ai_insights_product_id ON ai_insights(product_id);
CREATE INDEX idx_ai_insights_status ON ai_insights(status);
CREATE INDEX idx_change_log_table_record ON change_log(table_name, record_id);
CREATE INDEX idx_change_log_changed_by ON change_log(changed_by);
CREATE INDEX idx_change_log_timestamp ON change_log(timestamp);