import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, ArrowRight, Award, Star, 
  Sliders, ChevronRight, Eye, Shield, UserCheck, MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const HomePage = ({
  onNavigate,
  onOpenQuickView,
  onOpenAIStylist
}) => {
  const { user } = useAuth();
  const { products, categories, goldRate, formatPrice, calculateItemPrice } = useStore();

  // Calculator Widget local state
  const [calcWeight, setCalcWeight] = useState(10);
  const [calcPurity, setCalcPurity] = useState('22K');
  const [calcMakingPct, setCalcMakingPct] = useState(12);

  const estimatedPrice = calculateItemPrice(calcWeight, calcPurity, calcMakingPct);

  return (
    <div className="bg-[#FAF8F5] text-[#1A1A1A] min-h-screen font-sans">
      
      {/* 1. HERO SECTION WITH RICH GOLD JEWELLERY OVERLAY BACKGROUND */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4 py-16 sm:py-24 bg-[#10172A] text-white overflow-hidden">
        {/* Background Image with dark vignette overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600" 
            alt="RK Jewellers Heritage Bridal Gold Necklace" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10172A] via-[#10172A]/70 to-[#10172A]/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#E5C07B] uppercase block">
            TRUSTED FAMILY JEWELLER IN AMBER
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-wider leading-tight uppercase">
            RK JEWELLERS
          </h1>

          <p className="text-base sm:text-xl font-serif text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            Gold, silver, diamond and bridal jewellery crafted for the moments your family remembers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-[#E5C07B] hover:bg-[#d8b06b] text-[#1A1A1A] font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all shadow-md cursor-pointer"
            >
              Explore Collections
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white/90 hover:bg-white text-[#1A1A1A] font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all shadow-md cursor-pointer"
            >
              Plan a Visit
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4-COLUMN FEATURE HIGHLIGHTS BAR */}
      <section className="bg-white border-b border-[#E5E1DA] py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E5E1DA]">
          <div className="pt-4 sm:pt-0 sm:px-4">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif">22K & 24K</h3>
            <p className="text-xs sm:text-sm text-[#5E503F] mt-1 font-light">Gold jewellery options</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:px-4">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif">Custom Orders</h3>
            <p className="text-xs sm:text-sm text-[#5E503F] mt-1 font-light">Made for weddings and gifts</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:px-4">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif">Repair Care</h3>
            <p className="text-xs sm:text-sm text-[#5E503F] mt-1 font-light">Polishing, resizing and cleaning</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:px-4">
            <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif">Local Service</h3>
            <p className="text-xs sm:text-sm text-[#5E503F] mt-1 font-light">Visit us in Amber, Rajasthan</p>
          </div>
        </div>
      </section>

      {/* 3. OUR COLLECTIONS SECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#C5A059] uppercase block font-mono">
            OUR COLLECTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Jewellery for daily wear, celebrations and weddings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Card 1: Necklaces */}
          <div className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 group">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F2ED] mb-4">
              <img 
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800" 
                alt="Necklaces" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1A1A1A]">Necklaces</h3>
                <p className="text-xs text-[#5E503F] mt-2 font-light leading-relaxed">
                  Traditional and modern necklace designs for festive and bridal looks.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('shop', { category: 'necklaces' })}
                className="text-xs font-bold text-[#C5A059] hover:text-[#1A1A1A] transition-colors pt-4 block cursor-pointer"
              >
                View designs →
              </button>
            </div>
          </div>

          {/* Card 2: Earrings */}
          <div className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 group">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F2ED] mb-4">
              <img 
                src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800" 
                alt="Earrings" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1A1A1A]">Earrings</h3>
                <p className="text-xs text-[#5E503F] mt-2 font-light leading-relaxed">
                  Elegant studs, drops and statement earrings for every generation.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('shop', { category: 'earrings' })}
                className="text-xs font-bold text-[#C5A059] hover:text-[#1A1A1A] transition-colors pt-4 block cursor-pointer"
              >
                View designs →
              </button>
            </div>
          </div>

          {/* Card 3: Rings */}
          <div className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 group">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F2ED] mb-4">
              <img 
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800" 
                alt="Rings" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1A1A1A]">Rings</h3>
                <p className="text-xs text-[#5E503F] mt-2 font-light leading-relaxed">
                  Engagement, gifting and everyday rings in refined finishes.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('shop', { category: 'rings' })}
                className="text-xs font-bold text-[#C5A059] hover:text-[#1A1A1A] transition-colors pt-4 block cursor-pointer"
              >
                View designs →
              </button>
            </div>
          </div>

          {/* Card 4: Bracelets */}
          <div className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 group">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F2ED] mb-4">
              <img 
                src="https://images.unsplash.com/photo-1611591475155-4284fa2893a9?auto=format&fit=crop&q=80&w=800" 
                alt="Bracelets" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-[#1A1A1A]">Bracelets</h3>
                <p className="text-xs text-[#5E503F] mt-2 font-light leading-relaxed">
                  Comfortable bracelets and bangles with a polished premium feel.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('shop', { category: 'bangles' })}
                className="text-xs font-bold text-[#C5A059] hover:text-[#1A1A1A] transition-colors pt-4 block cursor-pointer"
              >
                View designs →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CUSTOMERS CHOOSE US SECTION */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5F1EA] rounded-3xl p-8 sm:p-12 border border-[#E5E1DA] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#C5A059] uppercase block font-mono">
              WHY CUSTOMERS CHOOSE US
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A] leading-tight">
              Personal attention, honest guidance and jewellery made to last.
            </h2>
            <p className="text-sm text-[#5E503F] leading-relaxed font-light pt-2 max-w-xl">
              Whether you are choosing a wedding set, buying a gift, or repairing a family piece, RK Jewellers helps you compare designs, understand options and select jewellery with confidence.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E1DA] font-semibold text-center text-sm sm:text-base text-[#1A1A1A] shadow-xs">
              BIS hallmark guidance
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E1DA] font-semibold text-center text-sm sm:text-base text-[#1A1A1A] shadow-xs">
              Bridal and festive sets
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E1DA] font-semibold text-center text-sm sm:text-base text-[#1A1A1A] shadow-xs">
              Custom design support
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E1DA] font-semibold text-center text-sm sm:text-base text-[#1A1A1A] shadow-xs">
              Cleaning and repair service
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER WORDS / REVIEWS SECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#C5A059] uppercase block font-mono">
            CUSTOMER WORDS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Built on trust and repeat visits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <p className="text-sm text-[#5E503F] italic leading-relaxed font-light">
              "Beautiful designs and very patient guidance while selecting wedding jewellery."
            </p>
            <p className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              - Nidhi Sharma
            </p>
          </div>

          <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <p className="text-sm text-[#5E503F] italic leading-relaxed font-light">
              "Good finishing, fair explanation and reliable service for repairs."
            </p>
            <p className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              - Rajesh Kumar
            </p>
          </div>

          <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <p className="text-sm text-[#5E503F] italic leading-relaxed font-light">
              "They helped us customize a piece exactly the way we wanted."
            </p>
            <p className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              - Anjali Mehta
            </p>
          </div>
        </div>
      </section>

      {/* 6. VISIT THE SHOP BANNER */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#10172A] text-white rounded-2xl sm:rounded-3xl p-8 sm:p-14 text-center space-y-4 shadow-lg">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#E5C07B] uppercase block">
            VISIT THE SHOP
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            See the jewellery in person at RK Jewellers.
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-light max-w-xl mx-auto">
            Main Bazaar, Amber, Rajasthan - open daily from 10:00 AM to 8:00 PM.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#E5C07B] hover:bg-[#d8b06b] text-[#1A1A1A] font-semibold text-sm px-8 py-3 rounded-full transition-all cursor-pointer shadow-md inline-block"
            >
              Get Directions
            </button>
          </div>
        </div>
      </section>

      {/* LIVE GOLD RATE CALCULATOR WIDGET SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="bg-[#F5F2ED] border border-[#E5E1DA] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 border-b border-[#E5E1DA] pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Transparent Estimation
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mt-1 font-bold">
                Live Gold & Jewellery Estimator
              </h3>
              <p className="text-xs text-[#8A817C] mt-0.5">
                Current rate benchmark: <strong>{formatPrice(goldRate.gold22k)}/g (22K)</strong>.
              </p>
            </div>

            {/* Calculated Output Box */}
            <div className="bg-white border border-[#E5E1DA] rounded-xl w-full sm:w-auto px-6 py-3 text-center sm:text-right shrink-0 shadow-xs">
              <p className="text-[10px] text-[#8A817C] uppercase tracking-wider font-semibold">Estimated Net Price</p>
              <p className="text-2xl sm:text-3xl font-serif text-[#C5A059] mt-0.5 font-bold">
                {formatPrice(estimatedPrice)}
              </p>
            </div>
          </div>

          {/* Calculator Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#1A1A1A] mb-2 font-medium">
                <span>Gold Weight</span>
                <span className="text-[#C5A059] font-bold">{calcWeight} Grams</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="150" 
                value={calcWeight}
                onChange={e => setCalcWeight(Number(e.target.value))}
                className="w-full accent-[#1A1A1A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#1A1A1A] mb-2 font-medium">
                <span>Purity Grade</span>
                <span className="text-[#C5A059] font-bold">{calcPurity}</span>
              </div>
              <select 
                value={calcPurity}
                onChange={e => setCalcPurity(e.target.value)}
                className="w-full bg-white border border-[#E5E1DA] rounded-xl text-xs text-[#1A1A1A] px-3 py-2.5 focus:outline-none uppercase font-semibold"
              >
                <option value="24K">24K Bullion (999 Pure)</option>
                <option value="22K">22K Jewellery (916 BIS Hallmarked)</option>
                <option value="18K">18K Diamond Setting (750 Gold)</option>
                <option value="14K">14K Everyday Wear (585 Gold)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider text-[#1A1A1A] mb-2 font-medium">
                <span>Making Charge</span>
                <span className="text-[#C5A059] font-bold">{calcMakingPct}%</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="20" 
                value={calcMakingPct}
                onChange={e => setCalcMakingPct(Number(e.target.value))}
                className="w-full accent-[#1A1A1A] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
