const express = require('express');
const router = express.Router();
const db = require('../db');

// Anasayfa
router.get('/', (req, res) => {
  const settings = db.getSettings();
  const services = db.getServices();
  const projects = db.getProjects();
  const pages = db.getNavPages();
  const sliders = db.getSliders();

  res.render('index', {
    title: `${settings.siteTitle} - ${settings.siteSlogan}`,
    pageName: 'home',
    settings,
    services,
    projects,
    pages,
    sliders,
    successMsg: req.query.sent ? 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.' : null
  });
});

// Projeler Sayfası
router.get('/projeler', (req, res) => {
  const settings = db.getSettings();
  const projects = db.getProjects();
  const category = req.query.kategori || 'all';

  let filteredProjects = projects;
  if (category && category !== 'all') {
    filteredProjects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  res.render('projects', {
    title: `Projelerimiz | ${settings.siteTitle}`,
    pageName: 'projects',
    settings,
    projects: filteredProjects,
    allProjects: projects,
    activeCategory: category
  });
});

// Proje Detay Sayfası
router.get('/proje/:id', (req, res) => {
  const settings = db.getSettings();
  const project = db.getProjectById(req.params.id);
  
  if (!project) {
    return res.status(404).render('404', {
      title: 'Proje Bulunamadı',
      pageName: '404',
      settings
    });
  }

  const relatedProjects = db.getProjects().filter(p => p.id !== project.id).slice(0, 3);

  res.render('project-detail', {
    title: `${project.title} | ${settings.siteTitle}`,
    pageName: 'projects',
    settings,
    project,
    relatedProjects
  });
});

// Hizmetlerimiz Sayfası
router.get('/hizmetler', (req, res) => {
  const settings = db.getSettings();
  const services = db.getServices();

  res.render('services', {
    title: `Hizmetlerimiz | ${settings.siteTitle}`,
    pageName: 'services',
    settings,
    services
  });
});

// İletişim Sayfası
router.get('/iletisim', (req, res) => {
  const settings = db.getSettings();

  res.render('contact', {
    title: `İletişim | ${settings.siteTitle}`,
    pageName: 'contact',
    settings,
    successMsg: req.query.sent ? 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.' : null
  });
});

// İletişim Form Gönderimi (AJAX veya Standart Form)
router.post('/iletisim', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
      return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurunuz.' });
    }
    return res.redirect('/iletisim?error=1');
  }

  db.addMessage({
    name,
    email,
    phone: phone || '',
    subject: subject || 'Genel İletişim',
    message
  });

  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.json({ success: true, message: 'Mesajınız başarıyla iletildi!' });
  }

  res.redirect('/iletisim?sent=1');
});

// Dinamik Sayfa Görüntüleme (/sayfa/:slug)
router.get('/sayfa/:slug', (req, res) => {
  const settings = db.getSettings();
  const page = db.getPageBySlug(req.params.slug);

  if (!page || page.active === false) {
    return res.status(404).render('404', {
      title: 'Sayfa Bulunamadı',
      pageName: '404',
      settings
    });
  }

  const otherPages = db.getActivePages().filter(p => p.id !== page.id);

  res.render('page', {
    title: `${page.title} | ${settings.siteTitle}`,
    pageName: `page-${page.slug}`,
    settings,
    page,
    otherPages
  });
});

module.exports = router;

