# 🏆 BereketMarket Sezonu - Halısaha Ligi Yönetim Sistemi

Modern halısaha futbol turnuvalarını yönetmek için geliştirilmiş kapsamlı web uygulaması. Sezonluk takip, detaylı oyuncu profilleri, interaktif istatistikler ve advanced veri yönetimi özellikleri sunar.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Dosya Yapısı](#-dosya-yapısı)
- [Veri Yönetimi](#-veri-yönetimi)
- [Tasarım](#-tasarım)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## 🚀 Özellikler

### 🏆 Sezon Yönetim Sistemi
- **BereketMarket Sezonu**: Sponsor branding ile özelleştirilmiş sezon adı
- **3 aylık sezon döngüleri**: Otomatik sezon geçişleri (31 Aralık 2025 bitiş tarihi)
- **Sezonluk istatistik takibi**: Her sezon için ayrı puan durumu ve kayıtlar

### 📊 Gelişmiş Puan Durumu Sistemi
- **Otomatik puan hesaplama**: Galibiyet (3 puan), beraberlik (1 puan), mağlubiyet (0 puan)
- **Comprehensive istatistikler**: 
  - Oynadığı maç sayısı, G/B/M oranları
  - Attığı/Yediği gol sayıları ve gol farkı
  - **Maç başına gol ortalaması** (gerçek zamanlı hesaplama)
  - MVP ve "Haftanın Eşşeği" sayıları
- **Akıllı sıralama**: Puan → Gol farkı → Attığı gol sıralaması
- **Premium görsel vurgulama**: İlk 3 sıradaki oyuncular için özel efektler
  - 🥇 1. sıra: Altın rengi (parlama efekti ile)
  - 🥈 2. sıra: Gümüş rengi  
  - 🥉 3. sıra: Bronz rengi
- **Clickable player profiles**: Oyuncu isimlerine tıklayarak profil sayfasına geçiş

### 👤 Detaylı Oyuncu Profilleri
- **Kişisel bilgiler**: İsim, mevki, rating, profil fotoğrafı
- **Sezonluk performans**: Maç sayısı, gol, MVP, eşşek istatistikleri  
- **Maç başına gol hesaplaması**: Real-time calculation
- **Performans trend grafikleri**: Chart.js ile interaktif gol grafikleri
- **Son maç performansları**: Detaylı maç geçmişi tablosu
- **Enhanced data integration**: Gelişmiş oyuncu veri yapıları

### ⚽ Advanced Maç Yönetimi
- **Detaylı maç kayıtları**: Tarih, takımlar, skorlar, kazanan
- **Dual award sistemi**: MVP ve "Haftanın Eşşeği" seçimleri
- **Performans tracking**: Oyuncu bazında gol, asist, award kayıtları
- **Maç detay görünümü**: Takım kadroları, skorlar, özel ödüller
- **Toggle maç detayları**: Expand/collapse maç bilgileri
- **Kronolojik organizasyon**: En yeni maçlar öncelikli

### 🏠 Enhanced Ana Sayfa
- **Sezon bilgi banner**: Aktif sezon, bitiş tarihi, sponsor bilgisi
- **Top 3 oyuncu preview**: Lider oyuncuların highlight'ı (profile linkler ile)
- **Next match lineup preview**: Gelecek maç kadro bilgisi
- **Quick navigation**: Direkt sayfa geçişleri için butonlar
- **Modern glassmorphism hero**: Etkileyici giriş bölümü

### 📱 Responsive Tasarım
- **Mobile-first yaklaşım**: Tüm cihazlarda mükemmel görünüm
- **Glassmorphism efekti**: Modern cam benzeri tasarım
- **Smooth animasyonlar**: Sayfa geçişlerinde yumuşak animasyonlar
- **Dark theme**: Göz yormayan koyu tema

## 🛠 Teknolojiler

### Frontend
- **HTML5**: Semantic markup, multiple pages (index, oyuncu-profili, puan-durumu, maclar)
- **CSS3**: 
  - CSS Grid ve Flexbox layout
  - Custom Properties (CSS Variables)
  - Glassmorphism efektleri ve modern UI components
  - Responsive breakpoints ve mobile-first design
  - Keyframe animasyonları ve smooth transitions
  - Modular CSS architecture (style.css, player-profile.css, vb.)
- **Vanilla JavaScript**: 
  - ES6+ özellikleri ve modern syntax
  - DOM manipülasyonu ve event handling
  - **Chart.js 3.9.1** entegrasyonu (performans grafikleri)
  - Local storage desteği ve data persistence
  - Modular JS architecture (ayrı dosyalarda özelleşmiş fonksiyonlar)

### Tasarım & Visualization
- **Google Fonts**: Montserrat ve Open Sans fontları
- **Chart.js**: Interactive performance charts ve data visualization
- **Glassmorphism UI**: Modern cam efekti tasarımı ve premium card components
- **Gradient backgrounds**: Çok katmanlı renk geçişleri ve dynamic theming
- **Enhanced CSS Components**: Player profile cards, statistical displays, interactive tables

## 📦 Kurulum

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Web sunucusu (isteğe bağlı, local file:// protokolü ile de çalışır)

### Adımlar

1. **Projeyi indirin**:
   ```bash
   git clone [repository-url]
   cd HALISAHA
   ```

2. **Dosyaları web sunucusuna yükleyin** (isteğe bağlı):
   ```bash
   # Basit Python sunucusu ile
   python -m http.server 8000
   
   # Veya Node.js ile
   npx serve .
   ```

3. **Tarayıcıda açın**:
   - Local: `file:///path/to/HALISAHA/index.html`
   - Sunucu: `http://localhost:8000`

## 📖 Kullanım

### İlk Kurulum
1. `js/data.js` dosyasını açın
2. `players` dizisinde oyuncu listesini düzenleyin
3. `matches` dizisinde maç verilerini ekleyin

### Yeni Maç Ekleme

`js/data.js` dosyasındaki `matches` dizisine yeni maç eklemek için:

```javascript
{
    id: 2, // Benzersiz ID
    date: '15.10.2025', // GG.AA.YYYY formatında
    teamAGoals: 3,
    teamBGoals: 2,
    performances: [
        // A Takımı oyuncuları (7 kişi)
        { playerId: 'onur', team: 'A', goals: 2, assists: 1, mvp: true },
        { playerId: 'ensarb', team: 'A', goals: 1, assists: 0, mvp: false },
        // ... diğer A takımı oyuncuları
        
        // B Takımı oyuncuları (7 kişi)
        { playerId: 'furkans', team: 'B', goals: 1, assists: 1, mvp: false },
        // ... diğer B takımı oyuncuları
    ]
}
```

### Yeni Oyuncu Ekleme

`players` dizisine yeni oyuncu eklemek için:

```javascript
{ id: 'yenioyuncu', name: 'Yeni Oyuncu ADI SOYADI' }
```

## 📁 Dosya Yapısı

```
carsambaozerler/
├── 📄 index.html               # Ana sayfa (sezon banner, top players, navigation)
├── 📄 puan-durumu.html        # Puan durumu tablosu (clickable profiles)
├── 📄 maclar.html             # Maç geçmişi (toggle details, awards)
├── 📄 oyuncu-profili.html     # Detaylı oyuncu profil sayfası
├── 📄 oyuncular.html          # Oyuncu listesi sayfası
├── 📄 README.md               # Kapsamlı dokümantasyon
├── 📁 css/
│   ├── 📄 style.css           # Ana stil dosyası (glassmorphism, responsive)
│   ├── 📄 player-profile.css  # Oyuncu profil sayfası stilleri
│   ├── 📄 match-management.css # Maç yönetimi component stilleri
│   ├── 📄 data-management.css  # Veri yönetimi UI stilleri
│   ├── 📄 ui-enhancements.css # Enhanced UI component stilleri
│   └── 📄 user-interaction.css # Interactive element stilleri
├── 📁 js/
│   ├── 📄 data.js             # Oyuncu ve maç verileri (sezon sistemi)
│   ├── 📄 script.js           # Ana JavaScript (sezon yönetimi, puan hesaplama)
│   ├── 📄 enhanced-data.js    # Gelişmiş oyuncu veri yapıları
│   ├── 📄 enhanced-data-simple.js # Basit enhanced data (oyuncu profilleri için)
│   ├── 📄 player-profile.js   # Oyuncu profil sayfası mantığı
│   ├── 📄 player-performance.js # Chart.js performans grafikleri
│   ├── 📄 players-list.js     # Oyuncu listesi functionality
│   ├── 📄 match-management.js # Maç yönetimi ve detay toggle
│   ├── 📄 data-management.js  # Veri import/export işlemleri
│   ├── 📄 ui-enhancements.js  # UI geliştirmeleri ve animasyonlar
│   └── 📄 user-interaction.js # Kullanıcı etkileşimi event handlers
└── 📁 img/
    └── 📁 oyuncular/          # Oyuncu profil fotoğrafları
        ├── 📄 onur_mustafa.jpg
        ├── 📄 default.svg     # Varsayılan avatar
        └── 📄 ...             # Diğer oyuncu fotoğrafları
```

### Detaylı Dosya Açıklamaları

#### `index.html`
- Ana sayfa layout'u
- Hero section ve CTA butonları
- Son maç özeti ve en golcüler bölümü
- Navigation menüsü

#### `puan-durumu.html`
- Puan durumu tablosu
- Responsive tablo tasarımı
- Sıralama ve vurgulama sistemi

#### `maclar.html`
- Maç geçmişi tablosu
- Kronolojik sıralama
- MVP bilgileri

#### `css/style.css`
- **CSS Variables**: Renk paleti ve tema ayarları
- **Glassmorphism**: Modern cam efekti stilleri
- **Responsive**: Mobile-first tasarım kuralları
- **Animations**: Keyframe animasyonları ve transitions
- **Typography**: Font stilleri ve hiyerarşi

#### `js/data.js`
- **Players Array**: Tüm oyuncu bilgileri
- **Matches Array**: Maç verileri ve performanslar
- **Data Structure**: Veri yapısı dokümantasyonu

#### `js/script.js`
- **calculatePlayerStats()**: Puan hesaplama algoritması
- **renderScoreboard()**: Puan durumu tablosu oluşturma
- **renderMatchResults()**: Maç sonuçları tablosu
- **renderHomePageSummary()**: Ana sayfa özet bilgileri

## 📊 Veri Yönetimi

### Puan Hesaplama Sistemi

```javascript
// Galibiyet: 3 puan
// Beraberlik: 1 puan  
// Mağlubiyet: 0 puan

// Sıralama kriterleri:
// 1. Toplam puan (PTS)
// 2. Gol farkı (GD = Attığı Gol - Yediği Gol)
// 3. Attığı gol sayısı (GF)
```

### Veri Yapısı

#### Oyuncu Objesi
```javascript
{
    id: 'benzersiz-id',      // String: Oyuncu kimliği
    name: 'Oyuncu Adı'       // String: Görünen ad
}
```

#### Maç Objesi
```javascript
{
    id: 1,                   // Number: Maç kimliği
    date: 'GG.AA.YYYY',      // String: Maç tarihi
    teamAGoals: 3,           // Number: A takımı golleri
    teamBGoals: 2,           // Number: B takımı golleri
    performances: [...]      // Array: Oyuncu performansları
}
```

#### Performans Objesi
```javascript
{
    playerId: 'oyuncu-id',   // String: Oyuncu referansı
    team: 'A',               // String: 'A' veya 'B'
    goals: 2,                // Number: Attığı gol
    assists: 1,              // Number: Yaptığı asist
    mvp: true                // Boolean: MVP mi?
}
```

## 🎨 Tasarım

### Renk Paleti

```css
:root {
    --bg-primary-dark: #1a1a2e;      /* Ana koyu arka plan */
    --bg-secondary-dark: #16213e;     /* İkincil koyu arka plan */
    --primary-accent: #0f4c75;       /* Birincil vurgu (mavi) */
    --secondary-accent: #e07b39;     /* İkincil vurgu (turuncu) */
    --text-light: #e0e0e0;           /* Açık metin */
    --glass-card-bg: rgba(0,0,0,0.5); /* Glassmorphism arka plan */
}
```

### Tipografi

- **Başlıklar**: Montserrat (400, 600, 700)
- **Gövde metni**: Open Sans (400, 600)
- **Özel efektler**: Text-shadow ve glow efektleri

### Responsive Breakpoints

- **Desktop**: 1200px+ (container max-width)
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px (stack layout)

### Animasyonlar

- **Fade-in**: Sayfa yüklenme animasyonları
- **Hover effects**: Buton ve kart hover efektleri
- **Glow animation**: Logo ve vurgu metinleri için
- **Scale transforms**: Hover'da büyütme efektleri

## 🎯 Gelecek Özellikler (v3.0 Roadmap)

- [ ] **Advanced Analytics Dashboard**: Comprehensive statistical analysis
- [ ] **Multi-season comparison**: Sezonlar arası performans karşılaştırması  
- [ ] **Team formation optimization**: AI-powered balanced takım oluşturma
- [ ] **Live match tracking**: Real-time maç skorları ve updates
- [ ] **Player performance predictions**: Machine learning ile tahmin sistemi
- [ ] **Advanced search & filters**: Oyuncu/maç filtreleme ve arama
- [ ] **Export/Import sistem**: JSON/CSV veri backup ve migration
- [ ] **PWA support**: Offline çalışma ve mobile app experience
- [ ] **Dark/Light theme toggle**: Kullanıcı tercihi tema sistemi
- [ ] **Notification system**: Maç remind'ları ve update bildirileri
- [ ] **Social features**: Oyuncu yorumları ve rating sistemi
- [ ] **Tournament bracket**: Turnuva ağacı ve playoff sistemi

## 🤝 Katkıda Bulunma

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/yeni-ozellik`)
3. **Commit** edin (`git commit -am 'Yeni özellik eklendi'`)
4. **Push** edin (`git push origin feature/yeni-ozellik`)
5. **Pull Request** açın

### Geliştirme Kuralları

- **ES6+** JavaScript standartları kullanın
- **Semantic HTML** yazın
- **CSS Custom Properties** kullanın
- **Mobile-first** tasarım yaklaşımı
- **Comment** ekleyin (Türkçe)

## 📝 Changelog

### v2.0.0 (Mevcut - BereketMarket Sezonu)
- ✅ **Sezon yönetim sistemi** (3 aylık döngüler, sponsorluk desteği)
- ✅ **Detaylı oyuncu profilleri** (kişisel bilgiler, performans grafikleri)
- ✅ **Chart.js entegrasyonu** (interaktif performans trend grafikleri)
- ✅ **Enhanced data yapıları** (gelişmiş oyuncu ve maç verileri)
- ✅ **Clickable profile navigation** (ana sayfadan profil sayfalarına geçiş)
- ✅ **Advanced maç detayları** (toggle görünüm, takım kadroları, ödüller)
- ✅ **Real-time maç başına gol** hesaplama sistemi
- ✅ **Modular CSS/JS architecture** (maintainable code structure)
- ✅ **Dual award sistemi** (MVP + Haftanın Eşşeği)
- ✅ **Responsive oyuncu profil** sayfaları
- ✅ **Enhanced glassmorphism UI** ve premium visual effects

### v1.0.0 (Legacy)
- ✅ Temel puan durumu sistemi
- ✅ Maç kayıt sistemi  
- ✅ MVP sistemi
- ✅ Responsive tasarım
- ✅ Glassmorphism UI
- ✅ Ana sayfa özet bilgileri

## 📄 Lisans

Bu proje **Onur Mustafa Köse** tarafından geliştirilmiştir. Tüm hakları saklıdır.

## 📞 İletişim

- **Geliştirici**: Onur Mustafa Köse
- **Proje Türü**: Halısaha Turnuva Yönetim Sistemi
- **Platform**: Web Application (HTML5/CSS3/JavaScript)

---

## 🚀 Hızlı Başlangıç

### Kurulum
1. `index.html` dosyasını tarayıcıda açın
2. `js/data.js` dosyasında oyuncu listesini güncelleyin (id ve mevki bilgileri ile)
3. `js/enhanced-data-simple.js`'de oyuncu profil bilgilerini ekleyin
4. İlk maçınızı `matches` dizisine ekleyin (doğru playerId'ler ile)

### Temel Kullanım
- **Ana Sayfa**: Sezon özeti, top oyuncular, hızlı navigasyon
- **Puan Durumu**: Detaylı sıralama, oyuncu profile tıklama
- **Maçlar**: Maç geçmişi, detay toggle, award sistemi  
- **Oyuncu Profili**: Kişisel istatistikler, performans grafikleri

### Pro İpuçları
- Oyuncu profil fotoğraflarını `img/oyuncular/` klasörüne `{playerId}.jpg` formatında ekleyin
- Chart.js grafikleri otomatik olarak oyuncu performansını gösterir
- Sezon sistemi otomatik olarak 31 Aralık 2025'te yeni sezona geçecektir
- Maç detaylarını toggle etmek için "Detayları Göster" butonunu kullanın

**BereketMarket Sezonu ile halısaha liginizdeki rekabeti profesyonel seviyede yaşayın! ⚽🏆📊**