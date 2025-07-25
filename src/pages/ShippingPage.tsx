import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem, OrderSummary } from '../types'

interface ShippingPageProps {
  globalCartData?: any;
}

const ShippingPage = ({ globalCartData }: ShippingPageProps) => {
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
  
  // FFL Dealer selection state
  const [fflSearchZip, setFflSearchZip] = useState('')
  const [fflSearchDistance, setFflSearchDistance] = useState('25')
  const [fflSearchBusinessName, setFflSearchBusinessName] = useState('')
  const [fflSearchType, setFflSearchType] = useState<'zip' | 'business'>('zip')
  const [fflDealers, setFflDealers] = useState<any[]>([])
  const [selectedFflDealer, setSelectedFflDealer] = useState<any>(null)
  const [fflZipLoading, setFflZipLoading] = useState(false)
  const [fflNameLoading, setFflNameLoading] = useState(false)
  const [fflError, setFflError] = useState<string | null>(null)
  const [showUploadLicense, setShowUploadLicense] = useState(false)
  const [uploadedLicense, setUploadedLicense] = useState<File | null>(null)

  // Helper function to format hours from BFG API
  const formatHours = (hours: any[]) => {
    if (!hours || hours.length === 0) return ''
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const formattedHours = hours.map((hour: any) => {
      if (!hour.open_time) return `${dayNames[hour.day_of_week]}: Closed`
      return `${dayNames[hour.day_of_week]}: ${hour.open_time}-${hour.close_time}`
    }).join(', ')
    
    return formattedHours || ''
  }

  useEffect(() => {
    // Use globalCartData if provided from App component
    if (globalCartData) {
      console.log('🔄 Using globalCartData in ShippingPage:', globalCartData)
      setCartData(globalCartData)
      setLoading(false)
      
      // Auto-select shipping method based on cart requirements
      if (globalCartData.items.some((item: CartItem) => item.shippingOptions?.ship_to_ffl)) {
        setSelectedShippingMethod('ffl')
      } else if (globalCartData.items.some((item: CartItem) => item.shippingOptions?.ship_to_home)) {
        setSelectedShippingMethod('home')
      } else if (globalCartData.items.some((item: CartItem) => item.shippingOptions?.pickup)) {
        setSelectedShippingMethod('pickup')
      }
    } else {
      setLoading(false)
    }
  }, [globalCartData])

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

  // Search for FFL dealers by ZIP
  const searchFflDealersByZip = async () => {
    if (!fflSearchZip.trim()) {
      setFflError('Please enter a ZIP code')
      return
    }

    setFflZipLoading(true)
    setFflError(null)
    setFflDealers([])
    setSelectedFflDealer(null)

    try {
      const pageSize = 10
      const page = 1

      console.log('🔍 Searching FFL dealers by zipcode:', fflSearchZip.trim())

      // Use our local proxy server to avoid CORS issues
      const proxyUrl = `http://localhost:3001/api/ffl-dealers?zipcode=${encodeURIComponent(fflSearchZip.trim())}&per_page=${pageSize}&page=${page}`
      console.log('Fetching from local proxy:', proxyUrl)

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Proxy API error:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Proxy API error response:', errorText)
        throw new Error(`Proxy API request failed: ${response.status}`)
      }

      const bfgData = await response.json()
      console.log(`Received ${bfgData.data.length} FFL dealers from BFG API via proxy`)

      // Transform BFG data to our format
      const transformedDealers = bfgData.data.map((dealer: any) => ({
        id: dealer.id,
        name: dealer.business_name || dealer.license_name,
        address: dealer.premise_address,
        city: dealer.premise_city,
        state: dealer.premise_state,
        zip: dealer.premise_zipcode,
        phone: dealer.phone || 'N/A',
        distance: 'N/A', // BFG doesn't provide distance in this API
        fflNumber: dealer.ffl_number,
        hours: formatHours(dealer.hours)
      }))

      setFflDealers(transformedDealers)
      console.log('✅ FFL dealers loaded:', transformedDealers.length)
      console.log('🔍 Transformed dealers:', transformedDealers)
    } catch (error) {
      console.error('❌ Error searching FFL dealers:', error)
      console.log('🔄 Falling back to mock data...')
      
      // Fallback to mock data when API fails
      const mockFflDealers = [
        {
          id: '1',
          name: 'ABC Firearms & Ammo',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '90210',
          phone: '(555) 123-4567',
          distance: '2.3 miles',
          fflNumber: '1-23-456-78-9A',
          hours: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM'
        },
        {
          id: '2',
          name: 'Defense Depot',
          address: '456 Oak Ave',
          city: 'Somewhere',
          state: 'CA',
          zip: '90211',
          phone: '(555) 987-6543',
          distance: '4.1 miles',
          fflNumber: '2-34-567-89-B',
          hours: 'Mon-Sat 8AM-8PM'
        },
        {
          id: '3',
          name: 'Gun Shop Plus',
          address: '789 Pine Rd',
          city: 'Elsewhere',
          state: 'CA',
          zip: '90212',
          phone: '(555) 456-7890',
          distance: '6.7 miles',
          fflNumber: '3-45-678-90-C',
          hours: 'Tue-Sat 10AM-6PM'
        }
      ]

      setFflDealers(mockFflDealers)
      setFflError('API temporarily unavailable. Showing sample FFL dealers.')
      console.log('✅ Mock FFL dealers loaded:', mockFflDealers.length)
    } finally {
      setFflZipLoading(false)
    }
  }

  // Search for FFL dealers by business name
  const searchFflDealersByName = async () => {
    if (!fflSearchBusinessName.trim()) {
      setFflError('Please enter a business name')
      return
    }

    setFflNameLoading(true)
    setFflError(null)
    setFflDealers([])
    setSelectedFflDealer(null)

    try {
      const pageSize = 10
      const page = 1

      console.log('🔍 Searching FFL dealers by business name:', fflSearchBusinessName.trim())

      // Use our local proxy server to avoid CORS issues
      const proxyUrl = `http://localhost:3001/api/ffl-dealers?businessName=${encodeURIComponent(fflSearchBusinessName.trim())}&per_page=${pageSize}&page=${page}`
      console.log('Fetching from local proxy:', proxyUrl)

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Proxy API error:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Proxy API error response:', errorText)
        throw new Error(`Proxy API request failed: ${response.status}`)
      }

      const bfgData = await response.json()
      console.log(`Received ${bfgData.data.length} FFL dealers from BFG API via proxy`)

      // Transform BFG data to our format
      const transformedDealers = bfgData.data.map((dealer: any) => ({
        id: dealer.id,
        name: dealer.business_name || dealer.license_name,
        address: dealer.premise_address,
        city: dealer.premise_city,
        state: dealer.premise_state,
        zip: dealer.premise_zipcode,
        phone: dealer.phone || 'N/A',
        distance: 'N/A', // BFG doesn't provide distance in this API
        fflNumber: dealer.ffl_number,
        hours: formatHours(dealer.hours)
      }))

      setFflDealers(transformedDealers)
      console.log('✅ FFL dealers loaded:', transformedDealers.length)
      console.log('🔍 Transformed dealers:', transformedDealers)
    } catch (error) {
      console.error('❌ Error searching FFL dealers:', error)
      console.log('🔄 Falling back to mock data...')
      
      // Fallback to mock data when API fails
      const mockFflDealers = [
        {
          id: '1',
          name: 'ABC Firearms & Ammo',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '90210',
          phone: '(555) 123-4567',
          distance: '2.3 miles',
          fflNumber: '1-23-456-78-9A',
          hours: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM'
        },
        {
          id: '2',
          name: 'Defense Depot',
          address: '456 Oak Ave',
          city: 'Somewhere',
          state: 'CA',
          zip: '90211',
          phone: '(555) 987-6543',
          distance: '4.1 miles',
          fflNumber: '2-34-567-89-B',
          hours: 'Mon-Sat 8AM-8PM'
        },
        {
          id: '3',
          name: 'Gun Shop Plus',
          address: '789 Pine Rd',
          city: 'Elsewhere',
          state: 'CA',
          zip: '90212',
          phone: '(555) 456-7890',
          distance: '6.7 miles',
          fflNumber: '3-45-678-90-C',
          hours: 'Tue-Sat 10AM-6PM'
        }
      ]

      setFflDealers(mockFflDealers)
      setFflError('API temporarily unavailable. Showing sample FFL dealers.')
      console.log('✅ Mock FFL dealers loaded:', mockFflDealers.length)
    } finally {
      setFflNameLoading(false)
    }
  }

  // Handle license file upload
  const handleLicenseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedLicense(file)
      setSelectedFflDealer({
        id: 'uploaded',
        name: 'Custom FFL Dealer',
        address: 'License uploaded',
        city: '',
        state: '',
        zip: '',
        phone: '',
        distance: '',
        fflNumber: 'Pending verification',
        hours: '',
        isUploaded: true,
        fileName: file.name
      })
      console.log('📄 License file uploaded:', file.name)
    }
  }

  // Determine available shipping options based on cart items
  const getAvailableShippingOptions = () => {
    if (!cartData?.items) return []
    
    const options = []
    
    // Check if any item requires FFL shipping
    const hasFFLRequired = cartData.items.some(item => item.shippingOptions?.ship_to_ffl)
    
    if (hasFFLRequired) {
      // If any item requires FFL, only show FFL and Pickup options
      options.push({
        id: 'ffl',
        name: 'Ship to FFL Dealer',
        description: 'Firearms must be shipped to a licensed FFL dealer',
        price: cartData.summary.shipping,
        required: true
      })
      
      // Always show pickup option for FFL items
      options.push({
        id: 'pickup',
        name: 'Store Pickup',
        description: 'Pick up your order at our store',
        price: 0,
        required: false
      })
    } else {
      // If no FFL required, show Home Delivery and Pickup options
      options.push({
        id: 'home',
        name: 'Deliver to Home Address',
        description: 'Standard shipping to your address',
        price: cartData.summary.shipping,
        required: false
      })
      
      options.push({
        id: 'pickup',
        name: 'Pickup in Store',
        description: 'Pick up your order at our store',
        price: 0,
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
            <div className="mb-4">
              <h3 className="text-lg font-medium">Shipping Method</h3>
            </div>
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

          {/* FFL Dealer Selection - Only show if FFL shipping is selected */}
          {selectedShippingMethod === 'ffl' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">FFL Dealer Selection</h4>
              <p className="text-sm text-blue-700 mb-4">
                Search for a licensed FFL dealer near you to receive your firearm.
              </p>
              
              {/* FFL Search Form */}
              <div className="space-y-4 mb-4">
                {/* Search by ZIP Code */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={fflSearchZip}
                    onChange={(e) => setFflSearchZip(e.target.value)}
                    placeholder="ZIP Code (e.g., 28722)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={5}
                  />
                  <button
                    type="button"
                    onClick={searchFflDealersByZip}
                    disabled={fflZipLoading || !fflSearchZip.trim()}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-40"
                  >
                    {fflZipLoading ? 'Searching...' : 'Search by ZIP'}
                  </button>
                </div>

                {/* Divider */}
                <div className="text-center">
                  <span className="text-gray-500 text-sm">or</span>
                </div>

                {/* Search by Business Name */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={fflSearchBusinessName}
                    onChange={(e) => setFflSearchBusinessName(e.target.value)}
                    placeholder="Search by business name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={searchFflDealersByName}
                    disabled={fflNameLoading || !fflSearchBusinessName.trim()}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-40"
                  >
                    {fflNameLoading ? 'Searching...' : 'Search by Name'}
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Search by ZIP code to find FFL dealers near you</div>
                  <div>• Or search by business name if you know the dealer</div>
                </div>
              </div>

              {/* Upload License Option */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowUploadLicense(!showUploadLicense)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Can't find your FFL dealer? Upload their license
                </button>
                
                {showUploadLicense && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload FFL License
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleLicenseUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, JPG, JPEG, PNG
                    </p>
                  </div>
                )}
              </div>

              {/* Error/Warning Message */}
              {fflError && (
                <div className={`px-3 py-2 rounded mb-4 ${
                  fflError.includes('API temporarily unavailable') 
                    ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
                    : 'bg-red-100 border border-red-200 text-red-700'
                }`}>
                  {fflError}
                </div>
              )}



              {/* FFL Dealers List - Hide when upload option is shown */}
              {fflDealers.length > 0 && !showUploadLicense && (
                <div className="space-y-3">
                  <h5 className="font-medium text-blue-800">Available FFL Dealers:</h5>
                  {fflDealers.map((dealer) => (
                    <div
                      key={dealer.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedFflDealer?.id === dealer.id
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFflDealer(dealer)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="fflDealer"
                              value={dealer.id}
                              checked={selectedFflDealer?.id === dealer.id}
                              onChange={() => setSelectedFflDealer(dealer)}
                              className="mr-3"
                            />
                            <div>
                              <h6 className="font-medium text-gray-900">{dealer.name}</h6>
                              <p className="text-sm text-gray-600">
                                {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}
                              </p>
                              <p className="text-sm text-gray-500">
                                📞 {dealer.phone}
                                {dealer.distance !== 'N/A' && ` • 📍 ${dealer.distance}`}
                              </p>
                              {dealer.hours && (
                                <p className="text-xs text-gray-500">
                                  🕒 {dealer.hours}
                                </p>
                              )}
                              <p className="text-xs text-blue-600 font-medium">
                                FFL: {dealer.fflNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

                                {/* Selected FFL Dealer Summary */}
                  {selectedFflDealer && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <h6 className="font-medium text-green-800 mb-1">Selected FFL Dealer:</h6>
                      {selectedFflDealer.isUploaded ? (
                        <div>
                          <p className="text-sm text-green-700">
                            Custom FFL Dealer - License uploaded
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            File: {selectedFflDealer.fileName} • Status: Pending verification
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-green-700">
                          {selectedFflDealer.name} - {selectedFflDealer.address}, {selectedFflDealer.city}, {selectedFflDealer.state} {selectedFflDealer.zip}
                        </p>
                      )}
                    </div>
                  )}
            </div>
          )}

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
                  disabled={!selectedShippingMethod || (selectedShippingMethod === 'ffl' && !selectedFflDealer)}
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
            {cartData.summary.discount !== undefined && cartData.summary.discount !== null && cartData.summary.discount > 0 && (
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