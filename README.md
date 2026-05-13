<p align="center">
  <img src="assets/images/hero.png" alt="Luminous Coffee" width="100%" style="border-radius: 12px;" />
</p>

<h1 align="center">☕ Luminous Coffee — Dinamik Dijital Menü Platformu</h1>

<p align="center">
  <strong>Eskişehir · Kanlıkavak</strong><br/>
  <em>Statik PDF menülerden gerçek zamanlı dijital menü yönetimine geçiş.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Status-Canlıda%20%E2%9C%93-00C853?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Responsive-Mobil%20Uyumlu-007AFF?style=for-the-badge" alt="Responsive" />
</p>

---

## 📌 Proje Hakkında

**Luminous Coffee**, Eskişehir'in Kanlıkavak semtinde faaliyet gösteren butik bir kafedir. Bu proje, kafenin dijital dönüşümünü sağlamak amacıyla geliştirilmiş kapsamlı bir **web platformu** ve **dinamik menü yönetim sistemidir**.

### 🎯 Çözdüğü İşletme Problemi

| Eski Süreç (Problem) | Yeni Süreç (Çözüm) |
|---|---|
| Menü değişikliği için grafik tasarımcıya/ajansa bağımlılık | Kafe yöneticisi admin panelinden saniyeler içinde güncelleme yapabilir |
| PDF menünün güncellenmesi günler, hatta haftalar sürüyordu | Değişiklikler **anlık olarak** canlı menüye yansır |
| Her değişiklikte yeni PDF basımı ve QR kod yenileme gerekiyordu | Fiziksel QR kodlar **hiç değiştirilmeden** çalışmaya devam eder |
| Ajans maliyeti ve zaman kaybı | **Sıfır maliyet**, tam bağımsızlık |

> **Sonuç:** Kafe sahibi artık fiyat değişikliğinden yeni ürün eklemeye kadar her şeyi kendi başına, herhangi bir cihazdan, saniyeler içinde yapabilmektedir.

---

## 🧠 Akıllı 301 Yönlendirmesi (Sıfır Maliyet QR Geçişi)

Projenin en kritik teknik detaylarından biri, **mevcut fiziksel QR kodların hiçbirine dokunmadan** dijital menüye geçiş yapılmasıdır.

Masalardaki QR kodlar daha önce şu URL'ye yönlendiriyordu:
```
https://luminous-coffee.web.app/1/Luminous.pdf
```

Firebase Hosting'in `firebase.json` yapılandırmasına eklenen **301 (Kalıcı Yönlendirme)** kuralı sayesinde, bu URL artık otomatik olarak dinamik menü sayfasına yönlendirilmektedir:

```json
{
  "hosting": {
    "redirects": [
      {
        "source": "/1/Luminous.pdf",
        "destination": "/menu.html",
        "type": 301
      }
    ]
  }
}
```

**Kazanım:**
- ✅ Masalardaki yüzlerce QR kod **değiştirilmedi** → baskı maliyeti **sıfır**
- ✅ Müşteriler aynı QR'ı okutarak artık **canlı ve güncel** menüye erişiyor
- ✅ Arama motorları (Google) 301 yönlendirmeyi tanır → **SEO uyumlu** geçiş

---

## ✨ Geliştirilen Özellikler

### 🌐 Pazarlama Web Sitesi (`index.html`)
- **Hero Section** — Tam ekran görsel ve CTA butonu ile etkileyici karşılama
- **Hakkımızda** — Kafe hikayesi, öne çıkan özellikler (kaliteli kahve, taze tatlılar, rahat atmosfer)
- **Galeri** — Mekan, içecek ve tatlı fotoğrafları ile görsel vitrin
- **İletişim** — Adres, telefon, çalışma saatleri ve entegre Google Maps haritası
- **SEO Optimizasyonu** — Meta etiketler, Open Graph, semantik HTML yapısı
- **Scroll Animasyonları** — Intersection Observer API ile yumuşak reveal efektleri

### 📱 Dijital Menü (`menu.html`)
- **Firebase Firestore** ile gerçek zamanlı menü verisi çekme
- **Kategoriye göre filtreleme** — Sticky navbar ile hızlı kategori geçişi
- **Skeleton Loading** — Veri yüklenirken profesyonel placeholder animasyonu
- **Tam mobil uyumluluk** — Telefondan QR okutarak sorunsuz görüntüleme
- **Performans odaklı** — Minimum JS, lazy loading, optimize görseller

### 🔐 Admin Paneli (`admin.html`)
- **Firebase Authentication** ile güvenli e-posta/şifre girişi
- **Kategori CRUD** — Yeni kategori ekleme, düzenleme, silme
- **Ürün CRUD** — Ürün adı, fiyat, açıklama ve sıralama yönetimi
- **Çift boyutlu fiyat desteği — `160 / 180 ₺`** formatında (küçük/büyük boy)
- **Gerçek zamanlı güncelleme** — Değişiklikler anında menüye yansır
- **Onay diyalogları** — Silme işlemlerinde güvenlik kontrolü
- **Toast bildirimleri** — Her işlem için anlık geri bildirim
- **Arama motorlarından gizli** — `noindex, nofollow` meta etiketi

---

## 🛠️ Kullanılan Teknolojiler

