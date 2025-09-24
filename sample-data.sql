-- Pristine Portfolio Tool - Sample Data
-- Execute after schema.sql: wrangler d1 execute pristine-portfolio-db --file=sample-data.sql

-- Insert sample users
INSERT INTO users (id, email, name, role, status, preferences) VALUES
('user_001', 'admin@pristine.com', 'Pristine Admin', 'owner', 'active', '{"theme": "light", "notifications": true}'),
('user_002', 'product@pristine.com', 'Product Manager', 'admin', 'active', '{"theme": "light", "notifications": true}'),
('user_003', 'formulator@pristine.com', 'Lead Formulator', 'contributor', 'active', '{"theme": "light", "notifications": false}'),
('user_004', 'viewer@pristine.com', 'Business Analyst', 'viewer', 'active', '{"theme": "dark", "notifications": true}');

-- Insert sample ingredients
INSERT INTO ingredients (id, name, inci_name, cas_number, category, function, supplier, cost_per_kg, min_percentage, max_percentage, certifications) VALUES
('ing_001', 'Zinc Ricinoleate', 'Zinc Ricinoleate', '13040-19-2', 'active', 'Odor neutralization', 'Givaudan', 45.50, 4.0, 12.0, '["Natural", "Vegan"]'),
('ing_002', 'Coconut Oil', 'Cocos Nucifera Oil', '8001-31-8', 'base', 'Moisturizing base', 'Cargill', 8.75, 15.0, 35.0, '["Organic", "Fair Trade", "Vegan"]'),
('ing_003', 'Shea Butter', 'Butyrospermum Parkii Butter', '194043-92-0', 'base', 'Moisturizing and nourishing', 'AAK', 12.30, 5.0, 20.0, '["Organic", "Fair Trade"]'),
('ing_004', 'Magnesium Hydroxide', 'Magnesium Hydroxide', '1309-42-8', 'active', 'Odor control', 'Premier Magnesia', 3.20, 2.0, 8.0, '["Natural"]'),
('ing_005', 'Candelilla Wax', 'Euphorbia Cerifera Wax', '8006-44-8', 'base', 'Structure and consistency', 'KahlWax', 28.90, 3.0, 8.0, '["Vegan", "Natural"]'),
('ing_006', 'Bergamot Essential Oil', 'Citrus Bergamia Peel Oil', '8007-75-8', 'fragrance', 'Natural fragrance', 'Citrus & Allied', 85.00, 0.5, 2.0, '["Natural", "Organic"]'),
('ing_007', 'Probiotics Complex', 'Lactobacillus Ferment', '68917-73-7', 'active', 'Skin microbiome support', 'Chr. Hansen', 120.00, 1.0, 3.0, '["Natural"]'),
('ing_008', 'Chitosan', 'Chitosan', '9012-76-4', 'active', 'Antimicrobial protection', 'KitoZyme', 65.50, 1.0, 3.0, '["Natural"]');

-- Insert sample products
INSERT INTO products (id, name, description, sku, category, status, brand, size, target_price, current_version, regulatory_status, created_by, tags) VALUES
('prod_001', 'Zinc Defense Pro', 'Premium natural deodorant with advanced zinc ricinoleate complex', 'ZDP-001', 'deodorant', 'active', 'Pristine', '2.5 oz', 24.99, '2.1', 'compliant', 'user_001', '["Premium", "Natural", "Long-lasting"]'),
('prod_002', 'Essential Daily Deodorant', 'Everyday natural protection with organic ingredients', 'EDD-001', 'deodorant', 'active', 'Pristine', '2.2 oz', 14.99, '1.3', 'compliant', 'user_002', '["Affordable", "Organic", "Daily Use"]'),
('prod_003', 'Sensitive Skin Formula', 'Gentle natural deodorant for sensitive skin', 'SSF-001', 'deodorant', 'development', 'Pristine', '2.0 oz', 18.99, '1.0', 'needs_review', 'user_003', '["Sensitive", "Hypoallergenic", "Gentle"]'),
('prod_004', 'Sport Performance Deodorant', '24-hour protection for active lifestyles', 'SPD-001', 'deodorant', 'testing', 'Pristine', '3.0 oz', 29.99, '1.5', 'pending', 'user_001', '["Sport", "24-Hour", "Active"]'),
('prod_005', 'Travel Size Essential', 'Compact size for travel and on-the-go', 'TSE-001', 'deodorant', 'concept', 'Pristine', '1.0 oz', 8.99, '1.0', 'pending', 'user_002', '["Travel", "Compact", "Convenient"]');

