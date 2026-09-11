import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const FavoritesContext = createContext(undefined);

export const FavoritesProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [designRequests, setDesignRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real favorites from database when user is authenticated
  const fetchFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching favorites:', e);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real bespoke requests
  const fetchDesignRequests = async () => {
    if (!token) {
      setDesignRequests([]);
      return;
    }
    try {
      const res = await fetch('/api/custom-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDesignRequests(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching custom requests:', e);
      setDesignRequests([]);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchFavorites();
      fetchDesignRequests();
    } else {
      setFavorites([]);
      setDesignRequests([]);
    }
  }, [user, token]);

  const toggleFavorite = async (product) => {
    if (!product || !product.id) return;
    if (!token) {
      return false; // Requires login
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isFavorite) {
          setFavorites(prev => [data.favorite || { product, addedAt: new Date().toISOString() }, ...prev]);
        } else {
          setFavorites(prev => prev.filter(f => f.product?.id !== product.id));
        }
        return true;
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
    return false;
  };

  const isFavorite = (productId) => {
    return favorites.some(f => f.product?.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const sendDesignRequest = async (formData) => {
    if (!token) return { success: false, message: 'Authentication required' };
    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newReq = await res.json();
        setDesignRequests(prev => [newReq, ...prev]);
        return { success: true, request: newReq };
      } else {
        const err = await res.json();
        return { success: false, message: err.message };
      }
    } catch (e) {
      return { success: false, message: 'Could not submit design request' };
    }
  };

  const wishlistProducts = favorites.map(f => f.product).filter(Boolean);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      favoritesCount: favorites.length,
      clearFavorites,
      designRequests,
      sendDesignRequest,
      fetchDesignRequests,
      wishlist: wishlistProducts,
      toggleWishlist: toggleFavorite,
      isInWishlist: isFavorite,
      wishlistCount: favorites.length,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};

export const useWishlist = useFavorites;
