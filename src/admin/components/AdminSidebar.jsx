import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, FolderTree, ShoppingCart, 
  Users, UserCheck, Star, Image, FileText, CalendarCheck, 
  Ticket, Settings, BarChart3, CreditCard, LogOut, Shield,
  ChevronRight, Sparkles
} from 'lucide-react';

export const AdminSidebar = ({
  activePath,
  onNavigate,
  onLogout,
  isOpenMobile,
  onCloseMobile
}) => {
  const menuGroups = [
    {
      title: 'CORE PLATFORM',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'CATALOG & STORE',
      items: [
        { name: 'Products & Inventory', path: '/admin/products', icon: ShoppingBag, badge: 'Vault' },
        { name: 'Categories & Vaults', path: '/admin/categories', icon: FolderTree },
        { name: 'Orders & Shipments', path: '/admin/orders', icon: ShoppingCart, badge: 'Live' },
        { name: 'Discount Coupons', path: '/admin/coupons', icon: Ticket },
      ]
    },
    {
      title: 'CUSTOMERS & ENGAGEMENT',
      items: [
        { name: 'Customers Directory', path: '/admin/customers', icon: Users },
        { name: 'User Access & Roles', path: '/admin/users', icon: UserCheck },
        { name: 'Product Reviews', path: '/admin/reviews', icon: Star },
        { name: 'Bespoke Consultations', path: '/admin/services', icon: CalendarCheck, badge: 'Requests' },
      ]
    },
    {
      title: 'CONTENT & MEDIA',
      items: [
        { name: 'Lookbook Gallery', path: '/admin/gallery', icon: Image },
        { name: 'Blogs & Heritage', path: '/admin/blogs', icon: FileText },
      ]
    },
    {
      title: 'FINANCE & SYSTEM',
      items: [
        { name: 'Payment Gateway Logs', path: '/admin/payments', icon: CreditCard },
        { name: 'System Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const handleLinkClick = (path) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden cursor-pointer"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E1DA] text-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-none
        ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#E5E1DA] flex items-center justify-between bg-[#FAF7F0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C5A059] border border-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-slate-900 tracking-wider uppercase">
                RK JEWELLERS
              </h2>
              <p className="text-[9px] uppercase tracking-widest text-[#7A5C1E] font-mono font-bold">
                ERP Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar bg-white">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-[#7A5C1E] uppercase tracking-[0.18em] mb-2 font-mono">
                {group.title}
              </p>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activePath === item.path || (item.path !== '/admin/dashboard' && activePath?.startsWith(item.path));
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleLinkClick(item.path)}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer
                      ${isActive 
                        ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20 font-bold' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-[#FAF7F0]'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-[#7A5C1E] group-hover:text-[#C5A059]'}`} />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`
                          text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
                          ${isActive ? 'bg-white/20 text-white' : 'bg-[#FAF7F0] text-[#7A5C1E] border border-[#C5A059]/30'}
                        `}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer & Logout */}
        <div className="p-4 border-t border-[#E5E1DA] bg-[#FAF7F0] space-y-3">
          <div className="bg-white border border-[#E5E1DA] p-3 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#701a2b] text-amber-200 font-bold flex items-center justify-center text-xs shrink-0 shadow">
              RK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">admin@rkjewellers.com</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
