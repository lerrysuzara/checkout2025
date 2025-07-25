import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ReviewPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setOrderComplete(true)
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
              <strong>Order ID:</strong> #12345<br />
              <strong>Total:</strong> $765.96<br />
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Review</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 py-4 border-b">
              <img
                src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Headphones"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">Premium Wireless Headphones</h3>
                <p className="text-gray-600">Quantity: 1</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$299.99</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 py-4 border-b">
              <img
                src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Watch"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">Smart Fitness Watch</h3>
                <p className="text-gray-600">Quantity: 2</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$399.98</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="text-gray-600">
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>New York, NY 10001</p>
            <p>john.doe@example.com</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 1234</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$699.97</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$9.99</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$56.00</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>$765.96</span>
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
                'Place Order - $765.96'
              )}
            </button>
            
            <button
              onClick={() => navigate('/payment')}
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