// OYUNCU LİSTESİ YÖNETİMİ

// Global değişkenler
let allPlayersData = [];
let filteredPlayers = [];

// Oyuncu kartlarını oluştur ve göster
function displayPlayersList(playersToShow = null) {
    const playersContainer = document.getElementById('players-container');
    if (!playersContainer) return;

    // data.js'den oyuncuları al (ilk çağrıda)
    if (!allPlayersData.length) {
        allPlayersData = getAllPlayersFromData();
    }
    
    // Gösterilecek oyuncuları belirle
    const playersToDisplay = playersToShow || allPlayersData;
    
    if (playersToDisplay.length === 0) {
        playersContainer.innerHTML = '<p class="no-players">Oyuncu bulunamadı.</p>';
        updateSearchResults(0);
        return;
    }

    // Oyuncu kartlarını oluştur
    const playersHTML = playersToDisplay.map(player => {
        const playerStats = calculatePlayerStats(player.name);
        return createPlayerCard(player, playerStats);
    }).join('');

    playersContainer.innerHTML = playersHTML;
    updateSearchResults(playersToDisplay.length);
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
                mevki: player.mevki || 'Belirsiz', // Mevki bilgisini ekle
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

// Oyuncu kartı oluştur
function createPlayerCard(player, stats) {
    return `
        <div class="player-card glassmorphism-card animate-fade-in" onclick="openPlayerProfile('${player.id}')">
            <div class="player-image">
                <img src="${player.profileImage}" alt="${player.name}" onerror="this.src='img/oyuncular/default.svg'">
            </div>
            <div class="player-info">
                <h3 class="player-name">${player.name}</h3>
                <p class="player-position">${player.mevki}</p>
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

// Arama fonksiyonu
function filterPlayers() {
    const searchTerm = document.getElementById('player-search').value.toLowerCase().trim();
    const positionFilter = document.getElementById('position-filter').value;

    filteredPlayers = allPlayersData.filter(player => {
        // İsim araması
        const nameMatch = player.name.toLowerCase().includes(searchTerm);
        
        // Mevki araması
        const positionMatch = player.mevki.toLowerCase().includes(searchTerm);
        
        // Genel arama (isim veya mevki)
        const textMatch = nameMatch || positionMatch;
        
        // Mevki filtresi
        const positionFilterMatch = !positionFilter || player.mevki === positionFilter;
        
        return textMatch && positionFilterMatch;
    });

    displayPlayersList(filteredPlayers);
}

// Arama sonuçları sayısını güncelle
function updateSearchResults(count) {
    const resultsInfo = document.getElementById('search-results-count');
    if (resultsInfo) {
        const totalPlayers = allPlayersData.length;
        resultsInfo.textContent = `Gösterilen: ${count} / ${totalPlayers} oyuncu`;
    }
}

// Aramayi temizle
function clearSearch() {
    document.getElementById('player-search').value = '';
    document.getElementById('position-filter').value = '';
    displayPlayersList(allPlayersData);
}

// Event listener'ları kur
function setupSearchListeners() {
    const searchInput = document.getElementById('player-search');
    const positionFilter = document.getElementById('position-filter');
    const clearButton = document.getElementById('clear-search');

    if (searchInput) {
        // Gerçek zamanlı arama
        searchInput.addEventListener('input', filterPlayers);
        
        // Enter tuşu desteği
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterPlayers();
            }
        });
    }

    if (positionFilter) {
        positionFilter.addEventListener('change', filterPlayers);
    }

    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }
}

// Sayfa yüklendiğinde oyuncuları göster
document.addEventListener('DOMContentLoaded', function() {
    displayPlayersList();
    setupSearchListeners();
});