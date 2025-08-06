# coreFORCE Checkout Integration

This document contains the HTML and JavaScript code needed to integrate the React checkout application with coreFORCE.

## HTML Structure

```html
<div class="grid-container">
   <!-- React Checkout App Container -->
    <div id="react-checkout-root"></div>
</div>
```

## JavaScript Integration Code

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
    link.href = 'https://lerrysuzara.github.io/checkout2025/assets/index-22ac9191.css';
    document.head.appendChild(link);
    
    // Load JS
    var script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://lerrysuzara.github.io/checkout2025/assets/index-a4ea1767.js';
    script.onload = function() {
        console.log('✅ React app script loaded');
        // Wait for React app to initialize, then load cart data
        setTimeout(function() {
            if (window.updateCartData) {
                console.log('✅ React app ready, loading cart data...');
                xloadCartFromCoreFORCEx();
            } else {
                console.log('⚠️ React app not ready yet, will retry...');
                // Retry after a delay
                setTimeout(function() {
                    xloadCartFromCoreFORCEx();
                }, 2000);
            }
        }, 1500);
    };
    document.head.appendChild(script);
}

var cartItems = null;

// Function to get shopping cart items from coreFORCE
function getShoppingCartItemsXX() {
    loadAjaxRequest("/retail-store-controller?ajax=true&url_action=get_shopping_cart_items", function (returnArray) {
        cartItems = returnArray;
        console.log('✅ Cart items loaded:', cartItems);
        checkAndLoadCartData();
    });
}

// Function to update item quantity in coreFORCE
function updateItemQuantity(itemId, newQuantity) {
    console.log('🔄 Updating item quantity:', itemId, newQuantity);
    loadAjaxRequest("/retail-store-controller?ajax=true&url_action=update_cart_item_quantity&item_id=" + itemId + "&quantity=" + newQuantity, function (returnArray) {
        console.log('✅ Item quantity updated:', returnArray);
        // Reload cart data after update
        getShoppingCartItemsXX();
    });
}

// Function to remove item from coreFORCE cart
function removeCartItem(itemId) {
    console.log('🔄 Removing cart item:', itemId);
    loadAjaxRequest("/retail-store-controller?ajax=true&url_action=remove_cart_item&item_id=" + itemId, function (returnArray) {
        console.log('✅ Item removed:', returnArray);
        // Reload cart data after removal
        getShoppingCartItemsXX();
    });
}

// Function to get available shipping methods from coreFORCE
function getShippingMethods(zipCode, callback) {
    console.log('🔄 Getting shipping methods for:', zipCode);
    loadAjaxRequest("/retail-store-controller?ajax=true&url_action=get_shipping_methods&zip_code=" + zipCode, function (returnArray) {
        console.log('✅ Shipping methods loaded:', returnArray);
        if (callback) callback(returnArray);
    });
}

// Function to create new account in coreFORCE
function createAccount(accountData, callback) {
    console.log('🔄 Creating new account:', accountData);
    var params = "ajax=true&url_action=create_account" +
                "&first_name=" + encodeURIComponent(accountData.firstName) +
                "&last_name=" + encodeURIComponent(accountData.lastName) +
                "&email=" + encodeURIComponent(accountData.email) +
                "&password=" + encodeURIComponent(accountData.password);
    
    loadAjaxRequest("/retail-store-controller?" + params, function (returnArray) {
        console.log('✅ Account created:', returnArray);
        if (callback) callback(returnArray);
    });
}

// Function to authenticate user login in coreFORCE
function authenticateLogin(loginData, callback) {
    console.log('🔄 Authenticating login:', loginData.email);
    var params = "ajax=true&url_action=authenticate_login" +
                "&email=" + encodeURIComponent(loginData.email) +
                "&password=" + encodeURIComponent(loginData.password);
    
    loadAjaxRequest("/retail-store-controller?" + params, function (returnArray) {
        console.log('✅ Login authenticated:', returnArray);
        if (callback) callback(returnArray);
    });
}

// Function to apply promo code in coreFORCE
function applyPromoCode(promoCode, callback) {
    console.log('🔄 Applying promo code:', promoCode);
    loadAjaxRequest("/retail-store-controller?ajax=true&url_action=apply_promo_code&promo_code=" + encodeURIComponent(promoCode), function (returnArray) {
        console.log('✅ Promo code applied:', returnArray);
        // Reload cart data after promo code application
        getShoppingCartItemsXX();
        if (callback) callback(returnArray);
    });
}

