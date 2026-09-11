import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { AdminSidebar } from './components/AdminSidebar.jsx';
import { AdminNavbar } from './components/AdminNavbar.jsx';

import { AdminLoginPage } from './pages/AdminLoginPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { AdminProductsPage } from './pages/AdminProductsPage.jsx';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage.jsx';
import { AdminOrdersPage } from './pages/AdminOrdersPage.jsx';
import { AdminCustomersPage } from './pages/AdminCustomersPage.jsx';
import { AdminReviewsPage } from './pages/AdminReviewsPage.jsx';
import { AdminGalleryPage } from './pages/AdminGalleryPage.jsx';
import { AdminBlogsPage } from './pages/AdminBlogsPage.jsx';
import { AdminServicesPage } from './pages/AdminServicesPage.jsx';
import { AdminCouponsPage } from './pages/AdminCouponsPage.jsx';
import { AdminSettingsPage } from './pages/AdminSettingsPage.jsx';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage.jsx';
import { AdminPaymentsPage } from './pages/AdminPaymentsPage.jsx';

function AdminContent() {
  const { isAuthenticated, adminLogout } = useAdminAuth();
  const { theme } = useStore();

  const [currentPath, setCurrentPath] = useState(() => {
    const p = window.location.pathname;
    if (!p || p === '/admin' || p === '/admin/' || !p.startsWith('/admin')) {
      return '/admin/dashboard';
    }
    return p;
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync back & forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      let p = window.location.pathname;
      if (p === '/admin' || p === '/admin/') {
        p = '/admin/dashboard';
      }
      if (p.startsWith('/admin')) {
        setCurrentPath(p);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdminPath = (path) => {
    let target = path;
    if (target === '/admin' || target === '/admin/') {
      target = '/admin/dashboard';
    }

    if (target === '/admin/logout') {
      adminLogout();
      window.history.pushState({}, '', '/admin/login');
      setCurrentPath('/admin/login');
      return;
    }

    window.history.pushState({}, '', target);
    setCurrentPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not authenticated as Admin, force Admin Login page
  if (!isAuthenticated || currentPath === '/admin/login') {
    return (
      <AdminLoginPage 
        onSuccess={() => navigateToAdminPath('/admin/dashboard')} 
      />
    );
  }

  const getThemeClass = () => {
    return 'bg-[#FAF8F5] text-slate-900';
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} flex font-sans selection:bg-[#C5A059] selection:text-slate-950 transition-colors duration-300`}>
      
      {/* Enterprise Sidebar */}
      <AdminSidebar 
        activePath={currentPath}
        onNavigate={navigateToAdminPath}
        onLogout={() => navigateToAdminPath('/admin/logout')}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Admin Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen bg-[#FAF8F5]">
        
        {/* Top Navbar */}
        <AdminNavbar 
          activePath={currentPath}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onLogout={() => navigateToAdminPath('/admin/logout')}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentPath === '/admin/analytics' && (
            <AdminAnalyticsPage />
          )}

          {currentPath === '/admin/products' && (
            <AdminProductsPage />
          )}

          {currentPath === '/admin/categories' && (
            <AdminCategoriesPage />
          )}

          {currentPath === '/admin/orders' && (
            <AdminOrdersPage />
          )}

          {(currentPath === '/admin/customers' || currentPath === '/admin/users') && (
            <AdminCustomersPage />
          )}

          {currentPath === '/admin/reviews' && (
            <AdminReviewsPage />
          )}

          {currentPath === '/admin/gallery' && (
            <AdminGalleryPage />
          )}

          {currentPath === '/admin/blogs' && (
            <AdminBlogsPage />
          )}

          {currentPath === '/admin/services' && (
            <AdminServicesPage />
          )}

          {currentPath === '/admin/coupons' && (
            <AdminCouponsPage />
          )}

          {currentPath === '/admin/settings' && (
            <AdminSettingsPage />
          )}

          {currentPath === '/admin/payments' && (
            <AdminPaymentsPage />
          )}

          {(currentPath === '/admin/dashboard' || currentPath === '/admin' || currentPath === '/admin/' || ![
            '/admin/analytics', '/admin/products', '/admin/categories', '/admin/orders', 
            '/admin/customers', '/admin/users', '/admin/reviews', '/admin/gallery', 
            '/admin/blogs', '/admin/services', '/admin/coupons', '/admin/settings', '/admin/payments'
          ].includes(currentPath)) && (
            <AdminDashboardPage onNavigate={navigateToAdminPath} />
          )}
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-[#E5E1DA] bg-white py-4 px-6 text-center text-[11px] text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[#5E503F] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              RK JEWELLERS EXECUTIVE ERP ADMIN PANEL • v3.0.0
            </span>
            <span className="text-slate-400">🔒 Protected Enterprise Access • BIS Certified ERP Engine</span>
          </div>
        </footer>

      </div>

    </div>
  );
}

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}
