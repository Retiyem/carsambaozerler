// Oyuncular listesi
const players = [
    { id: 'onur_mustafa', name: 'Onur Mustafa KÖSE', mevki: 'Defans', fizik: 96, bitiricilik: 93, teknik: 95, oyunOkuma: 96, dayaniklilik: 88 },
    { id: 'ensar_bulbul', name: 'Ensar BÜLBÜL', mevki: 'Defans', fizik: 80, bitiricilik: 72, teknik: 80, oyunOkuma: 77, dayaniklilik: 91 },
    { id: 'ahmet_sadikoglu', name: 'Ahmet SADIKOĞLU', mevki: 'Forvet', fizik: 84, bitiricilik: 89, teknik: 82, oyunOkuma: 82, dayaniklilik: 81 },
    { id: 'burak_kocabey', name: 'Burak KOCABEY', mevki: 'Forvet', fizik: 74, bitiricilik: 94, teknik: 96, oyunOkuma: 93, dayaniklilik: 91 },
    { id: 'furkan_demiral', name: 'Furkan DEMİRAL', mevki: 'Defans', fizik: 73, bitiricilik: 82, teknik: 78, oyunOkuma: 80, dayaniklilik: 74 },
    { id: 'emre_erdal', name: 'Emre ERDAL', mevki: 'Defans', fizik: 86, bitiricilik: 76, teknik: 81, oyunOkuma: 80, dayaniklilik: 80 },
    { id: 'enes_altan', name: 'Enes Altan ARICI', mevki: 'Defans', fizik: 86, bitiricilik: 76, teknik: 76, oyunOkuma: 75, dayaniklilik: 78 },
    { id: 'ömer_erdal', name: 'Ömer ERDAL', mevki: 'Forvet', fizik: 80, bitiricilik: 82, teknik: 84, oyunOkuma: 81, dayaniklilik: 77 },
    { id: 'furkan_sevimli', name: 'Furkan SEVİMLİ', mevki: 'Orta Saha', fizik: 78, bitiricilik: 80, teknik: 83, oyunOkuma: 86, dayaniklilik: 83 },
    { id: 'misafir_1', name: 'Misafir 1', mevki: 'Forvet', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_2', name: 'Misafir 2', mevki: 'Orta Saha', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_3', name: 'Misafir 3', mevki: 'Defans', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'misafir_4', name: 'Misafir 4', mevki: 'Kaleci', fizik: 50, bitiricilik: 50, teknik: 50, oyunOkuma: 50, dayaniklilik: 50 },
    { id: 'kadir_yoney', name: 'Kadir YÖNEY', mevki: 'Defans', fizik: 85, bitiricilik: 78, teknik: 80, oyunOkuma: 77, dayaniklilik: 86 },
    { id: 'mushap_karatas', name: 'Mushap KARATAŞ', mevki: 'Forvet', fizik: 88, bitiricilik: 85, teknik: 87, oyunOkuma: 89, dayaniklilik: 81 },
    { id: 'furkan_yilmaz', name: 'Furkan YILMAZ', mevki: 'Orta Saha', fizik: 81, bitiricilik: 75, teknik: 86, oyunOkuma: 89, dayaniklilik: 92 },
    { id: 'suleyman_yildirim', name: 'Süleyman YILDIRIM', mevki: 'Forvet', fizik: 87, bitiricilik: 97, teknik: 91, oyunOkuma: 93, dayaniklilik: 86 },
    { id: 'ibrahim_erdogdu', name: 'İbrahim ERDOĞDU', mevki: 'Kaleci', fizik: 84, bitiricilik: 75, teknik: 75, oyunOkuma: 75, dayaniklilik: 100 },
    { id: 'berkin_tayyip_ceran', name: 'Berkin Tayyip CERAN', mevki: 'Defans', fizik: 70, bitiricilik: 75, teknik: 80, oyunOkuma: 78, dayaniklilik: 83 },
    { id: 'muratcan_solmaz', name: 'Muratcan SOLMAZ', mevki: 'Kaleci', fizik: 83, bitiricilik: 86, teknik: 86, oyunOkuma: 90, dayaniklilik: 94 },
    { id: 'orhan_sariaydin', name: 'Orhan SARIAYDIN', mevki: 'Orta Saha', fizik: 80, bitiricilik: 87, teknik: 85, oyunOkuma: 83, dayaniklilik: 81 },
    { id: 'ozan_necipoglu', name: 'Ozan NECİPOĞLU', mevki: 'Defans', fizik: 72, bitiricilik: 84, teknik: 93, oyunOkuma: 91, dayaniklilik: 90 },
    { id: 'ridvan_gumus', name: 'Rıdvan GÜMÜŞ', mevki: 'Forvet', fizik: 87, bitiricilik: 94, teknik: 92, oyunOkuma: 90, dayaniklilik: 90 },
    { id: 'fatih_atalay', name: 'Fatih ATALAY', mevki: 'Orta Saha', fizik: 78, bitiricilik: 83, teknik: 84, oyunOkuma: 82, dayaniklilik: 82 },
    { id: 'seyfeddin_bulbul', name: 'Seyfeddin BÜLBÜL', mevki: 'Orta Saha', fizik: 89, bitiricilik: 82, teknik: 79, oyunOkuma: 78, dayaniklilik: 84 },
    { id: 'talha_bulbul', name: 'Talha BÜLBÜL', mevki: 'Kaleci', fizik: 89, bitiricilik: 70, teknik: 70, oyunOkuma: 70, dayaniklilik: 100 },
    { id: 'tayyip_erdogan_yilmaz', name: 'Tayyip Erdoğan YILMAZ', mevki: 'Orta Saha', fizik: 82, bitiricilik: 86, teknik: 86, oyunOkuma: 86, dayaniklilik: 84 },
    { id: 'firatcan_solmaz', name: 'Fıratcan SOLMAZ', mevki: 'Defans', fizik: 81, bitiricilik: 82, teknik: 86, oyunOkuma: 85, dayaniklilik: 88 },
    { id: 'can_atilgan', name: 'Can ATILGAN', mevki: 'Defans', fizik: 95, bitiricilik: 93, teknik: 97, oyunOkuma: 94, dayaniklilik: 98 },
    { id: 'yakup_sunay', name: 'Yakup SUNAY', mevki: 'Orta Saha', fizik: 80, bitiricilik: 76, teknik: 80, oyunOkuma: 87, dayaniklilik: 87 },
    { id: 'eren_yilmaz', name: 'Eren YILMAZ', mevki: 'Orta Saha', fizik: 88, bitiricilik: 87, teknik: 84, oyunOkuma: 84, dayaniklilik: 80 },
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
];

// Siradaki Mac Kadrosu
const nextMatchLineup = {
    teamA: [
        'suleyman_yildirim',
        'ensar_bulbul',
        'fatih_atalay',
        'emre_erdal',
        'huseyincan_yuksekdag',
        'seyfeddin_bulbul',
        'yakup_sunay',
    ],
    teamB: [
        'mushap_karatas',
        'furkan_yilmaz',
        'talha_bulbul',
        'ibrahim_erdogdu',
        'eren_yilmaz',
        'omer_erdal',
        'orhan_sariaydin',
    ]
};
