import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem, OrderSummary } from '../types'
import LoginPage from './LoginPage'
import ProductImage from '../components/common/ProductImage'

interface CheckoutPageProps {
  globalCartData?: any;
}

const CheckoutPage = ({ globalCartData }: CheckoutPageProps) => {
  const navigate = useNavigate()
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    summary: OrderSummary;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutOption, setCheckoutOption] = useState<'login' | 'guest' | 'register' | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [guestFormErrors, setGuestFormErrors] = useState<{[key: string]: string}>({})
  const [registerInfo, setRegisterInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [registerFormErrors, setRegisterFormErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    // Try to get cart data from localStorage first, then from props
    const storedCartData = localStorage.getItem('checkoutCartData')
    
    if (storedCartData) {
      try {
        const parsedData = JSON.parse(storedCartData)
        setCartData(parsedData)
        console.log('📦 Cart data loaded from localStorage:', parsedData)
      } catch (error) {
        console.error('❌ Error parsing stored cart data:', error)
      }
    } else if (globalCartData) {
      setCartData(globalCartData)
      console.log('📦 Cart data loaded from props:', globalCartData)
    } else {
      console.log('❌ No cart data found')
      navigate('/cart')
      return
    }
    
    setLoading(false)
  }, [globalCartData, navigate])

  const handleLogin = () => {
    setCheckoutOption('login')
  }

  const handleLoginSuccess = () => {
    setCheckoutOption(null)
    // User is now logged in, proceed to shipping
    navigate('/shipping')
  }

  const validateGuestForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!guestInfo.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!guestInfo.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!guestInfo.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setGuestFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGuestInfoChange = (field: string, value: string) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (guestFormErrors[field]) {
      setGuestFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleGuestFormSubmit = () => {
    if (validateGuestForm()) {
      // Store guest info in localStorage for shipping page
      localStorage.setItem('guestInfo', JSON.stringify(guestInfo))
      
      // Proceed to combined shipping/payment page
      navigate('/shipping-payment')
    }
  }

  const validateRegisterForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!registerInfo.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!registerInfo.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!registerInfo.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerInfo.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!registerInfo.password) {
      errors.password = 'Password is required'
    } else if (registerInfo.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (registerInfo.password !== registerInfo.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setRegisterFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegisterInfoChange = (field: string, value: string) => {
    setRegisterInfo(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (registerFormErrors[field]) {
      setRegisterFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleRegisterFormSubmit = () => {
    if (validateRegisterForm()) {
      // Store registration info and mark as logged in
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', registerInfo.email)
      localStorage.setItem('userInfo', JSON.stringify({
        firstName: registerInfo.firstName,
        lastName: registerInfo.lastName,
        email: registerInfo.email
      }))
      
      // Reset checkout option and proceed to combined shipping/payment page
      setCheckoutOption(null)
      navigate('/shipping-payment')
    }
  }

  const handleGuestCheckout = () => {
    setCheckoutOption('guest')
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - for demo purposes, accept any email/password
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (email && password) {
      // Store login state
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userEmail', email)
      
      // Reset checkout option and proceed to combined shipping/payment page
      setCheckoutOption(null)
      navigate('/shipping-payment')
    }
  }

  const handleRegister = () => {
    setCheckoutOption('register')
  }

  const handleBackToCart = () => {
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Show login form in right panel if login option is selected

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <p className="text-gray-600 mb-6">Your cart appears to be empty.</p>
          <button
            onClick={handleBackToCart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return to Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Checkout Progress Stepper */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Step 1: Cart */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Cart</p>
                  <p className="text-xs text-gray-500">Items selected</p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-blue-200 mx-4"></div>

              {/* Step 2: Account */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">2</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Account</p>
                  <p className="text-xs text-gray-500">Login or guest checkout</p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>

              {/* Step 3: Shipping & Payment */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">3</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-400">Shipping & Payment</p>
                  <p className="text-xs text-gray-400">Address & payment method</p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>

              {/* Step 4: Review */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">4</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-400">Review</p>
                  <p className="text-xs text-gray-400">Order confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
            {/* Checkout Options */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">How would you like to checkout?</h2>
                
                <div className="space-y-4">
                  {/* Login Option */}
                  <div className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    checkoutOption === 'login' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                       onClick={handleLogin}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          checkoutOption === 'login' ? 'bg-blue-500' : 'bg-blue-100'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            checkoutOption === 'login' ? 'text-white' : 'text-blue-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          checkoutOption === 'login' ? 'text-blue-900' : 'text-gray-900'
                        }`}>Sign In</h3>
                        <p className={`text-sm mt-1 ${
                          checkoutOption === 'login' ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          Already have an account? Sign in to access your saved information.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className={`w-5 h-5 ${
                          checkoutOption === 'login' ? 'text-blue-500' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Register Option */}
                  <div className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    checkoutOption === 'register' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                       onClick={handleRegister}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          checkoutOption === 'register' ? 'bg-green-500' : 'bg-green-100'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            checkoutOption === 'register' ? 'text-white' : 'text-green-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          checkoutOption === 'register' ? 'text-green-900' : 'text-gray-900'
                        }`}>Create Account</h3>
                        <p className={`text-sm mt-1 ${
                          checkoutOption === 'register' ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          Create a new account to save your information and track orders.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className={`w-5 h-5 ${
                          checkoutOption === 'register' ? 'text-green-500' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Guest Checkout Option */}
                  <div className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                    checkoutOption === 'guest' 
                      ? 'border-gray-500 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                       onClick={handleGuestCheckout}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          checkoutOption === 'guest' ? 'bg-gray-500' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            checkoutOption === 'guest' ? 'text-white' : 'text-gray-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          checkoutOption === 'guest' ? 'text-gray-900' : 'text-gray-900'
                        }`}>Guest Checkout</h3>
                        <p className={`text-sm mt-1 ${
                          checkoutOption === 'guest' ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          Checkout as a guest. You can create an account later to track your orders.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className={`w-5 h-5 ${
                          checkoutOption === 'guest' ? 'text-gray-500' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back to Cart */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleBackToCart}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Order Summary, Guest Form, or Login Form */}
            <div className="lg:col-span-1">
              {checkoutOption === 'guest' ? (
                /* Guest Information Form */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleGuestFormSubmit(); }} className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={guestInfo.firstName}
                        onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          guestFormErrors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {guestFormErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{guestFormErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={guestInfo.lastName}
                        onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          guestFormErrors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {guestFormErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{guestFormErrors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={guestInfo.email}
                        onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          guestFormErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {guestFormErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{guestFormErrors.email}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Continue to Shipping
                    </button>
                  </form>


                </div>
              ) : checkoutOption === 'login' ? (
                /* Login Form */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign In</h2>
                  
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="loginEmail"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Sign In & Continue
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setCheckoutOption('register')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </div>
              ) : checkoutOption === 'register' ? (
                /* Registration Form */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Account</h2>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleRegisterFormSubmit(); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="regFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="regFirstName"
                          value={registerInfo.firstName}
                          onChange={(e) => handleRegisterInfoChange('firstName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            registerFormErrors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="First name"
                        />
                        {registerFormErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{registerFormErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="regLastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="regLastName"
                          value={registerInfo.lastName}
                          onChange={(e) => handleRegisterInfoChange('lastName', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            registerFormErrors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Last name"
                        />
                        {registerFormErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{registerFormErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="regEmail"
                        value={registerInfo.email}
                        onChange={(e) => handleRegisterInfoChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          registerFormErrors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {registerFormErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{registerFormErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        id="regPassword"
                        value={registerInfo.password}
                        onChange={(e) => handleRegisterInfoChange('password', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          registerFormErrors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Create a password"
                      />
                      {registerFormErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{registerFormErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="regConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        id="regConfirmPassword"
                        value={registerInfo.confirmPassword}
                        onChange={(e) => handleRegisterInfoChange('confirmPassword', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          registerFormErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                      {registerFormErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{registerFormErrors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Account & Continue
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Already have an account?{' '}
                      <button
                        onClick={() => setCheckoutOption('login')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* Order Summary */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Cart Items Preview */}
                  <div className="space-y-3 mb-4">
                    {cartData.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {/* Price Display */}
                          {item.listPrice && parseFloat(item.listPrice.replace(/,/g, '')) > item.price ? (
                            <div className="flex flex-col items-end space-y-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400 text-xs line-through">
                                  ${parseFloat(item.listPrice.replace(/,/g, '')).toFixed(2)}
                                </span>
                                <span className="text-gray-900 text-sm font-medium">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                              {item.savings && parseFloat(item.savings.replace(/,/g, '')) > 0 && (
                                <span className="text-green-600 text-xs">
                                  Save ${parseFloat(item.savings.replace(/,/g, '')).toFixed(2)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {cartData.items.length > 3 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500">
                          +{cartData.items.length - 3} more {cartData.items.length - 3 === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Order Summary Details */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${cartData.summary.subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                          {cartData.summary.shipping === 0 ? 'Free' : `$${cartData.summary.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Sales Tax</span>
                        <span className="font-medium">${cartData.summary.tax.toFixed(2)}</span>
                      </div>
                      
                      {cartData.summary.discount && cartData.summary.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-${cartData.summary.discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>${cartData.summary.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage 