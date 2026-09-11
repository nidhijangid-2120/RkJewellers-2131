import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export const AdminPaymentsPage = () => {
  const { formatPrice } = useStore();

  const logs = [
    { id: 'txn-1001', order: 'RK-2026-8891', client: 'Nidhi Sharma', gateway: 'Razorpay UPI', amount: 434660, status: 'Success', date: '2026-08-01 10:14 AM' },
    { id: 'txn-1002', order: 'RK-2026-7712', client: 'Ananya Roy', gateway: 'Stripe Card (HDFC)', amount: 185000, status: 'Success', date: '2026-08-01 09:30 AM' },
    { id: 'txn-1003', order: 'RK-2026-6623', client: 'Vikramaditya S.', gateway: 'Net Banking (ICICI)', amount: 890000, status: 'Success', date: '2026-07-31 04:15 PM' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-900">Payment Audit Logs & Showroom Receipts</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time payment records, advance deposits, showroom receipts, and bank transfers</p>
      </div>

      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View Card List */}
        <div className="block sm:hidden divide-y divide-[#E6DFD5]">
          {logs.map(l => (
            <div key={l.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#701a2b] font-bold text-xs">{l.order}</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> {l.status}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs">{l.client}</p>
                <p className="text-[10px] text-slate-500 font-mono">{l.gateway} • {l.id}</p>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-serif font-bold text-slate-900">{formatPrice(l.amount)}</span>
                <span className="font-mono text-[10px] text-slate-400">{l.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">Txn Ref #</th>
                <th className="p-4">Order Ref #</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-[#FAF7F0]/60">
                  <td className="p-4 font-mono text-slate-500">{l.id}</td>
                  <td className="p-4 font-mono text-[#701a2b] font-bold">{l.order}</td>
                  <td className="p-4 font-semibold text-slate-900">{l.client}</td>
                  <td className="p-4 font-mono text-slate-700">{l.gateway}</td>
                  <td className="p-4 font-serif font-bold text-slate-900">{formatPrice(l.amount)}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{l.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-[10px] text-slate-400">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
