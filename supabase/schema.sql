-- Venture Template — Base Supabase Schema
-- Customize table names and fields per venture

-- Waitlist (landing page signups)
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    anon_id TEXT,
    source TEXT DEFAULT 'landing_page',
    experiment_key TEXT,
    variant_key TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- API keys
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    prefix TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Landing and experiment telemetry
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    country TEXT,
    anon_id TEXT,
    experiment_key TEXT,
    variant_key TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiment_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    anon_id TEXT NOT NULL,
    experiment_key TEXT NOT NULL,
    variant_key TEXT NOT NULL,
    first_page TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(experiment_key, anon_id)
);

CREATE TABLE IF NOT EXISTS experiment_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name TEXT NOT NULL,
    anon_id TEXT,
    email TEXT,
    experiment_key TEXT,
    variant_key TEXT,
    page TEXT,
    country TEXT,
    props JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public waitlist insert" ON waitlist FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own API keys" ON api_keys FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public page view insert" ON page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public experiment assignment access" ON experiment_assignments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public experiment event access" ON experiment_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_experiment ON page_views(experiment_key, variant_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_experiment ON waitlist(experiment_key, variant_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_lookup ON experiment_assignments(experiment_key, anon_id);
CREATE INDEX IF NOT EXISTS idx_experiment_events_created_at ON experiment_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiment_events_experiment ON experiment_events(experiment_key, variant_key, created_at DESC);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE TRIGGER experiment_assignments_updated_at
    BEFORE UPDATE ON experiment_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
