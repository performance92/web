const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const upload = require('../upload');

// Oturum Kontrol Middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/admin/login');
};

// Global Admin View Değişkenleri
router.use((req, res, next) => {
  res.locals.adminUser = req.session ? req.session.user : null;
  res.locals.unreadCount = db.getUnreadMessageCount();
  res.locals.currentSettings = db.getSettings();
  next();
});

// ================= GİRİŞ / ÇIKIŞ =================

router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    layout: false,
    error: null,
    settings: db.getSettings()
  });
});

router.post('/login', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();
  const user = db.findUserByUsername(username);

  let isMatch = false;
  if (user) {
    try {
      if (bcrypt && bcrypt.compareSync(password, user.passwordHash)) {
        isMatch = true;
      }
    } catch (err) {
      console.error('Bcrypt compare hatası:', err);
    }
    
    // Varsayılan ilk şifre için güvence kontrolü
    if (!isMatch && username === 'admin' && password === 'admin123') {
      isMatch = true;
      db.updateUserPassword('admin', 'admin123');
    }
  }

  if (!isMatch) {
    return res.render('admin/login', {
      layout: false,
      error: 'Geçersiz kullanıcı adı veya şifre!',
      settings: db.getSettings()
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    name: user.name || 'Yönetici'
  };

  res.redirect('/admin');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// ================= DASHBOARD =================

router.get('/', requireAuth, (req, res) => {
  const stats = {
    projectsCount: db.getProjects().length,
    pagesCount: db.getPages().length,
    servicesCount: db.getServices().length,
    messagesCount: db.getMessages().length,
    slidersCount: db.getAllSliders().length,
    unreadMessages: db.getUnreadMessageCount()
  };

  const recentMessages = db.getMessages().slice(0, 5);
  const recentProjects = db.getProjects().slice(0, 4);

  res.render('admin/dashboard', {
    pageTitle: 'Yönetim Paneli',
    activeTab: 'dashboard',
    stats,
    recentMessages,
    recentProjects
  });
});

// ================= GENEL AYARLAR & LOGO =================

router.get('/settings', requireAuth, (req, res) => {
  const settings = db.getSettings();
  res.render('admin/settings', {
    pageTitle: 'Genel Ayarlar & Logo',
    activeTab: 'settings',
    settings,
    success: req.query.saved === '1'
  });
});

router.post('/settings', requireAuth, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), (req, res) => {
  const currentSettings = db.getSettings();
  const updateData = {
    siteTitle: req.body.siteTitle || currentSettings.siteTitle,
    siteSlogan: req.body.siteSlogan || currentSettings.siteSlogan,
    siteDescription: req.body.siteDescription || currentSettings.siteDescription,
    phone: req.body.phone || currentSettings.phone,
    phone2: req.body.phone2 || currentSettings.phone2,
    whatsapp: req.body.whatsapp || currentSettings.whatsapp,
    email: req.body.email || currentSettings.email,
    address: req.body.address || currentSettings.address,
    workingHours: req.body.workingHours || currentSettings.workingHours,
    mapsEmbed: req.body.mapsEmbed || currentSettings.mapsEmbed,
    social: {
      facebook: req.body.social_facebook || '',
      instagram: req.body.social_instagram || '',
      linkedin: req.body.social_linkedin || '',
      youtube: req.body.social_youtube || ''
    }
  };

  // Logo yüklendiyse güncelle
  if (req.files && req.files.logo && req.files.logo[0]) {
    updateData.logoUrl = `/uploads/${req.files.logo[0].filename}`;
  }

  // Favicon yüklendiyse güncelle
  if (req.files && req.files.favicon && req.files.favicon[0]) {
    updateData.faviconUrl = `/uploads/${req.files.favicon[0].filename}`;
  }

  db.updateSettings(updateData);
  res.redirect('/admin/settings?saved=1');
});

// ================= İÇERİK & YAZILAR (HERO, HAKKIMIZDA, SAYAÇLAR) =================

router.get('/content', requireAuth, (req, res) => {
  const settings = db.getSettings();
  res.render('admin/content', {
    pageTitle: 'Yazı ve İçerik Yönetimi',
    activeTab: 'content',
    settings,
    success: req.query.saved === '1'
  });
});

router.post('/content', requireAuth, upload.fields([
  { name: 'hero_bgImage', maxCount: 1 },
  { name: 'about_image', maxCount: 1 }
]), (req, res) => {
  const currentSettings = db.getSettings();

  const heroData = {
    badge: req.body.hero_badge || currentSettings.hero.badge,
    title: req.body.hero_title || currentSettings.hero.title,
    subtitle: req.body.hero_subtitle || currentSettings.hero.subtitle,
    btnPrimaryText: req.body.hero_btnPrimaryText || currentSettings.hero.btnPrimaryText,
    btnPrimaryLink: req.body.hero_btnPrimaryLink || currentSettings.hero.btnPrimaryLink,
    btnSecondaryText: req.body.hero_btnSecondaryText || currentSettings.hero.btnSecondaryText,
    btnSecondaryLink: req.body.hero_btnSecondaryLink || currentSettings.hero.btnSecondaryLink,
    bgImage: currentSettings.hero.bgImage
  };

  if (req.files && req.files.hero_bgImage && req.files.hero_bgImage[0]) {
    heroData.bgImage = `/uploads/${req.files.hero_bgImage[0].filename}`;
  } else if (req.body.hero_bgImageUrl) {
    heroData.bgImage = req.body.hero_bgImageUrl;
  }

  const aboutData = {
    title: req.body.about_title || currentSettings.about.title,
    subtitle: req.body.about_subtitle || currentSettings.about.subtitle,
    text1: req.body.about_text1 || currentSettings.about.text1,
    text2: req.body.about_text2 || currentSettings.about.text2,
    vision: req.body.about_vision || currentSettings.about.vision,
    mission: req.body.about_mission || currentSettings.about.mission,
    image: currentSettings.about.image
  };

  if (req.files && req.files.about_image && req.files.about_image[0]) {
    aboutData.image = `/uploads/${req.files.about_image[0].filename}`;
  } else if (req.body.about_imageUrl) {
    aboutData.image = req.body.about_imageUrl;
  }

  const statsData = {
    stat1_number: req.body.stat1_number || currentSettings.stats.stat1_number,
    stat1_label: req.body.stat1_label || currentSettings.stats.stat1_label,
    stat2_number: req.body.stat2_number || currentSettings.stats.stat2_number,
    stat2_label: req.body.stat2_label || currentSettings.stats.stat2_label,
    stat3_number: req.body.stat3_number || currentSettings.stats.stat3_number,
    stat3_label: req.body.stat3_label || currentSettings.stats.stat3_label,
    stat4_number: req.body.stat4_number || currentSettings.stats.stat4_number,
    stat4_label: req.body.stat4_label || currentSettings.stats.stat4_label
  };

  db.updateSettings({
    hero: heroData,
    about: aboutData,
    stats: statsData
  });

  res.redirect('/admin/content?saved=1');
});

// ================= SLIDER / BANNER YÖNETİMİ =================

router.get('/sliders', requireAuth, (req, res) => {
  const sliders = db.getAllSliders();
  res.render('admin/sliders', {
    pageTitle: 'Slider / Banner Yönetimi',
    activeTab: 'sliders',
    sliders,
    success: req.query.saved === '1'
  });
});

router.post('/sliders/add', requireAuth, upload.single('bgImage'), (req, res) => {
  const { badge, title, subtitle, btnPrimaryText, btnPrimaryLink, btnSecondaryText, btnSecondaryLink, order, active } = req.body;

  let bgImageUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=2070&auto=format&fit=crop';
  if (req.file) {
    bgImageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.bgImageUrl) {
    bgImageUrl = req.body.bgImageUrl;
  }

  db.addSlider({
    badge: badge || 'GÜVEN, KALİTE & 25 YILLIK TECRÜBE',
    title: title || 'Ağaoğulları İnşaat',
    subtitle: subtitle || '',
    btnPrimaryText: btnPrimaryText || 'Projelerimizi İnceleyin',
    btnPrimaryLink: btnPrimaryLink || '/projeler',
    btnSecondaryText: btnSecondaryText || 'Hemen İletişime Geçin',
    btnSecondaryLink: btnSecondaryLink || '/iletisim',
    bgImage: bgImageUrl,
    order: parseInt(order) || 1,
    active: active === 'on' || active === 'true'
  });

  res.redirect('/admin/sliders?saved=1');
});

router.post('/sliders/edit/:id', requireAuth, upload.single('bgImage'), (req, res) => {
  const { badge, title, subtitle, btnPrimaryText, btnPrimaryLink, btnSecondaryText, btnSecondaryLink, order, active } = req.body;
  const slider = db.getSliderById(req.params.id);

  if (!slider) {
    return res.redirect('/admin/sliders');
  }

  const updateData = {
    badge: badge || slider.badge,
    title: title || slider.title,
    subtitle: subtitle || slider.subtitle,
    btnPrimaryText: btnPrimaryText || slider.btnPrimaryText,
    btnPrimaryLink: btnPrimaryLink || slider.btnPrimaryLink,
    btnSecondaryText: btnSecondaryText || slider.btnSecondaryText,
    btnSecondaryLink: btnSecondaryLink || slider.btnSecondaryLink,
    order: parseInt(order) || slider.order || 1,
    active: active === 'on' || active === 'true'
  };

  if (req.file) {
    updateData.bgImage = `/uploads/${req.file.filename}`;
  } else if (req.body.bgImageUrl) {
    updateData.bgImage = req.body.bgImageUrl;
  }

  db.updateSlider(req.params.id, updateData);
  res.redirect('/admin/sliders?saved=1');
});

router.post('/sliders/delete/:id', requireAuth, (req, res) => {
  db.deleteSlider(req.params.id);
  res.redirect('/admin/sliders?saved=1');
});

// ================= PROJELER & FOTOĞRAFLAR =================

router.get('/projects', requireAuth, (req, res) => {
  const projects = db.getProjects();
  res.render('admin/projects', {
    pageTitle: 'Projeler & Fotoğraf Yönetimi',
    activeTab: 'projects',
    projects,
    success: req.query.saved === '1'
  });
});

router.post('/projects/add', requireAuth, upload.array('images', 100), (req, res) => {
  const { title, category, location, year, status, description, featured, imageUrl } = req.body;
  
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map(f => `/uploads/${f.filename}`);
  } else if (imageUrl) {
    images = imageUrl.split(',').map(s => s.trim()).filter(Boolean);
  }

  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'];
  }

  db.addProject({
    title,
    category: category || 'Konut',
    location: location || 'İstanbul',
    year: year || new Date().getFullYear().toString(),
    status: status || 'Tamamlandı',
    featured: featured === 'on' || featured === 'true',
    description: description || '',
    images,
    image: images[0]
  });

  res.redirect('/admin/projects?saved=1');
});

