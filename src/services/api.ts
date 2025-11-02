import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Experience {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  location?: string;
  availableSlots: string[];
}

export interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  experienceId: string;
  slot: string;
  promoCode?: string;
  totalPrice: number;
  createdAt: string;
}

export interface PromoValidation {
  valid: boolean;
  discount: number;
  message: string;
}

export interface BookingRequest {
  userName: string;
  userEmail: string;
  userPhone: string;
  experienceId: string;
  slot: string;
  promoCode?: string;
}

export const apiService = {
  getExperiences: () => api.get<Experience[]>('/experiences'),
  getExperience: (id: string) => api.get<Experience>(`/experiences/${id}`),
  createBooking: (booking: BookingRequest) =>
    api.post<Booking>('/bookings', booking),
  validatePromo: (code: string) =>
    api.post<PromoValidation>('/promo/validate', { code }),
};

export default api;
