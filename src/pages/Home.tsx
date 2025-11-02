import { useEffect, useState } from 'react'
// Link moved to ExperienceCard
import ExperienceCard from '../components/ExperienceCard'
import { apiService } from '../services/api'
import type { Experience } from '../services/api'

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(9)

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 9)
  }

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await apiService.getExperiences()
        setExperiences(response.data)
      } catch (err) {
        setError('Failed to load experiences')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  const filteredExperiences = experiences.filter(experience =>
    experience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    experience.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (experience.location && experience.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Show up to visibleCount experiences (initially 9, increases when "Show more" clicked)
  const visibleExperiences = filteredExperiences.slice(0, visibleCount)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading experiences...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">hd</div>
            <h1 className="text-2xl font-semibold text-gray-900">highway delite</h1>
          </div>

          {/* Search Bar */}
          <div className="flex items-center max-w-lg w-full mx-4">
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-5 rounded-r-lg">
              Search
            </button>
          </div>

          <button className="text-gray-700 text-sm">Login</button>
        </div>
      </nav>

      {/* Experiences Section */}
      <div className="w-full px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore Experiences</h2>

        {filteredExperiences.length === 0 ? (
          <p className="text-center text-gray-500">No experiences found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {visibleExperiences.map((experience, idx) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                // make the first row larger and featured
                imageHeight={idx < 3 ? 'h-64' : 'h-52'}
                featured={idx < 3}
              />
            ))}
          </div>
        )}
        
        {/* Show more button if there are more experiences to show */}
        {filteredExperiences.length > visibleCount && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleShowMore}
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 border border-gray-300 rounded-lg shadow-sm transition-all duration-300"
            >
              Show More Experiences
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
