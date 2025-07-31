import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem, OrderSummary } from '../types'
import ProductImage from '../components/common/ProductImage'

interface ReviewPageProps {
  globalCartData?: any;
}

const ReviewPage = ({ globalCartData }: ReviewPageProps) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    summary: OrderSummary;
    rawData: any;
  } | null>(null)
  const [shippingDetails, setShippingDetails] = useState<any>(null)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  // Load cart data and shipping/payment details from localStorage
  useEffect(() => {
    // Load cart data
    if (globalCartData) {
      setCartData(globalCartData)
    } else {
      const storedCartData = localStorage.getItem('cartData')
      if (storedCartData) {
        setCartData(JSON.parse(storedCartData))
      }
    }

    // Load shipping details
    const storedShippingDetails = localStorage.getItem('shippingInfo')
    if (storedShippingDetails) {
      setShippingDetails(JSON.parse(storedShippingDetails))
    }

    // Load payment details
    const storedPaymentDetails = localStorage.getItem('paymentDetails')
    if (storedPaymentDetails) {
      setPaymentDetails(JSON.parse(storedPaymentDetails))
    }
  }, [globalCartData])

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setOrderComplete(true)
  }

  const getPaymentMethodDisplay = () => {
    if (!paymentDetails) return { name: 'Not selected', icon: '💳', description: '', details: '' }
    
    const paymentMethods = [
      { id: 'credit_card', name: 'Credit Card', icon: 'http://localhost:5173/assets/images/credit_card.png', description: 'Visa, Mastercard, American Express, Discover' },
      { id: 'paypal', name: 'PayPal', icon: 'https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png', description: 'Pay with your PayPal account' },
      { id: 'gift_card', name: 'Gift Card', icon: 'http://localhost:5173/assets/images/gift_card.png', description: 'Apply gift card balance' },
      { id: 'sezzle', name: 'Sezzle', icon: 'https://images.ctfassets.net/6d085vujy22q/273Nz43iRAEjHGwsaCmQDu/dda99ab0df0f1914fa7fcaaba21035fc/image_201.png?w=1000&h=356&q=50&fm=webp', description: 'Pay in 4 interest-free installments' },
      { id: 'credova', name: 'Credova', icon: 'https://cdn.prod.website-files.com/68409dd5e6545795f95d69c6/685c61c8230042645ce3de7c_BlueLogo.webp', description: 'Shop Now, Pay Over Time' },
      { id: 'loyalty_points', name: 'Loyalty Points', icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827933.png', description: 'Use your accumulated loyalty points' },
      { id: 'invoice', name: 'Invoice', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', description: 'Pay by invoice (business accounts only)' }
    ]
    
    const method = paymentMethods.find(m => m.id === paymentDetails.paymentMethod)
    
    if (!method) return { name: 'Unknown', icon: '💳', description: '', details: '' }
    
    // Add specific details for credit card
    let details = ''
    if (paymentDetails.paymentMethod === 'credit_card' && paymentDetails.cardNumber) {
      const last4 = paymentDetails.cardNumber.slice(-4)
      details = `•••• •••• •••• ${last4}`
    } else if (paymentDetails.paymentMethod === 'gift_card' && paymentDetails.giftCardNumber) {
      const last4 = paymentDetails.giftCardNumber.slice(-4)
      details = `Gift Card ending in ${last4}`
    } else if (paymentDetails.paymentMethod === 'loyalty_points' && paymentDetails.loyaltyPoints) {
      details = `${paymentDetails.loyaltyPoints} points applied`
    }
    
    return { ...method, details }
  }

  const getShippingMethodDisplay = () => {
    if (!shippingDetails) return 'Not selected'
    
    const shippingMethods = {
      'ship_to_home': 'Ship to Home Address',
      'ship_to_ffl': 'Ship to FFL Dealer',
      'pickup': 'Pickup in Store'
    }
    
    const baseMethod = shippingMethods[shippingDetails.shippingMethod as keyof typeof shippingMethods] || 'Not selected'
    
    // Add specific details based on shipping method
    if (shippingDetails.shippingMethod === 'pickup' && shippingDetails.selectedStoreLocation) {
      return `${baseMethod} - ${shippingDetails.selectedStoreLocation}`
    } else if (shippingDetails.shippingMethod === 'ship_to_ffl') {
      if (shippingDetails.selectedFflDealer) {
        return `${baseMethod} - ${shippingDetails.selectedFflDealer}`
      } else if (shippingDetails.fflUploadOption === 'upload') {
        return `${baseMethod} - FFL License Upload`
      } else if (shippingDetails.fflUploadOption === 'followup') {
        return `${baseMethod} - FFL Not Found (Follow-up Required)`
      } else {
        return `${baseMethod} - FFL Selection Required`
      }
    }
    
    return baseMethod
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>Order ID:</strong> #{Math.floor(Math.random() * 100000)}<br />
              <strong>Total:</strong> ${cartData?.summary.total.toFixed(2) || '0.00'}<br />
              <strong>Estimated Delivery:</strong> 3-5 business days
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  if (!cartData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Cart Data</h1>
          <p className="text-gray-600 mb-6">
            Please return to the cart to add items before reviewing your order.
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Cart
          </button>
        </div>
      </div>
    )
  }

  const paymentMethod = getPaymentMethodDisplay()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Review</h2>
          
          <div className="space-y-4">
            {cartData.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 py-4 border-b">
                <ProductImage 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  {item.productCode && (
                    <p className="text-xs text-gray-500">SKU: {item.productCode}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="text-gray-600">
            {shippingDetails ? (
              <>
                <p>{shippingDetails.firstName} {shippingDetails.lastName}</p>
                <p>{shippingDetails.address}</p>
                {shippingDetails.address2 && <p>{shippingDetails.address2}</p>}
                <p>{shippingDetails.city ? `${shippingDetails.city}, ` : ''}{shippingDetails.state} {shippingDetails.zipCode}</p>
                <p className="mt-2">
                  <strong>Shipping Method:</strong> {getShippingMethodDisplay()}
                </p>
                
                {/* Additional Shipping Details */}
                {shippingDetails.shippingMethod === 'pickup' && shippingDetails.selectedStoreLocation && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Store Details:</p>
                    <p className="text-sm text-gray-600">{shippingDetails.selectedStoreLocation}</p>
                    <p className="text-xs text-gray-500 mt-1">You'll receive a notification when your order is ready for pickup.</p>
                  </div>
                )}
                
                {shippingDetails.shippingMethod === 'ship_to_ffl' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">FFL Details:</p>
                    {shippingDetails.selectedFflDealer ? (
                      <p className="text-sm text-gray-600">{shippingDetails.selectedFflDealer}</p>
                    ) : shippingDetails.fflUploadOption === 'upload' ? (
                      <p className="text-sm text-gray-600">FFL License will be uploaded after order confirmation</p>
                    ) : shippingDetails.fflUploadOption === 'followup' ? (
                      <p className="text-sm text-gray-600">FFL dealer not found - customer service will contact you</p>
                    ) : (
                      <p className="text-sm text-gray-600">FFL dealer selection required</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p>No shipping details available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center">
            {paymentMethod.icon.startsWith('http') ? (
              <img 
                src={paymentMethod.icon} 
                alt={paymentMethod.name}
                className="w-8 h-8 object-contain mr-3"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                <span className="text-lg">{paymentMethod.icon}</span>
              </div>
            )}
            <div>
              <p className="font-medium">{paymentMethod.name}</p>
              <p className="text-sm text-gray-500">{paymentMethod.description}</p>
              {paymentMethod.details && (
                <p className="text-sm text-gray-600 mt-1">{paymentMethod.details}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({cartData.items.length} {cartData.items.length === 1 ? 'Item' : 'Items'})</span>
              <span>${cartData.summary.subtotal.toFixed(2)}</span>
            </div>
            {cartData.summary.shipping > 0 && (
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${cartData.summary.shipping.toFixed(2)}</span>
              </div>
            )}
            {cartData.summary.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${cartData.summary.tax.toFixed(2)}</span>
              </div>
            )}
            {cartData.summary.discount && cartData.summary.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${cartData.summary.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${cartData.summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Place Order - $${cartData.summary.total.toFixed(2)}`
              )}
            </button>
            
            <button
              onClick={() => navigate('/shipping-payment')}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewPage