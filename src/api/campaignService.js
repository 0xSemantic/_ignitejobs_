/** 
 * @description Campaign API service functions
 * Purpose: Handle all campaign-related API calls
 */

import { getCampaigns, createCampaign, updateCampaign } from '../data/campaignData'

export const fetchCampaigns = async () => {
  return await getCampaigns()
}

export const createUserCampaign = async (campaign) => {
  return await createCampaign(campaign)
}

export const updateUserCampaign = async (id, updates) => {
  return await updateCampaign(id, updates)
}