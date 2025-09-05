-- Add mobile number field to orders table
-- Run this in your Supabase SQL Editor

-- Add customer_mobile column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_mobile TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN orders.customer_mobile IS 'Customer mobile phone number for delivery contact';

-- Update existing orders to have empty mobile number (optional)
UPDATE orders 
SET customer_mobile = '' 
WHERE customer_mobile IS NULL;

-- Show the updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;



