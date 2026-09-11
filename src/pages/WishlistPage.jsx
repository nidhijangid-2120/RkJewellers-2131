import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useStore } from '../context/StoreContext.jsx';

export const WishlistPage = ({ onNavigate }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useStore();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="bg-stone-950 text-stone-100 min-h-screen py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-stone-900 border border-stone-800 rounded-full flex items-center justify-center text-amber-400 mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif text-amber-200 font-bold">Your Wishlist is Empty</h2>
        <p className="text-xs text-stone-400 max-w-sm mt-1 mb-6">Save your favorite 22K gold designs and solitaire diamonds to review later.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-amber-500 text-stone-950 font-bold px-8 py-3 rounded-full text-xs hover:bg-amber-400 transition-colors cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-stone-800 pb-4">
          <h1 className="text-2xl font-serif text-amber-200 font-bold">Saved Wishlist ({wishlist.length} Items)</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div 
              key={product.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-950">
                <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-stone-950/80 border border-stone-700 text-rose-400 rounded-full cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase">{product.purity} {product.metal}</p>
                  <h4 
                    onClick={() => onNavigate('product-detail', { id: product.id })}
                    className="text-sm font-semibold text-stone-200 hover:text-amber-300 cursor-pointer line-clamp-1 mt-0.5"
                  >
                    {product.name}
                  </h4>
                  <p className="text-xs font-bold text-amber-300 mt-2">{formatPrice(product.calculatedPrice)}</p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
