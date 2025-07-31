/**
 * Mock data service for development and testing
 * Replace with actual API calls in production
 */

import { CartItem, OrderSummary, ShippingAddress, CoreFORCEShoppingCartResponse } from '../types';

// Mock coreFORCE shopping cart response for development
export const mockCoreFORCEShoppingCartResponse: CoreFORCEShoppingCartResponse = {
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
  "default_location_id": "71",
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
  ],
  "promotion_id": 0,
  "promotion_code": "",
  "promotion_code_description": "",
  "promotion_code_details": "",
  "discount_amount": "",
  "discount_percent": "0",
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
    currency: 'USD',
    discount: null
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