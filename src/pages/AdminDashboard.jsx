import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingBag, Users, Tag, Sliders, DollarSign, 
  TrendingUp, Plus, Edit, Trash2, Search, CheckCircle2, Clock, X, Save, ShieldCheck,
  Camera, Eye, Check, AlertTriangle, Download, ZoomIn, RefreshCw, Send, FileText,
  Calendar, CreditCard, ChevronRight, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';

export const AdminDashboard = ({ onNavigate }) => {
  const { isAdmin, adminLogout } = useAuth();
  const { products, goldRate, updateGoldRate, formatPrice } = useStore();

  const [activeTab, setActiveTab] = useState('overview');
  
  // Data State
  const [orderList, setOrderList] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [customRequestsList, setCustomRequestsList] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Order Book Filters & Search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Create Showroom Order Modal State
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [newOrderCustName, setNewOrderCustName] = useState('');
  const [newOrderCustPhone, setNewOrderCustPhone] = useState('');
  const [newOrderCustEmail, setNewOrderCustEmail] = useState('');
  const [newOrderJewelleryType, setNewOrderJewelleryType] = useState('Necklace Set');
  const [newOrderPurity, setNewOrderPurity] = useState('22K Gold');
  const [newOrderWeight, setNewOrderWeight] = useState(30);
  const [newOrderTotal, setNewOrderTotal] = useState(250000);
  const [newOrderAdvance, setNewOrderAdvance] = useState(100000);
  const [newOrderPayMethod, setNewOrderPayMethod] = useState('UPI / Cash');
  const [newOrderDeliveryDate, setNewOrderDeliveryDate] = useState('2026-08-30');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [submittingNewOrder, setSubmittingNewOrder] = useState(false);

  // Edit Order Modal State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editTotalAmount, setEditTotalAmount] = useState(0);
  const [editAdvancePaid, setEditAdvancePaid] = useState(0);
  const [editDeliveryDate, setEditDeliveryDate] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState('');
  const [editCurrentStage, setEditCurrentStage] = useState('');

  // Record Payment Modal State
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [payAmountInput, setPayAmountInput] = useState(0);
  const [payModeInput, setPayModeInput] = useState('Cash');
  const [payRefInput, setPayRefInput] = useState('');
  const [payRemarksInput, setPayRemarksInput] = useState('Collected at Showroom Desk');

  // Stage Progress Modal State
  const [stageModalOrder, setStageModalOrder] = useState(null);
  const [stageNameSelect, setStageNameSelect] = useState('Jewellery Designing');
  const [stageRemarksInput, setStageRemarksInput] = useState('');

  // Selected Custom Request Modal
  const [selectedCustomReq, setSelectedCustomReq] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);

  // Gold Rate Local Form
  const [gold24k, setGold24k] = useState(goldRate.gold24k);
  const [gold22k, setGold22k] = useState(goldRate.gold22k);
  const [gold18k, setGold18k] = useState(goldRate.gold18k);
  const [silver925, setSilver925] = useState(goldRate.silver925);
  const [rateUpdatedNotice, setRateUpdatedNotice] = useState(false);

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Bridal & Polki Sets');
  const [newProdMetal, setNewProdMetal] = useState('gold');
  const [newProdPurity, setNewProdPurity] = useState('22K');
  const [newProdNetWeight, setNewProdNetWeight] = useState(20);
  const [newProdMakingPct, setNewProdMakingPct] = useState(12);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800');

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(50000);

  const fetchAdminData = async () => {
    try {
      const [ordRes, cpnRes, anaRes, reqRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/coupons'),
        fetch('/api/analytics'),
        fetch('/api/custom-requests')
      ]);

      if (ordRes.ok) setOrderList(await ordRes.json());
      if (cpnRes.ok) setCouponList(await cpnRes.json());
      if (anaRes.ok) setAnalytics(await anaRes.json());
      if (reqRes.ok) setCustomRequestsList(await reqRes.json());
    } catch {
      // fallback
    }
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmittingNewOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newOrderCustName,
          customerPhone: newOrderCustPhone,
          customerEmail: newOrderCustEmail || `${newOrderCustName.toLowerCase().replace(/\s+/g, '')}@client.com`,
          jewelleryType: newOrderJewelleryType,
          purity: newOrderPurity,
          weightGrams: Number(newOrderWeight),
          subtotal: Number(newOrderTotal),
          totalAmount: Number(newOrderTotal),
          advancePaid: Number(newOrderAdvance),
          paymentMethod: newOrderPayMethod,
          estimatedDeliveryDate: newOrderDeliveryDate,
          orderStatus: 'In Production',
          currentStage: 'Order Received'
        })
      });

      if (res.ok) {
        setShowCreateOrderModal(false);
        // Reset form
        setNewOrderCustName('');
        setNewOrderCustPhone('');
        setNewOrderCustEmail('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingNewOrder(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch {
      // error
    }
  };

  const handleSaveEditOrder = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const res = await fetch(`/api/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: Number(editTotalAmount),
          advancePaid: Number(editAdvancePaid),
          estimatedDeliveryDate: editDeliveryDate,
          orderStatus: editOrderStatus,
          currentStage: editCurrentStage
        })
      });

      if (res.ok) {
        setEditingOrder(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentModalOrder || payAmountInput <= 0) return;

    try {
      const res = await fetch(`/api/orders/${paymentModalOrder.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(payAmountInput),
          paymentMode: payModeInput,
          transactionRef: payRefInput || `TXN-${Date.now()}`,
          remarks: payRemarksInput
        })
      });

      if (res.ok) {
        setPaymentModalOrder(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStageSubmit = async (e) => {
    e.preventDefault();
    if (!stageModalOrder) return;

    try {
      const res = await fetch(`/api/orders/${stageModalOrder.id}/lifecycle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName: stageNameSelect,
          remarks: stageRemarksInput || `Updated by Showroom Admin`,
          completed: true
        })
      });

      if (res.ok) {
        setStageModalOrder(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReminderEmail = async (order) => {
    try {
      const res = await fetch(`/api/orders/${order.id}/email-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName: 'Payment Reminder Notice',
          recipientEmail: order.customerEmail,
          subject: `Payment Reminder - RK Jewellers Order #${order.orderNumber}`
        })
      });

      if (res.ok) {
        alert(`Payment reminder dispatched to ${order.customerEmail}`);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCustomRequestStatus = async (requestId, status) => {
    try {
      const res = await fetch(`/api/custom-requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: adminNotesInput,
          rejectionReason: status === 'Rejected' ? (rejectReasonInput || 'Please visit RK Jewellers showroom for further discussion.') : undefined
        })
      });

      if (res.ok) {
        setSelectedCustomReq(null);
        setRejectReasonInput('');
        setAdminNotesInput('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateGoldRateSubmit = (e) => {
    e.preventDefault();
    updateGoldRate({ gold24k, gold22k, gold18k, silver925 });
    setRateUpdatedNotice(true);
    setTimeout(() => setRateUpdatedNotice(false), 2000);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const prodData = {
      name: newProdName,
      sku: newProdSku || `RK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProdCategory,
      metal: newProdMetal,
      purity: newProdPurity,
      grossWeightGrams: newProdNetWeight + 2,
      netWeightGrams: newProdNetWeight,
      makingChargesPercentage: newProdMakingPct,
      images: [newProdImage],
      description: 'Handcrafted luxury piece designed by RK master artisans.',
      specifications: [
        { key: 'Metal', value: newProdMetal },
        { key: 'Purity', value: newProdPurity },
        { key: 'Net Weight', value: `${newProdNetWeight}g` }
      ],
      inStock: true,
      isFeatured: true
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodData)
      });
      if (res.ok) {
        setShowAddProductModal(false);
        window.location.reload();
      }
    } catch {
      // error
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode.toUpperCase(),
          discountType: 'percentage',
          discountValue: newCouponDiscount,
          minOrderValue: newCouponMinOrder,
          maxDiscountAmount: 50000,
          validTill: '2026-12-31'
        })
      });
      if (res.ok) {
        setNewCouponCode('');
        fetchAdminData();
      }
    } catch {
      // error
    }
  };

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Bar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900 border border-amber-900/60 p-6 rounded-3xl shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> RK Master Executive Portal
            </div>
            <h1 className="text-2xl font-serif text-amber-200 font-bold mt-1">Atelier Store Manager</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-stone-800 text-stone-200 hover:text-amber-300 text-xs rounded-xl border border-stone-700 cursor-pointer"
            >
              Exit to Storefront
            </button>
            <button
              onClick={() => { adminLogout(); onNavigate('home'); }}
              className="px-4 py-2 bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs rounded-xl hover:bg-rose-900/80 cursor-pointer"
            >
              Logout Admin
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-stone-800 pb-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Store Overview & Sales', icon: BarChart3 },
            { id: 'custom-requests', label: `Custom Design Requests (${customRequestsList.filter(r => r.status === 'Pending Admin Review').length})`, icon: Camera },
            { id: 'products', label: 'Inventory Catalog', icon: Package },
            { id: 'orders', label: 'Client Orders', icon: ShoppingBag },
            { id: 'coupons', label: 'Promotional Coupons', icon: Tag },
            { id: 'gold-rate', label: 'Live Bullion Rates', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-colors shrink-0 cursor-pointer ${active ? 'bg-amber-500 text-stone-950 font-bold border-amber-500' : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-amber-300'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-stone-900 border border-amber-900/40 p-5 rounded-2xl">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Total Sales Revenue</p>
                <p className="text-2xl font-bold text-amber-300 font-mono mt-1">
                  {formatPrice(analytics?.totalSales || 3820000)}
                </p>
                <p className="text-[10px] text-emerald-400 mt-1">↑ +24.8% from last month</p>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Total Orders Processed</p>
                <p className="text-2xl font-bold text-amber-200 font-mono mt-1">
                  {analytics?.totalOrders || orderList.length || 14}
                </p>
                <p className="text-[10px] text-stone-400 mt-1">100% Insured Dispatches</p>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Average Order Value</p>
                <p className="text-2xl font-bold text-amber-200 font-mono mt-1">
                  {formatPrice(analytics?.avgOrderValue || 272850)}
                </p>
                <p className="text-[10px] text-amber-400 mt-1">High-Jewellery Segment</p>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Active Client Accounts</p>
                <p className="text-2xl font-bold text-amber-200 font-mono mt-1">
                  {analytics?.totalCustomers || 128}
                </p>
                <p className="text-[10px] text-emerald-400 mt-1">High Repeat Rate</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-serif text-amber-200 font-bold">Recent Customer Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {orderList.map(ord => (
                      <tr key={ord.id} className="hover:bg-stone-950/40">
                        <td className="p-3 font-bold text-amber-300">{ord.orderNumber}</td>
                        <td className="p-3 font-medium text-stone-200">{ord.customerName}</td>
                        <td className="p-3 font-bold text-amber-200">{formatPrice(ord.totalAmount)}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/40">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-stone-400">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <span className="text-xs text-stone-300">Total Designs: <strong>{products.length}</strong></span>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-amber-500 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Design
              </button>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Design</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purity & Metal</th>
                    <th className="p-3">Net Wt.</th>
                    <th className="p-3">Calculated Price</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-stone-950/40">
                      <td className="p-3 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-amber-900/30 shrink-0" />
                        <div>
                          <p className="font-bold text-stone-200">{prod.name}</p>
                          <p className="text-[10px] text-stone-500">SKU: {prod.sku}</p>
                        </div>
                      </td>
                      <td className="p-3 text-stone-300">{prod.category}</td>
                      <td className="p-3 text-amber-300 font-semibold">{prod.purity} {prod.metal}</td>
                      <td className="p-3 text-stone-300">{prod.netWeightGrams}g</td>
                      <td className="p-3 font-bold text-amber-200">{formatPrice(prod.calculatedPrice)}</td>
                      <td className="p-3 text-right">
                        <button className="text-stone-400 hover:text-amber-300 p-1 cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CUSTOM DESIGN REQUESTS (ADMIN REVIEW) */}
        {activeTab === 'custom-requests' && (
          <div className="bg-stone-900 border border-amber-900/40 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-serif text-amber-200 font-bold">Custom Design Requests & Photo Desk</h3>
                <p className="text-xs text-stone-400">Inspect client custom design reference photos, approve to convert into manufacturing orders, or reject with customer notes.</p>
              </div>
              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold px-3 py-1.5 rounded-full">
                {customRequestsList.filter(r => r.status === 'Pending Admin Review').length} Pending Action
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customRequestsList.map(req => (
                <div key={req.id} className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-4 text-xs">
                  <div className="flex gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={req.designPhoto}
                        alt="Design Reference"
                        className="w-24 h-24 rounded-xl object-cover border border-amber-900/40 cursor-pointer"
                        onClick={() => setZoomedImage(req.designPhoto)}
                      />
                      <button
                        onClick={() => setZoomedImage(req.designPhoto)}
                        className="absolute bottom-1 right-1 bg-stone-950/80 p-1 rounded-md text-amber-300 hover:text-white cursor-pointer"
                        title="Zoom Image"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">{req.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          req.status === 'Rejected' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-stone-100 text-sm">{req.jewelleryType} ({req.purity} {req.preferredMetal})</h4>
                      <p className="text-stone-400">Client: <strong className="text-stone-200">{req.customerName}</strong> ({req.customerPhone || req.customerEmail})</p>
                      <p className="text-stone-400">Est. Weight: <strong>{req.expectedWeightGrams || 25}g</strong> | Budget: <strong>{req.budget ? formatPrice(req.budget) : 'Open Quote'}</strong></p>
                    </div>
                  </div>

                  {req.specialRequirements && (
                    <div className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-300 italic">
                      &quot;{req.specialRequirements}&quot;
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => setSelectedCustomReq(req)}
                      className="flex-1 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review & Approve / Reject
                    </button>
                    <a
                      href={req.designPhoto}
                      download={`custom_design_${req.id}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-xl flex items-center gap-1 cursor-pointer"
                      title="Download Image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & ORDER BOOK */}
        {activeTab === 'orders' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-serif text-amber-200 font-bold">Showroom Order Book & Manufacturing Ledger</h3>
                <p className="text-xs text-stone-400">Log in-person showroom orders, manage 8-stage manufacturing progress, record advance/balance payments, and dispatch invoices.</p>
              </div>

              <button
                onClick={() => setShowCreateOrderModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Log New Showroom Order
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-950 p-3 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-stone-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by Order #, Client Name or Phone..."
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  className="bg-transparent text-stone-200 w-full focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-400 text-[11px]">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="bg-stone-900 border border-stone-700 text-amber-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="ALL">All Orders ({orderList.length})</option>
                  <option value="In Production">In Production</option>
                  <option value="Approved">Approved</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orderList
                .filter(ord => {
                  const query = orderSearchQuery.toLowerCase();
                  const matchesQuery = 
                    ord.orderNumber.toLowerCase().includes(query) ||
                    ord.customerName.toLowerCase().includes(query) ||
                    ord.customerPhone.includes(query) ||
                    (ord.jewelleryType && ord.jewelleryType.toLowerCase().includes(query));
                  
                  const matchesStatus = orderStatusFilter === 'ALL' || ord.orderStatus === orderStatusFilter;
                  return matchesQuery && matchesStatus;
                })
                .map(ord => {
                  const total = ord.totalAmount || 0;
                  const advance = ord.advancePaid || 0;
                  const remaining = ord.remainingAmount !== undefined ? ord.remainingAmount : Math.max(0, total - advance);

                  return (
                    <div key={ord.id} className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-4 text-xs hover:border-amber-900/50 transition-all">
                      {/* Top Header */}
                      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-stone-800/80 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-300 text-sm font-mono">{ord.orderNumber}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.orderStatus === 'Delivered' || ord.orderStatus === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              ord.orderStatus === 'Ready for Pickup' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-stone-900 text-stone-300 border border-stone-700'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-stone-400">Logged on: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>

                        {/* Order Status Pipeline Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 text-[11px]">Quick Status:</span>
                          <select 
                            value={ord.orderStatus}
                            onChange={e => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-stone-900 border border-stone-700 text-amber-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                          >
                            <option value="Placed">1. Placed</option>
                            <option value="Approved">2. Approved</option>
                            <option value="In Production">3. In Production</option>
                            <option value="Ready for Pickup">4. Ready for Pickup</option>
                            <option value="Dispatched">5. Dispatched</option>
                            <option value="Delivered">6. Delivered</option>
                            <option value="Completed">7. Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Middle Grid: Client & Jewellery Details & Financials */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Client Info */}
                        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/60 space-y-1">
                          <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Client Details</p>
                          <p className="font-bold text-stone-100 text-sm">{ord.customerName}</p>
                          <p className="text-stone-300">📞 {ord.customerPhone}</p>
                          <p className="text-stone-400 text-[11px]">✉️ {ord.customerEmail}</p>
                        </div>

                        {/* Jewellery Specs */}
                        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/60 space-y-1">
                          <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Jewellery Specifications</p>
                          <p className="font-bold text-stone-200">{ord.jewelleryType || (ord.items && ord.items[0]?.productName) || 'Bespoke Jewellery'}</p>
                          <p className="text-stone-300">Purity: <strong className="text-amber-300">{ord.purity || '22K Gold'}</strong></p>
                          <p className="text-stone-400">Net Weight: <strong className="text-stone-200">{ord.weightGrams || 25}g</strong></p>
                          {ord.estimatedDeliveryDate && (
                            <p className="text-amber-400 font-mono text-[11px]">📅 Target: {ord.estimatedDeliveryDate}</p>
                          )}
                        </div>

                        {/* Financial Ledger */}
                        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/60 space-y-1">
                          <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Payment & Balance Ledger</p>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-400">Total Order:</span>
                            <span className="font-bold text-stone-100">{formatPrice(total)}</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>Advance Paid:</span>
                            <span className="font-bold">{formatPrice(advance)}</span>
                          </div>
                          <div className="flex justify-between items-center text-rose-400 font-bold border-t border-stone-800 pt-1">
                            <span>Remaining Balance:</span>
                            <span>{formatPrice(remaining)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Current ERP Lifecycle Stage */}
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-stone-400">Current Manufacturing Stage:</span>
                            <strong className="text-amber-300 ml-1 font-serif text-xs">{ord.currentStage || 'Order Received'}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setStageModalOrder(ord);
                              setStageNameSelect(ord.currentStage || 'Jewellery Designing');
                              setStageRemarksInput('');
                            }}
                            className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold px-3 py-1.5 rounded-lg border border-amber-900/30 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Advance Stage
                          </button>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setPaymentModalOrder(ord);
                              setPayAmountInput(remaining > 0 ? remaining : 0);
                              setPayRefInput('');
                            }}
                            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Record Payment
                          </button>

                          <button
                            onClick={() => {
                              setEditingOrder(ord);
                              setEditTotalAmount(total);
                              setEditAdvancePaid(advance);
                              setEditDeliveryDate(ord.estimatedDeliveryDate || '');
                              setEditOrderStatus(ord.orderStatus || 'In Production');
                              setEditCurrentStage(ord.currentStage || 'Order Received');
                            }}
                            className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-amber-300" /> Edit Order Details
                          </button>

                          {remaining > 0 && (
                            <button
                              onClick={() => handleSendReminderEmail(ord)}
                              className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                              title="Send Email Payment Reminder"
                            >
                              <Send className="w-3.5 h-3.5" /> Send Reminder Email
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Create Coupon Form */}
            <form onSubmit={handleCreateCoupon} className="bg-stone-900 border border-amber-900/40 p-6 rounded-2xl space-y-4 text-xs">
              <h3 className="text-sm font-serif text-amber-300 font-bold">Create New Promo Coupon</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1">Coupon Code</label>
                  <input type="text" required placeholder="ROYAL20" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 uppercase" />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Discount %</label>
                  <input type="number" min="1" max="50" required value={newCouponDiscount} onChange={e => setNewCouponDiscount(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Min Order Value (₹)</label>
                  <input type="number" min="1000" required value={newCouponMinOrder} onChange={e => setNewCouponMinOrder(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>
              </div>
              <button type="submit" className="bg-amber-500 text-stone-950 font-bold px-6 py-2 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer">
                Save Coupon
              </button>
            </form>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-sm font-serif text-amber-200 font-bold mb-4">Active Coupons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {couponList.map(cpn => (
                  <div key={cpn.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-bold text-amber-300 text-sm">{cpn.code}</span>
                      <p className="text-stone-400 mt-0.5">{cpn.discountValue}% OFF on orders above {formatPrice(cpn.minOrderValue)}</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-1 rounded">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GOLD RATE OVERRIDE */}
        {activeTab === 'gold-rate' && (
          <div className="bg-stone-900 border border-amber-900/50 rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl mx-auto">
            <div className="border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif text-amber-200 font-bold">Live Bullion Rate Manager</h3>
              <p className="text-xs text-stone-400 mt-1">Modifying these rates automatically updates pricing for all 100+ inventory items across the storefront instantly.</p>
            </div>

            {rateUpdatedNotice && (
              <p className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl">
                Storefront Gold Rates Updated Successfully!
              </p>
            )}

            <form onSubmit={handleUpdateGoldRateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">24K Bullion Rate (₹ / Gram)</label>
                <input type="number" value={gold24k} onChange={e => setGold24k(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold rounded-xl px-3 py-2" />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">22K Hallmarked Gold Rate (₹ / Gram)</label>
                <input type="number" value={gold22k} onChange={e => setGold22k(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold rounded-xl px-3 py-2" />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">18K Diamond Setting Rate (₹ / Gram)</label>
                <input type="number" value={gold18k} onChange={e => setGold18k(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold rounded-xl px-3 py-2" />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">925 Sterling Silver Rate (₹ / Gram)</label>
                <input type="number" value={silver925} onChange={e => setSilver925(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold rounded-xl px-3 py-2" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 font-bold py-3 rounded-xl hover:from-amber-300 hover:to-amber-500 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer">
                <Save className="w-4 h-4" /> Save Rates Across Entire Storefront
              </button>
            </form>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
            <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-lg w-full p-6 text-stone-100 space-y-4">
              <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 className="text-base font-serif text-amber-200 font-bold">Add New Jewellery Design</h3>
                <button onClick={() => setShowAddProductModal(false)}><X className="w-5 h-5 text-stone-400" /></button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1">Design Title</label>
                  <input type="text" required value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="Royal Emerald Polki Necklace" className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 mb-1">Category</label>
                    <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100">
                      <option value="Bridal & Polki Sets">Bridal & Polki Sets</option>
                      <option value="Solitaire Rings">Solitaire Rings</option>
                      <option value="Gold Bangles & Kadas">Gold Bangles & Kadas</option>
                      <option value="Antique Temple Earrings">Antique Temple Earrings</option>
                      <option value="Diamond Necklaces">Diamond Necklaces</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Purity</label>
                    <select value={newProdPurity} onChange={e => setNewProdPurity(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100">
                      <option value="22K">22K Gold</option>
                      <option value="18K">18K Gold</option>
                      <option value="24K">24K Gold</option>
                      <option value="950 Platinum">950 Platinum</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 mb-1">Net Weight (Grams)</label>
                    <input type="number" required value={newProdNetWeight} onChange={e => setNewProdNetWeight(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                  </div>
                  <div>
                    <label className="block text-stone-300 mb-1">Making Charge (%)</label>
                    <input type="number" required value={newProdMakingPct} onChange={e => setNewProdMakingPct(Number(e.target.value))} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">High-Res Image URL</label>
                  <input type="text" required value={newProdImage} onChange={e => setNewProdImage(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>

                <button type="submit" className="w-full bg-amber-500 text-stone-950 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer">
                  Publish to Catalog
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Selected Custom Request Review & Approval Modal */}
      {selectedCustomReq && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-2xl w-full p-6 text-stone-100 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomReq(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-800 pb-3">
              <span className="bg-amber-950 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-amber-800">
                Custom Request #{selectedCustomReq.id}
              </span>
              <h3 className="text-xl font-serif text-amber-200 font-bold mt-1">
                Client Design Specification Review
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative group">
                  <img
                    src={selectedCustomReq.designPhoto}
                    alt="Custom Design Reference"
                    className="w-full h-56 object-cover rounded-2xl border border-amber-900/40 cursor-pointer"
                    onClick={() => setZoomedImage(selectedCustomReq.designPhoto)}
                  />
                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                    <span className="bg-stone-900 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-700/50 flex items-center gap-1">
                      <ZoomIn className="w-4 h-4" /> Click to Zoom
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setZoomedImage(selectedCustomReq.designPhoto)}
                    className="flex-1 bg-stone-800 hover:bg-stone-700 text-amber-300 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Full Zoom
                  </button>
                  <a
                    href={selectedCustomReq.designPhoto}
                    download={`custom_design_${selectedCustomReq.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div>
                  <label className="text-stone-400 block">Customer Name</label>
                  <p className="font-bold text-stone-100 text-sm">{selectedCustomReq.customerName}</p>
                  <p className="text-amber-400 font-mono">{selectedCustomReq.customerPhone || selectedCustomReq.customerEmail}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                  <div>
                    <label className="text-stone-400 block">Jewellery Type</label>
                    <p className="font-bold text-stone-200">{selectedCustomReq.jewelleryType}</p>
                  </div>
                  <div>
                    <label className="text-stone-400 block">Metal & Purity</label>
                    <p className="font-bold text-amber-300">{selectedCustomReq.purity} {selectedCustomReq.preferredMetal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                  <div>
                    <label className="text-stone-400 block">Target Weight</label>
                    <p className="font-bold text-stone-200">{selectedCustomReq.expectedWeightGrams || 25} Grams</p>
                  </div>
                  <div>
                    <label className="text-stone-400 block">Client Budget</label>
                    <p className="font-bold text-emerald-400">{selectedCustomReq.budget ? formatPrice(selectedCustomReq.budget) : 'Open Quote'}</p>
                  </div>
                </div>

                {selectedCustomReq.preferredDeliveryDate && (
                  <div className="pt-2 border-t border-stone-800">
                    <label className="text-stone-400 block">Requested Delivery Date</label>
                    <p className="font-bold text-stone-200 font-mono">{selectedCustomReq.preferredDeliveryDate}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedCustomReq.specialRequirements && (
              <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 text-xs text-stone-300 space-y-1">
                <strong className="text-amber-300 block">Special Artisan Instructions:</strong>
                <p>&quot;{selectedCustomReq.specialRequirements}&quot;</p>
              </div>
            )}

            {/* Admin Actions */}
            <div className="space-y-3 pt-3 border-t border-stone-800 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Internal Artisan / Admin Notes (Optional)</label>
                <input
                  type="text"
                  value={adminNotesInput}
                  onChange={e => setAdminNotesInput(e.target.value)}
                  placeholder="e.g., CAD design assigned to Master Artisan Ramesh. Expected weight 28.5g 22K."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Rejection Reason (Required ONLY if Rejecting)</label>
                <input
                  type="text"
                  value={rejectReasonInput}
                  onChange={e => setRejectReasonInput(e.target.value)}
                  placeholder="e.g., Minimum weight for this intricate choker is 45g. Please visit showroom to discuss."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-stone-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateCustomRequestStatus(selectedCustomReq.id, 'Rejected')}
                  className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold py-3 rounded-xl flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Reject Request (Notify Client)
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateCustomRequestStatus(selectedCustomReq.id, 'Approved')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Check className="w-4 h-4 text-amber-200" />
                  Approve & Convert to Manufacturing Order
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Zoom Image Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 p-2 text-stone-300 hover:text-white bg-stone-900 rounded-full border border-stone-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed Reference"
              className="max-w-full max-h-[85vh] rounded-3xl border-2 border-amber-500/50 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Log New Showroom Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-xl w-full p-6 text-stone-100 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <span className="bg-amber-950 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border border-amber-800">
                  Showroom Desk Register
                </span>
                <h3 className="text-lg font-serif text-amber-200 font-bold mt-1">Log New Client Order into Order Book</h3>
              </div>
              <button onClick={() => setShowCreateOrderModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Sunita Devi"
                    value={newOrderCustName}
                    onChange={e => setNewOrderCustName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Client Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98230 11223"
                    value={newOrderCustPhone}
                    onChange={e => setNewOrderCustPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Client Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={newOrderCustEmail}
                  onChange={e => setNewOrderCustEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Jewellery Type *</label>
                  <select
                    value={newOrderJewelleryType}
                    onChange={e => setNewOrderJewelleryType(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Necklace Set">Necklace Set</option>
                    <option value="Polki Choker">Polki Choker</option>
                    <option value="Bridal Haar">Bridal Haar</option>
                    <option value="Solitaire Ring">Solitaire Ring</option>
                    <option value="Gold Bangles">Gold Bangles</option>
                    <option value="Kundan Earrings">Kundan Earrings</option>
                    <option value="Diamond Pendant">Diamond Pendant</option>
                    <option value="Bespoke Jewellery">Bespoke Jewellery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Gold Purity *</label>
                  <select
                    value={newOrderPurity}
                    onChange={e => setNewOrderPurity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="22K Gold">22K Gold</option>
                    <option value="18K Gold">18K Gold</option>
                    <option value="24K Gold">24K Gold</option>
                    <option value="950 Platinum">950 Platinum</option>
                    <option value="925 Silver">925 Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Est. Weight (Grams)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newOrderWeight}
                    onChange={e => setNewOrderWeight(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Total Order Amount (₹) *</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newOrderTotal}
                    onChange={e => setNewOrderTotal(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 text-amber-300 font-bold font-mono rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Advance Amount Deposited (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newOrderAdvance}
                    onChange={e => setNewOrderAdvance(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 text-emerald-400 font-bold font-mono rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Payment Mode</label>
                  <select
                    value={newOrderPayMethod}
                    onChange={e => setNewOrderPayMethod(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="UPI / Cash">UPI / Cash</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Bank NEFT / RTGS">Bank NEFT / RTGS</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Target Delivery Date</label>
                  <input
                    type="date"
                    value={newOrderDeliveryDate}
                    onChange={e => setNewOrderDeliveryDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 text-stone-100 font-mono rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingNewOrder}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Order to Order Book & Issue ERP Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Details Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-lg w-full p-6 text-stone-100 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <span className="font-mono text-amber-300 font-bold text-xs">{editingOrder.orderNumber}</span>
                <h3 className="text-base font-serif text-amber-200 font-bold">Edit Order Specifications</h3>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Total Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editTotalAmount}
                    onChange={e => setEditTotalAmount(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 text-amber-300 font-bold rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Advance Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={editAdvancePaid}
                    onChange={e => setEditAdvancePaid(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 text-emerald-400 font-bold rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Target Delivery Date</label>
                <input
                  type="date"
                  value={editDeliveryDate}
                  onChange={e => setEditDeliveryDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 text-stone-100 font-mono rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Order Status</label>
                  <select
                    value={editOrderStatus}
                    onChange={e => setEditOrderStatus(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Approved">Approved</option>
                    <option value="In Production">In Production</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-semibold">Current ERP Stage</label>
                  <select
                    value={editCurrentStage}
                    onChange={e => setEditCurrentStage(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
                  >
                    <option value="Order Received">Order Received</option>
                    <option value="Jewellery Designing">Jewellery Designing</option>
                    <option value="Gold Procurement">Gold Procurement</option>
                    <option value="Stone Setting">Stone Setting</option>
                    <option value="Polishing">Polishing</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Save Changes to Order Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Ledger Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-stone-900 border border-emerald-900/60 rounded-3xl max-w-md w-full p-6 text-stone-100 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-xs">{paymentModalOrder.orderNumber}</span>
                <h3 className="text-base font-serif text-amber-200 font-bold">Record Customer Payment</h3>
              </div>
              <button onClick={() => setPaymentModalOrder(null)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Payment Amount Collected (₹) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payAmountInput}
                  onChange={e => setPayAmountInput(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 text-emerald-400 font-bold font-mono text-base rounded-xl px-3 py-2.5"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Payment Mode</label>
                <select
                  value={payModeInput}
                  onChange={e => setPayModeInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
                >
                  <option value="Cash">Cash at Counter</option>
                  <option value="UPI / QR Code">UPI / QR Code</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Bank Wire / RTGS">Bank Wire / RTGS</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Transaction / Receipt Ref No.</label>
                <input
                  type="text"
                  placeholder="e.g. TXN98127391823"
                  value={payRefInput}
                  onChange={e => setPayRefInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Payment Remarks</label>
                <input
                  type="text"
                  value={payRemarksInput}
                  onChange={e => setPayRemarksInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Record Payment & Update Remaining Balance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Advance Stage Modal */}
      {stageModalOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-stone-900 border border-amber-900/60 rounded-3xl max-w-md w-full p-6 text-stone-100 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <span className="font-mono text-amber-300 font-bold text-xs">{stageModalOrder.orderNumber}</span>
                <h3 className="text-base font-serif text-amber-200 font-bold">Advance Manufacturing Stage</h3>
              </div>
              <button onClick={() => setStageModalOrder(null)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Manufacturing Stage</label>
                <select
                  value={stageNameSelect}
                  onChange={e => setStageNameSelect(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                >
                  <option value="Order Received">1. Order Received</option>
                  <option value="Jewellery Designing">2. Jewellery Designing (CAD 3D Layout)</option>
                  <option value="Gold Procurement">3. Gold Procurement & Melting</option>
                  <option value="Stone Setting">4. Gemstone & Diamond Setting</option>
                  <option value="Polishing">5. Hand Polishing & Finishing</option>
                  <option value="Quality Check">6. BIS Hallmark & Quality Check</option>
                  <option value="Ready for Pickup">7. Ready for Showroom Pickup</option>
                  <option value="Delivered">8. Delivered to Client</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">Artisan Remarks / Milestone Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 22K Gold hallmarking verified by BIS Jaipur station."
                  value={stageRemarksInput}
                  onChange={e => setStageRemarksInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Update Stage & Notify Client
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
