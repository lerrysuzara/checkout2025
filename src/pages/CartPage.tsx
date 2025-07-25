import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadCoreFORCEShoppingCart } from '../services/api'
import { CartItem, OrderSummary } from '../types'

// Extend Window interface to include our custom functions
declare global {
  interface Window {
    updateCartData?: (data: any) => void;
  }
}

interface CartPageProps {
  globalCartData?: any;
}

const CartPage = ({ globalCartData }: CartPageProps) => {
  const navigate = useNavigate()
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    summary: OrderSummary;
    rawData: any;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to remove item from cart
  const removeItemFromCart = (itemId: string) => {
    if (!cartData) return

    const updatedItems = cartData.items.filter(item => item.id !== itemId)
    
    if (updatedItems.length === 0) {
      // If no items left, clear the cart
      setCartData(null)
      // Also clear global cart data
      if (window.updateCartData) {
        window.updateCartData(null)
      }
      return
    }

    // Recalculate order summary
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = parseFloat(cartData.summary.shipping.toString()) || 0
    const discount = parseFloat(cartData.summary.discount?.toString() || '0') || 0
    const discountPercent = parseFloat(cartData.summary.discountPercent?.toString() || '0') || 0
    const totalSavings = parseFloat(cartData.summary.totalSavings?.toString() || '0') || 0
    const estimatedTax = subtotal * 0.08 // 8% tax rate as example
    const total = subtotal + shipping + estimatedTax - discount

    const updatedSummary: OrderSummary = {
      ...cartData.summary,
      subtotal,
      tax: estimatedTax,
      total
    }

    const updatedCartData = {
      ...cartData,
      items: updatedItems,
      summary: updatedSummary
    }

    // Update local cart data
    setCartData(updatedCartData)
    
    // Update global cart data so other components (like ShippingPage) get the updated cart
    if (window.updateCartData) {
      window.updateCartData(updatedCartData)
    }
    
    console.log('✅ Item removed from cart:', itemId)
    console.log('🔄 Updated global cart data with remaining items:', updatedItems.length)
  }

  useEffect(() => {
    // Don't automatically load cart data - wait for explicit call from coreFORCE
    setLoading(false)
    
    // Listen for custom event from App component
    const handleCartDataUpdated = (event: any) => {
      try {
        console.log('🔄 Cart data updated via event:', event.detail)
        setLoading(true)
        const data = event.detail
        setTimeout(() => {
          setCartData(data)
          setError(null)
          setLoading(false)
          console.log('✅ Cart data updated via event')
        }, 0)
      } catch (err) {
        console.error('❌ Error in handleCartDataUpdated:', err)
        setError('Failed to load cart data')
        setLoading(false)
      }
    }

    // Listen for the custom event
    window.addEventListener('cartDataUpdated', handleCartDataUpdated)
    
    // Debug: Log when component mounts
    console.log('🛒 CartPage mounted, waiting for cart data...')
    
    return () => {
      window.removeEventListener('cartDataUpdated', handleCartDataUpdated)
    }
  }, [])

  // Use globalCartData if provided from App component
  useEffect(() => {
    if (globalCartData) {
      console.log('🔄 Using globalCartData from App:', globalCartData)
      setLoading(true)
      setTimeout(() => {
        setCartData(globalCartData)
        setError(null)
        setLoading(false)
        console.log('✅ Cart data set from globalCartData')
      }, 0)
    }
  }, [globalCartData])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!cartData || cartData.items.length === 0) {
    console.log('🛒 Cart is empty. cartData:', cartData, 'items length:', cartData?.items?.length)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">No items found in your shopping cart.</p>
          <p className="text-sm text-gray-500 mb-4">Debug: cartData = {JSON.stringify(cartData)}</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const { items, summary } = cartData

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          
          <h2 className="text-xl font-semibold mb-6">Shopping Cart</h2>
          
          {/* Promotion Code Display */}
          {summary.promotionCode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-medium">
                    Promotion Applied: {summary.promotionCode}
                  </p>
                  <p className="text-green-600 text-sm">
                    {summary.promotionDescription}
                  </p>
                  {summary.discountPercent && summary.discountPercent > 0 && (
                    <p className="text-green-600 text-sm">
                      {summary.discountPercent}% discount applied
                    </p>
                  )}
                </div>
                <div className="text-green-800 font-semibold">
                  -${(summary.discount || 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 py-4 border-b">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-gray-500 text-xs text-center ${item.image ? 'hidden' : ''}`}>
                    <div>
                      <div className="text-2xl mb-1">📦</div>
                      <div>Product</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                  <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                  {item.productCode && (
                    <p className="text-gray-500 text-xs">SKU: {item.productCode}</p>
                  )}
                  {item.inventoryQuantity !== undefined && (
                    <p className="text-gray-500 text-xs">
                      In Stock: {item.inventoryQuantity}
                    </p>
                  )}
                  {/* Show discount/savings if available */}
                  {item.savings && parseFloat(item.savings) > 0 && (
                    <div className="mt-1">
                      <span className="text-green-600 text-xs font-medium">
                        Save ${parseFloat(item.savings).toFixed(2)}
                      </span>
                      {item.discount && (
                        <span className="text-green-600 text-xs ml-2">
                          ({item.discount} off)
                        </span>
                      )}
                    </div>
                  )}
                  {/* Show FFL requirement */}
                  {item.shippingOptions && item.shippingOptions.ship_to_ffl && (
                    <div className="mt-1">
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1">
                        FFL Required
                      </span>
                    </div>
                  )}

                </div>
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItemFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Subtotal</span>
              <span>${summary.subtotal.toFixed(2)}</span>
            </div>
            
            {summary.discount !== undefined && summary.discount !== null && summary.discount > 0 && (
              <div className="flex justify-between text-sm sm:text-base text-green-600">
                <span>Discount</span>
                <span>-${summary.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm sm:text-base">
              <span>Shipping</span>
              <span>${summary.shipping.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm sm:text-base">
              <span>Tax</span>
              <span>${summary.tax.toFixed(2)}</span>
            </div>
            
            {summary.totalSavings && summary.totalSavings > 0 && (
              <div className="flex justify-between text-sm sm:text-base text-green-600">
                <span>Total Savings</span>
                <span>${summary.totalSavings.toFixed(2)}</span>
              </div>
            )}
            
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-base sm:text-lg">
                <span>Total</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Loyalty Points */}
          {summary.loyaltyPoints && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">{summary.loyaltyPoints}</p>
            </div>
          )}

          <button
            onClick={() => navigate('/shipping')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Proceed to Shipping
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage