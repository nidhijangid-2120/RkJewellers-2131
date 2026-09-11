import React, { useState } from 'react';
import { initialFaqs } from '../data/seedData.js';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2 border-b border-stone-800 pb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Clear Answers
          </span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">Frequently Asked Questions</h1>
          <p className="text-xs text-stone-400">Everything you need to know about hallmarking, insured shipping, returns and custom orders.</p>
        </div>

        <div className="space-y-4">
          {initialFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={faq.id}
                className="bg-stone-900 border border-amber-900/40 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-sm font-semibold text-amber-200 hover:text-amber-300 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-stone-300 leading-relaxed border-t border-stone-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
