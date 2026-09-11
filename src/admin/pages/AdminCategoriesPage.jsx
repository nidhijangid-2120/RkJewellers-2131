import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, Edit, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Category & Vault Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Organize high-jewellery collections, Polki trunks, and solitaire classifications</p>
        </div>
        <button className="bg-[#701a2b] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#831e33] transition-all flex items-center gap-2 shrink-0 shadow cursor-pointer">
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(categories || []).map(cat => (
          <div key={cat.id} className="bg-white border border-[#E6DFD5] rounded-2xl p-5 space-y-3 relative overflow-hidden group shadow-sm">
            <div className="h-32 w-full bg-[#FAF7F0] rounded-xl overflow-hidden relative border border-[#E6DFD5]">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#701a2b] font-bold">{cat.subCategoriesCount} Subcategories</span>
              <h3 className="text-lg font-serif font-bold text-slate-900">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-[#E6DFD5] flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-mono text-[10px] uppercase font-bold">Active on Catalogue</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 bg-[#FAF7F0] border border-[#E6DFD5] rounded-lg text-[#701a2b] hover:bg-[#F3EEE3] cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 hover:bg-rose-100 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
