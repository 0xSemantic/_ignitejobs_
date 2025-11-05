/** 
 * @description Results API service functions
 * Purpose: Handle all results-related API calls
 */

import { getResults, getGroupedResults } from '../data/resultsData'

export const fetchResults = async (campaignId = null) => {
  return await getResults(campaignId)
}

export const fetchGroupedResults = async () => {
  return await getGroupedResults()
}