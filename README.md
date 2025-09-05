# FreshBasket - E-commerce Platform

A modern e-commerce platform built with Next.js 15, Supabase, and Stripe, designed for grocery delivery in Kenya.

## 🚀 Features

- **User Authentication** - Secure signup/login with email verification
- **Product Management** - Admin panel for managing products and inventory
- **Shopping Cart** - Real-time cart with quantity controls
- **Order Management** - Complete order lifecycle from placement to delivery
- **Payment Processing** - Stripe integration for secure payments
- **M-Pesa Integration** - Local payment method for Kenya
- **Email Notifications** - Order confirmations and status updates
- **Real-time Updates** - Live order status updates
- **User Profiles** - Customer profile management with addresses
- **Admin Dashboard** - Comprehensive admin panel with analytics

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Payments**: Stripe, M-Pesa Daraja API
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Stripe account
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd freshbasket
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the required variables (see Environment Variables section)

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (development) or visit [https://freshbusket.vercel.app](https://freshbusket.vercel.app) (production)

## 🔧 Environment Variables

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@example.com

# Gmail Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# M-Pesa Configuration (Optional)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=your_callback_url

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://freshbusket.vercel.app
```

## 📦 Database Setup

1. **Create a new Supabase project**
2. **Run the database migrations** (see `supabase/` directory)
3. **Set up Row Level Security (RLS) policies**
4. **Configure storage buckets** for product images and user assets

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_SITE_URL` environment variable

## 📱 Features Overview

### Customer Features

- Browse products with real-time inventory
- Add to cart with quantity controls
- Secure checkout with multiple payment options
- Order tracking and status updates
- Profile management with saved addresses
- Email notifications for order updates

### Admin Features

- Product management (CRUD operations)
- Order management with status updates
- User management
- Real-time dashboard with analytics
- Email notifications for new orders
- Inventory tracking

## 🔒 Security

- Row Level Security (RLS) policies on all database tables
- Secure authentication with Supabase Auth
- Environment variable protection
- CSRF protection
- Input validation and sanitization

## 📧 Email System

- Order confirmation emails
- Order status update notifications
- Admin notifications for new orders
- Professional HTML email templates
- Gmail SMTP integration

## 🌍 Localization

- Kenya-specific currency (KES)
- Local phone number formats
- Kenyan counties for address selection
- Timezone-aware timestamps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@freshbasket.com or create an issue in the repository.

---

**FreshBasket** - Your Online Grocery Store 🛒
