import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle2, Heart, 
  Bell, User as UserIcon, Shield, MessageSquare, ChevronRight, 
  FileText, Grid, Sparkles, Phone, AlertCircle, ArrowRight,
  Send, X, MapPin, ExternalLink, Calendar, Upload, Camera, Image, Check, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export const DashboardPage = ({ onNavigate }) => {
  const { user, token, logout } = useAuth();
  const { formatPrice } = useStore();
  const { t } = useLanguage();
  const { favoritesCount } = useFavorites();

  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Message Modal State
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSuccess, setChatSuccess] = useState('');

  // Custom Design Modal Form State
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [designPhoto, setDesignPhoto] = useState('');
  const [jewelleryType, setJewelleryType] = useState('Necklace');
  const [preferredMetal, setPreferredMetal] = useState('Gold');
  const [purity, setPurity] = useState('22K');
  const [expectedWeight, setExpectedWeight] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [referenceNotes, setReferenceNotes] = useState('');
  const [submittingCustom, setSubmittingCustom] = useState(false);
  const [customSuccessMessage, setCustomSuccessMessage] = useState('');

  const fetchDashboardData = () => {
    if (!token || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('/api/orders', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/notifications', { headers }).then(r => r.ok ? r.json() : []),
      fetch('/api/custom-requests', { headers }).then(r => r.ok ? r.json() : [])
    ])
    .then(([userOrders, userNotifs, userCustomReqs]) => {
      setOrders(Array.isArray(userOrders) ? userOrders : []);
      setNotifications(Array.isArray(userNotifs) ? userNotifs : []);
      setCustomRequests(Array.isArray(userCustomReqs) ? userCustomReqs : []);
    })
    .catch(err => console.error('Error loading dashboard data:', err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, token]);

  const activeOrders = orders.filter(o => o.orderStatus === 'In Production' || o.orderStatus === 'Ready for Pickup');
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Order Received');
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Completed');

  const currentOrder = activeOrders[0] || orders[0] || null;
  const latestNotif = notifications.length > 0 ? notifications[0] : null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user?.name || 'Customer',
        email: user?.email,
        phone: user?.phone,
        subject: 'Dashboard Inquiry',
        message: chatMessage.trim()
      })
    }).catch(() => {});

    setChatSuccess('Your message has been delivered to RK Jewellers master desk!');
    setChatMessage('');
    setTimeout(() => {
      setChatSuccess('');
      setMessageModalOpen(false);
    }, 2000);
  };

  const handleCustomDesignSubmit = async (e) => {
    e.preventDefault();
    setSubmittingCustom(true);

    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designPhoto,
          jewelleryType,
          preferredMetal,
          purity,
          expectedWeightGrams: expectedWeight ? Number(expectedWeight) : undefined,
          budget: budget ? Number(budget) : undefined,
          preferredDeliveryDate,
          specialRequirements,
          referenceNotes
        })
      });

      if (res.ok) {
        setCustomSuccessMessage('Your Custom Design Request has been submitted! Admin review is in progress.');
        fetchDashboardData();
        setTimeout(() => {
          setCustomSuccessMessage('');
          setCustomModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingCustom(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#701a2b] text-amber-200 flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900">{t('login')}</h2>
        <p className="text-base text-slate-600">
          Please sign in to view your RK Jewellers customer portal, order status, and bills.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="bg-[#701a2b] hover:bg-[#831e33] text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow cursor-pointer"
        >
          Sign In to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F0] min-h-screen py-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ==========================================
            WELCOME BANNER & CUSTOMER ID HEADER
           ========================================== */}
        <div className="bg-gradient-to-r from-[#701a2b] via-[#5e1524] to-[#450e1a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Royal Member
                </span>
                <span className="text-xs text-amber-200/90 font-mono">
                  Client ID: #{user.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Welcome, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl leading-relaxed">
                Welcome to your RK Jewellers bespoke portal. Access live workshop manufacturing stages, hallmarking certificates, invoices, and direct artisan communications.
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setCustomModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#701a2b]" />
                <span>Bespoke Design Request</span>
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-2xl font-semibold text-xs transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
              >
                <Grid className="w-4 h-4 text-amber-300" />
                <span>Catalogue</span>
              </button>
            </div>

          </div>
        </div>

        {/* ==========================================
            METRICS & LIVE STATUS BAR
           ========================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-[#E6DFD5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-slate-900">{orders.length}</div>
              <div className="text-xs text-slate-500 font-medium">Total Orders Logged</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E6DFD5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-slate-900">{activeOrders.length}</div>
              <div className="text-xs text-slate-500 font-medium">In Workshop Production</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E6DFD5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-slate-900">{favoritesCount}</div>
              <div className="text-xs text-slate-500 font-medium">Saved Favourites</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E6DFD5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-slate-900">{customRequests.length}</div>
              <div className="text-xs text-slate-500 font-medium">Custom Requests</div>
            </div>
          </div>
        </div>

        {/* ==========================================
            6 CORE ACTION CARDS
           ========================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Customer Services & Workspace
            </h2>
            <span className="text-xs text-slate-500">RK Jewellers Jaipur Master Atelier</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: My Orders */}
            <button
              onClick={() => onNavigate('orders')}
              className="bg-white hover:bg-[#FAF7F0] text-slate-900 p-6 rounded-3xl border-2 border-[#E6DFD5] hover:border-[#701a2b] transition-all text-left shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between space-y-4 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-[#701a2b] text-[#701a2b] group-hover:text-amber-200 border border-amber-200 flex items-center justify-center transition-colors shadow-xs">
                  <Package className="w-7 h-7" />
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold font-mono px-3 py-1 rounded-full">
                  {orders.length} Orders
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#701a2b] transition-colors">📦 My Orders & Tracking</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Track live 8-stage manufacturing stages from gold procurement to stone setting and final hallmarking.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[#701a2b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View All Orders & Stages</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 2: Custom Design Requests */}
            <button
              onClick={() => setCustomModalOpen(true)}
              className="bg-white hover:bg-[#FAF7F0] text-slate-900 p-6 rounded-3xl border-2 border-[#E6DFD5] hover:border-[#701a2b] transition-all text-left shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between space-y-4 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 group-hover:bg-[#701a2b] text-rose-600 group-hover:text-amber-200 border border-rose-200 flex items-center justify-center transition-colors shadow-xs">
                  <Sparkles className="w-7 h-7" />
                </div>
                <span className="bg-rose-100 text-rose-800 text-xs font-bold font-mono px-3 py-1 rounded-full">
                  Bespoke Desk
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#701a2b] transition-colors">✨ Custom Design Requests</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Upload sketches or photos of heritage jewellery for custom 22K/18K quotation & artisan crafting.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[#701a2b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Submit / View Custom Requests</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 3: Jewellery Catalogue */}
            <button
              onClick={() => onNavigate('shop')}
              className="bg-white hover:bg-[#FAF7F0] text-slate-900 p-6 rounded-3xl border-2 border-[#E6DFD5] hover:border-[#701a2b] transition-all text-left shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between space-y-4 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 group-hover:bg-[#701a2b] text-amber-700 group-hover:text-amber-200 border border-amber-200 flex items-center justify-center transition-colors shadow-xs">
                  <Grid className="w-7 h-7" />
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold font-mono px-3 py-1 rounded-full border border-amber-200">
                  BIS 916
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#701a2b] transition-colors">💎 Jewellery Catalogue</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Explore complete Polki sets, solitaires, Kundan bridal trunks & daily wear gold bangles.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[#701a2b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 4: Messages */}
            <button
              onClick={() => setMessageModalOpen(true)}
              className="bg-white hover:bg-[#FAF7F0] text-slate-900 p-6 rounded-3xl border-2 border-[#E6DFD5] hover:border-[#701a2b] transition-all text-left shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between space-y-4 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 group-hover:bg-[#701a2b] text-sky-600 group-hover:text-amber-200 border border-sky-200 flex items-center justify-center transition-colors shadow-xs">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <span className="bg-sky-100 text-sky-800 text-xs font-bold font-mono px-3 py-1 rounded-full">
                  Direct Desk
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#701a2b] transition-colors">💬 Messages & Support</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Send inquiries directly to RK Jewellers master artisans or request custom design modifications.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[#701a2b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Send Message to Showroom</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 5: Bills & Payments */}
            <button
              onClick={() => onNavigate('orders')}
              className="bg-white hover:bg-[#FAF7F0] text-slate-900 p-6 rounded-3xl border-2 border-[#E6DFD5] hover:border-[#701a2b] transition-all text-left shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between space-y-4 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-[#701a2b] text-emerald-700 group-hover:text-amber-200 border border-emerald-200 flex items-center justify-center transition-colors shadow-xs">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold font-mono px-3 py-1 rounded-full">
                  GST Invoices
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#701a2b] transition-colors">📄 Bills & Invoices</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Download official tax invoices, estimate breakdown sheets, and advance payment receipts.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[#701a2b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Invoices & Receipts</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 6: My Profile */}
            <button
              onClick={() => onNavigate('profile')}
              className="bg-white hover:bg-[#FAF7F0] text-slate-900 p-6 rounded-3xl border-2 border-[#E6DFD5] hover:border-[#701a2b] transition-all text-left shadow-sm hover:shadow-md group cursor-pointer flex flex-col justify-between space-y-4 h-full"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-[#701a2b] text-purple-700 group-hover:text-amber-200 border border-purple-200 flex items-center justify-center transition-colors shadow-xs">
                  <UserIcon className="w-7 h-7" />
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs font-bold font-mono px-3 py-1 rounded-full">
                  Account Details
                </span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#701a2b] transition-colors">👤 My Profile</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Update your contact phone, delivery address, ring size preference, and password.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[#701a2b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Manage Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

          </div>
        </div>

        {/* ==========================================
            BOTTOM SECTION: Recent Orders & Custom Requests
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Order / Upcoming Delivery */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#701a2b]" />
                Recent Orders & Stage Tracker
              </h3>
              <button 
                onClick={() => onNavigate('orders')}
                className="text-xs font-bold text-[#701a2b] hover:underline"
              >
                View All
              </button>
            </div>

            {currentOrder ? (
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E6DFD5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#701a2b]">Order #{currentOrder.orderNumber || currentOrder.id}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    {currentOrder.orderStatus || 'In Progress'}
                  </span>
                </div>

                <p className="font-serif font-bold text-base text-slate-900">
                  {currentOrder.items?.[0]?.productName || currentOrder.jewelleryType || 'Bespoke Royal Set'}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-2 border-t border-[#E6DFD5]">
                  <span>Total Amount:</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    {formatPrice(currentOrder.totalAmount)}
                  </strong>
                </div>

                <button
                  onClick={() => onNavigate('orders', { selectedOrderId: currentOrder.id })}
                  className="w-full bg-[#701a2b] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#831e33] transition-colors shadow cursor-pointer"
                >
                  Track Craftsmanship Stages & Photos
                </button>
              </div>
            ) : (
              <div className="bg-[#FAF7F0] p-8 rounded-2xl text-center space-y-3 border border-[#E6DFD5]">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-800 text-sm">No Active Orders Yet</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  When you make a purchase or place a custom order, your live 8-stage manufacturing timeline and bills will appear here.
                </p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="bg-[#701a2b] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#8e2137] transition-all cursor-pointer shadow"
                >
                  Explore Jewellery Catalogue
                </button>
              </div>
            )}
          </div>

          {/* Bespoke Requests Section */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6DFD5] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#701a2b]" />
                My Custom Design Quotes
              </h3>
              <button 
                onClick={() => setCustomModalOpen(true)}
                className="text-xs font-bold text-[#701a2b] hover:underline"
              >
                + New Request
              </button>
            </div>

            {customRequests.length > 0 ? (
              <div className="space-y-3">
                {customRequests.slice(0, 2).map((reqItem) => (
                  <div key={reqItem.id} className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E6DFD5] flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-slate-900 font-serif">{reqItem.jewelleryType}</div>
                      <div className="text-xs text-slate-500">{reqItem.preferredMetal} • {reqItem.purity} • {reqItem.expectedWeightGrams ? `${reqItem.expectedWeightGrams}g` : 'Weight flexible'}</div>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full font-mono shrink-0">
                      {reqItem.status || 'Under Review'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF7F0] p-8 rounded-2xl text-center space-y-3 border border-[#E6DFD5]">
                <Sparkles className="w-10 h-10 text-amber-500 mx-auto opacity-70" />
                <p className="font-bold text-slate-800 text-sm">No Custom Requests Submitted</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Have a dream jewellery design? Upload your sketch or reference photo for an exact artisan estimate.
                </p>
                <button
                  onClick={() => setCustomModalOpen(true)}
                  className="bg-[#701a2b] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#8e2137] transition-all cursor-pointer shadow"
                >
                  Submit Custom Design Request
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ==========================================
          MODAL 1: SEND MESSAGE TO SHOWROOM DESK
         ========================================== */}
      {messageModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-200 relative">
            <button 
              onClick={() => setMessageModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#701a2b] flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Message Master Artisan Desk
              </h3>
              <p className="text-xs text-slate-500">
                Direct inquiry to our Jaipur Johari Bazar flagship showroom.
              </p>
            </div>

            {chatSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{chatSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Inquiry / Message</label>
                <textarea
                  required
                  rows={4}
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Ask about current gold pricing, custom design timelines, or booking a private VIP consultation..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30 focus:border-[#701a2b]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMessageModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#701a2b] hover:bg-[#831e33] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: CUSTOM BESPOKE DESIGN REQUEST
         ========================================== */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setCustomModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#701a2b] flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Bespoke Jewellery Design Request
              </h3>
              <p className="text-xs text-slate-500">
                Submit your ideas for hand-crafted 22K/18K Gold, Polki or Diamond jewellery.
              </p>
            </div>

            {customSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{customSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleCustomDesignSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jewellery Type</label>
                  <select
                    value={jewelleryType}
                    onChange={e => setJewelleryType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30"
                  >
                    <option value="Necklace">Necklace / Choker</option>
                    <option value="Bridal Set">Complete Bridal Set</option>
                    <option value="Earrings">Earrings / Jhumkas</option>
                    <option value="Bangles">Bangles / Kadas</option>
                    <option value="Ring">Solitaire / Royal Ring</option>
                    <option value="Pendant">Pendant / Mangalsutra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metal & Purity</label>
                  <select
                    value={purity}
                    onChange={e => setPurity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30"
                  >
                    <option value="22K">22K Royal Gold (916)</option>
                    <option value="18K">18K Diamond Standard (750)</option>
                    <option value="24K">24K Pure Gold (999)</option>
                    <option value="925 Silver">925 Sterling Silver</option>
                    <option value="950 Platinum">950 Platinum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Weight (Grams)</label>
                  <input
                    type="number"
                    value={expectedWeight}
                    onChange={e => setExpectedWeight(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Budget (₹)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="e.g. 250000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reference Photo URL or Sketch link</label>
                <input
                  type="text"
                  value={designPhoto}
                  onChange={e => setDesignPhoto(e.target.value)}
                  placeholder="https://... or leave blank for showroom catalog consultation"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Design Instructions</label>
                <textarea
                  rows={3}
                  value={specialRequirements}
                  onChange={e => setSpecialRequirements(e.target.value)}
                  placeholder="Mention gemstone choices, antique polish style, temple motif details, or delivery deadline..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#701a2b]/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCustom}
                  className="bg-[#701a2b] hover:bg-[#831e33] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{submittingCustom ? 'Submitting...' : 'Submit Design for Estimate'}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
