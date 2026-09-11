import React, { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation, 
  useParams, 
  useSearchParams 
} from 'react-router-dom';

// Context Providers
import { StoreProvider } from './context/StoreContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

// Core Components from src/components
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { QuickViewModal } from './components/QuickViewModal.jsx';
import { SearchModal } from './components/SearchModal.jsx';
import { AIStylistModal } from './components/AIStylistModal.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';

// Pages
import { LoginPage } from './pages/LoginPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { FavoritesPage } from './pages/FavoritesPage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { NotificationsPage } from './pages/NotificationsPage.jsx';
import { CalculatorPage } from './pages/CalculatorPage.jsx';
import { ServicesPage } from './pages/ServicesPage.jsx';
import { GalleryPage } from './pages/GalleryPage.jsx';
import { BlogsPage } from './pages/BlogsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { FAQPage } from './pages/FAQPage.jsx';
import { StaticPolicyPage } from './pages/StaticPolicyPage.jsx';

// Admin Application
import { AdminApp } from './admin/AdminApp.jsx';

function ShopRoute({ onNavigate, onOpenQuickView }) {
  const [searchParams] = useSearchParams();
  const { category: paramCategory } = useParams();
  const initialCategory = paramCategory || searchParams.get('category') || 'all';

  return (
    <ShopPage 
      onNavigate={onNavigate}
      onOpenQuickView={onOpenQuickView}
      initialCategory={initialCategory}
    />
  );
}

function ProductDetailRoute({ onNavigate, onOpenAIStylist }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const productId = id || searchParams.get('id') || '';

  return (
    <ProductDetailPage 
      productId={productId}
      onNavigate={onNavigate}
      onOpenAIStylist={onOpenAIStylist}
    />
  );
}

function OrdersRoute({ onNavigate }) {
  const [searchParams] = useSearchParams();
  const { orderId } = useParams();
  const selectedOrderId = orderId || searchParams.get('orderId') || undefined;

  return (
    <OrdersPage 
      onNavigate={onNavigate}
      selectedOrderId={selectedOrderId}
    />
  );
}

function PolicyRoute() {
  const { type } = useParams();
  return <StaticPolicyPage type={type || 'privacy'} />;
}

/**
 * Customer Layout & Protected Routing Handler
 */
function CustomerLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aiStylistOpen, setAiStylistOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Show clean loader while verifying token session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#701a2b] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-serif font-semibold text-[#701a2b] tracking-wider uppercase">
            RK Jewellers Atelier
          </p>
        </div>
      </div>
    );
  }

  // Derive current page name for Header highlights
  const pathname = location.pathname;
  let currentPageName = 'dashboard';
  if (pathname === '/home') {
    currentPageName = 'home';
  } else if (pathname.startsWith('/shop') || pathname.startsWith('/catalogue')) {
    currentPageName = 'shop';
  } else if (pathname.startsWith('/product')) {
    currentPageName = 'product-detail';
  } else if (pathname.startsWith('/dashboard')) {
    currentPageName = 'dashboard';
  } else if (pathname.startsWith('/orders')) {
    currentPageName = 'orders';
  } else if (pathname.startsWith('/favorites') || pathname.startsWith('/wishlist')) {
    currentPageName = 'favorites';
  } else if (pathname.startsWith('/notifications')) {
    currentPageName = 'notifications';
  } else if (pathname.startsWith('/calculator')) {
    currentPageName = 'calculator';
  } else if (pathname.startsWith('/services')) {
    currentPageName = 'services';
  } else if (pathname.startsWith('/gallery')) {
    currentPageName = 'gallery';
  } else if (pathname.startsWith('/blogs')) {
    currentPageName = 'blogs';
  } else if (pathname.startsWith('/profile')) {
    currentPageName = 'profile';
  } else if (pathname.startsWith('/contact')) {
    currentPageName = 'contact';
  } else if (pathname.startsWith('/faq')) {
    currentPageName = 'faq';
  } else if (['/privacy', '/terms', '/returns', '/shipping'].includes(pathname)) {
    currentPageName = pathname.replace('/', '');
  }

  // Unified navigation adapter
  const handleNavigate = (target, params = {}) => {
    if (target === 'cart') {
      setCartDrawerOpen(true);
      return;
    }

    if (['orders', 'dashboard', 'notifications', 'checkout', 'profile'].includes(target) && !user) {
      navigate('/login');
      return;
    }

    switch (target) {
      case 'home':
        navigate('/home');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'register':
        navigate('/register');
        break;
      case 'shop':
      case 'catalogue':
        if (params?.category) {
          navigate(`/shop?category=${encodeURIComponent(params.category)}`);
        } else {
          navigate('/shop');
        }
        break;
      case 'product-detail':
      case 'product':
        navigate(`/product/${params?.id || ''}`);
        break;
      case 'favorites':
      case 'wishlist':
        navigate('/favorites');
        break;
      case 'orders':
      case 'checkout':
      case 'bills':
        if (params?.selectedOrderId) {
          navigate(`/orders?orderId=${encodeURIComponent(params.selectedOrderId)}`);
        } else {
          navigate('/orders');
        }
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'calculator':
        navigate('/calculator');
        break;
      case 'services':
        navigate('/services');
        break;
      case 'gallery':
        navigate('/gallery');
        break;
      case 'blogs':
        navigate('/blogs');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'faq':
        navigate('/faq');
        break;
      case 'privacy':
      case 'terms':
      case 'returns':
      case 'shipping':
        navigate(`/${target}`);
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        if (typeof target === 'string' && target.startsWith('/')) {
          navigate(target);
        } else {
          navigate(`/${target}`);
        }
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is unauthenticated and viewing login/register routes
  if (pathname === '/login') {
    return <LoginPage initialMode="login" />;
  }
  if (pathname === '/register') {
    return <LoginPage initialMode="register" />;
  }

  // Root redirect rule:
  // If not logged in, redirect to /login
  // If logged in and at '/', redirect to /dashboard
  if (!user && (pathname === '/' || pathname === '/dashboard' || pathname === '/orders' || pathname === '/favorites' || pathname === '/notifications' || pathname === '/profile')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C5A059] selection:text-white relative">
      
      {/* Customer Header */}
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPageName}
        onOpenCartDrawer={() => setCartDrawerOpen(true)}
        onOpenSearchModal={() => setSearchModalOpen(true)}
        onOpenAIStylist={() => setAiStylistOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onGoBack={handleGoBack}
        canGoBack={pathname !== '/' && pathname !== '/dashboard' && pathname !== '/home'}
      />

      {/* Main Application Routes */}
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/home" 
            element={
              <HomePage 
                onNavigate={handleNavigate}
                onOpenQuickView={(p) => setQuickViewProduct(p)}
                onOpenAIStylist={() => setAiStylistOpen(true)}
              />
            } 
          />

          <Route 
            path="/shop" 
            element={
              <ShopRoute 
                onNavigate={handleNavigate}
                onOpenQuickView={(p) => setQuickViewProduct(p)}
              />
            } 
          />

          <Route 
            path="/catalogue" 
            element={
              <ShopRoute 
                onNavigate={handleNavigate}
                onOpenQuickView={(p) => setQuickViewProduct(p)}
              />
            } 
          />

          <Route 
            path="/shop/:category" 
            element={
              <ShopRoute 
                onNavigate={handleNavigate}
                onOpenQuickView={(p) => setQuickViewProduct(p)}
              />
            } 
          />

          <Route 
            path="/product/:id" 
            element={
              <ProductDetailRoute 
                onNavigate={handleNavigate}
                onOpenAIStylist={() => setAiStylistOpen(true)}
              />
            } 
          />

          <Route 
            path="/product-detail" 
            element={
              <ProductDetailRoute 
                onNavigate={handleNavigate}
                onOpenAIStylist={() => setAiStylistOpen(true)}
              />
            } 
          />

          <Route 
            path="/favorites" 
            element={user ? <FavoritesPage onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/wishlist" 
            element={user ? <FavoritesPage onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/orders" 
            element={user ? <OrdersRoute onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/orders/:orderId" 
            element={user ? <OrdersRoute onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/bills" 
            element={user ? <OrdersRoute onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/checkout" 
            element={user ? <OrdersRoute onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/notifications" 
            element={user ? <NotificationsPage onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route 
            path="/profile" 
            element={user ? <ProfilePage onNavigate={handleNavigate} /> : <Navigate to="/login" replace />} 
          />

          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/services" element={<ServicesPage onNavigate={handleNavigate} />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Static Policy Pages */}
          <Route path="/privacy" element={<StaticPolicyPage type="privacy" />} />
          <Route path="/terms" element={<StaticPolicyPage type="terms" />} />
          <Route path="/returns" element={<StaticPolicyPage type="returns" />} />
          <Route path="/shipping" element={<StaticPolicyPage type="shipping" />} />
          <Route path="/policy/:type" element={<PolicyRoute />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Customer Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals & Drawers */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
        onNavigate={handleNavigate}
      />

      <AIStylistModal 
        isOpen={aiStylistOpen} 
        onClose={() => setAiStylistOpen(false)} 
        onNavigate={handleNavigate}
      />

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onNavigate={handleNavigate}
      />

      <CartDrawer 
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onNavigate={handleNavigate}
        onCheckout={() => {
          setCartDrawerOpen(false);
          handleNavigate('checkout');
        }}
      />

    </div>
  );
}

/**
 * Top-Level App Component
 */
export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <StoreProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Routes>
                  {/* Admin Protected Routes */}
                  <Route path="/admin/*" element={<AdminApp />} />

                  {/* Customer Application Routes */}
                  <Route path="/*" element={<CustomerLayout />} />
                </Routes>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </StoreProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
