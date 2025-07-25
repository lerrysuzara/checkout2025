/**
 * Custom hook for managing checkout state
 * Implements centralized state management with proper error handling
 */

import { useState, useCallback, useEffect } from 'react';
import { CheckoutState, CartItem, ShippingAddress, PaymentInfo, CheckoutStep } from '../types';
// import { apiService } from '../services/api';
import { calculateOrderSummary } from '../services/mockData';

const initialState: CheckoutState = {
  cartItems: [],
  shippingAddress: null,
  paymentInfo: null,
  orderSummary: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    currency: 'USD'
  },
  currentStep: 'cart',
  isLoading: false,
  errors: {}
};

export const useCheckoutState = () => {
  const [state, setState] = useState<CheckoutState>(initialState);

  // Load initial cart data
  useEffect(() => {
    loadCartItems();
  }, []);

  // Update order summary when cart items change
  useEffect(() => {
    if (state.cartItems.length > 0) {
      const summary = calculateOrderSummary(state.cartItems);
      setState(prev => ({ ...prev, orderSummary: summary }));
    }
  }, [state.cartItems]);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: message }
    }));
  }, []);

  const clearError = useCallback((field: string) => {
    setState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[field];
      return { ...prev, errors: newErrors };
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: {} }));
  }, []);

  const loadCartItems = useCallback(async () => {
    setLoading(true);
    clearAllErrors();
    
    try {
      // const response = await apiService.getCartItems();
      // if (response.success && response.data) {
      //   setState(prev => ({ ...prev, cartItems: response.data! }));
      // } else {
      //   setError('cart', response.error || 'Failed to load cart items');
      // }
    } catch (error) {
      setError('cart', 'Network error while loading cart');
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearAllErrors, setError]);

  const updateCartItemQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setLoading(true);
    try {
      // const response = await apiService.updateCartItem(itemId, quantity);
      // if (response.success && response.data) {
      //   setState(prev => ({ ...prev, cartItems: response.data! }));
      // } else {
      //   setError('cart', response.error || 'Failed to update item');
      // }
    } catch (error) {
      setError('cart', 'Network error while updating item');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const removeCartItem = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      setState(prev => ({
        ...prev,
        cartItems: prev.cartItems.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      setError('cart', 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const saveShippingAddress = useCallback(async (address: ShippingAddress) => {
    setLoading(true);
    clearAllErrors();
    
    try {
      // const response = await apiService.saveShippingAddress(address);
      // if (response.success) {
      setState(prev => ({ ...prev, shippingAddress: address }));
      return true;
      // } else {
      //   setError('shipping', response.error || 'Failed to save shipping address');
      //   return false;
      // }
    } catch (error) {
      setError('shipping', 'Network error while saving address');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearAllErrors, setError]);

  const savePaymentInfo = useCallback((paymentInfo: PaymentInfo) => {
    setState(prev => ({ ...prev, paymentInfo }));
  }, []);

  const setCurrentStep = useCallback((step: CheckoutStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
    clearAllErrors();
  }, [clearAllErrors]);

  const submitOrder = useCallback(async () => {
    if (!state.shippingAddress || !state.paymentInfo) {
      setError('order', 'Missing required information');
      return null;
    }

    setLoading(true);
    clearAllErrors();

    try {
      const orderData = {
        items: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentInfo: state.paymentInfo,
        summary: state.orderSummary
      };

      // const response = await apiService.submitOrder(orderData);
      // if (response.success && response.data) {
      //   return response.data;
      // } else {
      //   setError('order', response.error || 'Failed to submit order');
      //   return null;
      // }
      return { orderId: 'mock-order-id', confirmationNumber: 'CONF123456' };
    } catch (error) {
      setError('order', 'Network error while submitting order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [state, setLoading, clearAllErrors, setError]);

  return {
    state,
    actions: {
      loadCartItems,
      updateCartItemQuantity,
      removeCartItem,
      saveShippingAddress,
      savePaymentInfo,
      setCurrentStep,
      submitOrder,
      setError,
      clearError,
      clearAllErrors
    }
  };
};