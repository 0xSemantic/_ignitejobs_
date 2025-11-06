/**
 * @description User configuration API service functions
 * Purpose: Handle all config-related API calls
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const fetchConfigs = async () => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.get(`${baseURL}/configs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Parse prefs_json to prefs object on frontend
    return response.data.map(config => ({
      ...config,
      prefs: JSON.parse(config.prefs_json)
    }))
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to fetch configs'
  }
}

export const updateUserConfig = async (id, updates) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.put(`${baseURL}/configs/${id}`, {
      prefs_json: JSON.stringify(updates.prefs)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to update config'
  }
}

export const createUserConfig = async (config) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.post(`${baseURL}/configs`, {
      prefs_json: JSON.stringify(config.prefs)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return {
      ...response.data,
      prefs: config.prefs
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to create config'
  }
}