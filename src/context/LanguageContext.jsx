import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    home: 'Home',
    catalogue: 'Jewellery Catalogue',
    dashboard: 'Dashboard',
    my_orders: 'My Orders',
    favorites: 'Favorites',
    shortlisted_designs: 'My Shortlisted Designs',
    messages: 'Messages',
    bills: 'My Bills',
    profile: 'Profile',
    support: 'Support & Help Desk',
    logout: 'Logout',
    login: 'Login / Register',
    gold_rate: "Today's Gold Rate",
    silver_rate: "Today's Silver Rate",
    per_gram: 'per gram',
    welcome_back: 'Welcome Back',
    active_orders: 'Active Orders',
    pending_orders: 'Pending Orders',
    completed_orders: 'Completed Orders',
    latest_notification: 'Latest Notification',
    quick_actions: 'Quick Action Navigation',
    request_design: 'Request This Design',
    saved_for_showroom: 'Saved for Showroom Visit',
    visit_store: 'Visit RK Jewellers Showroom to book orders',
    estimated_price: 'Estimated Price',
    approx_weight: 'Approx Weight',
    metal_purity: 'Metal & Purity',
    view_details: 'View Details & Specs',
    product_code: 'Product Code',
    disclaimer: 'Prices are approximate and may vary according to the live market rate, making charges, and stone selection.',
    available_custom: 'Available for Custom Order',
    contact_jewellers: 'Contact RK Jewellers',
    search_placeholder: 'Search jewellery by name, SKU or metal...',
    category: 'Category',
    all_categories: 'All Categories',
    add_favorite: 'Save Design to Favorites',
    remove_favorite: 'Remove from Favorites',
    design_request_sent: 'Design Request Sent Successfully!',
    design_request_desc: 'Admin has been notified of your interest. Show this code when you visit RK Jewellers showroom.',
    notes_optional: 'Optional Notes / Customization Request',
    submit_request: 'Submit Design Request to Admin',
    no_favorites: 'No Shortlisted Designs Saved Yet',
    no_favorites_desc: 'Browse our jewellery catalogue and tap the heart icon on any design to save it for your showroom visit.',
    admin_panel: 'Admin Panel',
    custom_cad: 'Custom CAD Design',
    live_rates: 'Live Market Rates',
    phone_contact: 'Call Showroom',
    address_showroom: 'RK Jewellers, Johari Bazar, Jaipur',
    client_id: 'Client ID',
    total_balance_due: 'Total Balance Due',
    fully_settled: 'Fully Settled',
  },
  hi: {
    home: 'होम',
    catalogue: 'आभूषण सूची',
    dashboard: 'डैशबोर्ड',
    my_orders: 'मेरे ऑर्डर',
    favorites: 'पसंदीदा डिज़ाइन',
    shortlisted_designs: 'पसंदीदा शॉर्टलिस्ट डिज़ाइन',
    messages: 'संदेश',
    bills: 'मेरे बिल',
    profile: 'प्रोफ़ाइल',
    support: 'सहायता केंद्र',
    logout: 'लॉगआउट',
    login: 'लॉगिन / पंजीकरण',
    gold_rate: 'आज का सोने का भाव',
    silver_rate: 'आज का चाँदी का भाव',
    per_gram: 'प्रति ग्राम',
    welcome_back: 'पुनः स्वागत है',
    active_orders: 'सक्रिय ऑर्डर',
    pending_orders: 'लंबित ऑर्डर',
    completed_orders: 'पूरे किए गए ऑर्डर',
    latest_notification: 'नवीनतम सूचना',
    quick_actions: 'त्वरित सेवाएँ',
    request_design: 'इस डिज़ाइन की पूछताछ करें',
    saved_for_showroom: 'शोरूम विजिट के लिए सहेजा गया',
    visit_store: 'ऑर्डर बुक करने के लिए RK ज्वैलर्स शोरूम पर पधारें',
    estimated_price: 'अनुमानित कीमत',
    approx_weight: 'अनुमानित वजन',
    metal_purity: 'धातु और शुद्धता',
    view_details: 'विवरण और स्पेसिफिकेशन देखें',
    product_code: 'उत्पाद कोड',
    disclaimer: 'कीमतें अनुमानित हैं और लाइव बाज़ार दर, मेकिंग चार्ज और पत्थरों के चयन के अनुसार बदल सकती हैं।',
    available_custom: 'कस्टम ऑर्डर के लिए उपलब्ध',
    contact_jewellers: 'RK ज्वैलर्स से संपर्क करें',
    search_placeholder: 'आभूषण नाम, कोड या धातु से खोजें...',
    category: 'श्रेणी',
    all_categories: 'सभी श्रेणियाँ',
    add_favorite: 'पसंदीदा में सहेजें',
    remove_favorite: 'पसंदीदा से हटाएं',
    design_request_sent: 'डिज़ाइन पूछताछ सफलतापूर्वक भेजी गई!',
    design_request_desc: 'एडमिन को आपकी रुचि की सूचना दे दी गई है। RK ज्वैलर्स शोरूम आने पर यह कोड दिखाएं।',
    notes_optional: 'वैकल्पिक टिप्पणी / अनुकूलन अनुरोध',
    submit_request: 'एडमिन को डिज़ाइन अनुरोध भेजें',
    no_favorites: 'अभी कोई शॉर्टलिस्ट डिज़ाइन नहीं सहेजा गया',
    no_favorites_desc: 'हमारी आभूषण सूची देखें और शोरूम विजिट के लिए सहेजने हेतु दिल के आइकन पर टैप करें।',
    admin_panel: 'एडमिन पैनल',
    custom_cad: 'कस्टम कैड डिज़ाइन',
    live_rates: 'लाइव बाज़ार भाव',
    phone_contact: 'शोरूम को कॉल करें',
    address_showroom: 'RK ज्वैलर्स, जोहरी बाज़ार, जयपुर',
    client_id: 'ग्राहक आईडी',
    total_balance_due: 'कुल शेष राशि',
    fully_settled: 'पूर्ण चुकता',
  }
};

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('rk_language');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('rk_language', lang);
  };

  const t = (key, fallback) => {
    return translations[language]?.[key] || translations['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
