import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const result = await apiService.auth.getProfile();
          
          if (result.success) {
            setUser(result.data);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const result = await apiService.auth.login({ email, password });

      if (result.success) {
        const { token: newToken, user: userData } = result.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await apiService.auth.register(userData);

      if (result.success) {
        const { token: newToken, user: newUser } = result.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const result = await apiService.auth.updateProfile(updateData);

      if (result.success) {
        setUser(result.data);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || 'Update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Password change failed' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
