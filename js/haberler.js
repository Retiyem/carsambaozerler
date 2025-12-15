// KOMİK HABERLER VERİSİ

// Not: Bu verileri doğrudan buradan düzenleyebilirsiniz.
// image: 'img/haberler/haber_adi.jpg' formatında olmalıdır.
// Henüz bir görseliniz yoksa, 'img/haberler/placeholder.jpg' kullanabilirsiniz.

const newsData = [
    {
        title: "Kıskançlık Zirvede: Ligin En İyisi 'Haftanın Eşşeği' Seçildi!",
        description: "Akılalmaz bir oylama sonucu sahanın tartışmasız en yetenekli, en yakışıklı ve en güçlü oyuncusu, takım arkadaşlarının kıskançlık kurbanı oldu.Son maçta en çok gol(5) atanmasına rağmen 'Bu kadar da olmaz' dedirten oylamada, yıldız oyuncu 'Haftanın Eşşeği' seçilerek tarihe geçti.",
        image: "img/Haber/Haber_1.jpg",
        date: "15.12.2025"
    },
    {
        title: "Orhan'dan Şaşırtan Performans: 1 Saat Boyunca Su İçerek Rekor Kırdı!",
        description: "Takım arkadaşları sahada kan ter içinde mücadele ederken, Orhan kenarda su içme molasını biraz abarttı. Tam 1 saat boyunca su içerek 'en uzun mola' rekorunu kıran oyuncu, 'Sıvı alımı önemli' diyerek kendini savundu.",
        image: "img/Haber/Haber_2.jpg",
        date: "15.12.2025"
    },
    {
        title: "Ahmetin Büyüsü Bozuldu  7-3 Öndeyken Maçı Kaybetti, Gözyaşlarına Boğuldu!",
        description: "Puan sıralamasında lig sonuna kadar konumunu korumaya çalışan ahmet 2 maçtır kaybediyor.Bu durum ligde çalkantılara yol açtı. Son maçta 7-3 öne geçtiği maçta son dakikalarda 12-9 yenilmesinin ardından TAKIMLARIN ADİL OLMADIĞINI  savunarak gözyaşlarını tutamadı...",
        image: "img/Haber/Haber_3.jpg",
        date: "15.12.2025"
    },
        {
        title: "Uğursuzluğu Kırıldı! Tayyip'in Omzu Yerinde Kaldı, Melekler Devrede!",
        description: "Yıllardır halısaha maçlarının korkulu rüyası haline gelen Tayyip'in omzu çıktı sendromu, dün akşam oynanan kritik maçta son buldu. Maç öncesi herkesin aklı 'acaba bu sefer hangi dakikada ?' sorusuyla meşgulken, tüm futbolseverleri şaşkına çeviren bir mucize yaşandı. Tayyip, maç boyunca gösterdiği üstün performansın yanı sıra, sahadan omzu yerinde ayrılmayı başardı. Bu tarihi ana tanıklık edenler, olayı \"ilahi bir müdahale\" olarak yorumladı.",
        image: "img/Haber/Haber_4.jpg",
        date: "15.12.2025"
    },
    // Yeni haberleri buraya ekleyebilirsiniz...
    /*
    {
        title: "Yeni Haber Başlığı",
        description: "Yeni haberin komik açıklaması.",
        image: "img/Haber/Haber_3.jpg",
        date: "GG.AA.YYYY"
    }
    */
];

// HABER KARTLARINI OLUŞTURAN FONKSİYON
document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');

    if (newsGrid) {
        // Haber verilerini döngüye al ve her biri için bir kart oluştur
        newsData.forEach(haber => {
            const card = document.createElement('div');
            card.className = 'news-card animate-fade-in';

            card.innerHTML = `
                <div class="news-card-image-container">
                    <img src="${haber.image}" alt="${haber.title}" class="news-card-image" onerror="this.onerror=null;this.src='img/haberler/placeholder.jpg';">
                </div>
                <div class="news-card-content">
                    <h3 class="news-card-title">${haber.title}</h3>
                    <p class="news-card-description">${haber.description}</p>
                    <p class="news-card-date">${haber.date}</p>
                </div>
            `;

            // Fotoğrafa tıklama özelliği ekle
            const img = card.querySelector('.news-card-image');
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                enlargeNewsPhoto(haber.image, haber.title);
            });

            newsGrid.appendChild(card);
        });
    }
});

// Haber fotoğrafını büyütme fonksiyonu
function enlargeNewsPhoto(imageSrc, title) {
    // Modal oluştur
    const modal = document.createElement('div');
    modal.className = 'news-photo-modal';
    modal.innerHTML = `
        <div class="news-photo-modal-content">
            <span class="news-photo-modal-close">&times;</span>
            <img src="${imageSrc}" alt="${title}" class="news-photo-modal-image">
            <p class="news-photo-modal-caption">${title}</p>
        </div>
    `;
    
    // Modal'ı sayfaya ekle
    document.body.appendChild(modal);
    
    // Modal'ı göster
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Kapatma fonksiyonu
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    // Kapatma butonuna tıklama
    const closeBtn = modal.querySelector('.news-photo-modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Modal dışına tıklama
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC tuşu ile kapatma
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}
