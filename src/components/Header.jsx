import React, { useState, useEffect } from 'react';
import { 
  Bell, User as UserIcon, Search, Sparkles, 
  Menu, X, Shield, Sliders, Heart, Globe, LogIn, LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export const Header = ({
  onNavigate,
  currentPage,
  onOpenSearchModal,
  onOpenAIStylist,
  onOpenAuthModal,
  onGoBack,
  canGoBack = false
}) => {
  const { user, logout } = useAuth();
  const { goldRate, currency, setCurrency, formatPrice } = useStore();
  const { language, setLanguage, t } = useLanguage();
  const { favoritesCount } = useFavorites();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/notifications?userId=${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setNotifications(data))
        .catch(() => {});
    }
  }, [user]);

  const categoriesNav = [
    { name: 'Bridal Collection', slug: 'bridal-collection' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Rings & Solitaires', slug: 'rings' },
    { name: 'Earrings & Jhumkas', slug: 'earrings' },
    { name: 'Bangles & Kadas', slug: 'bangles' },
    { name: 'Mangalsutras', slug: 'mangalsutras' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-[#1A1A1A] border-b border-[#E5E1DA]">
      {/* Top Ticker Bar: Gold Rates & Language Switcher */}
      <div className="bg-[#FAF7F0] text-slate-900 text-[10px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Ticker marquee / horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[10px] sm:text-xs no-scrollbar">
            <span className="font-semibold text-[#701a2b] flex items-center gap-1 uppercase tracking-wider text-[9px] sm:text-[10px] shrink-0 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('live_rates')}:
            </span>
            <span className="text-slate-600 font-medium">{t('gold_rate')} (24K): <strong className="text-slate-900 font-mono">{formatPrice(goldRate.gold24k)}</strong></span>
            <span className="text-[#E6DFD5]">|</span>
            <span className="text-slate-600 font-medium">22K: <strong className="text-slate-900 font-mono">{formatPrice(goldRate.gold22k)}</strong></span>
            <span className="text-[#E6DFD5]">|</span>
            <span className="text-slate-600 font-medium">{t('silver_rate')}: <strong className="text-slate-900 font-mono">{formatPrice(goldRate.silver925)}</strong></span>
          </div>

          {/* Right utility links: Language Switcher & Rate Calc */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 shrink-0">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-white border border-[#E6DFD5] rounded-full p-0.5 shadow-2xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  language === 'en' ? 'bg-[#701a2b] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-[#701a2b] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
            </div>

            <span className="text-[#E6DFD5]">|</span>

            <button onClick={() => onNavigate('calculator')} className="hover:text-[#701a2b] transition-colors flex items-center gap-1 font-bold">
              <Sliders className="w-3 h-3 text-[#701a2b]" />
              <span className="hidden sm:inline">Rate </span>Calc
            </button>

            <span className="text-[#E6DFD5]">|</span>

            {/* Currency selector */}
            <div className="flex items-center">
              <select
                aria-label="Select Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white text-slate-900 border border-[#E6DFD5] rounded px-1 py-0.5 focus:outline-none text-[10px] font-bold"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar with circular logo and Minimal 6 Customer Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-[#E6DFD5]">
          
          {/* Left section: Back Button + Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {onGoBack && (currentPage !== 'dashboard' || canGoBack) && (
              <button
                onClick={onGoBack}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EEE3] border border-[#E6DFD5] text-[#701a2b] text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#701a2b]" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Brand Logo */}
            <div 
              onClick={() => onNavigate('dashboard')} 
              className="cursor-pointer flex items-center gap-2 sm:gap-3 group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#701a2b] text-amber-200 border-2 border-amber-300 flex items-center justify-center rounded-2xl font-serif font-bold text-base sm:text-lg tracking-wider shrink-0 shadow">
                RK
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif uppercase leading-tight">
                  RK JEWELLERS
                </h1>
                <p className="text-[10px] text-[#701a2b] font-bold uppercase font-mono tracking-wider">
                  Shahpura • Jaipur
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Minimal 6 Options: Catalogue, My Orders, Favorites, Messages, Bills, Profile) */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold text-slate-800">
            <button 
              onClick={() => onNavigate('shop')} 
              className={`hover:text-[#701a2b] transition-colors ${currentPage === 'shop' ? 'text-[#701a2b] font-extrabold' : ''}`}
            >
              {t('catalogue')}
            </button>

            <button 
              onClick={() => onNavigate('orders')} 
              className={`hover:text-[#701a2b] transition-colors ${currentPage === 'orders' ? 'text-[#701a2b] font-extrabold' : ''}`}
            >
              {t('my_orders')}
            </button>

            <button 
              onClick={() => onNavigate('favorites')} 
              className={`hover:text-[#701a2b] transition-colors flex items-center gap-1.5 ${currentPage === 'favorites' ? 'text-[#701a2b] font-extrabold' : ''}`}
            >
              <span>{t('favorites')}</span>
              {favoritesCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.2 rounded-full font-mono">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => onNavigate('dashboard')} 
              className="hover:text-[#701a2b] transition-colors"
            >
              {t('messages')}
            </button>

            <button 
              onClick={() => onNavigate('orders')} 
              className="hover:text-[#701a2b] transition-colors"
            >
              {t('bills')}
            </button>

            <button 
              onClick={() => onNavigate('profile')} 
              className={`hover:text-[#701a2b] transition-colors ${currentPage === 'profile' ? 'text-[#701a2b] font-extrabold' : ''}`}
            >
              {t('profile')}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={onOpenSearchModal} 
              className="p-2 text-slate-800 hover:text-[#701a2b] transition-colors" 
              title="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <button 
                onClick={logout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t('logout')}
              </button>
            ) : (
              <button 
                onClick={onOpenAuthModal}
                className="bg-[#701a2b] hover:bg-[#831e33] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow"
              >
                {t('login')}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-800 hover:text-[#701a2b]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E1DA] px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-xs uppercase tracking-widest text-[#1A1A1A] font-medium"
          >
            {t('home')}
          </button>

          {user && (
            <button 
              onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-xs uppercase tracking-widest text-[#C5A059] font-bold"
            >
              {t('dashboard')}
            </button>
          )}

          <button 
            onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-xs uppercase tracking-widest text-[#1A1A1A] font-medium"
          >
            {t('catalogue')}
          </button>

          <button 
            onClick={() => { onNavigate('favorites'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-xs uppercase tracking-widest text-[#1A1A1A] font-medium flex items-center justify-between"
          >
            <span>{t('favorites')}</span>
            {favoritesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          {user && (
            <button 
              onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-xs uppercase tracking-widest text-[#1A1A1A] font-medium"
            >
              {t('my_orders')}
            </button>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-[#E5E1DA]">
            <span className="text-xs text-[#5E503F] font-bold">Language:</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                language === 'en' ? 'bg-[#10172A] text-white' : 'bg-[#FAF8F5] text-[#1A1A1A]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                language === 'hi' ? 'bg-[#10172A] text-white' : 'bg-[#FAF8F5] text-[#1A1A1A]'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
