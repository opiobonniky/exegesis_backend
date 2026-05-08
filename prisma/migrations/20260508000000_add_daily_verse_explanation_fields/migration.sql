-- Add explanation and learn_more columns to daily_verse table
ALTER TABLE "daily_verse" ADD COLUMN IF NOT EXISTS "explanation" TEXT;
ALTER TABLE "daily_verse" ADD COLUMN IF NOT EXISTS "learn_more" TEXT;