/**
 * @description Campaign management form for scheduling automated job searches
 * Purpose: Allow users to create and manage automated job search campaigns
 * Dependencies: API services, motion for animations, date handling
 * Flow: Display existing campaigns, provide form to create/edit campaigns
 * Usage: Campaign management page for scheduling automated searches
 * Edge cases: Schedule validation, active/inactive toggles, duration limits
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Play, Pause, Calendar, Clock, Target } from 'lucide-react'
import { fetchCampaigns, createUserCampaign, updateUserCampaign } from '../api/campaignService'
import { fetchConfigs } from '../api/configService'
import LoadingSpinner from './LoadingSpinner'

const CampaignForm = () => {
  const [campaigns, setCampaigns] = useState([])
  const [configs, setConfigs] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [campaignsData, configsData] = await Promise.all([
        fetchCampaigns(),
        fetchConfigs()
      ])
      setCampaigns(campaignsData)
      setConfigs(configsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      const formData = new FormData(e.target)
      const campaign = {
        name: formData.get('name'),
        config_id: parseInt(formData.get('config_id')),
        schedule_str: formData.get('schedule_str'),
        duration_days: parseInt(formData.get('duration_days')),
        active: true
      }

      await createUserCampaign(campaign)
      await loadData()
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setCreating(false)
    }
  }

  const toggleCampaign = async (campaignId, active) => {
    try {
      await updateUserCampaign(campaignId, { active: !active })
      await loadData()
    } catch (error) {
      console.error('Error updating campaign:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Search Campaigns
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Automate your job search with scheduled campaigns
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>New Campaign</span>
        </motion.button>
      </motion.div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Create New Campaign
          </h3>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., Daily Frontend Search"
                  className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
                />
              </div>
              <div>
                <label htmlFor="config_id" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Configuration
                </label>
                <select
                  id="config_id"
                  name="config_id"
                  required
                  className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option value="">Select a configuration</option>
                  {configs.map(config => (
                    <option key={config.id} value={config.id}>
                      Config #{config.id} - {config.prefs.job_types.join(', ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="schedule_str" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Schedule
                </label>
                <select
                  id="schedule_str"
                  name="schedule_str"
                  required
                  className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option value="every 6h">Every 6 hours</option>
                  <option value="daily">Daily</option>
                  <option value="every 2d">Every 2 days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration_days" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Duration
                </label>
                <select
                  id="duration_days"
                  name="duration_days"
                  required
                  className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option value="7">1 week</option>
                  <option value="14">2 weeks</option>
                  <option value="30">1 month</option>
                  <option value="90">3 months</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={creating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-400 text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{creating ? 'Creating...' : 'Create Campaign'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => {
          const config = configs.find(c => c.id === campaign.config_id)
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Using Config #{campaign.config_id}
                  </p>
                </div>
                <button
                  onClick={() => toggleCampaign(campaign.id, campaign.active)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    campaign.active 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-400'
                  }`}
                >
                  {campaign.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{campaign.schedule_str}</span>
                </div>
                <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{campaign.duration_days} days</span>
                </div>
                <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400">
                  <Target className="w-4 h-4 mr-2" />
                  <span>{campaign.results_count} results</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-400'
                }`}>
                  {campaign.active ? 'Active' : 'Paused'}
                </div>
                <div className="text-xs text-secondary-500 dark:text-secondary-400">
                  Last run: {new Date(campaign.last_run).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {campaigns.length === 0 && !showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center"
        >
          <Target className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            No Campaigns Yet
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Create your first campaign to start automating your job search.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Campaign</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default CampaignForm