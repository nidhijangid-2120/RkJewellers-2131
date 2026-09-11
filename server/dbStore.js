import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class DatabaseStore {
  constructor() {
    this.data = {
      users: [],
      products: [],
      categories: [
        { id: 'cat-1', name: 'Bridal Collection', slug: 'bridal-collection', description: 'Grand royal heritage bridal sets handcrafted in 22K gold, polki, and uncut diamonds.', isFeatured: true },
        { id: 'cat-2', name: 'Necklaces & Chokers', slug: 'necklaces', description: 'Intricately designed Kundan, Temple, and Diamond Solitaire Necklaces.', isFeatured: true },
        { id: 'cat-3', name: 'Rings & Bands', slug: 'rings', description: 'Exquisite diamond solitaires, platinum wedding bands, and cocktail gold rings.', isFeatured: true },
        { id: 'cat-4', name: 'Earrings & Jhumkas', slug: 'earrings', description: 'Classic chandeliers, traditional heritage Jhumkas, and daily wear diamond studs.', isFeatured: true },
        { id: 'cat-5', name: 'Bangles & Kadas', slug: 'bangles', description: 'Hand-carved gold bangles, uncut diamond kadas, and sleek platinum bracelets.', isFeatured: true },
        { id: 'cat-6', name: 'Mangalsutras', slug: 'mangalsutras', description: 'Modern minimalist and traditional sacred diamond and gold Mangalsutras.', isFeatured: true },
        { id: 'cat-7', name: 'Diamond Solitaires', slug: 'diamond-solitaires', description: 'GIA & IGI Certified natural diamond solitaires set in 18K white and rose gold.', isFeatured: true },
        { id: 'cat-8', name: 'Silver Artifacts & Coins', slug: 'silver-artifacts', description: 'Pure 925 sterling silver gift items, pooja thalis, and hallmarked coins.', isFeatured: false }
      ],
      subCategories: [
        { id: 'sub-1', name: 'Kundan Chokers', categoryId: 'cat-2', categoryName: 'Necklaces & Chokers', slug: 'kundan-chokers' },
        { id: 'sub-2', name: 'Temple Heritage Necklaces', categoryId: 'cat-2', categoryName: 'Necklaces & Chokers', slug: 'temple-heritage-necklaces' },
        { id: 'sub-3', name: 'Diamond Solitaire Rings', categoryId: 'cat-3', categoryName: 'Rings & Bands', slug: 'diamond-solitaire-rings' },
        { id: 'sub-4', name: 'Gold Cocktail Rings', categoryId: 'cat-3', categoryName: 'Rings & Bands', slug: 'gold-cocktail-rings' },
        { id: 'sub-5', name: 'Heritage Jhumkas', categoryId: 'cat-4', categoryName: 'Earrings & Jhumkas', slug: 'heritage-jhumkas' },
        { id: 'sub-6', name: 'Diamond Studs', categoryId: 'cat-4', categoryName: 'Earrings & Jhumkas', slug: 'diamond-studs' },
        { id: 'sub-7', name: 'Antique Gold Kadas', categoryId: 'cat-5', categoryName: 'Bangles & Kadas', slug: 'antique-gold-kadas' },
        { id: 'sub-8', name: 'Royal Bridal Sets', categoryId: 'cat-1', categoryName: 'Bridal Collection', slug: 'royal-bridal-sets' }
      ],
      orders: [],
      payments: [],
      favorites: [],
      customRequests: [],
      notifications: [],
      reviews: [],
      contacts: [],
      activities: [],
      coupons: [],
      blogs: [],
      testimonials: [],
      gallery: [],
      services: [],
      goldRate: {
        gold24k: 7450,
        gold22k: 6830,
        gold18k: 5590,
        gold14k: 4350,
        silver925: 88,
        platinum950: 3820,
        lastUpdated: new Date().toISOString()
      }
    };

    this.load();
    this.ensureAdminUser();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.data, ...parsed };
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading database file, starting fresh:', e);
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database to file:', e);
    }
  }

  // Ensure default admin account exists for managing the platform
  ensureAdminUser() {
    const adminExists = this.data.users.some(u => u.role === 'admin' || u.role === 'super_admin');
    if (!adminExists) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('admin123', salt);
      const adminUser = {
        id: 'usr-admin-master',
        name: 'RK Master Admin',
        email: 'admin@rkjewellers.com',
        phone: '+91 9876543210',
        passwordHash: passwordHash,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      this.data.users.push(adminUser);
      this.save();
    }
  }

  // Getters for collections
  get users() { return this.data.users; }
  get products() { return this.data.products; }
  get orders() { return this.data.orders; }
  get payments() { return this.data.payments; }
  get favorites() { return this.data.favorites; }
  get customRequests() { return this.data.customRequests; }
  get notifications() { return this.data.notifications; }
  get reviews() { return this.data.reviews; }
  get contacts() { return this.data.contacts; }
  get activities() { return this.data.activities; }
  get categories() { return this.data.categories; }
  get subCategories() { return this.data.subCategories; }
  get coupons() { return this.data.coupons; }
  get blogs() { return this.data.blogs; }
  get testimonials() { return this.data.testimonials; }
  get gallery() { return this.data.gallery; }
  get services() { return this.data.services; }
  get goldRate() { return this.data.goldRate; }

  set products(val) { this.data.products = val; this.save(); }
  set categories(val) { this.data.categories = val; this.save(); }
  set subCategories(val) { this.data.subCategories = val; this.save(); }
  set coupons(val) { this.data.coupons = val; this.save(); }
  set blogs(val) { this.data.blogs = val; this.save(); }
  set gallery(val) { this.data.gallery = val; this.save(); }
  set services(val) { this.data.services = val; this.save(); }

  // Update live metal rates
  updateGoldRate(newRate) {
    this.data.goldRate = { ...this.data.goldRate, ...newRate, lastUpdated: new Date().toISOString() };
    this.save();
  }
}

export const db = new DatabaseStore();
