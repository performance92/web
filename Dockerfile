# Node.js 20 Alpine tabanlı hafif ve güvenli imaj
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# Paket tanımlarını kopyala
COPY package.json ./

# Bağımlılıkları kur
RUN npm install --omit=dev

# Uygulama kaynak kodlarını kopyala
COPY . .

# Kalıcı veri ve yükleme klasörlerini oluştur
RUN mkdir -p /app/data /app/public/uploads

# Port tanımı
EXPOSE 3000

# Ortam değişkenleri
ENV PORT=3000
ENV NODE_ENV=production

# Başlatma komutu
CMD ["node", "src/server.js"]

