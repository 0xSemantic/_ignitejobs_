/**
 * @description Results API service functions
 * Purpose: Handle all results-related API calls
 */
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const fetchResults = async (params = {}) => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.get(`${baseURL}/results`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to fetch results'
  }
}

export const fetchGroupedResults = async () => {
  try {
    const token = localStorage.getItem('ignitejobs-token')
    const response = await axios.get(`${baseURL}/results`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Group flat results by campaign_id on frontend
    const grouped = response.data.reduce((acc, job) => {
      const campaignId = job.campaign_id || 'ungrouped'
      if (!acc[campaignId]) {
        acc[campaignId] = { campaign: { id: campaignId, name: campaignId === 'ungrouped' ? 'Ungrouped Jobs' : `Campaign ${campaignId}` }, results: [] }
      }
      acc[campaignId].results.push(job)
      return acc
    }, {})
    return Object.values(grouped)
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('ignitejobs-token')
      localStorage.removeItem('ignitejobs-user')
      window.location.href = '/login'
    }
    throw error.response?.data?.detail || 'Failed to fetch grouped results'
  }
}