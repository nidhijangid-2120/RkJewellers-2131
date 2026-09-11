import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

export const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(setBlogs).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Heritage Journal & Blogs</h2>
          <p className="text-xs text-slate-500 mt-0.5">Publish articles on hallmarking, polki craftsmanship, and styling guides</p>
        </div>
        <button className="bg-[#701a2b] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:bg-[#831e33] shadow cursor-pointer">
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Write Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(blogs || []).map(b => (
          <div key={b.id} className="bg-white border border-[#E6DFD5] rounded-2xl p-5 flex flex-col sm:flex-row gap-4 shadow-sm">
            <img src={b.image} alt={b.title} className="w-24 h-24 rounded-xl object-cover shrink-0 bg-[#FAF7F0] border border-[#E6DFD5]" />
            <div className="flex-1 space-y-1">
              <span className="text-[10px] text-[#701a2b] font-mono font-bold uppercase">{b.category}</span>
              <h3 className="font-serif font-bold text-slate-900 text-sm line-clamp-1">{b.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>
              <div className="pt-2 flex justify-end gap-2">
                <button className="p-1.5 bg-[#FAF7F0] hover:bg-[#F3EEE3] border border-[#E6DFD5] text-[#701a2b] rounded-lg cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setBlogs(prev => prev.filter(x => x.id !== b.id))} className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg cursor-pointer">
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
