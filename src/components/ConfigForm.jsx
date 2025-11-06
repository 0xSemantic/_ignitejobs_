/**
 * @description User configuration form for job search preferences
 * Purpose: Allow users to customize their job search criteria and preferences
 * Dependencies: react-hook-form, API services, motion for animations
 * Flow: Load existing configs, provide form to edit preferences, save changes
 * Usage: Settings page for managing job search configurations
 * Edge cases: Form validation, loading states, error handling
 */
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Save, Settings, Upload } from 'lucide-react'
import { fetchConfigs, createUserConfig, updateUserConfig } from '../api/configService'
import LoadingSpinner from './LoadingSpinner'

const ConfigForm = () => {
  const [configs, setConfigs] = useState([])
  const [activeConfig, setActiveConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    try {
      const configsData = await fetchConfigs()
      setConfigs(configsData)
      if (configsData.length > 0 && !activeConfig) {
        setActiveConfig(configsData[0])
      }
    } catch (error) {
      console.error('Error loading configs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!activeConfig) return
    setSaving(true)
    try {
      const formData = new FormData(e.target)
      const updates = {
        prefs: {
          job_types: formData.getAll('job_types'),
          qualifications: formData.get('qualifications')?.split(',').map(q => q.trim()).filter(Boolean) || [],
          sites: formData.getAll('sites'),
          date_range_days: parseInt(formData.get('date_range_days')),
          keywords: formData.get('keywords')?.split(',').map(k => k.trim()).filter(Boolean) || [],
          exclude: formData.get('exclude')?.split(',').map(e => e.trim()).filter(Boolean) || [],
          remote: formData.get('remote') === 'true',
          salary_min: parseInt(formData.get('salary_min')) || 0,
        }
      }
      await updateUserConfig(activeConfig.id, updates)
      await loadConfigs() // Reload to get updated data
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateNew = async () => {
    const newConfig = {
      prefs: {
        job_types: ['Full-time'],
        qualifications: [],
        sites: ['indeed.com', 'linkedin.com'],
        date_range_days: 7,
        keywords: [],
        exclude: [],
        remote: true,
        salary_min: 50000,
      }
    }
    try {
      const created = await createUserConfig(newConfig)
      setConfigs(prev => [...prev, created])
      setActiveConfig(created)
    } catch (error) {
      console.error('Error creating config:', error)
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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Search Configuration
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Customize your job search preferences and criteria
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>New Config</span>
        </motion.button>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Config List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Your Configurations
              </h3>
            </div>
            <div className="p-2">
              {configs.length > 0 ? (
                configs.map((config) => (
                  <motion.button
                    key={config.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveConfig(config)}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 ${
                      activeConfig?.id === config.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                        : 'hover:bg-secondary-100 dark:hover:bg-secondary-700'
                    }`}
                  >
                    <div className="font-medium text-secondary-900 dark:text-white">
                      Config #{config.id}
                    </div>
                    <div className="text-sm text-secondary-500 dark:text-secondary-400">
                      {(config.prefs?.job_types || []).join(', ')}
                    </div>
                  </motion.button>
                ))
              ) : (
                <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-4">
                  No configurations yet
                </p>
              )}
            </div>
          </div>
        </motion.div>
        {/* Config Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {activeConfig ? (
            <form onSubmit={handleSave}>
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
                <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                      Edit Configuration
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-secondary-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Job Types */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                      Job Types
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="job_types"
                            value={type}
                            defaultChecked={activeConfig.prefs?.job_types?.includes(type) || false}
                            className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700 dark:text-secondary-300">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Sites */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                      Job Sites
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['indeed.com', 'linkedin.com', 'glassdoor.com', 'angel.co', 'monster.com'].map((site) => (
                        <label key={site} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="sites"
                            value={site}
                            defaultChecked={activeConfig.prefs?.sites?.includes(site) || false}
                            className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700 dark:text-secondary-300">
                            {site}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Qualifications */}
                  <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Qualifications & Skills
                    </label>
                    <input
                      type="text"
                      id="qualifications"
                      name="qualifications"
                      defaultValue={(activeConfig.prefs?.qualifications || []).join(', ')}
                      placeholder="JavaScript, React, Python, etc."
                      className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
                    />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                      Separate skills with commas
                    </p>
                  </div>
                  {/* Keywords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="keywords" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Include Keywords
                      </label>
                      <input
                        type="text"
                        id="keywords"
                        name="keywords"
                        defaultValue={(activeConfig.prefs?.keywords || []).join(', ')}
                        placeholder="frontend, developer, remote, etc."
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="exclude" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Exclude Keywords
                      </label>
                      <input
                        type="text"
                        id="exclude"
                        name="exclude"
                        defaultValue={(activeConfig.prefs?.exclude || []).join(', ')}
                        placeholder="senior, lead, manager, etc."
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
                      />
                    </div>
                  </div>
                  {/* Additional Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="date_range_days" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Posting Period
                      </label>
                      <select
                        id="date_range_days"
                        name="date_range_days"
                        defaultValue={activeConfig.prefs?.date_range_days || 7}
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      >
                        <option value="1">Last 24 hours</option>
                        <option value="3">Last 3 days</option>
                        <option value="7">Last week</option>
                        <option value="14">Last 2 weeks</option>
                        <option value="30">Last month</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="salary_min" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Minimum Salary ($)
                      </label>
                      <input
                        type="number"
                        id="salary_min"
                        name="salary_min"
                        defaultValue={activeConfig.prefs?.salary_min || ''}
                        placeholder="50000"
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Remote Work
                      </label>
                      <select
                        name="remote"
                        defaultValue={activeConfig.prefs?.remote ? 'true' : 'false'}
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      >
                        <option value="true">Remote Only</option>
                        <option value="false">On-site/Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-700/20 rounded-b-xl">
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-400 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </motion.button>
                </div>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center"
            >
              <Settings className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                No Configuration Selected
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Select a configuration from the list or create a new one to get started.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Config</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ConfigForm