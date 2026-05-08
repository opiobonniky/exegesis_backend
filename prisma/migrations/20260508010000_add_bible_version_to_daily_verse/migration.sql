-- Add bible_version column to daily_verse table
ALTER TABLE "daily_verse" ADD COLUMN IF NOT EXISTS "bible_version" TEXT;