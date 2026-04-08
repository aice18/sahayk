-- Drop existing tables if they exist
DROP TABLE IF EXISTS "public"."user_interests";
DROP TABLE IF EXISTS "public"."interest_categories";
DROP TABLE IF EXISTS "public"."schemes";

-- ===== INTEREST CATEGORIES TABLE =====
CREATE TABLE "public"."interest_categories" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "display_order" INT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===== SCHEMES TABLE (Updated) =====
CREATE TABLE "public"."schemes" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "title" TEXT NOT NULL,
    "titleKey" TEXT,
    "description" TEXT NOT NULL,
    "descriptionKey" TEXT,
    "ministry" TEXT,
    "category" TEXT NOT NULL,
    "interests" JSONB DEFAULT '[]'::jsonb,
    "eligibility" JSONB DEFAULT '[]'::jsonb,
    "benefits" JSONB DEFAULT '[]'::jsonb,
    "documents" JSONB DEFAULT '[]'::jsonb,
    "imageUrl" TEXT,
    "tags" JSONB DEFAULT '[]'::jsonb,
    "popularity_score" INT DEFAULT 0,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===== USER INTERESTS TABLE =====
CREATE TABLE "public"."user_interests" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "interest_id" TEXT NOT NULL REFERENCES "public"."interest_categories"("id"),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE("user_id", "interest_id")
);

-- ===== USER PROFILE EXTENSION (for storing interests) =====
CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" TEXT PRIMARY KEY,
    "phone" TEXT UNIQUE,
    "full_name" TEXT,
    "age" INT,
    "annual_income" TEXT,
    "occupation" TEXT,
    "interests" JSONB DEFAULT '[]'::jsonb,
    "preferences" JSONB DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE "public"."schemes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."interest_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_interests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for schemes (Public read access)
CREATE POLICY "Enable read access for schemes" ON "public"."schemes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Create RLS Policies for interest categories (Public read access)
CREATE POLICY "Enable read access for categories" ON "public"."interest_categories"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Create RLS Policies for user interests
CREATE POLICY "Users can view their own interests" ON "public"."user_interests"
AS PERMISSIVE FOR SELECT
TO public
USING (user_id = current_user_id());

CREATE POLICY "Users can insert their own interests" ON "public"."user_interests"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (user_id = current_user_id());

CREATE POLICY "Users can delete their own interests" ON "public"."user_interests"
AS PERMISSIVE FOR DELETE
TO public
USING (user_id = current_user_id());

-- Create RLS Policies for user profiles
CREATE POLICY "Users can view their own profile" ON "public"."user_profiles"
AS PERMISSIVE FOR SELECT
TO public
USING (id = current_user_id());

CREATE POLICY "Users can update their own profile" ON "public"."user_profiles"
AS PERMISSIVE FOR UPDATE
TO public
USING (id = current_user_id());

CREATE POLICY "Users can insert their own profile" ON "public"."user_profiles"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (id = current_user_id());

-- Insert interest categories
INSERT INTO "public"."interest_categories" ("id", "name", "icon", "color", "display_order") VALUES
('agriculture', 'Agriculture & Farming', '🌾', '#60A744', 1),
('healthcare', 'Healthcare & Medical', '🏥', '#E74C3C', 2),
('education', 'Education & Scholarships', '📚', '#3498DB', 3),
('housing', 'Housing & Infrastructure', '🏠', '#E67E22', 4),
('business', 'Business & Entrepreneurship', '💼', '#9B59B6', 5),
('women', 'Women Empowerment', '👩', '#F39C12', 6),
('youth', 'Youth & Sports', '⚽', '#1ABC9C', 7),
('elderly', 'Elderly & Pension', '👴', '#95A5A6', 8),
('disability', 'Disability & Welfare', '♿', '#34495E', 9),
('employment', 'Employment & Skill',  '💪', '#16A085', 10),
('finance', 'Financial Services', '🏦', '#D35400', 11),
('environment', 'Environment & Climate', '🌱', '#27AE60', 12),
('social', 'Social Welfare', '🤝', '#2980B9', 13),
('digital', 'Digital & Technology', '💻', '#2C3E50', 14),
('energy', 'Energy & Renewable', '⚡', '#F1C40F', 15),
('rural', 'Rural Development', '🏘️', '#7F8C8D', 16),
('urban', 'Urban Development', '🏙️', '#34495E', 17);

-- Create indexes for better query performance
CREATE INDEX "schemes_interests_idx" ON "public"."schemes" USING GIN ("interests");
CREATE INDEX "schemes_category_idx" ON "public"."schemes" ("category");
CREATE INDEX "schemes_tags_idx" ON "public"."schemes" USING GIN ("tags");
CREATE INDEX "user_interests_user_idx" ON "public"."user_interests" ("user_id");
CREATE INDEX "user_profiles_interests_idx" ON "public"."user_profiles" USING GIN ("interests");