// Function to submit order to coreFORCE
function submitOrder(orderData, callback) {
    console.log('🔄 Submitting order:', orderData);
    var params = "ajax=true&url_action=submit_order" +
                "&shipping_info=" + encodeURIComponent(JSON.stringify(orderData.shipping)) +
                "&payment_info=" + encodeURIComponent(JSON.stringify(orderData.payment)) +
                "&customer_info=" + encodeURIComponent(JSON.stringify(orderData.customer));
    
    loadAjaxRequest("/retail-store-controller?" + params, function (returnArray) {
        console.log('✅ Order submitted:', returnArray);
        if (callback) callback(returnArray);
    });
}

// Function to check if cart data is ready and load it
function checkAndLoadCartData() {
    if (cartItems && window.updateCartData) {
        window.updateCartData(cartItems);
        console.log('✅ Cart data loaded successfully');
        return true;
    } else if (!cartItems) {
        console.log('🔄 Cart data not ready, loading...');
        getShoppingCartItemsXX();
        return false;
    } else if (!window.updateCartData) {
        console.log('🔄 React app not ready yet');
        return false;
    }
    return false;
}

// Function to load cart data from coreFORCE
function xloadCartFromCoreFORCEx() {
    try {
        console.log('🔄 loadCartFromCoreFORCE called');
        
        // Try to load cart data
        if (!checkAndLoadCartData()) {
            // If not ready, set up a retry mechanism
            var retryCount = 0;
            var maxRetries = 5;
            
            var retryInterval = setInterval(function() {
                retryCount++;
                console.log('🔄 Retry attempt ' + retryCount + ' of ' + maxRetries);
                
                if (checkAndLoadCartData()) {
                    clearInterval(retryInterval);
                    console.log('✅ Cart data loaded successfully on retry');
                } else if (retryCount >= maxRetries) {
                    clearInterval(retryInterval);
                    console.log('❌ Failed to load cart data after ' + maxRetries + ' attempts');
                }
            }, 2000);
        }
    } catch (error) {
        console.error('❌ Error loading cart from coreFORCE:', error);
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

// Expose functions globally for React app to call
window.coreFORCEIntegration = {
    updateItemQuantity: updateItemQuantity,
    removeCartItem: removeCartItem,
    getShippingMethods: getShippingMethods,
    createAccount: createAccount,
    authenticateLogin: authenticateLogin,
    applyPromoCode: applyPromoCode,
    submitOrder: submitOrder,
    reloadCartData: getShoppingCartItemsXX
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadCheckoutApp();
    });
} else {
    loadCheckoutApp();
}

// Monitor for jQuery conflicts
setInterval(restoreJQuery, 1000);

console.log('🚀 coreFORCE checkout integration loaded');
```

## Asset URLs (Current Build)

- **CSS:** `https://lerrysuzara.github.io/checkout2025/assets/index-22ac9191.css`
- **JS:** `https://lerrysuzara.github.io/checkout2025/assets/index-a4ea1767.js`

## Available Functions

### Cart Management
- `updateItemQuantity(itemId, newQuantity)` - Update cart item quantities
- `removeCartItem(itemId)` - Remove items from cart
- `getShoppingCartItemsXX()` - Reload cart data from coreFORCE

### Customer Management
- `createAccount(accountData, callback)` - Create new customer accounts
- `authenticateLogin(loginData, callback)` - Authenticate user login

### Checkout Functions
- `getShippingMethods(zipCode, callback)` - Get available shipping methods
- `applyPromoCode(promoCode, callback)` - Apply promotional codes
- `submitOrder(orderData, callback)` - Submit final orders

### Global API Access
All functions are available via `window.coreFORCEIntegration` object:

```javascript
// Example usage
window.coreFORCEIntegration.updateItemQuantity('item123', 5);
window.coreFORCEIntegration.createAccount({
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john@example.com', 
    password: 'pass123'
});
```

## Features Included

- ✅ **FFL Required badges** on applicable cart items
- ✅ **Updated PayPal and Loyalty Points icons** (🌟 for loyalty points)
- ✅ **Credit card auto-formatting** (xxxx xxxx xxxx xxxx)
- ✅ **Promo code support** with auto-apply from URLs
- ✅ **Split payment functionality**
- ✅ **Store pickup and FFL dealer selection**
- ✅ **Google Places address autocomplete**
- ✅ **Modern payment method icons and layout**
- ✅ **Order review with detailed shipping/payment information**

## Notes

- The integration preserves jQuery functionality to prevent conflicts with coreFORCE
- All coreFORCE API calls use the existing `loadAjaxRequest` function
- Cart data is automatically reloaded after modifications
- The React app waits for proper initialization before loading cart data
- Error handling and retry mechanisms are built-in for reliability