import React, { useState } from 'react';
import { 
  Menu, Search, Bell, Sliders, ExternalLink, ShieldCheck, 
  User, LogOut, Sparkles, CheckCircle2, ChevronDown,
  Sun, Moon, Crown, Palette
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export const AdminNavbar = ({
  activePath,
  onOpenMobileSidebar,
  onLogout
}) => {
  const { goldRate, formatPrice, theme, setTheme } = useStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Generate breadcrumb titles
  const getBreadcrumb = (path) => {
    switch (path) {
      case '/admin/dashboard': return ['Enterprise', 'Executive Dashboard'];
      case '/admin/analytics': return ['Reports', 'Sales & Financial Analytics'];
      case '/admin/products': return ['Catalog', 'Products & Stock Control'];
      case '/admin/categories': return ['Catalog', 'Vault Categories & Collections'];
      case '/admin/orders': return ['Sales', 'Orders & BlueDart Shipments'];
      case '/admin/customers': return ['CRM', 'Customers Directory'];
      case '/admin/users': return ['Security', 'User Roles & Access Control'];
      case '/admin/reviews': return ['Engagement', 'Customer Reviews Moderation'];
      case '/admin/gallery': return ['Content', 'Lookbook Media Assets'];
      case '/admin/blogs': return ['Content', 'Heritage Blog Articles'];
      case '/admin/services': return ['Services', 'Bespoke Consultations & Rate Lock'];
      case '/admin/coupons': return ['Promotions', 'Discount Coupons & Offers'];
      case '/admin/settings': return ['System', 'Store Settings & Metal Rates Override'];
      case '/admin/payments': return ['Finance', 'Transaction Audit Logs'];
      default: return ['Admin', 'Management'];
    }
  };

  const breadcrumbs = getBreadcrumb(activePath);

  const mockNotifications = [
    { id: 1, title: 'New High-Value Order #RK-2026-8891', time: '10 mins ago', type: 'order' },
    { id: 2, title: 'Bespoke Consultation Request from Ananya R.', time: '25 mins ago', type: 'service' },
    { id: 3, title: 'Low Stock Alert: Solitaire Platinum Ring (1 left)', time: '1 hour ago', type: 'inventory' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E1DA] text-slate-900 px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-[#FAF7F0] rounded-lg lg:hidden cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <span>{breadcrumbs[0]}</span>
              <span>/</span>
              <span className="text-[#7A5C1E] font-bold">{breadcrumbs[1]}</span>
            </div>
            <h1 className="text-base font-serif font-bold text-slate-900 tracking-wide hidden sm:block">
              {breadcrumbs[1]}
            </h1>
          </div>
        </div>

        {/* Center: Live Benchmark Rates Badge Ticker */}
        <div className="hidden md:flex items-center gap-3 bg-[#FAF7F0] border border-[#E5E1DA] px-3.5 py-1.5 rounded-full text-xs shadow-xs">
          <span className="flex items-center gap-1.5 text-[#7A5C1E] font-bold text-[10px] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Metal Benchmark:
          </span>
          <span className="text-slate-700 font-mono text-[11px]">22K Gold: <strong className="text-slate-900">{formatPrice(goldRate.gold22k)}/g</strong></span>
          <span className="text-stone-300">|</span>
          <span className="text-slate-700 font-mono text-[11px]">24K Gold: <strong className="text-slate-900">{formatPrice(goldRate.gold24k)}/g</strong></span>
        </div>

        {/* Right: Search, Notifications & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Global Search Bar */}
          <div className="relative hidden lg:block w-48 xl:w-64">
            <input 
              type="text"
              placeholder="Search SKU, order #, client..."
              className="w-full bg-[#FAF7F0] border border-[#E5E1DA] rounded-xl px-3.5 py-1.5 pl-8 text-xs text-slate-900 focus:border-[#C5A059] focus:outline-none placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-[#FAF7F0] rounded-xl relative transition-colors border border-[#E5E1DA] bg-white cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#7A5C1E]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C5A059]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E1DA] shadow-2xl rounded-2xl p-3 z-50 animate-in fade-in duration-150 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E1DA] mb-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Executive ERP Alerts</span>
                  <span className="text-[10px] text-[#7A5C1E] font-mono font-bold">3 Active</span>
                </div>
                <div className="space-y-2">
                  {mockNotifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-[#FAF7F0] border border-[#E5E1DA] rounded-xl hover:border-[#C5A059] transition-colors">
                      <p className="font-semibold text-slate-900">{n.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-[#FAF7F0] rounded-xl transition-colors border border-[#E5E1DA] bg-white cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#701a2b] text-amber-200 font-bold flex items-center justify-center text-xs shadow-xs">
                RK
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Master Admin</p>
                <p className="text-[9px] text-[#7A5C1E] font-mono font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E5E1DA] shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in duration-150 text-xs">
                <div className="px-3 py-2 border-b border-[#E5E1DA] mb-1">
                  <p className="font-bold text-slate-900">RK Master Admin</p>
                  <p className="text-[10px] text-slate-500 font-mono">admin@rkjewellers.com</p>
                </div>
                <button
                  onClick={() => { setProfileDropdownOpen(false); onLogout(); }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2 font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Admin Session</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
