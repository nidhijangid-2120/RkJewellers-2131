import React, { useState } from 'react';
import { User as UserIcon, Phone, Mail, MapPin, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      fullName: user?.name || 'Nidhi Sharma',
      phone: user?.phone || '+91 9823011223',
      street: '402 Regency Heights, Bandra West',
      landmark: 'Near Turner Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      addressType: 'Home',
      isDefault: true
    }
  ]);

  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newStateStr, setNewStateStr] = useState('');
  const [newPincode, setNewPincode] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newA = {
      id: `addr-${Date.now()}`,
      fullName: name,
      phone,
      street: newStreet,
      city: newCity,
      state: newStateStr,
      pincode: newPincode,
      addressType: 'Home'
    };
    setAddresses([...addresses, newA]);
    setShowAddAddr(false);
    setNewStreet(''); setNewCity(''); setNewStateStr(''); setNewPincode('');
  };

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-stone-800 pb-4">
          <h1 className="text-2xl font-serif text-amber-200 font-bold">Client Profile & Saved Addresses</h1>
          <p className="text-xs text-stone-400 mt-1">Manage your personal information, contact details and delivery addresses.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-stone-900 border border-amber-900/40 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-serif text-amber-300 font-bold flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-amber-400" /> Account Details
          </h3>

          {savedNotice && (
            <p className="text-xs text-emerald-400 bg-emerald-950/80 p-2 rounded-lg border border-emerald-500/50">
              Profile updated successfully!
            </p>
          )}

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-300 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-300 mb-1">Email Address</label>
              <input 
                type="text" 
                disabled 
                value={user?.email || 'user@rkjewellers.com'} 
                className="w-full bg-stone-950/50 border border-stone-800 text-stone-500 rounded-xl px-3 py-2 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Address Book */}
        <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-stone-800 pb-3">
            <h3 className="text-base font-serif text-amber-300 font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" /> Delivery Address Book
            </h3>
            <button 
              onClick={() => setShowAddAddr(!showAddAddr)}
              className="text-xs text-amber-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          {showAddAddr && (
            <form onSubmit={handleAddAddress} className="bg-stone-950 p-4 border border-amber-900/50 rounded-xl space-y-3 text-xs">
              <input 
                type="text" 
                placeholder="Street / Building / Flat" 
                required
                value={newStreet}
                onChange={e => setNewStreet(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100"
              />
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="City" required value={newCity} onChange={e => setNewCity(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                <input type="text" placeholder="State" required value={newStateStr} onChange={e => setNewStateStr(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                <input type="text" placeholder="Pincode" required value={newPincode} onChange={e => setNewPincode(e.target.value)} className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
              </div>
              <button type="submit" className="bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl cursor-pointer">Save Address</button>
            </form>
          )}

          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-200">{addr.fullName} ({addr.phone})</p>
                <p className="text-stone-300">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
