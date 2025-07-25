/**
 * Core type definitions for the checkout application
 * Designed for easy extension and API integration
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
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