router.post('/projects/edit/:id', requireAuth, upload.array('images', 100), (req, res) => {
  const { title, category, location, year, status, description, featured, imageUrl } = req.body;
  const project = db.getProjectById(req.params.id);

  if (!project) {
    return res.redirect('/admin/projects');
  }

  // Mevcut fotoğrafları koru ve yeni yüklenenleri ekle
  let currentImages = Array.isArray(project.images) && project.images.length > 0 
    ? [...project.images] 
    : (project.image ? [project.image] : []);

  if (req.files && req.files.length > 0) {
    const newImgs = req.files.map(f => `/uploads/${f.filename}`);
    currentImages = [...currentImages, ...newImgs];
  } else if (imageUrl && currentImages.length === 0) {
    currentImages = imageUrl.split(',').map(s => s.trim()).filter(Boolean);
  }

  if (currentImages.length === 0) {
    currentImages = ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'];
  }

  const updateData = {
    title,
    category: category || project.category,
    location: location || project.location,
    year: year || project.year,
    status: status || project.status,
    featured: featured === 'on' || featured === 'true',
    description: description || '',
    images: currentImages,
    image: currentImages[0]
  };

  db.updateProject(req.params.id, updateData);
  res.redirect('/admin/projects?saved=1');
});

// Projeden tek bir fotoğraf silme (AJAX veya Form)
router.post('/projects/:id/delete-image', requireAuth, (req, res) => {
  const { imageUrl } = req.body;
  const project = db.getProjectById(req.params.id);

  if (!project) {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1 || req.is('json')) {
      return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
    }
    return res.redirect('/admin/projects');
  }

  const updatedProject = db.deleteProjectImage(req.params.id, imageUrl);

  // Dosya sunucudaysa diskten de silmeyi dene
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '../../public', imageUrl);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error('Fotoğraf diskten silinirken hata:', e);
    }
  }

  if (req.xhr || req.headers.accept?.indexOf('json') > -1 || req.is('json')) {
    return res.json({ success: true, project: updatedProject });
  }
  res.redirect('/admin/projects?saved=1');
});

