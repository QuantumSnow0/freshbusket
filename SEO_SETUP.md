# SEO Setup Guide for FreshBasket

This guide will help you set up your FreshBasket e-commerce project for optimal SEO performance on Google and other search engines.

## 🚀 **What's Been Implemented**

### 1. **Dynamic Sitemap Generation**

- ✅ `src/app/sitemap.ts` - Automatically generates sitemap.xml
- ✅ `src/app/api/sitemap/route.ts` - API endpoint for sitemap
- ✅ Includes all products, categories, and main pages
- ✅ Updates automatically when new products are added

### 2. **Robots.txt**

- ✅ `src/app/robots.ts` - Generates robots.txt
- ✅ `src/app/api/robots/route.ts` - API endpoint for robots.txt
- ✅ Allows search engines to crawl public pages
- ✅ Blocks admin, API, and private pages

### 3. **SEO Meta Tags**

- ✅ `src/lib/seo.ts` - Centralized SEO utilities
- ✅ `src/components/SEOHead.tsx` - Reusable SEO component
- ✅ Dynamic meta tags for all pages
- ✅ Open Graph and Twitter Card support
- ✅ Canonical URLs to prevent duplicate content

### 4. **Product Pages**

- ✅ `src/app/products/[id]/page.tsx` - Dynamic product pages
- ✅ `src/components/ProductDetails.tsx` - Product detail component
- ✅ Structured data (JSON-LD) for products
- ✅ Dynamic meta tags with product information

### 5. **Image Optimization**

- ✅ Next.js Image component with proper alt attributes
- ✅ WebP and AVIF format support
- ✅ Responsive image sizing
- ✅ Lazy loading for better performance

### 6. **PWA Support**

- ✅ `src/app/manifest.ts` - Web app manifest
- ✅ `public/manifest.json` - Static manifest file
- ✅ `public/browserconfig.xml` - Windows tile configuration
- ✅ Favicon and app icons

### 7. **Performance Optimization**

- ✅ Next.js Image Optimization enabled
- ✅ Compression enabled
- ✅ HTTP/2 support
- ✅ Proper caching headers
- ✅ Mobile-first responsive design

## 📋 **Setup Steps**

### 1. **Environment Variables**

Add these to your `.env.local`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://freshbusket.vercel.app
NEXT_PUBLIC_APP_URL=https://freshbusket.vercel.app

# Google Search Console
GOOGLE_SITE_VERIFICATION=your_google_site_verification_code
```

### 2. **Create Required Images**

You need to create these images in your `public` folder:

```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── mstile-150x150.png
├── og-image.jpg (1200x630)
├── hero-image.jpg
├── about-mission.jpg
├── about-story.jpg
└── categories/
    ├── fruits.jpg
    ├── vegetables.jpg
    ├── dairy.jpg
    ├── pantry.jpg
    ├── meat.jpg
    ├── beverages.jpg
    └── default.jpg
```

### 3. **Database Setup**

Make sure you have these tables in Supabase:

```sql
-- Categories table (if not exists)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
('Fruits', 'Fresh, juicy fruits from local farms'),
('Vegetables', 'Crisp, organic vegetables for healthy cooking'),
('Dairy', 'Fresh milk, cheese, and dairy products'),
('Pantry Essentials', 'Grains, spices, and cooking essentials'),
('Meat & Poultry', 'Fresh, quality meat and poultry'),
('Beverages', 'Fresh juices, teas, and healthy drinks')
ON CONFLICT (name) DO NOTHING;
```

### 4. **Deploy to Vercel**

1. Push your changes to GitHub
2. Deploy to Vercel
3. Update your environment variables in Vercel dashboard

### 5. **Google Search Console Setup**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://freshbusket.vercel.app`
3. Verify ownership using the HTML tag method
4. Submit your sitemap: `https://freshbusket.vercel.app/sitemap.xml`

## 🔍 **SEO Features**

### **Dynamic Sitemap**

- Automatically includes all products and categories
- Updates when new products are added
- Proper priority and change frequency settings
- Accessible at: `https://freshbusket.vercel.app/sitemap.xml`

### **Meta Tags**

- Dynamic titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- Mobile-friendly viewport settings

### **Structured Data**

- Product schema for rich snippets
- Organization schema for homepage
- Breadcrumb navigation
- Review and rating data

### **Performance**

- Image optimization with Next.js
- Lazy loading for images
- Compression enabled
- Mobile-first responsive design
- Fast loading times

## 📊 **Testing Your SEO**

### 1. **Check Sitemap**

Visit: `https://freshbusket.vercel.app/sitemap.xml`

### 2. **Check Robots.txt**

Visit: `https://freshbusket.vercel.app/robots.txt`

### 3. **Test Meta Tags**

Use tools like:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

### 4. **Check Page Speed**

Use tools like:

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

## 🎯 **Next Steps**

1. **Create the required images** (see list above)
2. **Set up Google Search Console** and submit your sitemap
3. **Monitor your SEO performance** using Google Search Console
4. **Add more structured data** as needed (reviews, FAQs, etc.)
5. **Optimize for local SEO** if targeting specific regions

## 📱 **Mobile Optimization**

Your site is already mobile-optimized with:

- Responsive design
- Touch-friendly buttons
- Fast loading on mobile
- PWA support for app-like experience

## 🔧 **Troubleshooting**

### **Sitemap not updating?**

- Check if products have `updated_at` timestamps
- Verify Supabase connection
- Check console for errors

### **Meta tags not showing?**

- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
- Check if images exist in public folder
- Verify product data structure

### **Images not loading?**

- Check if image files exist in public folder
- Verify Next.js image configuration
- Check Supabase storage permissions

## 📈 **SEO Best Practices Implemented**

1. ✅ **Technical SEO**

   - Clean URLs
   - Proper redirects
   - XML sitemap
   - Robots.txt
   - Canonical URLs

2. ✅ **Content SEO**

   - Unique titles and descriptions
   - Proper heading structure
   - Alt text for images
   - Internal linking

3. ✅ **Mobile SEO**

   - Responsive design
   - Fast loading
   - Touch-friendly interface
   - PWA support

4. ✅ **Local SEO**
   - Location-based content
   - Local business information
   - Contact details

Your FreshBasket project is now fully SEO-ready! 🎉
