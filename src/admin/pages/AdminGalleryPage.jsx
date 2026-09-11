import React, { useState, useEffect } from 'react';
import { Image, Plus, Trash2 } from 'lucide-react';

export const AdminGalleryPage = () => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(setGallery).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Lookbook & Editorial Gallery Assets</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage high-resolution royal campaign shoot assets</p>
        </div>
        <button className="bg-[#701a2b] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:bg-[#831e33] shadow cursor-pointer">
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Upload Campaign Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {(gallery || []).map(img => (
          <div key={img.id} className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden group shadow-sm">
            <div className="h-56 relative bg-[#FAF7F0]">
              <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-slate-900 text-sm">{img.title}</p>
                <p className="text-[10px] text-[#701a2b] font-mono font-bold">{img.collection}</p>
              </div>
              <button onClick={() => setGallery(prev => prev.filter(g => g.id !== img.id))} className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
