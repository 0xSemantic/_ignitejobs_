/** 
 * @description User configuration API service functions
 * Purpose: Handle all config-related API calls
 */

import { getConfigs, updateConfig, createConfig } from '../data/configData'

export const fetchConfigs = async () => {
  return await getConfigs()
}

export const updateUserConfig = async (id, updates) => {
  return await updateConfig(id, updates)
}

export const createUserConfig = async (config) => {
  return await createConfig(config)
}