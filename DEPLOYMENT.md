# 🚀 Deployment Guide for coreFORCE Integration

This guide explains how to deploy your React checkout app and integrate it with coreFORCE.

## 📦 Build Files Ready

Your app has been built successfully! The static files are in the `dist/` folder:

```
dist/
├── index.html
└── assets/
    ├── index-4a303447.css    (17.68 kB)
    └── index-d93c2d6d.js     (195.11 kB)
```

## 🌐 Hosting Options

### Option 1: GitHub Pages (Recommended)

**Pros:** Free, reliable, easy to update
**Cons:** Public repository required

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/checkout-app.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: `/docs`
   - Copy the `dist/` contents to a `docs/` folder

3. **Your app will be available at:**
   ```
   https://yourusername.github.io/checkout-app/
   ```

### Option 2: Netlify (Recommended)

**Pros:** Free tier, automatic deployments, custom domains
**Cons:** None for this use case

1. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder
   - Your app will be available at a random URL like:
     ```
     https://amazing-name-123456.netlify.app/
     ```

2. **Custom domain (optional):**
   - Add your custom domain in Netlify settings
   - Example: `checkout.yourstore.com`

### Option 3: Vercel

**Pros:** Free tier, automatic deployments, great performance
**Cons:** None for this use case

1. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite app
   - Your app will be available at:
     ```
     https://your-app-name.vercel.app/
     ```

### Option 4: Your Own Server

**Pros:** Full control, private
**Cons:** Requires server management

1. **Upload files to your server:**
   ```bash
   scp -r dist/* user@yourserver.com:/var/www/checkout/
   ```

2. **Configure web server (Apache/Nginx):**
   ```nginx
   location /checkout/ {
       alias /var/www/checkout/;
       try_files $uri $uri/ /checkout/index.html;
   }
   ```

## 🔗 coreFORCE Integration

Once your app is hosted, integrate it into coreFORCE:

### 1. Update the Integration File

Edit `coreforce-integration.html` and replace the URLs:

```html
<!-- Replace with your actual hosted URLs -->
<link rel="stylesheet" href="https://your-domain.com/checkout/assets/index-4a303447.css">
<script src="https://your-domain.com/checkout/assets/index-d93c2d6d.js"></script>
```

### 2. Add to coreFORCE Page

Add this code to your coreFORCE page where you want the checkout:

```html
<!-- Add to your coreFORCE page head -->
<link rel="stylesheet" href="https://your-domain.com/checkout/assets/index-4a303447.css">

<!-- Add to your coreFORCE page body -->
<div id="react-checkout-root"></div>

<!-- Add before closing body tag -->
<script src="https://your-domain.com/checkout/assets/index-d93c2d6d.js"></script>
```

### 3. Ensure coreFORCE Provides Data

Make sure your coreFORCE page provides the `getShoppingCartItems()` function:

```javascript
// This should already exist in your coreFORCE page
window.getShoppingCartItems = function() {
    return {
        "shopping_cart_items": [...],
        "promotion_code": "OVER100",
        "discount_amount": "20.00",
        // ... rest of your cart data
    };
};
```

## 🧪 Testing the Integration

### 1. Test Locally First

Open `coreforce-integration.html` in your browser to test the integration.

### 2. Test on coreFORCE

1. Upload the integration code to your coreFORCE page
2. Check browser console for any errors
3. Verify the checkout app loads correctly
4. Test the complete checkout flow

### 3. Debug Common Issues

**Issue:** "getShoppingCartItems not available"
- **Solution:** Ensure coreFORCE provides the function

**Issue:** CSS/JS not loading
- **Solution:** Check the URLs are correct and accessible

**Issue:** Images not loading
- **Solution:** Verify image URLs in coreFORCE data

## 🔄 Updating the App

When you make changes to the app:

1. **Rebuild:**
   ```bash
   npm run build
   ```

2. **Upload new files** to your hosting provider

3. **Clear browser cache** to see changes

## 📋 File Structure for Hosting

Your hosting provider should serve these files:

```
your-domain.com/checkout/
├── index.html
└── assets/
    ├── index-4a303447.css
    └── index-d93c2d6d.js
```

## 🔒 Security Considerations

- ✅ The app only reads cart data, doesn't modify coreFORCE
- ✅ No sensitive data is stored in the React app
- ✅ All communication is client-side only
- ✅ HTTPS is recommended for production

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify all URLs are accessible
3. Ensure coreFORCE data structure matches expected format
4. Test with the provided mock data first

## 🎯 Next Steps

1. **Choose a hosting provider** (GitHub Pages recommended)
2. **Upload the `dist/` files**
3. **Update URLs** in `coreforce-integration.html`
4. **Test the integration** locally
5. **Deploy to coreFORCE** and test live
6. **Monitor for any issues** and debug as needed

Your React checkout app is ready for production! 🚀 