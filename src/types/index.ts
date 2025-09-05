// Database Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  stock_quantity: number;
  discount_type?: "percentage" | "fixed";
  discount_value?: number; // percentage (0-100) or fixed amount
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  shipping_address?: Address;
  billing_address?: Address;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id?: string;
  type: "shipping" | "billing";
  full_name: string;
  street: string;
  city: string;
  county: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  shipping_address?: Address;
  billing_address?: Address;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  original_price?: number; // Price before discount
  discounted_price?: number; // Price after discount
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  payment_status: "pending" | "paid" | "failed" | "refunded" | "expired";
  order_status?:
    | "pending"
    | "processed"
    | "shipped"
    | "delivered"
    | "cancelled";
  delivery_address: string;
  customer_mobile?: string;
  stripe_session_id?: string;
  created_at: string;
  updated_at?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Payment Types
export type PaymentProvider = "stripe" | "mpesa";
export type PaymentStatus = "pending" | "success" | "failed" | "cancelled";

export interface Payment {
  id: string;
  user_id: string;
  order_id?: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transaction_id?: string;
  external_id?: string;
  phone_number?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
}

export interface MpesaSTKPushRequest {
  phone_number: string;
  amount: number;
  order_id?: string;
}

export interface MpesaSTKPushResponse {
  success: boolean;
  message?: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface CheckoutForm {
  email: string;
  name: string;
  mobile: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}
