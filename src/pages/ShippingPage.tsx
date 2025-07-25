import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadCoreFORCEShoppingCart } from '../services/api'
import { CartItem, OrderSummary } from '../types'

const ShippingPage = () => {
  const navigate = useNavigate()
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    summary: OrderSummary;
    rawData: any;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  useEffect(() => {
    const loadCart = () => {
      try {
        setLoading(true)
        const data = loadCoreFORCEShoppingCart()
        setCartData(data)
        
        // Auto-select shipping method based on cart requirements
        if (data.items.some(item => item.shippingOptions?.ship_to_ffl)) {
          setSelectedShippingMethod('ffl')
        } else if (data.items.some(item => item.shippingOptions?.ship_to_home)) {
          setSelectedShippingMethod('home')
        } else if (data.items.some(item => item.shippingOptions?.pickup)) {
          setSelectedShippingMethod('pickup')
        }
      } catch (err) {
        console.error('Error loading cart:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/payment')
  }

  // Determine available shipping options based on cart items
  const getAvailableShippingOptions = () => {
    if (!cartData?.items) return []
    
    const options = []
    const hasFFLRequired = cartData.items.some(item => item.shippingOptions?.ship_to_ffl)
    const hasHomeDelivery = cartData.items.some(item => item.shippingOptions?.ship_to_home)
    const hasPickup = cartData.items.some(item => item.shippingOptions?.pickup)
    const hasShipToStore = cartData.items.some(item => item.shippingOptions?.ship_to_store)

    if (hasFFLRequired) {
      options.push({
        id: 'ffl',
        name: 'Ship to FFL Dealer',
        description: 'Firearms must be shipped to a licensed FFL dealer',
        price: cartData.summary.shipping,
        required: true
      })
    }

    if (hasHomeDelivery) {
      options.push({
        id: 'home',
        name: 'Home Delivery',
        description: 'Standard shipping to your address',
        price: cartData.summary.shipping,
        required: false
      })
    }

    if (hasPickup) {
      options.push({
        id: 'pickup',
        name: 'Store Pickup',
        description: 'Pick up your order at our store',
        price: 0,
        required: false
      })
    }

    if (hasShipToStore) {
      options.push({
        id: 'ship-to-store',
        name: 'Ship to Store',
        description: 'Item will be shipped to store for pickup',
        price: cartData.summary.shipping,
        required: false
      })
    }

    return options
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipping options...</p>
        </div>
      </div>
    )
  }

  if (!cartData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load cart data</p>
          <button 
            onClick={() => navigate('/cart')} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    )
  }

  const shippingOptions = getAvailableShippingOptions()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          
          {/* Shipping Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedShippingMethod === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedShippingMethod(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.id}
                          checked={selectedShippingMethod === option.id}
                          onChange={() => setSelectedShippingMethod(option.id)}
                          className="mr-3"
                        />
                        <div>
                          <h4 className="font-medium">{option.name}</h4>
                          <p className="text-sm text-gray-600">{option.description}</p>
                          {option.required && (
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Form - Only show if not pickup */}
          {selectedShippingMethod !== 'pickup' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 2 (Optional)
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* FFL Information - Only show if FFL shipping is selected */}
              {selectedShippingMethod === 'ffl' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">FFL Dealer Information</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Please provide the FFL dealer information where you'd like your firearm shipped.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        FFL Dealer Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        FFL Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!selectedShippingMethod}
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Pickup Information */}
          {selectedShippingMethod === 'pickup' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Store Pickup</h4>
                <p className="text-sm text-green-700">
                  Your order will be ready for pickup at our store. You'll receive a notification when it's ready.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={() => navigate('/payment')}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartData.summary.subtotal.toFixed(2)}</span>
            </div>
            {cartData.summary.discount && cartData.summary.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${cartData.summary.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${cartData.summary.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${cartData.summary.tax.toFixed(2)}</span>
            </div>
            {cartData.summary.totalSavings && cartData.summary.totalSavings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Total Savings</span>
                <span>${cartData.summary.totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${cartData.summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingPage