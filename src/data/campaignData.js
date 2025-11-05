/** @description Mock campaign data */

export const mockCampaigns = [
  {
    id: 1,
    user_id: 1,
    config_id: 1,
    name: 'Frontend Developer Search',
    schedule_str: 'every 6h',
    duration_days: 7,
    active: true,
    last_run: '2024-01-20T08:00:00Z',
    created_at: '2024-01-15T10:30:00Z',
    results_count: 24
  },
  {
    id: 2,
    user_id: 1,
    config_id: 2,
    name: 'UI/UX Design Search',
    schedule_str: 'daily',
    duration_days: 30,
    active: true,
    last_run: '2024-01-20T00:00:00Z',
    created_at: '2024-01-18T16:45:00Z',
    results_count: 12
  },
  {
    id: 3,
    user_id: 1,
    config_id: 1,
    name: 'Weekly Tech Scan',
    schedule_str: 'weekly',
    duration_days: 90,
    active: false,
    last_run: '2024-01-13T00:00:00Z',
    created_at: '2024-01-10T09:15:00Z',
    results_count: 8
  }
];

export const getCampaigns = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockCampaigns;
}

export const createCampaign = async (campaign) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newCampaign = {
    id: Math.max(...mockCampaigns.map(c => c.id)) + 1,
    user_id: 1,
    results_count: 0,
    last_run: null,
    ...campaign,
    created_at: new Date().toISOString()
  };
  mockCampaigns.push(newCampaign);
  return newCampaign;
}

export const updateCampaign = async (id, updates) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const campaign = mockCampaigns.find(c => c.id === id);
  if (campaign) {
    Object.assign(campaign, updates);
  }
  return campaign;
}