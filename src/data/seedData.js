export const initialGoldRate = {
  gold24k: 7450,
  gold22k: 6830,
  gold18k: 5590,
  gold14k: 4350,
  silver925: 88,
  platinum950: 3820,
  lastUpdated: new Date().toISOString(),
};

export const initialCategories = [
  {
    id: 'cat-1',
    name: 'Bridal Collection',
    slug: 'bridal-collection',
    description: 'Grand royal heritage bridal sets handcrafted in 22K gold, polki, and uncut diamonds.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    itemCount: 14,
    isFeatured: true,
  },
  {
    id: 'cat-2',
    name: 'Necklaces & Chokers',
    slug: 'necklaces',
    description: 'Intricately designed Kundan, Temple, and Diamond Solitaire Necklaces.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    itemCount: 28,
    isFeatured: true,
  },
  {
    id: 'cat-3',
    name: 'Rings & Bands',
    slug: 'rings',
    description: 'Exquisite diamond solitaires, platinum wedding bands, and cocktail gold rings.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    itemCount: 35,
    isFeatured: true,
  },
  {
    id: 'cat-4',
    name: 'Earrings & Jhumkas',
    slug: 'earrings',
    description: 'Classic chandeliers, traditional heritage Jhumkas, and daily wear diamond studs.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800',
    itemCount: 42,
    isFeatured: true,
  },
  {
    id: 'cat-5',
    name: 'Bangles & Kadas',
    slug: 'bangles',
    description: 'Hand-carved gold bangles, uncut diamond kadas, and sleek platinum bracelets.',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800',
    itemCount: 20,
    isFeatured: true,
  },
  {
    id: 'cat-6',
    name: 'Mangalsutras',
    slug: 'mangalsutras',
    description: 'Modern minimalist and traditional sacred diamond and gold Mangalsutras.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800',
    itemCount: 16,
    isFeatured: true,
  },
  {
    id: 'cat-7',
    name: 'Diamond Solitaires',
    slug: 'diamond-solitaires',
    description: 'GIA & IGI Certified natural diamond solitaires set in 18K white and rose gold.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    itemCount: 18,
    isFeatured: true,
  },
  {
    id: 'cat-8',
    name: 'Silver Artifacts & Coins',
    slug: 'silver-artifacts',
    description: 'Pure 925 sterling silver gift items, pooja thalis, and hallmarked coins.',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800',
    itemCount: 25,
    isFeatured: false,
  },
];

export const initialSubCategories = [
  { id: 'sub-1', name: 'Kundan Chokers', categoryId: 'cat-2', categoryName: 'Necklaces & Chokers', slug: 'kundan-chokers' },
  { id: 'sub-2', name: 'Temple Heritage Necklaces', categoryId: 'cat-2', categoryName: 'Necklaces & Chokers', slug: 'temple-heritage-necklaces' },
  { id: 'sub-3', name: 'Diamond Solitaire Rings', categoryId: 'cat-3', categoryName: 'Rings & Bands', slug: 'diamond-solitaire-rings' },
  { id: 'sub-4', name: 'Gold Cocktail Rings', categoryId: 'cat-3', categoryName: 'Rings & Bands', slug: 'gold-cocktail-rings' },
  { id: 'sub-5', name: 'Heritage Jhumkas', categoryId: 'cat-4', categoryName: 'Earrings & Jhumkas', slug: 'heritage-jhumkas' },
  { id: 'sub-6', name: 'Diamond Studs', categoryId: 'cat-4', categoryName: 'Earrings & Jhumkas', slug: 'diamond-studs' },
  { id: 'sub-7', name: 'Antique Gold Kadas', categoryId: 'cat-5', categoryName: 'Bangles & Kadas', slug: 'antique-gold-kadas' },
  { id: 'sub-8', name: 'Royal Bridal Sets', categoryId: 'cat-1', categoryName: 'Bridal Collection', slug: 'royal-bridal-sets' },
];

