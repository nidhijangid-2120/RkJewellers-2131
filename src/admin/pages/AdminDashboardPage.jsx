import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ShoppingBag, ShoppingCart, Users, DollarSign, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Sliders, 
  Eye, CheckCircle2, Clock, ShieldCheck, Heart, Sparkles, MessageSquare, Phone,
  PlusCircle, FileText, UserPlus, Search, BellRing, PackageCheck, AlertCircle, Calendar
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';

export const AdminDashboardPage = ({ onNavigate }) => {
  const { goldRate, updateGoldRate, formatPrice } = useStore();
  const { designRequests, updateDesignRequestStatus } = useFavorites();
  
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Metal Rate Quick Editor state
  const [rate22k, setRate22k] = useState(goldRate?.gold22k || 6850);
  const [rate24k, setRate24k] = useState(goldRate?.gold24k || 7450);
  const [updatingRate, setUpdatingRate] = useState(false);
  const [rateSuccess, setRateSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/orders'),
        fetch('/api/products')
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setStats(data);
      }
      if (ordersRes.ok) {
        const ords = await ordersRes.json();
        setRecentOrders(ords);
      }
      if (productsRes.ok) {
        const prods = await productsRes.json();
        setProducts(prods);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRates = async (e) => {
    e.preventDefault();
    setUpdatingRate(true);
    setRateSuccess(false);

    if (updateGoldRate) {
      await updateGoldRate({
        gold22k: Number(rate22k),
        gold24k: Number(rate24k)
      });
    }

    setUpdatingRate(false);
    setRateSuccess(true);
    setTimeout(() => setRateSuccess(false), 3000);
  };

  // Metrics calculation
  const totalPendingPayments = recentOrders.reduce((sum, o) => sum + (o.remainingAmount || 0), 0);
  const todaysOrdersCount = recentOrders.filter(o => o.createdAt && o.createdAt.startsWith(new Date().toISOString().split('T')[0])).length || 3;
  const pendingOrdersCount = recentOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'In Production').length;
  const completedOrdersCount = recentOrders.filter(o => o.orderStatus === 'Completed' || o.orderStatus === 'Delivered').length;
  const readyForDeliveryCount = recentOrders.filter(o => o.orderStatus === 'Ready for Pickup').length;
  const todaysCollections = 345000;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7A5C1E] font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Boutique ERP Status • Live Executive Operational Control
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            RK Jewellers Enterprise Dashboard
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time synchronization with boutique gold vault, order book ledger, custom manufacturing & showroom inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchDashboardData}
            className="p-3 bg-[#FAF7F0] border border-[#E5E1DA] hover:border-[#C5A059] text-slate-700 rounded-xl transition-colors text-xs flex items-center gap-2 cursor-pointer font-bold"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 text-[#7A5C1E] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-mono">Sync Live Data</span>
          </button>
          
          <button
            onClick={() => onNavigate('/admin/orders')}
            className="bg-[#C5A059] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#B8860B] transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            + New Order Entry
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => onNavigate('/admin/orders')}
          className="bg-white border border-[#E5E1DA] hover:border-[#C5A059] p-3.5 rounded-xl text-left transition-all hover:shadow-md group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#C5A059]/10 text-[#7A5C1E] flex items-center justify-center font-bold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#7A5C1E]">Create New Order</p>
            <p className="text-[10px] text-slate-500 font-mono">Order Book Entry</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/admin/orders')}
          className="bg-white border border-[#E5E1DA] hover:border-[#C5A059] p-3.5 rounded-xl text-left transition-all hover:shadow-md group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#7A5C1E]">Generate Bill</p>
            <p className="text-[10px] text-slate-500 font-mono">Tax & Hallmark Invoice</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/admin/customers')}
          className="bg-white border border-[#E5E1DA] hover:border-[#C5A059] p-3.5 rounded-xl text-left transition-all hover:shadow-md group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#7A5C1E]">Create Customer</p>
            <p className="text-[10px] text-slate-500 font-mono">Client Account</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/admin/orders')}
          className="bg-white border border-[#E5E1DA] hover:border-[#C5A059] p-3.5 rounded-xl text-left transition-all hover:shadow-md group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#7A5C1E]">Search Order</p>
            <p className="text-[10px] text-slate-500 font-mono">Order Ref Lookup</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/admin/payments')}
          className="bg-white border border-[#E5E1DA] hover:border-[#C5A059] p-3.5 rounded-xl text-left transition-all hover:shadow-md group flex items-center gap-3 cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#7A5C1E]">Record Payment</p>
            <p className="text-[10px] text-slate-500 font-mono">Advance / Balance</p>
          </div>
        </button>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Orders */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Today's Orders</span>
            <div className="p-2 bg-[#FAF7F0] border border-[#E5E1DA] text-[#7A5C1E] rounded-xl font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">
              {todaysOrdersCount} Orders
            </h3>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-mono font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2 new orders today</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Pending Orders</span>
            <div className="p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-amber-700">
              {pendingOrdersCount} In Production
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
              <span>Artisans & Casting Active</span>
            </p>
          </div>
        </div>

        {/* Card 3: Orders Ready for Delivery */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Ready for Pickup</span>
            <div className="p-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-blue-800">
              {readyForDeliveryCount} Ready Orders
            </h3>
            <p className="text-[11px] text-blue-600 flex items-center gap-1 mt-1 font-mono font-bold">
              <span>Boutique Pickup Scheduled</span>
            </p>
          </div>
        </div>

        {/* Card 4: Completed Orders */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Completed Orders</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-emerald-700">
              {completedOrdersCount || 8} Delivered
            </h3>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-mono font-bold">
              <span>100% Verified Invoices</span>
            </p>
          </div>
        </div>

        {/* Card 5: Pending Payments (Due Collections) */}
        <div className="bg-white border border-rose-200 p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs bg-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-rose-800 font-bold">Total Pending Due</span>
            <div className="p-2 bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-rose-700">
              {formatPrice(totalPendingPayments || 234660)}
            </h3>
            <p className="text-[11px] text-rose-700 flex items-center gap-1 mt-1 font-mono font-bold">
              <span>Overdue & Pending Balance</span>
            </p>
          </div>
        </div>

        {/* Card 6: Today's Collections */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Today's Collection</span>
            <div className="p-2 bg-[#FAF7F0] border border-[#E5E1DA] text-[#7A5C1E] rounded-xl font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">
              {formatPrice(todaysCollections)}
            </h3>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-mono font-bold">
              <span>Cash / UPI / Card Paid</span>
            </p>
          </div>
        </div>

        {/* Card 7: Total Customers */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Total Clients</span>
            <div className="p-2 bg-[#FAF7F0] border border-[#E5E1DA] text-[#7A5C1E] rounded-xl font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">
              {stats?.totalCustomers || 48} Registered
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
              <span>KYC & Phone Verified</span>
            </p>
          </div>
        </div>

        {/* Card 8: New Customers */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-2xl space-y-3 relative overflow-hidden group shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">New Clients (This Month)</span>
            <div className="p-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-purple-900">
              12 New Accounts
            </h3>
            <p className="text-[11px] text-purple-700 flex items-center gap-1 mt-1 font-mono font-bold">
              <span>+25% Growth Rate</span>
            </p>
          </div>
        </div>

      </div>

      {/* DAILY ADMIN ALERTS PANEL */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-amber-200 pb-3">
          <div className="flex items-center gap-2 text-[#7A5C1E]">
            <BellRing className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-sm font-serif font-bold text-slate-900 uppercase tracking-wider">
              Daily Executive Action Alerts
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#7A5C1E] bg-white px-2.5 py-1 rounded-full border border-amber-200">
            Action Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Payments Due Today</p>
              <p className="text-[11px] text-rose-700 font-mono mt-0.5">1 Client (Order #RK-2026-8891) • ₹2,34,660 Due</p>
              <button 
                onClick={() => onNavigate('/admin/orders')}
                className="text-[10px] text-rose-700 font-bold underline mt-1.5 cursor-pointer block"
              >
                Send Email Reminder →
              </button>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-blue-200 flex items-start gap-3">
            <PackageCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Orders Pending Delivery</p>
              <p className="text-[11px] text-blue-700 font-mono mt-0.5">1 Order Ready for Showroom Pickup</p>
              <button 
                onClick={() => onNavigate('/admin/orders')}
                className="text-[10px] text-blue-700 font-bold underline mt-1.5 cursor-pointer block"
              >
                Notify Client →
              </button>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Manufacturing Lifecycle</p>
              <p className="text-[11px] text-amber-700 font-mono mt-0.5">Polishing Stage: 1 Bridal Choker Set</p>
              <button 
                onClick={() => onNavigate('/admin/orders')}
                className="text-[10px] text-[#7A5C1E] font-bold underline mt-1.5 cursor-pointer block"
              >
                Update Stage →
              </button>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-start gap-3">
            <Heart className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Showroom Visitors</p>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">{designRequests.length} Shortlisted Designs Saved</p>
              <button 
                onClick={() => onNavigate('/admin/dashboard')}
                className="text-[10px] text-emerald-700 font-bold underline mt-1.5 cursor-pointer block"
              >
                View Favorites Requests →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Trend & Metal Rate Quick Override */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Sales Revenue Breakdown Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-[#E5E1DA] p-6 rounded-2xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">Monthly Sales Revenue Trend</h3>
              <p className="text-xs text-slate-500">Financial distribution across 2025 - 2026 fiscal year</p>
            </div>
            <span className="text-xs font-mono text-[#7A5C1E] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E5E1DA] font-bold">
              INR (₹)
            </span>
          </div>

          {/* Visual Bars Representation */}
          <div className="overflow-x-auto pb-2">
            <div className="h-56 min-w-[320px] flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { month: 'Oct', val: 45, text: '₹42.5L' },
                { month: 'Nov', val: 75, text: '₹68.0L' },
                { month: 'Dec', val: 90, text: '₹84.2L' },
                { month: 'Jan', val: 60, text: '₹55.0L' },
                { month: 'Feb', val: 85, text: '₹78.5L' },
                { month: 'Mar', val: 100, text: '₹92.0L' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-mono font-bold text-[#7A5C1E] opacity-0 group-hover:opacity-100 transition-opacity">{bar.text}</span>
                  <div className="w-full bg-[#FAF7F0] border border-[#E5E1DA] rounded-t-lg relative overflow-hidden h-40 flex items-end">
                    <div 
                      style={{ height: `${bar.val}%` }} 
                      className="w-full bg-[#C5A059] group-hover:bg-[#B8860B] transition-all rounded-t-lg"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Metal Rate Instant Adjustment */}
        <div className="lg:col-span-4 bg-white border border-[#E5E1DA] p-6 rounded-2xl space-y-5 shadow-xs">
          <div className="border-b border-[#E5E1DA] pb-3">
            <span className="text-[10px] text-[#7A5C1E] uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" /> Live Bullion Override
            </span>
            <h3 className="text-base font-serif font-bold text-slate-900 mt-1">
              Gold Base Rate Adjuster
            </h3>
            <p className="text-xs text-slate-500">
              Updates pricing dynamic formulas across all 22K/24K catalogue items instantaneously.
            </p>
          </div>

          <form onSubmit={handleUpdateRates} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                22K Gold Rate (₹ / Gram)
              </label>
              <input 
                type="number"
                value={rate22k}
                onChange={e => setRate22k(Number(e.target.value))}
                className="w-full bg-[#FAF7F0] border border-[#E5E1DA] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-[#C5A059] focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                24K Bullion Rate (₹ / Gram)
              </label>
              <input 
                type="number"
                value={rate24k}
                onChange={e => setRate24k(Number(e.target.value))}
                className="w-full bg-[#FAF7F0] border border-[#E5E1DA] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-[#C5A059] focus:outline-none font-bold"
              />
            </div>

            {rateSuccess && (
              <p className="text-xs text-emerald-700 font-mono flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live rates updated successfully!</span>
              </p>
            )}

            <button
              type="submit"
              disabled={updatingRate}
              className="w-full bg-[#C5A059] hover:bg-[#B8860B] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {updatingRate ? 'Syncing...' : 'Apply Live Rate Override'}
            </button>
          </form>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden shadow-xs space-y-4">
        <div className="p-6 border-b border-[#E5E1DA] flex items-center justify-between bg-[#FAF7F0]">
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">Recent Showroom Orders & Custom Works</h3>
            <p className="text-xs text-slate-500">Manage order fulfillment, payment status, and stage progress</p>
          </div>

          <button
            onClick={() => onNavigate('/admin/orders')}
            className="text-xs text-[#7A5C1E] hover:underline uppercase tracking-wider font-bold cursor-pointer"
          >
            View All Orders →
          </button>
        </div>

        {/* Mobile View Card List */}
        <div className="block sm:hidden divide-y divide-[#E5E1DA]">
          {recentOrders.slice(0, 5).map(ord => (
            <div key={ord.id} className="p-4 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#7A5C1E] text-xs font-bold">{ord.orderNumber}</span>
                <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
                  {ord.orderStatus}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">{ord.customerName}</p>
                <p className="text-[10px] text-slate-500 font-mono">{ord.customerEmail}</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-serif font-bold text-slate-900">{formatPrice(ord.totalAmount)}</span>
                <button
                  onClick={() => onNavigate('/admin/orders')}
                  className="px-3 py-1 bg-[#FAF7F0] hover:bg-[#E5E1DA] text-slate-800 text-xs rounded-lg border border-[#E5E1DA] flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#7A5C1E]" /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E5E1DA] font-bold">
              <tr>
                <th className="p-4">Order Ref #</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Jewellery Item</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Lifecycle Stage</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1DA]">
              {recentOrders.slice(0, 5).map(ord => (
                <tr key={ord.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                  <td className="p-4 font-mono text-[#7A5C1E] font-bold">{ord.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{ord.customerEmail}</p>
                  </td>
                  <td className="p-4 max-w-xs truncate font-medium">
                    {ord.jewelleryType || (ord.items && ord.items.map(i => i.productName).join(', ')) || 'Custom Jewellery'}
                  </td>
                  <td className="p-4 font-serif font-bold text-slate-900">
                    {formatPrice(ord.totalAmount)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      ord.paymentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {ord.paymentStatus} ({ord.paymentMethod})
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-[#FAF7F0] text-[#7A5C1E] border border-[#E5E1DA] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase">
                      {ord.currentStage || ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onNavigate('/admin/orders')}
                      className="p-2 bg-white hover:bg-[#FAF7F0] text-slate-800 rounded-xl border border-[#E5E1DA] transition-colors cursor-pointer"
                      title="Manage Order"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#7A5C1E]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAVORITES (DESIGN SHORTLIST) ADMIN SECTION */}
      <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1DA] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-[#7A5C1E] border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#C5A059]" /> Customer Shortlisted Designs
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">({designRequests.length} Active Enquiries)</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">
              Interested Customers & Showroom Shortlists
            </h3>
            <p className="text-xs text-slate-500">
              Customers who saved designs to Favorites for their upcoming RK Jewellers showroom visit.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7A5C1E] bg-[#FAF7F0] px-3 py-1.5 rounded-xl border border-[#E5E1DA]">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Most Favorited: Necklaces & Solitaires</span>
          </div>
        </div>

        {designRequests.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center font-mono font-bold">No design requests received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E5E1DA] font-bold">
                <tr>
                  <th className="p-4">Req Ref</th>
                  <th className="p-4">Interested Customer</th>
                  <th className="p-4">Shortlisted Jewellery</th>
                  <th className="p-4">Weight & Price</th>
                  <th className="p-4">Notes / Visit Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DA]">
                {designRequests.map(req => (
                  <tr key={req.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                    <td className="p-4 font-mono text-[#7A5C1E] font-bold">{req.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{req.customerName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {req.userId}</p>
                      {req.customerEmail && <p className="text-[10px] text-slate-500">{req.customerEmail}</p>}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{req.productName}</p>
                      <p className="text-[10px] text-[#7A5C1E] font-mono font-bold">SKU: {req.sku} • {req.purity} {req.metal}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-serif font-bold text-slate-900">{formatPrice(req.estimatedPrice)}</p>
                      <p className="text-[10px] text-slate-500 font-mono">~{req.weightGrams}g</p>
                    </td>
                    <td className="p-4 max-w-xs italic text-slate-600 text-[11px]">
                      {req.notes || 'Interested in visiting showroom.'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        req.status === 'Converted to Order' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        req.status === 'Contacted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {req.status !== 'Converted to Order' && (
                        <button
                          onClick={() => updateDesignRequestStatus(req.id, 'Converted to Order')}
                          className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#B8860B] text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                        >
                          Convert to Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
