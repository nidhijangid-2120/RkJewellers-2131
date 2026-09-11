import React, { useState } from 'react';
import { Sliders, RefreshCw, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export const CalculatorPage = () => {
  const { goldRate, formatPrice, calculateItemPrice } = useStore();

  const [weight, setWeight] = useState(25);
  const [purity, setPurity] = useState('22K');
  const [makingPct, setMakingPct] = useState(12);
  const [diamondCarat, setDiamondCarat] = useState(0);

  const goldVal = calculateItemPrice(weight, purity, makingPct);
  const diamondVal = Math.round(diamondCarat * 180000);
  const netSubtotal = goldVal + diamondVal;
  const gstVal = Math.round(netSubtotal * 0.03);
  const totalVal = netSubtotal + gstVal;

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2 border-b border-stone-800 pb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sliders className="w-4 h-4" /> Live Bullion Pricing Engine
          </span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">
            Interactive Gold & Jewellery Price Estimator
          </h1>
          <p className="text-xs text-stone-400 max-w-xl mx-auto">
            Calculate exact gold weight value, making charges, diamond additions, and 3% GST using RK Jewellers benchmark market rates.
          </p>
        </div>

        {/* Live Rates Ticker Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-900 border border-amber-900/40 p-4 rounded-2xl text-center">
          <div>
            <p className="text-[10px] text-stone-400 uppercase">24K Bullion Rate</p>
            <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">{formatPrice(goldRate.gold24k)}/g</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase">22K Hallmarked Gold</p>
            <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">{formatPrice(goldRate.gold22k)}/g</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase">18K Diamond Setting</p>
            <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">{formatPrice(goldRate.gold18k)}/g</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase">925 Sterling Silver</p>
            <p className="text-sm font-bold text-amber-300 font-mono mt-0.5">{formatPrice(goldRate.silver925)}/g</p>
          </div>
        </div>

        {/* Calculator Inputs Card */}
        <div className="bg-stone-900 border border-amber-900/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-2">Net Gold Weight (Grams)</label>
              <input 
                type="number" 
                min="1" 
                max="500"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 text-sm font-bold text-amber-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none"
              />
              <input 
                type="range" 
                min="1" 
                max="200" 
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer mt-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-2">Metal Purity Standard</label>
              <select 
                value={purity}
                onChange={e => setPurity(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 text-xs text-stone-200 rounded-xl px-4 py-3.5 focus:border-amber-400 focus:outline-none"
              >
                <option value="24K">24K Bullion (99.9% Pure)</option>
                <option value="22K">22K Hallmarked Gold (91.6% Pure)</option>
                <option value="18K">18K Diamond Setting (75.0% Pure)</option>
                <option value="14K">14K Daily Wear (58.5% Pure)</option>
                <option value="925 Silver">925 Sterling Silver</option>
                <option value="950 Platinum">950 Platinum</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-2">Making Charges (%)</label>
              <input 
                type="range" 
                min="6" 
                max="22" 
                value={makingPct}
                onChange={e => setMakingPct(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer mb-2"
              />
              <p className="text-xs text-stone-400 text-right font-bold text-amber-300">{makingPct}%</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-2">Diamond Addition (Carats)</label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="10"
                value={diamondCarat}
                onChange={e => setDiamondCarat(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 text-sm font-bold text-amber-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:outline-none"
              />
            </div>

          </div>

          {/* Breakdown Results */}
          <div className="bg-stone-950 border border-amber-500/30 p-6 rounded-2xl space-y-3 text-xs">
            <h4 className="font-serif font-bold text-amber-200 text-sm border-b border-stone-800 pb-2">Estimated Price Breakdown</h4>
            <div className="flex justify-between text-stone-300">
              <span>Gold / Metal Base Value:</span>
              <span className="font-mono">{formatPrice(goldVal)}</span>
            </div>
            {diamondVal > 0 && (
              <div className="flex justify-between text-stone-300">
                <span>Diamond Addition ({diamondCarat} Ct):</span>
                <span className="font-mono">{formatPrice(diamondVal)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-300">
              <span>Making Charge ({makingPct}%):</span>
              <span className="font-mono">{formatPrice(Math.round(goldVal * (makingPct / 100)))}</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>GST (3%):</span>
              <span className="font-mono">{formatPrice(gstVal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-amber-300 border-t border-stone-800 pt-3">
              <span>Estimated Total Value:</span>
              <span className="text-lg font-mono">{formatPrice(totalVal)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
