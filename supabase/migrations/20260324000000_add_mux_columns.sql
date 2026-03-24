-- Add Mux specific columns to lessons table to support video streaming via Mux Direct Uploads
ALTER TABLE public.lessons 
  ADD COLUMN IF NOT EXISTS mux_asset_id TEXT,
  ADD COLUMN IF NOT EXISTS mux_playback_id TEXT,
  ADD COLUMN IF NOT EXISTS mux_upload_id TEXT;

-- We are keeping video_id temporarily for rollback purposes, but it will be largely unused.
