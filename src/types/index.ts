/**
 * Core type definitions for the checkout application
 * Designed for easy extension and API integration
 */

// CoreFORCE Shopping Cart Types
export interface CoreFORCEShoppingCartItem {
  shopping_cart_item_id: number;
  shopping_cart_id: number;
  product_id: number;
  description: string;
  location_id: string;
  serial_number: string;
  time_submitted: string;
  quantity: number;
  sale_price: string;
  promotion_id: string;
  version: number;
  product_addons: any[];
  addon_count: number;
  promotion_requirements: number;
  order_upsell_product: boolean;
  price_calculation: string;
  product_tag_ids: string;
  original_sale_price: string;
  unit_price: string;
  map_policy: string;
  product_code: string;
  upc_code: string;
  manufacturer_sku: string;
  model: string;
  list_price: string;
  small_image_url: string;
  image_url: string;
  base_cost: string;
  discount: string;
  savings: string;
  inventory_quantity: number;
  product_restrictions: string;
  shipping_options: {
    pickup: boolean;
    ship_to_store: boolean;
    ship_to_home: boolean;
    ship_to_ffl: boolean;
  };
  pickup: string;
  ship_to_store: string;
  ship_to_home: string;
  ship_to_ffl: string;
  cart_maximum: string;
  cart_minimum: string;
  no_online_order: number;
  custom_fields: string;
  custom_field_classes: string;
  item_addons: string;
  addon_classes: string;
  other_classes: string;
}

export interface CoreFORCEOrderUpsellProduct {
  product_id: number;
  description: string;
  quantity: number;
  sale_price: string;
  total_cost: string;
  required: boolean;
  checked: string;
}

export interface CoreFORCEShoppingCartResponse {
  order_upsell_products: Record<string, CoreFORCEOrderUpsellProduct>;
  estimated_shipping_charge: string;
  default_location_id: string;
  jquery_templates: string;
  custom_field_data: any[];
  total_savings: string;
  retail_agreements: any[];
  shipping_required: boolean;
  pickup_locations: boolean;
  valid_payment_methods: string;
  shopping_cart_items: CoreFORCEShoppingCartItem[];
  promotion_code: string;
  promotion_id: number;
  promotion_code_description: string;
  promotion_code_details: string;
  discount_amount: string;
  discount_percent: string;
  shopping_cart_item_count: number;
  loyalty_points_awarded: string;
  analytics_event: {
    event: string;
    event_data: {
      items: CoreFORCEShoppingCartItem[];
    };
  };
}

// Legacy types for backward compatibility
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  // CoreFORCE-specific properties
  productId?: number;
  productCode?: string;
  unitPrice?: number;
  baseCost?: number;
  inventoryQuantity?: number;
  timeSubmitted?: string;
  // Additional coreFORCE properties
  savings?: string;
  discount?: string;
  originalSalePrice?: string;
  listPrice?: string;
  upcCode?: string;
  manufacturerSku?: string;
  model?: string;
  productTagIds?: string;
  shippingOptions?: {
    pickup: boolean;
    ship_to_store: boolean;
    ship_to_home: boolean;
    ship_to_ffl: boolean;
  };
  otherClasses?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress?: ShippingAddress;
  saveCard?: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  // CoreFORCE-specific properties
  discount?: number;
  discountPercent?: number;
  promotionCode?: string;
  promotionDescription?: string;
  loyaltyPoints?: string;
  totalSavings?: number;
}

export interface CheckoutState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentInfo: PaymentInfo | null;
  orderSummary: OrderSummary;
  currentStep: CheckoutStep;
  isLoading: boolean;
  errors: Record<string, string>;
}

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}