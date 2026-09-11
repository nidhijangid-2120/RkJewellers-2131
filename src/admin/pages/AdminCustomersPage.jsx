import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserX, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminCustomersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        // Fallback demo users
        setUsers([
          { id: 'usr-admin', name: 'RK Master Admin', email: 'admin@rkjewellers.com', phone: '+91 9876543210', role: 'admin', createdAt: '2025-01-01T00:00:00Z' },
          { id: 'usr-demo', name: 'Nidhi Sharma', email: 'user@rkjewellers.com', phone: '+91 9823011223', role: 'user', createdAt: '2025-02-14T00:00:00Z' },
          { id: 'usr-102', name: 'Ananya Roy', email: 'ananya.roy@gmail.com', phone: '+91 9988112233', role: 'user', createdAt: '2025-03-10T00:00:00Z' },
          { id: 'usr-103', name: 'Vikramaditya Singh', email: 'vikram.singh@royalheritage.in', phone: '+91 9771122334', role: 'super_admin', createdAt: '2025-01-10T00:00:00Z' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const handleRoleChange = async (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const filteredUsers = (users || []).filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Customers & User Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registered clients, roles (User / Admin / Super Admin), and account suspensions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Client Name or Email..."
            className="w-full bg-[#FAF7F0] border border-[#E6DFD5] rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-[#701a2b] focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Directory Table & Mobile Cards */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View Card List */}
        <div className="block md:hidden divide-y divide-[#E6DFD5]">
          {filteredUsers.map(u => (
            <div key={u.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#701a2b]/10 text-[#701a2b] font-bold flex items-center justify-center text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                  </div>
                </div>

                {u.isBlocked ? (
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase">
                    Suspended
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase">
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E6DFD5] text-xs">
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-mono block">Role</label>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="bg-[#FAF7F0] border border-[#E6DFD5] text-[#701a2b] text-xs font-mono font-bold rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <button
                  onClick={() => handleToggleBlock(u.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    u.isBlocked 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {u.isBlocked ? 'Unblock Client' : 'Suspend Access'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF7F0] text-slate-600 text-[10px] uppercase font-mono tracking-wider border-b border-[#E6DFD5]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#701a2b]/10 text-[#701a2b] font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono">
                    <p className="text-slate-800">{u.email}</p>
                    <p className="text-[10px] text-slate-500">{u.phone || 'N/A'}</p>
                  </td>

                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="bg-[#FAF7F0] border border-[#E6DFD5] text-[#701a2b] text-xs font-mono font-bold rounded-lg px-2.5 py-1 focus:outline-none"
                    >
                      <option value="user">User (Customer)</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>

                  <td className="p-4">
                    {u.isBlocked ? (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                        Suspended
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase">
                        Active Client
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleBlock(u.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        u.isBlocked 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {u.isBlocked ? 'Reactivate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
