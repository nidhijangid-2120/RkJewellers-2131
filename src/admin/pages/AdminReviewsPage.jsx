import React, { useState, useEffect } from 'react';
import { Star, Check, Trash2, MessageSquare } from 'lucide-react';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(setReviews).catch(console.error);
  }, []);

  const handleApprove = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-900">Customer Reviews & Ratings Moderation</h2>
        <p className="text-xs text-slate-500 mt-0.5">Approve, reject, or manage buyer feedback across the catalogue</p>
      </div>

      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">Piece</th>
                <th className="p-4">Client</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Content</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {reviews.map(r => (
                <tr key={r.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{r.productName || 'Jewellery Item'}</td>
                  <td className="p-4 text-slate-800">{r.userName}</td>
                  <td className="p-4 text-amber-600 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{r.rating}.0</span>
                  </td>
                  <td className="p-4 max-w-sm">
                    <p className="font-bold text-slate-900">{r.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                      r.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {r.status || 'Approved'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {r.status !== 'approved' && (
                      <button onClick={() => handleApprove(r.id)} className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 cursor-pointer">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(r.id)} className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