export const initialProducts = [
  {
    id: 'rk-prod-001',
    sku: 'RK-BDL-2026-01',
    name: 'The Royal Maharani 22K Gold & Polki Bridal Set',
    slug: 'royal-maharani-bridal-set',
    description: 'An ethereal masterpiece inspired by royal Rajasthani heritage. Crafted in 22K hallmarked yellow gold with hand-cut uncut diamonds (Polki), emerald drops, and freshwater pearl cluster work.',
    category: 'Bridal Collection',
    subCategory: 'Royal Bridal Sets',
    collection: 'Royal Heritage',
    metal: 'gold',
    purity: '22K',
    netWeightGrams: 148.5,
    grossWeightGrams: 162.0,
    diamondDetails: {
      carat: 12.5,
      clarity: 'VVS-VS',
      color: 'EF',
      cut: 'Uncut Polki',
      pieces: 84
    },
    makingChargesPercentage: 14,
    originalPrice: 1250000,
    discountPercentage: 5,
    calculatedPrice: 1187500,
    stock: 2,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200'
    ],
    threeSixtyImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    rating: 4.9,
    reviewCount: 18,
    gender: 'women',
    occasion: ['Wedding', 'Bridal', 'Royal Reception'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Gold Purity', value: '22K (916 BIS Hallmarked)' },
      { key: 'Gross Weight', value: '162.00 grams' },
      { key: 'Net Gold Weight', value: '148.50 grams' },
      { key: 'Gemstones', value: 'Zambian Emeralds & Pearl Clusters' },
      { key: 'Certification', value: 'SGL & BIS Hallmarked' },
      { key: 'Warranty', value: 'Lifetime Exchange & Free Maintenance' }
    ],
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'rk-prod-002',
    sku: 'RK-RNG-DMN-108',
    name: 'Eternal Promise 1.5 Carat Solitaire Diamond Ring',
    slug: 'eternal-promise-solitaire-ring',
    description: 'GIA certified 1.50 Carat brilliant round cut diamond set in a six-prong 18K white gold basket with micro-pave diamond band.',
    category: 'Rings & Bands',
    subCategory: 'Diamond Solitaire Rings',
    collection: 'Eternal Solitaires',
    metal: 'diamond',
    purity: '18K',
    netWeightGrams: 4.8,
    grossWeightGrams: 5.1,
    diamondDetails: {
      carat: 1.5,
      clarity: 'VVS1',
      color: 'D-E',
      cut: 'Excellent Triple EX',
      pieces: 1
    },
    makingChargesPercentage: 8,
    originalPrice: 480000,
    discountPercentage: 10,
    calculatedPrice: 432000,
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    rating: 5.0,
    reviewCount: 32,
    gender: 'unisex',
    occasion: ['Engagement', 'Anniversary', 'Gifting'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Metal', value: '18K White Gold (750)' },
      { key: 'Diamond Carat', value: '1.50 Ct Natural Diamond' },
      { key: 'Clarity / Color', value: 'VVS1 / D Color' },
      { key: 'Certificate', value: 'GIA Certified (Laser Inscribed)' }
    ],
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'rk-prod-003',
    sku: 'RK-JHM-GLD-402',
    name: 'Mayura Temple Craft 22K Gold Jhumka Earrings',
    slug: 'mayura-temple-craft-jhumkas',
    description: 'Glorious dancing peacock (Mayura) motifs carved in 22K antique finish gold with delicate ruby stone eye accents and cascading gold bead fringe.',
    category: 'Earrings & Jhumkas',
    subCategory: 'Heritage Jhumkas',
    collection: 'Royal Heritage',
    metal: 'gold',
    purity: '22K',
    netWeightGrams: 32.4,
    grossWeightGrams: 34.0,
    makingChargesPercentage: 12,
    originalPrice: 285000,
    discountPercentage: 8,
    calculatedPrice: 262200,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    rating: 4.8,
    reviewCount: 14,
    gender: 'women',
    occasion: ['Festive', 'Wedding', 'Puja'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Purity', value: '22K 916 BIS Hallmarked' },
      { key: 'Weight', value: '32.40 grams' },
      { key: 'Finish', value: 'Antique Nakshi Polish' }
    ],
    createdAt: '2026-02-10T10:00:00.000Z'
  },
  {
    id: 'rk-prod-004',
    sku: 'RK-MNG-DMN-008',
    name: 'Aura Modern Diamond & Gold Mangalsutra',
    slug: 'aura-modern-diamond-mangalsutra',
    description: 'Sleek contemporary 18K yellow gold pendant set with 0.65 carat VS clarity diamonds, paired with an elegant single line black bead chain.',
    category: 'Mangalsutras',
    subCategory: 'Modern Mangalsutras',
    collection: 'Modern Minimalist',
    metal: 'diamond',
    purity: '18K',
    netWeightGrams: 9.8,
    grossWeightGrams: 10.5,
    diamondDetails: {
      carat: 0.65,
      clarity: 'VS1',
      color: 'GH',
      cut: 'Very Good',
      pieces: 24
    },
    makingChargesPercentage: 10,
    originalPrice: 115000,
    discountPercentage: 12,
    calculatedPrice: 101200,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    rating: 4.9,
    reviewCount: 27,
    gender: 'women',
    occasion: ['Daily Wear', 'Work Wear', 'Anniversary'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Gold Purity', value: '18K Hallmarked Yellow Gold' },
      { key: 'Diamond Weight', value: '0.65 Ct' },
      { key: 'Chain Length', value: '18 Inches' }
    ],
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'rk-prod-005',
    sku: 'RK-KDA-GLD-882',
    name: 'Rajwada Antique Gold Kada Pair (Set of 2)',
    slug: 'rajwada-antique-gold-kada-pair',
    description: 'Sublime handcrafted 22K gold openable bangles featuring intricate Gajraj Elephant head terminals and floral Nakshi carving.',
    category: 'Bangles & Kadas',
    subCategory: 'Antique Gold Kadas',
    collection: 'Royal Heritage',
    metal: 'gold',
    purity: '22K',
    netWeightGrams: 64.2,
    grossWeightGrams: 65.5,
    makingChargesPercentage: 15,
    originalPrice: 520000,
    discountPercentage: 5,
    calculatedPrice: 494000,
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    rating: 5.0,
    reviewCount: 9,
    gender: 'women',
    occasion: ['Wedding', 'Festive'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Metal Purity', value: '22K 916 BIS Hallmarked' },
      { key: 'Set Quantity', value: '2 Pieces (Pair)' },
      { key: 'Lock Type', value: 'Screw Lock Openable' }
    ],
    createdAt: '2026-02-15T10:00:00.000Z'
  },
  {
    id: 'rk-prod-006',
    sku: 'RK-NCK-KND-501',
    name: 'Celestial Emerald & Uncut Polki Kundan Choker',
    slug: 'celestial-emerald-polki-kundan-choker',
    description: 'A regal choker necklace crafted in 22K yellow gold with gold foil backed Jadau Kundan polki and strung with genuine Zambian emerald beads.',
    category: 'Necklaces & Chokers',
    subCategory: 'Kundan Chokers',
    collection: 'Royal Heritage',
    metal: 'kundan',
    purity: '22K',
    netWeightGrams: 88.0,
    grossWeightGrams: 98.5,
    makingChargesPercentage: 16,
    originalPrice: 790000,
    discountPercentage: 7,
    calculatedPrice: 734700,
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    rating: 4.9,
    reviewCount: 11,
    gender: 'women',
    occasion: ['Wedding', 'Bridal', 'Sangeet'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Craftsmanship', value: 'Handmade Bikaner Jadau Kundan' },
      { key: 'Gemstone', value: 'Natural Zambian Emeralds' }
    ],
    createdAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'rk-prod-007',
    sku: 'RK-BND-PLT-302',
    name: 'Luxe Platinum Platinum & Diamond Couple Band Pair',
    slug: 'luxe-platinum-couple-bands',
    description: 'Pure 950 Platinum matching engagement band set with a satin brush finish and central round brilliant diamond setting.',
    category: 'Rings & Bands',
    subCategory: 'Platinum Bands',
    collection: 'Modern Minimalist',
    metal: 'platinum',
    purity: '950 Platinum',
    netWeightGrams: 14.2,
    grossWeightGrams: 14.5,
    diamondDetails: {
      carat: 0.25,
      clarity: 'VVS2',
      color: 'EF',
      cut: 'Ideal',
      pieces: 2
    },
    makingChargesPercentage: 10,
    originalPrice: 95000,
    discountPercentage: 10,
    calculatedPrice: 85500,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    rating: 4.8,
    reviewCount: 22,
    gender: 'unisex',
    occasion: ['Engagement', 'Wedding'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Purity', value: 'Pt950 (95% Pure Platinum)' },
      { key: 'Set', value: 'His & Hers Pair' }
    ],
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'rk-prod-008',
    sku: 'RK-SLV-COIN-100',
    name: 'Lakshmi Ganesh 925 Sterling Silver 100g Coin',
    slug: 'lakshmi-ganesh-925-silver-coin-100g',
    description: 'High relief 999 fine silver token depicting Goddess Lakshmi and Lord Ganesha in tamper-evident protective blister packing.',
    category: 'Silver Artifacts & Coins',
    subCategory: 'Silver Coins',
    collection: 'Divine Blessing',
    metal: 'silver',
    purity: '925 Silver',
    netWeightGrams: 100.0,
    grossWeightGrams: 100.0,
    makingChargesPercentage: 5,
    originalPrice: 12500,
    discountPercentage: 5,
    calculatedPrice: 11875,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=1200'
    ],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    rating: 4.9,
    reviewCount: 45,
    gender: 'unisex',
    occasion: ['Dhanteras', 'Diwali', 'Gifting', 'Puja'],
    bisHallmarked: true,
    certified: true,
    specifications: [
      { key: 'Silver Purity', value: '999 Fine Silver / 925 Hallmarked' },
      { key: 'Weight', value: '100 Grams' }
    ],
    createdAt: '2025-10-15T10:00:00.000Z'
  }
];

