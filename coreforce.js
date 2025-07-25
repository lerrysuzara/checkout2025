// Store original jQuery references to prevent conflicts
var originalJQuery = window.jQuery;
var original$ = window.$;
var cartItems = null;

function getShoppingCartItemsXX(returnArray) {
    loadAjaxRequest("/retail-store-controller?ajax=true&url_action=get_shopping_cart_items", function (returnArray) {
        cartItems = returnArray;
    });
}

function getCartItems() {
     return cartItems;
}


// DO NOT UPDATE CODE BELOW THIS

function updateStatus(message, type) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = 'status ' + type;
    }
}

// coreFORCE xgetShoppingCartItems function (replace with actual coreFORCE function)
window.xgetShoppingCartItems = function() {
    console.log('🔄 coreFORCE getShoppingCartItems() called');
    
    // Return your actual coreFORCE cart data here
    return {
        "shopping_cart_items": [
            {
                "shopping_cart_item_id": 1839696,
                "product_id": 91957734,
                "description": "USED GLOCK 43 PISTOL 9MM 2-6RD MAGS EXCELLENT COND.",
                "quantity": 1,
                "sale_price": "395.95",
                "image_url": "https://range-test.coreware.com/cache/image-full-386986-0755e42dbde8b329cc777d0f5c9c0406.webp",
                "list_price": "475.00",
                "discount": "17%",
                "savings": "79.05"
            },
            {
                "shopping_cart_item_id": 1839697,
                "product_id": 91957598,
                "description": "RUGER RXM 9MM PISTOL 4\" AMERICAN FLAG O.R. 2-15RD MAGS",
                "quantity": 1,
                "sale_price": "469.28",
                "image_url": "https://range-test.coreware.com/cache/image-full-386556-5d268d52e3177a9f99c4a4afc7b0a755.webp",
                "list_price": "419.00"
            }
        ],
        "estimated_shipping_charge": "41.95",
        "total_savings": "79.05",
        "promotion_code": "OVER100",
        "promotion_code_description": "Over 100 Discount",
        "discount_percent": "20.00",
        "shopping_cart_item_count": 2,
        "loyalty_points_awarded": "This purchase will add 10 loyalty points to your account."
    };
};

// Function to load cart data from coreFORCE
function loadCartData() {
    updateStatus('Loading cart data...', 'loading');
    
    try {
        const cartData = window.getCartItems();
        
        if (cartData && typeof window.updateCartData === 'function') {
            window.updateCartData(cartData);
            updateStatus('Cart data loaded successfully!', 'success');
            console.log('✅ Cart data loaded');
        } else {
            updateStatus('React app not ready or cart data unavailable', 'error');
        }
    } catch (error) {
        console.error('Error loading cart data:', error);
        updateStatus('Error loading cart data', 'error');
    }
}

// Function to load test data
function loadMockData() {
    updateStatus('Loading test data...', 'loading');
    
    setTimeout(() => {
        const mockData = {
            items: [
                {
                    id: "1",
                    name: "Test Product",
                    price: 99.99,
                    quantity: 1,
                    image: "https://via.placeholder.com/64x64?text=Test",
                    description: "Test product for checkout"
                }
            ],
            summary: {
                subtotal: 99.99,
                shipping: 9.99,
                tax: 8.80,
                total: 118.78,
                currency: 'USD'
            }
        };
        
        if (typeof window.updateCartData === 'function') {
            window.updateCartData(mockData);
            updateStatus('Test data loaded successfully!', 'success');
        } else {
            updateStatus('React app not ready', 'error');
        }
    }, 500);
}

// Load React app assets
function loadReactApp() {
    try {
        updateStatus('Loading checkout app...', 'loading');
        
        // Load CSS
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://lerrysuzara.github.io/checkout2025/assets/index-449700de.css';
        link.onload = function() {
            console.log('✅ CSS loaded');
            
            // Load JS
            var script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://lerrysuzara.github.io/checkout2025/assets/index-71fbd9e7.js';
            script.onload = function() {
                console.log('✅ React app loaded');
                updateStatus('Checkout app ready - click button to load cart data', 'success');
                
                // Wait for React to initialize
                setTimeout(() => {
                    if (typeof window.updateCartData === 'function') {
                        console.log('✅ updateCartData function available');
                        updateStatus('Checkout app fully ready', 'success');
                        window.getShoppingCartItems();
                        updateStatus('window.getShoppingCartItems called', 'success');
                    }
                }, 1000);
            };
            script.onerror = function() {
                console.error('❌ Failed to load React app');
                updateStatus('Failed to load checkout app', 'error');
            };
            document.head.appendChild(script);
        };
        link.onerror = function() {
            console.error('❌ Failed to load CSS');
            updateStatus('Failed to load checkout app styles', 'error');
        };
        document.head.appendChild(link);
        
    } catch (error) {
        console.error('Error loading React app:', error);
        updateStatus('Error loading checkout app', 'error');
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
    document.addEventListener('DOMContentLoaded', loadReactApp);
} else {
    loadReactApp();
}

// Monitor for jQuery conflicts
setInterval(restoreJQuery, 1000);

console.log('🚀 Checkout snippet initialized');