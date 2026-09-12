# 🏗️ Ağaoğulları İnşaat - Web Sitesi & Yönetim Paneli (Docker)

Bu proje; modern, şık ve kurumsal **Ağaoğulları İnşaat** web sitesi ile tam yetkili, fotoğraf & logo yükleme, yazı düzenleme ve dinamik sayfa ekleme/çıkarma yeteneklerine sahip modern bir **Yönetim Paneli (CMS)** içerir.

Tüm sistem **Docker ve Docker Compose** ile tek komutla çalıştırılabilir.

---

## 🚀 Hızlı Başlangıç (Docker ile Çalıştırma)

Terminalinizde proje klasörüne gidin ve şu komutu çalıştırın:

```bash
cd /home/ubuntu/insaat-web
docker compose up -d --build
```

Konteyner ayağa kalktığında:
- 🌐 **Web Sitesi:** [http://localhost:3000](http://localhost:3000)
- 🔑 **Yönetim Paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Yönetici Giriş Bilgileri

* **Kullanıcı Adı:** `admin`
* **Şifre:** `admin123`

*(Giriş yaptıktan sonra **Genel Ayarlar** sekmesinden şifrenizi dilediğiniz an değiştirebilirsiniz.)*

---

## ✨ Temel Özellikler

### 1. 🖼️ Logo ve Favicon Yükleme
* **Yönetim Paneli -> Genel Ayarlar & Logo** sayfasından bilgisayarınızdan PNG, SVG veya JPG formatında logo seçip yükleyebilirsiniz.
* Yüklediğiniz logo anında web sitesinin **Header (üst menü)** ve **Footer (alt bilgi)** kısımlarında otomatik olarak güncellenir.
* Tarayıcı sekme ikonu (Favicon) da aynı ekrandan kolayca yüklenebilir.

### 2. 📝 Yazıları ve İçerikleri Değiştirme
* **Yönetim Paneli -> Yazılar & İçerik** sayfasından:
  * Anasayfa Hero karşılama başlığı, alt başlıkları ve buton yazılarını,
  * 4 adet dinamik istatistik sayacını (örn: 250+ Proje, 25+ Yıl Tecrübe vb.),
  * Kurumsal / Hakkımızda hikayesini, vizyon ve misyon metinlerini dilediğiniz an güncelleyebilirsiniz.

### 3. 📸 Fotoğraf ve Proje Yönetimi
* **Yönetim Paneli -> Projeler & Fotoğraflar** sayfasından:
  * Bilgisayarınızdan yeni şantiye ve inşaat fotoğrafları yükleyebilir,
  * Kategori (Konut, Ticari, Endüstriyel, Kentsel Dönüşüm), lokasyon, teslim yılı ve açıklama ekleyerek yeni projeler oluşturabilir,
  * Mevcut projeleri düzenleyebilir veya silebilirsiniz.

### 4. 📄 Dinamik Sayfa Ekleme / Çıkarma
* **Yönetim Paneli -> Sayfa Ekle / Çıkar** sayfasından:
  * "Yeni Sayfa Ekle" butonuna basarak dilediğiniz kadar yeni sayfa (örn: *Kalite Belgelerimiz*, *Sürdürülebilirlik*, *İSG Politikamız*, *Kariyer*) oluşturabilirsiniz.
  * Sayfa üst banner fotoğrafı yükleyebilir,
  * Zengin HTML formatlı metin editörü ile başlıklar, paragraflar ve listeler ekleyebilir,
  * "Üst Menüde Göster" seçeneği ile sayfanın navbar menüsünde otomatik yer almasını sağlayabilir,
  * İstemediğiniz sayfaları tek tıkla silebilir (çıkarabilir) veya taslağa alabilirsiniz.

### 5. 📬 İletişim ve Hızlı Teklif Mesajları
* Web sitesindeki formlar üzerinden ziyaretçilerin gönderdiği tüm teklif talepleri ve mesajlar **Gelen Mesajlar** sekmesinde toplanır.

---

## 💾 Veri Kalıcılığı (Persistence)

Docker konteyneri yeniden başlatılsa veya güncellense bile hiçbir veriniz ve fotoğrafınız kaybolmaz:
* `./data/db.json` -> Tüm site ayarları, metinler, projeler, sayfalar ve mesajlar
* `./public/uploads/` -> Yüklenen tüm kurumsal logolar, proje fotoğrafları ve banner görselleri

---

## 🔒 Wildcard SSL Sertifikası Kurulumu

Proje, **Nginx Ters Proxy** üzerinden otomatik HTTP (Port 80) -> HTTPS (Port 443) yönlendirmesi ve Wildcard SSL desteğiyle yapılandırılmıştır.

Hosting firmanızdan aldığınız Wildcard SSL sertifikasını aktif etmek için:

1. Sertifika ve anahtar dosyalarınızı `insaat-web/ssl/` klasörüne yapıştırın:
   * **`ssl/certificate.crt`** -> Sertifikanız ve ara sertifika (bundle/chain)
   * **`ssl/private.key`** -> SSL özel anahtarınız

2. Nginx servisini yeniden yükleyin:
   ```bash
   docker compose restart nginx
   ```

*(Klasörde ilk açılışın sorunsuz gerçekleşmesi için önceden oluşturulmuş bir yedek sertifika bulunmaktadır; hosting sertifikanızı aldığınızda üzerine yazmanız yeterlidir.)*

---

## 🛠️ Docker Komutları Özeti

```bash
# Konteyneri arka planda derleyip başlatma (Web + Nginx SSL):
docker compose up -d --build

# Çalışma durumunu ve logları izleme:
docker compose logs -f

# Konteyneri durdurma:
docker compose down

# Yeniden başlatma:
docker compose restart
```

