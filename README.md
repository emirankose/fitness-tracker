# Fitness Takip Sistemi

React ve Vite ile geliştirilmiş, tarayıcıda çalışan modern bir fitness takip paneli. Profil, antrenman, beslenme ve kilo gelişimini tek arayüzden yönetmenizi sağlar; veriler tarayıcıda kalıcı olarak saklanır.

## Özellikler

- Koyu tema, responsive layout (mobil + desktop)
- Sol sidebar, üst navbar ve mobil hamburger menü
- Dashboard ile özet görünüm
- Admin paneli ile JSON yedekleme / geri yükleme

## Kullanılan Teknolojiler

| Teknoloji | Kullanım |
|-----------|----------|
| [React](https://react.dev/) | UI bileşenleri |
| [Vite](https://vite.dev/) | Geliştirme ve build |
| [React Router](https://reactrouter.com/) | Sayfa yönlendirme |
| [Recharts](https://recharts.org/) | Progress kilo grafiği |
| localStorage | Veri kalıcılığı |
| ESLint | Kod kalitesi |

## Kurulum

Projeyi klonladıktan veya indirdikten sonra:

```bash
# Bağımlılıkları yükle
npm install

# (İsteğe bağlı) Admin şifresi için ortam değişkeni
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
```

`.env` dosyasında admin şifresini tanımlayın (aşağıdaki **Admin şifresi** bölümüne bakın).

## Çalıştırma

```bash
# Geliştirme sunucusu (varsayılan: http://localhost:5173)
npm run dev

# Üretim build
npm run build

# Build önizleme
npm run preview

# Lint kontrolü
npm run lint
```

`.env` değiştirdikten sonra geliştirme sunucusunu yeniden başlatın.

## Sayfalar

| Rota | Sayfa | Açıklama |
|------|--------|----------|
| `/` | **Dashboard** | Profil, son antrenman, günlük beslenme toplamı ve son kilo özeti |
| `/profile` | **Profile** | Ad, yaş, boy, kilo, hedef; kayıt ve güncelleme |
| `/workouts` | **Workouts** | Antrenman ekleme, listeleme ve silme |
| `/nutrition` | **Nutrition** | Öğün kaydı, günlük makro toplamları ve liste |
| `/progress` | **Progress** | Kilo kaydı, liste ve line chart |
| `/admin` | **Admin** | Şifre korumalı panel; JSON export / import |

## localStorage ile Kalıcılık

Tüm fitness verileri tarayıcının `localStorage` alanında `fittrack:` önekiyle saklanır:

| Anahtar | İçerik |
|---------|--------|
| `fittrack:profile` | Profil bilgisi (tek kayıt) |
| `fittrack:workouts` | Antrenman listesi |
| `fittrack:nutrition` | Öğün / beslenme kayıtları |
| `fittrack:progress` | Kilo / progress kayıtları |

- Sayfa yenilense de veriler korunur.
- Veriler yalnızca o tarayıcıda ve cihazda tutulur; sunucuya gönderilmez.
- Admin panelinden tüm veriler tek JSON dosyası olarak dışa aktarılıp içe aktarılabilir.

## Admin Şifresi (.env)

1. Proje kökündeki `.env.example` dosyasını `.env` olarak kopyalayın.
2. Şifreyi düzenleyin:

```env
VITE_ADMIN_PASSWORD=your_password_here
```

3. `npm run dev` ile sunucuyu yeniden başlatın.
4. Tarayıcıda `/admin` adresine gidin ve şifre ile giriş yapın.

**`.env` dosyasını asla Git’e commit etmeyin.** (`.gitignore` içinde hariç tutulmuştur.)

### Güvenlik uyarısı

Admin şifresi Vite ile **istemci tarafında** (`import.meta.env`) okunur. Statik veya front-end only bir sitede bu, yalnızca basit bir erişim engelidir; **gerçek güvenlik sağlamaz** (şifre build içinde görülebilir). Demo, kişisel kullanım veya geliştirme içindir. Gerçek bir üretim ortamında backend tabanlı kimlik doğrulama ve yetkilendirme kullanılmalıdır.

## Demo Adımları

Aşağıdaki sırayı izleyerek uygulamayı hızlıca deneyebilirsiniz:

1. **Başlat:** `npm install` → `npm run dev` → `http://localhost:5173` açın.
2. **Profil:** `/profile` → Ad, yaş, boy, kilo ve hedef girin → **Kaydet**.
3. **Antrenman:** `/workouts` → Egzersiz, set, tekrar, süre ve tarih ekleyin.
4. **Beslenme:** `/nutrition` → Öğün (Kahvaltı / Öğle / Akşam), makrolar ve tarih ekleyin; üstte günlük özet kartlarını kontrol edin.
5. **Progress:** `/progress` → Tarih ve kilo kaydı ekleyin; grafiğin dolduğunu görün.
6. **Dashboard:** `/` → Profil, son antrenman, beslenme toplamı (gün seçerek) ve son kilo özetini kontrol edin.
7. **Admin (isteğe bağlı):** `.env` ile şifre tanımlayın → `/admin` → giriş yapın → **JSON İndir** ile yedek alın veya test için **İçe Aktar** kullanın.
8. **Mobil:** Tarayıcı penceresini daraltın veya telefonda açın; hamburger menü ile gezinin.

## Proje Yapısı (özet)

```
src/
├── components/   # layout, form, sayfa bileşenleri
├── pages/        # Dashboard, Profile, Workouts, ...
├── utils/        # storage, validasyon, veri yardımcıları
├── constants/    # sabitler (hedefler, öğün tipleri)
├── App.jsx
└── main.jsx
```

## Lisans

Bu proje eğitim / kişisel kullanım amaçlıdır.
