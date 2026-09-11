import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Mail, Phone, User as UserIcon, 
  ArrowRight, Globe, AlertCircle, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const LoginPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('Please enter your Email / Mobile Number and Password.');
      return;
    }

    setLoading(true);
    const res = await login(loginIdentifier.trim(), loginPassword);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }
    if (!regMobile.trim() && !regEmail.trim()) {
      setErrorMsg('Please provide either a Mobile Number or an Email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: regName.trim(),
      phone: regMobile.trim(),
      email: regEmail.trim(),
      password: regPassword,
      address: regAddress.trim()
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Welcome to RK Jewellers.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setErrorMsg(res.message || 'Registration could not be completed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-between font-sans selection:bg-[#701a2b] selection:text-white relative">
      
      {/* Background Decorative Pattern & Rich Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#701a2b] via-[#4a101d] to-[#1c050b] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/60 pointer-events-none z-0" />

      {/* Top Header: Language Switcher */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-serif font-bold text-lg shadow-md border border-amber-200/40">
            RK
          </div>
          <div>
            <span className="text-white font-serif font-bold tracking-wider text-base block leading-none">
              RK JEWELLERS
            </span>
            <span className="text-amber-300/80 text-[10px] tracking-[0.25em] uppercase block font-medium mt-0.5">
              Jaipur • Estd. 1978
            </span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-300" />
          <div className="bg-white/10 rounded-lg p-0.5 border border-white/15 flex items-center">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-[#C5A059] text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-[#C5A059] text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-200/60 p-6 sm:p-8 space-y-6">
          
          {/* Crest & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#701a2b]/10 border border-[#701a2b]/20 text-[#701a2b] shadow-inner mb-1">
              <Sparkles className="w-7 h-7 text-[#701a2b]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              {language === 'hi' ? 'आरके ज्वेलर्स में आपका स्वागत है' : 'Welcome to RK Jewellers'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              {language === 'hi'
                ? 'अपने व्यक्तिगत आर्डर, विशिष्ट डिज़ाइनों और विवरणों तक पहुँचने के लिए प्रवेश करें।'
                : 'Sign in to access your bespoke orders, heritage catalogue, and atelier updates.'}
            </p>
          </div>

          {/* Mode Tabs (LOGIN / REGISTER) */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                mode === 'login'
                  ? 'text-[#701a2b]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {language === 'hi' ? 'लॉग इन' : 'Login'}
              {mode === 'login' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#701a2b]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                mode === 'register'
                  ? 'text-[#701a2b]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {language === 'hi' ? 'नया खाता बनाएं' : 'Register'}
              {mode === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#701a2b]" />
              )}
            </button>
          </div>

          {/* Error & Success Feedback */}
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

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email / Mobile Number'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. 9876543210 या नाम@example.com' : 'e.g. 9823011223 or client@email.com'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#701a2b] to-[#912338] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <span>{language === 'hi' ? 'लॉग इन करें' : 'Login to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'} *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'hi' ? 'ईमेल' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="client@email.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'} *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    {language === 'hi' ? 'पुष्टि करें' : 'Confirm'} *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'पता (वैकल्पिक)' : 'Address (Optional)'}
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="City, State"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-[#701a2b] to-[#912338] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>{language === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...'}</span>
                ) : (
                  <>
                    <span>{language === 'hi' ? 'पंजीकरण पूरा करें' : 'Register & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Admin link footnote */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-[11px] text-slate-400 hover:text-[#701a2b] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>RK Jewellers Staff & Admin Portal</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-amber-200/70 border-t border-white/10 bg-black/30">
        <p>© {new Date().getFullYear()} RK Jewellers Jaipur. All rights reserved. 100% BIS 916 Hallmarked & Certified.</p>
      </footer>

    </div>
  );
};