export const initialCoupons = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 25000,
    maxDiscount: 15000,
    expiryDate: '2026-12-31',
    usageCount: 142,
    maxUsage: 1000,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'ROYALBRIDAL',
    discountType: 'flat',
    discountValue: 25000,
    minOrderValue: 300000,
    expiryDate: '2026-11-30',
    usageCount: 28,
    maxUsage: 100,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'MAKINGOFF20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 50000,
    maxDiscount: 20000,
    expiryDate: '2026-09-30',
    usageCount: 65,
    maxUsage: 500,
    isActive: true
  }
];

export const initialBlogs = [
  {
    id: 'blog-1',
    title: 'The Ultimate Guide to Buying 22K vs 18K Gold Jewellery',
    slug: 'guide-buying-22k-vs-18k-gold',
    excerpt: 'Understand gold purity levels, hallmark stamps, and how to choose the right carat for daily wear versus bridal sets.',
    content: 'When selecting gold jewellery at RK Jewellers, understanding caratage is fundamental. 24K represents 99.9% pure gold, making it ideal for bullion and coins but too soft for intricate settings. 22K gold (91.6% pure) is the golden standard for Indian heritage bridal jewellery, providing rich warm yellow hues and durability. On the other hand, 18K gold (75% pure) combines gold with silver, copper, or palladium to create the strength required for diamond solitaire settings, rose gold, and modern daily wear.',
    category: 'Buying Guides',
    author: 'Rajesh Kapoor (Master Jeweller)',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    readTime: '5 min read',
    createdAt: '2026-01-20T10:00:00.000Z',
    isPublished: true
  },
  {
    id: 'blog-2',
    title: 'Bridal Jewellery Trends 2026: Polki, Chokers & Multi-Layered Royalty',
    slug: 'bridal-jewellery-trends-2026',
    excerpt: 'Discover why Bikaner Polki, emerald drops, and detachable multi-layered bridal necklaces are dominating modern royal weddings.',
    content: '2026 bridal aesthetics emphasize heirloom elegance with modular functionality. Modern brides seek statement chokers that can later be detached into subtle pendants, alongside rich emerald accents that contrast dramatically against pastel lehengas. At RK Jewellers, our Royal Heritage collection incorporates hand-cut Polki uncut diamonds set in foil-backed 22K gold.',
    category: 'Trends & Styling',
    author: 'Sunita Kapoor (Lead Stylist)',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    readTime: '4 min read',
    createdAt: '2026-02-05T10:00:00.000Z',
    isPublished: true
  }
];

