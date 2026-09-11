import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export const SearchModal = ({ isOpen, onClose, onSelectProduct, onNavigate }) => {
  const { products, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.metal.toLowerCase().includes(q) ||
      p.purity.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 6));
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md p-4 sm:p-6 md:p-20 flex flex-col items-center animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-900/60 rounded-2xl p-6 shadow-2xl relative text-stone-100">
        
        {/* Close */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-amber-300 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-serif text-amber-200 font-bold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-400" />
          Search RK Jewellers Catalog
        </h3>

        {/* Input */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search gold necklaces, solitaire rings, 22K polki, jhumkas, SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-stone-950 border border-amber-900/50 rounded-xl px-4 py-3.5 pl-11 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
          />
          <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-4" />
        </div>

        {/* Live Search Suggestions */}
        {query.trim() !== '' ? (
          <div className="space-y-3">
            <h4 className="text-xs uppercase text-amber-400 font-semibold tracking-wider">
              Search Results ({results.length})
            </h4>
            {results.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">
                No jewellery items found matching &quot;{query}&quot;. Try searching for &quot;Gold&quot;, &quot;Diamond&quot;, or &quot;Rings&quot;.
              </p>
            ) : (
              <div className="space-y-2">
                {results.map(prod => (
                  <div 
                    key={prod.id}
                    onClick={() => { onClose(); onSelectProduct(prod); }}
                    className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl hover:border-amber-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-lg border border-amber-900/30" />
                      <div>
                        <p className="text-xs font-semibold text-stone-200">{prod.name}</p>
                        <p className="text-[10px] text-stone-400">{prod.category} • {prod.purity} {prod.metal}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300">
                      {formatPrice(prod.calculatedPrice)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Popular Searches */
          <div className="space-y-4 pt-2">
            <h4 className="text-xs uppercase text-amber-400 font-semibold tracking-wider">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['22K Bridal Set', 'Solitaire Engagement Ring', 'Temple Jhumkas', 'Platinum Couple Bands', 'Emerald Kundan Choker'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-stone-950 border border-stone-800 hover:border-amber-500 rounded-full text-stone-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-amber-400" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
