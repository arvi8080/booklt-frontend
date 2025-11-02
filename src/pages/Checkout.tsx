import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import type { PromoValidation } from '../services/api'

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  promoCode?: string;
  submit?: string;
}

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

interface BookingData {
  experienceId: string
  experienceName: string
  price: number
  slot: string
}

const Checkout = () => {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    promoCode: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [promoValidation, setPromoValidation] = useState<PromoValidation | null>(null)
  const [loading, setLoading] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('bookingData')
    if (!data) {
      navigate('/')
      return
    }
    setBookingData(JSON.parse(data))
  }, [navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear promo validation when promo code changes
    if (name === 'promoCode') {
      setPromoValidation(null)
    }
  }

  const handlePromoValidation = async () => {
    if (!formData.promoCode.trim()) {
      setFormErrors(prev => ({ ...prev, promoCode: 'Please enter a promo code' }))
      return
    }

    setPromoLoading(true)
    try {
      const response = await apiService.validatePromo(formData.promoCode)
      setPromoValidation(response.data)
      if (response.data.valid) {
        setFormErrors(prev => ({ ...prev, promoCode: undefined }))
      } else {
        setFormErrors(prev => ({ ...prev, promoCode: 'Invalid promo code' }))
      }
    } catch {
      setPromoValidation({ valid: false, discount: 0, message: 'Invalid promo code' })
      setFormErrors(prev => ({ ...prev, promoCode: 'Error validating promo code' }))
    } finally {
      setPromoLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!bookingData) return 0
    const discount = promoValidation?.valid ? promoValidation.discount : 0
    return Math.max(0, bookingData.price - discount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingData) return

    // Validate form
    const errors: FormErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (min. 10 digits)';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true)
    try {
      const bookingPayload = {
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        experienceId: bookingData.experienceId,
        slot: bookingData.slot,
        promoCode: formData.promoCode || undefined,
      }

      const response = await apiService.createBooking(bookingPayload)

      if (response.data) {
        // Store success data for result page
        localStorage.setItem('bookingSuccess', JSON.stringify({
          ...bookingData,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          promoCode: formData.promoCode || undefined,
          totalPrice: calculateTotal(),
          bookingId: response.data._id
        }))

        navigate('/result')
      } else {
        throw new Error('No booking data received from server')
      }
    } catch (error: unknown) {
      console.error('Booking failed:', error)
      let errorMessage = 'Booking failed. Please try again.'

      // Narrow unknown to inspect a possible axios-like error shape safely
      type AxiosLike = { response?: { data?: { message?: string } }; message?: string }
      const maybeErr = error as AxiosLike
      if (maybeErr?.response?.data?.message) {
        errorMessage = maybeErr.response.data.message
      } else if (maybeErr?.message === 'Network Error' || (error instanceof Error && error.message === 'Network Error')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.'
      }

      // Add error state to show in UI instead of alert
      setFormErrors(prev => ({
        ...prev,
        submit: errorMessage
      }))
    } finally {
      setLoading(false)
    }
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Experience:</span>
            <span className="font-medium">{bookingData.experienceName}</span>
          </div>
          <div className="flex justify-between">
            <span>Time Slot:</span>
            <span className="font-medium">{new Date(bookingData.slot).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span className="font-medium">₹{bookingData.price}</span>
          </div>
          {promoValidation?.valid && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-₹{promoValidation.discount}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
      </div>

      {/* User Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
          )}
        </div>

        {/* Promo Code Section */}
        <div>
          <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
            Promo Code (Optional)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="promoCode"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleInputChange}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.promoCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter promo code"
            />
            <button
              type="button"
              onClick={handlePromoValidation}
              disabled={promoLoading || !formData.promoCode.trim()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
            >
              {promoLoading ? 'Checking...' : 'Apply'}
            </button>
          </div>
            {formErrors.promoCode && (
              <p className="mt-1 text-sm text-red-600">{formErrors.promoCode}</p>
            )}
            {promoValidation && (
              <p className={`mt-2 text-sm ${promoValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                {promoValidation.message}
              </p>
            )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Processing...' : `Complete Booking - ₹${calculateTotal()}`}
        </button>
        
        {/* Error Message */}
        {formErrors.submit && (
          <div className="mt-4 p-4 bg-red-50 border border-red-500 rounded-md">
            <p className="text-red-700">{formErrors.submit}</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default Checkout
