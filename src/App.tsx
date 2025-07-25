import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CartPage from './pages/CartPage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import ReviewPage from './pages/ReviewPage'

function App() {
  // Global state for cart data
  const [globalCartData, setGlobalCartData] = useState<any>(null)

  useEffect(() => {
    // Expose global function immediately when App loads
    ;(window as any).updateCartData = (data: any) => {
      console.log('🔄 updateCartData called from App with:', data)
      setGlobalCartData(data)
      
      // Also dispatch a custom event for components that might be listening
      const event = new CustomEvent('cartDataUpdated', { detail: data })
      window.dispatchEvent(event)
    }

    // Also expose a function to check if the app is ready
    ;(window as any).isReactAppReady = () => {
      return typeof (window as any).updateCartData === 'function'
    }

    console.log('🚀 React App initialized - updateCartData function exposed')
    
    // Listen for messages from parent window (if in iframe)
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_CART_DATA') {
        console.log('📨 Received cart data from parent window:', event.data.data)
        setGlobalCartData(event.data.data)
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      ;(window as any).updateCartData = undefined
      ;(window as any).isReactAppReady = undefined
      window.removeEventListener('message', handleMessage)
    }
  }, [])

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
            <Route path="/cart" element={<CartPage globalCartData={globalCartData} />} />
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