-- Insert sample formulas
INSERT INTO formulas (id, product_id, version, name, description, status, ph_range, organic_content, total_percentage, created_by, approved_by, approval_date) VALUES
('form_001', 'prod_001', '2.1', 'Zinc Defense Pro v2.1', 'Enhanced formula with probiotic boost', 'production', '6.8-7.2', 68.5, 100.0, 'user_003', 'user_001', '2024-01-15'),
('form_002', 'prod_002', '1.3', 'Essential Daily v1.3', 'Optimized cost formula with maintained efficacy', 'production', '6.5-7.0', 72.0, 100.0, 'user_003', 'user_002', '2024-01-10'),
('form_003', 'prod_003', '1.0', 'Sensitive Skin v1.0', 'Gentle formula without baking soda', 'testing', '6.8-7.0', 65.0, 100.0, 'user_003', NULL, NULL),
('form_004', 'prod_004', '1.5', 'Sport Performance v1.5', 'Maximum strength formula for athletes', 'approved', '6.5-7.2', 55.0, 100.0, 'user_003', 'user_001', '2024-01-20'),
('form_005', 'prod_005', '1.0', 'Travel Size v1.0', 'Concentrated formula for smaller size', 'draft', '6.8-7.0', 70.0, 95.0, 'user_003', NULL, NULL);

-- Insert sample BOM items
INSERT INTO bom_items (id, formula_id, ingredient_id, percentage, sort_order, is_active) VALUES
-- Zinc Defense Pro v2.1
('bom_001', 'form_001', 'ing_002', 28.0, 1, FALSE), -- Coconut Oil
('bom_002', 'form_001', 'ing_003', 15.0, 2, FALSE), -- Shea Butter  
('bom_003', 'form_001', 'ing_005', 6.0, 3, FALSE),  -- Candelilla Wax
('bom_004', 'form_001', 'ing_001', 8.0, 4, TRUE),   -- Zinc Ricinoleate
('bom_005', 'form_001', 'ing_004', 4.0, 5, TRUE),   -- Magnesium Hydroxide
('bom_006', 'form_001', 'ing_007', 2.0, 6, TRUE),   -- Probiotics Complex
('bom_007', 'form_001', 'ing_008', 2.0, 7, TRUE),   -- Chitosan
('bom_008', 'form_001', 'ing_006', 1.5, 8, FALSE),  -- Bergamot Oil

-- Essential Daily v1.3  
('bom_009', 'form_002', 'ing_002', 32.0, 1, FALSE), -- Coconut Oil
('bom_010', 'form_002', 'ing_003', 12.0, 2, FALSE), -- Shea Butter
('bom_011', 'form_002', 'ing_005', 5.0, 3, FALSE),  -- Candelilla Wax
('bom_012', 'form_002', 'ing_001', 6.0, 4, TRUE),   -- Zinc Ricinoleate
('bom_013', 'form_002', 'ing_004', 3.0, 5, TRUE),   -- Magnesium Hydroxide
('bom_014', 'form_002', 'ing_006', 1.0, 6, FALSE);  -- Bergamot Oil

-- Insert sample vendors
INSERT INTO vendors (id, name, type, contact_name, contact_email, website, status, capabilities, certifications, score) VALUES
('vend_001', 'Natural Formulations Co', 'co_packer', 'Sarah Johnson', 'sarah@naturalform.com', 'https://naturalformulations.com', 'active', '["Formulation", "Manufacturing", "Packaging", "Quality Control"]', '["GMP", "Organic", "FDA Registered"]', 92.5),
('vend_002', 'EcoPack Solutions', 'packaging', 'Mike Chen', 'mike@ecopack.com', 'https://ecopacksolutions.com', 'active', '["Sustainable Packaging", "Custom Design", "Compostable Materials"]', '["FSC", "BPI Certified", "Carbon Neutral"]', 88.0),
('vend_003', 'Premium Ingredients Ltd', 'ingredient_supplier', 'Emma Rodriguez', 'emma@premiuming.com', 'https://premiumingredients.com', 'active', '["Organic Sourcing", "Quality Testing", "Bulk Supply"]', '["Organic", "Fair Trade", "USDA Certified"]', 90.0),
('vend_004', 'ShipSmart Logistics', 'fulfillment', 'David Kim', 'david@shipsmart.com', 'https://shipsmartlogistics.com', 'active', '["3PL Services", "FBA Prep", "International Shipping"]', '["ISO 9001", "C-TPAT"]', 85.5);

-- Insert sample cost profiles
INSERT INTO cost_profiles (id, product_id, vendor_id, volume_tier, unit_cost, tooling_cost, moq, lead_time_days, projected_msrp, gross_margin) VALUES
('cost_001', 'prod_001', 'vend_001', 1000, 8.50, 2500.00, 1000, 21, 24.99, 66.0),
('cost_002', 'prod_001', 'vend_001', 3000, 7.25, 2500.00, 3000, 18, 24.99, 71.0),
('cost_003', 'prod_001', 'vend_001', 5000, 6.75, 2500.00, 5000, 15, 24.99, 73.0),
('cost_004', 'prod_002', 'vend_001', 1000, 5.20, 1500.00, 1000, 14, 14.99, 65.3),
('cost_005', 'prod_002', 'vend_001', 5000, 4.50, 1500.00, 5000, 12, 14.99, 70.0);

