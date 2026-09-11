import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext.jsx';

export const AdminLoginPage = ({ onSuccess }) => {
  const { adminLogin } = useAdminAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await adminLogin(email || 'admin@rkjewellers.com', password || 'admin123');
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.message || 'Invalid admin credentials or insufficient permission.');
    }
  };

  const handleDemoAdminFill = () => {
    setEmail('admin@rkjewellers.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-[#C5A059] selection:text-slate-950">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#C5A059]/10 border border-[#C5A059]/40 rounded-2xl flex items-center justify-center mx-auto text-[#C5A059] shadow-lg shadow-[#C5A059]/5">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-bold">
              Restricted Executive Portal
            </span>
            <h1 className="text-2xl font-serif font-bold text-slate-100 mt-1">
              RK Jewellers Admin Login
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Authenticate with your administrative JWT credentials to access store analytics, inventory, and orders.
            </p>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@rkjewellers.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-slate-100 focus:border-[#C5A059] focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-slate-100 focus:border-[#C5A059] focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5A059] text-slate-950 font-bold py-3.5 rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl cursor-pointer"
          >
            {loading ? (
              <span>Authenticating Admin...</span>
            ) : (
              <>
                <span>Access Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Fast Fill */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            Demo Environment Master Credentials
          </p>
          <button
            type="button"
            onClick={handleDemoAdminFill}
            className="w-full bg-slate-950 border border-slate-800 hover:border-[#C5A059] text-[#C5A059] text-xs py-2.5 rounded-xl transition-colors font-mono flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Auto-fill Demo Admin (admin@rkjewellers.com)</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="pt-2 text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          🔒 256-bit Encrypted Session • Role Guard Enforced
        </div>

      </div>
    </div>
  );
};
