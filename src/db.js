const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// bcryptjs kütüphanesini güvenli yükle (Docker içinde yüklü olacaktır)
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  // Docker dışı çalıştırmada node_modules henüz kurulmadıysa
}

// "admin123" için doğrulanmış geçerli bcrypt hash'i ($2a$10$...)
const DEFAULT_ADMIN_HASH = '$2a$10$v0o51ae.8OONFcpHVhdVj.14qp0HkfocDsn2KNwqe1.enb8gQHJVu';

// Klasörün var olduğundan emin ol
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Varsayılan Veritabanı Şablonu
const getDefaultData = () => {
  const defaultPasswordHash = bcrypt 
    ? bcrypt.hashSync('admin123', 10) 
    : DEFAULT_ADMIN_HASH;

  return {
    settings: {
      siteTitle: 'Ağaoğulları İnşaat',
      siteSlogan: 'Geleceği Sağlam Temeller Üzerine İnşa Ediyoruz',
      siteDescription: 'Ağaoğulları İnşaat; lüks konut projeleri, endüstriyel tesisler, kentsel dönüşüm ve modern mimari yapılarda öncü mühendislik çözümleri sunar.',
      logoUrl: '',
      faviconUrl: '',
      phone: '+90 (212) 555 0192',
      phone2: '+90 (532) 555 0192',
      whatsapp: '905325550192',
      email: 'info@agaogullariinsaat.com',
      address: 'Büyükdere Caddesi, Ağaoğulları Plaza No:142 Maslak, Sarıyer / İstanbul',
      workingHours: 'Pazartesi - Cumartesi: 08:30 - 18:30',
      social: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        youtube: 'https://youtube.com'
      },
      mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.79327632662!2d28.871754!3d41.0055005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63f63a77b47%3A0x280f57affec563d3!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str',
      hero: {
        badge: 'Güven, Kalite & 25 Yıllık Tecrübe',
        title: 'Ağaoğulları İnşaat ile Sağlam Gelecek, Estetik Yapılar',
        subtitle: 'Yenilikçi mimari yaklaşımlar ve yüksek mühendislik standartlarıyla hayallerinizdeki yaşam ve çalışma alanlarını gerçeğe dönüştürüyoruz.',
        btnPrimaryText: 'Projelerimizi İnceleyin',
        btnPrimaryLink: '/projeler',
        btnSecondaryText: 'Hemen İletişime Geçin',
        btnSecondaryLink: '/iletisim',
        bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=2070&auto=format&fit=crop'
      },
      about: {
        title: '25 Yıllık Güven ve Mühendislik Başarısı',
        subtitle: 'Hakkımızda & Kurumsal Değerlerimiz',
        text1: 'Ağaoğulları İnşaat olarak çeyrek asrı aşkın süredir inşaat, gayrimenkul geliştirme ve taahhüt sektöründe güven ve kaliteden ödün vermeden faaliyet göstermekteyiz. Çağdaş şehircilik ilkelerine uygun, estetik, çevreye duyarlı ve en üst düzey deprem güvenliği standartlarına sahip yapılar inşa etmek temel misyonumuzdur.',
        text2: 'Konut projelerinden dev sanayi tesislerine, modern iş merkezlerinden kentsel dönüşüm projelerine kadar her aşamada ileri teknoloji ve uzman mühendis kadromuzla anahtar teslim çözümler sunuyoruz.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop',
        vision: 'Türkiye\'de ve uluslararası arenada mühendislik kalitesi, çevre dostu inovasyon ve sürdürülebilir mimaride örnek gösterilen lider bir inşaat markası olmak.',
        mission: 'İnsan odaklı, modern, sağlam ve yüksek yaşam konforuna sahip yapılar inşa ederek müşterilerimize, çalışanlarımıza ve ülkemize kalıcı değerler kazandırmak.'
      },
      stats: {
        stat1_number: '250+',
        stat1_label: 'Tamamlanan Proje',
        stat2_number: '25+',
        stat2_label: 'Yıllık Tecrübe',
        stat3_number: '1.2M+',
        stat3_label: 'm² İnşaat Alanı',
        stat4_number: '%100',
        stat4_label: 'Zamanında Teslim'
      }
    },
    users: [
      {
        id: '1',
        username: 'admin',
        passwordHash: defaultPasswordHash,
        name: 'Yönetici'
      }
    ],
    services: [
      {
        id: '1',
        title: 'Lüks Konut & Rezidans Projeleri',
        shortDesc: 'Modern yaşamın tüm konforunu sunan, estetik ve sağlam rezidans ve villa projeleri.',
        description: 'Ağaoğulları İnşaat güvencesiyle hayata geçirilen konut projelerimiz; birinci sınıf malzeme kullanımı, akıllı ev sistemleri ve sosyal donatılarıyla aileniz için huzurlu ve güvenli bir yaşam vaat eder.',
        icon: 'fa-house-chimney',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        order: 1
      },
      {
        id: '2',
        title: 'Endüstriyel Yapılar & Fabrikalar',
        shortDesc: 'Ağır sanayi, lojistik depolar ve üretim tesisleri için anahtar teslim taahhüt hizmetleri.',
        description: 'Sanayi yatırımlarınız için yüksek taşıma kapasiteli, modüler ve enerji verimliliği yüksek fabrika binaları, çelik konstrüksiyon yapılar ve modern lojistik depolar inşa ediyoruz.',
        icon: 'fa-industry',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
        order: 2
      },
      {
        id: '3',
        title: 'Kentsel Dönüşüm & Güçlendirme',
        shortDesc: 'Eski ve riskli yapıları modern, depreme tam dayanıklı yeni yaşam alanlarına dönüştürüyoruz.',
        description: 'Mülk sahipleriyle şeffaf sözleşme süreçleri yürüterek binalarınızı sıfırdan ve son deprem yönetmeliklerine %100 uyumlu olarak yeniden inşa ediyor, hak sahiplerine değer katıyoruz.',
        icon: 'fa-helmet-safety',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=800&auto=format&fit=crop',
        order: 3
      },
      {
        id: '4',
        title: 'Ticari Plazalar & Ofis Yapıları',
        shortDesc: 'İş dünyasına prestij kazandıran modern iş merkezleri ve ticari alanlar.',
        description: 'Fonksiyonel mimari, enerji verimli cephe tasarımları ve esnek ofis alanlarıyla şirketinizin kurumsal kimliğini en üst seviyeye taşıyan yapılar tasarlayıp inşa ediyoruz.',
        icon: 'fa-building',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        order: 4
      },
      {
        id: '5',
        title: 'Mimari Tasarım & Projelendirme',
        shortDesc: '3D görselleştirme, statik hesaplamalar ve estetik iç mimari çözümleri.',
        description: 'Alanında uzman mimar ve mühendis kadromuzla, projenizin zemin etüdünden ruhsat aşamasına ve iç mekan tasarımına kadar tüm süreçlerini titizlikle yönetiyoruz.',
        icon: 'fa-compass-drafting',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
        order: 5
      },
      {
        id: '6',
        title: 'Altyapı & Çevre Düzenleme',
        shortDesc: 'Sağlam temel altyapıları, peyzaj mimarisi ve çevre düzenlemeleri.',
        description: 'Yapıların sadece kendisini değil, çevresiyle uyumunu da önemsiyor; geniş yeşil alanlar, yürüyüş parkurları, otoparklar ve dayanıklı altyapı şebekeleri kuruyoruz.',
        icon: 'fa-road',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop',
        order: 6
      }
    ],
    projects: [
      {
        id: '1',
        title: 'Ağaoğulları Sky Park Konutları',
        category: 'Konut',
        location: 'Maslak / İstanbul',
        year: '2025',
        status: 'Devam Ediyor',
        featured: true,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop'
        ],
        description: '350 bağımsız bölümden oluşan, panoramik şehir manzaralı ve akıllı ev konseptli lüks rezidans projesi.'
      },
      {
        id: '2',
        title: 'Ağaoğulları Lojistik & Sanayi Merkezi',
        category: 'Endüstriyel',
        location: 'Gebze / Kocaeli',
        year: '2024',
        status: 'Tamamlandı',
        featured: true,
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop'
        ],
        description: '45.000 m² kapalı alana sahip, LEED sertifikalı yüksek tavanlı modern sanayi tesisi ve depo kompleksi.'
      },
      {
        id: '3',
        title: 'Ağaoğulları Panorama Business Plaza',
        category: 'Ticari',
        location: 'Levent / İstanbul',
        year: '2023',
        status: 'Tamamlandı',
        featured: true,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop'
        ],
        description: '28 katlı prestijli iş kulesi; helikopter pisti, VIP lounge ve sürdürülebilir yeşil bina mimarisi.'
      },
      {
        id: '4',
        title: 'Marina Villaları Kentsel Dönüşüm',
        category: 'Konut',
        location: 'Bodrum / Muğla',
        year: '2024',
        status: 'Tamamlandı',
        featured: true,
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop'
        ],
        description: 'Denize sıfır 24 adet özel havuzlu akıllı villa projesi; doğal taş ve ahşap dokuların mükemmel uyumu.'
      },
      {
        id: '5',
        title: 'Kuzey Marmara Lojistik Depoları',
        category: 'Endüstriyel',
        location: 'Silivri / İstanbul',
        year: '2025',
        status: 'Devam Ediyor',
        featured: false,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop'
        ],
        description: 'Son teknoloji yangın ve otomasyon sistemlerine sahip 60.000 m² depolama ve sevkiyat merkezi.'
      },
      {
        id: '6',
        title: 'Ağaoğulları Çarşı & AVM Kompleksi',
        category: 'Ticari',
        location: 'Nilüfer / Bursa',
        year: '2023',
        status: 'Tamamlandı',
        featured: false,
        image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1000&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=1000&auto=format&fit=crop'
        ],
        description: 'Açık hava alışveriş caddesi, restoranlar ve 120 mağazadan oluşan modern yaşam merkezi.'
      }
    ],
    pages: [
      {
        id: '1',
        title: 'Kalite & Çevre Politikamız',
        slug: 'kalite-ve-cevre-politikamiz',
        bannerImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop',
        metaDesc: 'Ağaoğulları İnşaat ISO kalite standartları, çevre yönetimi ve sıfır atık ilkeleri.',
        showInNav: true,
        active: true,
        order: 1,
        content: `
          <h2>Mükemmellik ve Güven Standartlarımız</h2>
          <p>Ağaoğulları İnşaat olarak, hayata geçirdiğimiz her projede ulusal ve uluslararası kalite standartlarını (ISO 9001, ISO 14001, ISO 45001) eksiksiz olarak uygulamaktayız. Şirketimiz için kalite, sadece sağlam binalar dikmek değil; insan hayatına ve doğaya duyulan saygının somut bir ifadesidir.</p>
          
          <h3>Temel Kalite İlkelerimiz</h3>
          <ul>
            <li><strong>Sıfır Hata Prensibi:</strong> Zemin etüdünden son montaja kadar her aşamada bağımsız laboratuvar denetimleri ve ileri mühendislik kontrolleri.</li>
            <li><strong>Sertifikalı Malzeme Güvencesi:</strong> Kullandığımız tüm beton, demir, çelik ve yalıtım malzemeleri uluslararası akreditasyona sahip onaylı üreticilerden temin edilir.</li>
            <li><strong>Sürekli Eğitim & Gelişim:</strong> Mühendis, mimar ve teknik saha personelimizin mesleki yetkinlikleri düzenli eğitim programlarıyla sürekli desteklenir.</li>
          </ul>

          <h3>Çevre ve Sürdürülebilirlik Taahhüdümüz</h3>
          <p>Gelecek nesillere daha yaşanabilir bir dünya bırakmak adına, inşaat süreçlerimizde karbon ayak izini en aza indirgemeyi hedefliyoruz. Şantiyelerimizde atık yönetimi ve geri dönüşüm sistemlerini titizlikle uyguluyor, enerji verimliliği yüksek yeşil binalar (LEED / BREEAM uyumlu) inşa ediyoruz.</p>
        `
      },
      {
        id: '2',
        title: 'Kariyer & İK',
        slug: 'kariyer-ve-insan-kaynaklari',
        bannerImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=2070&auto=format&fit=crop',
        metaDesc: 'Ağaoğulları İnşaat ailesine katılın. Açık pozisyonlar ve insan kaynakları politikamız.',
        showInNav: true,
        active: true,
        order: 2,
        content: `
          <h2>Ağaoğulları Ailesine Katılın</h2>
          <p>Büyüyen organizasyonumuzda, geleceğin simge yapılarını birlikte inşa edeceğimiz yetenekli, dinamik ve yenilikçi çalışma arkadaşları arıyoruz. Ağaoğulları İnşaat, çalışanlarına adil, güvenli ve sürekli gelişimi destekleyen bir çalışma ortamı sunar.</p>

          <h3>Çalışma Kültürümüz</h3>
          <p>Ekip ruhu, karşılıklı saygı, yenilikçilik ve iş güvenliği şirket kültürümüzün temel taşlarıdır. Saha mühendisliğinden mimari tasarıma, proje yönetiminden finansmana kadar geniş bir alanda profesyonel kariyer fırsatları sağlamaktayız.</p>

          <h3>Başvuru Süreci</h3>
          <p>Özgeçmişinizi ve ilgilendiğiniz departmanı belirterek <strong>ik@agaogullariinsaat.com</strong> adresine iletebilir veya genel merkezimizi ziyaret edebilirsiniz. Açık pozisyonlar için başvurularınız İnsan Kaynakları departmanımız tarafından titizlikle değerlendirilmektedir.</p>
        `
      }
    ],
    messages: [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '0532 111 2233',
        subject: 'Kentsel Dönüşüm Teklifi',
        message: 'Kadıköy bölgesindeki 12 dairelik binamız için kentsel dönüşüm görüşmesi yapmak istiyoruz. Uygun bir zamanda şantiyemizi ziyaret edebilir misiniz?',
        createdAt: new Date().toISOString(),
        read: false
      }
    ],
    sliders: [
      {
        id: '1',
        badge: 'GÜVEN, KALİTE & 25 YILLIK TECRÜBE',
        title: 'Ağaoğulları İnşaat ile Sağlam Gelecek, Estetik Yapılar',
        subtitle: 'Yenilikçi mimari yaklaşımlar ve yüksek mühendislik standartlarıyla hayallerinizdeki yaşam ve çalışma alanlarını gerçeğe dönüştürüyoruz.',
        btnPrimaryText: 'Projelerimizi İnceleyin',
        btnPrimaryLink: '/projeler',
        btnSecondaryText: 'Hemen İletişime Geçin',
        btnSecondaryLink: '/iletisim',
        bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=2070&auto=format&fit=crop',
        order: 1,
        active: true
      },
      {
        id: '2',
        badge: 'YÜKSEK MÜHENDİSLİK & TEKNOLOJİ',
        title: 'Endüstriyel Tesisler ve Modern Fabrika Yapıları',
        subtitle: 'Sanayi yatırımlarınız için yüksek taşıma kapasiteli, enerji verimli ve anahtar teslim endüstriyel taahhüt çözümleri.',
        btnPrimaryText: 'Hizmetlerimizi Görün',
        btnPrimaryLink: '/hizmetler',
        btnSecondaryText: 'Ücretsiz Keşif Al',
        btnSecondaryLink: '/iletisim',
        bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
        order: 2,
        active: true
      },
      {
        id: '3',
        badge: 'DEPREME DAYANIKLI KENTSEL DÖNÜŞÜM',
        title: 'Geleceğinizi Güvenli, Huzurlu ve Sağlam Temellere Taşıyın',
        subtitle: 'Uzman mimar ve mühendis kadromuzla riskli binalarınızı sıfırdan, en son deprem yönetmeliklerine uygun lüks yaşam alanlarına dönüştürüyoruz.',
        btnPrimaryText: 'Dönüşüm Teklifi Al',
        btnPrimaryLink: '/iletisim',
        btnSecondaryText: 'Projelerimiz',
        btnSecondaryLink: '/projeler',
        bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        order: 3,
        active: true
      }
    ]
  };
};

