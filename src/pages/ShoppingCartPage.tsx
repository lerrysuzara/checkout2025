import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem, OrderSummary } from '../types'
import { mockCoreFORCEShoppingCartResponse } from '../services/mockData'
import { transformCoreFORCECartData, validateCoreFORCECartData } from '../utils/coreforceTransformer'
import ProductImage from '../components/common/ProductImage'

interface ShoppingCartPageProps {
  globalCartData?: any;
}

const ShoppingCartPage = ({ globalCartData }: ShoppingCartPageProps) => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [showPromoCodeInput, setShowPromoCodeInput] = useState(false)
  const [appliedPromoCode, setAppliedPromoCode] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    description: string;
  } | null>(null)
  const [promoCodeError, setPromoCodeError] = useState('')
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)

  useEffect(() => {
    // Load mock data if no cart data is provided
    if (!globalCartData || !globalCartData.items || globalCartData.items.length === 0) {
      console.log('🛒 Loading coreFORCE mock shopping cart data...')
      
      if (validateCoreFORCECartData(mockCoreFORCEShoppingCartResponse)) {
        const transformedData = transformCoreFORCECartData(mockCoreFORCEShoppingCartResponse)
        setCartItems(transformedData.items)
        setOrderSummary(transformedData.summary)
        console.log('✅ CoreFORCE mock data loaded:', transformedData)
      } else {
        console.error('❌ Invalid coreFORCE mock data structure')
      }
    } else {
      console.log('🛒 Using provided cart data:', globalCartData)
      setCartItems(globalCartData.items)
      setOrderSummary(globalCartData.summary)
    }
    setLoading(false)
  }, [globalCartData])

  // Auto-apply promo code from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const promoCodeFromUrl = urlParams.get('promo')
    
    if (promoCodeFromUrl && !appliedPromoCode) {
      console.log('🎫 Auto-applying promo code from URL:', promoCodeFromUrl)
      setPromoCode(promoCodeFromUrl)
      // Auto-apply the promo code
      setTimeout(() => {
        applyPromoCode(promoCodeFromUrl)
      }, 500)
    }
  }, [appliedPromoCode])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    
    setCartItems(updatedItems)
    // Recalculate summary manually since we're not using calculateOrderSummary
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = orderSummary?.shipping || 0
    const tax = subtotal * 0.08 // 8% tax rate
    const discount = orderSummary?.discount || null
    const total = subtotal + shipping + tax - (discount || 0)
    
    setOrderSummary({
      ...orderSummary,
      subtotal,
      tax,
      total,
      discount
    })
  }

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    
    // Recalculate summary manually
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = orderSummary?.shipping || 0
    const tax = subtotal * 0.08 // 8% tax rate
    const discount = orderSummary?.discount || null
    const total = subtotal + shipping + tax - (discount || 0)
    
    setOrderSummary({
      ...orderSummary,
      subtotal,
      tax,
      total,
      discount
    })
  }

  const handleCheckout = () => {
    // Save cart data to localStorage or global state for checkout flow
    const cartData = {
      items: cartItems,
      summary: orderSummary,
      rawData: null
    }
    
    // Store in localStorage for checkout pages to access
    localStorage.setItem('checkoutCartData', JSON.stringify(cartData))
    
    // Navigate to checkout
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    navigate('/products') // You can create a products page later
  }

  // Mock promo codes for demonstration
  const validPromoCodes = {
    'SAVE10': { discount: 10, type: 'percentage' as const, description: '10% off your entire order' },
    'FREESHIP': { discount: 0, type: 'fixed' as const, description: 'Free shipping on your order' },
    'WELCOME20': { discount: 20, type: 'percentage' as const, description: '20% off for new customers' },
    'FLAT15': { discount: 15, type: 'fixed' as const, description: '$15 off your order' }
  }

  const applyPromoCode = async (codeToApply?: string) => {
    const code = codeToApply || promoCode.trim()
    if (!code) {
      setPromoCodeError('Please enter a promo code')
      return
    }

    setPromoCodeLoading(true)
    setPromoCodeError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const upperCode = code.toUpperCase()
    const promoData = validPromoCodes[upperCode as keyof typeof validPromoCodes]

    if (promoData) {
      setAppliedPromoCode({
        code: upperCode,
        ...promoData
      })
      setPromoCode('')
      
      // Recalculate order summary with discount
      if (orderSummary) {
        let discountAmount = 0
        if (promoData.type === 'percentage') {
          discountAmount = orderSummary.subtotal * (promoData.discount / 100)
        } else {
          discountAmount = promoData.discount
        }
        
        const newTotal = orderSummary.subtotal + orderSummary.shipping + orderSummary.tax - discountAmount
        
        setOrderSummary({
          ...orderSummary,
          discount: discountAmount,
          total: newTotal
        })
      }
    } else {
      setPromoCodeError('Invalid promo code. Please try again.')
    }

    setPromoCodeLoading(false)
  }

  const removePromoCode = () => {
    setAppliedPromoCode(null)
    
    // Recalculate order summary without discount
    if (orderSummary) {
      const newTotal = orderSummary.subtotal + orderSummary.shipping + orderSummary.tax
      setOrderSummary({
        ...orderSummary,
        discount: null,
        total: newTotal
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={handleContinueShopping}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          size="lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              {item.shippingOptions?.ship_to_ffl && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  FFL Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            {(item.productCode || item.upcCode) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.productCode && `SKU: ${item.productCode}`}
                                {item.productCode && item.upcCode && ' • '}
                                {item.upcCode && `UPC: ${item.upcCode}`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <button
                onClick={handleContinueShopping}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {orderSummary && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Sales Tax</span>
                    <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  
                  {/* Promo Code Section */}
                  <div className="border-t border-gray-200 pt-3">
                    {appliedPromoCode ? (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-green-800">
                                Promo {appliedPromoCode.code} has been applied!
                              </span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              {appliedPromoCode.description}
                            </p>
                          </div>
                          <button
                            onClick={removePromoCode}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!showPromoCodeInput ? (
                          <button
                            onClick={() => setShowPromoCodeInput(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Have a promo code?</span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Enter promo code"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={promoCodeLoading}
                                onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
                              />
                              <button
                                onClick={() => applyPromoCode()}
                                disabled={promoCodeLoading || !promoCode.trim()}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                              >
                                {promoCodeLoading ? (
                                  <span className="animate-pulse">...</span>
                                ) : (
                                  'Apply'
                                )}
                              </button>
                            </div>
                            {promoCodeError && (
                              <p className="text-red-500 text-xs">{promoCodeError}</p>
                            )}
                            <button
                              onClick={() => {
                                setShowPromoCodeInput(false)
                                setPromoCode('')
                                setPromoCodeError('')
                              }}
                              className="text-gray-500 hover:text-gray-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  

                  

                  
                  {orderSummary.discount && orderSummary.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${orderSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-6"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCartPage 