# 🚀 Deployment Guide - Windows XP Portfolio

Complete guide for deploying your Windows XP Portfolio to GitHub Pages.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Configuration](#configuration)
4. [Deployment Methods](#deployment-methods)
5. [Troubleshooting](#troubleshooting)
6. [Performance Optimization](#performance-optimization)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ Git installed locally
- ✅ Node.js 18+ and npm 8+
- ✅ Repository forked or cloned

---

## 🎯 Quick Setup

### Step 1: Fork or Clone Repository

```bash
# Clone the repository
git clone https://github.com/rishithchintala/portfolio-xp.git
cd portfolio-xp

# Or fork via GitHub UI and clone your fork
git clone https://github.com/YOUR_USERNAME/portfolio-xp.git
cd portfolio-xp
```

### Step 2: Update Configuration

#### A. Update `package.json`

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
  }
}
```

#### B. Update `vite.config.ts`

```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // Change this to match your repository name
  // ... rest of config
})
```

#### C. Update `index.html` (if using custom paths)

```html
<!-- Update manifest and service worker paths if needed -->
<link rel="manifest" href="/YOUR_REPO_NAME/manifest.json" />
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Save the settings

### Step 4: Deploy!

```bash
# Commit your changes
git add .
git commit -m "feat: configure for deployment"

# Push to main branch
git push origin main
```

**That's it!** GitHub Actions will automatically build and deploy your site.

---

## 🔧 Configuration Details

### Environment Variables

No environment variables needed! All configuration is handled through:
- `vite.config.ts` - Build configuration
- `package.json` - Repository settings
- `index.html` - Meta tags and PWA settings

### Build Configuration

The project uses optimized build settings in `vite.config.ts`:

```typescript
{
  // Code splitting for optimal caching
  manualChunks: {
    'vendor-react': React & React-DOM
    'vendor-motion': Framer Motion
    'vendor-icons': Lucide Icons
    'ui-components': ShadCN components
    'constants': Data files
    'hooks': Custom hooks
  },
  
  // Aggressive minification
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,     // Remove console.logs
      drop_debugger: true,    // Remove debugger
      passes: 2,              // 2-pass optimization
    }
  },
  
  // CSS optimization
  cssMinify: 'lightningcss',
}
```

---

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (Recommended) ⭐

**Zero-configuration deployment** using GitHub Actions:

1. Push to `main` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Runs TypeScript checks
   - Builds the project
   - Deploys to GitHub Pages

**Monitor deployment:**
- Check the **Actions** tab in your repository
- Build typically takes 1-2 minutes
- Site updates automatically after successful build

### Method 2: Manual Deployment

```bash
# Install gh-pages if not installed
npm install -g gh-pages

# Build and deploy manually
npm run deploy
```

This will:
1. Build the project
2. Create/update `gh-pages` branch
3. Push to GitHub Pages

---

## 🐛 Troubleshooting

### Issue: 404 Error on GitHub Pages

**Solution:**
1. Check that GitHub Pages is enabled in Settings
2. Verify `base` path in `vite.config.ts` matches repo name
3. Ensure `homepage` in `package.json` is correct
4. Wait 5-10 minutes for DNS propagation

### Issue: Blank Page After Deployment

**Solutions:**
1. **Check Console Errors** - Open browser DevTools
2. **Verify Base Path** - Must match repository name exactly
3. **Clear Cache** - Hard refresh with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. **Check Build** - Run `npm run build` locally to test

### Issue: Assets Not Loading

**Solutions:**
1. Verify all asset paths are relative
2. Check `public/` folder structure
3. Ensure `base` path includes trailing slash: `/repo-name/`
4. Clear browser cache and service worker

### Issue: GitHub Actions Failing

**Common Causes:**
1. **Node Version** - Workflow uses Node 20, verify `package.json` compatibility
2. **Missing Dependencies** - Run `npm install` locally
3. **TypeScript Errors** - Fix with `npm run type-check`
4. **Build Errors** - Test with `npm run build`

**Debug Steps:**
```bash
# Check TypeScript
npm run type-check

# Test build locally
npm run build

# Preview built site
npm run preview
```

---

## ⚡ Performance Optimization

### Current Optimizations

✅ **Bundle Size:** < 400KB gzipped
✅ **Code Splitting:** 6+ optimized chunks
✅ **Minification:** 2-pass Terser compression
✅ **CSS Optimization:** Lightning CSS minification
✅ **Tree Shaking:** Unused code removed
✅ **Console Removal:** All console.logs stripped
✅ **Source Maps:** Disabled in production

### Additional Optimizations

#### 1. Enable Compression (Recommended)

Add to your GitHub Pages repository:

**Create `.htaccess` file:**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

#### 2. Preload Critical Assets

In `index.html`:
```html
<link rel="preload" href="/portfolio-xp/assets/main-[hash].js" as="script">
<link rel="preload" href="/portfolio-xp/assets/main-[hash].css" as="style">
```

#### 3. Service Worker Caching

Already configured! The service worker caches:
- Static assets
- JavaScript bundles
- CSS files
- Images

**Clear cache:**
```javascript
// In DevTools Console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

---

## 📊 Monitoring Deployment

### Check Build Status

1. Go to **Actions** tab on GitHub
2. Click on latest workflow run
3. Monitor build steps in real-time
4. Green checkmark = successful deployment ✅
5. Red X = failed deployment ❌

### Verify Live Site

After successful deployment:

1. **Check URL:** `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
2. **Test Features:**
   - Welcome screen loads
   - Desktop icons clickable
   - Windows draggable
   - Games functional
   - Achievements working
3. **Check Console:** Should have no errors
4. **Test Performance:** Run Lighthouse audit

---

## 🔐 Custom Domain (Optional)

### Setup Custom Domain

1. **Buy Domain** - From any registrar (Namecheap, GoDaddy, etc.)

2. **Configure DNS** - Add these records:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   YOUR_USERNAME.github.io
   ```

3. **Update GitHub Settings:**
   - Settings → Pages → Custom Domain
   - Enter your domain (e.g., `yourdomain.com`)
   - Enable **Enforce HTTPS**

4. **Update `vite.config.ts`:**
   ```typescript
   base: '/', // Change from '/repo-name/' to '/'
   ```

5. **Create `public/CNAME` file:**
   ```
   yourdomain.com
   ```

---

## 📝 Deployment Checklist

Before deploying:

- [ ] Updated `package.json` homepage
- [ ] Updated `vite.config.ts` base path
- [ ] Tested build locally (`npm run build`)
- [ ] Checked TypeScript (`npm run type-check`)
- [ ] Enabled GitHub Pages in Settings
- [ ] Set source to "GitHub Actions"
- [ ] Pushed to main branch
- [ ] Monitored Actions tab for build status
- [ ] Tested live site thoroughly
- [ ] Verified mobile responsiveness
- [ ] Checked all portfolio items load
- [ ] Confirmed games work correctly

---

## 🎉 Success!

Your Windows XP Portfolio is now live! 🚀

**Next Steps:**
- Share your portfolio URL
- Monitor analytics
- Update content regularly
- Collect feedback
- Iterate and improve

---

## 📧 Need Help?

If you encounter issues not covered here:

1. **Check Issues:** [GitHub Issues](https://github.com/rishithchintala/portfolio-xp/issues)
2. **Create New Issue:** Include error messages and steps to reproduce
3. **Contact:** rishith.chintala@gmail.com

---

**Happy Deploying! 🎨**