export const initialTestimonials = [
  {
    id: 'test-1',
    name: 'Ananya & Vikram Singhania',
    location: 'Mumbai',
    rating: 5,
    comment: 'RK Jewellers made our wedding jewelry shopping an unforgettable experience. The custom Maharani bridal set turned heads at our reception! Pure 22K hallmarked perfection.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    purchaseItem: 'Royal Maharani Bridal Set'
  },
  {
    id: 'test-2',
    name: 'Dr. Siddharth Merchant',
    location: 'New Delhi',
    rating: 5,
    comment: 'Bought an engagement solitaire ring. The GIA certificate, laser inscription, and transparent diamond pricing made me feel 100% confident. Exceptional customer service.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    purchaseItem: '1.5 Ct Solitaire Ring'
  },
  {
    id: 'test-3',
    name: 'Pooja Agarwal',
    location: 'Jaipur',
    rating: 5,
    comment: 'The Kundan choker and antique gold kadas are true works of art. Fast insured delivery, immaculate gold weight transparency, and stunning luxury packaging!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    purchaseItem: 'Emerald Kundan Choker'
  }
];

export const initialGallery = [
  {
    id: 'gal-1',
    title: 'The Royal Maharani Bridal Trunk',
    album: 'Bridal Edit 2026',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    description: 'Full Rajasthani Heritage Polki set with emerald drops.'
  },
  {
    id: 'gal-2',
    title: 'Solitaire Diamond Majesty',
    album: 'Eternal Solitaires',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
    description: 'GIA certified 1.5 Carat Solitaires in platinum and white gold.'
  },
  {
    id: 'gal-3',
    title: 'Temple Nakshi Craftsmanship',
    album: 'Heritage Craft',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200',
    description: 'Peacock carved 22K gold temple jhumkas and necklaces.'
  }
];

