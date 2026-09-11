import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Package, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const NotificationsPage = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    fetch('/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, [user, token]);

  const markAsRead = (id) => {
    if (!token) return;
    fetch(`/api/notifications/${id}/read`, { 
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      })
      .catch(() => {});
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Bell className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Customer Authentication Required</h2>
        <p className="text-sm text-[#8A817C] mt-2 mb-6">Please log in to view your account notifications.</p>
        <button
          onClick={() => onNavigate('login')}
          className="bg-[#701a2b] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white border border-[#E5E1DA] rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] bg-[#F5F2ED] px-3 py-1 rounded-full border border-[#E5E1DA]">
              Updates & Alerts
            </span>
            <h1 className="text-2xl font-serif text-[#1A1A1A] font-bold mt-2 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#C5A059]" />
              Account Notifications
            </h1>
            <p className="text-xs text-[#8A817C] mt-1">Real-time status updates from our master artisan workshop and customer support desk.</p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold text-[#1A1A1A] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer"
          >
            Dashboard <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-[#8A817C] border border-[#E5E1DA]">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E1DA] space-y-3 shadow-sm">
            <ShieldCheck className="w-12 h-12 text-[#C5A059] mx-auto opacity-50" />
            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">You&apos;re All Caught Up</h3>
            <p className="text-xs text-[#8A817C]">There are no notifications or order alerts for your account right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.orderId) {
                    onNavigate('orders', { selectedOrderId: notif.orderId });
                  }
                }}
                className={`bg-white border rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:border-[#C5A059] flex items-start gap-4 ${
                  !notif.read ? 'border-[#C5A059] bg-[#FAF8F5]' : 'border-[#E5E1DA] opacity-80'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  !notif.read ? 'bg-[#C5A059] text-white' : 'bg-[#F5F2ED] text-[#8A817C]'
                }`}>
                  <Package className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#1A1A1A] font-serif">{notif.title}</h3>
                    <span className="text-[10px] text-[#8A817C] font-mono shrink-0">
                      {new Date(notif.createdAt || Date.now()).toLocaleDateString()} {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#5E503F]">{notif.message}</p>
                  
                  {notif.orderId && (
                    <span className="text-[10px] font-bold text-[#C5A059] inline-flex items-center gap-1 pt-1">
                      View Order Details <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 self-center"></span>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
