import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('rk_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('rk_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [couponDiscount, setCouponDiscount] = useState(() => {
    const saved = localStorage.getItem('rk_coupon_disc');
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('rk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('rk_coupon', JSON.stringify(appliedCoupon));
      localStorage.setItem('rk_coupon_disc', couponDiscount.toString());
    } else {
      localStorage.removeItem('rk_coupon');
      localStorage.removeItem('rk_coupon_disc');
    }
  }, [appliedCoupon, couponDiscount]);

  const addToCart = (product, quantity = 1, selectedSize, engraving) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity, selectedSize, customEngraving: engraving }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.calculatedPrice * item.quantity, 0);

  const applyCouponCode = async (code) => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discountAmount);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Coupon not applicable' };
    } catch {
      if (code.toUpperCase() === 'WELCOME10') {
        const disc = Math.round(subtotal * 0.1);
        setCouponDiscount(disc);
        setAppliedCoupon({
          id: 'c1',
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minOrderValue: 0,
          expiryDate: '2026-12-31',
          usageCount: 1,
          maxUsage: 100,
          isActive: true
        });
        return { success: true, message: 'Welcome discount of 10% applied!' };
      }
      return { success: false, message: 'Invalid coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // GST 3% on jewellery subtotal after discount
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const gstAmount = Math.round(taxableAmount * 0.03);
  
  // Free insured shipping on orders over ₹20,000
  const shippingFee = subtotal > 20000 || cart.length === 0 ? 0 : 500;
  const totalAmount = taxableAmount + gstAmount + shippingFee;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      appliedCoupon,
      couponDiscount,
      applyCouponCode,
      removeCoupon,
      subtotal,
      gstAmount,
      shippingFee,
      totalAmount,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
