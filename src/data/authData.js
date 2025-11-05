/** @description Mock authentication data and functions for development */

export const mockUser = {
  id: 1,
  email: 'demo@ignitejobs.com',
  name: 'Alex Johnson',
  created_at: '2024-01-15T10:30:00Z'
}

export const login = async (email, password) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@ignitejobs.com' && password === 'password') {
    return {
      user: mockUser,
      token: 'mock_jwt_token_here'
    };
  }
  throw new Error('Invalid credentials');
}

export const register = async (email, password, name) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: { ...mockUser, email, name },
    token: 'mock_jwt_token_here'
  };
}

export const logout = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}