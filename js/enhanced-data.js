// GENİŞLETİLMİŞ VERİ YAPISI - Mevcut data.js'nin üzerine eklenen özellikler

// GENİŞLETİLMİŞ OYUNCU YAPISI
const enhancedPlayers = [
    { 
        id: 'onur_mustafa', 
        name: 'Onur Mustafa KÖSE',
        rating: 85, // 0-100 arası oyuncu gücü
        position: 'Forvet', // Mevki bilgisi
        profileImage: 'img/oyuncular/onur_mustafa.jpg', // Profil fotoğrafı
        birthDate: '1995-05-15', // Doğum tarihi
        joinDate: '2024-09-01', // Lige katılma tarihi
        favNumber: 10, // Favori forma numarası
        bio: 'Sağ ayak tercihi olan hızlı forvet. Takımın gol kralı.',
        socialMedia: {
            instagram: '@onurkose',
            twitter: '@onurkose'
        }
    },
    // ... diğer oyuncular benzer formatta
];

// SEZONLUK VERİ YAPISI
const seasonData = {
    '2024-2025': {
        matches: [
            // Geçmiş sezon maçları
        ],
        seasonStats: {
            topScorer: 'onur',
            topAssist: 'ensarb', 
            mostMVP: 'ahmets',
            totalGoals: 45,
            totalMatches: 12
        }
    },
    '2025-2026': {
        matches: [
            // Mevcut sezon maçları (mevcut matches dizisi buraya taşınır)
        ],
        seasonStats: {
            // Otomatik hesaplanacak
        }
    }
};

// GELECEK MAÇLAR YAPISI
const upcomingMatches = [
    {
        id: 'upcoming-1',
        date: '2025-10-25',
        time: '19:00',
        venue: 'Spor Kompleksi Sahası A',
        teamA: ['onur', 'ensarb', 'ahmets', 'burakk', 'emree', 'enes', 'omere'],
        teamB: ['furkans', 'furkany', 'ibrahim', 'tayyipb', 'muhammetc', 'muratcan', 'orhan'],
        predictions: [], // Kullanıcı tahminleri localStorage'da tutulacak
        isConfirmed: true
    }
];



// Basit oyuncu profil verisi fonksiyonu (sadece kullanılan kısım)
function getPlayerProfileData(playerId) {
    const player = enhancedPlayers.find(p => p.id === playerId);
    if (!player) return null;
    
    return {
        basic: { ...player }
    };
}

// EXPORT
// Bu veriler mevcut data.js dosyasına entegre edilecek veya ayrı dosya olarak import edilecek