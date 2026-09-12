require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Nginx ters proxy arkasında SSL (HTTPS) tespiti için proxy'e güven
app.set('trust proxy', 1);

// Body parser
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

// Oturum Yönetimi
app.use(session({
  secret: process.env.SESSION_SECRET || 'agaogullari-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 gün
  }
}));

// Şablon Motoru (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Statik Dosyalar
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Genel View Değişkenleri (Tüm sayfalarda erişilebilir ayarlar ve menü)
app.use((req, res, next) => {
  res.locals.settings = db.getSettings();
  res.locals.navPages = db.getNavPages();
  res.locals.currentPath = req.path;
  next();
});

// Rotalar
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// 404 Sayfa Bulunamadı Yakalayıcı
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Sayfa Bulunamadı',
    pageName: '404',
    settings: db.getSettings()
  });
});

// Genel Hata Yakalayıcı
app.use((err, req, res, next) => {
  console.error('Sunucu Hatası:', err);
  res.status(500).render('500', {
    title: 'Sunucu Hatası',
    pageName: '500',
    settings: db.getSettings(),
    error: process.env.NODE_ENV === 'development' ? err.message : 'Beklenmedik bir hata oluştu.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`🏗️ Ağaoğulları İnşaat Web Platformu Aktif!`);
  console.log(`🌐 Site: http://localhost:${PORT}`);
  console.log(`🔑 Yönetim Paneli: http://localhost:${PORT}/admin`);
  console.log(`   Varsayılan Giriş: admin / admin123`);
  console.log(`===================================================`);
});

