import React, { useState } from 'react';
import { CalendarCheck, Phone, Mail, CheckCircle2, Clock } from 'lucide-react';

export const AdminServicesPage = () => {
  const [requests, setRequests] = useState([
    { id: 'req-1', name: 'Ananya Roy', email: 'ananya@gmail.com', phone: '+91 9988112233', service: 'Bespoke Bridal Design Consultation', date: '2026-08-05', status: 'Pending' },
    { id: 'req-2', name: 'Rahul Malhotra', email: 'rahul.m@gmail.com', phone: '+91 9811223344', service: 'Digital Gold Rate Lock Deposit', date: '2026-08-02', status: 'Confirmed' }
  ]);

  const handleConfirm = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Confirmed' } : r));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-900">Bespoke Consultations & Rate-Lock Enquiries</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage master jeweller appointment bookings and gold rate locks</p>
      </div>

      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Service Requested</th>
                <th className="p-4">Requested Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-[#FAF7F0]/60">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{r.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{r.email} • {r.phone}</p>
                  </td>
                  <td className="p-4 font-medium text-[#701a2b] font-bold">{r.service}</td>
                  <td className="p-4 font-mono text-slate-700">{r.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                      r.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.status !== 'Confirmed' && (
                      <button onClick={() => handleConfirm(r.id)} className="px-3 py-1.5 bg-[#701a2b] text-white font-bold rounded-lg uppercase tracking-wider text-[10px] hover:bg-[#831e33] shadow cursor-pointer">
                        Approve Appointment
                      </button>
                    )}
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
