import React, { useState } from 'react';
import { 
  ShieldCheck, Truck, Award, Star, 
  MapPin, Check, Info, ArrowRight, Sparkles, MessageSquare, ZoomIn,
  Building2, Phone, Calendar, Clock, AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export const ProductDetailPage = ({
  productId,
  onNavigate,
  onOpenAIStylist
}) => {
  const { products, goldRate, formatPrice } = useStore();

  const product = products.find(p => p.id === productId || p.slug === productId) || products[0];

  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '');
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Image Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!product) {
    return (
      <div className="bg-stone-950 text-stone-100 min-h-screen py-16 text-center">
        <h2 className="text-xl font-serif text-amber-200">Product Not Found</h2>
        <button onClick={() => onNavigate('shop')} className="mt-4 bg-amber-500 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold">
          Back to Catalogue
        </button>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const currentImg = activeImage || product.images?.[0];

  const handleSendEnquiry = (e) => {
    e.preventDefault();
    setEnquirySent(true);
    setTimeout(() => {
      setShowEnquiryModal(false);
      setEnquirySent(false);
      setEnquiryNotes('');
    }, 2500);
  };

  // Live metal price component calculation
  let metalRate = goldRate.gold22k;
  if (product.purity === '24K') metalRate = goldRate.gold24k;
  else if (product.purity === '18K') metalRate = goldRate.gold18k;
  else if (product.purity === '14K') metalRate = goldRate.gold14k;
  else if (product.purity === '925 Silver') metalRate = goldRate.silver925;
  else if (product.purity === '950 Platinum') metalRate = goldRate.platinum950;

  const rawMetalCost = Math.round((product.netWeightGrams || 0) * (metalRate || 0));
  const makingChargesVal = Math.round(rawMetalCost * ((product.makingChargesPercentage || 10) / 100));
  const diamondVal = product.diamondDetails ? Math.round((product.diamondDetails.carat || 0) * 180000) : 0;
  const gstVal = Math.round((rawMetalCost + makingChargesVal + diamondVal) * 0.03);

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <div className="text-xs text-stone-400 flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-300 cursor-pointer">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('shop')} className="hover:text-amber-300 cursor-pointer">Shop</button>
          <span>/</span>
          <span className="text-amber-300 font-medium">{product.name}</span>
        </div>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-stone-900 border border-amber-900/40 rounded-3xl overflow-hidden shadow-2xl cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={currentImg} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-150 ease-out select-none"
                style={{
                  transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
              />
              <span className="absolute top-4 left-4 bg-stone-950/90 border border-amber-500/50 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider pointer-events-none z-10 shadow-md">
                {product.purity} {product.metal}
              </span>

              {/* Hover to Zoom indicator chip */}
              <div className={`absolute bottom-4 right-4 bg-stone-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-opacity duration-300 pointer-events-none z-10 shadow-lg ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Hover image to inspect craftsmanship</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(product.images || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${currentImg === img ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold">{product.collection || 'Royal Heritage'}</p>
              <h1 className="text-2xl sm:text-3xl font-serif text-amber-200 font-bold mt-1 leading-tight">{product.name}</h1>
              <p className="text-xs text-stone-400 mt-1">SKU: {product.sku} | BIS Hallmarked & IGI Certified</p>

              <div className="flex items-center gap-2 text-xs text-amber-400 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold">{product.rating || 4.9}</span>
                <span className="text-stone-400">({product.reviewCount || 42} Verified Ratings)</span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="p-4 bg-stone-900 border border-amber-900/50 rounded-2xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-stone-400 block">Estimated Price (Live Rate Based):</span>
                  <span className="text-3xl font-bold text-amber-300">
                    {formatPrice(product.calculatedPrice)}
                  </span>
                </div>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-800 uppercase tracking-widest flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Available for Custom Order
                </span>
              </div>
              <p className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Prices are approximate and may vary according to the live market rate, making charges, and stone selection.</span>
              </p>
            </div>

            {/* Price Breakdown Table */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs space-y-2">
              <h4 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] mb-2">Estimated Rate Breakdown</h4>
              <div className="flex justify-between text-stone-300">
                <span>Net Gold Weight ({product.netWeightGrams}g @ {formatPrice(metalRate)}/g):</span>
                <span className="font-mono">{formatPrice(rawMetalCost)}</span>
              </div>
              {product.diamondDetails && (
                <div className="flex justify-between text-stone-300">
                  <span>Diamond Gemstone Specs ({product.diamondDetails.carat} Ct):</span>
                  <span className="font-mono">{formatPrice(diamondVal)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-300">
                <span>Making Charges ({product.makingChargesPercentage}%):</span>
                <span className="font-mono">{formatPrice(makingChargesVal)}</span>
              </div>
              <div className="flex justify-between text-stone-300 border-t border-stone-800 pt-2 font-semibold">
                <span>Estimated GST (3%):</span>
                <span className="font-mono">{formatPrice(gstVal)}</span>
              </div>
            </div>

            {/* Key Information Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-200 block">Visit Store for Booking</span>
                  <span className="text-[10px] text-stone-400">Amber Showroom, Rajasthan</span>
                </div>
              </div>
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-200 block">BIS 100% Hallmarked</span>
                  <span className="text-[10px] text-stone-400">Certified Purity Guarantee</span>
                </div>
              </div>
            </div>

            {/* Customer Action Buttons */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-bold py-3.5 rounded-xl hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 text-sm shadow-xl cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Product Enquiry
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="flex-1 bg-stone-900 border border-amber-400 text-amber-300 font-bold py-3.5 rounded-xl hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm shadow-xl cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Contact RK Jewellers
                </button>
              </div>

              <button
                onClick={() => onNavigate('services')}
                className="w-full bg-stone-950 border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-amber-200 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Request Custom CAD Design & Consultation</span>
              </button>
            </div>

          </div>

        </div>

        {/* Detailed Specifications Section */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-serif text-amber-200 font-bold">
            Product Specifications & Craftsmanship Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <span className="text-stone-400">Metal & Purity:</span>
              <span className="font-semibold text-stone-200">{product.metal} ({product.purity})</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <span className="text-stone-400">Approximate Weight:</span>
              <span className="font-semibold text-stone-200">{product.netWeightGrams} Grams</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <span className="text-stone-400">Product Code / SKU:</span>
              <span className="font-mono text-amber-300 font-semibold">{product.sku}</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl">
              <span className="text-stone-400">Hallmark Standard:</span>
              <span className="font-semibold text-stone-200">BIS 916 / 750 Stamped</span>
            </div>
            {(product.specifications || []).map((spec, idx) => (
              <div key={idx} className="flex justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl">
                <span className="text-stone-400">{spec.key}:</span>
                <span className="font-semibold text-stone-200">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-300 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Product Enquiry for {product.name}
            </h3>

            {enquirySent ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-4 rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm">Enquiry Sent Successfully!</p>
                <p className="text-xs text-stone-300">Our Master Artisan team at Amber showroom will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-4">
                <div className="p-3 bg-stone-950 rounded-xl text-xs space-y-1 border border-stone-800">
                  <p className="text-stone-300">Product SKU: <strong className="text-amber-300">{product.sku}</strong></p>
                  <p className="text-stone-300">Purity & Metal: <strong>{product.purity} {product.metal} ({product.netWeightGrams}g)</strong></p>
                  <p className="text-stone-300">Estimated Price: <strong className="text-amber-300">{formatPrice(product.calculatedPrice)}</strong></p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Your Customization Requirements / Questions</label>
                  <textarea
                    rows={4}
                    required
                    value={enquiryNotes}
                    onChange={e => setEnquiryNotes(e.target.value)}
                    placeholder="Describe desired weight, size, stone changes, or preferred visit date..."
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#C5A059] hover:bg-[#b08c48] text-[#10172A] font-bold px-5 py-2 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Submit Product Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
