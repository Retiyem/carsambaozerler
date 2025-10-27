// Oyuncular listesi
const players = [
    { id: 'onur_mustafa', name: 'Onur Mustafa KÖSE', mevki: 'Defans' },
    { id: 'ensar_bulbul', name: 'Ensar BÜLBÜL', mevki: 'Orta Saha' },
    { id: 'ahmet_sadıkoglu', name: 'Ahmet SADIKOĞLU', mevki: 'Forvet' },
    { id: 'burak_kocabey', name: 'Burak KOCABEY', mevki: 'Forvet' },
    { id: 'furkan_demiral', name: 'Furkan DEMİRAL', mevki: 'Defans' },
    { id: 'emre_erdal', name: 'Emre ERDAL', mevki: 'Defans' },
    { id: 'enes_altan', name: 'Enes Altan ARICI', mevki: 'Defans' },
    { id: 'ömer_erdal', name: 'Ömer ERDAL', mevki: 'Orta Saha' },
    { id: 'furkan_sevimli', name: 'Furkan SEVİMLİ', mevki: 'Orta Saha' },
    { id: 'furkan_yilmaz', name: 'Furkan YILMAZ', mevki: 'Forvet' },
    { id: 'ibrahim_erdogdu', name: 'İbrahim ERDOĞDU', mevki: 'Kaleci' },
    { id: 'berkin_tayyip_ceran', name: 'Berkin Tayyip CERAN', mevki: 'Defans' },
    { id: 'muratcan_solmaz', name: 'Muratcan SOLMAZ', mevki: 'Defans' },
    { id: 'orhan_sariaydin', name: 'Orhan SARIAYDIN', mevki: 'Orta Saha' },
    { id: 'ozan_necipoglu', name: 'Ozan NECİPOĞLU', mevki: 'Orta Saha' },
    { id: 'ridvan_gumus', name: 'Rıdvan GÜMÜŞ', mevki: 'Forvet' },
    { id: 'fatih_atalay', name: 'Fatih ATALAY', mevki: 'Forvet' },
    { id: 'seyfeddin_bulbul', name: 'Seyfeddin BÜLBÜL', mevki: 'Orta Saha' },
    { id: 'talha_bulbul', name: 'Talha BÜLBÜL', mevki: 'Defans' },
    { id: 'tayyip_erdogan_yilmaz', name: 'Tayyip Erdoğan YILMAZ', mevki: 'Orta Saha' },
    { id: 'firatcan_solmaz', name: 'Fıratcan SOLMAZ', mevki: 'Defans' },
    { id: 'can_atilgan', name: 'Can ATILGAN', mevki:  'Defans' },
    { id: 'alper_basdag', name: 'Alper BASDAĞ', mevki: 'Orta Saha' },
    { id: 'huseyincan_yuksekdag', name: 'Hüseyin Can YÜKSEKDAĞ', mevki: 'Kaleci' },
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
            { playerId: 'berkin_tayyip_ceran', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'ozan_necipoglu', team: 'B', goals: 1, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
    {
        id: 2, // İkinci maç
        date: '27.10.2025', // Maç tarihi
        teamAGoals: 11, // A Takımının attığı gol
        teamBGoals: 11, // B Takımının attığı gol
        macin_adami: 'talha_bulbul', // Talha çok iyi kaleci performansı gösterdi
        esek_adam: 'ensar_bulbul', // Belirlenecek
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'can_atilgan', team: 'A', goals: 5, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'A', goals: 0, weeklyMVP: true },
            { playerId: 'orhan_sariaydin', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'furkan_yilmaz', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'burak_kocabey', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'ahmet_sadıkoglu', team: 'A', goals: 3, weeklyMVP: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'onur_mustafa', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'furkan_demiral', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'furkan_sevimli', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'tayyip_erdogan_yilmaz', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'B', goals: 2, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
];

// HAFTANIN ADAMI SİSTEMİ
const weeklyHeroes = [
    // Her hafta için haftanın adamı ve istatistikleri
    {
        week: 1, // Hafta numarası
        date: '22.10.2025', // Hafta tarihi
        playerId: 'ridvan_gumus', // Haftanın adamının ID'si
        playerName: 'Rıdvan GÜMÜŞ', // Haftanın adamının adı
        note: 'Bu hafta sahada adeta kasırga gibiydi! 8 gol atarak takımını zafere taşıdı.', // Haftanın adamı notu
        stats: {
            matchesPlayed: 1, // O hafta oynadığı maç sayısı
            goals: 8, // O hafta attığı gol
            assists: 0, // O hafta yaptığı asist
            teamWins: 1, // Takımının kazandığı maç sayısı
            performance: 'Haftanın en golcüsü! 8 golle muhteşem performans.'
        }
    },
    {
        week: 2, // Hafta numarası
        date: '27.10.2025', // Hafta tarihi
        playerId: 'talha_bulbul', // Haftanın adamının ID'si
        playerName: 'Talha BÜLBÜL', // Haftanın adamının adı
        note: 'Çok iyi kalecilik yaptı! Kritik kurtarışlarıyla takımının galibiyetinde büyük pay sahibi oldu.', // Haftanın adamı notu
        stats: {
            matchesPlayed: 1, // O hafta oynadığı maç sayısı
            goals: 0, // O hafta attığı gol
            assists: 0, // O hafta yaptığı asist
            teamWins: 1, // Takımının kazandığı maç sayısı
            performance: 'Muhteşem kaleci performansı! Maçı kurtardı.'
        }
    }
];