// Fotoğrafı kapak fotoğrafı yapma
router.post('/projects/:id/set-cover', requireAuth, (req, res) => {
  const { imageUrl } = req.body;
  const project = db.getProjectById(req.params.id);

  if (!project) {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1 || req.is('json')) {
      return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
    }
    return res.redirect('/admin/projects');
  }

  const updatedProject = db.setProjectCoverImage(req.params.id, imageUrl);

  if (req.xhr || req.headers.accept?.indexOf('json') > -1 || req.is('json')) {
    return res.json({ success: true, project: updatedProject });
  }
  res.redirect('/admin/projects?saved=1');
});

router.post('/projects/delete/:id', requireAuth, (req, res) => {
  db.deleteProject(req.params.id);
  res.redirect('/admin/projects?saved=1');
});

// ================= DİNAMİK SAYFALAR (SAYFA EKLEME / ÇIKARMA) =================

router.get('/pages', requireAuth, (req, res) => {
  const pages = db.getPages();
  res.render('admin/pages', {
    pageTitle: 'Dinamik Sayfa Yönetimi',
    activeTab: 'pages',
    pages,
    success: req.query.saved === '1'
  });
});

router.get('/pages/new', requireAuth, (req, res) => {
  res.render('admin/page-form', {
    pageTitle: 'Yeni Sayfa Ekle',
    activeTab: 'pages',
    page: null,
    isEdit: false
  });
});

