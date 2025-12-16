// KADRO KUR - OTOMATİK TAKIM OLUŞTURMA SİSTEMİ
// Bu dosya oyuncuların performans skorlarını hesaplar ve adil takımlar oluşturur.

// Seçilen oyuncuları tutacak dizi
let selectedPlayers = [];

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    initializeKadroKur();
});

// Ana başlatma fonksiyonu
function initializeKadroKur() {
    // Oyuncu listesini oluştur
    renderPlayerList();
    
    // Event listener'ları ayarla
    setupEventListeners();
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Oyuncu arama
    const searchInput = document.getElementById('player-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterPlayers);
    }
    
    // Misafir oyuncu ekleme butonu
    const addGuestBtn = document.getElementById('add-guest-btn');
    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', toggleGuestInput);
    }
    
    // Misafir onaylama butonu
    const confirmGuestBtn = document.getElementById('confirm-guest-btn');
    if (confirmGuestBtn) {
        confirmGuestBtn.addEventListener('click', addGuestPlayer);
    }
    
    // Enter tuşu ile misafir ekleme
    const guestNameInput = document.getElementById('guest-name-input');
    if (guestNameInput) {
        guestNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addGuestPlayer();
            }
        });
    }
    
    // Takımları kur butonu
    const createTeamsBtn = document.getElementById('create-teams-btn');
    if (createTeamsBtn) {
        createTeamsBtn.addEventListener('click', createTeams);
    }
    
    // Temizle butonu
    const clearBtn = document.getElementById('clear-selection-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelection);
    }
    
    // Yeniden kadro kur butonu
    const regenerateBtn = document.getElementById('regenerate-btn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', regenerateTeams);
    }
}

// =====================================================
// OYUNCU PERFORMANS SKORU HESAPLAMA
// =====================================================

// Minimum maç sayısı eşiği (bu sayıya ulaşmayan oyuncular ceza alır)
const MIN_MATCHES_THRESHOLD = 5;

// Oyuncu performans skorunu hesapla
function calculatePlayerPower(playerId) {
    // data.js'den maç verilerini al
    if (!matches || matches.length === 0) {
        return 50; // Varsayılan skor
    }
    
    let totalMatches = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let totalGoals = 0;
    let mvpCount = 0;
    
    // Her maçı incele
    matches.forEach(match => {
        const performance = match.performances.find(p => p.playerId === playerId);
        if (performance) {
            totalMatches++;
            totalGoals += performance.goals || 0;
            
            // MVP kontrolü
            if (performance.weeklyMVP) {
                mvpCount++;
            }
            
            // Galibiyet/Beraberlik/Mağlubiyet kontrolü
            const playerTeam = performance.team;
            if (playerTeam === 'A') {
                if (match.teamAGoals > match.teamBGoals) wins++;
                else if (match.teamAGoals === match.teamBGoals) draws++;
                else losses++;
            } else {
                if (match.teamBGoals > match.teamAGoals) wins++;
                else if (match.teamBGoals === match.teamAGoals) draws++;
                else losses++;
            }
        }
    });
    
    // Maç oynamamış oyuncu için varsayılan skor
    if (totalMatches === 0) {
        return 50;
    }
    
    // === YENİ ADİL HESAPLAMA SİSTEMİ ===
    
    // 1. Galibiyet puanı (max 30 puan)
    // Galibiyet oranına göre: %100 galibiyet = 30 puan
    const winRate = wins / totalMatches;
    const winPoints = winRate * 30;
    
    // 2. Gol ortalaması puanı (max 25 puan)
    // Maç başı 2+ gol = tam puan
    const goalAverage = totalGoals / totalMatches;
    const goalPoints = Math.min(goalAverage * 12.5, 25);
    
    // 3. MVP bonusu (max 15 puan)
    // Her MVP = 5 puan, max 3 MVP sayılır
    const mvpPoints = Math.min(mvpCount * 5, 15);
    
    // 4. Tecrübe faktörü (max 20 puan)
    // Toplam oynanan maç sayısına göre
    const maxMatches = Math.max(...players.map(p => getPlayerMatchCount(p.id)));
    const experienceRatio = totalMatches / Math.max(maxMatches, 1);
    const experiencePoints = experienceRatio * 20;
    
    // 5. Az maç cezası
    // Minimum eşiğin altındaki oyuncular için skor düşürülür
    let matchPenalty = 1;
    if (totalMatches < MIN_MATCHES_THRESHOLD) {
        // Her eksik maç için %15 ceza
        const missingMatches = MIN_MATCHES_THRESHOLD - totalMatches;
        matchPenalty = Math.max(0.4, 1 - (missingMatches * 0.15));
    }
    
    // 6. Baz puan (herkes için 10)
    const basePoints = 10;
    
    // Toplam hesaplama
    let rawPower = basePoints + winPoints + goalPoints + mvpPoints + experiencePoints;
    
    // Az maç cezası uygula
    let power = Math.round(rawPower * matchPenalty);
    
    // Skor sınırları (30-100 arası)
    power = Math.max(30, Math.min(100, power));
    
    return power;
}

