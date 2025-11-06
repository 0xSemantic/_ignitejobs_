/**
 * @description Campaign API service functions
 * Purpose: Handle all campaign-related API calls
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const fetchCampaigns = async () => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.get(`${baseURL}/campaigns`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to fetch campaigns'
  }
}

export const createUserCampaign = async (campaignData) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.post(`${baseURL}/campaigns`, campaignData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to create campaign'
  }
}

export const updateUserCampaign = async (id, updates) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.patch(`${baseURL}/campaigns/${id}`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to update campaign'
  }
}