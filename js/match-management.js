// MAÇ YÖNETİMİ VE GELİŞMİŞ ÖZELLİKLER

// Gelecek maçlar HTML'i ana sayfaya eklenecek
const upcomingMatchesHTML = `
    <section class="upcoming-matches glassmorphism-card animate-fade-in">
        <h3 class="section-title">Gelecek Maçlar <span class="icon">📅</span></h3>
        <div id="upcoming-matches-container">
            <!-- Gelecek maçlar buraya gelecek -->
        </div>
    </section>
`;

// Maç detay modalı HTML'i
const matchDetailModalHTML = `
    <div id="match-detail-modal" class="modal-overlay">
        <div class="modal-content glassmorphism-card">
            <div class="modal-header">
                <h3 id="modal-match-title">Maç Detayları</h3>
                <button class="modal-close" onclick="closeMatchDetailModal()">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="match-info-grid">
                    <div class="match-basic-info">
                        <div class="match-score-display">
                            <div class="team-score">
                                <span class="team-label">Takım A</span>
                                <span class="score" id="modal-team-a-score">0</span>
                            </div>
                            <div class="vs-separator">VS</div>
                            <div class="team-score">
                                <span class="team-label">Takım B</span>
                                <span class="score" id="modal-team-b-score">0</span>
                            </div>
                        </div>
                        
                        <div class="match-meta">
                            <p><strong>Tarih:</strong> <span id="modal-match-date">-</span></p>
                            <p><strong>Kazanan:</strong> <span id="modal-match-winner">-</span></p>
                            <p><strong>MVP:</strong> <span id="modal-match-mvp">-</span></p>
                        </div>
                    </div>
                    
                    <div class="team-strength-comparison">
                        <h4>Takım Güçleri</h4>
                        <div class="strength-bars">
                            <div class="strength-bar">
                                <span class="strength-label">Takım A</span>
                                <div class="strength-progress">
                                    <div class="strength-fill team-a" id="modal-team-a-strength"></div>
                                </div>
                                <span class="strength-value" id="modal-team-a-strength-value">0</span>
                            </div>
                            <div class="strength-bar">
                                <span class="strength-label">Takım B</span>
                                <div class="strength-progress">
                                    <div class="strength-fill team-b" id="modal-team-b-strength"></div>
                                </div>
                                <span class="strength-value" id="modal-team-b-strength-value">0</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="player-performances">
                    <h4>Oyuncu Performansları</h4>
                    <div class="performance-tabs">
                        <button class="tab-button active" onclick="switchPerformanceTab('team-a')">Takım A</button>
                        <button class="tab-button" onclick="switchPerformanceTab('team-b')">Takım B</button>
                    </div>
                    
                    <div id="team-a-performances" class="performance-content active">
                        <div class="performance-grid" id="modal-team-a-players">
                            <!-- Takım A oyuncu performansları -->
                        </div>
                    </div>
                    
                    <div id="team-b-performances" class="performance-content">
                        <div class="performance-grid" id="modal-team-b-players">
                            <!-- Takım B oyuncu performansları -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

// Gelecek maçları render etme
function renderUpcomingMatches() {
    const container = document.getElementById('upcoming-matches-container');
    if (!container || typeof upcomingMatches === 'undefined') return;
    
    container.innerHTML = '';
    
    if (upcomingMatches.length === 0) {
        container.innerHTML = '<p class="no-matches">Henüz planlanmış maç yok.</p>';
        return;
    }
    
    upcomingMatches.forEach(match => {
        const matchCard = createUpcomingMatchCard(match);
        container.appendChild(matchCard);
    });
}

// Gelecek maç kartı oluştur
function createUpcomingMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'upcoming-match-card';
    
    const matchDate = new Date(match.date);
    const now = new Date();
    const timeDiff = matchDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Takım güçlerini hesapla
    const teamAStrength = calculateTeamStrength(match.teamA);
    const teamBStrength = calculateTeamStrength(match.teamB);
    
    // Geri sayım
    const countdownHTML = timeDiff > 0 ? 
        `<div class="countdown" data-target="${match.date} ${match.time}">
            <div class="countdown-item">
                <span class="countdown-number" id="days-${match.id}">0</span>
                <span class="countdown-label">Gün</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="hours-${match.id}">0</span>
                <span class="countdown-label">Saat</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="minutes-${match.id}">0</span>
                <span class="countdown-label">Dakika</span>
            </div>
        </div>` : '<div class="match-passed">Maç tamamlandı</div>';
    
    card.innerHTML = `
        <div class="match-header">
            <div class="match-date-time">
                <span class="match-date">${formatDate(match.date)}</span>
                <span class="match-time">${match.time}</span>
            </div>
            <div class="match-venue">${match.venue}</div>
        </div>
        
        <div class="teams-preview">
            <div class="team-preview">
                <h4>Takım A</h4>
                <div class="team-strength-mini">
                    <div class="strength-bar-mini">
                        <div class="strength-fill-mini" style="width: ${teamAStrength}%"></div>
                    </div>
                    <span class="strength-text">${teamAStrength}/100</span>
                </div>
                <div class="team-players">
                    ${match.teamA.slice(0, 3).map(playerId => getPlayerNameById(playerId).split(' ')[0]).join(', ')}
                    ${match.teamA.length > 3 ? `+${match.teamA.length - 3}` : ''}
                </div>
            </div>
            
            <div class="vs-section">
                <span class="vs-text">VS</span>
                ${countdownHTML}
            </div>
            
            <div class="team-preview">
                <h4>Takım B</h4>
                <div class="team-strength-mini">
                    <div class="strength-bar-mini">
                        <div class="strength-fill-mini" style="width: ${teamBStrength}%"></div>
                    </div>
                    <span class="strength-text">${teamBStrength}/100</span>
                </div>
                <div class="team-players">
                    ${match.teamB.slice(0, 3).map(playerId => getPlayerNameById(playerId).split(' ')[0]).join(', ')}
                    ${match.teamB.length > 3 ? `+${match.teamB.length - 3}` : ''}
                </div>
            </div>
        </div>
        
        <div class="match-actions">
            <button class="prediction-btn" onclick="openPredictionModal('${match.id}')">
                <i class="fas fa-crystal-ball"></i> Tahmin Yap
            </button>
            <button class="details-btn" onclick="openMatchPreview('${match.id}')">
                <i class="fas fa-info-circle"></i> Detaylar
            </button>
        </div>
    `;
    
    return card;
}

// Takım gücü hesaplama
function calculateTeamStrength(teamPlayerIds) {
    if (!Array.isArray(teamPlayerIds) || typeof enhancedPlayers === 'undefined') {
        return 75; // Default değer
    }
    
    let totalRating = 0;
    let playerCount = 0;
    
    teamPlayerIds.forEach(playerId => {
        const player = enhancedPlayers.find(p => p.id === playerId);
        if (player && player.rating) {
            totalRating += player.rating;
            playerCount++;
        } else {
            totalRating += 75; // Default rating
            playerCount++;
        }
    });
    
    return playerCount > 0 ? Math.round(totalRating / playerCount) : 75;
}

// Geri sayım başlat
function startCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    
    countdowns.forEach(countdown => {
        const target = countdown.dataset.target;
        if (!target) return;
        
        const targetDate = new Date(target);
        const matchId = countdown.id || target.split(' ')[0];
        
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate - now;
            
            if (diff <= 0) {
                clearInterval(interval);
                countdown.innerHTML = '<div class="match-started">Maç başladı!</div>';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            const daysEl = document.getElementById(`days-${matchId}`);
            const hoursEl = document.getElementById(`hours-${matchId}`);
            const minutesEl = document.getElementById(`minutes-${matchId}`);
            
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            
        }, 1000);
    });
}

// Maç detay modalını aç
// MODAL FONKSİYONLARI - DEVRE DIŞI BIRAKILDI

function openMatchDetailModal(matchId) {
    // Modal özelliği kaldırıldı
    
    return;
    
    /*
    const match = matches.find(m => m.id == matchId);
    if (!match) return;
    
    // Modal'ı DOM'a ekle (henüz yoksa)
    if (!document.getElementById('match-detail-modal')) {
        document.body.insertAdjacentHTML('beforeend', matchDetailModalHTML);
    }
    
    // Modal verilerini doldur
    populateMatchDetailModal(match);
    
    // Modal'ı göster
    const modal = document.getElementById('match-detail-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Animasyon
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    */
}

// Maç detay modalını doldur
function populateMatchDetailModal(match) {
    // Temel bilgiler
    document.getElementById('modal-match-title').textContent = `Maç #${match.id}`;
    document.getElementById('modal-team-a-score').textContent = match.teamAGoals;
    document.getElementById('modal-team-b-score').textContent = match.teamBGoals;
    document.getElementById('modal-match-date').textContent = match.date;
    
    // Kazanan
    let winner = 'Berabere';
    if (match.teamAGoals > match.teamBGoals) winner = 'Takım A';
    else if (match.teamBGoals > match.teamAGoals) winner = 'Takım B';
    document.getElementById('modal-match-winner').textContent = winner;
    
    // MVP
    const mvpPerformance = match.performances.find(p => p.mvp);
    const mvpName = mvpPerformance ? getPlayerNameById(mvpPerformance.playerId) : 'Yok';
    document.getElementById('modal-match-mvp').textContent = mvpName;
    
    // Takım güçleri
    const teamAPlayers = match.performances.filter(p => p.team === 'A').map(p => p.playerId);
    const teamBPlayers = match.performances.filter(p => p.team === 'B').map(p => p.playerId);
    
    const teamAStrength = calculateTeamStrength(teamAPlayers);
    const teamBStrength = calculateTeamStrength(teamBPlayers);
    
    document.getElementById('modal-team-a-strength').style.width = `${teamAStrength}%`;
    document.getElementById('modal-team-a-strength-value').textContent = teamAStrength;
    document.getElementById('modal-team-b-strength').style.width = `${teamBStrength}%`;
    document.getElementById('modal-team-b-strength-value').textContent = teamBStrength;
    
    // Oyuncu performansları
    populatePlayerPerformances('team-a', match.performances.filter(p => p.team === 'A'));
    populatePlayerPerformances('team-b', match.performances.filter(p => p.team === 'B'));
}

