import React from 'react';
import { Sparkles, RefreshCw, TrendingUp, ShieldCheck, Check, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export const ServicesPage = ({ onNavigate }) => {
  const { services } = useStore();

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-stone-800 pb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Atelier Services</span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">Bespoke Jewellery Care & Rate Lock</h1>
          <p className="text-xs text-stone-400">
            From 3D CAD custom bridal design to guaranteed 100% gold exchange and gold rate lock schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(services || []).map(srv => (
            <div 
              key={srv.id}
              className="bg-stone-900 border border-amber-900/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={srv.bannerImage} alt={srv.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif text-amber-200 font-bold">{srv.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-stone-300 leading-relaxed">{srv.fullDescription}</p>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                  <span className="text-[11px] text-amber-400 font-semibold">100% Certified RK Atelier Quality</span>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="bg-amber-500 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Inquire Consultation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
