import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useStore } from '../context/StoreContext.jsx';

export const CartDrawer = ({ isOpen, onClose, onCheckout, onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, gstAmount, shippingFee, totalAmount, appliedCoupon, couponDiscount, removeCoupon } = useCart();
  const { formatPrice } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E5E1DA] text-[#1A1A1A] flex flex-col shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E5E1DA] flex items-center justify-between bg-[#F5F2ED]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h3 className="text-sm font-serif text-[#1A1A1A] uppercase tracking-[0.2em] font-bold">Your Vault Cart ({cart.length})</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-[#8A817C] hover:text-[#1A1A1A] hover:bg-[#E5E1DA]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#F5F2ED] border border-[#E5E1DA] flex items-center justify-center mx-auto text-[#C5A059]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-[#1A1A1A] font-serif text-base uppercase tracking-wider">Your Cart is Empty</h4>
                <p className="text-xs text-[#8A817C] max-w-xs mx-auto font-light">
                  Explore our heritage collections, certified solitaires, and handcrafted gold creations.
                </p>
                <button
                  onClick={() => { onClose(); onNavigate('shop'); }}
                  className="mt-2 inline-block bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.3em] px-6 py-3 hover:bg-[#C5A059] transition-all"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="flex gap-4 p-3 bg-[#FDFCFB] border border-[#E5E1DA] relative group">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-20 h-20 object-cover border border-[#E5E1DA] shrink-0" 
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <p className="text-[9px] text-[#C5A059] uppercase tracking-widest font-semibold">{item.product.purity} {item.product.metal}</p>
                    <h4 className="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] truncate">{item.product.name}</h4>
                    {item.selectedSize && (
                      <p className="text-[10px] text-[#8A817C] mt-0.5">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-xs font-serif text-[#C5A059] font-bold mt-1">
                      {formatPrice(item.product.calculatedPrice)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#E5E1DA] bg-white text-xs">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 py-0.5 hover:bg-[#F5F2ED] text-[#1A1A1A]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-[#1A1A1A] font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 py-0.5 hover:bg-[#F5F2ED] text-[#1A1A1A]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="absolute top-3 right-3 p-1 text-[#8A817C] hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F5F2ED] border-t border-[#E5E1DA] space-y-3">
              {/* Applied Coupon Info */}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-white border border-[#E5E1DA] p-2.5 text-[#1A1A1A]">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-600 font-bold uppercase text-[10px] tracking-wider">
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-[#5E503F]">
                <div className="flex justify-between">
                  <span className="text-[#8A817C]">Subtotal:</span>
                  <span className="text-[#1A1A1A]">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#8A817C]">GST (3%):</span>
                  <span className="text-[#1A1A1A]">{formatPrice(gstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A817C]">Insured Shipping:</span>
                  <span className="text-emerald-700 font-medium">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-[#1A1A1A] pt-2 border-t border-[#E5E1DA]">
                  <span>Grand Total:</span>
                  <span className="text-base text-[#C5A059]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8A817C] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>100% BIS Hallmarked & Insured Transit</span>
              </div>

              <button
                onClick={() => { onClose(); onCheckout(); }}
                className="w-full bg-[#1A1A1A] text-white font-medium py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