export const initialServices = [
  {
    id: 'srv-1',
    title: 'Bespoke Custom Jewellery Design',
    icon: 'Sparkles',
    shortDescription: 'Collaborate with our master craftsmen to create custom 3D CAD rendered bridal and solitaire pieces.',
    fullDescription: 'Have a dream necklace or engagement ring concept? Our design atelier translates your vision into 3D CAD renders, wax models, and handcrafted 22K/18K jewellery hallmarked with precision.',
    bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'srv-2',
    title: '100% Lifetime Exchange & Buyback',
    icon: 'RefreshCw',
    shortDescription: '100% current gold market value buyback and 80% diamond value exchange guarantee on all RK Jewellers products.',
    fullDescription: 'We provide full transparency. Trade in your old RK Jewellers gold at 100% benchmark prevailing market rate, or upgrade your diamond solitaires at guaranteed buyback value anytime.',
    bannerImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'srv-3',
    title: 'Digital Gold & Gold Rate Lock Scheme',
    icon: 'TrendingUp',
    shortDescription: 'Lock in today gold rate for your upcoming wedding or monthly savings plan with zero making charge bonus.',
    fullDescription: 'Protect your future jewellery purchases against rising gold prices. Deposit monthly instalments or lock in current rate for up to 11 months, with RK Jewellers waiving up to 50% making charges at maturity.',
    bannerImage: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'srv-4',
    title: 'Jewellery Cleaning & Laser Repair',
    icon: 'ShieldCheck',
    shortDescription: 'Complimentary lifetime sonic cleaning, prong tightening, and rhodium plating at any RK Jewellers boutique.',
    fullDescription: 'Keep your fine jewellery glowing like day one. Enjoy free ultrasonic stone cleaning, laser solder repair, and platinum re-plating for life.',
    bannerImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'
  }
];

export const initialFaqs = [
  {
    id: 'faq-1',
    question: 'Are all gold products sold on RK Jewellers 100% BIS Hallmarked?',
    answer: 'Yes, every single gold piece crafted at RK Jewellers strictly conforms to Bureau of Indian Standards (BIS) Hallmarking with official 6-digit HUID laser engraving.'
  },
  {
    id: 'faq-2',
    question: 'Are diamond solitaires certified by independent laboratories?',
    answer: 'All our natural diamonds are individually certified by GIA (Gemological Institute of America) or IGI, featuring laser inscribed certificate numbers on the diamond girdle.'
  },
  {
    id: 'faq-3',
    question: 'How does the Live Gold Rate calculation work on RK Jewellers?',
    answer: 'Product prices are calculated dynamically using the formula: (Net Gold Weight x Current Benchmark Gold Rate) + Making Charges + Gemstone/Diamond Value + 3% GST. Rates update automatically.'
  },
  {
    id: 'faq-4',
    question: 'Is transit delivery insured?',
    answer: 'Yes! Every online order is 100% transit insured until signature handover at your doorstep through BlueDart Express and Sequel Logistics.'
  },
  {
    id: 'faq-5',
    question: 'What is your return and buyback policy?',
    answer: 'We offer a 15-day money-back guarantee on unused standard inventory, along with lifetime 100% benchmark value exchange on all gold purchases.'
  }
];
