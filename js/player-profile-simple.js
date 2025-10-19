// OYUNCU PROFİLİ JavaScript FUNKSİYONLARI

// Aktif oyuncu
let currentPlayerId = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initializePlayerProfile();
});

// Başlangıç fonksiyonu
function initializePlayerProfile() {
    // URL'den oyuncu ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    currentPlayerId = urlParams.get('id') || 'onur'; // Default olarak onur
    
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
        bio: enhancedPlayer ? enhancedPlayer.bio : 'Halısaha ligi oyuncusu.',
        profileImage: enhancedPlayer ? enhancedPlayer.profileImage : 'img/oyuncular/default.jpg',
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
        imageElement.src = playerInfo.profileImage || 'img/oyuncular/default.jpg';
        imageElement.alt = `${playerInfo.name} Profil Fotoğrafı`;
        imageElement.onerror = () => {
            imageElement.src = 'img/oyuncular/default.jpg';
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
    
    // Biyografi
    const bioElement = document.getElementById('player-bio');
    if (bioElement) bioElement.textContent = playerInfo.bio || 'Henüz biyografi eklenmemiş.';
}

// İstatistikleri doldur
function populateStats(stats) {
    // Toplam gol
    const totalGoalsElement = document.getElementById('total-goals');
    if (totalGoalsElement) totalGoalsElement.textContent = stats.goals || 0;
    
    // Toplam asist
    const totalAssistsElement = document.getElementById('total-assists');
    if (totalAssistsElement) totalAssistsElement.textContent = stats.assists || 0;
    
    // MVP sayısı
    const totalMvpsElement = document.getElementById('total-mvps');
    if (totalMvpsElement) totalMvpsElement.textContent = stats.mvps || 0;
    
    // Oynanan maç sayısı
    const totalMatchesElement = document.getElementById('total-matches');
    if (totalMatchesElement) totalMatchesElement.textContent = stats.matches || 0;
    
    // Kazanma oranı
    const winRateElement = document.getElementById('win-rate');
    if (winRateElement) winRateElement.textContent = `${stats.winRate || 0}%`;
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

        matches.forEach(match => {
            const performance = match.performances.find(p => {
                const player = players.find(pl => pl.id === p.playerId);
                return player && player.name === playerName;
            });

            if (performance) {
                goals += performance.goals;
                assists += performance.assists;
                matchCount++;
                if (performance.mvp) mvps++;

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
            winRate: matchCount > 0 ? Math.round((wins / matchCount) * 100) : 0
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