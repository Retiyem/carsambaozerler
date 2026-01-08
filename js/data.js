// Oyuncular listesi
const players = [
    { id: 'onur_mustafa', name: 'Onur Mustafa KÖSE', mevki: 'Defans', fizik: 96, bitiricilik: 93, teknik: 95, oyunOkuma: 96, dayaniklilik: 88 },
    { id: 'ensar_bulbul', name: 'Ensar BÜLBÜL', mevki: 'Defans', fizik: 80, bitiricilik: 72, teknik: 80, oyunOkuma: 77, dayaniklilik: 91 },
    { id: 'ahmet_sadikoglu', name: 'Ahmet SADIKOĞLU', mevki: 'Forvet', fizik: 84, bitiricilik: 89, teknik: 82, oyunOkuma: 82, dayaniklilik: 81 },
    { id: 'burak_kocabey', name: 'Burak KOCABEY', mevki: 'Forvet', fizik: 74, bitiricilik: 94, teknik: 96, oyunOkuma: 93, dayaniklilik: 91 },
    { id: 'furkan_demiral', name: 'Furkan DEMİRAL', mevki: 'Defans', fizik: 73, bitiricilik: 82, teknik: 79, oyunOkuma: 80, dayaniklilik: 74 },
    { id: 'emre_erdal', name: 'Emre ERDAL', mevki: 'Defans', fizik: 86, bitiricilik: 76, teknik: 81, oyunOkuma: 80, dayaniklilik: 80 },
    { id: 'enes_altan', name: 'Enes Altan ARICI', mevki: 'Defans', fizik: 86, bitiricilik: 76, teknik: 76, oyunOkuma: 75, dayaniklilik: 78 },
    { id: 'ömer_erdal', name: 'Ömer ERDAL', mevki: 'Forvet', fizik: 80, bitiricilik: 82, teknik: 84, oyunOkuma: 81, dayaniklilik: 77 },
    { id: 'furkan_sevimli', name: 'Furkan SEVİMLİ', mevki: 'Orta Saha', fizik: 78, bitiricilik: 80, teknik: 85, oyunOkuma: 87, dayaniklilik: 84 },
    { id: 'misafir_1', name: 'Misafir 1', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_2', name: 'Misafir 2', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_3', name: 'Misafir 3', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_4', name: 'Misafir 4', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'kadir_yoney', name: 'Kadir YÖNEY', mevki: 'Defans', fizik: 85, bitiricilik: 78, teknik: 80, oyunOkuma: 77, dayaniklilik: 86 },
    { id: 'mushap_karatas', name: 'Mushap KARATAŞ', mevki: 'Forvet', fizik: 88, bitiricilik: 85, teknik: 87, oyunOkuma: 89, dayaniklilik: 81 },
    { id: 'furkan_yilmaz', name: 'Furkan YILMAZ', mevki: 'Orta Saha', fizik: 81, bitiricilik: 76, teknik: 87, oyunOkuma: 89, dayaniklilik: 92 },
    { id: 'suleyman_yildirim', name: 'Süleyman YILDIRIM', mevki: 'Forvet', fizik: 87, bitiricilik: 97, teknik: 91, oyunOkuma: 93, dayaniklilik: 86 },
    { id: 'ibrahim_erdogdu', name: 'İbrahim ERDOĞDU', mevki: 'Kaleci', fizik: 84, bitiricilik: 75, teknik: 75, oyunOkuma: 80, dayaniklilik: 100 },
    { id: 'berkin_tayyip_ceran', name: 'Berkin Tayyip CERAN', mevki: 'Defans', fizik: 70, bitiricilik: 75, teknik: 80, oyunOkuma: 78, dayaniklilik: 83 },
    { id: 'muratcan_solmaz', name: 'Muratcan SOLMAZ', mevki: 'Kaleci', fizik: 81, bitiricilik: 83, teknik: 85, oyunOkuma: 84, dayaniklilik: 88 },
    { id: 'orhan_sariaydin', name: 'Orhan SARIAYDIN', mevki: 'Orta Saha', fizik: 80, bitiricilik: 87, teknik: 85, oyunOkuma: 83, dayaniklilik: 81 },
    { id: 'ozan_necipoglu', name: 'Ozan NECİPOĞLU', mevki: 'Defans', fizik: 72, bitiricilik: 84, teknik: 93, oyunOkuma: 91, dayaniklilik: 90 },
    { id: 'ridvan_gumus', name: 'Rıdvan GÜMÜŞ', mevki: 'Forvet', fizik: 87, bitiricilik: 94, teknik: 92, oyunOkuma: 90, dayaniklilik: 90 },
    { id: 'fatih_atalay', name: 'Fatih ATALAY', mevki: 'Orta Saha', fizik: 78, bitiricilik: 83, teknik: 85, oyunOkuma: 86, dayaniklilik: 82 },
    { id: 'seyfeddin_bulbul', name: 'Seyfeddin BÜLBÜL', mevki: 'Orta Saha', fizik: 89, bitiricilik: 82, teknik: 79, oyunOkuma: 78, dayaniklilik: 84 },
    { id: 'talha_bulbul', name: 'Talha BÜLBÜL', mevki: 'Kaleci', fizik: 89, bitiricilik: 70, teknik: 70, oyunOkuma: 70, dayaniklilik: 100 },
    { id: 'tayyip_erdogan_yilmaz', name: 'Tayyip Erdoğan YILMAZ', mevki: 'Orta Saha', fizik: 82, bitiricilik: 85, teknik: 85, oyunOkuma: 85, dayaniklilik: 84 },
    { id: 'firatcan_solmaz', name: 'Fıratcan SOLMAZ', mevki: 'Defans', fizik: 83, bitiricilik: 82, teknik: 87, oyunOkuma: 87, dayaniklilik: 91 },
    { id: 'can_atilgan', name: 'Can ATILGAN', mevki: 'Defans', fizik: 95, bitiricilik: 95, teknik: 97, oyunOkuma: 95, dayaniklilik: 98 },
    { id: 'yakup_sunay', name: 'Yakup SUNAY', mevki: 'Orta Saha', fizik: 80, bitiricilik: 82, teknik: 83, oyunOkuma: 87, dayaniklilik: 87 },
    { id: 'eren_yilmaz', name: 'Eren YILMAZ', mevki: 'Orta Saha', fizik: 88, bitiricilik: 87, teknik: 84, oyunOkuma: 87, dayaniklilik: 83 },
    { id: 'huseyincan_yuksekdag', name: 'Hüseyin Can YÜKSEKDAĞ', mevki: 'Kaleci', fizik: 85, bitiricilik: 80, teknik: 90, oyunOkuma: 94, dayaniklilik: 99 },
];

// Maclar ve oyuncu performanslari
// 2. Sezon basladi - Tum veriler sifirlandi
const matches = [
    // Yeni mac eklemek icin asagidaki formati kullanin:
    /*
    {
        id: 1,
        date: 'GG.AA.YYYY',
        teamAGoals: 0,
        teamBGoals: 0,
        macin_adami: 'oyuncu_id',
        macin_adami_aciklama: 'Aciklama...',
        esek_adam: 'oyuncu_id',
        esek_adam_aciklama: 'Aciklama...',
        performances: [
            { playerId: 'oyuncu_id', team: 'A', goals: 0 },
            { playerId: 'oyuncu_id', team: 'B', goals: 0 },
        ]
    },
    */
       {
        id: 1,
        date: '07.01.2026',
        teamAGoals: 6,
        teamBGoals: 7,
        macin_adami: 'eren_yilmaz',
        macin_adami_aciklama: 'Harika bir performans sergileyerek takımı sırtladı.Onura karşı üstün bir oyun çıkardı.',
        esek_adam: 'muratcan_solmaz',
        esek_adam_aciklama: 'Bencil herif.',
        performances: [
            { playerId: 'onur_mustafa', team: 'A', goals: 3 },
            { playerId: 'tayyip_erdogan_yilmaz', team: 'A', goals: 1 },
            { playerId: 'muratcan_solmaz', team: 'A', goals: 2 },
            { playerId: 'firatcan_solmaz', team: 'A', goals: 0 },
            { playerId: 'furkan_demiral', team: 'A', goals: 0 },
            { playerId: 'huseyincan_yuksekdag', team: 'A', goals: 0 },
            { playerId: 'ömer_erdal', team: 'A', goals: 0 },

            { playerId: 'ahmet_sadikoglu', team: 'B', goals: 0 },
            { playerId: 'can_atilgan', team: 'B', goals: 4 },
            { playerId: 'ibrahim_erdogdu', team: 'B', goals: 0 },
            { playerId: 'furkan_yilmaz', team: 'B', goals: 0 },
            { playerId: 'yakup_sunay', team: 'B', goals: 1 },
            { playerId: 'furkan_sevimli', team: 'B', goals: 0 },
            { playerId: 'eren_yilmaz', team: 'B', goals: 0 },
            { playerId: 'fatih_atalay', team: 'B', goals: 2 },
        ]
    },
];

// Önceki güç skorları (değişiklikleri göstermek için)
// Güç değişikliği olduğunda burayı manuel güncellemeyi unutmayın
// Formül: (fizik + bitiricilik + teknik + oyunOkuma + dayaniklilik) / 5
const previousPowerScores = {
    'onur_mustafa': 94,          // (96+93+95+96+88)/5 = 93.6 → 94
    'ensar_bulbul': 80,          // (80+72+80+77+91)/5 = 80
    'ahmet_sadikoglu': 84,       // (84+89+82+82+81)/5 = 83.6 → 84
    'burak_kocabey': 90,         // (74+94+96+93+91)/5 = 89.6 → 90
    'furkan_demiral': 77,        // (73+82+78+80+74)/5 = 77.4 → 77
    'emre_erdal': 81,            // (86+76+81+80+80)/5 = 80.6 → 81
    'enes_altan': 78,            // (86+76+76+75+78)/5 = 78.2 → 78
    'ömer_erdal': 81,            // (80+82+84+81+77)/5 = 80.8 → 81
    'furkan_sevimli': 82,        // (78+80+83+86+83)/5 = 82
    'kadir_yoney': 81,           // (85+78+80+77+86)/5 = 81.2 → 81
    'mushap_karatas': 86,        // (88+85+87+89+81)/5 = 86
    'furkan_yilmaz': 85,         // (81+75+86+89+92)/5 = 84.6 → 85
    'suleyman_yildirim': 91,     // (87+97+91+93+86)/5 = 90.8 → 91
    'ibrahim_erdogdu': 82,       // (84+75+75+75+100)/5 = 81.8 → 82
    'berkin_tayyip_ceran': 77,   // (70+75+80+78+83)/5 = 77.2 → 77
    'muratcan_solmaz': 88,       // (83+86+86+90+94)/5 = 87.8 → 88
    'orhan_sariaydin': 83,       // (80+87+85+83+81)/5 = 83.2 → 83
    'ozan_necipoglu': 86,        // (72+84+93+91+90)/5 = 86
    'ridvan_gumus': 91,          // (87+94+92+90+90)/5 = 90.6 → 91
    'fatih_atalay': 82,          // (78+83+84+82+82)/5 = 81.8 → 82
    'seyfeddin_bulbul': 82,      // (89+82+79+78+84)/5 = 82.4 → 82
    'talha_bulbul': 80,          // (89+70+70+70+100)/5 = 79.8 → 80
    'tayyip_erdogan_yilmaz': 85, // (82+86+86+86+84)/5 = 84.8 → 85
    'firatcan_solmaz': 84,       // (81+82+86+85+88)/5 = 84.4 → 84
    'can_atilgan': 95,           // (95+93+97+94+98)/5 = 95.4 → 95
    'yakup_sunay': 82,           // (80+76+80+87+87)/5 = 82
    'eren_yilmaz': 84,           // (88+87+84+84+80)/5 = 84.6 → 85
    'huseyincan_yuksekdag': 90,  // (85+80+90+94+99)/5 = 89.6 → 90
};

// Siradaki Mac Kadrosu
const nextMatchLineup = {
    teamA: [
        'huseyincan_yuksekdag',
        'onur_mustafa',
        'ömer_erdal',
        'tayyip_erdogan_yilmaz',
        'fıratcan_solmaz',
        'furkan_demiral',
        'Misafir_3',
        'muratcan_solmaz',
    ],
    teamB: [
        'ibrahim_erdogdu',
        'furkan_yilmaz',
        'yakup_sunay',
        'furkan_sevimli',
        'eren_yilmaz',
        'ahmet_sadikoglu',
        'fatih_atalay',
        'can_atilgan',
    ]
};
