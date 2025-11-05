/** @description Mock notification data */

export const mockNotifications = [
  {
    id: 1,
    user_id: 1,
    type: 'new_results',
    message: 'Found 5 new jobs matching your Frontend Developer search',
    data: { campaign_id: 1, results_count: 5 },
    timestamp: '2024-01-20T08:05:00Z',
    read: false
  },
  {
    id: 2,
    user_id: 1,
    type: 'campaign_paused',
    message: 'UI/UX Design Search campaign has been paused due to LLM credit limits',
    data: { campaign_id: 2 },
    timestamp: '2024-01-19T16:30:00Z',
    read: true
  },
  {
    id: 3,
    user_id: 1,
    type: 'system',
    message: 'Your weekly search has completed with 8 new matches',
    data: { campaign_id: 3 },
    timestamp: '2024-01-18T09:15:00Z',
    read: true
  },
  {
    id: 4,
    user_id: 1,
    type: 'limit_warning',
    message: 'You have used 85% of your monthly LLM credits',
    data: { usage_percent: 85 },
    timestamp: '2024-01-17T14:20:00Z',
    read: false
  }
];

export const getNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockNotifications;
}

export const markAsRead = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
  return notification;
}

export const markAllAsRead = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  mockNotifications.forEach(notification => {
    notification.read = true;
  });
  return { success: true };
}