// ========================================
// coreFORCE Checkout Integration Snippet - LOCAL TEST VERSION
// ========================================

// Store original jQuery references to prevent conflicts
var originalJQuery = window.jQuery;
var original$ = window.$;

// Load React checkout app from local development server
function loadCheckoutApp() {
    // Load CSS from local dev server
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'http://localhost:5174/src/index.css';
    document.head.appendChild(link);
    
    // Load JS from local dev server
    var script = document.createElement('script');
    script.type = 'module';
    script.src = 'http://localhost:5174/src/main.tsx';
    script.onload = function() {
        console.log('✅ React app script loaded from local dev server');
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

// Mock coreFORCE cart data (replaces actual API call) - Using mockCoreFORCEShoppingCartResponse
var cartItems = {
    "order_upsell_products": {
        "1100654": {
            "product_id": 1100654,
            "description": "Discrete Packaging",
            "quantity": 1,
            "sale_price": "3.00",
            "total_cost": "3.00",
            "required": false,
            "checked": ""
        },
        "1100655": {
            "product_id": 1100655,
            "description": "Insurance",
            "quantity": 1,
            "sale_price": "15.96",
            "total_cost": "15.96",
            "required": false,
            "checked": ""
        }
    },
    "estimated_shipping_charge": "25.00",
    "default_location_id": 71,
    "location_description": "TEST",
    "jquery_templates": "",
    "custom_field_data": [],
    "total_savings": "128.01",
    "retail_agreements": [],
    "shipping_required": true,
    "pickup_locations": false,
    "valid_payment_methods": "22,81,82,83,85,110,111,118,119,151,172,173",
    "shopping_cart_items": [
        {
            "shopping_cart_item_id": 199835,
            "shopping_cart_id": 4841739,
            "product_id": 1174658,
            "description": "Walther Arms PD22L1   22LR 200 Per Box/10 Case",
            "location_id": "",
            "serial_number": "",
            "time_submitted": "2025-07-24 22:45:41",
            "quantity": 1,
            "sale_price": "26.79",
            "promotion_id": "",
            "version": 1,
            "product_addons": [],
            "addon_count": 0,
            "promotion_requirements": 0,
            "order_upsell_product": false,
            "price_calculation": "Using pricing structure: Default Price\nProduct ID: 1174559 - BANISH 30 30CAL FDE\nNo Client Sale Price Found\nReference Price: 700.00\nStarting Percentage used: 10\nBase Cost: 700\nPercent Markup: 10\nSale Price: 770\nSale Price after rounding rules: 770.99\nUsing pricing structure: Default Price\nProduct ID: 1174658 - Walther Arms PD22L1   22LR 200 Per Box/10 Case\nNo Client Sale Price Found\nReference Price: 24.00\nStarting Percentage used: 10\nBase Cost: 24\nPercent Markup: 10\nSale Price: 26.4\nSale Price after rounding rules: 26.79\n",
            "product_tag_ids": "",
            "unit_price": "26.79",
            "map_policy": "STRICT",
            "product_code": "S1_184000",
            "upc_code": "723364234477",
            "manufacturer_sku": "PD22L1",
            "model": "",
            "list_price": "",
            "small_image_url": "https://demostore.coreware.com/cache/image-small-950710-54fe317fd53ae2d16772bc0842bef10d.webp",
            "image_url": "https://demostore.coreware.com/cache/image-full-950710-54fe317fd53ae2d16772bc0842bef10d.webp",
            "base_cost": "24.00",
            "original_sale_price": "",
            "discount": "",
            "savings": "",
            "inventory_quantity": 2000,
            "product_restrictions": "",
            "shipping_options": {
                "pickup": false,
                "ship_to_store": true,
                "ship_to_home": true,
                "ship_to_ffl": false
            },
            "pickup": "",
            "ship_to_store": "shipping-option-ship-to-store",
            "ship_to_home": "shipping-option-ship-to-home",
            "ship_to_ffl": "",
            "cart_maximum": "",
            "cart_minimum": "",
            "no_online_order": 0,
            "custom_fields": "",
            "custom_field_classes": "",
            "item_addons": "",
            "addon_classes": "",
            "other_classes": ""
        },
        {
            "shopping_cart_item_id": 199836,
            "shopping_cart_id": 4841739,
            "product_id": 1174559,
            "description": "BANISH 30 30CAL FDE",
            "location_id": "",
            "serial_number": "",
            "time_submitted": "2025-07-24 22:46:13",
            "quantity": 1,
            "sale_price": "770.99",
            "promotion_id": "",
            "version": 1,
            "product_addons": [],
            "addon_count": 0,
            "promotion_requirements": 0,
            "order_upsell_product": false,
            "price_calculation": "Using pricing structure: Default Price\nProduct ID: 1174559 - BANISH 30 30CAL FDE\nNo Client Sale Price Found\nReference Price: 700.00\nStarting Percentage used: 10\nBase Cost: 700\nPercent Markup: 10\nSale Price: 770\nSale Price after rounding rules: 770.99\n",
            "product_tag_ids": "13,14",
            "unit_price": "770.99",
            "map_policy": "",
            "product_code": "L4_BX100000110949",
            "upc_code": "810171221643",
            "manufacturer_sku": "100000110949",
            "model": "Banish 30",
            "list_price": "899.00",
            "small_image_url": "https://demostore.coreware.com/cache/image-small-950528-0ef5da8aa2cd0f3c5963e5acfbbb1dc0.webp",
            "image_url": "https://demostore.coreware.com/cache/image-full-950528-0ef5da8aa2cd0f3c5963e5acfbbb1dc0.webp",
            "base_cost": "700.00",
            "original_sale_price": "899.00",
            "discount": "14%",
            "savings": "128.01",
            "inventory_quantity": 63,
            "product_restrictions": "",
            "shipping_options": {
                "pickup": false,
                "ship_to_store": true,
                "ship_to_home": false,
                "ship_to_ffl": true
            },
            "pickup": "",
            "ship_to_store": "shipping-option-ship-to-store",
            "ship_to_home": "",
            "ship_to_ffl": "shipping-option-ship-to-ffl",
            "cart_maximum": "",
            "cart_minimum": "",
            "no_online_order": 0,
            "custom_fields": "",
            "custom_field_classes": "",
            "item_addons": "",
            "addon_classes": "",
            "other_classes": "product-tag-ffl_required product-tag-class_3"
        }
    ],
    "promotion_id": "",
    "promotion_code": "",
    "promotion_code_description": "",
    "promotion_code_details": "",
    "discount_amount": 0,
    "discount_percent": 0,
    "shopping_cart_item_count": 2,
    "loyalty_points_awarded": "This purchase will add 120 loyalty points to your account. Add $202.22 in product to this order to jump to the next level.",
    "analytics_event": {
        "event": "load_cart",
        "event_data": {
            "items": [
                {
                    "shopping_cart_item_id": 199835,
                    "shopping_cart_id": 4841739,
                    "product_id": 1174658,
                    "description": "Walther Arms PD22L1   22LR 200 Per Box/10 Case",
                    "location_id": "",
                    "serial_number": "",
                    "time_submitted": "2025-07-24 22:45:41",
                    "quantity": 1,
                    "sale_price": "26.79",
                    "promotion_id": "",
                    "version": 1,
                    "product_addons": [],
                    "addon_count": 0,
                    "promotion_requirements": 0,
                    "order_upsell_product": false,
                    "price_calculation": "Using pricing structure: Default Price\nProduct ID: 1174559 - BANISH 30 30CAL FDE\nNo Client Sale Price Found\nReference Price: 700.00\nStarting Percentage used: 10\nBase Cost: 700\nPercent Markup: 10\nSale Price: 770\nSale Price after rounding rules: 770.99\nUsing pricing structure: Default Price\nProduct ID: 1174658 - Walther Arms PD22L1   22LR 200 Per Box/10 Case\nNo Client Sale Price Found\nReference Price: 24.00\nStarting Percentage used: 10\nBase Cost: 24\nPercent Markup: 10\nSale Price: 26.4\nSale Price after rounding rules: 26.79\n",
                    "product_tag_ids": "",
                    "unit_price": "26.79",
                    "map_policy": "STRICT",
                    "product_code": "S1_184000",
                    "upc_code": "723364234477",
                    "manufacturer_sku": "PD22L1",
                    "model": "",
                    "list_price": "",
                    "small_image_url": "/cache/image-small-950710-54fe317fd53ae2d16772bc0842bef10d.webp",
                    "image_url": "/cache/image-full-950710-54fe317fd53ae2d16772bc0842bef10d.webp",
                    "base_cost": "24.00",
                    "original_sale_price": "",
                    "discount": "",
                    "savings": "",
                    "inventory_quantity": 2000,
                    "product_restrictions": "",
                    "shipping_options": {
                        "pickup": false,
                        "ship_to_store": true,
                        "ship_to_home": true,
                        "ship_to_ffl": false
                    },
                    "pickup": "",
                    "ship_to_store": "shipping-option-ship-to-store",
                    "ship_to_home": "shipping-option-ship-to-home",
                    "ship_to_ffl": "",
                    "cart_maximum": "",
                    "cart_minimum": "",
                    "no_online_order": 0,
                    "custom_fields": "",
                    "custom_field_classes": "",
                    "item_addons": "",
                    "addon_classes": "",
                    "other_classes": ""
                },
                {
                    "shopping_cart_item_id": 199836,
                    "shopping_cart_id": 4841739,
                    "product_id": 1174559,
                    "description": "BANISH 30 30CAL FDE",
                    "location_id": "",
                    "serial_number": "",
                    "time_submitted": "2025-07-24 22:46:13",
                    "quantity": 1,
                    "sale_price": "770.99",
                    "promotion_id": "",
                    "version": 1,
                    "product_addons": [],
                    "addon_count": 0,
                    "promotion_requirements": 0,
                    "order_upsell_product": false,
                    "price_calculation": "Using pricing structure: Default Price\nProduct ID: 1174559 - BANISH 30 30CAL FDE\nNo Client Sale Price Found\nReference Price: 700.00\nStarting Percentage used: 10\nBase Cost: 700\nPercent Markup: 10\nSale Price: 770\nSale Price after rounding rules: 770.99\n",
                    "product_tag_ids": "13,14",
                    "unit_price": "770.99",
                    "map_policy": "",
                    "product_code": "L4_BX100000110949",
                    "upc_code": "810171221643",
                    "manufacturer_sku": "100000110949",
                    "model": "Banish 30",
                    "list_price": "899.00",
                    "small_image_url": "/cache/image-small-950528-0ef5da8aa2cd0f3c5963e5acfbbb1dc0.webp",
                    "image_url": "/cache/image-full-950528-0ef5da8aa2cd0f3c5963e5acfbbb1dc0.webp",
                    "base_cost": "700.00",
                    "original_sale_price": "899.00",
                    "discount": "14%",
                    "savings": "128.01",
                    "inventory_quantity": 63,
                    "product_restrictions": "",
                    "shipping_options": {
                        "pickup": false,
                        "ship_to_store": true,
                        "ship_to_home": false,
                        "ship_to_ffl": true
                    },
                    "pickup": "",
                    "ship_to_store": "shipping-option-ship-to-store",
                    "ship_to_home": "",
                    "ship_to_ffl": "shipping-option-ship-to-ffl",
                    "cart_maximum": "",
                    "cart_minimum": "",
                    "no_online_order": 0,
                    "custom_fields": "",
                    "custom_field_classes": "",
                    "item_addons": "",
                    "addon_classes": "",
                    "other_classes": "product-tag-ffl_required product-tag-class_3"
                }
            ]
        }
    }
};

// Mock function to simulate coreFORCE cart loading
function getShoppingCartItemsXX() {
    console.log('🔄 Loading mock cart data from mockCoreFORCEShoppingCartResponse...');
    // cartItems is already set to mockCoreFORCEShoppingCartResponse data
    console.log('✅ Mock cart items loaded:', cartItems);
}

function getCartItems() {
     return cartItems;
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

// Expose function globally for coreFORCE to call
// window.loadCartFromCoreFORCE = loadCartFromCoreFORCE;

console.log('🚀 coreFORCE checkout snippet loaded (LOCAL TEST VERSION)'); 