### Frontend
| Teknoloji | Kullanım Amacı |
|---|---|
| **HTML5** | Semantik sayfa yapısı, SEO uyumlu markup |
| **CSS3** | Custom Properties, Grid, Flexbox, animasyonlar, responsive tasarım |
| **Vanilla JavaScript (ES6+)** | DOM manipülasyonu, Firebase SDK entegrasyonu, modüler yapı |

### Backend & Altyapı
| Teknoloji | Kullanım Amacı |
|---|---|
| **Firebase Authentication** | Admin paneli için güvenli kullanıcı doğrulama |
| **Cloud Firestore** | NoSQL veritabanı — menü kategorileri ve ürün verileri |
| **Firebase Hosting** | Statik site barındırma, SSL, CDN, 301 yönlendirme |

### Mimari Diyagram

```
┌─────────────────────────────────────────────────────┐
│                    Firebase Hosting                  │
│                  (luminous-coffee)                   │
├─────────────┬──────────────────┬────────────────────┤
│ index.html  │   menu.html      │   admin.html       │
│ Landing     │   Dijital Menü   │   Yönetim Paneli   │
│ Page        │   (Public)       │   (Protected)      │
└──────┬──────┴────────┬─────────┴──────────┬─────────┘
       │               │                    │
       │      ┌────────▼────────┐   ┌───────▼────────┐
       │      │ Cloud Firestore │   │ Firebase Auth  │
       │      │ ┌─────────────┐ │   │ Email/Password │
       │      │ │ categories  │ │   └────────────────┘
       │      │ │  └─ items   │ │
       │      │ └─────────────┘ │
       │      └─────────────────┘
       │
  ┌────▼──────────────────────┐
  │ 301 Redirect              │
  │ /1/Luminous.pdf           │
  │      → /menu.html         │
  │ (Fiziksel QR kodlar)      │
  └───────────────────────────┘
```

---

## 📂 Proje Yapısı

```
luminousCoffee/
├── index.html              # Ana pazarlama sayfası
├── menu.html               # Müşteriye açık dijital menü
├── admin.html              # Korumalı admin paneli
├── 404.html                # Özel hata sayfası
├── firebase.json           # Hosting yapılandırması & 301 redirect
├── .firebaserc             # Firebase proje bağlantısı
├── firebase-config.js      # Firebase client yapılandırması
├── luminousMenu.pdf        # Orijinal PDF menü (arşiv)
│
├── css/
│   ├── style.css           # Global stiller, değişkenler, responsive
│   ├── menu.css            # Menü sayfası stilleri
│   └── admin.css           # Admin paneli stilleri
│
├── js/
│   ├── app.js              # Landing page — navbar, scroll animasyonları
│   ├── menu.js             # Menü — Firestore veri çekme, render
│   ├── admin.js            # Admin — Auth, CRUD işlemleri
│   └── firebase-config.js  # Firebase SDK başlatma (modüler)
│
└── assets/
    └── images/
        ├── hero.png        # Hero bölümü arka plan görseli
        ├── interior.png    # Mekan iç görünümü
        ├── drinks.png      # İçecek görseli
        ├── desserts.png    # Tatlı görseli
        └── favicon.ico     # Site ikonu
```

---

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
- [Firebase CLI](https://firebase.google.com/docs/cli) kurulu olmalı
- Bir Firebase projesi oluşturulmuş olmalı (Authentication & Firestore aktif)

### Adımlar

```bash
# 1. Repoyu klonlayın
git clone https://github.com/<kullanıcı-adınız>/luminous-coffee.git

# 2. Proje dizinine girin
cd luminous-coffee

# 3. Firebase projesine bağlanın
firebase use --add

# 4. Lokal olarak çalıştırın
firebase serve

# 5. (Opsiyonel) Canlıya deploy edin
firebase deploy
```

> **Not:** `firebase-config.js` dosyasındaki yapılandırmayı kendi Firebase projenizle değiştirmeniz gerekmektedir.

---

## 📱 Ekran Görüntüleri

| Ana Sayfa | Dijital Menü | Admin Paneli |
|---|---|---|
| Etkileyici hero section, galeri, iletişim | Kategorili, gerçek zamanlı menü | Güvenli giriş, CRUD yönetimi |

---

## 🔒 Güvenlik Notları

- Admin paneli **Firebase Authentication** ile korunmaktadır
- Admin sayfası arama motorlarından `noindex, nofollow` ile gizlidir
- Firestore güvenlik kuralları ile yalnızca yetkili kullanıcılar veri yazabilir
- Firebase API anahtarı client-side kullanım için tasarlanmıştır ve güvenlik kurallarıyla korunmaktadır

---

## 👨‍💻 Geliştirici

**Mustafa Tümsek**

Bu proje, gerçek bir işletmenin dijital dönüşüm ihtiyacına çözüm olarak geliştirilmiştir. Kullanılan teknolojiler bilinçli olarak sade tutulmuş; herhangi bir framework bağımlılığı olmadan, saf HTML/CSS/JS ile üretim kalitesinde bir ürün ortaya konmuştur.

---

<p align="center">
  <sub>© 2025 Luminous Coffee · Eskişehir · Tüm hakları saklıdır.</sub>
</p>
