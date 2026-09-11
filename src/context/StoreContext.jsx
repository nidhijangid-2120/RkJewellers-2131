import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(undefined);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [goldRate, setGoldRate] = useState({
    gold24k: 7450,
    gold22k: 6830,
    gold18k: 5590,
    gold14k: 4350,
    silver925: 88,
    platinum950: 3820,
    lastUpdated: new Date().toISOString()
  });
  const [currency, setCurrencyState] = useState('INR');
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('rk_theme');
    if (saved === 'light' || saved === 'royal' || saved === 'dark') return saved;
    return 'light';
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const setTheme = (th) => {
    setThemeState(th);
    localStorage.setItem('rk_theme', th);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        setGoldRate(data);
      }
    } catch (e) {
      console.error('Error fetching rates:', e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchCategories();
    fetchProducts();
  }, []);

  const setCurrency = (curr) => setCurrencyState(curr);

  const getCurrencyDetails = () => {
    switch (currency) {
      case 'USD': return { symbol: '$', rate: 0.012 };
      case 'AED': return { symbol: 'AED ', rate: 0.044 };
      default: return { symbol: '₹', rate: 1.0 };
    }
  };

  const { symbol: currencySymbol, rate: currencyRate } = getCurrencyDetails();

  const formatPrice = (amountInINR) => {
    const num = Number(amountInINR) || 0;
    const converted = num * currencyRate;
    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${currencySymbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateItemPrice = (weightGrams, purity, makingChargePct = 12) => {
    let ratePerGram = goldRate.gold22k;
    if (purity === '24K') ratePerGram = goldRate.gold24k;
    else if (purity === '18K') ratePerGram = goldRate.gold18k;
    else if (purity === '14K') ratePerGram = goldRate.gold14k;
    else if (purity === '925 Silver') ratePerGram = goldRate.silver925;
    else if (purity === '950 Platinum') ratePerGram = goldRate.platinum950;

    const metalVal = (Number(weightGrams) || 0) * ratePerGram;
    const makingVal = metalVal * (Number(makingChargePct) / 100);
    return Math.round(metalVal + makingVal);
  };

  const updateGoldRate = async (newRates) => {
    try {
      const adminToken = localStorage.getItem('rk_admin_token');
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newRates)
      });
      if (res.ok) {
        const data = await res.json();
        setGoldRate(data.rates || { ...goldRate, ...newRates });
        fetchProducts(); // Refresh dynamic prices
        return true;
      }
    } catch (e) {
      console.error('Error updating gold rates:', e);
    }
    return false;
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      subCategories,
      goldRate,
      currency,
      currencySymbol,
      currencyRate,
      loading,
      setCurrency,
      theme,
      setTheme,
      quickViewProduct,
      setQuickViewProduct,
      refreshRates: fetchRates,
      refreshProducts: fetchProducts,
      updateGoldRate,
      calculateItemPrice,
      formatPrice
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
