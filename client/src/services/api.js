import axios from 'axios'
import { notifyAuthLogout } from './authEvents'
import { clearAuthStorage, getToken } from './tokenStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mern-auth-2-tt2r.onrender.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAuthStorage()
      notifyAuthLogout()
    }

    return Promise.reject(error)
  },
)

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please make sure the backend server is running.'
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.'
  }

  if (error.response?.status === 401) {
    return error.response.data?.message || 'Invalid email or password.'
  }

  if (error.response?.status === 403) {
    return error.response.data?.message || 'Forbidden. Please login again.'
  }

  if (error.response?.status === 409) {
    return error.response.data?.message || 'Email is already registered.'
  }

  if (error.response?.status === 404) {
    return error.response.data?.message || 'User not found.'
  }

  if (error.response?.status >= 500) {
    return error.response.data?.message || 'Server error. Please try again later.'
  }

  return error.response?.data?.message || fallback
}

export default api
