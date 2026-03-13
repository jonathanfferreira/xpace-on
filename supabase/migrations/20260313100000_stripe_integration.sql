-- Migration: Stripe Integration Fields
-- Added at: 2026-03-13

-- Add Stripe Account ID to Tenants (for Stripe Connect)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- Add Stripe Customer ID to Users
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add Stripe IDs to Courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Add Stripe IDs to Subscription Plans
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_account ON tenants(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_courses_stripe_price ON courses(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_stripe_price ON subscription_plans(stripe_price_id);
