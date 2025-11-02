import { Link } from 'react-router-dom'
import type { Experience } from '../services/api'

type Props = {
  experience: Experience
  imageHeight?: string
  className?: string
  featured?: boolean
}

export default function ExperienceCard({ experience, imageHeight = 'h-52', className = '', featured = false }: Props) {
  return (
    <article 
      className={`bg-white rounded-xl overflow-hidden ${featured ? 'shadow-md hover:shadow-xl ring-1 ring-yellow-100' : 'shadow-sm hover:shadow-lg border border-gray-100'} 
        transition-all duration-300 flex flex-col h-full ${className}`}
    >
      <div className="relative">
        <img
          src={experience.imageUrl || '/placeholder.jpg'}
          alt={experience.name}
          className={`w-full ${imageHeight} object-cover ${featured ? 'hover:scale-105 transition-transform duration-500' : ''}`}
        />
        <div className="absolute top-3 left-3 bg-white text-xs font-medium px-3 py-1 rounded-full text-gray-700 shadow">
          {experience.location || 'Unknown'}
        </div>
        {featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Featured
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{experience.name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-lg font-bold text-gray-900">₹{experience.price}</p>
          </div>
          <Link to={`/experience/${experience._id}`} className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
