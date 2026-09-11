import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('rk_token') || null;
  });
  const [loading, setLoading] = useState(true);

  // Validate session on mount or token change
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('rk_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid or expired
          localStorage.removeItem('rk_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (emailOrPhone, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrPhone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Login failed. Please verify credentials.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('rk_token', data.token);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: 'Network error. Could not connect to RK Jewellers server.' };
    }
  };

  const register = async ({ name, email, phone, password, address }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, address })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Registration failed. Please check your details.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('rk_token', data.token);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: 'Network error. Could not complete registration.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rk_token');
  };

  const updateUserProfile = async (formData) => {
    if (!token) return { success: false, message: 'Not logged in' };
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const err = await res.json();
        return { success: false, message: err.message };
      }
    } catch (e) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
