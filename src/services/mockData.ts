/**
 * Mock data service for development and testing
 * Replace with actual API calls in production
 */

import { CartItem, OrderSummary, ShippingAddress, CoreFORCEShoppingCartResponse } from '../types';

// Mock coreFORCE shopping cart response for development
export const mockCoreFORCEShoppingCartResponse: CoreFORCEShoppingCartResponse = {
  order_upsell_products: {
    "91349152": {
      product_id: 91349152,
      description: "Discrete Packaging",
      quantity: 3,
      sale_price: "3.00",
      total_cost: "9.00",
      required: false,
      checked: ""
    },
    "91349153": {
      product_id: 91349153,
      description: "Insurance",
      quantity: 1,
      sale_price: "43.26",
      total_cost: "43.26",
      required: false,
      checked: ""
    }
  },
  estimated_shipping_charge: "41.95",
  default_location_id: "",
  jquery_templates: "",
  custom_field_data: [],
  total_savings: "79.05",
  retail_agreements: [],
  shipping_required: true,
  pickup_locations: false,
  valid_payment_methods: "297,361,595,710,711,712,713,722,723,724",
  shopping_cart_items: [
    {
      shopping_cart_item_id: 1839695,
      shopping_cart_id: 79655841,
      product_id: 91958627,
      description: "Test Item Variation 0722 Red",
      location_id: "",
      serial_number: "",
      time_submitted: "2025-07-25 00:44:53",
      quantity: 1,
      sale_price: "100.00",
      promotion_id: "",
      version: 1,
      product_addons: [],
      addon_count: 0,
      promotion_requirements: 0,
      order_upsell_product: false,
      price_calculation: "Using pricing structure: Default Pricing Structure\nProduct ID: 91958627 - Test Item Variation 0722 Red\nClient Sale Price Found: 100\nFinal calculated Sale Price is: 100\n",
      product_tag_ids: "",
      original_sale_price: "",
      unit_price: "100.00",
      map_policy: "",
      product_code: "TEST_ITEM_VARIATION_0722_RED",
      upc_code: "",
      manufacturer_sku: "",
      model: "",
      list_price: "0.00",
      small_image_url: "",
      image_url: "",
      base_cost: "30.00",
      discount: "",
      savings: "",
      inventory_quantity: 90,
      product_restrictions: "",
      shipping_options: {
        pickup: false,
        ship_to_store: false,
        ship_to_home: false,
        ship_to_ffl: false
      },
      pickup: "",
      ship_to_store: "",
      ship_to_home: "",
      ship_to_ffl: "",
      cart_maximum: "",
      cart_minimum: "",
      no_online_order: 0,
      custom_fields: "",
      custom_field_classes: "",
      item_addons: "",
      addon_classes: "",
      other_classes: ""
    },
    {
      shopping_cart_item_id: 1839696,
      shopping_cart_id: 79655841,
      product_id: 91957734,
      description: "USED GLOCK 43 PISTOL 9MM 2-6RD MAGS EXCELLENT COND.",
      location_id: "",
      serial_number: "",
      time_submitted: "2025-07-25 01:06:08",
      quantity: 1,
      sale_price: "395.95",
      promotion_id: "",
      version: 1,
      product_addons: [],
      addon_count: 0,
      promotion_requirements: 0,
      order_upsell_product: false,
      price_calculation: "Using pricing structure: Firearms\nProduct ID: 91957734 - USED GLOCK 43 PISTOL 9MM 2-6RD MAGS EXCELLENT COND.\nNo Client Sale Price Found\nReference Price: 359.95\nDiscount range found: 99.00 - 499.00. Price discount: 10.0000\nStarting Percentage used: 10\nBase Cost: 359.95\nPercent Markup: 10\nSale Price: 395.95\nSale Price after rounding rules: 395.95\n",
      product_tag_ids: "715",
      original_sale_price: "475.00",
      unit_price: "395.95",
      map_policy: "STRICT",
      product_code: "Z4_GHG4938X",
      upc_code: "787450540255",
      manufacturer_sku: "",
      model: "",
      list_price: "475.00",
      small_image_url: "https://range-test.coreware.com/cache/image-small-386986-0755e42dbde8b329cc777d0f5c9c0406.webp",
      image_url: "https://range-test.coreware.com/cache/image-full-386986-0755e42dbde8b329cc777d0f5c9c0406.webp",
      base_cost: "359.95",
      discount: "17%",
      savings: "79.05",
      inventory_quantity: 21,
      product_restrictions: "",
      shipping_options: {
        pickup: false,
        ship_to_store: false,
        ship_to_home: true,
        ship_to_ffl: false
      },
      pickup: "",
      ship_to_store: "",
      ship_to_home: "shipping-option-ship-to-home",
      ship_to_ffl: "",
      cart_maximum: "",
      cart_minimum: "",
      no_online_order: 0,
      custom_fields: "",
      custom_field_classes: "",
      item_addons: "",
      addon_classes: "",
      other_classes: "product-tag-new_product"
    },
    {
      shopping_cart_item_id: 1839697,
      shopping_cart_id: 79655841,
      product_id: 91957598,
      description: "RUGER RXM 9MM PISTOL 4\" AMERICAN FLAG O.R. 2-15RD MAGS - ORION EXCLUSIVE",
      location_id: "",
      serial_number: "",
      time_submitted: "2025-07-25 01:10:24",
      quantity: 1,
      sale_price: "469.28",
      promotion_id: "",
      version: 1,
      product_addons: [],
      addon_count: 0,
      promotion_requirements: 0,
      order_upsell_product: false,
      price_calculation: "Using pricing structure: Firearms\nProduct ID: 91957598 - RUGER RXM 9MM PISTOL 4\" AMERICAN FLAG O.R. 2-15RD MAGS - ORION EXCLUSIVE\nNo Client Sale Price Found\nReference Price: 419.00\nDiscount range found: 99.00 - 499.00. Price discount: 10.0000\nSurcharge for distributor 'Orion': 2.0000\nIncluded distributor surcharge percentage: 2\nStarting Percentage used: 12\nBase Cost: 419\nPercent Markup: 12\nSale Price: 469.28\nSale Price after rounding rules: 469.28\n",
      product_tag_ids: "457,715",
      original_sale_price: "",
      unit_price: "469.28",
      map_policy: "CART_PRICE",
      product_code: "O17_RUGE19400-FLAG",
      upc_code: "756542285992",
      manufacturer_sku: "19400-FLAG",
      model: "RXM",
      list_price: "419.00",
      small_image_url: "https://range-test.coreware.com/cache/image-small-386556-5d268d52e3177a9f99c4a4afc7b0a755.webp",
      image_url: "https://range-test.coreware.com/cache/image-full-386556-5d268d52e3177a9f99c4a4afc7b0a755.webp",
      base_cost: "419.00",
      discount: "",
      savings: "",
      inventory_quantity: 54,
      product_restrictions: "",
      shipping_options: {
        pickup: false,
        ship_to_store: false,
        ship_to_home: false,
        ship_to_ffl: true
      },
      pickup: "",
      ship_to_store: "",
      ship_to_home: "",
      ship_to_ffl: "shipping-option-ship-to-ffl",
      cart_maximum: "",
      cart_minimum: "",
      no_online_order: 0,
      custom_fields: "",
      custom_field_classes: "",
      item_addons: "",
      addon_classes: "",
      other_classes: "product-tag-ffl_required product-tag-new_product"
    }
  ],
  promotion_code: "OVER100",
  promotion_id: 1,
  promotion_code_description: "Over 100 Discount",
  promotion_code_details: "",
  discount_amount: "0.00",
  discount_percent: "20.00",
  shopping_cart_item_count: 3,
  loyalty_points_awarded: "This purchase will add 10 loyalty points to your account.",
  analytics_event: {
    event: "load_cart",
    event_data: {
      items: []
    }
  }
};

export const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    quantity: 1,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    quantity: 2,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Advanced fitness tracking with heart rate monitor'
  },
  {
    id: '3',
    name: 'Portable Bluetooth Speaker',
    price: 89.99,
    quantity: 1,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Compact speaker with premium sound quality'
  }
];

export const calculateOrderSummary = (items: CartItem[]): OrderSummary => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    currency: 'USD'
  };
};

export const mockShippingAddress: Partial<ShippingAddress> = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address1: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'US'
};

// Simulate API delays for realistic UX
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};