import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartItem, OrderSummary } from '../types'
import ProductImage from '../components/common/ProductImage'

// Google Maps types
interface AutocompletePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface AutocompleteService {
  getPlacePredictions(
    request: { input: string; componentRestrictions?: { country: string } },
    callback: (predictions: AutocompletePrediction[], status: string) => void
  ): void
}

interface PlacesService {
  getDetails(
    request: { placeId: string; fields: string[] },
    callback: (place: any, status: string) => void
  ): void
}

interface ShippingPaymentPageProps {
  globalCartData?: any;
}

const ShippingPaymentPage = ({ globalCartData }: ShippingPaymentPageProps) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'shipping' | 'payment'>('shipping')
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    summary: OrderSummary;
    rawData: any;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [shippingMethod, setShippingMethod] = useState('')
  const [addressAutocomplete, setAddressAutocomplete] = useState('')
  const [showManualAddress, setShowManualAddress] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [autocompleteService, setAutocompleteService] = useState<AutocompleteService | null>(null)
  const [placesService, setPlacesService] = useState<PlacesService | null>(null)
  const [billingAddressSuggestions, setBillingAddressSuggestions] = useState<AutocompletePrediction[]>([])
  const [showBillingSuggestions, setShowBillingSuggestions] = useState(false)
  const [availableShippingMethods, setAvailableShippingMethods] = useState<string[]>([])
  const [selectedStoreLocation, setSelectedStoreLocation] = useState('')
  const [showStoreLocations, setShowStoreLocations] = useState(false)
  const [showStoreModal, setShowStoreModal] = useState(false)
  const [storeSearchTerm, setStoreSearchTerm] = useState('')
  const [showFflModal, setShowFflModal] = useState(false)
  const [fflSearchTerm, setFflSearchTerm] = useState('')
  const [fflZipSearch, setFflZipSearch] = useState('')
  const [fflNameSearch, setFflNameSearch] = useState('')
  const [selectedFflDealer, setSelectedFflDealer] = useState('')
  const [showFflOptions, setShowFflOptions] = useState(false)
  const [fflUploadOption, setFflUploadOption] = useState('')
  const [fflDealers, setFflDealers] = useState([])
  const [fflLoading, setFflLoading] = useState(false)
  const [fflError, setFflError] = useState('')
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: '',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    loyaltyPoints: 0,
    giftCardNumber: '',
    giftCardPin: '',
    credovaToken: '',
    sezzleToken: '',
    paypalToken: '',
    invoiceNumber: ''
  })
  
  // Split payment state
  const [splitPayments, setSplitPayments] = useState<Array<{
    id: string;
    method: string;
    amount: number;
    cardNumber?: string;
    cardholderName?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    loyaltyPoints?: number;
    giftCardNumber?: string;
    giftCardPin?: string;
    credovaToken?: string;
    sezzleToken?: string;
    invoiceNumber?: string;
  }>>([])
  const [showSplitPayment, setShowSplitPayment] = useState(false)
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [showAllPaymentMethods, setShowAllPaymentMethods] = useState(false)
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  useEffect(() => {
    // Load cart data from localStorage or props
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

  // Separate effect for setting available shipping methods when cartData changes
  useEffect(() => {
    if (cartData) {
      const methods = getAvailableShippingMethods()
      setAvailableShippingMethods(methods)
      console.log('🚚 Available shipping methods:', methods)
    }
  }, [cartData])

  // Initialize Google Places services
  useEffect(() => {
    const google = (window as any).google
    if (google && google.maps && google.maps.places) {
      const autocomplete = new google.maps.places.AutocompleteService()
      const places = new google.maps.places.PlacesService(document.createElement('div'))
      
      setAutocompleteService(autocomplete)
      setPlacesService(places)
      console.log('🗺️ Google Places services initialized')
    } else {
      console.log('⚠️ Google Places API not loaded yet')
    }
  }, [])

  // Auto-populate shipping form with user data from checkout page
  useEffect(() => {
    // Check for different types of user data from checkout page
    let userInfo = null
    
    // Check for logged in user info (from login or new account)
    const userData = localStorage.getItem('userInfo')
    if (userData) {
      try {
        userInfo = JSON.parse(userData)
        console.log('👤 Found logged in user data:', userInfo)
      } catch (error) {
        console.error('❌ Error parsing userInfo:', error)
      }
    }
    
    // If no logged in user, check for guest checkout info
    if (!userInfo) {
      const guestData = localStorage.getItem('guestInfo')
      if (guestData) {
        try {
          userInfo = JSON.parse(guestData)
          console.log('👤 Found guest checkout data:', userInfo)
        } catch (error) {
          console.error('❌ Error parsing guestInfo:', error)
        }
      }
    }
    
    // Auto-populate shipping form if user data is found
    if (userInfo && (userInfo.firstName || userInfo.lastName)) {
      setShippingForm(prev => ({
        ...prev,
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || ''
      }))
      console.log('✅ Auto-populated shipping form with:', userInfo)
    } else {
      console.log('ℹ️ No user data found for auto-population')
    }
  }, [])

  const handleShippingInputChange = (field: string, value: string) => {
    setShippingForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentInputChange = (field: string, value: string | number) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBillingAddressChange = (field: string, value: string | boolean) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressAutocomplete = (value: string) => {
    setAddressAutocomplete(value)
    
    if (value.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'us' }
        },
        (predictions, status) => {
          if (status === 'OK' && predictions) {
            setAddressSuggestions(predictions)
            setShowSuggestions(true)
            console.log('📍 Address suggestions:', predictions)
          } else {
            setAddressSuggestions([])
            setShowSuggestions(false)
            console.log('❌ No address suggestions found:', status)
          }
        }
      )
    } else {
      console.log('⚠️ Autocomplete service not available')
    }
  }

  const handleAddressSelection = (prediction: AutocompletePrediction) => {
    setAddressAutocomplete(prediction.description)
    setShowSuggestions(false)
    setAddressSuggestions([])

    if (placesService) {
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['address_components', 'formatted_address']
        },
        (place, status) => {
          if (status === 'OK' && place) {
            // Parse address components and fill form
            const addressComponents = place.address_components || []
            let streetNumber = ''
            let route = ''
            let city = ''
            let state = ''
            let zipCode = ''

            addressComponents.forEach((component: any) => {
              const types = component.types
              if (types.includes('street_number')) {
                streetNumber = component.long_name
              } else if (types.includes('route')) {
                route = component.long_name
              } else if (types.includes('locality')) {
                city = component.long_name
              } else if (types.includes('administrative_area_level_1')) {
                state = component.short_name
              } else if (types.includes('postal_code')) {
                zipCode = component.long_name
              }
            })

            setShippingForm(prev => ({
              ...prev,
              address: streetNumber && route ? `${streetNumber} ${route}` : prediction.description,
              city: city,
              state: state,
              zipCode: zipCode
            }))

            console.log('✅ Address auto-filled:', { streetNumber, route, city, state, zipCode })
          }
        }
      )
    }
  }

  const handleBillingAddressAutocomplete = (value: string) => {
    setBillingAddress(prev => ({ ...prev, address: value }))
    
    if (value.length > 2 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'us' }
        },
        (predictions, status) => {
          if (status === 'OK' && predictions) {
            setBillingAddressSuggestions(predictions)
            setShowBillingSuggestions(true)
          } else {
            setBillingAddressSuggestions([])
            setShowBillingSuggestions(false)
          }
        }
      )
    } else {
      setBillingAddressSuggestions([])
      setShowBillingSuggestions(false)
    }
  }

  const handleBillingAddressSelection = (prediction: AutocompletePrediction) => {
    setBillingAddress(prev => ({ ...prev, address: prediction.description }))
    setShowBillingSuggestions(false)
    setBillingAddressSuggestions([])

    if (placesService) {
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['address_components', 'formatted_address']
        },
        (place, status) => {
          if (status === 'OK' && place) {
            // Parse address components and fill form
            const addressComponents = place.address_components || []
            let streetNumber = ''
            let route = ''
            let city = ''
            let state = ''
            let zipCode = ''

            addressComponents.forEach((component: any) => {
              const types = component.types
              if (types.includes('street_number')) {
                streetNumber = component.long_name
              } else if (types.includes('route')) {
                route = component.long_name
              } else if (types.includes('locality')) {
                city = component.long_name
              } else if (types.includes('administrative_area_level_1')) {
                state = component.short_name
              } else if (types.includes('postal_code')) {
                zipCode = component.long_name
              }
            })

            setBillingAddress(prev => ({
              ...prev,
              address: streetNumber && route ? `${streetNumber} ${route}` : prediction.description,
              city: city,
              state: state,
              zipCode: zipCode
            }))

            console.log('✅ Billing address auto-filled:', { streetNumber, route, city, state, zipCode })
          }
        }
      )
    }
  }

  // Payment methods configuration
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express, Discover',
      icon: 'http://localhost:5173/assets/images/credit_card.png',
      requiresFields: ['cardNumber', 'cardholderName', 'expiryMonth', 'expiryYear', 'cvv'],
      supportsSplit: true
    },
    {
      id: 'gift_card',
      name: 'Gift Card',
      description: 'Apply gift card balance',
      icon: 'http://localhost:5173/assets/images/gift_card.png',
      requiresFields: ['giftCardNumber', 'giftCardPin'],
      supportsSplit: true
    },
    {
      id: 'sezzle',
      name: 'Sezzle',
      description: 'Pay in 4 interest-free installments',
      icon: 'https://images.ctfassets.net/6d085vujy22q/273Nz43iRAEjHGwsaCmQDu/dda99ab0df0f1914fa7fcaaba21035fc/image_201.png?w=1000&h=356&q=50&fm=webp',
      requiresFields: ['sezzleToken'],
      supportsSplit: false
    },
    {
      id: 'credova',
      name: 'Credova',
      description: 'Shop Now, Pay Over Time',
      icon: 'https://cdn.prod.website-files.com/68409dd5e6545795f95d69c6/685c61c8230042645ce3de7c_BlueLogo.webp',
      requiresFields: ['credovaToken'],
      supportsSplit: false
    },
    {
      id: 'loyalty_points',
      name: 'Loyalty Points',
      description: 'Use your accumulated loyalty points',
      icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827933.png',
      requiresFields: ['loyaltyPoints'],
      supportsSplit: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: 'https://www.paypalobjects.com/webstatic/mktg/logo-center/PP_Acceptance_Marks_for_LogoCenter_266x142.png',
      requiresFields: ['paypalToken'],
      supportsSplit: false
    },
    {
      id: 'invoice',
      name: 'Invoice',
      description: 'Pay by invoice (business accounts only)',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      requiresFields: ['invoiceNumber'],
      supportsSplit: false
    }
  ]

  // Calculate remaining amount for split payments
  useEffect(() => {
    if (cartData) {
      if (splitPayments.length > 0) {
        const totalPaid = splitPayments.reduce((sum, payment) => sum + payment.amount, 0)
        const remaining = cartData.summary.total - totalPaid
        setRemainingAmount(remaining)
      } else {
        setRemainingAmount(cartData.summary.total)
      }
    }
  }, [cartData, splitPayments])

  // Add new split payment
  const addSplitPayment = (selectedMethod?: string) => {
    const newPayment = {
      id: `payment_${Date.now()}`,
      method: selectedMethod || 'credit_card',
      amount: remainingAmount
    }
    setSplitPayments(prev => [...prev, newPayment])
  }

  // Remove split payment
  const removeSplitPayment = (id: string) => {
    setSplitPayments(prev => prev.filter(payment => payment.id !== id))
  }

  // Update split payment
  const updateSplitPayment = (id: string, field: string, value: any) => {
    setSplitPayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ))
  }

  // Get payment method by ID
  const getPaymentMethod = (id: string) => {
    if (!id) return null
    return paymentMethods.find(method => method.id === id) || null
  }

  // Check if payment method is already used in split payments
  const isPaymentMethodUsed = (methodId: string) => {
    if (methodId === 'credit_card') return false // Credit cards can be used multiple times
    return splitPayments.some(payment => payment.method === methodId)
  }

  // Get available payment methods for split payments
  const getAvailableSplitPaymentMethods = () => {
    return paymentMethods.filter(method => 
      method.supportsSplit && 
      (method.id === 'credit_card' || !isPaymentMethodUsed(method.id))
    )
  }

  const getAvailableShippingMethods = () => {
    if (!cartData || !cartData.items) return []

    // Check if cart contains FFL required products
    const hasFflRequiredProducts = cartData.items.some((item: CartItem) => {
      // Check if item has FFL required tags or classes
      return item.otherClasses?.includes('product-tag-ffl_required') || 
             item.productTagIds?.includes('13') || // Assuming 13 is FFL tag ID
             item.shippingOptions?.ship_to_ffl === true
    })

    const methods: string[] = []
    
    if (hasFflRequiredProducts) {
      // If cart contains FFL required products, only show:
      // - Pickup in store
      // - Ship to FFL
      
      cartData.items.forEach((item: CartItem) => {
        if (item.shippingOptions) {
          if (item.shippingOptions.pickup === true || item.shippingOptions.ship_to_store === true) {
            methods.push('pickup')
          }
          if (item.shippingOptions.ship_to_ffl === true) {
            methods.push('ship_to_ffl')
          }
        }
      })
    } else {
      // If cart does NOT contain FFL required products, show:
      // - Pickup in store
      // - Ship to Home Address
      
      cartData.items.forEach((item: CartItem) => {
        if (item.shippingOptions) {
          if (item.shippingOptions.pickup === true || item.shippingOptions.ship_to_store === true) {
            methods.push('pickup')
          }
          if (item.shippingOptions.ship_to_home === true) {
            methods.push('ship_to_home')
          }
        }
      })
    }

    // Remove duplicates
    return [...new Set(methods)]
  }

  const getShippingMethodLabel = (method: string) => {
    switch (method) {
      case 'ship_to_home':
        return 'Ship to Home'
      case 'ship_to_ffl':
        return 'Ship to FFL Dealer'
      case 'pickup':
        return 'Pickup in Store'
      case 'ship_to_store':
        return 'Pickup in Store'
      default:
        return method
    }
  }

  const getShippingMethodDescription = (method: string) => {
    switch (method) {
      case 'ship_to_home':
        return 'Standard home delivery (3-5 business days)'
      case 'ship_to_ffl':
        return 'Ship to licensed FFL dealer (requires FFL transfer)'
      case 'pickup':
        return 'Pick up at nearest store location'
      case 'ship_to_store':
        return 'Pick up at nearest store location'
      default:
        return ''
    }
  }

  // Mock store locations data
  const storeLocations = [
    {
      id: '1',
      name: 'Downtown Store',
      address: '123 Main Street, Downtown, NY 10001',
      phone: '(555) 123-4567',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      distance: '0.5 miles'
    },
    {
      id: '2',
      name: 'Westside Store',
      address: '456 West Avenue, Westside, NY 10002',
      phone: '(555) 234-5678',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      distance: '2.1 miles'
    },
    {
      id: '3',
      name: 'Eastside Store',
      address: '789 East Boulevard, Eastside, NY 10003',
      phone: '(555) 345-6789',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      distance: '3.7 miles'
    },
    {
      id: '4',
      name: 'Suburban Store',
      address: '321 Suburban Drive, Suburbia, NY 10004',
      phone: '(555) 456-7890',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      distance: '8.2 miles'
    }
  ]

  // Mock FFL dealer data for fallback
  const mockFflDealers = [
    {
      id: 'ffl1',
      name: 'Downtown Gun Shop',
      fflNumber: '1-23-45678',
      address: '123 Main Street, Downtown, NY 10001',
      phone: '(555) 123-4567',
      hours: 'Mon-Sat: 9AM-6PM, Sun: Closed',
      distance: '0.5 miles',
      transferFee: '$25'
    },
    {
      id: 'ffl2',
      name: 'Westside Firearms',
      fflNumber: '1-23-45679',
      address: '456 West Avenue, Westside, NY 10002',
      phone: '(555) 234-5678',
      hours: 'Mon-Sat: 10AM-7PM, Sun: 12PM-5PM',
      distance: '2.1 miles',
      transferFee: '$30'
    },
    {
      id: 'ffl3',
      name: 'Eastside Arms',
      fflNumber: '1-23-45680',
      address: '789 East Boulevard, Eastside, NY 10003',
      phone: '(555) 345-6789',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      distance: '3.7 miles',
      transferFee: '$20'
    },
    {
      id: 'ffl4',
      name: 'Suburban Gun Store',
      fflNumber: '1-23-45681',
      address: '321 Suburban Drive, Suburbia, NY 10004',
      phone: '(555) 456-7890',
      hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      distance: '8.2 miles',
      transferFee: '$35'
    },
    {
      id: 'ffl5',
      name: 'Central Firearms',
      fflNumber: '1-23-45682',
      address: '555 Central Park, Central, NY 10005',
      phone: '(555) 567-8901',
      hours: 'Mon-Sat: 9AM-6PM, Sun: Closed',
      distance: '1.2 miles',
      transferFee: '$28'
    }
  ]

  // Search FFL dealers using API with fallback to mock data
  const searchFflDealers = async () => {
    setFflLoading(true)
    setFflError('')
    
    try {
      console.log('🔍 Starting FFL search with:')
      console.log('   fflZipSearch:', fflZipSearch)
      console.log('   fflNameSearch:', fflNameSearch)
      
      const params = new URLSearchParams()
      if (fflZipSearch) {
        params.append('filter[premise_zipcode]', fflZipSearch)
        console.log('   ✅ Added zipcode filter:', fflZipSearch)
      }
      if (fflNameSearch) {
        params.append('filter[business_name]', fflNameSearch)
        console.log('   ✅ Added business name filter:', fflNameSearch)
      }
      
      const requestUrl = `http://localhost:3001/api/ffl-dealers?${params.toString()}`
      console.log('   🌐 Making request to:', requestUrl)
      
      const response = await fetch(requestUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
              if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          // Transform BFG API data to match our expected format
          const transformedDealers = data.data.map((dealer: any) => {
            // Use business_name if available, otherwise fall back to license_name
            const businessName = dealer.business_name || dealer.license_name || 'Unknown Business'
            
            // Format phone number if available
            const phoneNumber = dealer.phone ? 
              dealer.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : 
              'N/A'
            
            // Format hours if available
            let hoursText = 'Contact dealer for hours'
            if (dealer.hours && Array.isArray(dealer.hours)) {
              const hoursMap = {
                0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
              }
              const formattedHours = dealer.hours
                .filter((h: any) => h.open_time && h.close_time)
                .map((h: any) => `${hoursMap[h.day_of_week]}: ${h.open_time}-${h.close_time}`)
                .join(', ')
              if (formattedHours) {
                hoursText = formattedHours
              }
            }
            
            return {
              id: dealer.id?.toString() || `ffl-${Math.random().toString(36).substr(2, 9)}`,
              name: businessName,
              fflNumber: dealer.ffl_number || dealer.short_ffl_number || 'N/A',
              address: dealer.full_address || [
                dealer.premise_address,
                dealer.premise_city,
                dealer.premise_state,
                dealer.premise_zipcode
              ].filter(Boolean).join(', ') || 'Address not available',
              phone: phoneNumber,
              hours: hoursText,
              distance: 'N/A',
              transferFee: dealer.transfer_fee ? `$${dealer.transfer_fee}` : 'Contact dealer for fee'
            }
          })
          
          console.log('🔍 Raw API data:', data.data)
          console.log('🔍 Transformed dealers:', transformedDealers)
        
        setFflDealers(transformedDealers)
        console.log('🔍 FFL dealers loaded from API:', transformedDealers)
      } else {
        // No results from API, use mock data as fallback
        console.log('📭 No FFL dealers found in API, using mock data')
        setFflDealers(mockFflDealers)
        setFflError('Using sample data - API returned no results')
      }
    } catch (error) {
      console.error('❌ Error fetching FFL dealers:', error)
      // Use mock data as fallback when API fails
      console.log('🔄 API failed, using mock data as fallback')
      setFflDealers(mockFflDealers)
      setFflError('Using sample data - API temporarily unavailable')
    } finally {
      setFflLoading(false)
    }
  }

  const handleShippingMethodChange = (method: string) => {
    setShippingMethod(method)
    
    // Show store locations if pickup is selected
    if (method === 'pickup') {
      setShowStoreLocations(true)
      setSelectedStoreLocation('')
      setShowFflOptions(false)
      setSelectedFflDealer('')
    } else if (method === 'ship_to_ffl') {
      setShowFflOptions(true)
      setSelectedFflDealer('')
      setShowStoreLocations(false)
      setSelectedStoreLocation('')
    } else {
      setShowStoreLocations(false)
      setSelectedStoreLocation('')
      setShowFflOptions(false)
      setSelectedFflDealer('')
    }
  }

  // Get top 3 closest stores
  const getTop3Stores = () => {
    return storeLocations.slice(0, 3)
  }

  // Filter stores by search term
  const getFilteredStores = () => {
    if (!storeSearchTerm) return storeLocations
    
    return storeLocations.filter(store => 
      store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(storeSearchTerm.toLowerCase())
    )
  }

  // Get filtered FFL dealers (now using API data)
  const getFilteredFflDealers = () => {
    return fflDealers
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate shipping method selection
    if (!shippingMethod) {
      alert('Please select a shipping method')
      return
    }
    
    // Validate store location selection if pickup is chosen
    if (shippingMethod === 'pickup' && !selectedStoreLocation) {
      alert('Please select a store location for pickup')
      return
    }
    
    // Validate FFL dealer selection if ship to FFL is chosen
    if (shippingMethod === 'ship_to_ffl' && !selectedFflDealer && fflUploadOption !== 'upload' && fflUploadOption !== 'followup') {
      alert('Please select an FFL dealer or choose an alternative option')
      return
    }
    
    // Store shipping info in localStorage
    const selectedStore = storeLocations.find(store => store.id === selectedStoreLocation)
    localStorage.setItem('shippingInfo', JSON.stringify({
      ...shippingForm,
      shippingMethod,
      selectedStoreLocation: shippingMethod === 'pickup' ? selectedStore?.name || selectedStoreLocation : null,
      selectedFflDealer: shippingMethod === 'ship_to_ffl' ? selectedFflDealer : null,
      fflUploadOption: shippingMethod === 'ship_to_ffl' ? fflUploadOption : null
    }))
    
    setActiveTab('payment')
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Store payment details in localStorage
    const paymentDetails = {
      paymentMethod: paymentForm.paymentMethod,
      ...paymentForm,
      splitPayments: showSplitPayment ? splitPayments : [],
      billingAddress: billingAddress.sameAsShipping ? null : billingAddress
    }
    
    localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails))
    
    // Proceed to review page
    navigate('/review')
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
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                activeTab === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${
                activeTab === 'payment' ? 'text-blue-600' : 'text-gray-600'
              }`}>Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Shipping/Payment Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'shipping'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Shipping Address
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'payment'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Payment Method
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'shipping' ? (
                  /* Shipping Form */
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={shippingForm.firstName}
                          onChange={(e) => handleShippingInputChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={shippingForm.lastName}
                          onChange={(e) => handleShippingInputChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>



                    <div className="relative">
                      <label htmlFor="addressAutocomplete" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Your Address *
                      </label>
                      <input
                        type="text"
                        id="addressAutocomplete"
                        value={addressAutocomplete}
                        onChange={(e) => handleAddressAutocomplete(e.target.value)}
                        onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Start typing your address..."
                        required
                      />
                      
                      {/* Address Suggestions Dropdown */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {addressSuggestions.map((prediction, index) => (
                            <button
                              key={prediction.place_id}
                              type="button"
                              onClick={() => handleAddressSelection(prediction)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {prediction.structured_formatting.main_text}
                              </div>
                              <div className="text-sm text-gray-500">
                                {prediction.structured_formatting.secondary_text}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => setShowManualAddress(!showManualAddress)}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Enter Address Manually
                      </button>
                    </div>

                    {showManualAddress && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            value={shippingForm.address}
                            onChange={(e) => handleShippingInputChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Street address"
                          />
                        </div>

                        <div>
                          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                            Apartment, suite, etc. (optional)
                          </label>
                          <input
                            type="text"
                            id="address2"
                            value={shippingForm.address2}
                            onChange={(e) => handleShippingInputChange('address2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Apartment, suite, etc."
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              value={shippingForm.city}
                              onChange={(e) => handleShippingInputChange('city', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="City"
                            />
                          </div>

                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              id="state"
                              value={shippingForm.state}
                              onChange={(e) => handleShippingInputChange('state', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="State"
                            />
                          </div>

                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              id="zipCode"
                              value={shippingForm.zipCode}
                              onChange={(e) => handleShippingInputChange('zipCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="ZIP code"
                            />
                          </div>
                        </div>
                      </div>
                    )}



                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Method
                      </label>
                      {availableShippingMethods.length > 0 ? (
                        <div className="space-y-3">
                          {availableShippingMethods.map((method) => (
                            <div key={method} className="flex items-start space-x-3">
                              <input
                                type="radio"
                                id={method}
                                name="shippingMethod"
                                value={method}
                                checked={shippingMethod === method}
                                onChange={(e) => handleShippingMethodChange(e.target.value)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="flex-1">
                                <label htmlFor={method} className="block text-sm font-medium text-gray-900 cursor-pointer">
                                  {getShippingMethodLabel(method)}
                                </label>
                                <p className="text-sm text-gray-500">
                                  {getShippingMethodDescription(method)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                          Enter your shipping address to view available shipping methods
                        </div>
                      )}
                    </div>

                    {/* Store Location Selection */}
                    {showStoreLocations && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Store Location *
                        </label>
                        
                        {/* Top 3 Closest Stores */}
                        <div className="space-y-3 mb-4">
                          {getTop3Stores().map((store) => (
                            <div key={store.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                              <input
                                type="radio"
                                id={`store-${store.id}`}
                                name="storeLocation"
                                value={store.id}
                                checked={selectedStoreLocation === store.id}
                                onChange={(e) => setSelectedStoreLocation(e.target.value)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="flex-1">
                                <label htmlFor={`store-${store.id}`} className="block cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900">{store.name}</h4>
                                    <span className="text-xs text-gray-500">{store.distance}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                                  <p className="text-xs text-gray-500 mt-1">{store.phone}</p>
                                  <p className="text-xs text-gray-500">{store.hours}</p>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* View All Locations Button */}
                        <button
                          type="button"
                          onClick={() => setShowStoreModal(true)}
                          className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          View All Locations ({storeLocations.length} total)
                        </button>
                      </div>
                    )}

                    {/* FFL Dealer Selection */}
                    {showFflOptions && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select FFL Dealer *
                        </label>
                        
                        {/* FFL Dealer Options */}
                        <div className="space-y-4">
                          {/* Option 1: Search and Select FFL */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <input
                                type="radio"
                                id="ffl-search"
                                name="fflOption"
                                value="search"
                                checked={fflUploadOption === 'search' || !!selectedFflDealer}
                                onChange={(e) => {
                                  setFflUploadOption('search')
                                  setSelectedFflDealer('')
                                }}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="flex-1">
                                <label htmlFor="ffl-search" className="block cursor-pointer">
                                  <h4 className="text-sm font-medium text-gray-900">Search and Select FFL Dealer</h4>
                                  <p className="text-sm text-gray-600 mt-1">Find an FFL dealer from our database</p>
                                </label>
                                {(fflUploadOption === 'search' || selectedFflDealer) && (
                                  <div className="mt-3">
                                    <button
                                      type="button"
                                      onClick={() => setShowFflModal(true)}
                                      className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      Search FFL Dealers
                                    </button>
                                    
                                    {/* Selected FFL Dealer Display */}
                                    {selectedFflDealer && (
                                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h5 className="text-sm font-medium text-blue-900 mb-1">Selected FFL Dealer:</h5>
                                            {(() => {
                                              const dealer = fflDealers.find(d => d.id === selectedFflDealer)
                                              return dealer ? (
                                                <div>
                                                  <p className="text-sm font-medium text-blue-800">{dealer.name}</p>
                                                  <p className="text-sm text-blue-700">FFL: {dealer.fflNumber}</p>
                                                  <p className="text-sm text-blue-700">{dealer.address}</p>
                                                  <p className="text-sm text-blue-700">Transfer Fee: {dealer.transferFee}</p>
                                                </div>
                                              ) : null
                                            })()}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => setSelectedFflDealer('')}
                                            className="ml-2 text-red-600 hover:text-red-700 text-xs font-medium"
                                          >
                                            Unselect
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Option 2: Upload FFL License */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <input
                                type="radio"
                                id="ffl-upload"
                                name="fflOption"
                                value="upload"
                                checked={fflUploadOption === 'upload'}
                                onChange={(e) => {
                                  setFflUploadOption('upload')
                                  setSelectedFflDealer('')
                                }}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="flex-1">
                                <label htmlFor="ffl-upload" className="block cursor-pointer">
                                  <h4 className="text-sm font-medium text-gray-900">Upload FFL License</h4>
                                  <p className="text-sm text-gray-600 mt-1">I have my FFL dealer's license and will upload it</p>
                                </label>
                                {fflUploadOption === 'upload' && (
                                  <div className="mt-3 space-y-3">
                                    <div>
                                      <label htmlFor="fflName" className="block text-sm font-medium text-gray-700 mb-1">
                                        FFL Dealer Name *
                                      </label>
                                      <input
                                        type="text"
                                        id="fflName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter FFL dealer name"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="fflFile" className="block text-sm font-medium text-gray-700 mb-1">
                                        FFL License File *
                                      </label>
                                      <input
                                        type="file"
                                        id="fflFile"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                      />
                                      <p className="mt-1 text-xs text-gray-500">
                                        Accepted formats: PDF, JPG, JPEG, PNG
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Option 3: Can't Find FFL */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <input
                                type="radio"
                                id="ffl-followup"
                                name="fflOption"
                                value="followup"
                                checked={fflUploadOption === 'followup'}
                                onChange={(e) => {
                                  setFflUploadOption('followup')
                                  setSelectedFflDealer('')
                                }}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div className="flex-1">
                                <label htmlFor="ffl-followup" className="block cursor-pointer">
                                  <h4 className="text-sm font-medium text-gray-900">I Can't Find My FFL Dealer</h4>
                                  <p className="text-sm text-gray-600 mt-1">Please contact me after order confirmation to help find an FFL dealer</p>
                                </label>
                                {fflUploadOption === 'followup' && (
                                  <div className="mt-3">
                                    <div>
                                      <label htmlFor="fflNameManual" className="block text-sm font-medium text-gray-700 mb-1">
                                        FFL Dealer Name (if known)
                                      </label>
                                      <input
                                        type="text"
                                        id="fflNameManual"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter FFL dealer name if you know it"
                                      />
                                      <p className="mt-1 text-xs text-gray-500">
                                        Optional: If you know your FFL dealer's name, please provide it
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-6">
                      <button
                        type="button"
                        onClick={handleBackToCart}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Payment Form */
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Method
                        </label>
                      </div>

                      {/* Split Payment Summary */}
                      {showSplitPayment && splitPayments.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Split Payment Summary</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSplitPayment(false)
                                  setSplitPayments([])
                                  setPaymentForm(prev => ({ ...prev, paymentMethod: '' }))
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Switch to Single Payment
                              </button>
                            </div>
                            <span className="text-sm text-gray-500">
                              Remaining: ${remainingAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {splitPayments.map((payment, index) => (
                              <div key={payment.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  Payment {index + 1}: {getPaymentMethod(payment.method).name}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-900">${payment.amount.toFixed(2)}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeSplitPayment(payment.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {remainingAmount > 0 && getAvailableSplitPaymentMethods().length > 0 && (
                            <button
                              type="button"
                              onClick={() => addSplitPayment()}
                              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              + Add Another Payment Method
                            </button>
                          )}
                          {remainingAmount > 0 && getAvailableSplitPaymentMethods().length === 0 && (
                            <p className="mt-2 text-sm text-gray-500">
                              All available payment methods have been used
                            </p>
                          )}
                        </div>
                      )}

                      {/* Payment Methods Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {paymentMethods.slice(0, showAllPaymentMethods ? paymentMethods.length : 4).map((method) => {
                          const isUsed = showSplitPayment && isPaymentMethodUsed(method.id)
                          const isDisabled = showSplitPayment && isUsed && method.id !== 'credit_card'
                          const isSelected = !showSplitPayment && paymentForm.paymentMethod === method.id
                          
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => {
                                if (showSplitPayment && !isDisabled) {
                                  // Already in split payment mode, add another payment
                                  addSplitPayment(method.id)
                                } else if (!showSplitPayment) {
                                  // Single payment mode - just change the selected payment method
                                  handlePaymentInputChange('paymentMethod', method.id)
                                }
                              }}
                              disabled={isDisabled}
                              className={`p-3 border-2 rounded-lg flex items-center space-x-2 transition-colors relative ${
                                isDisabled
                                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {method.icon.startsWith('http') ? (
                                <div className="flex-1">
                                  <img 
                                    src={method.icon} 
                                    alt={method.name}
                                    className="w-full h-8 object-contain"
                                  />
                                  <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                                </div>
                              ) : (
                                <>
                                  <span className="text-lg">{method.icon}</span>
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{method.name}</div>
                                    <div className="text-xs text-gray-500">{method.description}</div>
                                  </div>
                                </>
                              )}
                              {isUsed && method.id !== 'credit_card' && (
                                <div className="absolute top-2 right-2">
                                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      
                      {/* Show Other Options Button */}
                      {paymentMethods.length > 4 && (
                        <div className="mb-6">
                          <button
                            type="button"
                            onClick={() => setShowAllPaymentMethods(!showAllPaymentMethods)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                          >
                            <span>{showAllPaymentMethods ? 'Show Less Options' : `Show ${paymentMethods.length - 4} More Options`}</span>
                            <svg 
                              className={`w-4 h-4 transition-transform ${showAllPaymentMethods ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Manual Split Payment Toggle */}
                      {!showSplitPayment && paymentForm.paymentMethod && (
                        <div className="mb-6">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSplitPayment(true)
                              const firstPayment = {
                                id: `payment_${Date.now()}`,
                                method: paymentForm.paymentMethod,
                                amount: cartData?.summary.total || 0
                              }
                              setSplitPayments([firstPayment])
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Split Payment
                          </button>
                        </div>
                      )}
                    </div>

                                         {/* Split Payment Forms */}
                     {showSplitPayment && splitPayments.length > 0 && (
                      <div className="space-y-6">
                        {splitPayments.map((payment, index) => (
                          <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-gray-900">
                                Payment {index + 1}: {getPaymentMethod(payment.method).name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={payment.amount}
                                  onChange={(e) => updateSplitPayment(payment.id, 'amount', parseFloat(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                  placeholder="Amount"
                                  min="0"
                                  max={remainingAmount + payment.amount}
                                  step="0.01"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSplitPayment(payment.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            
                            {/* Payment Method Display for Split Payment */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                              </label>
                              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                <div className="flex items-center space-x-2">
                                  {getPaymentMethod(payment.method)?.icon.startsWith('http') ? (
                                    <div className="flex-1">
                                      <img 
                                        src={getPaymentMethod(payment.method).icon} 
                                        alt={getPaymentMethod(payment.method).name}
                                        className="w-full h-6 object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-lg">{getPaymentMethod(payment.method)?.icon}</span>
                                      <div>
                                        <div className="font-medium text-gray-900">{getPaymentMethod(payment.method).name}</div>
                                        <div className="text-sm text-gray-600">{getPaymentMethod(payment.method).description}</div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Form Fields Based on Payment Method */}
                                                         {payment.method === 'credit_card' && (
                               <div className="space-y-3">
                                 <input
                                   type="text"
                                   placeholder="Name on Card"
                                   value={payment.cardholderName || ''}
                                   onChange={(e) => updateSplitPayment(payment.id, 'cardholderName', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 />
                                 <input
                                   type="text"
                                   placeholder="Card Number"
                                   value={payment.cardNumber || ''}
                                   onChange={(e) => updateSplitPayment(payment.id, 'cardNumber', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 />
                                 <div className="grid grid-cols-3 gap-2">
                                   <input
                                     type="text"
                                     placeholder="MM/YY"
                                     value={payment.expiryMonth || ''}
                                     onChange={(e) => updateSplitPayment(payment.id, 'expiryMonth', e.target.value)}
                                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   />
                                   <input
                                     type="text"
                                     placeholder="CVV"
                                     value={payment.cvv || ''}
                                     onChange={(e) => updateSplitPayment(payment.id, 'cvv', e.target.value)}
                                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                   />
                                 </div>
                               </div>
                             )}

                            {payment.method === 'loyalty_points' && (
                              <div className="space-y-3">
                                <input
                                  type="number"
                                  placeholder="Points to use"
                                  value={payment.loyaltyPoints || ''}
                                  onChange={(e) => updateSplitPayment(payment.id, 'loyaltyPoints', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500">
                                  Available: 1,250 points (worth $12.50)
                                </p>
                              </div>
                            )}

                                                         {payment.method === 'gift_card' && (
                               <div className="space-y-3">
                                 <input
                                   type="text"
                                   placeholder="Gift Card Number"
                                   value={payment.giftCardNumber || ''}
                                   onChange={(e) => updateSplitPayment(payment.id, 'giftCardNumber', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 />
                                 <input
                                   type="text"
                                   placeholder="PIN (if required)"
                                   value={payment.giftCardPin || ''}
                                   onChange={(e) => updateSplitPayment(payment.id, 'giftCardPin', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 />
                               </div>
                             )}

                             {payment.method === 'sezzle' && (
                               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                 <div className="flex items-start space-x-3">
                                   <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                     </svg>
                                   </div>
                                   <div>
                                     <h4 className="font-medium text-blue-900">Pay in 4 installments</h4>
                                     <p className="text-sm text-blue-700 mt-1">
                                       Split your purchase into 4 interest-free payments. You'll be redirected to Sezzle to complete your payment.
                                     </p>
                                   </div>
                                 </div>
                               </div>
                             )}

                             {payment.method === 'credova' && (
                               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                 <div className="flex items-start space-x-3">
                                   <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                     <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                     </svg>
                                   </div>
                                   <div>
                                     <h4 className="font-medium text-green-900">Rent-to-Own Financing</h4>
                                     <p className="text-sm text-green-700 mt-1">
                                       Flexible payment options with no credit check required. You'll be redirected to Credova to complete your application.
                                     </p>
                                   </div>
                                 </div>
                               </div>
                             )}

                             {payment.method === 'invoice' && (
                               <div className="space-y-3">
                                 <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                   <div className="flex items-center justify-between">
                                     <div>
                                       <h4 className="font-medium text-gray-900">Invoice Payment</h4>
                                       <p className="text-sm text-gray-700">Business accounts only - Net 30 terms</p>
                                     </div>
                                     <span className="text-lg">📄</span>
                                   </div>
                                 </div>
                                 <input
                                   type="text"
                                   placeholder="Invoice Number"
                                   value={payment.invoiceNumber || ''}
                                   onChange={(e) => updateSplitPayment(payment.id, 'invoiceNumber', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 />
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    )}

                                                              {/* Single Payment Forms */}
                     {!showSplitPayment && paymentForm.paymentMethod && (
                       <>
                         {/* Credit Card Form */}
                         {paymentForm.paymentMethod === 'credit_card' && (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                                Name on Card *
                              </label>
                              <input
                                type="text"
                                id="cardholderName"
                                value={paymentForm.cardholderName}
                                onChange={(e) => handlePaymentInputChange('cardholderName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Name on card"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number *
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                value={paymentForm.cardNumber}
                                onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1234 5678 9012 3456"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                                  Expiration Date *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  <select
                                    id="expiryMonth"
                                    value={paymentForm.expiryMonth}
                                    onChange={(e) => handlePaymentInputChange('expiryMonth', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  >
                                    <option value="">MM</option>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                      <option key={month} value={month.toString().padStart(2, '0')}>
                                        {month.toString().padStart(2, '0')}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    id="expiryYear"
                                    value={paymentForm.expiryYear}
                                    onChange={(e) => handlePaymentInputChange('expiryYear', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                  >
                                    <option value="">YYYY</option>
                                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                  CVV *
                                </label>
                                <input
                                  type="text"
                                  id="cvv"
                                  value={paymentForm.cvv}
                                  onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="123"
                                  maxLength={4}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sezzle Payment Info */}
                        {paymentForm.paymentMethod === 'sezzle' && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-blue-900">Pay in 4 installments</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                  Split your purchase into 4 interest-free payments. You'll be redirected to Sezzle to complete your payment.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Credova Payment Info */}
                        {paymentForm.paymentMethod === 'credova' && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-green-900">Rent-to-Own Financing</h4>
                                <p className="text-sm text-green-700 mt-1">
                                  Flexible payment options with no credit check required. You'll be redirected to Credova to complete your application.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Loyalty Points Form */}
                        {paymentForm.paymentMethod === 'loyalty_points' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-yellow-900">Loyalty Points</h4>
                                  <p className="text-sm text-yellow-700">Available: 1,250 points (worth $12.50)</p>
                                </div>
                                <span className="text-lg">⭐</span>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="loyaltyPoints" className="block text-sm font-medium text-gray-700 mb-1">
                                Points to Use
                              </label>
                              <input
                                type="number"
                                id="loyaltyPoints"
                                value={paymentForm.loyaltyPoints || ''}
                                onChange={(e) => handlePaymentInputChange('loyaltyPoints', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter points to use"
                                max="1250"
                              />
                            </div>
                          </div>
                        )}

                        {/* Gift Card Form */}
                        {paymentForm.paymentMethod === 'gift_card' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-purple-900">Gift Card</h4>
                                  <p className="text-sm text-purple-700">Apply gift card balance to your purchase</p>
                                </div>
                                <span className="text-lg">🎁</span>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="giftCardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Gift Card Number *
                              </label>
                              <input
                                type="text"
                                id="giftCardNumber"
                                value={paymentForm.giftCardNumber || ''}
                                onChange={(e) => handlePaymentInputChange('giftCardNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter gift card number"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="giftCardPin" className="block text-sm font-medium text-gray-700 mb-1">
                                PIN (if required)
                              </label>
                              <input
                                type="text"
                                id="giftCardPin"
                                value={paymentForm.giftCardPin || ''}
                                onChange={(e) => handlePaymentInputChange('giftCardPin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter PIN"
                              />
                            </div>
                          </div>
                        )}

                        {/* Invoice Form */}
                        {paymentForm.paymentMethod === 'invoice' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">Invoice Payment</h4>
                                  <p className="text-sm text-gray-700">Business accounts only - Net 30 terms</p>
                                </div>
                                <span className="text-lg">📄</span>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Invoice Number *
                              </label>
                              <input
                                type="text"
                                id="invoiceNumber"
                                value={paymentForm.invoiceNumber || ''}
                                onChange={(e) => handlePaymentInputChange('invoiceNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter invoice number"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Billing Address */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <input
                          type="checkbox"
                          id="sameAsShipping"
                          checked={billingAddress.sameAsShipping}
                          onChange={(e) => handleBillingAddressChange('sameAsShipping', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sameAsShipping" className="text-sm font-medium text-gray-700">
                          Use shipping address as billing address
                        </label>
                      </div>

                      {/* Billing Address Form */}
                      {!billingAddress.sameAsShipping && (
                        <div className="space-y-4 mt-4">
                          <div className="relative">
                            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                              Billing Address *
                            </label>
                            <input
                              type="text"
                              id="billingAddress"
                              value={billingAddress.address}
                              onChange={(e) => handleBillingAddressAutocomplete(e.target.value)}
                              onFocus={() => setShowBillingSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowBillingSuggestions(false), 200)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Search your billing address"
                              required
                            />
                            
                            {/* Billing Address Suggestions Dropdown */}
                            {showBillingSuggestions && billingAddressSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                {billingAddressSuggestions.map((prediction, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleBillingAddressSelection(prediction)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                  >
                                    <div className="font-medium text-sm">
                                      {prediction.structured_formatting.main_text}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {prediction.structured_formatting.secondary_text}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>



                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                id="billingCity"
                                value={billingAddress.city}
                                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="City"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                              </label>
                              <input
                                type="text"
                                id="billingState"
                                value={billingAddress.state}
                                onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="State"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Zip Code *
                              </label>
                              <input
                                type="text"
                                id="billingZipCode"
                                value={billingAddress.zipCode}
                                onChange={(e) => handleBillingAddressChange('zipCode', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Zip code"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>



                    <div className="flex items-center justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab('shipping')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                      >
                        Review Your Order
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartData.items.map((item) => (
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
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary Details */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartData.items.length} {cartData.items.length === 1 ? 'Item' : 'Items'})</span>
                    <span className="font-medium">${cartData.summary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {cartData.summary.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${cartData.summary.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {cartData.summary.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${cartData.summary.tax.toFixed(2)}</span>
                    </div>
                  )}
                  
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
          </div>
        </div>
      </div>

      {/* Store Locations Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Select Store Location</h3>
              <button
                onClick={() => {
                  setShowStoreModal(false)
                  setStoreSearchTerm('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stores by name or address..."
                  value={storeSearchTerm}
                  onChange={(e) => setStoreSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex h-96">
              {/* Store List */}
              <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {getFilteredStores().map((store) => (
                    <div
                      key={store.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedStoreLocation === store.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedStoreLocation(store.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{store.name}</h4>
                        <span className="text-sm text-gray-500">{store.distance}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{store.address}</p>
                      <p className="text-xs text-gray-500">{store.phone}</p>
                      <p className="text-xs text-gray-500">{store.hours}</p>
                    </div>
                  ))}
                  {getFilteredStores().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No stores found matching your search.
                    </div>
                  )}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm">Interactive Map</p>
                  <p className="text-xs">Store locations would be displayed here</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {selectedStoreLocation ? (
                  `Selected: ${storeLocations.find(s => s.id === selectedStoreLocation)?.name}`
                ) : (
                  'Please select a store location'
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowStoreModal(false)
                    setStoreSearchTerm('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowStoreModal(false)
                    setStoreSearchTerm('')
                  }}
                  disabled={!selectedStoreLocation}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FFL Dealer Selection Modal */}
      {showFflModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Select FFL Dealer</h3>
              <button
                onClick={() => {
                  setShowFflModal(false)
                  setFflZipSearch('')
                  setFflNameSearch('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Fields */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter zip code..."
                    value={fflZipSearch}
                    onChange={(e) => setFflZipSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by FFL Name or Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter FFL name or number..."
                    value={fflNameSearch}
                    onChange={(e) => setFflNameSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setFflZipSearch('')
                    setFflNameSearch('')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear Search
                </button>
                <button
                  type="button"
                  onClick={searchFflDealers}
                  disabled={fflLoading || (!fflZipSearch && !fflNameSearch)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fflLoading ? 'Searching...' : 'Search FFL Dealers'}
                </button>
              </div>
              <div className="mt-2 text-right">
                <span className="text-sm text-gray-500">
                  {getFilteredFflDealers().length} dealers found
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex h-96">
              {/* FFL Dealer List */}
              <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {fflLoading && (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-sm text-gray-500">Searching for FFL dealers...</p>
                    </div>
                  )}
                  
                  {fflError && (
                    <div className="text-center py-4">
                      <div className="text-amber-600 text-sm mb-2">ℹ️ {fflError}</div>
                      <button
                        onClick={searchFflDealers}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Try API Again
                      </button>
                    </div>
                  )}
                  
                  {!fflLoading && !fflError && getFilteredFflDealers().map((dealer) => (
                    <div
                      key={dealer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFflDealer === dealer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedFflDealer(dealer.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{dealer.name}</h4>
                        <span className="text-sm text-gray-500">{dealer.distance}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">FFL: {dealer.fflNumber}</p>
                      <p className="text-sm text-gray-600 mb-1">{dealer.address}</p>
                      <p className="text-xs text-gray-500 mb-1">{dealer.phone}</p>
                      <p className="text-xs text-gray-500 mb-1">{dealer.hours}</p>
                      <p className="text-xs font-medium text-green-600">Transfer Fee: {dealer.transferFee}</p>
                    </div>
                  ))}
                  
                  {!fflLoading && !fflError && getFilteredFflDealers().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {fflZipSearch || fflNameSearch ? (
                        <div>
                          <p>No FFL dealers found matching your search.</p>
                          <p className="text-xs mt-1">Try adjusting your search criteria.</p>
                        </div>
                      ) : (
                        <div>
                          <p>Enter a zip code or business name to search for FFL dealers.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm">Interactive Map</p>
                  <p className="text-xs">FFL dealer locations would be displayed here</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {selectedFflDealer ? (
                  `Selected: ${fflDealers.find(d => d.id === selectedFflDealer)?.name}`
                ) : (
                  'Please select an FFL dealer'
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowFflModal(false)
                    setFflZipSearch('')
                    setFflNameSearch('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFflModal(false)
                    setFflZipSearch('')
                    setFflNameSearch('')
                  }}
                  disabled={!selectedFflDealer}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShippingPaymentPage 