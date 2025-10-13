const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return response.json();
    },

    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials)
      });
      return response.json();
    },

    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    updateProfile: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return response.json();
    }
  },

  // Transaction endpoints
  transactions: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    create: async (transactionData) => {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData)
      });
      return response.json();
    },

    update: async (id, transactionData) => {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData)
      });
      return response.json();
    },

    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/transactions/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    }
  },

  // Category endpoints
  categories: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    create: async (categoryData) => {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });
      return response.json();
    },

    update: async (id, categoryData) => {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });
      return response.json();
    },

    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return response.json();
    }
  },

  // Analytics endpoints
  analytics: {
    getAnalytics: async (period = '6months') => {
      const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    getMonthlySummary: async (year, month) => {
      const response = await fetch(`${API_BASE_URL}/analytics/monthly-summary?year=${year}&month=${month}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    getCategoryAnalytics: async (period = '1month') => {
      const response = await fetch(`${API_BASE_URL}/analytics/categories?period=${period}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    }
  },

  // Reports endpoints
  reports: {
    getMonthlyData: async (month, year) => {
      const response = await fetch(`${API_BASE_URL}/reports/monthly?month=${month}&year=${year}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    getCategoryBreakdown: async (month, year) => {
      const response = await fetch(`${API_BASE_URL}/reports/categories?month=${month}&year=${year}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    },

    getTrends: async (period = '6months') => {
      const response = await fetch(`${API_BASE_URL}/reports/trends?period=${period}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return response.json();
    }
  }
};

export default apiService;
