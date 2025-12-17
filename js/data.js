// Oyuncular listesi
const players = [
    { id: 'onur_mustafa', name: 'Onur Mustafa KÖSE', mevki: 'Defans' },
    { id: 'ensar_bulbul', name: 'Ensar BÜLBÜL', mevki: 'Orta Saha' },
    { id: 'ahmet_sadıkoglu', name: 'Ahmet SADIKOĞLU', mevki: 'Forvet' },
    { id: 'burak_kocabey', name: 'Burak KOCABEY', mevki: 'Forvet' },
    { id: 'furkan_demiral', name: 'Furkan DEMİRAL', mevki: 'Defans' },
    { id: 'emre_erdal', name: 'Emre ERDAL', mevki: 'Defans' },
    { id: 'enes_altan', name: 'Enes Altan ARICI', mevki: 'Defans' },
    { id: 'ömer_erdal', name: 'Ömer ERDAL', mevki: 'Forvet' },
    { id: 'mushap_karatas', name: 'Mushap KARATAŞ', mevki: 'Forvet' },
    { id: 'furkan_sevimli', name: 'Furkan SEVİMLİ', mevki: 'Orta Saha' },
    { id: 'furkan_yilmaz', name: 'Furkan YILMAZ', mevki: 'Forvet' },
    { id: 'süleyman_yildirim', name: 'Süleyman YILDIRIM', mevki: 'Forvet' },
    { id: 'ibrahim_erdogdu', name: 'İbrahim ERDOĞDU', mevki: 'Kaleci' },
    { id: 'berkin_tayyip_ceran', name: 'Berkin Tayyip CERAN', mevki: 'Defans' },
    { id: 'muratcan_solmaz', name: 'Muratcan SOLMAZ', mevki: 'Defans' },
    { id: 'orhan_sariaydin', name: 'Orhan SARIAYDIN', mevki: 'Orta Saha' },
    { id: 'ozan_necipoglu', name: 'Ozan NECİPOĞLU', mevki: 'Defans' },
    { id: 'ridvan_gumus', name: 'Rıdvan GÜMÜŞ', mevki: 'Forvet' },
    { id: 'fatih_atalay', name: 'Fatih ATALAY', mevki: 'Orta Saha' },
    { id: 'seyfeddin_bulbul', name: 'Seyfeddin BÜLBÜL', mevki: 'Orta Saha' },
    { id: 'talha_bulbul', name: 'Talha BÜLBÜL', mevki: 'Kaleci' },
    { id: 'tayyip_erdogan_yilmaz', name: 'Tayyip Erdoğan YILMAZ', mevki: 'Orta Saha' },
    { id: 'firatcan_solmaz', name: 'Fıratcan SOLMAZ', mevki: 'Defans' },
    { id: 'can_atilgan', name: 'Can ATILGAN', mevki:  'Defans' },
    { id: 'alper_basdag', name: 'Alper BASDAĞ', mevki: 'Orta Saha' },
    { id: 'yakup_sunay', name: 'Yakup SUNAY', mevki: 'Orta Saha' },
    { id: 'eren_yilmaz', name: 'Eren YILMAZ', mevki: 'Orta Saha' },
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
    { // İlk maç
        id: 1, // Her maç için benzersiz bir ID ver (ilk maç için 1)
        date: '22.10.2025', // Maç tarihi (örn: '01.11.2025')
        teamAGoals: 14, // A Takımının attığı gol
        teamBGoals: 13, // B Takımının attığı gol
        macin_adami: 'ridvan_gumus',
        macin_adami_aciklama: 'Sahada adeta kasırga gibiydi! 8 gol atarak takımını zafere taşıdı.',
        esek_adam: 'orhan_sariaydin',
        esek_adam_aciklama: 'Bu hafta performans beklenenden düşüktü.',
        video_aciklama: 'İlk maçtan unutulmaz anlar...', // Son Maçın Unutulmaz Anı açıklaması
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
    { // İkinci maç
        id: 2, // İkinci maç
        date: '27.10.2025', // Maç tarihi
        teamAGoals: 11, // A Takımının attığı gol
        teamBGoals: 11, // B Takımının attığı gol
        macin_adami: 'talha_bulbul', // Talha çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Talha muhteşem kurtarışlarla maçı kurtardı!',
        esek_adam: 'ensar_bulbul', // Belirlenecek
        esek_adam_aciklama: 'Bu maçta beklenen performansı gösteremedi.',
        video_aciklama: '2. hafta heyecanlı anları...', // Son Maçın Unutulmaz Anı açıklaması
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
    { // Üçüncü maç
        id: 3, // Üçüncü maç
        date: '29.10.2025', // Maç tarihi
        teamAGoals: 3, // A Takımının attığı gol
        teamBGoals: 2, // B Takımının attığı gol
        macin_adami: 'ensar_bulbul', // Talha çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Ensar harika savunma performansı gösterdi!',
        esek_adam: 'ahmet_sadıkoglu', // Belirlenecek
        esek_adam_aciklama: 'Bu hafta maalesef yetersiz kaldı.',
        video_aciklama: '3. hafta sıkı mücadele...', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'onur_mustafa', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'ahmet_sadıkoglu', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'A', goals: 0, weeklyMVP: true },
            { playerId: 'furkan_sevimli', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'fatih_atalay', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ozan_necipoglu', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'A', goals: 0, weeklyMVP: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'talha_bulbul', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'furkan_yilmaz', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'tayyip_erdogan_yilmaz', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'huseyincan_yuksekdag', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'ridvan_gumus', team: 'B', goals: 1, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
    { // Dördüncü maç
        id: 4, // Dördüncü maç
        date: '02.11.2025', // Maç tarihi
        teamAGoals: 7, // A Takımının attığı gol
        teamBGoals: 19, // B Takımının attığı gol
        macin_adami: 'huseyincan_yuksekdag', // Talha çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Hüseyin Can inanılmaz bir performans sergiledi!',
        esek_adam: 'seyfeddin_bulbul', // Belirlenecek
        esek_adam_aciklama: 'Maalesef bu hafta etkili olamadı.',
        video_aciklama: '4. hafta gol şov!', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'furkan_sevimli', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'orhan_sariaydin', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'furkan_yilmaz', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ridvan_gumus', team: 'A', goals: 3, weeklyMVP: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'onur_mustafa', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'furkan_demiral', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'burak_kocabey', team: 'B', goals: 6, weeklyMVP: false },
            { playerId: 'huseyincan_yuksekdag', team: 'B', goals: 0, weeklyMVP: true },
            { playerId: 'ahmet_sadıkoglu', team: 'B', goals: 6, weeklyMVP: false },
            { playerId: 'tayyip_erdogan_yilmaz', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'B', goals: 4, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'B', goals: 2, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
        { // Beşinci maç
        id: 5, // Dördüncü maç
        date: '06.11.2025', // Maç tarihi
        teamAGoals: 10, // A Takımının attığı gol
        teamBGoals: 9, // B Takımının attığı gol
        macin_adami: 'fatih_atalay', // Talha çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Fatih mükemmel kaleci performansıyla maçı kazandırdı!',
        esek_adam: 'ahmet_sadıkoglu', // Belirlenecek
        esek_adam_aciklama: 'Bu hafta istenen performansı veremedi.',
        video_aciklama: '5. hafta kritik anlar...', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'ahmet_sadıkoglu', team: 'A', goals: 4, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'berkin_tayy"ip_ceran', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'ozan_necipoglu', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'fatih_atalay', team: 'A', goals: 0, weeklyMVP: true },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'onur_mustafa', team: 'B', goals: 6, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'yakup_sunay', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'huseyincan_yuksekdag', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'B', goals: 1, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },
    {  // Altıncı maç
        id: 6, // Dördüncü maç
        date: '12.11.2025', // Maç tarihi
        teamAGoals: 8, // A Takımının attığı gol
        teamBGoals: 25, // B Takımının attığı gol
        macin_adami: 'ridvan_gumus', // Talha çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Rıdvan 9 golle sahaya damgasını vurdu!',
        esek_adam: 'talha_bulbul', // Belirlenecek
        esek_adam_aciklama: 'Bu hafta savunmada zorlandı.',
        video_aciklama: '6. hafta gol yağmuru!', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'tayyip_erdogan_yilmaz', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'ozan_necipoglu', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'furkan_demiral', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'fatih_atalay', team: 'A', goals: 1, weeklyMVP: false },
            // B Takımı oyuncuları (7 kişi)
            { playerId: 'ridvan_gumus', team: 'B', goals: 9, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'yakup_sunay', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'B', goals: 8, weeklyMVP: false },
            { playerId: 'orhan_sariaydin', team: 'B', goals: 6, weeklyMVP: true },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },

    { // Yedinci maç
        id: 7, // Yedinci maç
        date: '19.11.2025', // Maç tarihi
        teamAGoals: 12, // A Takımının attığı gol
        teamBGoals: 15, // B Takımının attığı gol
        macin_adami: 'onur_mustafa', // Onur çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Onur 4 golle harika bir performans sergiledi!',
        esek_adam: 'ibrahim_erdogdu', // Belirlenecek
        esek_adam_aciklama: 'Bu hafta takıma yeterli katkıyı sağlayamadı.',
        video_aciklama: '7. hafta nefes kesen anlar...', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'tayyip_erdogan_yilmaz', team: 'A', goals: 4, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ridvan_gumus', team: 'A', goals: 3, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'yakup_sunay', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'A', goals: 1, weeklyMVP: false },
            // B Takımı oyuncuları (7 kişi)
            { playerId: 'ahmet_sadıkoglu', team: 'B', goals: 6, weeklyMVP: false },
            { playerId: 'huseyincan_yuksekdag', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'furkan_sevimli', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'burak_kocabey', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'onur_mustafa', team: 'B', goals: 4, weeklyMVP: true },
            { playerId: 'talha_bulbul', team: 'B', goals: 0, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },

    { // Sekizinci maç
        id: 8, // Yedinci maç
        date: '03.12.2025', // Maç tarihi
        teamAGoals: 9, // A Takımının attığı gol
        teamBGoals: 11, // B Takımının attığı gol
        macin_adami: 'huseyincan_yuksekdag', // Onur çok iyi kaleci performansı gösterdi
        macin_adami_aciklama: 'Muhteşem kurtarışlarla maçı kazandırdı!',
        esek_adam: 'furkan_sevimli', // Belirlenecek
        esek_adam_aciklama: 'Bu hafta maalesef performans beklenenin altındaydı.',
        video_aciklama: '8. hafta unutulmaz anları...', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'onur_mustafa', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'furkan_sevimli', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'furkan_demiral', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'ahmet_sadıkoglu', team: 'A', goals: 3, weeklyMVP: false },
            { playerId: 'ibrahim_erdogdu', team: 'A', goals: 1, weeklyMVP: false },
            // B Takımı oyuncuları (7 kişi)
            { playerId: 'seyfeddin_bulbul', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'huseyincan_yuksekdag', team: 'B', goals: 0, weeklyMVP: true },
            { playerId: 'eren_yilmaz', team: 'B', goals: 4, weeklyMVP: false },
            { playerId: 'burak_kocabey', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'B', goals: 0, weeklyMVP: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.

        ]
    },

                    { // Dokuzuncu maç
        id: 9, // Yedinci maç
        date: '11.12.2025', // Maç tarihi
        teamAGoals: 12, // A Takımının attığı gol
        teamBGoals: 9, // B Takımının attığı gol
        macin_adami: 'huseyincan_yuksekdag', // Onur çok iyi kalecicd performansı gösterdi
        macin_adami_aciklama: 'Kaleci oyuncu defans adeta bir duvar ama dikkat edin her an ses kaydı atabilir !',
        esek_adam: 'onur_mustafa', // Belirlenecek
        esek_adam_aciklama: 'Yetenek,Güç,Yakışıklılık...Takım arkadaşları onu çok kıskandığı için oylamada onu seçti..',
        video_aciklama: 'Yetişkin bir orhan dakikada yarım saat su içebilir...', // Son Maçın Unutulmaz Anı açıklaması
        performances: [
            // A Takımı oyuncuları (7 kişi)
            { playerId: 'onur_mustafa', team: 'A', goals: 5, weeklyMVP: false },
            { playerId: 'ensar_bulbul', team: 'A', goals: 1, weeklyMVP: false },
            { playerId: 'furkan_yilmaz', team: 'A', goals: 0, weeklyMVP: false },
            { playerId: 'seyfeddin_bulbul', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'ömer_erdal', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'fatih_atalay', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'emre_erdal', team: 'A', goals: 2, weeklyMVP: false },
            { playerId: 'huseyincan_yuksekdag', team: 'A', goals: 0, weeklyMVP: true },
            // B Takımı oyuncuları (7 kişi)
            { playerId: 'enes_altan', team: 'B', goals: 1, weeklyMVP: false },
            { playerId: 'tayyip_erdogan_yilmaz', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'ahmet_sadıkoglu', team: 'B', goals: 3, weeklyMVP: false },
            { playerId: 'furkan_demiral', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'yakup_sunay', team: 'B', goals: 0, weeklyMVP: false },
            { playerId: 'orhan_sariaydin', team: 'B', goals: 2, weeklyMVP: false },
            { playerId: 'talha_bulbul', team: 'B', goals: 0, weeklyMVP: false },
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

    },
    {
        week: 2, // Hafta numarası
        date: '27.10.2025', // Hafta tarihi
        playerId: 'talha_bulbul', // Haftanın adamının ID'si
        playerName: 'Talha BÜLBÜL', // Haftanın adamının adı
        note: 'Çok iyi kalecilik yaptı! Kritik kurtarışlarıyla takımının galibiyetinde büyük pay sahibi oldu.', // Haftanın adamı notu

    },
    {
        week: 3, // Hafta numarası
        date: '29.10.2025', // Hafta tarihi
        playerId: 'ensar_bulbul', // Haftanın adamının ID'si
        playerName: 'Ensar BULBUL', // Haftanın adamının adı
        note: 'Bu hafta savunmada çok iyi oynadı! Rakip forvetlere geçit vermedi.', // Haftanın adamı notu

    },
        {
        week: 4, // Hafta numarası
        date: '03.11.2025', // Hafta tarihi
        playerId: 'huseyincan_yuksekdag', // Haftanın adamının ID'si
        playerName: 'HüseyinCAN YÜKSEKDAĞ', // Haftanın adamının adı
        note: 'Çok iyi kalecilik yaptı! Kritik kurtarışlarıyla takımının galibiyetinde büyük pay sahibi oldu.', // Haftanın adamı notu

    },
        {
        week: 5, // Hafta numarası
        date: '06.11.2025', // Hafta tarihi
        playerId: 'fatih_atalay', // Haftanın adamının ID'si
        playerName: 'Fatih Atalay', // Haftanın adamının adı
        note: 'Yaptığı Teknik paslar ve kurduğu oyunla takımını zafere taşıdı...', // Haftanın adamı notu
        
    },
            {
        week: 6, // Hafta numarası
        date: '12.11.2025', // Hafta tarihi
        playerId: 'ridvan_gumus', // Haftanın adamının ID'si
        playerName: 'Rıdvan GÜMÜŞ', // Haftanın adamının adı
        note: 'Yaptığı Teknik paslar ve kurduğu oyunla takımını zafere taşıdı...', // Haftanın adamı notu

    },

                {
        week: 7, // Hafta numarası
        date: '19.11.2025', // Hafta tarihi
        playerId: 'onur_mustafa', // Haftanın adamının ID'si
        playerName: 'Onur Mustafa KÖSE', // Haftanın adamının adı
        note: 'Öyle bir oynadı ki, rakipler maç bitince ‘biz niye geldik ?’ dedi...', // Haftanın adamı notu
    },
                    {
        week: 8, // Hafta numarası
        date: '03.12.2025', // Hafta tarihi
        playerId: 'huseyincan_yuksekdag', // Haftanın adamının ID'si
        playerName: 'HüseyinCAN YÜKSEKDAĞ', // Haftanın adamının adı
        note: 'Hem kalede Hem oyunda Ahmetin kocası oldu...', // Haftanın adamı notu
    },
];

// SEZON SİSTEMİ
// Sezonlar 3 ayda bir sıfırlanır
// İlk sezon 1 Ocak 2026'da sona erecek
const seasonSettings = {
    startDate: '01.10.2025', // İlk sezonun başlangıç tarihi
    seasonDurationMonths: 3, // Sezon süresi (ay)
    resetDay: 1, // Her sezonun başladığı gün (ayın kaçında)
    // Sıfırlama ayları: Ocak, Nisan, Temmuz, Ekim
    resetMonths: [1, 4, 7, 10]
};

// Geçmiş sezonlar ve mevcut sezon verileri
const seasons = {
    current: {
        id: 1,
        name: 'BereketMarket Sezonu',
        startDate: '01.11.2025',
        endDate: '31.12.2025',
        status: 'active' // active, completed
    },
    history: [
        // Gelecekteki sezonlar buraya eklenecek
        // {
        //     id: 1,
        //     name: 'Sezon 1',
        //     startDate: '01.11.2025',
        //     endDate: '01.01.2026',
        //     status: 'completed',
        //     finalStandings: [...], // Sezon sonu puan durumu
        //     champion: 'playerId', // Şampiyon oyuncu
        //     topScorer: 'playerId', // En golcü
        //     mvpCount: { playerId: count } // MVP sayıları
        // }
    ]
};

// Sıradaki Maç Kadrosu - Buradan düzenleyebilirsiniz
const nextMatchLineup = {
    teamA: [
        'onur_mustafa',        // Onur Mustafa Köse
        'emre_erdal',          // Emre Erdal
        'ibrahim_erdogdu', // HüseyinCAN YÜKSEKDAĞ
        'huseyincan_yuksekdag',       // İbrahim Erdoğdu
        'tayyip_erdogan_yilmaz',      // Furkan Sevimli
        'mushap_karatas',       // Muşhap Karataş
        'ensar_bulbul',            // Fatih Atalay
        'süleyman_yildirim',     // Ozan Necipoğlu
        'furkan_sevimli'        // Fıratcan Solmaz
    ],
    teamB: [
        'ömer_erdal',          // Ömer Erdal
        'ozan_necipoglu',        // Onur Mustafa Köse
        'ahmet_sadıkoglu',          // Emre Erdal
        'seyfeddin_bulbul',        // Talha Bülbül
        'furkan_yilmaz',    // Seyfeddin Bülbül
        'talha_bulbul', // Tayyip Erdoğan Yılmaz
        'muratcan_solmaz',    // Murat Can Yılmaz
        'firatcan_solmaz',      // Süleyman Yıldız  
        'burak_kocabey'        // Ensar Bülbül
    ]
};