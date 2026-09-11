import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Check, Info, MessageSquare, Phone, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export const QuickViewModal = ({ product, onClose, onViewDetails, onNavigate }) => {
  const { formatPrice } = useStore();
  const [activeImg, setActiveImg] = useState('');

  if (!product) return null;

  const currentImage = activeImg || product.images[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center animate-in fade-in duration-200 min-h-screen">
      <div className="bg-stone-900 border border-amber-900/60 rounded-2xl sm:rounded-3xl max-w-3xl w-full text-stone-100 shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-stone-950 border-b border-amber-900/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-serif font-bold text-amber-200 uppercase tracking-wider">
              Jewellery Catalogue Showcase
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
              {product.purity} {product.metal}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-full transition-colors border border-stone-700 cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Product Image Gallery */}
            <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border border-stone-800/80 flex flex-col items-center justify-between">
              <div className="w-full max-w-[260px] sm:max-w-full aspect-square rounded-xl overflow-hidden border border-amber-900/30 relative mx-auto">
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail selector */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full py-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(img)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${currentImage === img ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60'}`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold">{product.collection || 'Royal Heritage'}</p>
                <h2 className="text-lg sm:text-xl font-serif text-amber-200 font-bold mt-1 leading-tight">{product.name}</h2>
                <p className="text-[11px] text-stone-400 mt-1">Code: {product.sku} | BIS Hallmarked</p>

                {/* Price & Disclaimer */}
                <div className="mt-3 p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                  <span className="text-xs text-stone-400 block">Estimated Price:</span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-300">
                    {formatPrice(product.calculatedPrice)}
                  </span>
                  <p className="text-[10px] text-amber-400/90 pt-1">
                    * Prices are approximate and may vary according to live market rates, making charges, and stone selection.
                  </p>
                </div>

                {/* Specifications preview */}
                <div className="mt-3 p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Approx Weight:</span>
                    <span className="text-stone-200 font-medium">{product.netWeightGrams}g</span>
                  </div>
                  {product.diamondDetails && (
                    <div className="flex justify-between text-stone-400">
                      <span>Stone Details:</span>
                      <span className="text-stone-200 font-medium">{product.diamondDetails.carat} Ct ({product.diamondDetails.clarity})</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-400">
                    <span>Availability:</span>
                    <span className="text-emerald-400 font-semibold">Available for Custom Booking</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-3 border-t border-stone-800">
                <button
                  onClick={() => {
                    onClose();
                    onViewDetails(product);
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-bold py-2.5 sm:py-3 rounded-xl hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 text-xs shadow-lg cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  View Details & Store Enquiry
                </button>

                <button
                  onClick={() => { onClose(); onViewDetails(product); }}
                  className="w-full text-center text-xs text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
                >
                  Inspect Full Specifications
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
