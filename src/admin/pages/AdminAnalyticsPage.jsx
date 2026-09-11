import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight, Calendar, Download } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export const AdminAnalyticsPage = () => {
  const { formatPrice } = useStore();
  const [data, setData] = useState(null);
  const [reportRange, setReportRange] = useState('monthly');

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setData).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            Financial & Order Book Analytics
            <span className="bg-[#701a2b]/10 text-[#701a2b] text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-[#701a2b]/20 font-bold">
              ERP Reports
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit of sales revenue, advance deposits collected, and outstanding client balances.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F0] p-1 rounded-xl border border-[#E6DFD5]">
          <button
            onClick={() => setReportRange('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${reportRange === 'daily' ? 'bg-[#701a2b] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setReportRange('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${reportRange === 'weekly' ? 'bg-[#701a2b] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setReportRange('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${reportRange === 'monthly' ? 'bg-[#701a2b] text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E6DFD5] p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-mono">Gross Sales ({reportRange})</p>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            {formatPrice(reportRange === 'daily' ? 434660 : reportRange === 'weekly' ? 1280000 : (data?.totalSales || 3540000))}
          </h3>
          <p className="text-emerald-700 text-xs font-mono font-bold mt-1 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs prev period</p>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-mono">Advance Deposits Collected</p>
          <h3 className="text-2xl font-serif font-bold text-emerald-700 mt-1">{formatPrice(488400)}</h3>
          <p className="text-slate-500 text-xs font-mono mt-1">Secured in Showroom Account</p>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-mono">Outstanding Dues</p>
          <h3 className="text-2xl font-serif font-bold text-[#701a2b] mt-1">{formatPrice(234660)}</h3>
          <p className="text-slate-500 text-xs font-mono mt-1">Due on Delivery Pickup</p>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-5 rounded-2xl shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-mono">Average Order Value (AOV)</p>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">{formatPrice(361530)}</h3>
          <p className="text-slate-500 text-xs font-mono mt-1">Bridal & Solitaire Trunks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-slate-900 text-base">Category Sales Volume Breakdown</h3>
          <div className="space-y-3 text-xs">
            {[
              { cat: 'Bridal Polki & Kundan Trunks', pct: 45 },
              { cat: 'Diamond Solitaire Rings', pct: 28 },
              { cat: 'Temple & Heritage Chokers', pct: 17 },
              { cat: 'Antique Gold Kadas & Bangles', pct: 10 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-800">{item.cat}</span>
                  <span className="text-[#701a2b] font-bold">{item.pct}%</span>
                </div>
                <div className="w-full bg-[#FAF7F0] h-2 rounded-full overflow-hidden border border-[#E6DFD5]">
                  <div style={{ width: `${item.pct}%` }} className="bg-[#701a2b] h-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-slate-900 text-base">Payment Method Metrics</h3>
          <div className="space-y-3 text-xs">
            {[
              { mode: 'UPI & NetBanking (Instant)', share: '52%', amount: '₹1,840,800' },
              { mode: 'Card Payments (POS / Online)', share: '33%', amount: '₹1,168,200' },
              { mode: 'Boutique Store Cash & Cheque', share: '15%', amount: '₹531,000' }
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DFD5]">
                <div>
                  <p className="font-bold text-slate-900">{m.mode}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Share: {m.share}</p>
                </div>
                <span className="font-mono font-bold text-[#701a2b] text-sm">{m.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
