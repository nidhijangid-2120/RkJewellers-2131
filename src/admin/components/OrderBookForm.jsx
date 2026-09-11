import React, { useState } from 'react';
import { Plus, Trash2, Printer, Save, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';

export const OrderBookForm = ({ onSaveSuccess, onViewSavedBills }) => {
  const { formatPrice } = useStore();

  // Header Details
  const [srNo, setSrNo] = useState(`RK-EST-${Math.floor(10000 + Math.random() * 90000)}`);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [filledByAdmin, setFilledByAdmin] = useState('Boutique Manager');

  // Today's Metal Rates
  const [goldRate10g, setGoldRate10g] = useState(74500); // e.g. 74,500 per 10g
  const [silverRate1kg, setSilverRate1kg] = useState(88000); // e.g. 88,000 per 1kg

  // Making Charges
  const [goldMakingPerGram, setGoldMakingPerGram] = useState(450);
  const [silverMakingPerGram, setSilverMakingPerGram] = useState(45);

  // Advance Payment
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Deposited Metal (Old Exchange)
  const [depGoldQty, setDepGoldQty] = useState(0);
  const [depGoldRate, setDepGoldRate] = useState(6800);
  const [depSilverQty, setDepSilverQty] = useState(0);
  const [depSilverRate, setDepSilverRate] = useState(75);

  // Items List
  const [items, setItems] = useState([
    {
      id: '1',
      description: '22K Polki Choker Set',
      metal: 'Gold',
      approxWeightGrams: 35.5,
      catalogueNo: 'RK-CAT-102'
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Rate calculations per gram
  const goldRatePerGram = (Number(goldRate10g) || 0) / 10;
  const silverRatePerGram = (Number(silverRate1kg) || 0) / 1000;

  // Calculate row estimated price
  const calculateRowPrice = (item) => {
    const weight = Number(item.approxWeightGrams || 0);
    if (item.metal === 'Gold') {
      return weight * (goldRatePerGram + Number(goldMakingPerGram || 0));
    }
    if (item.metal === 'Silver') {
      return weight * (silverRatePerGram + Number(silverMakingPerGram || 0));
    }
    if (item.metal === 'Diamond') {
      return weight * 85000; // approximate estimate
    }
    return weight * 4000; // Platinum estimate
  };

  // Summary Math
  const itemsEstimatedValue = items.reduce((sum, item) => sum + calculateRowPrice(item), 0);
  const depositedMetalValue = (Number(depGoldQty || 0) * Number(depGoldRate || 0)) + (Number(depSilverQty || 0) * Number(depSilverRate || 0));
  const totalCredit = Number(advanceAmount || 0) + depositedMetalValue;
  const balanceDue = Math.max(0, itemsEstimatedValue - totalCredit);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        metal: 'Gold',
        approxWeightGrams: 0,
        catalogueNo: ''
      }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleNewBill = () => {
    setSrNo(`RK-EST-${Math.floor(10000 + Math.random() * 90000)}`);
    setCustomerName('');
    setCustomerPhone('');
    setOrderDate(new Date().toISOString().split('T')[0]);
    setDeliveryDate('');
    setAdvanceAmount(0);
    setDepGoldQty(0);
    setDepSilverQty(0);
    setItems([
      {
        id: Date.now().toString(),
        description: '',
        metal: 'Gold',
        approxWeightGrams: 0,
        catalogueNo: ''
      }
    ]);
  };

  const handleSaveBill = async () => {
    if (!customerName || !customerPhone) {
      alert('Please fill in Customer Name and Phone Number.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        orderNumber: srNo,
        customerName,
        customerPhone,
        customerEmail: `${customerPhone.replace(/[^0-9]/g, '')}@rkjewellers.com`,
        jewelleryType: items.map(i => i.description).filter(Boolean).join(', ') || 'Custom Jewellery',
        weightGrams: items.reduce((acc, curr) => acc + Number(curr.approxWeightGrams || 0), 0),
        purity: '22K Gold & Precious Stones',
        subtotal: itemsEstimatedValue,
        discountAmount: 0,
        gstAmount: Math.round(itemsEstimatedValue * 0.03),
        totalAmount: Math.round(itemsEstimatedValue * 1.03),
        advancePaid: totalCredit,
        paymentMethod: paymentMode || 'UPI',
        deliveryDate: deliveryDate || 'As per artisan timeline',
        notes: `Gold Rate: ₹${goldRate10g}/10g | Silver Rate: ₹${silverRate1kg}/kg | Deposited Exchange: ₹${depositedMetalValue}`,
        items: items.map(i => ({
          productId: 'custom-order-item',
          productName: i.description || 'Custom Jewellery Item',
          productImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
          sku: i.catalogueNo || 'RK-CUSTOM',
          purity: i.metal,
          metal: i.metal.toLowerCase(),
          weightGrams: Number(i.approxWeightGrams || 0),
          unitPrice: calculateRowPrice(i),
          quantity: 1
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 4000);
        if (onSaveSuccess) onSaveSuccess();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save bill: ${errData.message || 'Server error'}`);
      }
    } catch (err) {
      console.error('Failed to save bill:', err);
      alert('Failed to save bill. Please verify network connection.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E6DFD5] shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-serif font-bold text-[#701a2b] flex items-center gap-2">
            RK Jewellers • Order Book & Estimate Generator
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleNewBill}
            className="px-3.5 py-2 bg-[#FAF7F0] border border-[#E6DFD5] hover:border-[#701a2b] text-slate-800 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#701a2b]" />
            <span>+ New Bill</span>
          </button>

          {onViewSavedBills && (
            <button
              onClick={onViewSavedBills}
              className="px-3.5 py-2 bg-[#FAF7F0] border border-[#E6DFD5] hover:border-[#701a2b] text-slate-800 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#701a2b]" />
              <span>Saved Bills</span>
            </button>
          )}

          <button
            onClick={handleSaveBill}
            disabled={saving}
            className="px-4 py-2 bg-[#701a2b] hover:bg-[#831e33] text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-200" />
            <span>{saving ? 'Saving...' : 'Save Bill'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 rounded-xl text-xs flex items-center gap-2 print:hidden animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="font-bold">Bill #{srNo} successfully recorded into Order Book database!</span>
        </div>
      )}

      {/* TRADITIONAL ROYAL CREAM-GOLD ORDER BOOK ESTIMATE FORM & PRINT CANVAS */}
      <div className="bg-[#FAF7F0] border-2 border-[#C5A059] rounded-2xl p-6 md:p-10 text-slate-900 shadow-2xl space-y-6 max-w-5xl mx-auto print:border-none print:shadow-none print:p-2 print:bg-white print:max-w-none print:text-black">
        
        {/* Header Header Banner */}
        <div className="text-center border-b-2 border-[#8C1D40]/30 pb-6 relative">
          <p className="text-sm font-serif font-bold text-[#8C1D40] tracking-widest">॥ श्री ॥</p>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-[#8C1D40] tracking-wider mt-1">
            RK JEWELLERS
          </h1>
          <p className="text-base font-serif text-[#8C1D40] font-bold">आर.के. ज्वेलर्स</p>
          <p className="text-xs text-stone-700 font-medium mt-1">Gulabi Market, Shahpura, Jaipur</p>
          <p className="text-xs font-serif italic text-[#8C1D40] font-bold tracking-widest mt-1">E S T I M A T E</p>

          <div className="md:absolute left-0 top-0 text-left text-xs text-stone-700 font-mono mt-4 md:mt-0 space-y-1">
            <p><strong className="text-[#8C1D40]">SR. NO. / क्रमांक:</strong> {srNo}</p>
            <p><strong className="text-[#8C1D40]">CUSTOMER P. NO.:</strong> {customerPhone || '............'}</p>
          </div>

          <div className="md:absolute right-0 top-0 text-right text-xs text-stone-700 font-mono mt-2 md:mt-0 space-y-1">
            <p><strong className="text-[#8C1D40]">M. :</strong> +91 9823011223</p>
            <p>+91 9788001122</p>
          </div>
        </div>

        {/* Two-Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Controls */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* 1. Order Details */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl space-y-3 shadow-sm">
              <h3 className="text-xs font-serif font-bold text-[#8C1D40] uppercase tracking-wider flex items-center justify-between border-b border-[#C5A059]/20 pb-1">
                <span>Order Details</span>
                <span className="text-[10px] text-stone-500 font-normal">ऑर्डर विवरण</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">Order Date</label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={e => setOrderDate(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">Delivery Target</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Today's Metal Rates */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl space-y-3 shadow-sm">
              <h3 className="text-xs font-serif font-bold text-[#8C1D40] uppercase tracking-wider border-b border-[#C5A059]/20 pb-1">
                ● TODAY'S RATE
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">GOLD RATE (₹ / 10 G)</label>
                  <input
                    type="number"
                    value={goldRate10g}
                    onChange={e => setGoldRate10g(Number(e.target.value))}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">SILVER RATE (₹ / KG)</label>
                  <input
                    type="number"
                    value={silverRate1kg}
                    onChange={e => setSilverRate1kg(Number(e.target.value))}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Making Charge */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl space-y-3 shadow-sm">
              <h3 className="text-xs font-serif font-bold text-[#8C1D40] uppercase tracking-wider border-b border-[#C5A059]/20 pb-1">
                ● MAKING CHARGE
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">GOLD — MAKING (₹ / G)</label>
                  <input
                    type="number"
                    value={goldMakingPerGram}
                    onChange={e => setGoldMakingPerGram(Number(e.target.value))}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">SILVER — MAKING (₹ / G)</label>
                  <input
                    type="number"
                    value={silverMakingPerGram}
                    onChange={e => setSilverMakingPerGram(Number(e.target.value))}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Advance Payment */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl space-y-3 shadow-sm">
              <h3 className="text-xs font-serif font-bold text-[#8C1D40] uppercase tracking-wider border-b border-[#C5A059]/20 pb-1">
                ● ADVANCE PAYMENT
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">AMOUNT (₹)</label>
                  <input
                    type="number"
                    value={advanceAmount}
                    onChange={e => setAdvanceAmount(Number(e.target.value))}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-emerald-800 focus:outline-none focus:border-[#8C1D40]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">MODE OF PAYMENT</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#8C1D40]"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="NetBanking">NetBanking / RTGS</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Deposited Metal (Old Exchange) */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl space-y-3 shadow-sm">
              <h3 className="text-xs font-serif font-bold text-[#8C1D40] uppercase tracking-wider border-b border-[#C5A059]/20 pb-1">
                ● DEPOSITED METAL (OLD EXCHANGE)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8C1D40] mb-1">● Deposited Gold</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] uppercase text-stone-500">QUANTITY (G)</label>
                      <input
                        type="number"
                        value={depGoldQty}
                        onChange={e => setDepGoldQty(Number(e.target.value))}
                        className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:border-[#8C1D40]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-stone-500">RATE (₹ / G)</label>
                      <input
                        type="number"
                        value={depGoldRate}
                        onChange={e => setDepGoldRate(Number(e.target.value))}
                        className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:border-[#8C1D40]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8C1D40] mb-1">● Deposited Silver</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] uppercase text-stone-500">QUANTITY (G)</label>
                      <input
                        type="number"
                        value={depSilverQty}
                        onChange={e => setDepSilverQty(Number(e.target.value))}
                        className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:border-[#8C1D40]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-stone-500">RATE (₹ / G)</label>
                      <input
                        type="number"
                        value={depSilverRate}
                        onChange={e => setDepSilverRate(Number(e.target.value))}
                        className="w-full bg-[#FAF7F0] border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:border-[#8C1D40]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Items Ordered & Summary Box */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Items Ordered Table */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-1">
                <h3 className="text-xs font-serif font-bold text-[#8C1D40] uppercase tracking-wider">
                  Items Ordered <span className="text-[10px] font-normal text-stone-500">(वस्तु सूची)</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#701a2b] text-white text-[10px] font-mono uppercase tracking-wider">
                      <th className="p-2 border border-[#831e33] text-center w-8">#</th>
                      <th className="p-2 border border-[#831e33]">ITEM DESCRIPTION</th>
                      <th className="p-2 border border-[#831e33]">METAL</th>
                      <th className="p-2 border border-[#831e33] text-right">APPROX WT (G)</th>
                      <th className="p-2 border border-[#831e33]">CATALOGUE NO.</th>
                      <th className="p-2 border border-[#831e33] text-center print:hidden">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F0]/80">
                        <td className="p-2 text-center font-mono font-bold text-stone-600">{index + 1}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="e.g. Ladies ring / Choker"
                            className="w-full bg-transparent border-b border-stone-300 text-xs font-medium focus:outline-none focus:border-[#8C1D40]"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.metal}
                            onChange={e => handleItemChange(item.id, 'metal', e.target.value)}
                            className="bg-transparent border-b border-stone-300 text-xs font-medium focus:outline-none focus:border-[#8C1D40]"
                          >
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                            <option value="Diamond">Diamond</option>
                            <option value="Platinum">Platinum</option>
                          </select>
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            step="0.1"
                            value={item.approxWeightGrams}
                            onChange={e => handleItemChange(item.id, 'approxWeightGrams', Number(e.target.value))}
                            className="w-16 text-right bg-transparent border-b border-stone-300 text-xs font-mono font-bold focus:outline-none focus:border-[#8C1D40]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.catalogueNo}
                            onChange={e => handleItemChange(item.id, 'catalogueNo', e.target.value)}
                            placeholder="Cat. name/no"
                            className="w-20 bg-transparent border-b border-stone-300 text-xs font-mono text-stone-600 focus:outline-none focus:border-[#8C1D40]"
                          />
                        </td>
                        <td className="p-2 text-center print:hidden">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleAddItem}
                  className="px-3 py-1 bg-[#FAF7F0] border border-[#8C1D40] text-[#8C1D40] hover:bg-[#8C1D40] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 print:hidden cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Item</span>
                </button>
                <p className="text-[10px] italic text-stone-500">Leave design fields blank if catalogue not yet chosen</p>
              </div>
            </div>

            {/* Calculations & Final Summary Box */}
            <div className="bg-[#FFFDF9] border-2 border-[#C5A059] p-5 rounded-xl space-y-3 shadow-md">
              <div className="flex justify-between items-center text-xs font-serif font-bold text-stone-800">
                <span>Items — Estimated Value</span>
                <span className="font-mono text-base">{formatPrice(itemsEstimatedValue)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-serif font-bold text-emerald-800">
                <span>Advance Paid</span>
                <span className="font-mono text-base">{formatPrice(advanceAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-serif font-bold text-[#8C1D40]">
                <span>Deposited Metal Value</span>
                <span className="font-mono text-base">{formatPrice(depositedMetalValue)}</span>
              </div>

              <div className="border-t-2 border-dashed border-[#C5A059]/60 pt-3 flex justify-between items-center text-base font-serif font-black text-[#8C1D40]">
                <span>Balance Due</span>
                <span className="font-mono text-2xl text-[#8C1D40]">{formatPrice(balanceDue)}</span>
              </div>
            </div>

            {/* Delivery Date & Admin Sign Footer */}
            <div className="bg-[#FFFDF9] border border-[#C5A059]/40 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-stone-500">FILLED BY ADMIN:</span>
                <input
                  type="text"
                  value={filledByAdmin}
                  onChange={e => setFilledByAdmin(e.target.value)}
                  className="bg-[#FAF7F0] border border-stone-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-[#8C1D40]">Delivery Date :</span>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="bg-[#FAF7F0] border border-stone-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center border-t border-[#C5A059]/30 pt-4 text-xs font-serif font-bold text-[#8C1D40]">
          <p>नोट : हर शनिवार का अवकाश रहेगा।</p>
        </div>

      </div>
    </div>
  );
};
