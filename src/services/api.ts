/**
 * API service for handling external data sources
 * Includes coreFORCE integration for shopping cart data
 */

import { CartItem, OrderSummary, CoreFORCEShoppingCartResponse } from '../types';
import { mockCoreFORCEShoppingCartResponse } from './mockData';

/**
 * Helper function to parse comma-separated numbers properly
 * Handles strings like "1,760.40" and converts them to 1760.40
 */
function parseCommaSeparatedNumber(value: string): number {
  if (!value) return 0
  // Remove commas and parse as float
  return parseFloat(value.replace(/,/g, ''))
}

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
    price: parseCommaSeparatedNumber(item.sale_price),
    quantity: item.quantity,
    image: item.image_url || item.small_image_url || undefined,
    description: item.description,
    // Additional coreFORCE-specific data
    productId: item.product_id,
    productCode: item.product_code,
    unitPrice: parseCommaSeparatedNumber(item.unit_price),
    baseCost: parseCommaSeparatedNumber(item.base_cost),
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
    (sum, item) => sum + (parseCommaSeparatedNumber(item.sale_price) * item.quantity), 
    0
  );
  
  const shipping = parseCommaSeparatedNumber(coreFORCEData.estimated_shipping_charge) || 0;
  const discount = parseCommaSeparatedNumber(coreFORCEData.discount_amount) || 0;
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
    totalSavings: parseCommaSeparatedNumber(coreFORCEData.total_savings) || 0,
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

/**
 * Function that can be called explicitly from coreFORCE to load cart data
 * This allows coreFORCE to control when the cart data is loaded
 */
export const loadCartFromCoreFORCE = (getShoppingCartItemsFunction: () => any) => {
  try {
    console.log('🔄 Loading cart data from coreFORCE...');
    
    // Call the provided function to get cart data
    const coreFORCEData = getShoppingCartItemsFunction();
    
    if (!coreFORCEData) {
      console.error('No cart data returned from coreFORCE');
      return null;
    }

    const items = transformCoreFORCEItems(coreFORCEData);
    const summary = calculateOrderSummaryFromCoreFORCE(coreFORCEData);

    const result = {
      items,
      summary,
      rawData: coreFORCEData
    };

    console.log('✅ Cart data loaded successfully:', result);
    return result;
  } catch (error) {
    console.error('Error loading cart from coreFORCE:', error);
    return null;
  }
};

// Expose the function globally for coreFORCE to call
if (typeof window !== 'undefined') {
  (window as any).loadCartFromCoreFORCE = loadCartFromCoreFORCE;
}