// Oyuncunun toplam maç sayısını getir
function getPlayerMatchCount(playerId) {
    if (!matches || matches.length === 0) return 0;
    
    return matches.filter(match => 
        match.performances.some(p => p.playerId === playerId)
    ).length;
}

// Tüm oyuncuların güç skorlarını hesapla
function calculateAllPlayerPowers() {
    const playerPowers = {};
    
    if (typeof players !== 'undefined') {
        players.forEach(player => {
            playerPowers[player.id] = calculatePlayerPower(player.id);
        });
    }
    
    return playerPowers;
}

// =====================================================
// OYUNCU LİSTESİ RENDER
// =====================================================

// Oyuncu listesini render et
function renderPlayerList() {
    const playerListContainer = document.getElementById('all-players-list');
    if (!playerListContainer) return;
    
    playerListContainer.innerHTML = '';
    
    // Güç skorlarını hesapla
    const playerPowers = calculateAllPlayerPowers();
    
    // Oyuncuları güç skoruna göre sırala
    const sortedPlayers = [...players].sort((a, b) => {
        return (playerPowers[b.id] || 50) - (playerPowers[a.id] || 50);
    });
    
    sortedPlayers.forEach(player => {
        const power = playerPowers[player.id] || 50;
        const isSelected = selectedPlayers.some(p => p.id === player.id);
        
        const playerItem = document.createElement('div');
        playerItem.className = `player-item ${isSelected ? 'selected' : ''}`;
        playerItem.dataset.playerId = player.id;
        playerItem.dataset.playerName = player.name.toLowerCase();
        
        // İsmin baş harflerini al
        const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        
        playerItem.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">${initials}</div>
                <div>
                    <div class="player-name">${player.name}</div>
                    <div class="player-position">${player.mevki || 'Belirsiz'}</div>
                </div>
            </div>
            <div class="player-power">${power}</div>
            <button class="btn-add-player" onclick="togglePlayerSelection('${player.id}')">
                ${isSelected ? 'Çıkar' : 'Ekle'}
            </button>
        `;
        
        playerListContainer.appendChild(playerItem);
    });
}

// Oyuncu seçimini toggle et
function togglePlayerSelection(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    const existingIndex = selectedPlayers.findIndex(p => p.id === playerId);
    
    if (existingIndex > -1) {
        // Oyuncuyu çıkar
        selectedPlayers.splice(existingIndex, 1);
    } else {
        // Oyuncuyu ekle
        const power = calculatePlayerPower(playerId);
        selectedPlayers.push({
            id: player.id,
            name: player.name,
            power: power,
            isGuest: false
        });
    }
    
    // Listeyi güncelle
    renderPlayerList();
    renderSelectedPlayers();
    updateCreateButton();
}

// Seçilen oyuncuları render et
function renderSelectedPlayers() {
    const selectedListContainer = document.getElementById('selected-players-list');
    const selectedCount = document.getElementById('selected-count');
    
    if (!selectedListContainer) return;
    
    if (selectedPlayers.length === 0) {
        selectedListContainer.innerHTML = '<p class="empty-message">Henüz oyuncu seçilmedi</p>';
        if (selectedCount) selectedCount.textContent = '(0)';
        return;
    }
    
    if (selectedCount) selectedCount.textContent = `(${selectedPlayers.length})`;
    
    selectedListContainer.innerHTML = '';
    
    selectedPlayers.forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'selected-player-item';
        
        playerItem.innerHTML = `
            <div class="player-info">
                <span class="player-name">
                    ${player.name}
                    ${player.isGuest ? '<span class="guest-badge">Misafir</span>' : ''}
                </span>
            </div>
            <span class="player-power">${player.power}</span>
            <button class="btn-remove-player" onclick="removeSelectedPlayer(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        selectedListContainer.appendChild(playerItem);
    });
}

