/**
 * API service for handling external data sources
 * Includes coreFORCE integration for shopping cart data
 */

import { CoreFORCEShoppingCartResponse, CartItem, OrderSummary } from '../types';
import { mockCoreFORCEShoppingCartResponse } from './mockData';

// Global function declaration for coreFORCE integration
declare global {
  interface Window {
    getShoppingCartItems?: () => CoreFORCEShoppingCartResponse;
  }
}

/**
 * Fetches shopping cart data from coreFORCE
 * This function will be called from the coreFORCE page context
 */
export const getCoreFORCEShoppingCart = (): CoreFORCEShoppingCartResponse | null => {
  try {
    // Check if we're in a coreFORCE environment
    if (typeof window !== 'undefined' && window.getShoppingCartItems) {
      return window.getShoppingCartItems();
    }
    
    // Fallback for development/testing
    console.warn('getShoppingCartItems not available, using mock data');
    return mockCoreFORCEShoppingCartResponse;
  } catch (error) {
    console.error('Error fetching coreFORCE shopping cart:', error);
    return null;
  }
};

/**
 * Transforms coreFORCE shopping cart items to our app's format
 */
export const transformCoreFORCEItems = (coreFORCEData: CoreFORCEShoppingCartResponse): CartItem[] => {
  return coreFORCEData.shopping_cart_items.map((item) => ({
    id: item.shopping_cart_item_id.toString(),
    name: item.description,
    price: parseFloat(item.sale_price),
    quantity: item.quantity,
    image: item.image_url || item.small_image_url || undefined,
    description: item.description,
    // Additional coreFORCE-specific data
    productId: item.product_id,
    productCode: item.product_code,
    unitPrice: parseFloat(item.unit_price),
    baseCost: parseFloat(item.base_cost),
    inventoryQuantity: item.inventory_quantity,
    timeSubmitted: item.time_submitted,
    // Additional properties from comprehensive data
    savings: item.savings,
    discount: item.discount,
    originalSalePrice: item.original_sale_price,
    listPrice: item.list_price,
    upcCode: item.upc_code,
    manufacturerSku: item.manufacturer_sku,
    model: item.model,
    productTagIds: item.product_tag_ids,
    shippingOptions: item.shipping_options,
    otherClasses: item.other_classes,
  }));
};

/**
 * Calculates order summary from coreFORCE data
 */
export const calculateOrderSummaryFromCoreFORCE = (coreFORCEData: CoreFORCEShoppingCartResponse): OrderSummary => {
  const subtotal = coreFORCEData.shopping_cart_items.reduce(
    (sum, item) => sum + (parseFloat(item.sale_price) * item.quantity), 
    0
  );
  
  const shipping = parseFloat(coreFORCEData.estimated_shipping_charge) || 0;
  const discount = parseFloat(coreFORCEData.discount_amount) || 0;
  const tax = (subtotal - discount) * 0.08; // 8% tax rate (adjust as needed)
  const total = subtotal + shipping + tax - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    currency: 'USD',
    // Additional coreFORCE-specific data
    discount: Number(discount.toFixed(2)),
    discountPercent: parseFloat(coreFORCEData.discount_percent) || 0,
    promotionCode: coreFORCEData.promotion_code,
    promotionDescription: coreFORCEData.promotion_code_description,
    loyaltyPoints: coreFORCEData.loyalty_points_awarded,
    totalSavings: parseFloat(coreFORCEData.total_savings) || 0,
  } as OrderSummary & {
    discount: number;
    discountPercent: number;
    promotionCode: string;
    promotionDescription: string;
    loyaltyPoints: string;
    totalSavings: number;
  };
};

/**
 * Loads and processes coreFORCE shopping cart data
 */
export const loadCoreFORCEShoppingCart = () => {
  const coreFORCEData = getCoreFORCEShoppingCart();
  
  if (!coreFORCEData) {
    return {
      items: [],
      summary: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        currency: 'USD',
        discount: 0,
        discountPercent: 0,
        promotionCode: '',
        promotionDescription: '',
        loyaltyPoints: '',
        totalSavings: 0,
      },
      rawData: null
    };
  }

  const items = transformCoreFORCEItems(coreFORCEData);
  const summary = calculateOrderSummaryFromCoreFORCE(coreFORCEData);

  return {
    items,
    summary,
    rawData: coreFORCEData
  };
};

// Legacy API functions for backward compatibility
export const fetchCartItems = async (): Promise<CartItem[]> => {
  // This can be used for other API calls if needed
  throw new Error('Use loadCoreFORCEShoppingCart() for coreFORCE integration');
};

export const submitOrder = async (orderData: any): Promise<any> => {
  // Placeholder for order submission
  console.log('Order submission:', orderData);
  return { success: true, orderId: 'mock-order-id' };
};