// ========================================
// coreFORCE Checkout Integration Snippet
// THIS SCRIPT IS MISSING FROM YOUR PAGE
// ========================================

// Store original jQuery references to prevent conflicts
var originalJQuery = window.jQuery;
var original$ = window.$;

// Load React checkout app
function loadCheckoutApp() {
    console.log('🚀 Loading checkout app...');
    
    // Load CSS with aggressive isolation
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
                setTimeout(function() {
                    xloadCartFromCoreFORCEx();
                }, 2000);
            }
        }, 1500);
    };
    script.onerror = function() {
        console.error('❌ Failed to load React app script');
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

// Initialize immediately when this script loads
console.log('🚀 Initializing coreFORCE checkout integration...');
loadCheckoutApp();

// Monitor for jQuery conflicts
setInterval(restoreJQuery, 1000);

console.log('🚀 coreFORCE checkout integration script loaded');