/** @description Mock user configuration data */

export const mockConfigs = [
  {
    id: 1,
    user_id: 1,
    prefs: {
      job_types: ['Full-time', 'Contract'],
      qualifications: ['JavaScript', 'React', 'Node.js', 'Python'],
      sites: ['indeed.com', 'linkedin.com', 'glassdoor.com'],
      date_range_days: 7,
      keywords: ['frontend', 'developer', 'remote'],
      exclude: ['senior', 'lead', 'manager'],
      remote: true,
      salary_min: 60000,
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:25:00Z'
  },
  {
    id: 2,
    user_id: 1,
    prefs: {
      job_types: ['Part-time', 'Internship'],
      qualifications: ['UI/UX', 'Figma', 'Design'],
      sites: ['indeed.com', 'angel.co'],
      date_range_days: 14,
      keywords: ['design', 'ui', 'ux', 'product'],
      exclude: ['senior', 'director'],
      remote: false,
      salary_min: 40000,
    },
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  }
];

export const getConfigs = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockConfigs;
}

export const updateConfig = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const config = mockConfigs.find(c => c.id === id);
  if (config) {
    Object.assign(config, updates);
    config.updated_at = new Date().toISOString();
  }
  return config;
}

export const createConfig = async (config) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newConfig = {
    id: Math.max(...mockConfigs.map(c => c.id)) + 1,
    user_id: 1,
    ...config,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockConfigs.push(newConfig);
  return newConfig;
}