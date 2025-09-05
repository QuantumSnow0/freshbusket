-- Add Stripe session ID field to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN orders.stripe_session_id IS 'Stripe Checkout Session ID for payment tracking';

-- Update existing orders to have empty session ID (optional)
UPDATE orders 
SET stripe_session_id = '' 
WHERE stripe_session_id IS NULL;


