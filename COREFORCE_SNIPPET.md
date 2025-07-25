# coreFORCE Integration Snippet

## Copy this snippet into your coreFORCE page:

### 1. Add this HTML container where you want the checkout to appear:
```html
<div id="react-checkout-root"></div>
```

### 2. Add this JavaScript snippet to your page:
```javascript
// ========================================
// coreFORCE Checkout Integration Snippet
// ========================================

// Store original jQuery references to prevent conflicts
var originalJQuery = window.jQuery;
var original$ = window.$;

// Load React checkout app
function loadCheckoutApp() {
    // Load CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://lerrysuzara.github.io/checkout2025/assets/index-2fd291ff.css';
    document.head.appendChild(link);
    
    // Load JS
    var script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://lerrysuzara.github.io/checkout2025/assets/index-b604626c.js';
    document.head.appendChild(script);
}

// Function to load cart data from coreFORCE
function loadCartFromCoreFORCE() {
    // Replace this with your actual coreFORCE cart data function
    var cartData = window.getShoppingCartItems ? window.getShoppingCartItems() : null;
    
    if (cartData && window.updateCartData) {
        window.updateCartData(cartData);
        console.log('✅ Cart data loaded from coreFORCE');
    } else {
        console.log('❌ Cart data or updateCartData function not available');
    }
}

// Restore jQuery if needed
function restoreJQuery() {
    if (originalJQuery && (!window.jQuery || typeof window.jQuery.ajaxSetup !== 'function')) {
        window.jQuery = originalJQuery;
    }
    if (original$ && (!window.$ || typeof window.$.ajaxSetup !== 'function')) {
        window.$ = original$;
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCheckoutApp);
} else {
    loadCheckoutApp();
}

// Monitor for jQuery conflicts
setInterval(restoreJQuery, 1000);

// Expose function globally for coreFORCE to call
window.loadCartFromCoreFORCE = loadCartFromCoreFORCE;

console.log('🚀 coreFORCE checkout snippet loaded');
```

## How to use:

1. **Add the HTML container** where you want the React checkout app to appear
2. **Add the JavaScript snippet** to your coreFORCE page
3. **Call the function** when you want to load cart data:
   ```javascript
   window.loadCartFromCoreFORCE();
   ```

## What it does:

- ✅ Loads the React checkout app from GitHub Pages
- ✅ Prevents jQuery conflicts with coreFORCE
- ✅ Automatically transforms coreFORCE data format
- ✅ Provides a simple function to load cart data
- ✅ Works with your existing coreFORCE `getShoppingCartItems()` function

## Example usage in coreFORCE:

```javascript
// When user clicks "Checkout" button
document.getElementById('checkout-button').onclick = function() {
    window.loadCartFromCoreFORCE();
};
```

That's it! The React app will automatically detect and transform your coreFORCE cart data format. 