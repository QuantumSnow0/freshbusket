# 🔧 Environment Variables Reference

This document lists all environment variables required for the FreshBasket e-commerce platform.

## 📋 Required Variables

### Supabase Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**How to get:**

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

### Stripe Configuration

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

**How to get:**

1. Go to Stripe Dashboard
2. Navigate to Developers → API Keys
3. Copy the Publishable key and Secret key
4. Use test keys for development, live keys for production

### Admin Configuration

```env
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
```

**Purpose:** Email address that receives admin notifications for new orders

### Gmail Email Configuration

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

**How to get:**

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App passwords
3. Generate a new app password for "FreshBasket"
4. Use the 16-character password (not your regular Gmail password)

### Site Configuration

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Purpose:** Used for email links and redirects

## 🔧 Optional Variables

### M-Pesa Configuration (Kenya)

```env
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=https://your-domain.vercel.app/api/mpesa/callback
```

**How to get:**

1. Register at [M-Pesa Daraja API](https://developer.safaricom.co.ke/)
2. Create an app and get consumer key/secret
3. Get shortcode and passkey from Safaricom
4. Set callback URL to your deployed domain

### Stripe Webhook (Production)

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

**How to get:**

1. Go to Stripe Dashboard → Webhooks
2. Create webhook endpoint: `https://your-domain.vercel.app/api/webhook/stripe`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy the webhook signing secret

## 🏗️ Development vs Production

### Development (.env.local)

```env
# Use test/development values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key)

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_app_password

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel Environment Variables)

```env
# Use production values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key)

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
EMAIL_USER=noreply@yourdomain.com
EMAIL_APP_PASSWORD=your_app_password

NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🔒 Security Best Practices

### 1. Never Commit Secrets

- Add `.env.local` to `.gitignore`
- Use Vercel environment variables for production
- Rotate keys regularly

### 2. Use Different Keys for Different Environments

- Development: Test keys
- Staging: Test keys
- Production: Live keys

### 3. Limit Access

- Only give necessary team members access to production keys
- Use service accounts where possible
- Monitor key usage

### 4. Regular Audits

- Review environment variables quarterly
- Remove unused variables
- Update expired keys

## 🧪 Testing Environment Variables

### Local Testing

```bash
# Check if all required variables are set
npm run dev

# Look for console messages about missing variables
# Check if features work (auth, payments, emails)
```

### Production Testing

1. Deploy to Vercel preview
2. Test all functionality
3. Check Vercel function logs
4. Verify email delivery
5. Test payment flows

## 🚨 Common Issues

### Missing Variables

**Error:** `Missing environment variable`
**Solution:** Add the variable to Vercel dashboard

### Wrong Variable Names

**Error:** `undefined` values
**Solution:** Check variable names are exact (case-sensitive)

### Expired Keys

**Error:** Authentication failures
**Solution:** Generate new keys and update variables

### Wrong Environment

**Error:** Test keys in production
**Solution:** Use correct keys for each environment

## 📝 Environment Variable Checklist

### Before Deployment

- [ ] All required variables set
- [ ] Correct values for environment
- [ ] No test keys in production
- [ ] Email configuration working
- [ ] Payment keys valid
- [ ] Supabase connection working

### After Deployment

- [ ] Site loads correctly
- [ ] User registration works
- [ ] Payments process
- [ ] Emails are sent
- [ ] Admin features work
- [ ] No console errors

---

**Need Help?** Check the [Deployment Guide](./DEPLOYMENT.md) or create an issue in the repository.
