import React from 'react';
import { ShieldCheck, Award, RefreshCw, Truck, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-white text-[#1A1A1A] border-t border-[#E5E1DA] pt-16 pb-8">
      {/* Trust Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8 bg-[#F5F2ED] border border-[#E5E1DA]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-[#E5E1DA] text-[#C5A059]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider">100% BIS Hallmarked</h4>
              <p className="text-[11px] text-[#8A817C]">Guaranteed 22K/18K Gold purity & HUID</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-[#E5E1DA] text-[#C5A059]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider">IGI & GIA Certified</h4>
              <p className="text-[11px] text-[#8A817C]">Authentic natural solitaire certificates</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-[#E5E1DA] text-[#C5A059]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider">Lifetime Exchange</h4>
              <p className="text-[11px] text-[#8A817C]">100% benchmark gold rate buyback</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-[#E5E1DA] text-[#C5A059]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider">Insured Transit</h4>
              <p className="text-[11px] text-[#8A817C]">Dispatched via BlueDart insured express</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E5E1DA]">
        
        {/* Brand Story Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-serif text-[#1A1A1A] font-bold tracking-[0.3em] uppercase">
            RK JEWELLERS
          </h3>
          <p className="text-xs text-[#5E503F] leading-relaxed max-w-sm font-light">
            For over four decades, RK Jewellers has defined royal luxury, handcrafted perfection, and trusted purity. From majestic Rajasthani Polki bridal trunks to modern GIA certified solitaire diamonds, each piece carries an immortal legacy of Indian craftsmanship.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="#" className="p-2 border border-[#E5E1DA] bg-[#FDFCFB] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 border border-[#E5E1DA] bg-[#FDFCFB] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 border border-[#E5E1DA] bg-[#FDFCFB] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-4">Our Collections</h4>
          <ul className="space-y-2.5 text-xs text-[#5E503F]">
            <li><button onClick={() => onNavigate('shop', { category: 'bridal-collection' })} className="hover:text-[#C5A059] transition-colors">Bridal Polki Sets</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'necklaces' })} className="hover:text-[#C5A059] transition-colors">Kundan & Temple Chokers</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'rings' })} className="hover:text-[#C5A059] transition-colors">Diamond Solitaire Rings</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'earrings' })} className="hover:text-[#C5A059] transition-colors">Heritage Jhumkas</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'bangles' })} className="hover:text-[#C5A059] transition-colors">Antique Gold Kadas</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'mangalsutras' })} className="hover:text-[#C5A059] transition-colors">Modern Mangalsutras</button></li>
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-[#5E503F]">
            <li><button onClick={() => onNavigate('orders')} className="hover:text-[#C5A059] transition-colors">Track Order & Invoice</button></li>
            <li><button onClick={() => onNavigate('calculator')} className="hover:text-[#C5A059] transition-colors">Gold Rate Calculator</button></li>
            <li><button onClick={() => onNavigate('services')} className="hover:text-[#C5A059] transition-colors">Rate Lock & Digital Gold</button></li>
            <li><button onClick={() => onNavigate('faq')} className="hover:text-[#C5A059] transition-colors">FAQs & Ring Size Guide</button></li>
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#C5A059] transition-colors">Privacy & Security</button></li>
            <li><button onClick={() => onNavigate('terms')} className="hover:text-[#C5A059] transition-colors">Terms & Return Policy</button></li>
          </ul>
        </div>

        {/* Flagship Boutique Contact */}
        <div>
          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-4">Flagship Boutique</h4>
          <div className="space-y-3 text-xs text-[#5E503F]">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>RK Jewellers Building, Turner Road, Bandra West, Mumbai - 400050</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>+91 1800 200 1990 (Toll Free)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>concierge@rkjewellers.com</span>
            </p>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#8A817C]">
        <p>© 2026 RK JEWELLERS • LONDON • DUBAI • MUMBAI • SINGAPORE</p>
        <p className="mt-2 sm:mt-0 font-medium text-[#1A1A1A]">
          Crafting Legacies Since 1988
        </p>
      </div>
    </footer>
  );
};