// Seçilen oyuncuyu kaldır
function removeSelectedPlayer(index) {
    const removedPlayer = selectedPlayers[index];
    selectedPlayers.splice(index, 1);
    
    // Eğer normal oyuncuysa, listede seçimi kaldır
    if (!removedPlayer.isGuest) {
        renderPlayerList();
    }
    
    renderSelectedPlayers();
    updateCreateButton();
    
    // Takım sonuçlarını gizle
    hideTeamsResult();
}

// =====================================================
// MİSAFİR OYUNCU İŞLEMLERİ
// =====================================================

// Misafir input'unu toggle et
function toggleGuestInput() {
    const container = document.getElementById('guest-input-container');
    const input = document.getElementById('guest-name-input');
    
    if (container) {
        container.classList.toggle('hidden');
        if (!container.classList.contains('hidden') && input) {
            input.focus();
        }
    }
}

// Misafir oyuncu ekle
function addGuestPlayer() {
    const input = document.getElementById('guest-name-input');
    if (!input) return;
    
    const guestName = input.value.trim();
    if (!guestName) {
        alert('Lütfen misafir oyuncu adı girin!');
        return;
    }
    
    // Ortalama güç skoru hesapla (tüm oyuncuların ortalaması)
    const playerPowers = calculateAllPlayerPowers();
    const powerValues = Object.values(playerPowers);
    const averagePower = powerValues.length > 0 
        ? Math.round(powerValues.reduce((a, b) => a + b, 0) / powerValues.length)
        : 50;
    
    // Misafir oyuncuyu ekle
    const guestId = 'guest_' + Date.now();
    selectedPlayers.push({
        id: guestId,
        name: guestName,
        power: averagePower,
        isGuest: true
    });
    
    // Input'u temizle ve gizle
    input.value = '';
    document.getElementById('guest-input-container').classList.add('hidden');
    
    // Listeyi güncelle
    renderSelectedPlayers();
    updateCreateButton();
}

// =====================================================
// OYUNCU FİLTRELEME
// =====================================================

