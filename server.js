import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './server/dbStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rk-jewellers-heritage-royal-secret-key-2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Helper for signing JWT tokens
  const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  };

  // -------------------------------------------------------------
  // AUTHENTICATION MIDDLEWARES
  // -------------------------------------------------------------
  
  // Customer Auth Middleware
  const authenticateCustomer = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User session invalid. Please log in again.' });
      }
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Account has been suspended.' });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired session token.' });
    }
  };

  // Optional Customer Auth (attaches req.user if token provided)
  const optionalCustomerAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = db.users.find(u => u.id === decoded.id);
        if (user && !user.isBlocked) {
          req.user = user;
        }
      } catch {
        // Continue without auth
      }
    }
    next();
  };

  // Admin Auth Middleware
  const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Admin authentication required.' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const admin = db.users.find(u => u.id === decoded.id && (u.role === 'admin' || u.role === 'super_admin'));
      if (!admin) {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
      }
      req.admin = admin;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired admin session token.' });
    }
  };

  // -------------------------------------------------------------
  // 1. PUBLIC & AUTHENTICATION APIs
  // -------------------------------------------------------------

  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      store: 'RK Jewellers', 
      timestamp: new Date().toISOString(),
      userCount: db.users.filter(u => u.role === 'user').length,
      productCount: db.products.length,
      orderCount: db.orders.length
    });
  });

  // Customer Registration
  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password, address } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ message: 'Name, contact info (Email or Mobile), and password are required.' });
    }

    // Check if user already exists
    const existing = db.users.find(u => 
      (email && u.email && u.email.toLowerCase() === email.toLowerCase()) ||
      (phone && u.phone && u.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
    );

    if (existing) {
      return res.status(409).json({ message: 'An account with this email or mobile number already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: (email || '').trim().toLowerCase(),
      phone: (phone || '').trim(),
      address: address || '',
      passwordHash: passwordHash,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    db.save();

    // Log Activity
    db.activities.unshift({
      id: `act-${Date.now()}`,
      customerName: newUser.name,
      customerEmail: newUser.email,
      action: 'Registered new customer account',
      timestamp: new Date().toISOString()
    });
    db.save();

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name });

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser
    });
  });

  // Customer Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide Email/Mobile and Password.' });
    }

    const cleanInput = email.trim();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    const user = db.users.find(u => {
      const emailMatches = u.email && u.email.toLowerCase() === cleanInput.toLowerCase();
      const phoneMatches = u.phone && cleanDigits && u.phone.replace(/\D/g, '') === cleanDigits;
      return emailMatches || phoneMatches;
    });

    if (!user) {
      return res.status(401).json({ message: 'No account found with this Email or Mobile Number. Please register.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is suspended. Please contact RK Jewellers support.' });
    }

    // Verify Password
    const isMatch = user.passwordHash ? bcrypt.compareSync(password, user.passwordHash) : false;
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

    const safeUser = { ...user };
    delete safeUser.passwordHash;

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  });

  // Get Current Customer Profile
  app.get('/api/auth/me', authenticateCustomer, (req, res) => {
    const safeUser = { ...req.user };
    delete safeUser.passwordHash;
    res.json({ user: safeUser });
  });

  // Update Customer Profile
  app.put('/api/auth/profile', authenticateCustomer, (req, res) => {
    const { name, phone, address, city, state, pincode } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (pincode) user.pincode = pincode;
    user.updatedAt = new Date().toISOString();

    db.save();

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    res.json({ message: 'Profile updated successfully', user: safeUser });
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    const admin = db.users.find(u => 
      (u.role === 'admin' || u.role === 'super_admin') && 
      (u.email?.toLowerCase() === email.trim().toLowerCase() || u.phone === email.trim())
    );

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials or unauthorized account.' });
    }

    const isMatch = admin.passwordHash ? bcrypt.compareSync(password, admin.passwordHash) : false;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin password.' });
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role, name: admin.name });

    const safeAdmin = { ...admin };
    delete safeAdmin.passwordHash;

    res.json({
      message: 'Admin authorization successful',
      token,
      user: safeAdmin
    });
  });

  // Admin Verify Session
  app.get('/api/admin/me', authenticateAdmin, (req, res) => {
    const safeAdmin = { ...req.admin };
    delete safeAdmin.passwordHash;
    res.json({ user: safeAdmin });
  });

  // -------------------------------------------------------------
  // 2. METALS & CATALOGUE (PUBLIC / STOREFRONT)
  // -------------------------------------------------------------

  app.get('/api/rates', (req, res) => {
    res.json(db.goldRate);
  });

  app.get('/api/categories', (req, res) => {
    res.json(db.categories);
  });

  app.get('/api/subcategories', (req, res) => {
    res.json(db.subCategories);
  });

  app.get('/api/products', (req, res) => {
    const { category, featured, search, metal, purity, minPrice, maxPrice } = req.query;
    let list = [...db.products];

    if (category && category !== 'all') {
      list = list.filter(p => p.categorySlug === category || p.category === category || p.categoryName === category);
    }
    if (featured === 'true') {
      list = list.filter(p => p.isFeatured);
    }
    if (metal) {
      list = list.filter(p => p.metal?.toLowerCase() === metal.toLowerCase());
    }
    if (purity) {
      list = list.filter(p => p.purity?.toLowerCase() === purity.toLowerCase());
    }
    if (minPrice) {
      list = list.filter(p => (p.calculatedPrice || p.price || 0) >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => (p.calculatedPrice || p.price || 0) <= Number(maxPrice));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find(p => p.id === req.params.id || p.sku === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Jewellery design not found in catalogue.' });
    }
    res.json(product);
  });

  app.get('/api/blogs', (req, res) => res.json(db.blogs));
  app.get('/api/services', (req, res) => res.json(db.services));
  app.get('/api/gallery', (req, res) => res.json(db.gallery));
  app.get('/api/coupons', (req, res) => res.json(db.coupons));
  app.get('/api/testimonials', (req, res) => res.json(db.testimonials));

  // -------------------------------------------------------------
  // 3. USER-SPECIFIC DATA (ORDERS, FAVORITES, NOTIFICATIONS)
  // -------------------------------------------------------------

  // Get Customer Orders (Strictly isolated by req.user.id)
  app.get('/api/orders', authenticateCustomer, (req, res) => {
    const userOrders = db.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
  });

  // Get Single Order
  app.get('/api/orders/:id', authenticateCustomer, (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  });

  // Post Customer Message to Order Timeline
  app.post('/api/orders/:id/messages', authenticateCustomer, (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      orderId: order.id,
      senderRole: 'customer',
      senderName: req.user.name,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    if (!order.messages) order.messages = [];
    order.messages.push(newMsg);
    db.save();

    // Log admin notification & activity
    db.activities.unshift({
      id: `act-${Date.now()}`,
      customerName: req.user.name,
      customerEmail: req.user.email,
      action: `Sent message regarding Order #${order.orderNumber || order.id}: "${message.trim()}"`,
      timestamp: new Date().toISOString()
    });
    db.save();

    res.status(201).json(newMsg);
  });

  // Customer Favorites
  app.get('/api/favorites', authenticateCustomer, (req, res) => {
    const userFavs = db.favorites.filter(f => f.userId === req.user.id);
    res.json(userFavs);
  });

  app.post('/api/favorites', authenticateCustomer, (req, res) => {
    const { product } = req.body;
    if (!product || !product.id) {
      return res.status(400).json({ message: 'Product object with valid id is required.' });
    }

    const existingIndex = db.favorites.findIndex(f => f.userId === req.user.id && f.product?.id === product.id);
    if (existingIndex > -1) {
      // Remove
      db.favorites.splice(existingIndex, 1);
      db.save();
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      // Add
      const favItem = {
        id: `fav-${Date.now()}`,
        userId: req.user.id,
        product: product,
        addedAt: new Date().toISOString()
      };
      db.favorites.unshift(favItem);
      db.save();
      return res.status(201).json({ message: 'Added to favorites', isFavorite: true, favorite: favItem });
    }
  });

  app.delete('/api/favorites/:productId', authenticateCustomer, (req, res) => {
    const initialLen = db.favorites.length;
    db.data.favorites = db.favorites.filter(f => !(f.userId === req.user.id && f.product?.id === req.params.productId));
    db.save();
    res.json({ message: 'Removed from favorites' });
  });

  // Customer Custom Design Requests
  app.get('/api/custom-requests', authenticateCustomer, (req, res) => {
    const requests = db.customRequests.filter(r => r.userId === req.user.id);
    res.json(requests);
  });

  app.post('/api/custom-requests', authenticateCustomer, (req, res) => {
    const { 
      designPhoto, jewelleryType, preferredMetal, purity, 
      expectedWeightGrams, budget, preferredDeliveryDate, 
      specialRequirements, referenceNotes 
    } = req.body;

    const newRequest = {
      id: `cdr-${Date.now()}`,
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      designPhoto: designPhoto || '',
      jewelleryType: jewelleryType || 'Custom Jewellery',
      preferredMetal: preferredMetal || 'Gold',
      purity: purity || '22K',
      expectedWeightGrams: Number(expectedWeightGrams) || 0,
      budget: Number(budget) || 0,
      preferredDeliveryDate: preferredDeliveryDate || '',
      specialRequirements: specialRequirements || '',
      referenceNotes: referenceNotes || '',
      status: 'Pending Admin Review',
      createdAt: new Date().toISOString()
    };

    db.customRequests.unshift(newRequest);
    
    // Create activity
    db.activities.unshift({
      id: `act-${Date.now()}`,
      customerName: req.user.name,
      customerEmail: req.user.email,
      action: `Submitted bespoke design request for ${newRequest.jewelleryType}`,
      timestamp: new Date().toISOString()
    });
    db.save();

    res.status(201).json(newRequest);
  });

  // Customer Notifications
  app.get('/api/notifications', authenticateCustomer, (req, res) => {
    const userNotifs = db.notifications.filter(n => n.userId === req.user.id);
    res.json(userNotifs);
  });

  app.put('/api/notifications/:id/read', authenticateCustomer, (req, res) => {
    const notif = db.notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
    if (notif) {
      notif.read = true;
      db.save();
    }
    res.json({ success: true });
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    let list = db.reviews.filter(r => r.status === 'approved');
    if (productId) {
      list = list.filter(r => r.productId === productId);
    }
    res.json(list);
  });

  app.post('/api/reviews', optionalCustomerAuth, (req, res) => {
    const { productId, productName, rating, title, comment } = req.body;
    const newRev = {
      id: `rev-${Date.now()}`,
      productId,
      productName: productName || 'Jewellery Item',
      userId: req.user?.id || 'guest',
      userName: req.user?.name || 'Valued Patron',
      rating: Number(rating) || 5,
      title: title || '',
      comment: comment || '',
      status: 'approved',
      createdAt: new Date().toISOString()
    };
    db.reviews.unshift(newRev);
    db.save();
    res.status(201).json(newRev);
  });

  // Contacts
  app.post('/api/contacts', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    const newContact = {
      id: `cnt-${Date.now()}`,
      name: name || 'Anonymous',
      email: email || '',
      phone: phone || '',
      subject: subject || 'Store Inquiry',
      message: message || '',
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    db.contacts.unshift(newContact);
    db.save();
    res.status(201).json({ message: 'Inquiry received', contact: newContact });
  });

  // -------------------------------------------------------------
  // 4. ADMIN PROTECTED APIs
  // -------------------------------------------------------------

  // Real Calculated Analytics
  app.get('/api/admin/analytics', authenticateAdmin, (req, res) => {
    const customers = db.users.filter(u => u.role === 'user');
    const orders = db.orders;
    const products = db.products;
    const payments = db.payments;

    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCollected = orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
    const pendingPayments = orders.reduce((sum, o) => sum + (o.remainingAmount || 0), 0);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr)).length;
    const todaysPayments = payments
      .filter(p => p.createdAt && p.createdAt.startsWith(todayStr))
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'In Production').length;
    const readyForPickupCount = orders.filter(o => o.orderStatus === 'Ready for Pickup').length;
    const completedOrdersCount = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Completed').length;

    res.json({
      totalCustomers: customers.length,
      totalOrders: orders.length,
      totalSales,
      totalCollected,
      pendingPayments,
      pendingOrdersCount,
      readyForPickupCount,
      completedOrdersCount,
      todaysOrders,
      todaysCollections: todaysPayments,
      catalogueItemsCount: products.length,
      customRequestsCount: db.customRequests.length
    });
  });

  // Admin Customers
  app.get('/api/admin/customers', authenticateAdmin, (req, res) => {
    const customerUsers = db.users.filter(u => u.role === 'user').map(u => {
      const userOrders = db.orders.filter(o => o.userId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const safe = { ...u, ordersCount: userOrders.length, totalSpent };
      delete safe.passwordHash;
      return safe;
    });
    res.json(customerUsers);
  });

  app.post('/api/admin/customers', authenticateAdmin, (req, res) => {
    const { name, email, phone, address } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ message: 'Name and contact info required.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('welcome123', salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: (email || '').trim().toLowerCase(),
      phone: (phone || '').trim(),
      address: address || '',
      passwordHash: passwordHash,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    db.save();

    const safe = { ...newUser };
    delete safe.passwordHash;
    res.status(201).json(safe);
  });

  app.put('/api/admin/customers/:id', authenticateAdmin, (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'Customer not found.' });

    const { name, phone, email, address, isBlocked } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (address !== undefined) user.address = address;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    user.updatedAt = new Date().toISOString();

    db.save();
    const safe = { ...user };
    delete safe.passwordHash;
    res.json(safe);
  });

  app.delete('/api/admin/customers/:id', authenticateAdmin, (req, res) => {
    const idx = db.users.findIndex(u => u.id === req.params.id && u.role === 'user');
    if (idx === -1) return res.status(404).json({ message: 'Customer not found.' });
    db.users.splice(idx, 1);
    db.save();
    res.json({ message: 'Customer removed.' });
  });

  // Admin Products (Catalogue)
  app.get('/api/admin/products', authenticateAdmin, (req, res) => {
    res.json(db.products);
  });

  app.post('/api/admin/products', authenticateAdmin, (req, res) => {
    const product = req.body;
    const newProduct = {
      ...product,
      id: product.id || `rk-prod-${Date.now()}`,
      sku: product.sku || `RK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    db.save();
    res.status(201).json(newProduct);
  });

  app.put('/api/admin/products/:id', authenticateAdmin, (req, res) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found.' });
    db.products[idx] = { ...db.products[idx], ...req.body, updatedAt: new Date().toISOString() };
    db.save();
    res.json(db.products[idx]);
  });

  app.delete('/api/admin/products/:id', authenticateAdmin, (req, res) => {
    db.products = db.products.filter(p => p.id !== req.params.id);
    db.save();
    res.json({ message: 'Product deleted successfully.' });
  });

  // Admin Orders
  app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
    res.json(db.orders);
  });

  app.post('/api/admin/orders', authenticateAdmin, (req, res) => {
    const orderData = req.body;
    const newOrder = {
      ...orderData,
      id: orderData.id || `ord-${Date.now()}`,
      orderNumber: orderData.orderNumber || `RK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      lifecycleStages: orderData.lifecycleStages || [
        { stage: 'Order Received', date: new Date().toISOString().split('T')[0], time: '10:00 AM', remarks: 'Order logged at showroom', completed: true },
        { stage: 'Jewellery Designing', date: 'Pending', time: '', remarks: '', completed: false },
        { stage: 'Gold Procurement', date: 'Pending', time: '', remarks: '', completed: false },
        { stage: 'Stone Setting', date: 'Pending', time: '', remarks: '', completed: false },
        { stage: 'Polishing', date: 'Pending', time: '', remarks: '', completed: false },
        { stage: 'Quality Check', date: 'Pending', time: '', remarks: '', completed: false },
        { stage: 'Ready for Pickup', date: 'Pending', time: '', remarks: '', completed: false },
        { stage: 'Delivered', date: 'Pending', time: '', remarks: '', completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // Notify customer
    if (newOrder.userId) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: newOrder.userId,
        title: 'New Order Registered',
        message: `Order #${newOrder.orderNumber} has been logged in RK Jewellers system.`,
        type: 'order_status',
        orderId: newOrder.id,
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    db.save();
    res.status(201).json(newOrder);
  });

  app.put('/api/admin/orders/:id', authenticateAdmin, (req, res) => {
    const idx = db.orders.findIndex(o => o.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Order not found.' });
    db.orders[idx] = { ...db.orders[idx], ...req.body, updatedAt: new Date().toISOString() };
    db.save();
    res.json(db.orders[idx]);
  });

  app.put('/api/admin/orders/:id/stage', authenticateAdmin, (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    const { stageName, remarks, updatedBy } = req.body;
    order.currentStage = stageName;

    if (order.lifecycleStages) {
      order.lifecycleStages = order.lifecycleStages.map(s => {
        if (s.stage === stageName) {
          return {
            ...s,
            completed: true,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            remarks: remarks || s.remarks,
            updatedBy: updatedBy || 'Master Artisan'
          };
        }
        return s;
      });
    }

    // Auto-update order status if final stages
    if (stageName === 'Ready for Pickup') order.orderStatus = 'Ready for Pickup';
    if (stageName === 'Delivered') order.orderStatus = 'Delivered';

    // Customer Notification
    if (order.userId) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: order.userId,
        title: 'Order Production Update',
        message: `Your Order #${order.orderNumber || order.id} has progressed to stage: ${stageName}.`,
        type: 'order_status',
        orderId: order.id,
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    db.save();
    res.json(order);
  });

  // Admin Payments
  app.get('/api/admin/payments', authenticateAdmin, (req, res) => {
    res.json(db.payments);
  });

  app.post('/api/admin/payments', authenticateAdmin, (req, res) => {
    const { orderId, amount, paymentMethod, referenceNumber, notes } = req.body;
    const order = db.orders.find(o => o.id === orderId);

    const paymentRecord = {
      id: `pay-${Date.now()}`,
      orderId: orderId || '',
      orderNumber: order?.orderNumber || '',
      customerName: order?.customerName || 'Store Client',
      customerEmail: order?.customerEmail || '',
      customerPhone: order?.customerPhone || '',
      amount: Number(amount) || 0,
      paymentMethod: paymentMethod || 'Cash',
      referenceNumber: referenceNumber || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.payments.unshift(paymentRecord);

    // Update order balance if orderId provided
    if (order) {
      order.advancePaid = (order.advancePaid || 0) + Number(amount);
      order.remainingAmount = Math.max(0, (order.totalAmount || 0) - order.advancePaid);
      if (order.remainingAmount === 0) {
        order.paymentStatus = 'Completed';
      } else {
        order.paymentStatus = 'Partially Paid';
      }

      // Notify customer
      if (order.userId) {
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          userId: order.userId,
          title: 'Payment Receipt Logged',
          message: `Payment of ₹${Number(amount).toLocaleString('en-IN')} received for Order #${order.orderNumber}.`,
          type: 'payment_received',
          orderId: order.id,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    db.save();
    res.status(201).json(paymentRecord);
  });

  // Admin Custom Requests
  app.get('/api/admin/custom-requests', authenticateAdmin, (req, res) => {
    res.json(db.customRequests);
  });

  app.put('/api/admin/custom-requests/:id', authenticateAdmin, (req, res) => {
    const idx = db.customRequests.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Request not found.' });
    
    db.customRequests[idx] = { ...db.customRequests[idx], ...req.body, updatedAt: new Date().toISOString() };
    
    // Notify customer on status update
    const reqItem = db.customRequests[idx];
    if (reqItem.userId) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: reqItem.userId,
        title: 'Custom Design Request Update',
        message: `Your bespoke design request for ${reqItem.jewelleryType} is now marked: ${reqItem.status}.`,
        type: 'custom_request',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    db.save();
    res.json(db.customRequests[idx]);
  });

  // Admin Metal Rates
  app.post('/api/admin/rates', authenticateAdmin, (req, res) => {
    db.updateGoldRate(req.body);
    res.json({ message: 'Gold & silver rates updated successfully.', rates: db.goldRate });
  });

  // Admin Reviews
  app.get('/api/admin/reviews', authenticateAdmin, (req, res) => {
    res.json(db.reviews);
  });

  app.put('/api/admin/reviews/:id', authenticateAdmin, (req, res) => {
    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ message: 'Review not found.' });
    if (req.body.status) rev.status = req.body.status;
    db.save();
    res.json(rev);
  });

  // Admin Contacts
  app.get('/api/admin/contacts', authenticateAdmin, (req, res) => {
    res.json(db.contacts);
  });

  app.put('/api/admin/contacts/:id', authenticateAdmin, (req, res) => {
    const cnt = db.contacts.find(c => c.id === req.params.id);
    if (!cnt) return res.status(404).json({ message: 'Contact not found.' });
    if (req.body.status) cnt.status = req.body.status;
    db.save();
    res.json(cnt);
  });

  // Admin Activities
  app.get('/api/admin/activities', authenticateAdmin, (req, res) => {
    res.json(db.activities.slice(0, 50));
  });

  // -------------------------------------------------------------
  // 5. AI STYLIST & GEMINI INTEGRATION (SERVER-SIDE SECURE)
  // -------------------------------------------------------------

  app.post('/api/stylist/recommend', async (req, res) => {
    const { occasion, budget, metalPreference, stylePreference, userPrompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        stylingAdvice: `Based on your selection for ${occasion || 'your special celebration'}, our master stylists recommend high-purity hallmarked gold with delicate floral motifs. Visit our Johari Bazar showroom to explore bespoke tailoring.`,
        recommendedTypes: ['Necklace', 'Earrings', 'Kadas']
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are the Master Jewellery Stylist and Gemologist at "RK Jewellers" (founded 1978 in Jaipur), a prestigious heritage Indian jewellery house known for 22K hallmarked gold, uncut Polki diamonds, antique Kundan, and certified Solitaires.
The client is looking for styling recommendations with the following parameters:
- Occasion: ${occasion || 'Bridal/Celebration'}
- Budget Range: ₹${budget || 'Flexible'}
- Metal Preference: ${metalPreference || '22K Royal Gold'}
- Style preference: ${stylePreference || 'Traditional Royal Heritage'}
- Specific questions/notes: ${userPrompt || 'Suggest a cohesive royal set'}

Provide a warm, regal, professional 2-3 paragraph response advising on jewellery styling, neckline pairing, metal weight balance, and hallmark assurance. Speak with cultural elegance and master craftsmanship authority.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const adviceText = response.text || '';
      res.json({
        stylingAdvice: adviceText,
        recommendedTypes: ['Choker', 'Jhumkas', 'Kadas', 'Solitaire Ring']
      });
    } catch (err) {
      console.error('Gemini AI error:', err);
      res.json({
        stylingAdvice: `For your ${occasion || 'celebration'}, we recommend timeless 22K antique gold paired with radiant uncut diamonds. Our master artisans are available at the showroom for personal curation.`,
        recommendedTypes: ['Necklace', 'Earrings']
      });
    }
  });

  // -------------------------------------------------------------
  // 6. VITE SPA / STATIC SERVING
  // -------------------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RK Jewellers backend running on port ${PORT}`);
  });
}

startServer();
