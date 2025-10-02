// js/data.js

// Oyuncular listesi
const players = [
    {
        id: 'onur',
        name: 'Onur Mustafa KÖSE',
        photo: 'img/players/onur.jpg', // Örnek fotoğraf yolu
        details: {
            position: 'Orta Saha',
            birthDate: '1995-03-10',
            bio: 'Takımın beyni, pas yeteneği ve oyun görüşüyle öne çıkıyor. Liderlik vasıflarıyla takımını ileri taşır.',
            jerseyNumber: 10, // Örnek: Forma numarası
            favoriteFoot: 'Sağ' // Örnek: Favori ayak
        }
    },
    {
        id: 'ensarb',
        name: 'Ensar BÜLBÜL',
        photo: 'img/players/ensarb.jpg',
        details: {
            position: 'Defans',
            birthDate: '1996-05-20',
            bio: 'Savunmanın bel kemiği, güçlü fiziği ve zamanlamasıyla rakip forvetlere geçit vermez.',
            jerseyNumber: 4,
            favoriteFoot: 'Sağ'
        }
    },
    {
        id: 'ahmets',
        name: 'Ahmet SADIKOĞLU',
        photo: 'img/players/ahmets.jpg',
        details: {
            position: 'Forvet',
            birthDate: '1994-11-15',
            bio: 'Gol yollarının etkili ismi, hızı ve bitiriciliği ile takımına goller kazandırır.',
            jerseyNumber: 9,
            favoriteFoot: 'Sol'
        }
    },
    { id: 'burakk', name: 'Burak KOCABEY', photo: 'img/players/burakk.jpg', details: { position: 'Orta Saha', birthDate: '1997-01-22', bio: 'Dinamik orta saha oyuncusu, hem hücumda hem savunmada etkili.', jerseyNumber: 8, favoriteFoot: 'Sağ' } },
    { id: 'demo', name: 'Demo Oyuncu', photo: 'img/players/demo.jpg', details: { position: 'Kaleci', birthDate: '1990-07-01', bio: 'Güvenilir eldiven, kritik kurtarışlarıyla takımına puanlar kazandırır.', jerseyNumber: 1, favoriteFoot: 'Sağ' } },
    { id: 'emree', name: 'Emre ERDAL', photo: 'img/players/emree.jpg', details: { position: 'Defans', birthDate: '1993-09-05', bio: 'Sağlam defans, hava toplarında etkili ve topu oyuna iyi sokar.', jerseyNumber: 2, favoriteFoot: 'Sağ' } },
    { id: 'enes', name: 'Enes Altan ARICI', photo: 'img/players/enes.jpg', details: { position: 'Orta Saha', birthDate: '1998-04-12', bio: 'Teknik kapasitesi yüksek, pas oyununda ustalaşmış bir oyuncu.', jerseyNumber: 6, favoriteFoot: 'Sağ' } },
    { id: 'omere', name: 'Ömer ERDAL', photo: 'img/players/omere.jpg', details: { position: 'Forvet', birthDate: '1995-08-18', bio: 'Hızlı ve çevik forvet, boş alanları iyi değerlendirir.', jerseyNumber: 11, favoriteFoot: 'Sol' } },
    { id: 'furkans', name: 'Furkan SEVİMLİ', photo: 'img/players/furkans.jpg', details: { position: 'Defans', birthDate: '1996-10-03', bio: 'Güçlü ve mücadeleci defans oyuncusu, ikili mücadelelerde başarılı.', jerseyNumber: 5, favoriteFoot: 'Sağ' } },
    { id: 'furkany', name: 'Furkan YILMAZ', photo: 'img/players/furkany.jpg', details: { position: 'Orta Saha', birthDate: '1997-02-28', bio: 'Oyun kurucu, vizyonu ve uzun paslarıyla dikkat çekiyor.', jerseyNumber: 7, favoriteFoot: 'Sağ' } },
    { id: 'ibrahim', name: 'İbrahim ERDOĞDU', photo: 'img/players/ibrahim.jpg', details: { position: 'Forvet', birthDate: '1994-06-07', bio: 'Golcü kimliğiyle öne çıkan, fırsatları iyi değerlendiren bir forvet.', jerseyNumber: 13, favoriteFoot: 'Sağ' } },
    { id: 'tayyipb', name: 'Tayyip Berkin CERAN', photo: 'img/players/tayyipb.jpg', details: { position: 'Defans', birthDate: '1998-03-01', bio: 'Genç ve dinamik defans oyuncusu, geleceği parlak.', jerseyNumber: 3, favoriteFoot: 'Sağ' } },
    { id: 'muhammetc', name: 'Muhammet ÇAKIR', photo: 'img/players/muhammetc.jpg', details: { position: 'Orta Saha', birthDate: '1995-12-19', bio: 'Enerjik orta saha, top kapma ve pres gücü yüksek.', jerseyNumber: 14, favoriteFoot: 'Sağ' } },
    { id: 'muratcan', name: 'Muratcan SOLMAZ', photo: 'img/players/muratcan.jpg', details: { position: 'Forvet', birthDate: '1996-01-09', bio: 'Çabuk ve teknik forvet, dribbling yeteneğiyle öne çıkıyor.', jerseyNumber: 15, favoriteFoot: 'Sol' } },
    { id: 'orhan', name: 'Orhan SARIAYDIN', photo: 'img/players/orhan.jpg', details: { position: 'Defans', birthDate: '1993-07-25', bio: 'Deneyimli defans, pozisyon bilgisi ve liderliğiyle takıma katkı sağlar.', jerseyNumber: 16, favoriteFoot: 'Sağ' } },
    { id: 'ozan', name: 'Ozan NECİPOĞLU', photo: 'img/players/ozan.jpg', details: { position: 'Orta Saha', birthDate: '1997-04-04', bio: 'Çift yönlü orta saha, hem pas hem şut yeteneği var.', jerseyNumber: 17, favoriteFoot: 'Sağ' } },
    { id: 'ridvan', name: 'Rıdvan GÜMÜŞ', photo: 'img/players/ridvan.jpg', details: { position: 'Forvet', birthDate: '1995-09-11', bio: 'Güçlü forvet, kafa toplarında etkili ve ceza sahası içinde tehlikeli.', jerseyNumber: 18, favoriteFoot: 'Sağ' } },
    { id: 'seyfeddin', name: 'Seyfeddin BÜLBÜL', photo: 'img/players/seyfeddin.jpg', details: { position: 'Defans', birthDate: '1996-06-30', bio: 'Hızlı defans, kanatlardan bindirmeleriyle hücuma destek verir.', jerseyNumber: 19, favoriteFoot: 'Sağ' } },
    { id: 'talha', name: 'Talha BÜLBÜL', photo: 'img/players/talha.jpg', details: { position: 'Orta Saha', birthDate: '1998-08-08', bio: 'Genç yetenek, top sürme ve dripling yeteneğiyle rakip savunmayı zorlar.', jerseyNumber: 20, favoriteFoot: 'Sol' } },
    { id: 'tayyipe', name: 'Tayyip Erdoğan YILMAZ', photo: 'img/players/tayyipe.jpg', details: { position: 'Kaleci', birthDate: '1994-11-23', bio: 'Refleksleri güçlü kaleci, kalesinde devleşir.', jerseyNumber: 21, favoriteFoot: 'Sağ' } },
    { id: 'firatcan', name: 'Fıratcan SOLMAZ', photo: 'img/players/firatcan.jpg', details: { position: 'Forvet', birthDate: '1997-05-14', bio: 'Bitiriciliği yüksek forvet, gol vuruşlarında etkili.', jerseyNumber: 22, favoriteFoot: 'Sağ' } },
];

