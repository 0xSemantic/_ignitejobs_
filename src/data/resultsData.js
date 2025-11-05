/** @description Mock job results data */

export const mockResults = [
  {
    id: 1,
    campaign_id: 1,
    title: 'Senior Frontend Developer',
    intro: 'Join our team to build amazing user experiences with React and TypeScript. Remote position with competitive benefits.',
    url: 'https://example.com/job/1',
    match_score: 92,
    company: 'TechCorp Inc.',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    timestamp: '2024-01-20T08:00:00Z',
    tags: ['React', 'TypeScript', 'Remote']
  },
  {
    id: 2,
    campaign_id: 1,
    title: 'Frontend Engineer',
    intro: 'Looking for a passionate frontend developer to work on cutting-edge web applications using modern JavaScript frameworks.',
    url: 'https://example.com/job/2',
    match_score: 88,
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$85,000 - $110,000',
    timestamp: '2024-01-20T08:00:00Z',
    tags: ['JavaScript', 'Vue', 'UI/UX']
  },
  {
    id: 3,
    campaign_id: 2,
    title: 'UI/UX Designer',
    intro: 'Create beautiful and intuitive user interfaces for our product suite. Work closely with product and engineering teams.',
    url: 'https://example.com/job/3',
    match_score: 95,
    company: 'DesignStudio',
    location: 'San Francisco, CA',
    salary: '$75,000 - $95,000',
    timestamp: '2024-01-20T00:00:00Z',
    tags: ['Figma', 'UI Design', 'Product']
  },
  {
    id: 4,
    campaign_id: 1,
    title: 'Full Stack Developer',
    intro: 'Join our dynamic team working on both frontend and backend technologies. Node.js experience preferred.',
    url: 'https://example.com/job/4',
    match_score: 78,
    company: 'WebSolutions LLC',
    location: 'Austin, TX',
    salary: '$95,000 - $125,000',
    timestamp: '2024-01-19T14:00:00Z',
    tags: ['Node.js', 'React', 'MongoDB']
  },
  {
    id: 5,
    campaign_id: 2,
    title: 'Product Designer',
    intro: 'Shape the future of our digital products. Lead design initiatives from concept to implementation.',
    url: 'https://example.com/job/5',
    match_score: 91,
    company: 'InnovateCo',
    location: 'Remote',
    salary: '$80,000 - $105,000',
    timestamp: '2024-01-19T00:00:00Z',
    tags: ['Product Design', 'Figma', 'Research']
  }
];

export const getResults = async (campaignId = null) => {
  await new Promise(resolve => setTimeout(resolve, 900));
  if (campaignId) {
    return mockResults.filter(result => result.campaign_id === campaignId);
  }
  return mockResults;
}

export const getGroupedResults = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const campaigns = await import('./campaignData.js').then(m => m.mockCampaigns);
  
  return campaigns.map(campaign => ({
    campaign,
    results: mockResults.filter(result => result.campaign_id === campaign.id)
  }));
}