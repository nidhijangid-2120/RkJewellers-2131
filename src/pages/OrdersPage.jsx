import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Package, Download, Clock, ShieldCheck, MessageSquare, Send, FileCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useStore } from '../context/StoreContext.jsx';

export const OrdersPage = ({ onNavigate, selectedOrderId }) => {
  const { user, token } = useAuth();
  const { formatPrice } = useStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatOrderId, setActiveChatOrderId] = useState(selectedOrderId || null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchUserOrders = async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
        if (selectedOrderId) {
          setActiveChatOrderId(selectedOrderId);
        } else if (data.length > 0 && !activeChatOrderId) {
          setActiveChatOrderId(data[0].id);
        }
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user, token]);

  const handleSendMessage = async (orderId) => {
    if (!newMessage.trim() || !token) return;
    setSendingMsg(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage.trim()
        })
      });

      if (res.ok) {
        const addedMsg = await res.json();
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            return { ...o, messages: [...(o.messages || []), addedMsg] };
          }
          return o;
        }));
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleDownloadInvoicePDF = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(197, 160, 89); // gold
    doc.setFont('serif', 'bold');
    doc.setFontSize(22);
    doc.text('RK JEWELLERS', 15, 22);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(245, 242, 237);
    doc.text('OFFICIAL ESTIMATE & INSURED JEWELLERY INVOICE', 15, 30);

    // Order Info
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`INVOICE REF: INV-${order.orderNumber || order.id}`, 15, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 15, 58);
    doc.text(`Customer Name: ${order.customerName || user?.name}`, 15, 64);
    doc.text(`Phone: ${order.customerPhone || user?.phone || 'On Record'}`, 15, 70);
    doc.text(`Jewellery Type: ${order.jewelleryType || 'Custom Jewellery'} (${order.purity || '22K Gold'})`, 15, 76);

    // Items Table Header
    doc.setFillColor(197, 160, 89);
    doc.rect(15, 88, 180, 8, 'F');
    doc.setTextColor(26, 26, 26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Item Description & Metal', 18, 93);
    doc.text('Weight', 115, 93);
    doc.text('Qty', 145, 93);
    doc.text('Amount (INR)', 165, 93);

    let y = 104;
    (order.items || [{ productName: order.jewelleryType || 'Bespoke Item', unitPrice: order.totalAmount, quantity: 1 }]).forEach((item) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 26, 26);
      doc.text((item.productName || '').substring(0, 38), 18, y);
      doc.text(`${order.weightGrams || item.weightGrams || 15}g`, 115, y);
      doc.text(String(item.quantity || 1), 147, y);
      doc.text(`Rs. ${(item.unitPrice || 0).toLocaleString('en-IN')}`, 165, y);
      y += 8;
    });

    // Summary Box
    doc.line(15, y + 2, 195, y + 2);
    y += 10;
    doc.text(`Total Amount: Rs. ${(order.totalAmount || 0).toLocaleString('en-IN')}`, 125, y);
    y += 6;
    doc.text(`Advance Deposited: Rs. ${(order.advancePaid || order.totalAmount || 0).toLocaleString('en-IN')}`, 125, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Remaining Balance: Rs. ${(order.remainingAmount || 0).toLocaleString('en-IN')}`, 125, y);

    // Footer Stamp
    y += 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('100% BIS Hallmarked & Certified Craftsmanship Guarantee. Thank you for choosing RK Jewellers.', 15, y);

    doc.save(`Invoice_${order.orderNumber || order.id}.pdf`);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1A1A1A] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] bg-[#F5F2ED] px-3 py-1 rounded-full border border-[#E5E1DA]">
              Artisan Tracking Hub
            </span>
            <h1 className="text-2xl font-serif text-[#1A1A1A] font-bold mt-2">My Jewellery Orders & Support</h1>
            <p className="text-xs text-[#8A817C] mt-1">Track 8-stage manufacturing timeline, communicate directly with artisan desk & download certificates.</p>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#1A1A1A] hover:bg-[#C5A059] text-white hover:text-slate-950 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow cursor-pointer"
          >
            Explore Catalogue
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#E5E1DA] rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#701a2b]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-[#1A1A1A] font-bold">No Orders on Record</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              You haven’t placed any orders yet. Explore our royal catalogue or request a bespoke design quote with our master artisans.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#701a2b] text-white hover:bg-[#8e2137] font-bold px-6 py-2.5 rounded-full text-xs transition-all cursor-pointer shadow"
              >
                Browse Catalogue
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold px-5 py-2.5 rounded-full text-xs transition-all cursor-pointer"
              >
                Custom Design Request
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => {
              const isChatOpen = activeChatOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  className="bg-white border border-[#E5E1DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Header info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F2ED] pb-4 text-xs">
                    <div>
                      <span className="text-[10px] text-[#C5A059] uppercase font-mono font-semibold tracking-wider">Order Reference</span>
                      <p className="text-base font-bold text-[#1A1A1A] font-serif">{order.orderNumber || order.id}</p>
                      <p className="text-[11px] text-[#8A817C]">{new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                        order.orderStatus === 'Delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-[#F5F2ED] border-[#C5A059] text-[#1A1A1A]'
                      }`}>
                        Stage: {order.currentStage || order.orderStatus || 'Order Received'}
                      </span>

                      <button
                        onClick={() => handleDownloadInvoicePDF(order)}
                        className="px-3.5 py-1.5 bg-[#FAF8F5] border border-[#E5E1DA] hover:border-[#C5A059] text-[#1A1A1A] text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Tax Invoice PDF</span>
                      </button>

                      <button
                        onClick={() => setActiveChatOrderId(isChatOpen ? null : order.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isChatOpen ? 'bg-[#C5A059] text-slate-950 font-bold' : 'bg-[#1A1A1A] text-white hover:bg-[#C5A059] hover:text-slate-950'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isChatOpen ? 'Close Messages' : `Support Chat (${order.messages?.length || 0})`}</span>
                      </button>
                    </div>
                  </div>

                  {/* 8-Stage Progress Lifecycle Tracker */}
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E5E1DA] space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#1A1A1A] font-bold font-serif flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A059]" />
                        Craftsmanship & Workshop Stage Progress
                      </span>
                      <span className="text-xs text-[#5E503F] font-mono">
                        Assigned Artisan: <strong className="text-[#1A1A1A]">{order.assignedStaff || 'Master Craftsman Rajesh Sharma'}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
                      {[
                        'Order Received',
                        'Jewellery Designing',
                        'Gold Procurement',
                        'Stone Setting',
                        'Polishing',
                        'Quality Check',
                        'Ready for Pickup',
                        'Delivered'
                      ].map((stgName, idx) => {
                        const stgObj = (order.lifecycleStages || []).find(s => s.stage === stgName);
                        const isDone = stgObj ? stgObj.completed : (idx === 0);

                        return (
                          <div key={stgName} className="flex flex-col items-center text-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-colors ${
                              isDone ? 'bg-[#C5A059] text-white shadow-sm' : 'bg-white text-[#8A817C] border border-[#E5E1DA]'
                            }`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[9px] mt-1 font-semibold leading-tight ${isDone ? 'text-[#1A1A1A]' : 'text-[#8A817C]'}`}>
                              {stgName}
                            </span>
                            {stgObj?.date && (
                              <span className="text-[8px] text-[#8A817C] font-mono">{stgObj.date}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Financial Summary Line */}
                    <div className="mt-3 pt-3 border-t border-[#E5E1DA] flex flex-wrap justify-between items-center text-xs">
                      <div className="flex flex-wrap items-center gap-4 text-[11px]">
                        <span>Total Est: <strong className="text-[#1A1A1A]">{formatPrice(order.totalAmount)}</strong></span>
                        <span className="text-emerald-700 font-semibold">Advance Paid: <strong>{formatPrice(order.advancePaid || order.totalAmount)}</strong></span>
                        {(order.remainingAmount || 0) > 0 ? (
                          <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Due on Pickup: {formatPrice(order.remainingAmount)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Settled
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-[#8A817C] font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>100% BIS Hallmarked 22K/18K Gold</span>
                      </div>
                    </div>
                  </div>

                  {/* Jewellery Items List */}
                  <div className="space-y-3">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E1DA]">
                        <img src={item.productImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300'} alt={item.productName} className="w-16 h-16 object-cover rounded-xl border border-[#E5E1DA] shrink-0" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-[10px] text-[#C5A059] font-bold uppercase">{item.purity || '22K'} {item.metal || 'Gold'}</p>
                          <h4 className="font-semibold text-[#1A1A1A] truncate">{item.productName}</h4>
                          <p className="text-[#8A817C] mt-0.5">Net Wt: {order.weightGrams || item.weightGrams || 15}g • SKU: {item.sku || 'RK-BESPOKE'}</p>
                        </div>
                        <span className="text-xs font-bold text-[#1A1A1A] font-serif">{formatPrice((item.unitPrice || order.totalAmount || 0) * (item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Support Chat / Messaging Thread */}
                  {isChatOpen && (
                    <div className="bg-[#FAF8F5] border border-[#C5A059]/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-2">
                        <h4 className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                          Order Support Thread — Order #{order.orderNumber || order.id}
                        </h4>
                        <span className="text-[10px] text-[#8A817C]">Direct messaging with RK Jewellers Admin</span>
                      </div>

                      {/* Messages Stream */}
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {(!order.messages || order.messages.length === 0) ? (
                          <p className="text-xs text-[#8A817C] italic text-center py-4">No messages yet. Ask a question regarding your order manufacturing or delivery below.</p>
                        ) : (
                          order.messages.map((msg, idx) => (
                            <div 
                              key={msg.id || idx}
                              className={`flex flex-col ${msg.senderRole === 'customer' ? 'items-end' : 'items-start'}`}
                            >
                              <div className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                                msg.senderRole === 'customer' 
                                  ? 'bg-[#1A1A1A] text-white rounded-br-none' 
                                  : 'bg-white border border-[#E5E1DA] text-[#1A1A1A] rounded-bl-none shadow-sm'
                              }`}>
                                <p className="text-[10px] font-bold mb-1 opacity-80">{msg.senderName}</p>
                                <p className="leading-relaxed">{msg.message}</p>
                                <span className="text-[9px] opacity-60 mt-1 block text-right font-mono">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Message Input Form */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#E5E1DA]">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendMessage(order.id)}
                          placeholder="Type your inquiry regarding this order..."
                          className="flex-1 bg-white border border-[#E5E1DA] rounded-full px-4 py-2 text-xs text-[#1A1A1A] focus:border-[#C5A059] focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendMessage(order.id)}
                          disabled={sendingMsg || !newMessage.trim()}
                          className="bg-[#1A1A1A] hover:bg-[#C5A059] text-white hover:text-slate-950 px-4 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>Send</span>
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
