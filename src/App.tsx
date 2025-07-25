import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CartPage from './pages/CartPage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import ReviewPage from './pages/ReviewPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600">
              Complete your purchase in a few simple steps
            </p>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/cart" replace />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/review" element={<ReviewPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App