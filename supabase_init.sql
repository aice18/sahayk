-- Drop if exists (Caution: this removes existing data)
DROP TABLE IF EXISTS "public"."schemes";

-- Create Schemes Table
CREATE TABLE "public"."schemes" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "title" TEXT NOT NULL,
    "titleKey" TEXT,
    "description" TEXT NOT NULL,
    "descriptionKey" TEXT,
    "ministry" TEXT,
    "category" TEXT NOT NULL,
    "eligibility" JSONB DEFAULT '[]'::jsonb,
    "benefits" JSONB DEFAULT '[]'::jsonb,
    "documents" JSONB DEFAULT '[]'::jsonb,
    "imageUrl" TEXT,
    "tags" JSONB DEFAULT '[]'::jsonb
);

-- Enable Request-Level Security (RLS)
ALTER TABLE "public"."schemes" ENABLE ROW LEVEL SECURITY;

-- Create Policy for Public Read Access
CREATE POLICY "Enable read access for all users" ON "public"."schemes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- (Optional) If you want to enable inserting from anon key (Not recommended for prod)
CREATE POLICY "Enable insert access for all users" ON "public"."schemes"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);
