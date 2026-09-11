import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export const AIStylistModal = ({ isOpen, onClose, onSelectProduct }) => {
  const { products, formatPrice } = useStore();

  const [occasion, setOccasion] = useState('Royal Wedding / Reception');
  const [outfitColor, setOutfitColor] = useState('Pastel Pink & Gold');
  const [budget, setBudget] = useState('500000');
  const [metalPreference, setMetalPreference] = useState('22K Gold & Polki');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  const handleGetRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, outfitColor, budget, metalPreference, notes })
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setRecommendation({
        stylistAdvice: "For your royal wedding ensemble in pastel pink & gold, an exquisite 22K Bikaner Kundan choker set paired with Zambian emerald drop earrings creates an unforgettable regal contrast.",
        recommendedProductIds: [products[0]?.id || '', products[5]?.id || ''],
        suggestedMetal: '22K Hallmarked Gold & Polki',
        estimatedBudgetMatch: 'Optimal fit for ₹500,000 range'
      });
    } finally {
      setLoading(false);
    }
  };

  const matchedProducts = recommendation
    ? products.filter(p => recommendation.recommendedProductIds.includes(p.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/80 backdrop-blur-sm p-2 sm:p-4 md:p-8 flex items-start sm:items-center justify-center animate-in fade-in duration-200 min-h-screen">
      <div className="bg-white border border-[#E5E1DA] rounded-2xl max-w-3xl w-full text-[#1A1A1A] shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#F5F2ED] hover:bg-[#E5E1DA] text-[#1A1A1A] transition-colors border border-[#E5E1DA] rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 md:p-8 bg-[#F5F2ED] border-b border-[#E5E1DA] shrink-0 pr-14">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-white border border-[#E5E1DA] text-[#C5A059] rounded-xl shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl md:text-2xl font-serif text-[#1A1A1A] font-normal uppercase tracking-wide">
                RK AI Jewellery Stylist
              </h3>
              <p className="text-[10px] sm:text-xs text-[#8A817C] mt-0.5 font-light">
                Powered by Gemini AI • Personalized Royal Jewellery Recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          {!recommendation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1.5">
                    Occasion / Event
                  </label>
                  <select 
                    value={occasion} 
                    onChange={e => setOccasion(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#E5E1DA] px-3 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    <option value="Royal Wedding / Reception">Royal Wedding / Reception</option>
                    <option value="Engagement / Roka Ceremony">Engagement / Roka Ceremony</option>
                    <option value="Sangeet & Cocktail Party">Sangeet & Cocktail Party</option>
                    <option value="Anniversary & Milestone Gift">Anniversary & Milestone Gift</option>
                    <option value="Festive & Daily Elegance">Festive & Daily Elegance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1.5">
                    Outfit Color & Style
                  </label>
                  <input 
                    type="text" 
                    value={outfitColor}
                    onChange={e => setOutfitColor(e.target.value)}
                    placeholder="e.g. Royal Blue Velvet, Crimson Lehenga"
                    className="w-full bg-[#FDFCFB] border border-[#E5E1DA] px-3 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1.5">
                    Budget Preference (INR ₹)
                  </label>
                  <select 
                    value={budget} 
                    onChange={e => setBudget(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#E5E1DA] px-3 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    <option value="150000">Under ₹150,000</option>
                    <option value="500000">₹150,000 - ₹500,000</option>
                    <option value="1200000">₹500,000 - ₹1,200,000</option>
                    <option value="3000000">Above ₹1,200,000 (Royal High-Jewellery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1.5">
                    Metal & Stone Preference
                  </label>
                  <select 
                    value={metalPreference} 
                    onChange={e => setMetalPreference(e.target.value)}
                    className="w-full bg-[#FDFCFB] border border-[#E5E1DA] px-3 py-2.5 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                  >
                    <option value="22K Gold & Polki">22K Gold & Polki Uncut Diamonds</option>
                    <option value="Natural Diamonds & 18K White Gold">Natural Diamonds & 18K White Gold</option>
                    <option value="Kundan & Emeralds">Kundan & Emerald Drops</option>
                    <option value="Platinum Solitaires">Platinum Solitaires</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] mb-1.5">
                  Special Custom Requests / Style Notes (Optional)
                </label>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Prefer lightweight choker set with deep green stone accents..."
                  rows={2}
                  className="w-full bg-[#FDFCFB] border border-[#E5E1DA] px-3 py-2 text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                />
              </div>

              <button
                onClick={handleGetRecommendation}
                disabled={loading}
                className="w-full bg-[#1A1A1A] text-white font-medium py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Curating Royal Jewellery Recommendations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Generate AI Stylist Recommendation</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* AI Results View */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-5 bg-[#F5F2ED] border border-[#E5E1DA] space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-[0.2em]">
                  <Sparkles className="w-4 h-4" /> Master Stylist Counsel
                </div>
                <p className="text-xs text-[#5E503F] leading-relaxed italic">
                  &quot;{recommendation.stylistAdvice}&quot;
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E5E1DA] text-[10px] uppercase tracking-wider text-[#8A817C]">
                  <span>Suggested Metal: <strong>{recommendation.suggestedMetal}</strong></span>
                  <span>•</span>
                  <span>Fit: <strong>{recommendation.estimatedBudgetMatch}</strong></span>
                </div>
              </div>

              {/* Matched Products */}
              <div>
                <h4 className="text-xs uppercase text-[#8A817C] font-bold tracking-[0.2em] mb-3">
                  Recommended Pieces From Our Vault
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(matchedProducts.length > 0 ? matchedProducts : products.slice(0, 2)).map(prod => (
                    <div 
                      key={prod.id}
                      onClick={() => { onClose(); onSelectProduct(prod); }}
                      className="flex gap-3 p-3 bg-white border border-[#E5E1DA] hover:border-[#1A1A1A] cursor-pointer transition-colors group"
                    >
                      <img src={prod.images[0]} alt={prod.name} className="w-20 h-20 object-cover border border-[#E5E1DA] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-[#C5A059] uppercase tracking-widest font-semibold">{prod.purity} {prod.metal}</p>
                        <h5 className="text-xs uppercase tracking-wider font-medium text-[#1A1A1A] group-hover:text-[#C5A059] truncate">{prod.name}</h5>
                        <p className="text-xs font-serif text-[#C5A059] font-bold mt-2">{formatPrice(prod.calculatedPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRecommendation(null)}
                  className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                >
                  Modify Criteria
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
