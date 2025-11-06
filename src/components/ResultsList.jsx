/**
 * @description Results display component for showing matched jobs
 * Purpose: Display job search results in an organized, filterable interface
 * Dependencies: API services, motion for animations, WebSocket for real-time updates
 * Flow: Fetch and display jobs, allow filtering/sorting, provide apply actions
 * Usage: Main results page for viewing and managing job matches
 * Edge cases: Empty states, loading states, real-time updates
 */
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Star, Filter, Search, MapPin, DollarSign, Building } from 'lucide-react'
import { fetchGroupedResults } from '../api/resultsService'
import LoadingSpinner from './LoadingSpinner'

const ResultsList = () => {
  const [groupedResults, setGroupedResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [minScore, setMinScore] = useState(0)
  const [favorites, setFavorites] = useState(new Set())

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const results = await fetchGroupedResults()
      setGroupedResults(results)
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (jobId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId)
      } else {
        newFavorites.add(jobId)
      }
      return newFavorites
    })
  }

  const filteredGroups = groupedResults
    .map(group => ({
      ...group,
      results: (group.results || []).filter(job =>
        (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.intro || '').toLowerCase().includes(searchTerm.toLowerCase())
      ).filter(job => (job.match_score || 0) >= minScore)
    }))
    .filter(group => (group.results || []).length > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Job Matches
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Discover opportunities that match your preferences
          </p>
        </div>
      </motion.div>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-6 mb-6"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-secondary-400" />
            <select
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
            >
              <option value="0">All Scores</option>
              <option value="80">80%+ Match</option>
              <option value="90">90%+ Match</option>
            </select>
          </div>
        </div>
      </motion.div>
      {/* Results */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, groupIndex) => (
              <motion.div
                key={group.campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden"
              >
                {/* Campaign Header */}
                <div className="bg-secondary-50 dark:bg-secondary-700/50 px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {group.campaign.name}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {group.results.length} matches found
                  </p>
                </div>
                {/* Jobs List */}
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {group.results.map((job, jobIndex) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (groupIndex * 0.1) + (jobIndex * 0.05) }}
                      className="p-6 hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
                              {job.title}
                            </h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (job.match_score || 0) >= 90
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : (job.match_score || 0) >= 80
                                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'bg-accent-100 text-accent-800 dark:bg-accent-900/20 dark:text-accent-400'
                            }`}>
                              {(job.match_score || 0).toFixed(0)}% Match
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{job.company || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location || 'Not specified'}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-secondary-700 dark:text-secondary-300 text-sm leading-relaxed">
                            {job.intro}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => toggleFavorite(job.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              favorites.has(job.id)
                                ? 'text-accent-500 bg-accent-50 dark:bg-accent-900/20'
                                : 'text-secondary-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20'
                            }`}
                          >
                            <Star className={`w-5 h-5 ${favorites.has(job.id) ? 'fill-current' : ''}`} />
                          </button>
                          <motion.a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Apply</span>
                          </motion.a>
                        </div>
                      </div>
                      {/* Tags */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center"
            >
              <Search className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                No Matches Found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                {searchTerm || minScore > 0
                  ? 'Try adjusting your search filters to see more results.'
                  : 'No job matches yet. Create a campaign to start finding opportunities that fit your preferences.'}
              </p>
              {(searchTerm || minScore > 0) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('')
                    setMinScore(0)
                  }}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResultsList