import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      setSubmitted(true);
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-2 border-b border-stone-800 pb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Client Concierge</span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">Contact RK Jewellers</h1>
          <p className="text-xs text-stone-400">Schedule a private boutique appointment or inquire about custom CAD bridal designs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="bg-stone-900 border border-amber-900/40 p-8 rounded-3xl space-y-6 shadow-2xl">
            <h3 className="text-xl font-serif text-amber-200 font-bold">Flagship Boutique</h3>

            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-200">Address</h4>
                  <p className="text-stone-400">RK Jewellers Building, Turner Road, Bandra West, Mumbai, Maharashtra - 400050</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-200">Toll Free Hotline</h4>
                  <p className="text-stone-400">+91 1800 200 1990 / +91 22 2640 8890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-200">Email Concierge</h4>
                  <p className="text-stone-400">concierge@rkjewellers.com</p>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-800 pt-4 text-xs text-stone-400">
              <p><strong>Boutique Hours:</strong> Mon - Sun: 10:30 AM - 8:30 PM</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-xl font-serif text-amber-200 font-bold">Send an Inquiry</h3>

            {submitted ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-2 text-emerald-300 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="text-sm font-bold">Inquiry Sent Successfully</h4>
                <p>Our master jeweller concierge will reach out to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1">Your Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                  </div>
                  <div>
                    <label className="block text-stone-300 mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Subject</label>
                  <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Message / Consultation Details</label>
                  <textarea rows={4} required value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100" />
                </div>

                <button type="submit" className="w-full bg-amber-500 text-stone-950 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
