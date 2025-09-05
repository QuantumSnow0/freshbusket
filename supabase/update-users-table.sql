-- Add profile picture and phone columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create index for phone
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

