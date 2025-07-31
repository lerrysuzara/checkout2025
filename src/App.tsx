import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ShoppingCartPage from './pages/ShoppingCartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import CartPage from './pages/CartPage'
import ShippingPage from './pages/ShippingPage'
import ShippingPaymentPage from './pages/ShippingPaymentPage'
import PaymentPage from './pages/PaymentPage'
import ReviewPage from './pages/ReviewPage'
import { transformCoreFORCECartData, validateCoreFORCECartData } from './utils/coreforceTransformer'
import { mockCoreFORCEShoppingCartResponse, mockCartItems, calculateOrderSummary } from './services/mockData'

// Extend Window interface to include our custom functions
declare global {
  interface Window {
    updateCartData?: (data: any) => void;
    loadMockData?: () => void;
    loadCoreFORCEMockData?: () => void;
    isReactAppReady?: () => boolean;
  }
}

function App() {
  // Global state for cart data
  const [globalCartData, setGlobalCartData] = useState<any>(null)

  // Function to load mock data
  const loadMockData = () => {
    console.log('🔄 Loading simple mock data...')
    
    // Use simple mock cart items
    const mockData = {
      items: mockCartItems,
      summary: calculateOrderSummary(mockCartItems),
      rawData: null
    }
    
    setGlobalCartData(mockData)
    
    // Dispatch event for components listening
    const event = new CustomEvent('cartDataUpdated', { detail: mockData })
    window.dispatchEvent(event)
    
    console.log('✅ Simple mock data loaded:', mockData)
  }

  // Function to load coreFORCE mock data
  const loadCoreFORCEMockData = () => {
    console.log('🔄 Loading coreFORCE mock data...')
    
    if (validateCoreFORCECartData(mockCoreFORCEShoppingCartResponse)) {
      const transformedData = transformCoreFORCECartData(mockCoreFORCEShoppingCartResponse)
      setGlobalCartData(transformedData)
      
      // Dispatch event for components listening
      const event = new CustomEvent('cartDataUpdated', { detail: transformedData })
      window.dispatchEvent(event)
      
      console.log('✅ CoreFORCE mock data loaded:', transformedData)
    } else {
      console.error('❌ Invalid coreFORCE mock data')
    }
  }

  useEffect(() => {
    // Expose global function immediately when App loads
    ;(window as any).updateCartData = (data: any) => {
      console.log('🔄 updateCartData called from App with:', data)
      
      // Check if this is coreFORCE data and transform it
      if (validateCoreFORCECartData(data)) {
        console.log('✅ Valid coreFORCE data detected, transforming...')
        const transformedData = transformCoreFORCECartData(data)
        setGlobalCartData(transformedData)
        
        // Also dispatch a custom event for components that might be listening
        const event = new CustomEvent('cartDataUpdated', { detail: transformedData })
        window.dispatchEvent(event)
      } else {
        console.log('📦 Using data as-is (not coreFORCE format)')
        setGlobalCartData(data)
        
        // Also dispatch a custom event for components that might be listening
        const event = new CustomEvent('cartDataUpdated', { detail: data })
        window.dispatchEvent(event)
      }
    }

    // Expose mock data loading functions
    ;(window as any).loadMockData = loadMockData
    ;(window as any).loadCoreFORCEMockData = loadCoreFORCEMockData

    // Also expose a function to check if the app is ready
    ;(window as any).isReactAppReady = () => {
      return typeof (window as any).updateCartData === 'function'
    }

    console.log('🚀 React App initialized - updateCartData function exposed')
    console.log('🧪 Mock data functions available: loadMockData(), loadCoreFORCEMockData()')
    
    // Load coreFORCE mock data by default for testing
    setTimeout(() => {
      loadCoreFORCEMockData()
    }, 100)
    
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
      ;(window as any).loadMockData = undefined
      ;(window as any).loadCoreFORCEMockData = undefined
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
                   <Route path="/cart" element={<ShoppingCartPage globalCartData={globalCartData} />} />
                   <Route path="/checkout" element={<CheckoutPage globalCartData={globalCartData} />} />
                   <Route path="/login" element={<LoginPage />} />
                   <Route path="/shipping" element={<ShippingPage globalCartData={globalCartData} />} />
                   <Route path="/shipping-payment" element={<ShippingPaymentPage globalCartData={globalCartData} />} />
                   <Route path="/payment" element={<PaymentPage />} />
                   <Route path="/review" element={<ReviewPage globalCartData={globalCartData} />} />
                   {/* Legacy route for backward compatibility */}
                   <Route path="/cart-old" element={<CartPage globalCartData={globalCartData} />} />
                 </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App