/**
 * @description Dashboard home page with overview stats and recent activity
 * Purpose: Provide users with a comprehensive overview of their job search activity
 * Dependencies: Chart.js, various API services, motion for animations
 * Flow: Fetch and display stats, campaigns, and recent results
 * Usage: Main dashboard landing page
 * Edge cases: Empty states, loading states, data fetching errors
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Briefcase, 
  CheckCircle, 
  Clock,
  Sparkles,
  Search
} from 'lucide-react'
import { fetchCampaigns } from '../api/campaignService'
import { fetchGroupedResults } from '../api/resultsService'
import { fetchNotifications } from '../api/notificationService'
import { useAuth } from '../utils/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const DashboardHome = () => {
  const { user, signout } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentCampaigns, setRecentCampaigns] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      setLoading(true)
      setError('')
      try {
        const [campaigns, groupedResults, notifications] = await Promise.all([
          fetchCampaigns(),
          fetchGroupedResults(),
          fetchNotifications(true) // Fetch unread notifications
        ])
        setRecentCampaigns(campaigns.slice(0, 3))
        
        // Flatten and get recent results
        const allResults = groupedResults.flatMap(group => group.results || [])
        setRecentResults(allResults.slice(0, 5))

        // Calculate stats
        const totalJobs = allResults.length
        const highMatches = allResults.filter(job => (job.match_score || 0) >= 80).length
        const activeCampaigns = campaigns.filter(c => c.active).length

        setStats({
          totalJobs,
          highMatches,
          activeCampaigns,
          unreadNotifications: notifications.filter(n => !n.read).length
        })

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        if (error.response?.status === 401) {
          await signout() // Trigger logout on unauthorized
        } else {
          setError('Failed to load dashboard data. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, signout])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Jobs Found',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'High Matches',
      value: stats?.highMatches || 0,
      icon: CheckCircle,
      color: 'accent',
      change: '+8%'
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns || 0,
      icon: TrendingUp,
      color: 'primary',
      change: '+2'
    },
    {
      title: 'Unread Notifications',
      value: stats?.unreadNotifications || 0,
      icon: Clock,
      color: 'secondary',
      change: '-3'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name || user?.email}! 👋
            </h1>
            <p className="text-primary-100 opacity-90">
              Your job search is actively running across {stats?.activeCampaigns || 0} campaigns
            </p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="hidden md:block"
          >
            <Sparkles className="w-12 h-12 text-white opacity-50" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                {stat.title}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Active Campaigns
            </h2>
            <Search className="w-5 h-5 text-secondary-400" />
          </div>

          <div className="space-y-4">
            {recentCampaigns.length > 0 ? (
              recentCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary-50 dark:bg-secondary-700/50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {campaign.schedule_str} • {campaign.results_count || 0} results
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-400'
                  }`}>
                    {campaign.active ? 'Active' : 'Paused'}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active campaigns</p>
                <p className="text-sm">Create your first campaign to start finding jobs</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Recent Matches
            </h2>
            <TrendingUp className="w-5 h-5 text-secondary-400" />
          </div>

          <div className="space-y-4">
            {recentResults.length > 0 ? (
              recentResults.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary-50 dark:bg-secondary-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-secondary-900 dark:text-white truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                      {job.company || 'Unknown Company'} • {job.location || 'Remote'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400`}>
                    {(job.match_score || 0).toFixed(0)}%
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent matches</p>
                <p className="text-sm">Jobs will appear here as they're found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
      >
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Start New Search', description: 'Find jobs now', href: '/dashboard/search', icon: Search },
            { label: 'Create Campaign', description: 'Automate your search', href: '/dashboard/campaigns', icon: Briefcase },
            { label: 'View All Results', description: 'See all matches', href: '/dashboard/search', icon: TrendingUp }
          ].map((action, index) => (
            <motion.a
              key={action.label}
              href={action.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 text-center group"
            >
              <action.icon className="w-8 h-8 text-secondary-400 group-hover:text-primary-500 mx-auto mb-2 transition-colors duration-200" />
              <div className="font-medium text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors duration-200">
                {action.label}
              </div>
              <div className="text-sm text-secondary-500 dark:text-secondary-400">
                {action.description}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {error && (
        <div className="text-center p-6">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

export default DashboardHome