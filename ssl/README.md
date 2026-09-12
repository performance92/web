# 🔐 Wildcard SSL Sertifikası Kurulum Kılavuzu

Hosting veya alan adı sağlayıcınızdan aldığınız **Wildcard SSL (*.alanadiniz.com)** sertifikasını bu klasöre ekleyebilirsiniz.

---

## 📁 Gerekli Dosyalar

Hosting panelinizden (cPanel, Plesk, Cloudflare, vb.) sertifikanızı indirdiğinizde şu iki dosyayı bu klasöre yerleştirin:

1. **`certificate.crt`** (Sertifika Dosyası)
   - Hosting firmanızın verdiği ana sertifika (CRT) ve ara sertifika (Bundle / CA-Bundle / Chain).
   - Eğer dosyanız `.pem` veya `fullchain.pem` formatındaysa, içeriğini bu dosyaya kopyalayabilirsiniz.
   - Format örneği:
     ```text
     -----BEGIN CERTIFICATE-----
     (Alan adınızın sertifikası)
     -----END CERTIFICATE-----
     -----BEGIN CERTIFICATE-----
     (Ara sertifika / Intermediate CA)
     -----END CERTIFICATE-----
     ```

2. **`private.key`** (Özel Anahtar)
   - CSR (Certificate Signing Request) oluştururken veya SSL satın aldığınızda üretilen gizli anahtar.
   - Format örneği:
     ```text
     -----BEGIN RSA PRIVATE KEY-----
     (veya -----BEGIN PRIVATE KEY-----)
     ...
     -----END RSA PRIVATE KEY-----
     ```

---

## ⚡ Sertifikayı Yükledikten Sonra Aktifleştirme

Sertifika dosyalarınızı bu klasöre kopyaladıktan sonra:

```bash
cd /home/ubuntu/insaat-web
docker compose restart nginx
```

Veya konteyneri durdurmadan anında yeniden yüklemek için:

```bash
docker compose exec nginx nginx -s reload
```

---

> [!NOTE]
> Klasörde şu an sistemin ilk açılışta hata vermemesi için oluşturulmuş örnek bir yerel sertifika bulunmaktadır. Hosting firmanızdan sertifikanızı aldığınızda bu iki dosyanın üzerine kendi dosyalarınızı yapıştırmanız yeterlidir.