-- Insert sample AI insights
INSERT INTO ai_insights (id, type, product_id, title, description, confidence_score, priority, status, proposed_changes) VALUES
('ai_001', 'formula_optimization', 'prod_001', 'Zinc Concentration Optimization', 'Analysis suggests reducing zinc ricinoleate to 6% could maintain efficacy while reducing costs by $0.85 per unit', 87, 'high', 'pending', '{"ingredient_changes": {"ing_001": {"current": 8.0, "proposed": 6.0}}, "cost_impact": -0.85, "efficacy_impact": "minimal"}'),
('ai_002', 'market_analysis', 'prod_003', 'Sensitive Skin Market Opportunity', 'Market analysis indicates 35% growth in sensitive skin deodorant segment with premium pricing potential', 92, 'medium', 'reviewed', '{"market_size": "growing", "competition": "moderate", "pricing_opportunity": "15-20% premium"}'),
('ai_003', 'cost_optimization', 'prod_002', 'Packaging Cost Reduction', 'Switch to alternative tube supplier could reduce packaging costs by 18% without quality impact', 78, 'medium', 'pending', '{"supplier_change": "vend_004", "cost_reduction": 0.32, "quality_impact": "none"}');

-- Insert sample claims register
INSERT INTO claims_register (id, product_id, claim_text, claim_type, regulatory_status, substantiation_required, test_protocol, regulatory_body) VALUES
('claim_001', 'prod_001', '24-Hour Odor Protection', 'efficacy', 'allowed', TRUE, 'Clinical efficacy test - 24 hour wear test', 'FDA'),
('claim_002', 'prod_001', 'Natural Ingredients', 'ingredient', 'allowed', FALSE, 'Ingredient verification', 'FDA'),
('claim_003', 'prod_002', 'Organic Formula', 'ingredient', 'allowed', TRUE, 'USDA Organic certification', 'USDA'),
('claim_004', 'prod_003', 'Gentle for Sensitive Skin', 'safety', 'pending_review', TRUE, 'Dermatologist patch testing', 'FDA');

-- Insert sample testing results
INSERT INTO testing_results (id, product_id, formula_id, test_type, protocol, sample_size, test_duration, results_summary, pass_fail, score, test_lab, test_date) VALUES
('test_001', 'prod_001', 'form_001', 'efficacy', '24-hour wear test with 30 subjects', 30, '24 hours', 'Average protection: 22.5 hours. 87% of subjects maintained odor control for full 24 hours.', 'pass', 87.0, 'Consumer Testing Labs', '2024-01-12'),
('test_002', 'prod_001', 'form_001', 'safety', 'Dermatologist patch test', 50, '48 hours', 'No adverse reactions. Irritation score: 0.2/10 average.', 'pass', 98.0, 'Dermatest Institute', '2024-01-08'),
('test_003', 'prod_002', 'form_002', 'efficacy', '12-hour wear test with 25 subjects', 25, '12 hours', 'Average protection: 11.8 hours. 92% maintained odor control for 12+ hours.', 'pass', 92.0, 'Consumer Testing Labs', '2024-01-05');

-- Insert sample fulfillment partners
INSERT INTO fulfillment_partners (id, name, type, cost_per_order, cost_per_unit, storage_cost, capabilities, regions_served, status) VALUES
('fulfill_001', 'ShipBob', '3PL', 2.95, 0.50, 0.15, '["Pick and Pack", "Inventory Management", "Returns Processing"]', '["US", "Canada", "EU"]', 'active'),
('fulfill_002', 'Amazon FBA', 'FBA', 3.22, 0.75, 0.12, '["Prime Shipping", "Customer Service", "Returns"]', '["US", "Canada", "Mexico", "EU", "Asia"]', 'active'),
('fulfill_003', 'Direct Shipping', 'direct', 1.50, 0.25, 0.05, '["Custom Packaging", "Direct Ship"]', '["US"]', 'active');

-- Insert sample marketing campaigns
INSERT INTO marketing_campaigns (id, product_id, name, channel, budget_allocated, budget_spent, start_date, end_date, status, target_audience, roi) VALUES
('camp_001', 'prod_001', 'Premium Natural Launch', 'paid_ads', 15000.00, 12500.00, '2024-01-01', '2024-02-29', 'active', 'Health-conscious consumers aged 25-45', 3.2),
('camp_002', 'prod_002', 'Essential Daily SEO', 'SEO', 5000.00, 3200.00, '2024-01-15', '2024-06-15', 'active', 'Budget-conscious natural product users', 2.8),
('camp_003', 'prod_001', 'Influencer Partnership', 'influencer', 8000.00, 6800.00, '2024-02-01', '2024-03-31', 'active', 'Fitness and wellness enthusiasts', 4.1);

-- Update formula total percentages based on BOM items
UPDATE formulas SET total_percentage = (
    SELECT COALESCE(SUM(percentage), 0) 
    FROM bom_items 
    WHERE bom_items.formula_id = formulas.id
) WHERE id IN ('form_001', 'form_002');