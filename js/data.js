// Oyuncular listesi
const players = [
    { id: 'onur', name: 'Onur Mustafa KÖSE' },
    { id: 'ensarb', name: 'Ensar BÜLBÜL' },
    { id: 'ahmets', name: 'Ahmet SADIKOĞLU' },
    { id: 'burakk', name: 'Burak KOCABEY' },
    { id: 'demo', name: 'Demo' },
    { id: 'emree', name: 'Emre ERDAL' },
    { id: 'enes', name: 'Enes Altan ARICI' },
    { id: 'omere', name: 'Ömer ERDAL' },
    { id: 'furkans', name: 'Furkan SEVİMLİ' },
    { id: 'furkany', name: 'Furkan YILMAZ' },
    { id: 'ibrahim', name: 'İbrahim ERDOĞDU' },
    { id: 'tayyipb', name: 'Tayyip Berkin CERAN' },
    { id: 'muhammetc', name: 'Muhammet ÇAKIR' },
    { id: 'muratcan', name: 'Muratcan SOLMAZ' },
    { id: 'orhan', name: 'Orhan SARIAYDIN' },
    { id: 'ozan', name: 'Ozan NECİPOĞLU' },
    { id: 'ridvan', name: 'Rıdvan GÜMÜŞ' },
    { id: 'seyfeddin', name: 'Seyfeddin BÜLBÜL' },
    { id: 'talha', name: 'Talha BÜLBÜL' },
    { id: 'tayyipe', name: 'Tayyip Erdoğan YILMAZ' },
    { id: 'firatcan', name: 'Fıratcan SOLMAZ' },
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
            { playerId: 'onur', team: 'A', goals: 0, assists: 0, mvp: false },
            { playerId: 'ensarb', team: 'A', goals: 0, assists: 0, mvp: false },
            { playerId: 'ahmets', team: 'A', goals: 0, assists: 0, mvp: false },
            { playerId: 'burakk', team: 'A', goals: 0, assists: 0, mvp: false },
            { playerId: 'emree', team: 'A', goals: 0, assists: 0, mvp: false },
            { playerId: 'enes', team: 'A', goals: 0, assists: 0, mvp: false },
            { playerId: 'omere', team: 'A', goals: 0, assists: 0, mvp: false },

            // B Takımı oyuncuları (7 kişi)
            { playerId: 'furkans', team: 'B', goals: 0, assists: 0, mvp: false },
            { playerId: 'furkany', team: 'B', goals: 0, assists: 0, mvp: false },
            { playerId: 'ibrahim', team: 'B', goals: 0, assists: 0, mvp: false },
            { playerId: 'tayyipb', team: 'B', goals: 0, assists: 0, mvp: false },
            { playerId: 'muhammetc', team: 'B', goals: 0, assists: 0, mvp: false },
            { playerId: 'muratcan', team: 'B', goals: 0, assists: 0, mvp: false },
            { playerId: 'orhan', team: 'B', goals: 0, assists: 0, mvp: false },
            // Maça katılmayan oyuncuları bu listeye eklemeyin.
            // Sadece o maçta oynayan 14 oyuncuyu ekleyin.
        ]
    },
    // Her yeni maç için bu objeyi kopyalayıp düzenleyin.
    // 'id' değerini bir artırmayı unutmayın!
    */
];