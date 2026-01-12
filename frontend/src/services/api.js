// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://us-central1-greenpulse.cloudfunctions.net';

// Generic API client
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/users/register', userData);
    if (response.token) {
      apiClient.setToken(response.token);
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/users/login', credentials);
    if (response.token) {
      apiClient.setToken(response.token);
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    return apiClient.get('/users/getProfile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiClient.patch('/users/updateProfile', profileData);
  },

  // Logout
  logout: () => {
    apiClient.setToken(null);
    localStorage.removeItem('authToken');
  },

  // Initialize with stored token
  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setToken(token);
    }
    return !!token;
  }
};

// Reports API
export const reportsAPI = {
  // Create new report
  create: async (reportData) => {
    return apiClient.post('/reports/create', reportData);
  },

  // Get all reports with pagination and filters
  getAll: async (params = {}) => {
    return apiClient.get('/reports/list', params);
  },

  // Get single report by ID
  getById: async (reportId) => {
    return apiClient.get(`/reports/get/${reportId}`);
  },

  // Update report status (expert/authority only)
  updateStatus: async (reportId, statusData) => {
    return apiClient.patch(`/reports/updateStatus/${reportId}`, statusData);
  },

  // Vote on a report
  vote: async (reportId, voteType) => {
    return apiClient.post('/reports/vote', { reportId, voteType });
  }
};

// AI Analysis API
export const aiAPI = {
  // Analyze report with AI
  analyze: async (analysisData) => {
    return apiClient.post('/ai/analyze', analysisData);
  },

  // Get analysis for a report
  getAnalysis: async (reportId) => {
    return apiClient.get(`/ai/getAnalysis/${reportId}`);
  },

  // Batch analyze multiple reports
  batchAnalyze: async (reportIds) => {
    return apiClient.post('/ai/batchAnalyze', { reportIds });
  }
};

// Voting API
export const votingAPI = {
  // Create new voting session
  createSession: async (sessionData) => {
    return apiClient.post('/voting/createSession', sessionData);
  },

  // Get all voting sessions
  getSessions: async (params = {}) => {
    return apiClient.get('/voting/getSessions', params);
  },

  // Vote on a session
  vote: async (sessionId, voteData) => {
    return apiClient.post('/voting/vote', { sessionId, ...voteData });
  },

  // Get voting results
  getResults: async (sessionId) => {
    return apiClient.get(`/voting/getResults/${sessionId}`);
  },

  // Close voting session
  closeSession: async (sessionId, closeData) => {
    return apiClient.patch(`/voting/closeSession/${sessionId}`, closeData);
  }
};

// Users Management API (for experts/authorities)
export const usersAPI = {
  // Get all users
  getAll: async (params = {}) => {
    return apiClient.get('/users/getAll', params);
  },

  // Update user role
  updateRole: async (userId, roleData) => {
    return apiClient.patch('/users/updateRole', { userId, ...roleData });
  },

  // Delete user
  delete: async (userId) => {
    return apiClient.delete(`/users/delete/${userId}`);
  }
};

// Export the API client for direct access if needed
export default apiClient;
