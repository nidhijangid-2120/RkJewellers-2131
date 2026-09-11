import React, { useState } from 'react';
import { 
  Heart, Search, Filter, Check, MessageSquare, ArrowRight, 
  Building2, Info, Sparkles, Trash2, Phone, Tag, Printer, Share2, Copy
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const FavoritesPage = ({ onNavigate }) => {
  const { favorites, toggleFavorite, sendDesignRequest } = useFavorites();
  const { user } = useAuth();
  const { formatPrice } = useStore();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal state for requesting design / showing to staff
  const [selectedProductForRequest, setSelectedProductForRequest] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract unique categories from favorites
  const categories = ['All', ...Array.from(new Set(favorites.map(f => f.product.category)))];

  // Filter favorites
  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product.metal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.product.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenRequestModal = (product) => {
    setSelectedProductForRequest(product);
    setRequestNotes('');
    setRequestSuccess(false);
  };

  const handleConfirmRequest = async (e) => {
    e.preventDefault();
    if (!selectedProductForRequest) return;

    setIsSubmitting(true);
    const customerInfo = {
      id: user?.id || 'GUEST-CLIENT',
      name: user?.name || 'Valued Client',
      email: user?.email || '',
      phone: user?.phone || ''
    };

    await sendDesignRequest(selectedProductForRequest, customerInfo, requestNotes);
    setIsSubmitting(false);
    setRequestSuccess(true);

    setTimeout(() => {
      setSelectedProductForRequest(null);
      setRequestSuccess(false);
    }, 3000);
  };

  const handlePrintShortlist = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const itemsList = favorites.map((f, i) => `${i + 1}. ${f.product.name} (Code: ${f.product.sku}) - ${f.product.purity} ${f.product.metal}`).join('%0A');
    const text = `Namaste! Here is my shortlisted jewellery design collection from RK Jewellers:%0A%0A${itemsList}%0A%0AI would like to view these pieces during my visit to RK Jewellers showroom.`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-8 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:py-2">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Page Header Banner */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-[#E6DFD5] print:border-none print:shadow-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FAF7F0] text-[#701a2b] border border-[#E6DFD5] text-xs px-3 py-1 rounded-full font-mono uppercase font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#701a2b]" />
                  {t('shortlisted_designs')}
                </span>
                <span className="text-xs text-slate-500 font-bold">({favorites.length} Saved)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
                {t('favorites')} & Showroom Shortlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-light">
                Save your favorite jewellery designs online to present to our sales staff and artisans when visiting RK Jewellers showroom in Shahpura, Jaipur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <button
                onClick={handlePrintShortlist}
                className="bg-[#FAF7F0] hover:bg-[#F3EEE3] text-slate-800 border border-[#E6DFD5] font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Print shortlist for showroom visit"
              >
                <Printer className="w-4 h-4 text-[#701a2b]" />
                <span>Print Shortlist</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                title="Share via WhatsApp"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="bg-[#FAF7F0] hover:bg-[#F3EEE3] text-slate-800 border border-[#E6DFD5] font-bold px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#701a2b]" />
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#701a2b] hover:bg-[#831e33] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow cursor-pointer"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DFD5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:border-[#701a2b] focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#701a2b] text-white font-bold shadow-xs' 
                    : 'bg-[#FAF7F0] text-slate-700 hover:bg-[#F3EEE3] border border-[#E6DFD5]'
                }`}
              >
                {cat === 'All' ? t('all_categories') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites List / Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6DFD5] max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Heart className="w-8 h-8 fill-rose-500" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              {t('no_favorites')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('no_favorites_desc')}
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="bg-[#701a2b] hover:bg-[#831e33] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
            >
              Explore Complete Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map(({ product, addedAt }) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-[#E6DFD5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-square bg-[#FAF7F0] overflow-hidden border-b border-[#E6DFD5]">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />

                    {/* Saved for Showroom Visit Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-[#E6DFD5] text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('saved_for_showroom')}</span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => toggleFavorite(product)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors shadow-sm cursor-pointer print:hidden"
                      title={t('remove_favorite')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Metal & Purity tag bottom right */}
                    <span className="absolute bottom-3 right-3 bg-[#701a2b] text-amber-100 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-amber-300/30 shadow-sm">
                      {product.purity} {product.metal}
                    </span>
                  </div>

                  {/* Details Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#701a2b] block">
                          {product.category}
                        </span>
                        <h3 
                          onClick={() => onNavigate('product-detail', { id: product.id })}
                          className="font-serif font-bold text-base text-slate-900 hover:text-[#701a2b] cursor-pointer line-clamp-1 mt-0.5"
                        >
                          {product.name}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 font-bold">
                        Code: {product.sku}
                      </span>
                    </div>

                    {/* Specs summary table */}
                    <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E6DFD5] text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>{t('approx_weight')}:</span>
                        <strong className="text-slate-900 font-mono">{product.netWeightGrams} Grams</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>{t('metal_purity')}:</span>
                        <strong className="text-slate-900 font-mono">{product.purity} {product.metal}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 pt-1 border-t border-[#E6DFD5]">
                        <span>{t('estimated_price')}:</span>
                        <strong className="text-[#701a2b] text-sm font-bold font-mono">{formatPrice(product.calculatedPrice)}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Saved: {addedAt}</span>
                      <span className="text-emerald-700 font-bold">BIS 916 Hallmarked</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-5 pt-0 space-y-2 print:hidden">
                  <button
                    onClick={() => handleOpenRequestModal(product)}
                    className="w-full bg-[#701a2b] hover:bg-[#831e33] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-amber-200" />
                    <span>Show to Staff at Showroom</span>
                  </button>

                  <button
                    onClick={() => onNavigate('product-detail', { id: product.id })}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-900 font-medium py-1 cursor-pointer"
                  >
                    {t('view_details')}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Request Design / Show to Staff Modal */}
      {selectedProductForRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E6DFD5] max-w-lg w-full p-6 text-slate-900 shadow-xl relative space-y-4">
            <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2 border-b border-[#E6DFD5] pb-3">
              <Building2 className="w-5 h-5 text-[#701a2b]" />
              Showroom Design Shortlist Request
            </h3>

            {requestSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-serif font-bold text-base">Shortlist Notified to Showroom Staff</p>
                <p className="text-xs text-emerald-700">RK Jewellers staff will keep this piece ready for your visit!</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRequest} className="space-y-4">
                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E6DFD5] text-xs space-y-1.5">
                  <p className="font-bold text-slate-900 text-sm">{selectedProductForRequest.name}</p>
                  <p className="text-slate-600">
                    {t('product_code')}: <strong className="text-[#701a2b]">{selectedProductForRequest.sku}</strong> | {selectedProductForRequest.purity} {selectedProductForRequest.metal} ({selectedProductForRequest.netWeightGrams}g)
                  </p>
                  <p className="text-slate-600">
                    {t('estimated_price')}: <strong className="text-slate-900 font-mono">{formatPrice(selectedProductForRequest.calculatedPrice)}</strong>
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px] leading-relaxed">
                  Note: This saves your design shortlist for offline showroom viewing. Show this screen or your phone number to RK Jewellers staff upon arrival.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Special Customization Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={requestNotes}
                    onChange={e => setRequestNotes(e.target.value)}
                    placeholder="e.g., Requesting size 14 adjustment or visiting showroom this Saturday..."
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl p-3 text-xs text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForRequest(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#701a2b] hover:bg-[#831e33] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Notifying Staff...' : 'Confirm Showroom Visit Shortlist'}
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
