import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, Star, Eye, X, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export const ShopPage = ({ onNavigate, onOpenQuickView, initialCategory }) => {
  const { products, categories, formatPrice } = useStore();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [selectedPurity, setSelectedPurity] = useState('all');
  const [priceRange, setPriceRange] = useState(2000000);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...(products || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedCategory || p.category === selectedCategory);
    }

    if (selectedMetal !== 'all') {
      list = list.filter(p => p.metal === selectedMetal);
    }

    if (selectedPurity !== 'all') {
      list = list.filter(p => p.purity === selectedPurity);
    }

    list = list.filter(p => (p.calculatedPrice || 0) <= priceRange);

    if (sortBy === 'price-asc') list.sort((a, b) => (a.calculatedPrice || 0) - (b.calculatedPrice || 0));
    else if (sortBy === 'price-desc') list.sort((a, b) => (b.calculatedPrice || 0) - (a.calculatedPrice || 0));
    else if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return list;
  }, [products, searchQuery, selectedCategory, selectedMetal, selectedPurity, priceRange, sortBy]);

  return (
    <div className="bg-[#FAF8F5] text-[#1A1A1A] min-h-screen pb-16 font-sans">
      
      {/* 1. TOP BANNER OVERLAY MATCHING SCREENSHOT 6 */}
      <section className="relative min-h-[45vh] sm:min-h-[50vh] flex flex-col justify-center items-center text-center px-4 py-12 bg-[#10172A] text-white overflow-hidden mb-8">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600" 
            alt="Jewelry Collection" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10172A] via-[#10172A]/70 to-[#10172A]/30" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Premium Jewelry Collection
          </h1>
          <p className="text-sm sm:text-lg font-light text-white/90 max-w-xl mx-auto">
            Handcrafted pieces that celebrate elegance and tradition
          </p>
          <div className="pt-2">
            <button 
              onClick={() => {
                const el = document.getElementById('collection-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#E5C07B] hover:bg-[#d8b06b] text-[#1A1A1A] font-semibold text-sm px-8 py-3 rounded-full transition-all shadow-md cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      <div id="collection-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title & Catalogue Subtitle */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Exquisite Jewellery Showcase
          </h2>
          <p className="text-xs sm:text-sm text-[#5E503F] font-light">
            Browse our complete jewellery collection with live estimated pricing. Visit RK Jewellers showroom to book custom orders.
          </p>
          <div className="bg-[#FAF0D9] border border-[#E5C07B]/60 text-[#5E503F] text-xs p-3 rounded-2xl max-w-xl mx-auto mt-2 font-medium">
            * Disclaimer: Prices are approximate and may vary according to live market rates, making charges, and stone selection.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-white border border-[#E5E1DA] p-6 rounded-2xl h-fit shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F5F2ED] pb-4">
              <h3 className="text-sm font-serif text-[#1A1A1A] font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" /> Filter Catalogue
              </h3>
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedMetal('all'); setSelectedPurity('all'); setPriceRange(2000000); setSearchQuery(''); }}
                className="text-[11px] text-[#C5A059] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Search Code / Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="SKU, Name, Design..."
                  className="w-full bg-[#FAF8F5] border border-[#E5E1DA] rounded-xl py-2 px-3 pl-9 text-xs text-[#1A1A1A] focus:border-[#C5A059] focus:outline-none"
                />
                <Search className="w-4 h-4 text-[#8A817C] absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Jewellery Category</label>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] rounded-xl px-3 py-2 focus:border-[#C5A059] focus:outline-none font-medium"
              >
                <option value="all">All Categories</option>
                {(categories || []).map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Metal Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Metal / Gemstone</label>
              <select 
                value={selectedMetal} 
                onChange={e => setSelectedMetal(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] rounded-xl px-3 py-2 focus:border-[#C5A059] focus:outline-none font-medium"
              >
                <option value="all">All Metals</option>
                <option value="gold">Yellow Gold</option>
                <option value="diamond">Natural Diamond</option>
                <option value="platinum">Platinum</option>
                <option value="kundan">Kundan / Polki</option>
                <option value="silver">Silver</option>
              </select>
            </div>

            {/* Purity Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Purity Standard</label>
              <select 
                value={selectedPurity} 
                onChange={e => setSelectedPurity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] rounded-xl px-3 py-2 focus:border-[#C5A059] focus:outline-none font-medium"
              >
                <option value="all">All Purities</option>
                <option value="22K">22K (916 BIS Hallmarked)</option>
                <option value="18K">18K (750 Diamond Setting)</option>
                <option value="14K">14K Everyday Wear</option>
                <option value="950 Platinum">950 Platinum</option>
                <option value="925 Silver">925 Silver</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between text-xs text-[#1A1A1A] mb-2 font-medium">
                <span>Max Estimate:</span>
                <span className="font-bold text-[#C5A059]">{formatPrice(priceRange)}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="2000000" 
                step="20000"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
            </div>

          </div>

          {/* Main Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E5E1DA] p-4 rounded-2xl shadow-sm">
              <span className="text-xs text-[#8A817C]">
                Showing <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> catalogue designs
              </span>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMobileFilterOpen(true)} 
                  className="lg:hidden px-3.5 py-2 bg-[#1A1A1A] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" /> Filters
                </button>

                <div className="flex items-center gap-2 text-xs text-[#8A817C]">
                  <span className="hidden sm:inline">Sort By:</span>
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="newest">Newest Designs</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center lg:hidden">
                <div className="bg-white border border-[#E5E1DA] rounded-2xl w-full max-w-md p-6 text-[#1A1A1A] max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-[#F5F2ED] pb-3">
                    <h3 className="text-sm font-serif text-[#1A1A1A] font-bold flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" /> Filter Catalogue
                    </h3>
                    <button 
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1.5 text-[#8A817C] hover:text-[#1A1A1A] bg-[#F5F2ED] rounded-lg cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Search Input */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Search Code / Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="SKU, Name..."
                          className="w-full bg-[#FAF8F5] border border-[#E5E1DA] rounded-xl py-2 px-3 pl-9 text-xs text-[#1A1A1A] focus:border-[#C5A059] focus:outline-none"
                        />
                        <Search className="w-4 h-4 text-[#8A817C] absolute left-3 top-2.5" />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Category</label>
                      <select 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] rounded-xl px-3 py-2 focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="all">All Categories</option>
                        {(categories || []).map(c => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Metal Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Metal / Gemstone</label>
                      <select 
                        value={selectedMetal} 
                        onChange={e => setSelectedMetal(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] rounded-xl px-3 py-2 focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="all">All Metals</option>
                        <option value="gold">Yellow Gold</option>
                        <option value="diamond">Natural Diamond</option>
                        <option value="platinum">Platinum</option>
                        <option value="kundan">Kundan / Polki</option>
                        <option value="silver">Silver</option>
                      </select>
                    </div>

                    {/* Purity Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">Purity Standard</label>
                      <select 
                        value={selectedPurity} 
                        onChange={e => setSelectedPurity(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E5E1DA] text-xs text-[#1A1A1A] rounded-xl px-3 py-2 focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="all">All Purities</option>
                        <option value="22K">22K (916 BIS Hallmarked)</option>
                        <option value="18K">18K (750 Diamond Setting)</option>
                        <option value="14K">14K Everyday Wear</option>
                        <option value="950 Platinum">950 Platinum</option>
                        <option value="925 Silver">925 Silver</option>
                      </select>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <div className="flex justify-between text-xs text-[#1A1A1A] mb-2 font-medium">
                        <span>Max Estimate:</span>
                        <span className="font-bold text-[#C5A059]">{formatPrice(priceRange)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10000" 
                        max="2000000" 
                        step="20000"
                        value={priceRange}
                        onChange={e => setPriceRange(Number(e.target.value))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E1DA] flex gap-3">
                    <button 
                      onClick={() => { setSelectedCategory('all'); setSelectedMetal('all'); setSelectedPurity('all'); setPriceRange(2000000); setSearchQuery(''); }}
                      className="flex-1 py-2.5 bg-[#F5F2ED] border border-[#E5E1DA] text-[#1A1A1A] text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Reset All
                    </button>
                    <button 
                      onClick={() => setMobileFilterOpen(false)}
                      className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid matching screenshot 6 & 7 */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E5E1DA] rounded-2xl p-12 text-center space-y-3">
                <p className="text-[#1A1A1A] font-serif text-lg">No Matching Designs Found</p>
                <p className="text-xs text-[#8A817C]">Try adjusting your search criteria or price slider.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  return (
                    <div 
                      key={product.id}
                      className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-square overflow-hidden bg-[#F5F2ED] rounded-xl mb-4">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => toggleFavorite(product)}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all shadow-md cursor-pointer ${
                              isFavorite(product.id) 
                                ? 'bg-rose-950/80 border-rose-500 text-rose-400' 
                                : 'bg-white/90 border-[#E5E1DA] text-[#1A1A1A] hover:text-rose-500'
                            }`}
                            title={isFavorite(product.id) ? "Remove from Favorites" : "Save Design to Favorites"}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-rose-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => onOpenQuickView(product)}
                            className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full border border-[#E5E1DA] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-xs cursor-pointer"
                            title="Quick View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] bg-[#FAF0D9] text-[#7A5C1E] border border-[#E5C07B]/40 px-2 py-0.5 rounded-md font-semibold uppercase">
                              {product.purity} {product.metal}
                            </span>
                            <span className="text-[10px] text-[#8A817C] font-mono">SKU: {product.sku}</span>
                          </div>
                          <h3 
                            onClick={() => onNavigate('product-detail', { id: product.id })}
                            className="text-base font-bold font-serif text-[#1A1A1A] hover:text-[#C5A059] cursor-pointer line-clamp-1 pt-1"
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#5E503F] font-light line-clamp-2">
                            {product.description || `Exquisite ${product.purity} ${product.metal} design`}
                          </p>
                          <div className="flex justify-between items-baseline pt-1">
                            <p className="text-sm font-bold text-[#1A1A1A] font-serif">
                              {formatPrice(product.calculatedPrice)}
                            </p>
                            <span className="text-[10px] text-[#8A817C]">~{product.netWeightGrams} Grams</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col gap-2">
                        <button
                          onClick={() => onNavigate('product-detail', { id: product.id })}
                          className="w-full bg-[#701a2b] hover:bg-[#831e33] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs text-center cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>View Specs & Showroom Details</span>
                        </button>
                        <span className="text-[10px] text-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 py-1 rounded-lg">
                          🏛️ Ready for Booking at RK Showroom
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* SPECIAL OFFERS SECTION MATCHING SCREENSHOT 8 */}
        <div className="bg-[#F5F1EA] border border-[#E5E1DA] rounded-3xl p-8 sm:p-12 text-center space-y-4 my-12">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Special Offers
          </h2>
          <p className="text-xs sm:text-sm text-[#5E503F] font-light max-w-xl mx-auto">
            Limited time offers on selected jewelry pieces. Don't miss out on these exclusive deals!
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setSelectedCategory('all')}
              className="bg-[#E5C07B] hover:bg-[#d8b06b] text-[#1A1A1A] font-semibold text-sm px-8 py-3 rounded-full transition-all shadow-md cursor-pointer inline-block"
            >
              View All Offers
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