// Oyuncuları filtrele
function filterPlayers() {
    const searchInput = document.getElementById('player-search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const playerItems = document.querySelectorAll('.player-item');
    
    playerItems.forEach(item => {
        const playerName = item.dataset.playerName || '';
        if (playerName.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// =====================================================
// TAKIM OLUŞTURMA ALGORİTMASI
// =====================================================

// Takımları kur butonu durumunu güncelle
function updateCreateButton() {
    const createBtn = document.getElementById('create-teams-btn');
    if (createBtn) {
        // En az 4 oyuncu gerekli (her takımda en az 2)
        createBtn.disabled = selectedPlayers.length < 4;
    }
}

// Takımları oluştur
function createTeams() {
    if (selectedPlayers.length < 4) {
        alert('En az 4 oyuncu seçmelisiniz!');
        return;
    }
    
    // Oyuncuları güce göre sırala (yüksekten düşüğe)
    const sortedPlayers = [...selectedPlayers].sort((a, b) => b.power - a.power);
    
    // Takımları oluştur
    const teamA = [];
    const teamB = [];
    let teamAPower = 0;
    let teamBPower = 0;
    
    // Adil dağılım algoritması
    // İlk iki oyuncu: 1. A'ya, 2. B'ye
    // Sonraki oyuncular: Toplam gücü düşük olan takıma
    sortedPlayers.forEach((player, index) => {
        if (index === 0) {
            // En güçlü oyuncu A'ya
            teamA.push(player);
            teamAPower += player.power;
        } else if (index === 1) {
            // İkinci güçlü B'ye
            teamB.push(player);
            teamBPower += player.power;
        } else {
            // Geri kalanlar: Toplam gücü düşük olana
            if (teamAPower <= teamBPower) {
                teamA.push(player);
                teamAPower += player.power;
            } else {
                teamB.push(player);
                teamBPower += player.power;
            }
        }
    });
    
    // Sonuçları göster
    displayTeams(teamA, teamB, teamAPower, teamBPower);
}

// Yeniden kadro kur (alternatif dağılım)
function regenerateTeams() {
    if (selectedPlayers.length < 4) {
        alert('En az 4 oyuncu seçmelisiniz!');
        return;
    }
    
    // Oyuncuları güce göre sırala
    const sortedPlayers = [...selectedPlayers].sort((a, b) => b.power - a.power);
    
    const teamA = [];
    const teamB = [];
    let teamAPower = 0;
    let teamBPower = 0;
    
    // Alternatif algoritma: Rastgele başlangıç + denge
    // Her seferinde farklı sonuç için küçük bir rastgelelik ekle
    const startWithB = Math.random() > 0.5;
    
    sortedPlayers.forEach((player, index) => {
        if (index === 0) {
            if (startWithB) {
                teamB.push(player);
                teamBPower += player.power;
            } else {
                teamA.push(player);
                teamAPower += player.power;
            }
        } else if (index === 1) {
            if (startWithB) {
                teamA.push(player);
                teamAPower += player.power;
            } else {
                teamB.push(player);
                teamBPower += player.power;
            }
        } else {
            // Küçük rastgelelik faktörü
            const randomFactor = Math.random() * 5;
            
            if (teamAPower + randomFactor <= teamBPower + randomFactor) {
                teamA.push(player);
                teamAPower += player.power;
            } else {
                teamB.push(player);
                teamBPower += player.power;
            }
        }
    });
    
    // Sonuçları göster
    displayTeams(teamA, teamB, teamAPower, teamBPower);
}

// Takımları ekranda göster
function displayTeams(teamA, teamB, teamAPower, teamBPower) {
    const resultSection = document.getElementById('teams-result');
    if (resultSection) {
        resultSection.classList.remove('hidden');
    }
    
    // Takım A listesi
    const teamAList = document.getElementById('team-a-list');
    if (teamAList) {
        teamAList.innerHTML = '';
        teamA.forEach(player => {
            const li = document.createElement('li');
            const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2);
            li.innerHTML = `
                <div class="team-player-info">
                    <div class="team-player-avatar">${initials}</div>
                    <span class="team-player-name">
                        ${player.name}
                        ${player.isGuest ? '<span class="guest-badge">Misafir</span>' : ''}
                    </span>
                </div>
                <span class="team-player-power">${player.power}</span>
            `;
            teamAList.appendChild(li);
        });
    }
    
    // Takım B listesi
    const teamBList = document.getElementById('team-b-list');
    if (teamBList) {
        teamBList.innerHTML = '';
        teamB.forEach(player => {
            const li = document.createElement('li');
            const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2);
            li.innerHTML = `
                <div class="team-player-info">
                    <div class="team-player-avatar">${initials}</div>
                    <span class="team-player-name">
                        ${player.name}
                        ${player.isGuest ? '<span class="guest-badge">Misafir</span>' : ''}
                    </span>
                </div>
                <span class="team-player-power">${player.power}</span>
            `;
            teamBList.appendChild(li);
        });
    }
    
    // Güç değerlerini göster
    const teamAPowerEl = document.getElementById('team-a-power');
    const teamBPowerEl = document.getElementById('team-b-power');
    if (teamAPowerEl) teamAPowerEl.textContent = teamAPower;
    if (teamBPowerEl) teamBPowerEl.textContent = teamBPower;
    
    // Denge göstergesini güncelle
    updateBalanceIndicator(teamAPower, teamBPower);
    
    // Sonuca scroll et
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Denge göstergesini güncelle
function updateBalanceIndicator(teamAPower, teamBPower) {
    const totalPower = teamAPower + teamBPower;
    const teamAPercentage = (teamAPower / totalPower) * 100;
    
    const balanceBar = document.getElementById('balance-bar');
    const balanceText = document.getElementById('balance-text');
    
    if (balanceBar) {
        balanceBar.style.width = `${teamAPercentage}%`;
    }
    
    if (balanceText) {
        const difference = Math.abs(teamAPower - teamBPower);
        const diffPercentage = (difference / totalPower) * 100;
        
        balanceText.classList.remove('excellent', 'good', 'poor');
        
        if (diffPercentage < 3) {
            balanceText.textContent = '🎯 Mükemmel denge! Takımlar neredeyse eşit.';
            balanceText.classList.add('excellent');
        } else if (diffPercentage < 8) {
            balanceText.textContent = '✅ İyi denge. Takımlar oldukça dengeli.';
            balanceText.classList.add('good');
        } else {
            const strongerTeam = teamAPower > teamBPower ? 'Takım A' : 'Takım B';
            balanceText.textContent = `⚠️ ${strongerTeam} biraz daha güçlü. Fark: ${difference} puan`;
            balanceText.classList.add('poor');
        }
    }
}

// Takım sonuçlarını gizle
function hideTeamsResult() {
    const resultSection = document.getElementById('teams-result');
    if (resultSection) {
        resultSection.classList.add('hidden');
    }
}

// Seçimi temizle
function clearSelection() {
    selectedPlayers = [];
    renderPlayerList();
    renderSelectedPlayers();
    updateCreateButton();
    hideTeamsResult();
}
