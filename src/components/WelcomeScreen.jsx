import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, Phone, MapPin, Clock, Globe, 
  Sparkles, Lock, Mail, User as UserIcon, LogIn, UserPlus, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useStore } from '../context/StoreContext.jsx';

export const WelcomeScreen = ({ 
  onLoginSuccess
}) => {
  const { login, register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { goldRate, formatPrice } = useStore();

  const [authMode, setAuthMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your Email or Mobile Number and Password.');
      return;
    }

    setSubmitting(true);
    const res = await login(identifier.trim(), password);
    setSubmitting(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your Full Name.');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMsg('Please enter a Mobile Number or Email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const res = await register({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Registration successful! Redirecting...');
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-slate-900 flex flex-col justify-between font-sans relative overflow-hidden selection:bg-[#701a2b] selection:text-white">
      
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#701a2b]/95 via-slate-900/90 to-slate-950 z-0" />

      {/* Top Bar: Language Selector & Live Rate Bar */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3 text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Live Gold Benchmark */}
          <div className="flex items-center gap-2 font-mono text-amber-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-300">BIS 916 Live:</span>
            <span>22K Gold: <strong className="text-white font-bold">{formatPrice(goldRate?.gold22k || 6830)}/g</strong></span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-xs font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              Language:
            </span>
            <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/20">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-[#C5A059] text-slate-900 shadow' : 'text-slate-300 hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'hi' ? 'bg-[#C5A059] text-slate-900 shadow' : 'text-slate-300 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Side: Brand Heritage Showcase */}
        <div className="flex-1 text-center lg:text-left space-y-6 text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Legacy of Royal Craftsmanship Since 1978</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight">
            RK JEWELLERS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-normal">
              Jaipur Royal Heritage
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {language === 'hi'
              ? 'शुद्ध 22K हॉलमार्क सोना, प्रामाणिक कुंदन-पोल्की और प्रमाणित सॉलिटेयर का भव्य संग्रह। अपने व्यक्तिगत आर्डर देखने और विशेष डिजाइनों के लिए लॉगिन करें।'
              : 'Authentic 22K Hallmarked Gold, handcrafted Kundan-Polki bridal heritage, and certified diamond solitaires. Sign in to view your bespoke orders, timelines, and bills.'}
          </p>

          {/* Trust Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <ShieldCheck className="w-5 h-5 text-amber-400 mb-1" />
              <div className="text-xs font-bold text-white">100% BIS 916</div>
              <div className="text-[10px] text-slate-300">Govt. Hallmarked</div>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Clock className="w-5 h-5 text-amber-400 mb-1" />
              <div className="text-xs font-bold text-white">Live Tracking</div>
              <div className="text-[10px] text-slate-300">Atelier Stages</div>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <Phone className="w-5 h-5 text-amber-400 mb-1" />
              <div className="text-xs font-bold text-white">Master Artisan</div>
              <div className="text-[10px] text-slate-300">Bespoke Design</div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Box */}
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-100 space-y-6">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {authMode === 'login' 
                ? (language === 'hi' ? 'ग्राहक लॉगिन' : 'Customer Portal Login')
                : (language === 'hi' ? 'नया खाता बनाएं' : 'Create Customer Account')}
            </h2>
            <p className="text-xs text-slate-500">
              {authMode === 'login'
                ? (language === 'hi' ? 'अपने ऑर्डर और बिल देखने के लिए लॉगिन करें' : 'Sign in to access your orders, bills & custom designs')
                : (language === 'hi' ? 'रजिस्टर करके विशेष आभूषण सेवाएँ प्राप्त करें' : 'Register to unlock bespoke jewellery orders')}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${authMode === 'login' ? 'bg-white text-[#701a2b] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {language === 'hi' ? 'लॉग इन' : 'Login'}
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${authMode === 'register' ? 'bg-white text-[#701a2b] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {language === 'hi' ? 'रजिस्टर' : 'Register'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email / Mobile Number'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="client@email.com or +91 9823011223"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#701a2b] to-[#912338] hover:from-[#591422] hover:to-[#701a2b] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{language === 'hi' ? 'लॉग इन करें' : 'Login to Dashboard'}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@mail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Confirm *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-[#701a2b] to-[#912338] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Bottom Store Address Footnote */}
      <div className="relative z-10 bg-black/40 border-t border-white/10 py-3 px-4 text-center text-xs text-slate-400">
        <span>Showroom: Johari Bazar, Jaipur, Rajasthan 302003 | Helpline: +91 141 257 8899 | Mon-Sat: 10:30 AM - 8:30 PM</span>
      </div>

    </div>
  );
};
