import React from 'react';

export const StaticPolicyPage = ({ type }) => {
  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      text: `At RK Jewellers, we take client privacy with extreme seriousness. All financial transactions, personal address information, and custom engraving requests are protected using 256-bit SSL encryption. We never rent or sell your client data to third parties.`
    },
    terms: {
      title: 'Terms of Service & Benchmark Pricing',
      text: `All gold jewellery sold on RK Jewellers is strictly 100% BIS Hallmarked (22K 916 / 18K 750). Live benchmark prices are updated twice daily based on Indian bullion market standards. Orders locked via our Rate Lock scheme remain valid for 180 days regardless of market fluctuations.`
    },
    returns: {
      title: '15-Day Money Back & Lifetime Exchange',
      text: `We offer a 15-day no-questions-asked return policy for standard inventory items. For custom CAD designs or laser-engraved rings, our Lifetime Buyback & Exchange policy guarantees 100% gold rate value minus a minimal 2% refurbishing charge.`
    },
    shipping: {
      title: '100% Transit Insured Delivery Policy',
      text: `Every shipment leaving the RK Jewellers atelier is 100% insured until signature receipt at your doorstep. We partner exclusively with BlueDart Express and Sequel Logistics under tamper-evident sealed packaging.`
    }
  };

  const info = contentMap[type] || contentMap.privacy;

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-serif text-amber-200 font-bold border-b border-stone-800 pb-4">{info.title}</h1>
        <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl text-xs text-stone-300 leading-relaxed space-y-4">
          <p>{info.text}</p>
          <p className="text-stone-400">For further clarification, contact concierge@rkjewellers.com.</p>
        </div>
      </div>
    </div>
  );
};
