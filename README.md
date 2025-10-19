# 🏆 Halısaha Ligi - Futbol Turnuva Yönetim Sistemi

Bu proje, halısaha futbol turnuvalarını yönetmek ve takip etmek için geliştirilmiş modern bir web uygulamasıdır. Oyuncu istatistikleri, maç sonuçları ve puan durumunu kolayca takip edebilmenizi sağlar.

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

### 📊 Puan Durumu Sistemi
- **Otomatik puan hesaplama**: Galibiyet (3 puan), beraberlik (1 puan), mağlubiyet (0 puan)
- **Detaylı istatistikler**: 
  - Oynadığı maç sayısı
  - Galibiyet/Beraberlik/Mağlubiyet sayıları
  - Attığı/Yediği gol sayıları
  - Gol farkı hesaplama
- **Akıllı sıralama**: Puan → Gol farkı → Attığı gol sıralaması
- **Görsel vurgulama**: İlk 3 sıradaki oyuncular için özel renk kodlaması
  - 🥇 1. sıra: Altın rengi (parlama efekti ile)
  - 🥈 2. sıra: Gümüş rengi  
  - 🥉 3. sıra: Bronz rengi

### ⚽ Maç Yönetimi
- **Maç kayıtları**: Tarih, takımlar, skorlar ve kazanan bilgisi
- **MVP sistemi**: Her maç için MVP (en değerli oyuncu) seçimi
- **Kronolojik listeleme**: En yeni maçlar en üstte
- **Detaylı performans takibi**: Oyuncu bazında gol ve asist kayıtları

### 🏠 Ana Sayfa Özelleri
- **Son maç özeti**: En güncel maç sonucu ve MVP bilgisi
- **En golcüler listesi**: İlk 3 golcünün görüntülenmesi
- **Interaktif butonlar**: Puan durumuna hızlı erişim
- **Modern hero section**: Etkileyici giriş bölümü

### 📱 Responsive Tasarım
- **Mobile-first yaklaşım**: Tüm cihazlarda mükemmel görünüm
- **Glassmorphism efekti**: Modern cam benzeri tasarım
- **Smooth animasyonlar**: Sayfa geçişlerinde yumuşak animasyonlar
- **Dark theme**: Göz yormayan koyu tema

## 🛠 Teknolojiler

### Frontend
- **HTML5**: Semantic ve erişilebilir markup
- **CSS3**: 
  - CSS Grid ve Flexbox layout
  - Custom Properties (CSS Variables)
  - Glassmorphism efektleri
  - Responsive breakpoints
  - Keyframe animasyonları
- **Vanilla JavaScript**: 
  - ES6+ özellikleri
  - DOM manipülasyonu
  - Event handling
  - Local storage desteği

### Tasarım
- **Google Fonts**: Montserrat ve Open Sans fontları
- **Font Awesome**: İkon seti (CDN)
- **Glassmorphism UI**: Modern cam efekti tasarımı
- **Gradient backgrounds**: Çok katmanlı renk geçişleri

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
HALISAHA/
├── 📄 index.html          # Ana sayfa
├── 📄 puan-durumu.html    # Puan durumu tablosu
├── 📄 maclar.html         # Maç geçmişi
├── 📄 README.md           # Dokümantasyon
├── 📁 css/
│   └── 📄 style.css       # Ana stil dosyası
└── 📁 js/
    ├── 📄 data.js         # Oyuncu ve maç verileri
    └── 📄 script.js       # Ana JavaScript fonksiyonları
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

## 🎯 Gelecek Özellikler

- [ ] **Local Storage**: Verilerin tarayıcıda saklanması
- [ ] **JSON Export/Import**: Veri yedekleme sistemi
- [ ] **Takım oluşturma**: Otomatik balanced takım kurma
- [ ] **İstatistik grafikleri**: Chart.js ile görselleştirme
- [ ] **Oyuncu profilleri**: Detaylı oyuncu sayfaları
- [ ] **Maç önizleme**: Gelecek maçlar bölümü
- [ ] **PWA desteği**: Offline çalışma kabiliyeti
- [ ] **Dark/Light theme toggle**: Tema değiştirme

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

### v1.0.0 (Mevcut)
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

1. `index.html` dosyasını tarayıcıda açın
2. `js/data.js` dosyasında oyuncu listesini güncelleyin
3. İlk maçınızı `matches` dizisine ekleyin
4. Sayfayı yenileyin ve sonuçları görün!

**Futbol tutkunuzla halısaha liginizdeki rekabeti doruklarda yaşayın! ⚽🏆**