// Maçlar ve oyuncu performansları
// Her obje bir maçı temsil eder. İçindeki 'performances' dizisi o maçtaki her oyuncunun performansını tutar.
const matches = [
    {
        id: 1,
        date: '01.10.2025', // Maç tarihi
        teamA: ['onur', 'ensarb', 'ahmets', 'burakk', 'emree', 'enes', 'omere'], // Takım A oyuncu ID'leri
        teamB: ['furkans', 'furkany', 'ibrahim', 'tayyipb', 'muhammetc', 'muratcan', 'orhan'], // Takım B oyuncu ID'leri
        teamAGoals: 3, // A Takımının attığı gol
        teamBGoals: 2, // B Takımının attığı gol
        performances: [
            // A Takımı oyuncuları
            { playerId: 'onur', team: 'A', goals: 1, assists: 1, mvpPoints: 9, forwardPoints: 7, defensePoints: 5, goalQualityPoints: 8, saveQualityPoints: 0, worstPerformancePoints: 1 },
            { playerId: 'ensarb', team: 'A', goals: 0, assists: 0, mvpPoints: 7, forwardPoints: 0, defensePoints: 8, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 2 },
            { playerId: 'ahmets', team: 'A', goals: 2, assists: 0, mvpPoints: 8, forwardPoints: 9, defensePoints: 1, goalQualityPoints: 7, saveQualityPoints: 0, worstPerformancePoints: 1 },
            { playerId: 'burakk', team: 'A', goals: 0, assists: 1, mvpPoints: 7, forwardPoints: 3, defensePoints: 6, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 2 },
            { playerId: 'emree', team: 'A', goals: 0, assists: 0, mvpPoints: 6, forwardPoints: 0, defensePoints: 7, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'enes', team: 'A', goals: 0, assists: 1, mvpPoints: 7, forwardPoints: 4, defensePoints: 5, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 2 },
            { playerId: 'omere', team: 'A', goals: 0, assists: 0, mvpPoints: 6, forwardPoints: 5, defensePoints: 3, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 4 },

            // B Takımı oyuncuları
            { playerId: 'furkans', team: 'B', goals: 0, assists: 0, mvpPoints: 5, forwardPoints: 0, defensePoints: 6, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 5 },
            { playerId: 'furkany', team: 'B', goals: 1, assists: 0, mvpPoints: 7, forwardPoints: 6, defensePoints: 4, goalQualityPoints: 6, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'ibrahim', team: 'B', goals: 1, assists: 0, mvpPoints: 6, forwardPoints: 7, defensePoints: 2, goalQualityPoints: 5, saveQualityPoints: 0, worstPerformancePoints: 4 },
            { playerId: 'tayyipb', team: 'B', goals: 0, assists: 0, mvpPoints: 5, forwardPoints: 0, defensePoints: 7, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 5 },
            { playerId: 'muhammetc', team: 'B', goals: 0, assists: 1, mvpPoints: 6, forwardPoints: 3, defensePoints: 5, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 4 },
            { playerId: 'muratcan', team: 'B', goals: 0, assists: 0, mvpPoints: 5, forwardPoints: 4, defensePoints: 3, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 6 },
            { playerId: 'orhan', team: 'B', goals: 0, assists: 0, mvpPoints: 4, forwardPoints: 0, defensePoints: 6, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 7 },
        ]
    },
    {
        id: 2,
        date: '08.10.2025',
        teamA: ['onur', 'ensarb', 'ahmets', 'burakk', 'emree', 'enes', 'omer'],
        teamB: ['furkans', 'furkany', 'ibrahim', 'tayyipb', 'muhammetc', 'muratcan', 'ozan'],
        teamAGoals: 4,
        teamBGoals: 4,
        performances: [
            { playerId: 'onur', team: 'A', goals: 2, assists: 0, mvpPoints: 8, forwardPoints: 8, defensePoints: 4, goalQualityPoints: 7, saveQualityPoints: 0, worstPerformancePoints: 2 },
            { playerId: 'ensarb', team: 'A', goals: 0, assists: 0, mvpPoints: 6, forwardPoints: 0, defensePoints: 7, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'ahmets', team: 'A', goals: 1, assists: 1, mvpPoints: 7, forwardPoints: 7, defensePoints: 2, goalQualityPoints: 6, saveQualityPoints: 0, worstPerformancePoints: 2 },
            { playerId: 'burakk', team: 'A', goals: 1, assists: 0, mvpPoints: 7, forwardPoints: 6, defensePoints: 5, goalQualityPoints: 5, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'emree', team: 'A', goals: 0, assists: 0, mvpPoints: 6, forwardPoints: 0, defensePoints: 7, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 4 },
            { playerId: 'enes', team: 'A', goals: 0, assists: 1, mvpPoints: 6, forwardPoints: 3, defensePoints: 5, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'omer', team: 'A', goals: 0, assists: 1, mvpPoints: 5, forwardPoints: 4, defensePoints: 3, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 5 },

            { playerId: 'furkans', team: 'B', goals: 0, assists: 0, mvpPoints: 6, forwardPoints: 0, defensePoints: 7, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 4 },
            { playerId: 'furkany', team: 'B', goals: 2, assists: 0, mvpPoints: 8, forwardPoints: 8, defensePoints: 3, goalQualityPoints: 8, saveQualityPoints: 0, worstPerformancePoints: 2 },
            { playerId: 'ibrahim', team: 'B', goals: 1, assists: 1, mvpPoints: 7, forwardPoints: 7, defensePoints: 2, goalQualityPoints: 6, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'tayyipb', team: 'B', goals: 0, assists: 0, mvpPoints: 5, forwardPoints: 0, defensePoints: 6, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 5 },
            { playerId: 'muhammetc', team: 'B', goals: 1, assists: 0, mvpPoints: 7, forwardPoints: 6, defensePoints: 4, goalQualityPoints: 5, saveQualityPoints: 0, worstPerformancePoints: 3 },
            { playerId: 'muratcan', team: 'B', goals: 0, assists: 1, mvpPoints: 6, forwardPoints: 4, defensePoints: 3, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 4 },
            { playerId: 'ozan', team: 'B', goals: 0, assists: 0, mvpPoints: 5, forwardPoints: 3, defensePoints: 4, goalQualityPoints: 0, saveQualityPoints: 0, worstPerformancePoints: 6 },
        ]
    }
    // Her yeni maç için bu objeyi kopyalayıp düzenleyin.
    // 'id' değerini bir artırmayı unutmayın!
    // 'teamA' ve 'teamB' dizilerini o maçta oynayan oyuncuların ID'leri ile doldurun.
    // 'performances' dizisindeki her oyuncu için tüm puanları (0-10 arası) girin. Kaleciler için saveQualityPoints geçerli olur.
    // worstPerformancePoints için yüksek puan kötü performans anlamına gelir.
];