// Oyuncu performanslarını doldur
function populatePlayerPerformances(team, performances) {
    const container = document.getElementById(`modal-${team}-players`);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Takım başlığı ve toplam gol
    const teamLetter = team === 'team-a' ? 'A' : 'B';
    const teamEmoji = team === 'team-a' ? '🅰️' : '🅱️';
    const totalGoals = performances.reduce((sum, perf) => sum + (perf.goals || 0), 0);
    
    const teamHeader = document.createElement('div');
    teamHeader.className = 'team-performance-header';
    teamHeader.innerHTML = `
        <h4>${teamEmoji} Takım ${teamLetter} - ${totalGoals} Gol</h4>
    `;
    container.appendChild(teamHeader);
    
    // Oyuncu listesi"
    const playersList = document.createElement('ol');
    playersList.className = 'team-players-list';
    
    performances.forEach((perf, index) => {
        const playerItem = document.createElement('li');
        playerItem.className = 'player-performance-item';
        
        const playerName = getPlayerNameById(perf.playerId);
        const goals = perf.goals || 0;
        const goalText = goals > 0 ? ` (${goals})` : '';
        
        playerItem.innerHTML = `
            <span class="player-name">${playerName}${goalText}</span>
            ${perf.mvp ? '<span class="mvp-badge">MVP</span>' : ''}
        `;
        
        playersList.appendChild(playerItem);
    });
    
    container.appendChild(playersList);
}

