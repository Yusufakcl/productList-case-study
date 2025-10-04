### StajCase Monorepo

Modern full‑stack örnek çalışma: React + Vite tabanlı bir frontend ile Express tabanlı hafif bir mock API backend. Uygulama, ürün listesini gösterir ve canlı altın fiyatını (cache ve güvenli fallback ile) kullanarak tahmini USD fiyatı hesaplar.

### İçerik
- **Frontend**: `frontend/ProductListApplication` (React 19 + Vite)
- **Backend (Mock API)**: `backend` (Express)
- **Netlify**: `netlify.toml` ile frontend build ve `/api/*` istekleri için proxy yapılandırması

### Önkoşullar
- Node.js 18+ ve npm

### Kurulum
Projeyi ilk kez çalıştırırken backend ve frontend için bağımlılıkları yükleyin.

PowerShell (Windows) örneği:
```powershell
npm --prefix backend ci
npm --prefix frontend/ProductListApplication ci
```

Alternatif (klasörlere girerek):
```powershell
cd backend; npm ci; cd ..
cd frontend/ProductListApplication; npm ci; cd ../..
```

### Çalıştırma (Geliştirme)
Root dizinden her iki servisi birlikte başlatın:
```powershell
npm run dev
```

- Frontend (Vite): `http://localhost:5173`
- Backend (Express): `http://localhost:3000`

Frontend geliştirme sunucusunda `/api` istekleri backend’e proxy edilir (bkz. `vite.config.js`).

### Klasör Yapısı
```
.
├── backend/
│  ├── src/
│  │  ├── index.js                 # Express app, /health ve /products endpointleri
│  │  ├── routes/productRoutes.js  # Ürünleri okur, altın fiyatı ile USD fiyatı hesaplar, filtre uygular
│  │  └── services/
│  │     ├── goldPriceService.js   # Sağlayıcıdan altın fiyatını çeker, TTL cache, fallback
│  │     └── productFilterService.js # Query parametrelerine göre fiyat/popülerlik filtresi
│  ├── data/products.json          # Örnek ürün verisi
│  ├── env.example                 # .env için örnek şablon
│  └── jsconfig.json               # Yol aliasları (#services/*, #routes/*, #data/*)
├── frontend/
│  └── ProductListApplication/
│     ├── src/
│     │  ├── components/ProductList/*  # Liste, kart, filtre, carousel, renk ve yıldız bileşenleri
│     │  └── components/common/*       # Ortak bileşenler (örn. NavigationArrow)
│     ├── vite.config.js           # '@' aliası, dev proxy: /api -> http://localhost:3000
│     └── README.md                # Vite template dokümantasyonu
├── netlify.toml                   # Build ve /api proxy redirect (Render backend örneği)
└── package.json                   # Monorepo scriptleri (concurrently ile dev)
```

### Uygulama Akışı
1) Frontend ürün listesini HTTP üzerinden `/api/products` endpointinden ister (dev modda Vite proxy backend’e yönlendirir).
2) Backend `products.json` içeriğini okur ve `goldPriceService` ile gram başına USD altın fiyatını alır.
3) Her ürün için fiyat şu formülle hesaplanır: `(popularityScore + 1) * weight * goldPricePerGram` → `priceUSD`.
4) İhtiyaca göre min/max fiyat ve popülerlik için filtreleme yapılır.

### API
Base URL (dev): `http://localhost:3000`

- `GET /health`
  - Durum kontrolü. Örnek: `{ "status": "ok" }`

- `GET /products`
  - Query parametreleri (opsiyonel):
    - `minPrice`, `maxPrice` (USD)
    - `minPopularity`, `maxPopularity` (0.0–1.0)
  - Örnek: `/products?minPrice=200&maxPopularity=0.9`
  - Yanıt: Ürün nesneleri + hesaplanmış `priceUSD`

### Ortam Değişkenleri (Backend)
`backend/.env` dosyasını `backend/env.example` temel alınarak oluşturun:
```env
PORT=3000

# Opsiyonel: gerçek zamanlı altın fiyatı için API anahtarı
GOLD_API_KEY=

# Cache TTL (ms) ve başarısızlıkta fallback fiyatı (USD/gram)
GOLD_CACHE_TTL_MS=600000
FALLBACK_GOLD_PRICE_USD_PER_GRAM=60
```

PowerShell ile kopyalama örneği:
```powershell
Copy-Item backend/env.example backend/.env
```

Notlar:
- `GOLD_API_KEY` boş bırakılırsa servis güvenli şekilde `FALLBACK_GOLD_PRICE_USD_PER_GRAM` değerini kullanır.
- Fiyat sağlayıcısı çağrısı 5 sn timeout ve hata yakalama ile korunur; sonuçlar TTL süresince bellekte cache’lenir.

### Geliştirme Ayrıntıları
- **Yol aliasları (backend)**: `jsconfig.json` ile `#services/*`, `#routes/*`, `#data/*` kısayolları.
- **Yol aliasları (frontend)**: `vite.config.js` ile `'@' -> src` aliası.
- **Proxy (frontend dev)**: `/api` istekleri `http://localhost:3000` adresine yönlendirilir ve `/api` prefix’i kaldırılır.
- **Hata yönetimi (backend)**: Global error handler 500 durumunda sabit JSON döndürür ve hatayı loglar.

### Dağıtım
- **Frontend (Netlify)**: `netlify.toml` dosyası, build komutunu ve yayın klasörünü (`frontend/ProductListApplication`, `dist`) tanımlar.
- **API Proxy (Netlify)**: `[[redirects]]` ile `/api/*` istekleri bir backend’e yönlendirilir. Örnekte Render üzerinde barındırılan bir backend kullanımı gösterilmektedir.

### Scriptler
Root `package.json` önemli scriptler:
```json
{
  "scripts": {
    "start-backend": "node backend/src/index.js",
    "start-frontend": "cd frontend/ProductListApplication && npm run dev",
    "dev": "concurrently \"npm run start-backend\" \"npm run start-frontend\""
  }
}
```

Backend `package.json` (özet):
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  },
  "imports": {
    "#services/*": "./src/services/*",
    "#routes/*": "./src/routes/*",
    "#data/*": "./src/data/*"
  }
}
```

Frontend `package.json` (özet):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Lisans
ISC


