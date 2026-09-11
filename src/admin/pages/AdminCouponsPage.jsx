import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2 } from 'lucide-react';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch('/api/coupons').then(r => r.json()).then(setCoupons).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Discount Coupons & VIP Offers</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage promotional codes, percentage discounts, and minimum order limits</p>
        </div>
        <button className="bg-[#701a2b] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 hover:bg-[#831e33] shadow cursor-pointer">
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {(coupons || []).map(c => (
                <tr key={c.id} className="hover:bg-[#FAF7F0]/60">
                  <td className="p-4 font-mono font-bold text-[#701a2b] text-sm">{c.code}</td>
                  <td className="p-4 font-bold text-slate-900">{c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</td>
                  <td className="p-4 font-mono text-slate-700">₹{Number(c.minOrderValue || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4 font-mono text-slate-700">{c.expiryDate}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setCoupons(prev => prev.filter(x => x.id !== c.id))} className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer">
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
