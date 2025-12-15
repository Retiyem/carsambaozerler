#  Halýsaha Ligi Yönetim Sistemi

Bu proje, arkadaþ gruplarý veya yerel topluluklar için halý saha maçlarýný organize etmek, oyuncu istatistiklerini takip etmek ve sezonluk bir lig heyecaný yaratmak amacýyla geliþtirilmiþ modern bir web uygulamasýdýr.

##  Öne Çýkan Özellikler

- ** Puan Durumu:** Oyuncularýn performanslarýna göre (galibiyet, beraberlik, maðlubiyet) otomatik olarak hesaplanan ve sýralanan dinamik bir puan tablosu.
- ** Oyuncu Profilleri:** Her oyuncu için kiþisel bilgiler, maç istatistikleri, performans grafikleri ve baþarýlarýn yer aldýðý detaylý profil sayfalarý.
- ** Maç Sonuçlarý:** Oynanan tüm maçlarýn skorlarýný, kadrolarýný ve maçýn adamý gibi özel notlarý içeren bir arþiv.
- ** Video Entegrasyonu:** "Son Maçýn Unutulmaz Aný" gibi özel anlarý sergilemek için video oynatýcý.
- ** Mobil Uyumlu Tasarým:** Tüm cihazlarda (telefon, tablet, masaüstü) sorunsuz bir kullanýcý deneyimi sunan modern ve þýk bir arayüz.
- ** Glassmorphism Efekti:** Yarý saydam ve bulanýk arka planlarla derinlik hissi veren estetik bir tasarým dili.

##  Kullanýlan Teknolojiler

- **Frontend:**
  - **HTML5:** Anlamlý ve yapýsal web sayfalarý.
  - **CSS3:** Flexbox, Grid, özel deðiþkenler (custom properties) ve animasyonlar ile modern stil teknikleri.
  - **Vanilla JavaScript (ES6+):** Harici kütüphanelere baðýmlý olmadan, tamamen saf JavaScript ile geliþtirilmiþ dinamik ve interaktif fonksiyonlar.
- **Veri Yönetimi:**
  - Tüm veriler (oyuncular, maçlar, sezon bilgileri) js/data.js ve js/enhanced-data.js dosyalarýnda statik olarak yönetilmektedir. Bu sayede sunucuya ihtiyaç duymadan kolayca güncellenebilir.
- **Grafikler:**
  - **Chart.js:** Oyuncu profillerindeki performans trendlerini görselleþtirmek için kullanýlan popüler bir grafik kütüphanesi.

##  Nasýl Çalýþtýrýlýr?

Bu proje, herhangi bir derleme veya kurulum gerektirmez. Proje dosyalarýný bir klasöre indirdikten sonra index.html dosyasýna çift týklayarak doðrudan tarayýcýnýzda açabilirsiniz.

1. **Projeyi Ýndirin:**
   - Bu repoyu ZIP olarak indirin veya git clone komutuyla klonlayýn.
2. **Çalýþtýrýn:**
   - index.html dosyasýna çift týklayýn.

##  Dosya Yapýsý

- **/css:** Stil dosyalarý.
  - style.css: Genel site stilleri.
  - player-profile.css: Oyuncu profili sayfasý stilleri.
  - Diðer CSS dosyalarý: Belirli modüller için özelleþtirilmiþ stiller.
- **/js:** JavaScript dosyalarý.
  - data.js: Oyuncular ve maçlar gibi temel verileri içerir.
  - enhanced-data.js: Oyuncu profilleri için daha detaylý ve yapýlandýrýlmýþ verileri barýndýrýr.
  - script.js: Puan durumu ve ana sayfa gibi genel fonksiyonlarý yönetir.
  - player-profile.js: Oyuncu profili sayfasýnýn dinamik içeriðini oluþturur.
- **/img:** Görsel ve video varlýklarý.
  - /oyuncular: Oyuncu profil fotoðraflarý.
  - /video: Maç özetleri ve arka plan videolarý.
- **\*.html:** Ana HTML sayfalarý (index.html, oyuncu-profili.html, puan-durumu.html, maclar.html).

##  Gelecek Geliþtirmeler

- **Veritabaný Entegrasyonu:** Verileri statik dosyalardan alýp Firebase, Supabase veya benzeri bir BaaS (Backend as a Service) platformuna taþýmak.
- **Kullanýcý Giriþi:** Oyuncularýn kendi profillerini güncelleyebileceði bir kimlik doðrulama sistemi.
- **Maç Ekleme Arayüzü:** Maç sonuçlarýný ve performanslarý doðrudan web arayüzünden eklemek için bir admin paneli.

---

Bu proje, futbol tutkusunu teknolojiyle birleþtirerek arkadaþlarýnýzla aranýzdaki rekabeti daha eðlenceli ve organize hale getirmek için tasarlandý. Keyifli maçlar!