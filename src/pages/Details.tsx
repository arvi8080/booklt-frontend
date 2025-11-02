import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import type { Experience } from '../services/api'

const Details = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string>('')

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return

      try {
        const response = await apiService.getExperience(id)
        setExperience(response.data)
      } catch (err) {
        setError('Failed to load experience details')
        console.error('Error fetching experience:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [id])

  const handleBookNow = () => {
    if (!experience || !selectedSlot) return

    // Store booking data in localStorage for the checkout page
    const bookingData = {
      experienceId: experience._id,
      experienceName: experience.name,
      price: experience.price,
      slot: selectedSlot,
    }
    localStorage.setItem('bookingData', JSON.stringify(bookingData))

    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Experience not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Experiences
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="rounded-lg h-96 overflow-hidden">
          <img
            src={experience.imageUrl}
            alt={experience.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {experience.name}
            </h1>
            <p className="text-gray-600 text-lg">{experience.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-blue-600">
              ₹{experience.price}
            </span>
            <span className="text-gray-500">
              Duration: {experience.duration} hours
            </span>
          </div>

          {/* Slot Selection */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Select a Time Slot
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {experience.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 border rounded-md text-center transition-colors ${
                    selectedSlot === slot
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {new Date(slot).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBookNow}
            disabled={!selectedSlot}
            className={`w-full py-3 px-6 rounded-md font-semibold text-white transition-colors ${
              selectedSlot
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedSlot ? 'Book Now' : 'Select a Time Slot'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Details
