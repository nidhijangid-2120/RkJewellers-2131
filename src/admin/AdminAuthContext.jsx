import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(undefined);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('rk_admin_token') || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminSession = async () => {
      const storedToken = localStorage.getItem('rk_admin_token');
      if (!storedToken) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
          setAdminToken(storedToken);
        } else {
          localStorage.removeItem('rk_admin_token');
          localStorage.removeItem('rk_admin_user');
          setAdminUser(null);
          setAdminToken(null);
        }
      } catch (e) {
        console.error('Admin session verify error:', e);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminSession();
  }, []);

  const adminLogin = async (email, pass) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Invalid admin credentials or account not authorized.' };
      }

      setAdminUser(data.user);
      setAdminToken(data.token);
      localStorage.setItem('rk_admin_token', data.token);
      localStorage.setItem('rk_admin_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: 'Server communication error or backend unreachable.' };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('rk_admin_user');
    localStorage.removeItem('rk_admin_token');
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      adminToken,
      loading,
      isAuthenticated: !!adminUser && (adminUser.role === 'admin' || adminUser.role === 'super_admin'),
      adminLogin,
      adminLogout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
