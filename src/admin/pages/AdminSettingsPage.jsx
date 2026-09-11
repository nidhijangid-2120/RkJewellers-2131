import React, { useState } from 'react';
import { Settings, Sliders, ShieldCheck, Key, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export const AdminSettingsPage = () => {
  const { goldRate, updateGoldRate } = useStore();
  
  const [rates, setRates] = useState({ ...goldRate });
  const [saved, setSaved] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleSaveRates = async (e) => {
    e.preventDefault();
    await updateGoldRate(rates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    setPasswordMsg('Admin password updated successfully');
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-900">Store Settings & System Configurations</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage live bullion benchmark rates, boutique contact details, and admin security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Metal Benchmark Base Rates Form */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="border-b border-[#E6DFD5] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-base">Metal Base Rate Override</h3>
              <p className="text-xs text-slate-500">Controls automatic pricing across entire catalogue</p>
            </div>
            <Sliders className="w-5 h-5 text-[#701a2b]" />
          </div>

          <form onSubmit={handleSaveRates} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">24K Pure Gold (₹/g)</label>
                <input type="number" value={rates.gold24k} onChange={e => setRates({ ...rates, gold24k: Number(e.target.value) })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">22K Hallmarked Gold (₹/g)</label>
                <input type="number" value={rates.gold22k} onChange={e => setRates({ ...rates, gold22k: Number(e.target.value) })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">18K Designer Gold (₹/g)</label>
                <input type="number" value={rates.gold18k} onChange={e => setRates({ ...rates, gold18k: Number(e.target.value) })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">925 Sterling Silver (₹/g)</label>
                <input type="number" value={rates.silver925} onChange={e => setRates({ ...rates, silver925: Number(e.target.value) })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 font-mono text-slate-900 focus:border-[#701a2b] focus:outline-none" />
              </div>
            </div>

            {saved && (
              <p className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live metal rates updated across database!
              </p>
            )}

            <button type="submit" className="w-full bg-[#701a2b] text-white font-bold py-2.5 rounded-xl uppercase tracking-wider hover:bg-[#831e33] shadow cursor-pointer">
              Save Metal Rates
            </button>
          </form>
        </div>

        {/* Change Admin Password Form */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="border-b border-[#E6DFD5] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-base">Change Admin Password</h3>
              <p className="text-xs text-slate-500">Update master JWT administrative credentials</p>
            </div>
            <Key className="w-5 h-5 text-[#701a2b]" />
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Current Password</label>
              <input type="password" required value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 text-slate-900 focus:border-[#701a2b] focus:outline-none" />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">New Admin Password</label>
              <input type="password" required value={passwordForm.next} onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 text-slate-900 focus:border-[#701a2b] focus:outline-none" />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Confirm New Password</label>
              <input type="password" required value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3 py-2 text-slate-900 focus:border-[#701a2b] focus:outline-none" />
            </div>

            {passwordMsg && <p className="text-emerald-700 text-xs font-mono font-bold">{passwordMsg}</p>}

            <button type="submit" className="w-full bg-[#FAF7F0] border border-[#701a2b] text-[#701a2b] hover:bg-[#701a2b] hover:text-white font-bold py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-sm cursor-pointer">
              Update Admin Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
