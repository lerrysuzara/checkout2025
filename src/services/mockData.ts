/**
 * Mock data service for development and testing
 * Replace with actual API calls in production
 */

import { CartItem, OrderSummary, ShippingAddress } from '../types';

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