// Veritabanı Yükleme (Read)
const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultData = getDefaultData();
      saveDb(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.sliders || data.sliders.length === 0) {
      data.sliders = getDefaultData().sliders;
      saveDb(data);
    }
    return data;
  } catch (err) {
    console.error('Veritabanı okuma hatası:', err);
    return getDefaultData();
  }
};

// Veritabanı Kaydetme (Atomic Safe Write)
const saveDb = (data) => {
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Veritabanı kaydetme hatası:', err);
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (e) {}
    }
    return false;
  }
};

// İlk çalıştırmada kontrol
readDb();

module.exports = {
  // Settings
  getSettings: () => {
    const db = readDb();
    return db.settings;
  },
  updateSettings: (newSettings) => {
    const db = readDb();
    db.settings = { ...db.settings, ...newSettings };
    saveDb(db);
    return db.settings;
  },

  // Services
  getServices: () => {
    const db = readDb();
    return (db.services || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getServiceById: (id) => {
    const db = readDb();
    return (db.services || []).find(s => s.id === String(id));
  },
  addService: (service) => {
    const db = readDb();
    service.id = Date.now().toString();
    service.order = (db.services.length || 0) + 1;
    db.services.push(service);
    saveDb(db);
    return service;
  },
  updateService: (id, data) => {
    const db = readDb();
    const idx = db.services.findIndex(s => s.id === String(id));
    if (idx !== -1) {
      db.services[idx] = { ...db.services[idx], ...data };
      saveDb(db);
      return db.services[idx];
    }
    return null;
  },
  deleteService: (id) => {
    const db = readDb();
    db.services = db.services.filter(s => s.id !== String(id));
    saveDb(db);
    return true;
  },

  // Projects (Çoklu Fotoğraf / Sınırsız Galeri Desteği)
  getProjects: () => {
    const db = readDb();
    return (db.projects || []).map(p => {
      const imgs = Array.isArray(p.images) && p.images.length > 0 
        ? p.images.filter(Boolean) 
        : (p.image ? [p.image] : []);
      return {
        ...p,
        images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'],
        image: (imgs.length > 0 ? imgs[0] : (p.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'))
      };
    });
  },
  getProjectById: (id) => {
    const db = readDb();
    const p = (db.projects || []).find(p => p.id === String(id));
    if (!p) return null;
    const imgs = Array.isArray(p.images) && p.images.length > 0 
      ? p.images.filter(Boolean) 
      : (p.image ? [p.image] : []);
    return {
      ...p,
      images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'],
      image: (imgs.length > 0 ? imgs[0] : (p.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'))
    };
  },
  addProject: (project) => {
    const db = readDb();
    project.id = Date.now().toString();
    const imgs = Array.isArray(project.images) && project.images.length > 0 
      ? project.images.filter(Boolean) 
      : (project.image ? [project.image] : []);
    project.images = imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'];
    project.image = project.images[0];
    db.projects.unshift(project);
    saveDb(db);
    return project;
  },
  updateProject: (id, data) => {
    const db = readDb();
    const idx = db.projects.findIndex(p => p.id === String(id));
    if (idx !== -1) {
      const updated = { ...db.projects[idx], ...data };
      const imgs = Array.isArray(updated.images) && updated.images.length > 0 
        ? updated.images.filter(Boolean) 
        : (updated.image ? [updated.image] : []);
      updated.images = imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'];
      updated.image = updated.images[0];
      db.projects[idx] = updated;
      saveDb(db);
      return db.projects[idx];
    }
    return null;
  },
  deleteProject: (id) => {
    const db = readDb();
    db.projects = db.projects.filter(p => p.id !== String(id));
    saveDb(db);
    return true;
  },
  deleteProjectImage: (id, imageUrl) => {
    const db = readDb();
    const idx = db.projects.findIndex(p => p.id === String(id));
    if (idx !== -1) {
      const p = db.projects[idx];
      let imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
      imgs = imgs.filter(img => img !== imageUrl);
      if (imgs.length === 0) {
        imgs = ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1000&auto=format&fit=crop'];
      }
      p.images = imgs;
      p.image = imgs[0];
      db.projects[idx] = p;
      saveDb(db);
      return p;
    }
    return null;
  },
  setProjectCoverImage: (id, imageUrl) => {
    const db = readDb();
    const idx = db.projects.findIndex(p => p.id === String(id));
    if (idx !== -1) {
      const p = db.projects[idx];
      let imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
      if (imgs.includes(imageUrl)) {
        imgs = [imageUrl, ...imgs.filter(img => img !== imageUrl)];
      } else {
        imgs = [imageUrl, ...imgs];
      }
      p.images = imgs;
      p.image = imageUrl;
      db.projects[idx] = p;
      saveDb(db);
      return p;
    }
    return null;
  },

  // Pages
  getPages: () => {
    const db = readDb();
    return (db.pages || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getActivePages: () => {
    const db = readDb();
    return (db.pages || []).filter(p => p.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getNavPages: () => {
    const db = readDb();
    return (db.pages || []).filter(p => p.active !== false && p.showInNav !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getPageBySlug: (slug) => {
    const db = readDb();
    return (db.pages || []).find(p => p.slug === slug);
  },
  getPageById: (id) => {
    const db = readDb();
    return (db.pages || []).find(p => p.id === String(id));
  },
  addPage: (page) => {
    const db = readDb();
    page.id = Date.now().toString();
    page.order = (db.pages.length || 0) + 1;
    db.pages.push(page);
    saveDb(db);
    return page;
  },
  updatePage: (id, data) => {
    const db = readDb();
    const idx = db.pages.findIndex(p => p.id === String(id));
    if (idx !== -1) {
      db.pages[idx] = { ...db.pages[idx], ...data };
      saveDb(db);
      return db.pages[idx];
    }
    return null;
  },
  deletePage: (id) => {
    const db = readDb();
    db.pages = db.pages.filter(p => p.id !== String(id));
    saveDb(db);
    return true;
  },

  // Messages
  getMessages: () => {
    const db = readDb();
    return (db.messages || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getUnreadMessageCount: () => {
    const db = readDb();
    return (db.messages || []).filter(m => !m.read).length;
  },
  addMessage: (msg) => {
    const db = readDb();
    msg.id = Date.now().toString();
    msg.createdAt = new Date().toISOString();
    msg.read = false;
    db.messages.unshift(msg);
    saveDb(db);
    return msg;
  },
  markMessageAsRead: (id) => {
    const db = readDb();
    const msg = (db.messages || []).find(m => m.id === String(id));
    if (msg) {
      msg.read = true;
      saveDb(db);
    }
    return true;
  },
  deleteMessage: (id) => {
    const db = readDb();
    db.messages = db.messages.filter(m => m.id !== String(id));
    saveDb(db);
    return true;
  },

  // Sliders
  getSliders: () => {
    const db = readDb();
    return (db.sliders || []).filter(s => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getAllSliders: () => {
    const db = readDb();
    return (db.sliders || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
  getSliderById: (id) => {
    const db = readDb();
    return (db.sliders || []).find(s => s.id === String(id));
  },
  addSlider: (slider) => {
    const db = readDb();
    if (!db.sliders) db.sliders = [];
    slider.id = Date.now().toString();
    slider.order = (db.sliders.length || 0) + 1;
    slider.active = slider.active !== false;
    db.sliders.push(slider);
    saveDb(db);
    return slider;
  },
  updateSlider: (id, data) => {
    const db = readDb();
    if (!db.sliders) db.sliders = [];
    const idx = db.sliders.findIndex(s => s.id === String(id));
    if (idx !== -1) {
      db.sliders[idx] = { ...db.sliders[idx], ...data };
      saveDb(db);
      return db.sliders[idx];
    }
    return null;
  },
  deleteSlider: (id) => {
    const db = readDb();
    if (!db.sliders) db.sliders = [];
    db.sliders = db.sliders.filter(s => s.id !== String(id));
    saveDb(db);
    return true;
  },

  // User Auth
  findUserByUsername: (username) => {
    const db = readDb();
    return (db.users || []).find(u => u.username === username);
  },
  updateUserPassword: (username, newPassword) => {
    const db = readDb();
    const user = (db.users || []).find(u => u.username === username);
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      user.passwordHash = bcrypt.hashSync(newPassword, salt);
      saveDb(db);
      return true;
    }
    return false;
  }
};
