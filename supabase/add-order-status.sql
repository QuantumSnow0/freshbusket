-- Add order_status column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_status TEXT NOT NULL DEFAULT 'pending' 
CHECK (order_status IN ('pending', 'processed', 'shipped', 'delivered', 'cancelled'));

-- Create index for order_status for better performance
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);

-- Update existing orders to have 'processed' status if they are paid
UPDATE orders 
SET order_status = 'processed' 
WHERE payment_status = 'paid' AND order_status = 'pending';

