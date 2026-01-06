// Oyuncular listesi - Yeni Güç Sistemi ile
// Her oyuncunun 5 farklı özelliği var: Fizik, Bitiricilik, Teknik, Oyun Okuma, Dayanıklılık
const players = [
    // { id: 'onur_mustafa', name: 'Onur Mustafa KÖSE', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'ensar_bulbul', name: 'Ensar BÜLBÜL', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'ahmet_sadıkoglu', name: 'Ahmet SADIKOĞLU', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'burak_kocabey', name: 'Burak KOCABEY', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'furkan_demiral', name: 'Furkan DEMİRAL', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'emre_erdal', name: 'Emre ERDAL', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'enes_altan', name: 'Enes Altan ARICI', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'ömer_erdal', name: 'Ömer ERDAL', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_1', name: 'Misafir 1', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_2', name: 'Misafir 2', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_3', name: 'Misafir 3', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_4', name: 'Misafir 4', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'kadir_yoney', name: 'Kadir YÖNEY', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'mushap_karatas', name: 'Mushap KARATAŞ', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'furkan_sevimli', name: 'Furkan SEVİMLİ', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'furkan_yilmaz', name: 'Furkan YILMAZ', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'süleyman_yildirim', name: 'Süleyman YILDIRIM', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'ibrahim_erdogdu', name: 'İbrahim ERDOĞDU', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'berkin_tayyip_ceran', name: 'Berkin Tayyip CERAN', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'muratcan_solmaz', name: 'Muratcan SOLMAZ', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'orhan_sariaydin', name: 'Orhan SARIAYDIN', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'ozan_necipoglu', name: 'Ozan NECİPOĞLU', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'ridvan_gumus', name: 'Rıdvan GÜMÜŞ', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'fatih_atalay', name: 'Fatih ATALAY', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'seyfeddin_bulbul', name: 'Seyfeddin BÜLBÜL', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'talha_bulbul', name: 'Talha BÜLBÜL', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'tayyip_erdogan_yilmaz', name: 'Tayyip Erdoğan YILMAZ', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'firatcan_solmaz', name: 'Fıratcan SOLMAZ', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'can_atilgan', name: 'Can ATILGAN', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'alper_basdag', name: 'Alper BASDAĞ', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'yakup_sunay', name: 'Yakup SUNAY', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'eren_yilmaz', name: 'Eren YILMAZ', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'huseyincan_yuksekdag', name: 'Hüseyin Can YÜKSEKDAĞ', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
];

// Maçlar ve oyuncu performansları
// YENİ SEZON - 2. SEZON (Ocak 2026'dan itibaren)
// Her obje bir maçı temsil eder. İçindeki 'performances' dizisi o maçtaki her oyuncunun performansını tutar.
// weeklyMVP artık kullanılmıyor - macin_adami parametresi MVP'yi belirler
const matches = [
    // ÖRNEK MAÇ FORMATI:
    /*
    {
        id: 1, // Her maç için benzersiz bir ID ver
        date: 'GG.AA.YYYY', // Maç tarihi (örn: '08.01.2026')
        teamAGoals: 0, // A Takımının attığı gol
        teamBGoals: 0, // B Takımının attığı gol
        macin_adami: 'oyuncu_id', // MVP oyuncunun ID'si
        macin_adami_aciklama: 'MVP seçilme nedeni...', // MVP açıklaması
        esek_adam: 'oyuncu_id', // Haftanın eşşeği ID'si (opsiyonel)
        esek_adam_aciklama: 'Eşşek seçilme nedeni...', // Eşşek açıklaması
        video_aciklama: 'Maç özeti açıklaması...', // Video açıklaması
        performances: [
            // A Takımı oyuncuları
            { playerId: 'oyuncu_id', team: 'A', goals: 0 },
            { playerId: 'oyuncu_id', team: 'A', goals: 0 },
            // ... diğer A takımı oyuncuları

            // B Takımı oyuncuları
            { playerId: 'oyuncu_id', team: 'B', goals: 0 },
            { playerId: 'oyuncu_id', team: 'B', goals: 0 },
            // ... diğer B takımı oyuncuları
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan oyuncuları ekleyin.
        ]
    },
    */
    // İlk maçınızı yukarıdaki formatı kullanarak buraya ekleyin
];

// Sıradaki Maç Kadrosu - Buradan düzenleyebilirsiniz
const nextMatchLineup = {
    teamA: [
        'süleyman_yildirim', // Süleyman Yıldırım
        'ensar_bulbul',        // Ensar Bülbül
        'fatih_atalay',          // Fatih Atalay
        'emre_erdal',        // Emre Erdal
        'huseyincan_yuksekdag',    // Hüseyin Can Yüksekdağ
        'seyfeddin_bulbul', // Seyfeddin Bülbül
        'yakup_sunay',    // Yakup Sunay
        'tayyip_erdogan_yilmaz',      // Tayyip Erdoğan Yılmaz
        'ahmet_sadıkoglu',      // Ahmet Sadıkoğlu
    ],
    teamB: [
        // 'onur_mustafa',        // Onur Mustafa Köse
        'mushap_karatas',      // Mushap Karataş
        'furkan_yilmaz',      // Furkan Yılmaz
        'talha_bulbul',        // Talha Bülbül
        'ibrahim_erdogdu',      // İbrahim Erdoğdu
        'eren_yilmaz',        // Eren Yılmaz
        'kadir_yoney',        // Kadir Yöney
        'ömer_erdal',        // Ömer Erdal
        'orhan_sariaydin',      // Orhan Sarıaydın
    ]
};
