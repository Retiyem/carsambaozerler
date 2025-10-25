// OYUNCU PROFİLİ JavaScript FUNKSİYONLARI

// Aktif oyuncu
let currentPlayerId = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initializePlayerProfile();
    setupMobileStabilization();
});

// Mobil stabilizasyon
function setupMobileStabilization() {
    // Zoom engelleme
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });
    
    // Double tap zoom engelleme
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        let now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Viewport meta tag kontrol
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
}

// Başlangıç fonksiyonu
function initializePlayerProfile() {
    // URL'den oyuncu ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    currentPlayerId = urlParams.get('id') || 'onur_mustafa'; // Default olarak onur_mustafa
    
    // Oyuncu verilerini yükle
    loadPlayerData();
}

// Oyuncu verilerini yükle
function loadPlayerData() {
    // data.js'den oyuncuyu bul
    const player = (typeof players !== 'undefined') ? players.find(p => p.id === currentPlayerId) : null;
    
    if (!player) {
        // Oyuncu bulunamadı
        const nameElement = document.getElementById('player-name');
        if (nameElement) nameElement.textContent = 'Oyuncu Bulunamadı';
        return;
    }
    
    // Enhanced data'dan ek bilgileri al (varsa)
    const enhancedPlayer = (typeof enhancedPlayers !== 'undefined') ? 
        enhancedPlayers.find(p => p.id === currentPlayerId) : null;
    
    // Temel bilgileri doldur
    populateBasicInfo({
        name: player.name,
        rating: enhancedPlayer ? enhancedPlayer.rating : Math.floor(Math.random() * 20) + 70,
        position: enhancedPlayer ? enhancedPlayer.position : getRandomPosition(),
        favNumber: enhancedPlayer ? enhancedPlayer.favNumber : Math.floor(Math.random() * 99) + 1,
        profileImage: `img/oyuncular/${player.id}.jpg`,
        socialMedia: enhancedPlayer ? enhancedPlayer.socialMedia : null
    });
    
    // Oyuncu istatistiklerini hesapla
    const stats = calculatePlayerStatsForProfile(player.name);
    
    // İstatistikleri doldur
    populateStats(stats);
}

// Temel oyuncu bilgilerini doldur
function populateBasicInfo(playerInfo) {
    // Oyuncu adı
    const nameElement = document.getElementById('player-name');
    if (nameElement) nameElement.textContent = playerInfo.name || 'Bilinmeyen Oyuncu';
    
    // Profil fotoğrafı
    const imageElement = document.getElementById('player-image');
    if (imageElement) {
        imageElement.src = playerInfo.profileImage || 'img/oyuncular/default.svg';
        imageElement.alt = `${playerInfo.name} Profil Fotoğrafı`;
        imageElement.onerror = () => {
            imageElement.src = 'img/oyuncular/default.svg';
        };
    }
    
    // Rating
    const ratingElement = document.getElementById('player-rating');
    if (ratingElement) ratingElement.textContent = playerInfo.rating || '0';
    
    // Mevki
    const positionElement = document.getElementById('player-position');
    if (positionElement) positionElement.textContent = playerInfo.position || 'Belirsiz';
    
    // Forma numarası
    const numberElement = document.getElementById('player-number');
    if (numberElement) numberElement.textContent = `#${playerInfo.favNumber || '?'}`;
}

// İstatistikleri doldur
function populateStats(stats) {
    // Toplam gol
    const totalGoalsElement = document.getElementById('total-goals');
    if (totalGoalsElement) totalGoalsElement.textContent = stats.goals || 0;
    
    // MVP sayısı
    const totalMvpsElement = document.getElementById('total-mvps');
    if (totalMvpsElement) totalMvpsElement.textContent = stats.mvps || 0;
    
    // Oynanan maç sayısı
    const totalMatchesElement = document.getElementById('total-matches');
    if (totalMatchesElement) totalMatchesElement.textContent = stats.matches || 0;
    
    // Kazanma oranı
    const winRateElement = document.getElementById('win-rate');
    if (winRateElement) winRateElement.textContent = `${stats.winRate || 0}%`;
    
    // Maç başına gol
    const goalsPerMatchElement = document.getElementById('goals-per-match');
    if (goalsPerMatchElement) goalsPerMatchElement.textContent = stats.goalsPerMatch || '0.00';
    
    // Detaylı istatistikler tablosu
    const tableMatchesElement = document.getElementById('table-matches');
    if (tableMatchesElement) tableMatchesElement.textContent = stats.matches || 0;
    
    const tableGoalsElement = document.getElementById('table-goals');
    if (tableGoalsElement) tableGoalsElement.textContent = stats.goals || 0;
    
    const tableMvpsElement = document.getElementById('table-mvps');
    if (tableMvpsElement) tableMvpsElement.textContent = stats.mvps || 0;
    
    const tableGoalsPerMatchElement = document.getElementById('table-goals-per-match');
    if (tableGoalsPerMatchElement) tableGoalsPerMatchElement.textContent = stats.goalsPerMatch || '0.00';
}

// Oyuncu profili için istatistik hesaplama
function calculatePlayerStatsForProfile(playerName) {
    // Eğer matches varsa ve dolu ise gerçek stats hesapla
    if (typeof matches !== 'undefined' && matches.length > 0) {
        let goals = 0;
        let assists = 0;
        let matchCount = 0;
        let wins = 0;
        let mvps = 0;

        // Oyuncunun ID'sini bul
        const player = players.find(p => p.name === playerName);
        const playerId = player ? player.id : null;

        matches.forEach(match => {
            const performance = match.performances.find(p => p.playerId === playerId);

            if (performance) {
                goals += performance.goals || 0;
                assists += performance.assists || 0;
                matchCount++;
                
                // MVP kontrolü - hem weeklyMVP hem de macin_adami parametrelerini kontrol et
                if (performance.weeklyMVP || match.macin_adami === playerId) {
                    mvps++;
                }

                // Kazanma durumunu kontrol et
                const isWinner = (performance.team === 'A' && match.teamAGoals > match.teamBGoals) ||
                                 (performance.team === 'B' && match.teamBGoals > match.teamAGoals);
                if (isWinner) wins++;
            }
        });

        return {
            goals: goals,
            assists: assists,
            matches: matchCount,
            wins: wins,
            mvps: mvps,
            winRate: matchCount > 0 ? Math.round((wins / matchCount) * 100) : 0,
            goalsPerMatch: matchCount > 0 ? (goals / matchCount).toFixed(2) : '0.00'
        };
    } else {
        // Henüz maç olmadığında örnek/demo veriler
        const goals = Math.floor(Math.random() * 8) + 1; // 1-8 gol
        const assists = Math.floor(Math.random() * 5); // 0-4 asist
        const matches = Math.floor(Math.random() * 6) + 1; // 1-6 maç
        const wins = Math.floor(matches * (Math.random() * 0.6 + 0.2)); // %20-80 kazanma
        const mvps = Math.floor(Math.random() * 3); // 0-2 MVP

        return {
            goals: goals,
            assists: assists,
            matches: matches,
            wins: wins,
            mvps: mvps,
            winRate: matches > 0 ? Math.round((wins / matches) * 100) : 0
        };
    }
}

// Rastgele pozisyon oluştur
function getRandomPosition() {
    const positions = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci'];
    return positions[Math.floor(Math.random() * positions.length)];
}