import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadCoreFORCEShoppingCart } from '../services/api'
import { CartItem, OrderSummary } from '../types'

const CartPage = () => {
  const navigate = useNavigate()
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    summary: OrderSummary;
    rawData: any;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't automatically load cart data - wait for explicit call from coreFORCE
    setLoading(false)
    
    // Listen for custom event from coreFORCE
    const handleCartDataLoaded = (event: CustomEvent) => {
      try {
        setLoading(true)
        const data = event.detail
        setCartData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load cart data')
        console.error('Error loading cart:', err)
      } finally {
        setLoading(false)
      }
    }

    // Listen for the custom event
    window.addEventListener('cartDataLoaded', handleCartDataLoaded as EventListener)
    
    return () => {
      window.removeEventListener('cartDataLoaded', handleCartDataLoaded as EventListener)
    }
  }, [])

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">No items found in your shopping cart.</p>
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
          {/* coreFORCE Integration Link */}
          <div className="absolute top-4 right-4">
            <a
              href="https://lerrysuzara.github.io/checkout2025/coreforce-integration-github-pages.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              🔗 coreFORCE Demo
            </a>
          </div>
          
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
                  {/* Show shipping restrictions */}
                  {item.shippingOptions && (
                    <div className="mt-1">
                      {item.shippingOptions.ship_to_ffl && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1">
                          FFL Required
                        </span>
                      )}
                      {item.shippingOptions.ship_to_home && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                          Home Delivery
                        </span>
                      )}
                      {item.shippingOptions.pickup && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">
                          Store Pickup
                        </span>
                      )}
                      {item.shippingOptions.ship_to_store && (
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-1">
                          Ship to Store
                        </span>
                      )}
                    </div>
                  )}
                  {/* Show product tags */}
                  {item.productTagIds && item.productTagIds.length > 0 && (
                    <div className="mt-1">
                      {item.productTagIds.split(',').map((tagId, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                          Tag {tagId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm sm:text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
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
            
            {summary.discount && summary.discount > 0 && (
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