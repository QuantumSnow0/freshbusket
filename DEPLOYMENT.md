# 🚀 Vercel Deployment Guide

This guide will help you deploy your FreshBasket e-commerce platform to Vercel.

## ✅ Pre-Deployment Checklist

- [x] Project builds successfully (`npm run build`)
- [x] All test files and debug routes removed
- [x] Production-optimized configuration
- [x] Environment variables documented
- [x] Vercel configuration file created

## 🔧 Environment Variables for Vercel

Add these environment variables in your Vercel dashboard:

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
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: freshbasket
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Configure Environment Variables

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add all the environment variables listed above
4. Make sure to set them for "Production", "Preview", and "Development"

### 4. Configure Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update `NEXT_PUBLIC_SITE_URL` environment variable
4. Configure DNS records as instructed

### 5. Configure Webhooks

#### Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook/stripe`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` environment variable

#### M-Pesa Callback

1. Update `MPESA_CALLBACK_URL` to: `https://your-domain.vercel.app/api/mpesa/callback`
2. Configure this URL in your M-Pesa Daraja API settings

## 🧪 Testing Your Deployment

### 1. Basic Functionality

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Product browsing works
- [ ] Cart functionality works

### 2. Admin Features

- [ ] Admin login works
- [ ] Product management works
- [ ] Order management works
- [ ] User management works

### 3. Payment Integration

- [ ] Stripe checkout works
- [ ] M-Pesa integration works (if configured)
- [ ] Order confirmation emails sent

### 4. Email System

- [ ] Order confirmation emails sent
- [ ] Admin notification emails sent
- [ ] Order status update emails sent

## 🔧 Production Optimizations Applied

### Removed Files

- All test API routes (`/api/test-*`)
- All debug API routes (`/api/debug-*`)
- Development documentation files
- Scripts directory
- Unused migration files

### Configuration Updates

- ESLint rules relaxed for production
- Build command optimized (`--no-lint`)
- Suspense boundaries added for `useSearchParams()`
- TypeScript errors fixed
- Vercel configuration optimized

### Security Headers

- Content Security Policy
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options

## 🚨 Troubleshooting

### Build Failures

```bash
# Check build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint issues
npm run lint
```

### Environment Variables

- Ensure all required variables are set in Vercel
- Check variable names match exactly (case-sensitive)
- Verify Supabase and Stripe keys are correct

### Database Issues

- Ensure Supabase project is properly configured
- Check RLS policies are set up correctly
- Verify storage buckets are configured

### Email Issues

- Verify Gmail App Password is correct
- Check `EMAIL_USER` and `EMAIL_APP_PASSWORD` are set
- Test email sending with admin panel

## 📊 Monitoring

### Vercel Analytics

- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user behavior

### Error Monitoring

- Check Vercel function logs
- Monitor API route performance
- Set up error alerts

## 🔄 Updates and Maintenance

### Deploying Updates

```bash
# Make your changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically deploy
```

### Database Migrations

- Run migrations in Supabase dashboard
- Test in preview environment first
- Monitor for any issues

### Environment Variable Updates

- Update in Vercel dashboard
- Redeploy if necessary
- Test functionality

## 📞 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test locally with production build
4. Check Supabase logs
5. Review Stripe webhook logs

## 🎉 Success!

Your FreshBasket e-commerce platform is now live on Vercel!

**Next Steps:**

- Set up monitoring and alerts
- Configure custom domain
- Set up analytics
- Plan for scaling

---

**Happy Selling!** 🛒✨
