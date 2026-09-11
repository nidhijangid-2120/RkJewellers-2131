import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter email or mobile number and password.');
        setSubmitting(false);
        return;
      }
      const res = await login(email.trim(), password);
      setSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid login credentials.');
      }
    } else if (mode === 'register') {
      if (!name.trim() || !password) {
        setErrorMsg('Please enter your full name and password.');
        setSubmitting(false);
        return;
      }
      const res = await register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password
      });
      setSubmitting(false);
      if (res.success) {
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md p-2 sm:p-4 flex items-start sm:items-center justify-center animate-in fade-in duration-200 min-h-screen">
      <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-md w-full text-stone-100 shadow-2xl relative p-5 sm:p-6 md:p-8 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-amber-300 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif text-amber-200 font-bold">
            {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Access your real orders, saved wishlist, and bespoke jewellery requests.
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-stone-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${mode === 'login' ? 'text-amber-400 border-amber-400 font-bold' : 'text-stone-400 border-transparent hover:text-stone-200'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${mode === 'register' ? 'text-amber-400 border-amber-400 font-bold' : 'text-stone-400 border-transparent hover:text-stone-200'}`}
          >
            Register
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Full Name *</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  />
                  <UserIcon className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Mobile Number</label>
                <div className="relative">
                  <input 
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              {mode === 'login' ? 'Email / Mobile Number *' : 'Email Address *'}
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={mode === 'login' ? 'client@email.com or phone' : 'client@email.com'}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Password *</label>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-bold py-3 rounded-xl hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg text-xs mt-2 cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Please wait...' : (mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
