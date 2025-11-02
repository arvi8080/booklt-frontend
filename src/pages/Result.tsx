import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface BookingSuccess {
  experienceName: string
  price: number
  slot: string
  name: string
  email: string
  phone: string
  promoCode?: string
  totalPrice: number
}

const Result = () => {
  const navigate = useNavigate()
  const [bookingData, setBookingData] = useState<BookingSuccess | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('bookingSuccess')
    if (!data) {
      navigate('/')
      return
    }
    setBookingData(JSON.parse(data))

    // Clear the stored data
    localStorage.removeItem('bookingSuccess')
    localStorage.removeItem('bookingData')
  }, [navigate])

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your experience has been successfully booked.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Booking Details</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Experience:</span>
            <span className="font-medium">{bookingData.experienceName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {new Date(bookingData.slot).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{bookingData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{bookingData.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{bookingData.phone}</span>
          </div>

          {bookingData.promoCode && (
            <div className="flex justify-between">
              <span className="text-gray-600">Promo Code:</span>
              <span className="font-medium text-green-600">{bookingData.promoCode}</span>
            </div>
          )}

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Paid:</span>
            <span className="text-blue-600">₹{bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          A confirmation email has been sent to {bookingData.email}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Another Experience
        </button>
      </div>
    </div>
  )
}

export default Result
