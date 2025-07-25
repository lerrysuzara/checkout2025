import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PaymentPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/review')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                  <p className="text-sm text-blue-700">Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/shipping')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Shipping
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Review Order
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
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
        </div>
      </div>
    </div>
  )
}

export default PaymentPage