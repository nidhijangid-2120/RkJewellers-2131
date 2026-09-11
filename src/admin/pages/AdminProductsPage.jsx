import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Eye, ShieldCheck, 
  Sparkles, SlidersHorizontal, Check, X, Image as ImageIcon, AlertCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export const AdminProductsPage = () => {
  const { formatPrice } = useStore();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [metalFilter, setMetalFilter] = useState('');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Necklaces & Chokers',
    collection: 'Royal Heritage',
    metal: 'gold',
    purity: '22K',
    netWeightGrams: 10,
    grossWeightGrams: 11,
    makingChargesPercentage: 12,
    originalPrice: 120000,
    calculatedPrice: 120000,
    discountPercentage: 0,
    stock: 5,
    description: '',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'],
    isFeatured: true,
    isNewArrival: true,
    gender: 'women',
    occasion: ['Wedding', 'Festive']
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      sku: `RK-JW-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'Necklaces & Chokers',
      collection: 'Royal Heritage',
      metal: 'gold',
      purity: '22K',
      netWeightGrams: 12,
      grossWeightGrams: 13,
      makingChargesPercentage: 12,
      originalPrice: 150000,
      calculatedPrice: 150000,
      discountPercentage: 0,
      stock: 5,
      description: 'Handcrafted master jewel set with certified pure gold and uncut polki gemstones.',
      images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'],
      isFeatured: true,
      isNewArrival: true,
      gender: 'women',
      occasion: ['Wedding']
    });
    setEditingProduct(null);
    setAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setAddModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product from the vault?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProduct) {
        // Edit product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        }
      } else {
        // Add new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const newProd = await res.json();
          setProducts(prev => [newProd, ...prev]);
        }
      }
      setAddModalOpen(false);
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
                          (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? (p.category || '').toLowerCase().includes(categoryFilter.toLowerCase()) : true;
    const matchesMetal = metalFilter ? (p.metal || '').toLowerCase() === metalFilter.toLowerCase() : true;
    return matchesSearch && matchesCategory && matchesMetal;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Products & Vault Inventory Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage 22K/18K gold purity weights, making charges, stock counts, and GIA certificates.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#701a2b] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#831e33] transition-all flex items-center gap-2 shadow cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Add New Jewellery Item</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-72">
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search SKU or Product Name..."
            className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-[#701a2b] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F0] border border-[#E6DFD5] text-slate-800 text-xs rounded-xl px-3 py-2 focus:border-[#701a2b] focus:outline-none font-medium"
          >
            <option value="">All Categories</option>
            <option value="Necklaces">Necklaces & Chokers</option>
            <option value="Rings">Rings & Solitaires</option>
            <option value="Earrings">Earrings & Jhumkas</option>
            <option value="Bangles">Bangles & Kadas</option>
            <option value="Mangalsutras">Mangalsutras</option>
          </select>

          <select
            value={metalFilter}
            onChange={e => setMetalFilter(e.target.value)}
            className="bg-[#FAF7F0] border border-[#E6DFD5] text-slate-800 text-xs rounded-xl px-3 py-2 focus:border-[#701a2b] focus:outline-none font-medium"
          >
            <option value="">All Metals</option>
            <option value="gold">Gold (22K / 18K)</option>
            <option value="diamond">Solitaire Diamond</option>
            <option value="polki">Polki / Kundan</option>
          </select>
        </div>
      </div>

      {/* Products Directory Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View Card List */}
        <div className="block lg:hidden divide-y divide-[#E6DFD5]">
          {filteredProducts.map(p => (
            <div key={p.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'} 
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#E6DFD5] bg-[#FAF7F0] shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif font-bold text-slate-900 text-sm truncate">{p.name}</p>
                    <span className="font-mono text-[#701a2b] font-bold text-xs shrink-0">{p.sku}</span>
                  </div>
                  <p className="text-[11px] text-[#701a2b] font-mono">{p.purity} {p.metal} • {p.category}</p>
                  <p className="text-xs font-serif font-bold text-slate-900 mt-1">{formatPrice(p.calculatedPrice)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E6DFD5]">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
                  p.stock > 3 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                }`}>
                  {p.stock > 0 ? `${p.stock} in Vault` : 'Out of Stock'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="px-3 py-1 bg-[#FAF7F0] hover:bg-[#F3EEE3] text-slate-800 rounded-lg border border-[#E6DFD5] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#701a2b]" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">Piece</th>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Category & Metal</th>
                <th className="p-4">Weights</th>
                <th className="p-4">Price</th>
                <th className="p-4">Vault Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'} 
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E6DFD5] bg-[#FAF7F0]" 
                      />
                      <div>
                        <p className="font-serif font-bold text-slate-900 text-sm">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{p.collection || 'Royal Heritage'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[#701a2b] font-bold">{p.sku}</td>
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{p.category}</p>
                    <p className="text-[10px] text-[#701a2b] uppercase font-mono">{p.purity} {p.metal}</p>
                  </td>
                  <td className="p-4 font-mono text-slate-500">
                    <p>Net: {p.netWeightGrams}g</p>
                    <p className="text-[10px] text-slate-400">Gross: {p.grossWeightGrams}g</p>
                  </td>
                  <td className="p-4 font-serif font-bold text-slate-900">
                    {formatPrice(p.calculatedPrice)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase border ${
                      p.stock > 3 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                    }`}>
                      {p.stock > 0 ? `${p.stock} in Vault` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2 bg-[#FAF7F0] hover:bg-[#F3EEE3] text-slate-800 rounded-lg border border-[#E6DFD5] transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#701a2b]" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-white border border-[#E6DFD5] rounded-2xl max-w-2xl w-full p-6 text-slate-900 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingProduct ? 'Edit Jewellery Piece' : 'Add New Vault Jewellery Piece'}
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Product Title</label>
                  <input 
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Polki Choker Necklace"
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">SKU / Product Code</label>
                  <input 
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="RK-NK-101"
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={formData.category || 'Necklaces & Chokers'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  >
                    <option value="Necklaces & Chokers">Necklaces & Chokers</option>
                    <option value="Rings & Solitaires">Rings & Solitaires</option>
                    <option value="Earrings & Jhumkas">Earrings & Jhumkas</option>
                    <option value="Bangles & Kadas">Bangles & Kadas</option>
                    <option value="Mangalsutras">Mangalsutras</option>
                    <option value="Bridal Collection">Bridal Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Purity & Metal</label>
                  <select
                    value={formData.purity || '22K'}
                    onChange={e => setFormData({ ...formData, purity: e.target.value })}
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  >
                    <option value="22K">22K BIS Hallmarked Gold</option>
                    <option value="18K">18K Certified Gold</option>
                    <option value="14K">14K Designer Gold</option>
                    <option value="925 Silver">925 Sterling Silver</option>
                    <option value="Platinum 950">Platinum 950</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Net Gold Weight (Grams)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.netWeightGrams || 10}
                    onChange={e => setFormData({ ...formData, netWeightGrams: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Calculated Retail Price (₹)</label>
                  <input 
                    type="number"
                    required
                    value={formData.calculatedPrice || 120000}
                    onChange={e => setFormData({ ...formData, calculatedPrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Vault Inventory Stock</label>
                  <input 
                    type="number"
                    required
                    value={formData.stock || 5}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Primary Image URL</label>
                  <input 
                    type="url"
                    required
                    value={formData.images ? formData.images[0] : ''}
                    onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                    className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Product Description</label>
                <textarea 
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl p-3 text-slate-900 focus:border-[#701a2b] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E6DFD5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF7F0] border border-[#E6DFD5] text-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#701a2b] text-white font-bold rounded-xl uppercase tracking-wider hover:bg-[#831e33] shadow cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Product to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
