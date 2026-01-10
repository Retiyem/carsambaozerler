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
    
    // Oyuncunun mevkisini bul
    const player = players.find(p => p.id === playerId);
    const position = player ? player.mevki : 'Orta Saha';
    
    let totalMatches = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let totalGoals = 0;
    let mvpCount = 0;
    let donkeyCount = 0;
    let totalGoalsConceded = 0; // Takımın yediği goller
    let totalTeamGoals = 0; // Takımın attığı goller
    let totalMatchGoals = 0; // Maçtaki toplam gol (normalleştirme için)
    
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
            
            // Eşşek kontrolü
            if (match.esek_adam === playerId) {
                donkeyCount++;
            }
            
            // Takım gol istatistikleri
            const playerTeam = performance.team;
            const teamGoalsFor = playerTeam === 'A' ? match.teamAGoals : match.teamBGoals;
            const teamGoalsAgainst = playerTeam === 'A' ? match.teamBGoals : match.teamAGoals;
            
            totalTeamGoals += teamGoalsFor;
            totalGoalsConceded += teamGoalsAgainst;
            totalMatchGoals += match.teamAGoals + match.teamBGoals;
            
            // Galibiyet/Beraberlik/Mağlubiyet kontrolü
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
    
    // === MEVKİ BAZLI HESAPLAMA SİSTEMİ ===
    
    // 1. Galibiyet puanı (max ~35 puan)
    const winRate = wins / totalMatches;
    const winPoints = winRate * 35;
    
    // 2. Kişisel gol puanı (mevkiye göre değişir)
    const goalAverage = totalGoals / totalMatches;
    let goalPoints = 0;
    
    // 3. Mevkiye özel puan hesaplama
    let positionBonus = 0;
    
    // Maç başı ortalama yenilen gol (normalleştirilmiş)
    const avgConceded = totalGoalsConceded / totalMatches;
    const avgTeamGoals = totalTeamGoals / totalMatches;
    const avgMatchGoals = totalMatchGoals / totalMatches;
    
    // Normalleştirme faktörü (yüksek skorlu maçları dengeler)
    // Ortalama maç 20 gol olsun varsayımı
    const normalizationFactor = 20 / Math.max(avgMatchGoals, 10);
    
    if (position === 'Kaleci') {
        // KALECİ: Gol atma önemsiz, yenilen gol çok önemli
        goalPoints = 0; // Kaleciler için kişisel gol puanı yok
        
        // Yenilen gol performansı (az yemek = yüksek puan)
        // Normalleştirilmiş: 12 gol/maç yemek = 0 puan, 2 gol = 18 puan
        const concededNormalized = avgConceded * normalizationFactor;
        const saveBonus = Math.max(0, 18 - (concededNormalized * 1.8));
        positionBonus = saveBonus;
        
    } else if (position === 'Defans') {
        // DEFANS: Gol atma az önemli, yenilen gol biraz önemli
        goalPoints = goalAverage * 2.5; // Defans gol atması zor (×2.5)
        
        // Yenilen gol performansı (max +8)
        const concededNormalized = avgConceded * normalizationFactor;
        const defenseBonus = Math.max(0, 8 - (concededNormalized * 0.8));
        positionBonus = defenseBonus;
        
    } else if (position === 'Orta Saha') {
        // ORTA SAHA: Dengeli - hem gol hem gol farkı
        goalPoints = goalAverage * 2; // Orta düzey gol katkısı (×2)
        
        // Gol farkı performansı (çok az etkili)
        const goalDiffPerMatch = (totalTeamGoals - totalGoalsConceded) / totalMatches;
        const goalDiffNormalized = goalDiffPerMatch * normalizationFactor;
        const midfieldBonus = Math.min(8, Math.max(-4, goalDiffNormalized * 1.5));
        positionBonus = midfieldBonus;
        
    } else if (position === 'Forvet') {
        // FORVET: Kişisel gol çok önemli, takım golü az bonus
        goalPoints = goalAverage * 1.75; // Forvet gol atması kolay (×1.75)
        
        // Takımın attığı gol bonusu (çok az etkili)
        const teamGoalNormalized = avgTeamGoals * normalizationFactor;
        const forwardBonus = Math.min(5, teamGoalNormalized * 0.3);
        positionBonus = forwardBonus;
        
    } else {
        // Diğer mevkiler için standart hesaplama
        goalPoints = goalAverage * 2;
    }
    
    // 4. MVP bonusu (max ~12 puan)
    const mvpPoints = Math.min(mvpCount * 4, 12);
    
    // 5. Eşşek cezası (her eşşek için -2 puan)
    const donkeyPenalty = donkeyCount * 2;
    
    // 6. Tecrübe faktörü (max ~30 puan) + Kazanma yüzdesi bonusu
    const maxMatches = Math.max(...players.map(p => getPlayerMatchCount(p.id)));
    const experienceRatio = totalMatches / Math.max(maxMatches, 1);
    let experiencePoints = experienceRatio * 30;
    
    // 5+ maç oynayanlara kazanma yüzdesi bonusu (max +10 puan)
    if (totalMatches >= MIN_MATCHES_THRESHOLD) {
        const winRateBonus = winRate * 10;
        experiencePoints += winRateBonus;
    }
    
    // 7. Az maç cezası
    let matchPenalty = 1;
    if (totalMatches < MIN_MATCHES_THRESHOLD) {
        const missingMatches = MIN_MATCHES_THRESHOLD - totalMatches;
        matchPenalty = Math.max(0.4, 1 - (missingMatches * 0.15));
    }
    
    // 8. Baz puan (herkes için 30)
    const basePoints = 30;
    
    // Toplam hesaplama
    let rawPower = basePoints + winPoints + goalPoints + positionBonus + mvpPoints + experiencePoints - donkeyPenalty;
    
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
        
        // Seçili oyuncuları listeden gizle
        if (isSelected) return;
        
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
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
                Ekle
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
        // Oyuncuyu ekle - data.js'den base stats'ı kullan
        const basePower = Math.round((player.fizik + player.bitiricilik + player.teknik + player.oyunOkuma + player.dayaniklilik) / 5);
        selectedPlayers.push({
            id: player.id,
            name: player.name,
            mevki: player.mevki || 'Orta Saha',
            power: basePower,
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
                <span class="player-position-small">${player.mevki || 'Orta Saha'}</span>
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

// Takımları oluştur - Pozisyon ve Güç Dengeli
function createTeams() {
    if (selectedPlayers.length < 4) {
        alert('En az 4 oyuncu seçmelisiniz!');
        return;
    }
    
    // Oyuncuları pozisyonlara göre grupla
    const positions = {
        'Kaleci': [],
        'Defans': [],
        'Orta Saha': [],
        'Forvet': []
    };
    
    selectedPlayers.forEach(player => {
        const pos = player.mevki || 'Orta Saha';
        if (positions[pos]) {
            positions[pos].push(player);
        } else {
            positions['Orta Saha'].push(player); // Bilinmeyen pozisyonlar orta sahaya
        }
    });
    
    // Her pozisyondaki oyuncuları güce göre sırala
    Object.keys(positions).forEach(pos => {
        positions[pos].sort((a, b) => b.power - a.power);
    });
    
    // Takımları oluştur
    const teamA = [];
    const teamB = [];
    let teamAPower = 0;
    let teamBPower = 0;
    
    // Pozisyon dengeli dağıtım
    // Her pozisyondan sırayla: 1. oyuncu A'ya, 2. oyuncu B'ye, 3. oyuncu gücü düşük olana...
    Object.keys(positions).forEach(position => {
        const posPlayers = positions[position];
        
        posPlayers.forEach((player, index) => {
            if (index === 0) {
                // İlk oyuncu A'ya
                teamA.push(player);
                teamAPower += player.power;
            } else if (index === 1) {
                // İkinci oyuncu B'ye
                teamB.push(player);
                teamBPower += player.power;
            } else {
                // Sonrakiler gücü düşük olan takıma
                if (teamAPower <= teamBPower) {
                    teamA.push(player);
                    teamAPower += player.power;
                } else {
                    teamB.push(player);
                    teamBPower += player.power;
                }
            }
        });
    });
    
    // Sonuçları göster
    displayTeams(teamA, teamB, teamAPower, teamBPower);
}

// Yeniden kadro kur (pozisyon dengeli rastgele dağılım)
function regenerateTeams() {
    if (selectedPlayers.length < 4) {
        alert('En az 4 oyuncu seçmelisiniz!');
        return;
    }
    
    // Oyuncuları pozisyonlara göre grupla
    const positions = {
        'Kaleci': [],
        'Defans': [],
        'Orta Saha': [],
        'Forvet': []
    };
    
    selectedPlayers.forEach(player => {
        const pos = player.mevki || 'Orta Saha';
        if (positions[pos]) {
            positions[pos].push(player);
        } else {
            positions['Orta Saha'].push(player);
        }
    });
    
    // Her pozisyondaki oyuncuları karıştır
    Object.keys(positions).forEach(pos => {
        const posPlayers = positions[pos];
        // Fisher-Yates shuffle
        for (let i = posPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [posPlayers[i], posPlayers[j]] = [posPlayers[j], posPlayers[i]];
        }
        // Güce göre sırala
        posPlayers.sort((a, b) => b.power - a.power);
    });
    
    // Takımları oluştur
    const teamA = [];
    const teamB = [];
    let teamAPower = 0;
    let teamBPower = 0;
    
    // Rastgele başlangıç
    const startWithB = Math.random() > 0.5;
    
    // Her pozisyondan dengeli dağıt
    Object.keys(positions).forEach(position => {
        const posPlayers = positions[position];
        
        posPlayers.forEach((player, index) => {
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
                // Geri kalanlar gücü düşük olan takıma
                if (teamAPower <= teamBPower) {
                    teamA.push(player);
                    teamAPower += player.power;
                } else {
                    teamB.push(player);
                    teamBPower += player.power;
                }
            }
        });
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
    
    // Skor tahminini göster
    displayKadroScorePrediction(teamA, teamB, teamAPower, teamBPower);
    
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

// =====================================================
// SKOR TAHMİNİ FONKSİYONLARI
// =====================================================

/**
 * Kadro Kur için skor tahmini - Ana sayfadaki mantıkla aynı
 */
function displayKadroScorePrediction(teamA, teamB, teamAPower, teamBPower) {
    const container = document.getElementById('kadro-score-prediction');
    if (!container) return;
    
    // Toplam maç sayısını hesapla (hem eski sezon hem yeni sezon)
    const totalMatchData = (typeof previousSeasonMatches !== 'undefined' ? previousSeasonMatches.length : 0) + 
                          (typeof matches !== 'undefined' ? matches.length : 0);
    
    // Maç verisi yoksa basit tahmin
    if (totalMatchData === 0) {
        // Güç bazlı basit tahmin
        const scoreA = Math.round(teamAPower / 15); // Basit formül
        const scoreB = Math.round(teamBPower / 15);
        
        displaySimplePrediction(container, scoreA, scoreB, 0);
        return;
    }
    
    // Detaylı tahmin hesapla
    const teamAPrediction = calculateKadroTeamPrediction(teamA, teamB);
    const teamBPrediction = calculateKadroTeamPrediction(teamB, teamA);
    
    // Güven oranı hesapla (maç sayısına göre)
    const confidencePercent = Math.min(95, 30 + (totalMatchData * 5));
    
    // Skorları hesapla
    const scoreA = calculateRoundedScore(teamAPrediction.topScorers);
    const scoreB = calculateRoundedScore(teamBPrediction.topScorers);
    
    // Kazanan tahmini
    let winnerText = '';
    if (scoreA > scoreB) {
        winnerText = '🏆 Takım A kazanır';
    } else if (scoreB > scoreA) {
        winnerText = '🏆 Takım B kazanır';
    } else {
        winnerText = '🤝 Berabere biter';
    }
    
    container.innerHTML = `
        <div class="prediction-score-row">
            <div class="prediction-team">
                <span class="prediction-team-name">Takım A</span>
                <span class="prediction-score">${scoreA}</span>
            </div>
            <div class="prediction-team">
                <span class="prediction-team-name">Takım B</span>
                <span class="prediction-score">${scoreB}</span>
            </div>
        </div>
        
        <div class="prediction-details">
            <div class="prediction-stats">
                <div class="prediction-stat">
                    <div class="prediction-stat-label">Tahmin</div>
                    <div class="prediction-stat-value">${winnerText}</div>
                </div>
            </div>
            
            <div class="prediction-confidence">
                <span class="confidence-text">Tahmin Güveni: %${confidencePercent} (${totalMatchData} maç verisi)</span>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
                </div>
            </div>
            
            <div class="top-scorers-prediction">
                <div class="top-scorers-title">⚽ Gol Atma Potansiyeli Yüksek Oyuncular</div>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px;">
                        <div style="font-size: 11px; color: #999; margin-bottom: 5px;">Takım A</div>
                        ${generateTopScorersHTML(teamAPrediction.topScorers)}
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <div style="font-size: 11px; color: #999; margin-bottom: 5px;">Takım B</div>
                        ${generateTopScorersHTML(teamBPrediction.topScorers)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Basit skor tahmini göster (maç verisi olmadan)
 */
function displaySimplePrediction(container, scoreA, scoreB, confidence) {
    let winnerText = '';
    if (scoreA > scoreB) {
        winnerText = '🏆 Takım A kazanır';
    } else if (scoreB > scoreA) {
        winnerText = '🏆 Takım B kazanır';
    } else {
        winnerText = '🤝 Berabere biter';
    }
    
    container.innerHTML = `
        <div class="prediction-score-row">
            <div class="prediction-team">
                <span class="prediction-team-name">Takım A</span>
                <span class="prediction-score">${scoreA}</span>
            </div>
            <div class="prediction-team">
                <span class="prediction-team-name">Takım B</span>
                <span class="prediction-score">${scoreB}</span>
            </div>
        </div>
        
        <div class="prediction-details">
            <div class="prediction-stats">
                <div class="prediction-stat">
                    <div class="prediction-stat-label">Tahmin</div>
                    <div class="prediction-stat-value">${winnerText}</div>
                </div>
            </div>
            
            <p style="color: #CCCCCC; text-align: center; font-size: 12px; margin-top: 10px;">
                Tahmin oyuncu güç skorlarına göre hesaplanmıştır.<br>
                <small>Daha detaylı tahmin için maç geçmişi gereklidir.</small>
            </p>
        </div>
    `;
}

/**
 * Takımın tahmini gol sayısını hesaplar
 */
function calculateKadroTeamPrediction(team, opponentTeam) {
    let topScorers = [];
    
    team.forEach(player => {
        // Oyuncu gerçek mi misafir mi kontrol et
        const realPlayer = players.find(p => p.id === player.id);
        
        if (player.isGuest || !realPlayer) {
            // Misafir oyuncu - güce göre basit tahmin
            const prediction = (player.power / 100) * 2; // Güce göre 0-2 gol arası
            topScorers.push({
                id: player.id,
                name: player.name,
                prediction: prediction
            });
        } else {
            // Gerçek oyuncu - hibrit tahmin (performans + güç)
            const stats = calculateKadroPlayerGoalStats(player.id);
            const positionMultiplier = getKadroPositionMultiplier(player.mevki);
            
            // Güç bazlı tahmin
            const powerBasedPrediction = (player.power / 100) * 2.5;
            
            // Performans bazlı tahmin
            let performanceBasedPrediction = stats.goalsPerMatch * positionMultiplier;
            
            // Hibrit tahmin: Deneyime göre ağırlık
            let playerPrediction;
            if (stats.totalMatches >= 5) {
                // Çok maç deneyimi: %60 performans, %40 güç
                playerPrediction = (performanceBasedPrediction * 0.6) + (powerBasedPrediction * 0.4);
            } else if (stats.totalMatches >= 2) {
                // Orta deneyim: %50 performans, %50 güç
                playerPrediction = (performanceBasedPrediction * 0.5) + (powerBasedPrediction * 0.5);
            } else {
                // Az deneyim: %30 performans, %70 güç
                playerPrediction = (performanceBasedPrediction * 0.3) + (powerBasedPrediction * 0.7);
            }
            
            // Mevki çarpanını tekrar uygula (güç kısmı için)
            playerPrediction *= positionMultiplier;
            
            // MVP bonusu
            if (stats.mvpCount > 0) {
                playerPrediction *= (1 + stats.mvpCount * 0.1);
            }
            
            topScorers.push({
                id: player.id,
                name: player.name,
                prediction: playerPrediction,
                goalsPerMatch: stats.goalsPerMatch,
                playerPower: player.power
            });
        }
    });
    
    // En çok gol atacak tahmini yapılanları sırala
    topScorers.sort((a, b) => b.prediction - a.prediction);
    
    return { topScorers };
}

/**
 * Oyuncunun gol istatistiklerini hesaplar
 * Hem 2. sezon hem de 1. sezon maçlarını dahil eder
 */
function calculateKadroPlayerGoalStats(playerId) {
    let totalGoals = 0;
    let totalMatches = 0;
    let mvpCount = 0;
    
    // Tüm maçları birleştir (hem güncel sezon hem eski sezon)
    const allMatches = [...(typeof previousSeasonMatches !== 'undefined' ? previousSeasonMatches : []), 
                        ...(typeof matches !== 'undefined' ? matches : [])];
    
    allMatches.forEach(match => {
        const performance = match.performances.find(p => p.playerId === playerId);
        if (performance) {
            totalGoals += performance.goals || 0;
            totalMatches++;
        }
        
        // MVP sayısı
        if (match.macin_adami === playerId) {
            mvpCount++;
        }
    });
    
    const goalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0;
    
    return {
        totalGoals,
        totalMatches,
        goalsPerMatch,
        mvpCount
    };
}

/**
 * Mevkiye göre gol potansiyeli çarpanı
 */
function getKadroPositionMultiplier(mevki) {
    const mevkiLower = (mevki || '').toLowerCase();
    if (mevkiLower.includes('forvet')) return 1.3;
    if (mevkiLower.includes('orta')) return 1.0;
    if (mevkiLower.includes('defans')) return 0.6;
    if (mevkiLower.includes('kaleci')) return 0.1;
    return 0.8;
}

/**
 * Skorları yuvarlanmış oyuncu gollerinden hesapla
 */
function calculateRoundedScore(scorers) {
    return scorers.reduce((total, s) => {
        const roundedGoals = Math.round(s.prediction);
        return total + Math.max(0, Math.min(5, roundedGoals));
    }, 0);
}

/**
 * Top scorers HTML oluştur
 */
function generateTopScorersHTML(scorers) {
    // Sadece en az 1 gol atacak oyuncuları filtrele
    const scoringPlayers = scorers.filter(s => Math.round(s.prediction) >= 1);
    
    if (scoringPlayers.length === 0) {
        return '<div style="font-size: 11px; color: #888;">Gol beklenen oyuncu yok</div>';
    }
    
    return scoringPlayers.map((s, i) => {
        // Tahmini gol sayısını yuvarla
        let predictedGoals = Math.round(s.prediction);
        // Minimum 1, maksimum 5 gol
        predictedGoals = Math.max(1, Math.min(5, predictedGoals));
        
        // Gol tahmini metni
        let goalText = '';
        if (predictedGoals >= 3) {
            goalText = `${predictedGoals} gol atar 🔥`;
        } else if (predictedGoals >= 2) {
            goalText = `${predictedGoals} gol atar ⚽`;
        } else {
            goalText = `1 gol atar`;
        }
        
        // İsmin ilk kelimesini al
        const firstName = s.name.split(' ')[0];
        
        return `
        <div class="top-scorer-item">
            <span class="scorer-name">${i + 1}. ${firstName}</span>
            <span class="scorer-prediction">${goalText}</span>
        </div>
    `}).join('');
}
