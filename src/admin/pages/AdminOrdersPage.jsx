import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Truck, CheckCircle2, FileText, Printer, X, ShieldCheck,
  Plus, Clock, IndianRupee, UserCheck, Layers, Paperclip, ChevronRight, Edit3, Calendar, FilePlus,
  Send, Mail, CreditCard, History, AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { OrderBookForm } from '../components/OrderBookForm.jsx';

const DEFAULT_STAGES = [
  'Order Received',
  'Jewellery Designing',
  'Gold Procurement',
  'Stone Setting',
  'Polishing',
  'Quality Check',
  'Ready for Pickup',
  'Delivered'
];

export const AdminOrdersPage = () => {
  const { formatPrice } = useStore();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [invoiceStyle, setInvoiceStyle] = useState('traditional');
  
  // Selected Order for Lifecycle & ERP Management Drawer/Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Email Reminder state
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState('');

  // Stage update input
  const [stageRemarks, setStageRemarks] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderStatus: newStatus,
          trackingNumber: `BLUEDART-${Math.floor(1000000 + Math.random() * 9000000)}`,
          courierName: 'Blue Dart Insured Express'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        if (selectedOrder && selectedOrder.id === updated.id) {
          setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleToggleLifecycleStage = async (orderId, stageName, currentlyCompleted) => {
    const remark = stageRemarks[stageName] || 'Stage updated via ERP Admin Panel';
    try {
      const res = await fetch(`/api/orders/${orderId}/lifecycle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName,
          remarks: remark,
          updatedBy: 'Boutique Master Admin',
          completed: !currentlyCompleted
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        if (selectedOrder && selectedOrder.id === updated.id) {
          setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error('Lifecycle update error:', err);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedOrder || paymentAmount <= 0) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: paymentAmount, 
          paymentMethod: paymentMethod,
          notes: paymentNotes ? `${paymentMethod}: ${paymentNotes}` : paymentMethod
        })
      });

      if (res.ok) {
        const result = await res.json();
        setOrders(prev => prev.map(o => o.id === result.order.id ? result.order : o));
        setSelectedOrder(result.order);
        setShowPaymentModal(false);
        setPaymentAmount(0);
        setPaymentNotes('');
      }
    } catch (err) {
      console.error('Record payment error:', err);
    }
  };

  const handleSendEmailReminder = async (orderId) => {
    setSendingEmail(true);
    setEmailNotice('');
    try {
      const res = await fetch(`/api/orders/${orderId}/email-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
        if (selectedOrder && selectedOrder.id === data.order.id) {
          setSelectedOrder(data.order);
        }
        setEmailNotice(`Payment reminder email successfully dispatched to ${data.order.customerEmail || data.order.customerName}!`);
        setTimeout(() => setEmailNotice(''), 5000);
      }
    } catch (err) {
      console.error('Send email reminder error:', err);
      setEmailNotice('Failed to send email reminder.');
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
                          (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
                          (o.customerEmail || '').toLowerCase().includes(search.toLowerCase()) ||
                          (o.customerPhone || '').includes(search);
    
    if (!matchesSearch) return false;

    if (tab === 'in_production') return o.orderStatus === 'In Production' || o.orderStatus === 'Pending';
    if (tab === 'ready') return o.orderStatus === 'Ready for Pickup';
    if (tab === 'delivered') return o.orderStatus === 'Delivered' || o.orderStatus === 'Completed';
    if (tab === 'outstanding') return (o.remainingAmount || 0) > 0;

    if (statusFilter) return (o.orderStatus || '').toLowerCase() === statusFilter.toLowerCase();

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            Order Book & Workshop ERP Center
            <span className="bg-[#FAF7F0] text-[#701a2b] text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 font-bold">
              Traditional & Digital
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain customer order books, record payment deposits, send reminder notices, and track 8-stage workshop production.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'create_bill' ? 'list' : 'create_bill')}
            className="bg-[#701a2b] hover:bg-[#831e33] text-amber-100 border border-[#831e33] px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2 shadow cursor-pointer"
          >
            {viewMode === 'create_bill' ? (
              <>
                <FileText className="w-4 h-4 text-amber-200" />
                <span>View Order Book Table</span>
              </>
            ) : (
              <>
                <FilePlus className="w-4 h-4 text-amber-200" />
                <span>+ New Order Book Entry</span>
              </>
            )}
          </button>

          <button 
            onClick={fetchOrders}
            className="bg-[#FAF7F0] hover:bg-[#F3EEE3] border border-[#C5A059]/40 text-[#701a2b] px-4 py-2.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Sync Order Book</span>
          </button>
        </div>
      </div>

      {viewMode === 'create_bill' ? (
        <OrderBookForm 
          onSaveSuccess={() => {
            fetchOrders();
            setViewMode('list');
          }}
          onViewSavedBills={() => setViewMode('list')}
        />
      ) : (
        <>

      {/* Tabs & Search */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${tab === 'all' ? 'bg-[#701a2b] text-white' : 'bg-[#FAF7F0] text-slate-600 hover:text-slate-900 border border-[#E6DFD5]'}`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab('in_production')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${tab === 'in_production' ? 'bg-[#701a2b] text-white' : 'bg-[#FAF7F0] text-slate-600 hover:text-slate-900 border border-[#E6DFD5]'}`}
          >
            In Production ({orders.filter(o => o.orderStatus === 'In Production' || o.orderStatus === 'Pending').length})
          </button>
          <button
            onClick={() => setTab('ready')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${tab === 'ready' ? 'bg-[#701a2b] text-white' : 'bg-[#FAF7F0] text-slate-600 hover:text-slate-900 border border-[#E6DFD5]'}`}
          >
            Ready for Pickup ({orders.filter(o => o.orderStatus === 'Ready for Pickup').length})
          </button>
          <button
            onClick={() => setTab('outstanding')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${tab === 'outstanding' ? 'bg-amber-600 text-white' : 'bg-[#FAF7F0] text-slate-600 hover:text-slate-900 border border-[#E6DFD5]'}`}
          >
            Pending Payments ({orders.filter(o => (o.remainingAmount || 0) > 0).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Order #, Client, Phone..."
            className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-[#701a2b] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders Table & Mobile View */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View Card List */}
        <div className="block xl:hidden divide-y divide-[#E6DFD5]">
          {filteredOrders.map(ord => (
            <div key={ord.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[#701a2b] font-bold text-xs">{ord.orderNumber}</span>
                  <p className="text-[10px] text-slate-500 font-mono">{new Date(ord.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="bg-[#FAF7F0] border border-[#C5A059]/40 text-[#701a2b] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C5A059]" />
                  {ord.currentStage || ord.orderStatus}
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-sm">{ord.customerName}</p>
                <p className="text-xs text-slate-500 font-mono">{ord.customerPhone}</p>
                <p className="text-xs text-slate-700 mt-1 font-serif">{ord.jewelleryType || (ord.items && ord.items[0]?.productName) || 'Custom Jewellery'}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E6DFD5]">
                <div>
                  <span className="font-serif font-bold text-slate-900">{formatPrice(ord.totalAmount)}</span>
                  {(ord.remainingAmount || 0) > 0 && (
                    <span className="text-amber-700 font-bold block text-[10px]">Due: {formatPrice(ord.remainingAmount)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="px-3 py-1.5 bg-[#701a2b] hover:bg-[#831e33] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                  <button
                    onClick={() => setInvoiceOrder(ord)}
                    className="p-1.5 bg-[#FAF7F0] text-slate-700 rounded-xl border border-[#E6DFD5] cursor-pointer"
                    title="Invoice"
                  >
                    <FileText className="w-4 h-4 text-[#701a2b]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">Order Ref #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Jewellery Specification</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Advance Paid</th>
                <th className="p-4">Remaining Balance</th>
                <th className="p-4">Production Stage</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {filteredOrders.map(ord => (
                <tr key={ord.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                  <td className="p-4 font-mono text-[#701a2b] font-bold">
                    {ord.orderNumber}
                    <p className="text-[10px] text-slate-500 font-normal">{new Date(ord.createdAt).toLocaleDateString()}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{ord.customerPhone}</p>
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="font-medium text-slate-800 truncate">{ord.jewelleryType || (ord.items && ord.items[0]?.productName) || 'Custom Jewellery'}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {ord.purity || '22K Gold'} • {ord.weightGrams ? `${ord.weightGrams}g` : 'Custom weight'}
                    </p>
                  </td>

                  <td className="p-4 font-serif font-bold text-slate-900">
                    {formatPrice(ord.totalAmount)}
                  </td>

                  <td className="p-4 text-emerald-700 font-mono font-medium">
                    {formatPrice(ord.advancePaid || ord.totalAmount)}
                  </td>

                  <td className="p-4 font-mono">
                    {(ord.remainingAmount || 0) > 0 ? (
                      <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                        Due: {formatPrice(ord.remainingAmount)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Fully Settled</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="bg-[#FAF7F0] border border-[#C5A059]/40 text-[#701a2b] px-3 py-1 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1.5 w-fit">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      {ord.currentStage || ord.orderStatus}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-[#701a2b] hover:bg-[#831e33] text-white rounded-xl font-semibold text-xs transition-colors inline-flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ERP & Ledger</span>
                    </button>

                    <button
                      onClick={() => setInvoiceOrder(ord)}
                      className="p-1.5 bg-[#FAF7F0] hover:bg-[#F3EEE3] text-slate-700 rounded-xl border border-[#E6DFD5] transition-colors inline-flex items-center cursor-pointer"
                      title="Tax Invoice"
                    >
                      <FileText className="w-4 h-4 text-[#701a2b]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

      {/* Lifecycle & Detailed Order Book Drawer/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-white border border-[#E6DFD5] text-slate-900 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#E6DFD5] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-serif font-bold text-[#701a2b]">
                    Order Book Ref: {selectedOrder.orderNumber}
                  </h3>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-mono font-bold">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Logged on {new Date(selectedOrder.createdAt).toLocaleDateString()} • Assigned Staff: {selectedOrder.assignedStaff || 'Master Artisan Team'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-500 hover:text-slate-900 bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Bar */}
            {emailNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{emailNotice}</span>
              </div>
            )}

            {/* Quick Specs & Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E6DFD5]">
                <p className="text-[10px] uppercase font-mono font-bold text-slate-500">Client Info</p>
                <p className="font-bold text-slate-900 mt-1">{selectedOrder.customerName}</p>
                <p className="text-xs text-slate-600 font-mono">{selectedOrder.customerPhone}</p>
                <p className="text-xs text-slate-500">{selectedOrder.customerEmail}</p>
              </div>

              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E6DFD5]">
                <p className="text-[10px] uppercase font-mono font-bold text-slate-500">Jewellery Specs</p>
                <p className="font-bold text-[#701a2b] mt-1">{selectedOrder.jewelleryType || 'Custom Piece'}</p>
                <p className="text-xs text-slate-700 font-mono">
                  Purity: {selectedOrder.purity || '22K'} | Weight: {selectedOrder.weightGrams || 'N/A'}g
                </p>
                <p className="text-xs text-slate-500">Target Delivery: {selectedOrder.deliveryDate || 'As scheduled'}</p>
              </div>

              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E6DFD5] flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono font-bold text-slate-500">Payment Breakdown</p>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-bold font-mono text-slate-900">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-700">
                    <span>Advance Deposited:</span>
                    <span className="font-bold font-mono">{formatPrice(selectedOrder.advancePaid || selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-amber-800">
                    <span>Remaining Balance:</span>
                    <span className="font-bold font-mono">{formatPrice(selectedOrder.remainingAmount || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {(selectedOrder.remainingAmount || 0) > 0 && (
                    <>
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="flex-1 py-1.5 bg-[#701a2b] hover:bg-[#831e33] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow cursor-pointer"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Record Deposit</span>
                      </button>

                      <button
                        onClick={() => handleSendEmailReminder(selectedOrder.id)}
                        disabled={sendingEmail}
                        className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow cursor-pointer"
                        title="Send Payment Reminder Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{sendingEmail ? 'Sending...' : 'Reminder'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* PAYMENT HISTORY LEDGER & EMAIL REMINDER LOGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment History Ledger */}
              <div className="bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-2">
                  <h4 className="font-serif font-bold text-slate-900 text-xs flex items-center gap-2">
                    <History className="w-4 h-4 text-[#701a2b]" />
                    Payment History Ledger
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">
                    Deposited: {formatPrice(selectedOrder.advancePaid || selectedOrder.totalAmount)}
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.paymentHistory && selectedOrder.paymentHistory.length > 0 ? (
                    selectedOrder.paymentHistory.map((rec, idx) => (
                      <div key={rec.id || idx} className="bg-white p-2.5 rounded-lg border border-[#E6DFD5] text-xs flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{formatPrice(rec.amount)}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{rec.date} • {rec.notes || rec.paymentMethod}</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200">
                          {rec.paymentMethod || 'Record'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-3 rounded-lg border border-[#E6DFD5] text-xs space-y-1">
                      <div className="flex justify-between font-medium text-slate-800">
                        <span>Initial Advance Deposit</span>
                        <span className="font-mono text-emerald-700">{formatPrice(selectedOrder.advancePaid || selectedOrder.totalAmount)}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Logged on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Reminders Log */}
              <div className="bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-2">
                  <h4 className="font-serif font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#701a2b]" />
                    Email Reminder Logs
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    Sent: {selectedOrder.emailRemindersSent ? selectedOrder.emailRemindersSent.length : 0}
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.emailRemindersSent && selectedOrder.emailRemindersSent.length > 0 ? (
                    selectedOrder.emailRemindersSent.map((rem, idx) => (
                      <div key={rem.id || idx} className="bg-white p-2.5 rounded-lg border border-[#E6DFD5] text-xs flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{rem.sentTo}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(rem.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-200">
                          Due: {formatPrice(rem.dueAmount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      No email reminders sent yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 8-STAGE PRODUCTION LIFECYCLE TRACKER */}
            <div className="bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#701a2b]" />
                  8-Stage Production & Workshop Lifecycle
                </h4>
                <p className="text-[11px] text-slate-600 font-mono">
                  Current Active Stage: <span className="text-[#701a2b] font-bold">{selectedOrder.currentStage || 'Order Received'}</span>
                </p>
              </div>

              <div className="space-y-3">
                {DEFAULT_STAGES.map((stageName, idx) => {
                  const stageObj = (selectedOrder.lifecycleStages || []).find(s => s.stage === stageName);
                  const isCompleted = stageObj ? stageObj.completed : false;

                  return (
                    <div 
                      key={stageName} 
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCompleted 
                          ? 'bg-white border-emerald-300 text-slate-900 shadow-sm' 
                          : 'bg-white/60 border-[#E6DFD5] text-slate-500'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleLifecycleStage(selectedOrder.id, stageName, isCompleted)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-300 hover:border-emerald-600'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div>
                            <p className={`font-semibold text-xs ${isCompleted ? 'text-slate-900' : 'text-slate-600'}`}>
                              Stage {idx + 1}: {stageName}
                            </p>
                            {stageObj && stageObj.date && (
                              <p className="text-[10px] text-slate-500 font-mono">
                                Updated: {stageObj.date} at {stageObj.time} by {stageObj.updatedBy}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Remarks Input */}
                        <div className="flex items-center gap-2 w-full sm:w-1/2">
                          <input
                            type="text"
                            placeholder="Add stage remarks / artisan notes..."
                            value={stageRemarks[stageName] !== undefined ? stageRemarks[stageName] : (stageObj?.remarks || '')}
                            onChange={e => setStageRemarks({ ...stageRemarks, [stageName]: e.target.value })}
                            className="w-full bg-white border border-[#E6DFD5] rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#701a2b]"
                          />
                          <button
                            onClick={() => handleToggleLifecycleStage(selectedOrder.id, stageName, isCompleted)}
                            className="bg-[#701a2b] hover:bg-[#831e33] text-white px-3 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 shadow cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Design Files & Hallmark Certificates */}
            <div className="bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl p-4 space-y-3">
              <h4 className="font-serif font-bold text-slate-900 text-xs flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#701a2b]" />
                Attachments & Certificates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-[#E6DFD5]">
                  <p className="font-semibold text-slate-900">CAD 3D Design File</p>
                  <p className="text-[10px] text-slate-500 mt-1">cad_render_v2.3dm</p>
                  <span className="text-[10px] text-emerald-700 font-mono mt-1 block font-semibold">✔ Approved by Client</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E6DFD5]">
                  <p className="font-semibold text-slate-900">BIS Hallmark Cert</p>
                  <p className="text-[10px] text-slate-500 mt-1">bis_hallmark_8891.pdf</p>
                  <span className="text-[10px] text-[#701a2b] font-mono mt-1 block font-semibold">✔ Verified 22K Purity</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E6DFD5]">
                  <p className="font-semibold text-slate-900">Vault Photo & QC</p>
                  <p className="text-[10px] text-slate-500 mt-1">finished_piece_macro.jpg</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Uploaded by Workshop</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Record Payment Deposit
            </h3>
            <p className="text-xs text-slate-500">
              Collect balance deposit for Order Ref <strong className="text-[#701a2b]">{selectedOrder.orderNumber}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-600 font-bold block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  placeholder={`Max due: ${selectedOrder.remainingAmount}`}
                  className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3.5 py-2 text-sm text-slate-900 font-mono font-bold focus:border-[#701a2b] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-600 font-bold block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-[#701a2b] focus:outline-none"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash">Store Cash Receipt</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="NetBanking">Net Banking / NEFT / RTGS</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-600 font-bold block mb-1">Receipt Ref / Transaction Notes</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="e.g. HDFC Cheque #9812 / Store Cash Slip #401"
                  className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:border-[#701a2b] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-1/2 py-2 bg-[#FAF7F0] border border-[#E6DFD5] text-slate-600 hover:text-slate-900 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="w-1/2 py-2 bg-[#701a2b] hover:bg-[#831e33] text-white rounded-xl font-bold text-xs transition-colors shadow cursor-pointer"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice & Traditional Estimate Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
          <div className="bg-[#FAF7F0] text-slate-900 border-2 border-[#C5A059] rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8 print:my-0 print:border-none print:shadow-none print:p-2">
            <button 
              onClick={() => setInvoiceOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 print:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Toggle Format in Modal */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A059]/30 pb-3 print:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setInvoiceStyle('traditional')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-colors cursor-pointer ${invoiceStyle === 'traditional' ? 'bg-[#701a2b] text-amber-100' : 'bg-stone-200 text-stone-700'}`}
                >
                  ॥ श्री ॥ Traditional Estimate Bill
                </button>
                <button
                  onClick={() => setInvoiceStyle('standard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${invoiceStyle === 'standard' ? 'bg-[#701a2b] text-amber-100' : 'bg-stone-200 text-stone-700'}`}
                >
                  GST Tax Invoice
                </button>
              </div>

              <button 
                onClick={() => window.print()}
                className="bg-[#C5A059] hover:bg-[#b08c48] text-slate-950 px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Download PDF</span>
              </button>
            </div>

            {invoiceStyle === 'traditional' ? (
              /* Traditional Estimate Bill Layout */
              <div className="space-y-6 font-serif">
                <div className="text-center border-b-2 border-[#8C1D40]/30 pb-4 relative">
                  <p className="text-sm font-bold text-[#8C1D40] tracking-widest">॥ श्री ॥</p>
                  <h1 className="text-3xl font-black text-[#8C1D40] tracking-wider mt-1">RK JEWELLERS</h1>
                  <p className="text-sm font-bold text-[#8C1D40]">आर.के. ज्वेलर्स</p>
                  <p className="text-xs text-stone-700 font-sans mt-0.5">Gulabi Market, Shahpura, Jaipur</p>
                  <p className="text-xs italic text-[#8C1D40] font-bold tracking-widest mt-1">E S T I M A T E</p>

                  <div className="md:absolute left-0 top-0 text-left text-xs text-stone-700 font-mono mt-2 md:mt-0 space-y-0.5">
                    <p><strong className="text-[#8C1D40]">SR. NO. / क्रमांक:</strong> {invoiceOrder.orderNumber}</p>
                    <p><strong className="text-[#8C1D40]">CUSTOMER P. NO.:</strong> {invoiceOrder.customerPhone}</p>
                  </div>

                  <div className="md:absolute right-0 top-0 text-right text-xs text-stone-700 font-mono mt-2 md:mt-0 space-y-0.5">
                    <p><strong className="text-[#8C1D40]">M. :</strong> +91 9823011223</p>
                    <p>+91 9788001122</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-3 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-[#8C1D40]">Customer Name</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{invoiceOrder.customerName}</p>
                    <p className="text-stone-600 text-[11px]">{invoiceOrder.customerEmail}</p>
                  </div>

                  <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-3 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-[#8C1D40]">Date & Delivery</p>
                    <p className="font-bold text-slate-900 mt-0.5">Order Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                    <p className="text-stone-600">Expected Delivery: {invoiceOrder.deliveryDate || 'As per artisan schedule'}</p>
                  </div>
                </div>

                {/* Items Ordered Table */}
                <div className="bg-[#FFFDF9] border border-[#C5A059]/40 rounded-xl overflow-hidden font-sans">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#701a2b] text-amber-100 text-[10px] font-mono uppercase">
                        <th className="p-2 border border-[#831e33] text-center w-8">#</th>
                        <th className="p-2 border border-[#831e33]">ITEM DESCRIPTION</th>
                        <th className="p-2 border border-[#831e33]">METAL</th>
                        <th className="p-2 border border-[#831e33] text-right">WT (G)</th>
                        <th className="p-2 border border-[#831e33] text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {(invoiceOrder.items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center font-mono font-bold text-stone-600">{idx + 1}</td>
                          <td className="p-2 font-medium">{item.productName}</td>
                          <td className="p-2 font-mono">{item.metal || 'Gold'} ({item.purity || '22K'})</td>
                          <td className="p-2 text-right font-mono font-bold">{item.weightGrams || '15.5'}g</td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900">{formatPrice(item.unitPrice * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Box */}
                <div className="bg-[#FFFDF9] border-2 border-[#C5A059] p-4 rounded-xl space-y-2 font-sans text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>Items — Estimated Value</span>
                    <span className="font-mono text-sm">{formatPrice(invoiceOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-emerald-800">
                    <span>Advance Deposited</span>
                    <span className="font-mono text-sm">{formatPrice(invoiceOrder.advancePaid || invoiceOrder.totalAmount)}</span>
                  </div>
                  <div className="border-t-2 border-dashed border-[#C5A059]/60 pt-2 flex justify-between items-center text-sm font-black text-[#8C1D40]">
                    <span>Balance Due</span>
                    <span className="font-mono text-xl text-[#8C1D40]">{formatPrice(invoiceOrder.remainingAmount || 0)}</span>
                  </div>
                </div>

                <div className="text-center pt-2 text-xs font-bold text-[#8C1D40]">
                  <p>नोट : हर शनिवार का अवकाश रहेगा।</p>
                </div>
              </div>
            ) : (
              /* Standard GST Invoice Layout */
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-widest">RK JEWELLERS</h1>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Official Tax Invoice • BIS Hallmarked</p>
                    <p className="text-xs text-slate-600 mt-1">Turner Road, Bandra West, Mumbai - 400050</p>
                    <p className="text-xs text-slate-600">GSTIN: 27AABCR8912K1ZM</p>
                  </div>

                  <div className="text-right">
                    <span className="bg-[#C5A059] text-white px-3 py-1 rounded-full font-mono text-xs font-bold">
                      {invoiceOrder.orderNumber}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Client Details</p>
                    <p className="font-bold text-slate-900 mt-1">{invoiceOrder.customerName}</p>
                    <p className="text-slate-600">{invoiceOrder.customerEmail}</p>
                    <p className="text-slate-600">{invoiceOrder.customerPhone}</p>
                  </div>

                  <div>
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Insured Shipping Address</p>
                    {invoiceOrder.shippingAddress && (
                      <p className="text-slate-600 mt-1">
                        {invoiceOrder.shippingAddress.street}, {invoiceOrder.shippingAddress.city}, {invoiceOrder.shippingAddress.state} - {invoiceOrder.shippingAddress.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <table className="w-full text-left text-xs text-slate-800 border border-slate-200">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Jewellery Description</th>
                      <th className="p-3">Purity & Metal</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(invoiceOrder.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium">{item.productName}</td>
                        <td className="p-3 font-mono text-slate-600">{item.purity || '22K'} {item.metal || 'Gold'}</td>
                        <td className="p-3 text-right font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono font-bold">{formatPrice(item.unitPrice * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                  <div className="text-[10px] text-slate-500 font-mono space-y-1">
                    <p>✔ 100% Guaranteed 22K/18K BIS Hallmarked</p>
                    <p>✔ Insured Courier: {invoiceOrder.courierName || 'Blue Dart'}</p>
                    <p>✔ Tracking Ref: {invoiceOrder.trackingNumber || 'Pending'}</p>
                  </div>

                  <div className="text-right space-y-1 text-xs">
                    <p className="text-slate-600">Subtotal: <strong className="font-mono text-slate-900">{formatPrice(invoiceOrder.subtotal)}</strong></p>
                    <p className="text-slate-600">GST (3%): <strong className="font-mono text-slate-900">{formatPrice(invoiceOrder.gstAmount)}</strong></p>
                    <p className="text-slate-600">Advance Deposited: <strong className="font-mono text-emerald-600">{formatPrice(invoiceOrder.advancePaid || invoiceOrder.totalAmount)}</strong></p>
                    <p className="text-base font-serif font-bold text-slate-900 border-t border-slate-200 pt-1">
                      Remaining Due: {formatPrice(invoiceOrder.remainingAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
