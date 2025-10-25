// Oyuncular listesi
const players = [
    { id: 'onur_mustafa', name: 'Onur Mustafa KÖSE' },
    { id: 'ensar_bulbul', name: 'Ensar BÜLBÜL' },
    { id: 'ahmet_sadıkoglu', name: 'Ahmet SADIKOĞLU' },
    { id: 'burak_kocabey', name: 'Burak KOCABEY' },
    { id: 'furkan_demiral', name: 'Furkan DEMİRAL' },
    { id: 'emre_erdal', name: 'Emre ERDAL' },
    { id: 'enes_altan', name: 'Enes Altan ARICI' },
    { id: 'ömer_erdal', name: 'Ömer ERDAL' },
    { id: 'furkan_sevimli', name: 'Furkan SEVİMLİ' },
    { id: 'furkan_yilmaz', name: 'Furkan YILMAZ' },
    { id: 'ibrahim_erdogdu', name: 'İbrahim ERDOĞDU' },
    { id: 'tayyip_berkin_ceran', name: 'Tayyip Berkin CERAN' },
    { id: 'muratcan_solmaz', name: 'Muratcan SOLMAZ' },
    { id: 'orhan_sariaydin', name: 'Orhan SARIAYDIN' },
    { id: 'ozan_necipoglu', name: 'Ozan NECİPOĞLU' },
    { id: 'ridvan_gumus', name: 'Rıdvan GÜMÜŞ' },
    { id: 'seyfeddin_bulbul', name: 'Seyfeddin BÜLBÜL' },
    { id: 'talha_bulbul', name: 'Talha BÜLBÜL' },
    { id: 'tayyip_erdogan_yilmaz', name: 'Tayyip Erdoğan YILMAZ' },
    { id: 'firatcan_solmaz', name: 'Fıratcan SOLMAZ' },
    { id: 'can_atilgan', name: 'Can ATILGAN ' },
    { id: 'alper_basdag', name: 'Alper BASDAĞ ' },
];

// Maçlar ve oyuncu performansları
// Henüz hiç maç oynanmadığı için bu dizi başlangıçta boş.
// Her obje bir maçı temsil eder. İçindeki 'performances' dizisi o maçtaki her oyuncunun performansını tutar.
const matches = [
    // İlk maçınızı buraya eklemek için aşağıdaki formatı kullanın:
    /*
    {
        id: 1, // Her maç için benzersiz bir ID ver (ilk maç için 1)
        date: 'GG.AA.YYYY', // Maç tarihi (örn: '01.11.2025')
        teamAGoals: 0, // A Takımının attığı gol
        teamBGoals: 0, // B Takımının attığı gol
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'onur', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ensarb', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ahmets', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'burakk', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'emree', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'enes', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'omere', team: 'A', goals: 0, weeklyMVP: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'furkans', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'furkany', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'ibrahim', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'tayyipb', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'muhammetc', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'muratcan', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'orhan', team: 'B', goals: 0, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
        /*
        {
        id: 1, // Her maç için benzersiz bir ID ver (ilk maç için 1)
        date: 'GG.AA.YYYY', // Maç tarihi (örn: '01.11.2025')
        teamAGoals: 0, // A Takımının attığı gol
        teamBGoals: 0, // B Takımının attığı gol
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'onur', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ensarb', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ahmets', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'burakk', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'emree', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'enes', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'omere', team: 'A', goals: 0, weeklyMVP: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'furkans', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'furkany', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'ibrahim', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'tayyipb', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'muhammetc', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'muratcan', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'orhan', team: 'B', goals: 0, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
    // Her yeni maç için bu objeyi kopyalayıp düzenleyin.
    // 'id' değerini bir artırmayı unutmayın!
    */
           {
        id: 1, // Her maç için benzersiz bir ID ver (ilk maç için 1)
        date: '22.10.2025', // Maç tarihi (örn: '01.11.2025')
        teamAGoals: 14, // A Takımının attığı gol
        teamBGoals: 13, // B Takımının attığı gol
        macin_adami: 'ridvan_gumus',
        esek_adam: 'orhan_sariaydin',
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'ridvan_gumus', team: 'A', goals: 8, weeklyMVP: true },
            { playerId: 'ömer_erdal', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ahmet_sadıkoglu', team: 'A', goals: 3, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'orhan_sariaydin', team: 'A', goals: 3, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'furkan_demiral', team: 'A', goals: 0, weeklyMVP: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'burak_kocabey', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'furkan_sevimli', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'alper_basdag', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'tayyip_berkin_ceran', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'ozan_necipoglu', team: 'B', goals: 1, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
];

// HAFTANIN ADAMI SİSTEMİ
const weeklyHeroes = [
    // Her hafta için haftanın adamı ve istatistikleri
    /*
    {
        week: 1, // Hafta numarası
        date: '19.10.2025', // Hafta tarihi
        playerId: 'onur_mustafa', // Haftanın adamının ID'si
        playerName: 'Onur Mustafa KÖSE', // Haftanın adamının adı
        stats: {
            matchesPlayed: 1, // O hafta oynadığı maç sayısı
            goals: 3, // O hafta attığı gol
            assists: 2, // O hafta yaptığı asist
            teamWins: 1, // Takımının kazandığı maç sayısı
            performance: 'Haftanın en golcüsü! 3 gol ve 2 asistle muhteşem performans.'
        }
    }
    */
];