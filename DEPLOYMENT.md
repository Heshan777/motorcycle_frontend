# 🚀 Production Deployment Guide

This guide covers everything needed to deploy the Heshan Moto application to production with enterprise-grade standards.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors fixed
- [ ] Code follows consistent style
- [ ] Unused imports removed
- [ ] No console.log() statements in production code
- [ ] All components properly typed
- [ ] Error boundaries in place

### Testing
- [ ] Manual testing on Chrome, Firefox, Safari, Edge
- [ ] Mobile responsiveness verified on multiple devices
- [ ] All forms tested with valid/invalid inputs
- [ ] Authentication flow tested
- [ ] Protected routes tested
- [ ] Admin features tested

### Performance
- [ ] Production build succeeds
- [ ] Bundle size < 600kb gzipped
- [ ] Images optimized
- [ ] Unnecessary dependencies removed
- [ ] Code splitting configured properly

### Security
- [ ] No sensitive data in code
- [ ] Environment variables properly set
- [ ] CORS configured correctly
- [ ] Auth tokens handled securely
- [ ] SQL injection prevention (backend)
- [ ] XSS protection enabled

### UX/Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Alt text on all images
- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels properly associated
- [ ] Loading states visible
- [ ] Error messages clear

## 🌍 Deployment Platforms

### Option 1: Vercel (Recommended)

**Advantages**: Zero-config, automatic edge caching, built-in analytics

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Environment Variables**
Set in Vercel Dashboard → Project Settings → Environment Variables:
```
VITE_API_BASE_URL=https://api.motorcyclehub.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Option 2: Netlify

**Advantages**: Generous free tier, built-in forms, easy configuration

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
netlify deploy --prod
```

**netlify.toml Configuration**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_BASE_URL = "https://api.motorcyclehub.com"
```

### Option 3: AWS S3 + CloudFront

**Advantages**: Highly scalable, global distribution, fine-grained control

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Option 4: GitHub Pages

**Advantages**: Free, simple for static sites

Update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/repository-name/',
  // ...
})
```

Then push to GitHub and enable Pages in repository settings.

## 🔒 Security Configuration

### Environment Variables (.env.local)

Never commit `.env.local` - use `.env.example` instead.

```env
VITE_API_BASE_URL=https://api.motorcyclehub.com
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=anon_key_here
VITE_ENVIRONMENT=production
```

### Headers Configuration

Add to your web server or CDN:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### API Security

```tsx
// Secure API calls with CSRF tokens
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Always validate server response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiry
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📊 Performance Optimization

### Image Optimization

```tsx
// Use next-gen formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="description" loading="lazy" />
</picture>

// Responsive images
<img
  src="image.jpg"
  srcSet="image-small.jpg 640w, image-medium.jpg 1024w, image-large.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 100vw"
  alt="description"
/>
```

### Code Splitting

Routes are automatically code-split by React Router. No additional configuration needed.

### Caching Strategy

```
- HTML: no-cache
- CSS/JS: immutable (includes hash)
- Images: max-age=31536000
- API: no-cache, must-revalidate
```

## 🔄 Continuous Integration/Deployment

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Monitoring & Analytics

### Web Vitals

```tsx
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking

```tsx
// Use Sentry or similar
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT,
});
```

### Analytics

```tsx
// Google Analytics or similar
import ReactGA from 'react-ga4';

ReactGA.initialize('GA_MEASUREMENT_ID');
ReactGA.send({ hitType: 'pageview' });
```

## 🐛 Troubleshooting

### Blank Page on Load
- Check browser console for errors
- Verify API_BASE_URL is correct
- Check network tab for failed requests
- Clear browser cache and rebuild

### 404 on Page Refresh
- Configure server to serve `index.html` for all routes
- Vercel: automatic
- Netlify: use netlify.toml
- S3: configure CloudFront error page

### Slow Performance
- Check bundle size: `npm run build` output
- Enable gzip compression on server
- Use CDN for static assets
- Optimize images
- Enable service workers for offline support

### Authentication Issues
- Verify API endpoint is accessible
- Check CORS configuration
- Ensure tokens are stored correctly
- Verify session timeout settings

## 🔄 Rollback Procedure

### Vercel
```bash
vercel rollback
```

### Netlify
Deploy previous build from dashboard

### S3 + CloudFront
Sync previous dist/ folder version to S3

## 📱 Mobile Considerations

- All pages responsive on 320px+
- Touch targets minimum 44x44px
- No hover-only interactions
- Optimize for 4G connections
- Test on actual devices (iOS/Android)

## 📞 Post-Deployment

1. Verify all pages load correctly
2. Test authentication flow
3. Check API communication
4. Monitor error logs
5. Collect user feedback
6. Plan next iteration

## 🚦 Rollback Criteria

Immediately rollback if:
- Authentication not working
- Critical API endpoints down
- Data corruption
- Security breach
- Database connectivity issues

## 📅 Maintenance Schedule

- **Daily**: Check error logs and monitoring
- **Weekly**: Review performance metrics
- **Monthly**: Security updates and dependency checks
- **Quarterly**: Full load testing and optimization

---

**For support**: support@motorcyclehub.com
