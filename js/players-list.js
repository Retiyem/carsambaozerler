// OYUNCU LİSTESİ YÖNETİMİ

// Oyuncu kartlarını oluştur ve göster
function displayPlayersList() {
    const playersContainer = document.getElementById('players-container');
    if (!playersContainer) return;

    // data.js'den oyuncuları al
    const allPlayers = getAllPlayersFromData();
    
    if (allPlayers.length === 0) {
        playersContainer.innerHTML = '<p class="no-players">Henüz oyuncu bulunamadı.</p>';
        return;
    }

    // Oyuncu kartlarını oluştur
    const playersHTML = allPlayers.map(player => {
        const playerStats = calculatePlayerStats(player.name);
        return createPlayerCard(player, playerStats);
    }).join('');

    playersContainer.innerHTML = playersHTML;
}

// Tüm oyuncuları data.js'den çıkar
function getAllPlayersFromData() {
    // data.js'deki players dizisini kullan
    if (typeof players !== 'undefined' && players.length > 0) {
        return players.map(player => {
            // Enhanced data'dan detayları al (varsa)
            const enhancedPlayer = (typeof enhancedPlayers !== 'undefined') ? 
                enhancedPlayers.find(p => p.id === player.id) : null;
            
            return {
                id: player.id,
                name: player.name,
                rating: enhancedPlayer ? enhancedPlayer.rating : Math.floor(Math.random() * 20) + 70, // 70-89 arası
                position: enhancedPlayer ? enhancedPlayer.position : getRandomPosition(),
                profileImage: `img/oyuncular/${player.id}.jpg`, // ID ile eşleşen fotoğraf
                bio: enhancedPlayer ? enhancedPlayer.bio : 'Halısaha Ligi oyuncusu'
            };
        });
    }
    
    // Fallback: Eğer players dizisi yoksa boş array döndür
    return [];
}

// Oyuncu istatistiklerini hesapla
function calculatePlayerStats(playerName) {
    // Eğer matches varsa ve dolu ise gerçek stats hesapla
    if (typeof matches !== 'undefined' && matches.length > 0) {
        let goals = 0;
        let assists = 0;
        let matchCount = 0;
        let wins = 0;

        matches.forEach(match => {
            const performance = match.performances.find(p => {
                const player = players.find(pl => pl.id === p.playerId);
                return player && player.name === playerName;
            });

            if (performance) {
                goals += performance.goals;
                assists += performance.assists;
                matchCount++;

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
            winRate: matchCount > 0 ? Math.round((wins / matchCount) * 100) : 0
        };
    } else {
        // Henüz maç olmadığında örnek/demo veriler
        return {
            goals: Math.floor(Math.random() * 5), // 0-4 arası rastgele gol
            assists: Math.floor(Math.random() * 3), // 0-2 arası rastgele asist
            matches: Math.floor(Math.random() * 3), // 0-2 arası rastgele maç
            winRate: Math.floor(Math.random() * 61) + 20 // 20-80 arası rastgele kazanma oranı
        };
    }
}

// Rastgele pozisyon ata
function getRandomPosition() {
    const positions = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci'];
    return positions[Math.floor(Math.random() * positions.length)];
}

// Oyuncu kartı oluştur
function createPlayerCard(player, stats) {
    return `
        <div class="player-card glassmorphism-card animate-fade-in" onclick="openPlayerProfile('${player.id}')">
            <div class="player-image">
                <img src="${player.profileImage}" alt="${player.name}" onerror="this.src='img/oyuncular/default.svg'">
            </div>
            <div class="player-info">
                <div class="player-rating">${player.rating}</div>
                <h3 class="player-name">${player.name}</h3>
                <p class="player-position">${player.position}</p>
                <div class="player-stats-mini">
                    <div class="stat-item">
                        <span class="stat-label">Goller</span>
                        <span class="stat-value">${stats.goals}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Maçlar</span>
                        <span class="stat-value">${stats.matches}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Kazanma %</span>
                        <span class="stat-value">${stats.winRate}%</span>
                    </div>
                </div>
            </div>
            <div class="player-card-action">
                <button class="view-profile-btn">Profili Gör</button>
            </div>
        </div>
    `;
}

// Oyuncu profiline git
function openPlayerProfile(playerId) {
    window.location.href = `oyuncu-profili.html?id=${playerId}`;
}

// Sayfa yüklendiğinde oyuncuları göster
document.addEventListener('DOMContentLoaded', function() {
    displayPlayersList();
});