// Performans tab'ını değiştir
function switchPerformanceTab(team) {
    // Tab butonlarını güncelle
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // İçerikleri göster/gizle
    document.querySelectorAll('.performance-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${team}-performances`).classList.add('active');
}

// Maç detay modalını kapat
function closeMatchDetailModal() {
    // Modal özelliği kaldırıldı
    
    return;
    
    /*
    const modal = document.getElementById('match-detail-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
    */
}

// Tarih formatla
function formatDate(dateString) {
    const parts = dateString.split('.');
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    return date.toLocaleDateString('tr-TR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Tahmin modalını aç (placeholder)
function openPredictionModal(matchId) {
    // Bu fonksiyon 3. bölümde (Kullanıcı Etkileşimi) detaylandırılacak
    alert(`Tahmin sistemi yakında gelecek! Maç ID: ${matchId}`);
}

// Maç önizlemesi aç (placeholder)
function openMatchPreview(matchId) {
    const match = upcomingMatches.find(m => m.id === matchId);
    if (!match) return;
    
    alert(`Maç Önizleme:\nTarih: ${formatDate(match.date)}\nSaha: ${match.venue}\nTakım A Güç: ${calculateTeamStrength(match.teamA)}\nTakım B Güç: ${calculateTeamStrength(match.teamB)}`);
}

// Maç sonuçları tablosunda click event'i ekle - DEVRE DIŞI BIRAKILDI
function addMatchClickEvents() {
    // Modal özelliği kaldırıldı - maçlara tıklama devre dışı
    
    return;
    
    /*
    const matchTable = document.getElementById('match-results-table');
    
    if (!matchTable) return;
    
    matchTable.addEventListener('click', (e) => {
        
        const row = e.target.closest('tr');
        
        if (!row || !row.dataset.matchId) {
            
            return;
        }
        
        
        openMatchDetailModal(row.dataset.matchId);
    });
    */
}

// Export fonksiyonları
window.renderUpcomingMatches = renderUpcomingMatches;
window.startCountdowns = startCountdowns;
window.openMatchDetailModal = openMatchDetailModal;
window.closeMatchDetailModal = closeMatchDetailModal;
window.switchPerformanceTab = switchPerformanceTab;
window.calculateTeamStrength = calculateTeamStrength;
window.addMatchClickEvents = addMatchClickEvents;