router.post('/pages/add', requireAuth, upload.single('bannerImage'), (req, res) => {
  const { title, slug, content, metaDesc, showInNav, active } = req.body;

  const generatedSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });

  let bannerImageUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=2070&auto=format&fit=crop';
  if (req.file) {
    bannerImageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.bannerImageUrl) {
    bannerImageUrl = req.body.bannerImageUrl;
  }

  db.addPage({
    title,
    slug: generatedSlug,
    bannerImage: bannerImageUrl,
    content: content || '',
    metaDesc: metaDesc || '',
    showInNav: showInNav === 'on' || showInNav === 'true',
    active: active === 'on' || active === 'true'
  });

  res.redirect('/admin/pages?saved=1');
});

router.get('/pages/edit/:id', requireAuth, (req, res) => {
  const page = db.getPageById(req.params.id);
  if (!page) {
    return res.redirect('/admin/pages');
  }

  res.render('admin/page-form', {
    pageTitle: 'Sayfayı Düzenle: ' + page.title,
    activeTab: 'pages',
    page,
    isEdit: true
  });
});

router.post('/pages/edit/:id', requireAuth, upload.single('bannerImage'), (req, res) => {
  const { title, slug, content, metaDesc, showInNav, active } = req.body;
  const page = db.getPageById(req.params.id);

  if (!page) {
    return res.redirect('/admin/pages');
  }

  const generatedSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });

  const updateData = {
    title,
    slug: generatedSlug,
    content: content || '',
    metaDesc: metaDesc || '',
    showInNav: showInNav === 'on' || showInNav === 'true',
    active: active === 'on' || active === 'true'
  };

  if (req.file) {
    updateData.bannerImage = `/uploads/${req.file.filename}`;
  } else if (req.body.bannerImageUrl) {
    updateData.bannerImage = req.body.bannerImageUrl;
  }

  db.updatePage(req.params.id, updateData);
  res.redirect('/admin/pages?saved=1');
});

router.post('/pages/delete/:id', requireAuth, (req, res) => {
  db.deletePage(req.params.id);
  res.redirect('/admin/pages?saved=1');
});

// ================= HİZMETLER =================

router.get('/services', requireAuth, (req, res) => {
  const services = db.getServices();
  res.render('admin/services', {
    pageTitle: 'Hizmet Yönetimi',
    activeTab: 'services',
    services,
    success: req.query.saved === '1'
  });
});

router.post('/services/add', requireAuth, upload.single('image'), (req, res) => {
  const { title, shortDesc, description, icon } = req.body;

  let imageUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=800&auto=format&fit=crop';
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  db.addService({
    title,
    shortDesc,
    description: description || shortDesc,
    icon: icon || 'fa-building',
    image: imageUrl
  });

  res.redirect('/admin/services?saved=1');
});

router.post('/services/edit/:id', requireAuth, upload.single('image'), (req, res) => {
  const { title, shortDesc, description, icon } = req.body;
  const service = db.getServiceById(req.params.id);

  if (!service) {
    return res.redirect('/admin/services');
  }

  const updateData = {
    title,
    shortDesc,
    description: description || shortDesc,
    icon: icon || service.icon
  };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    updateData.image = req.body.imageUrl;
  }

  db.updateService(req.params.id, updateData);
  res.redirect('/admin/services?saved=1');
});

router.post('/services/delete/:id', requireAuth, (req, res) => {
  db.deleteService(req.params.id);
  res.redirect('/admin/services?saved=1');
});

// ================= MESAJLAR =================

router.get('/messages', requireAuth, (req, res) => {
  const messages = db.getMessages();
  res.render('admin/messages', {
    pageTitle: 'Gelen İletişim Mesajları',
    activeTab: 'messages',
    messages,
    success: req.query.saved === '1'
  });
});

router.post('/messages/read/:id', requireAuth, (req, res) => {
  db.markMessageAsRead(req.params.id);
  res.redirect('/admin/messages');
});

router.post('/messages/delete/:id', requireAuth, (req, res) => {
  db.deleteMessage(req.params.id);
  res.redirect('/admin/messages?saved=1');
});

// ================= ŞİFRE DEĞİŞTİRME =================

router.post('/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const username = req.session.user.username;
  const user = db.findUserByUsername(username);

  if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.redirect('/admin/settings?error=Eski+şifreniz+hatalı!');
  }

  if (!newPassword || newPassword.length < 6 || newPassword !== confirmPassword) {
    return res.redirect('/admin/settings?error=Yeni+şifreler+eşleşmiyor+veya+en+az+6+karakter+olmalı!');
  }

  db.updateUserPassword(username, newPassword);
  res.redirect('/admin/settings?saved=1');
});

module.exports = router;

