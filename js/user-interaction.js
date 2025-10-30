// KULLANICI ETKİLEŞİMİ VE LOCALSTORAGE YÖNETİMİ

// LocalStorage anahtarları
const STORAGE_KEYS = {
    PREDICTIONS: 'halisaha_predictions',
    MVP_VOTES: 'halisaha_mvp_votes',
    USER_THEME: 'halisaha_theme',
    PREDICTION_POINTS: 'halisaha_prediction_points',
    USER_SETTINGS: 'halisaha_user_settings'
};

// Kullanıcı ayarları
let userSettings = {
    username: 'Misafir',
    predictionPoints: 0,
    totalPredictions: 0,
    correctPredictions: 0
};

// Sayfa yüklendiğinde kullanıcı verilerini yükle
document.addEventListener('DOMContentLoaded', () => {
    loadUserSettings();
    createPredictionModal();
    createMVPVotingSystem();
    updateUserStats();
});

// Kullanıcı ayarlarını yükle
function loadUserSettings() {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (stored) {
        userSettings = { ...userSettings, ...JSON.parse(stored) };
    }
}

// Kullanıcı ayarlarını kaydet
function saveUserSettings() {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettings));
}

// SKOR TAHMİN SİSTEMİ
function createPredictionModal() {
    const predictionModalHTML = `
        <div id="prediction-modal" class="modal-overlay">
            <div class="modal-content glassmorphism-card">
                <div class="modal-header">
                    <h3>Skor Tahmini Yap</h3>
                    <button class="modal-close" onclick="closePredictionModal()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="prediction-info">
                        <div id="prediction-match-info" class="match-info-card">
                            <!-- Maç bilgileri buraya gelecek -->
                        </div>
                        
                        <div class="prediction-form">
                            <h4>Tahmin Et</h4>
                            <div class="score-inputs">
                                <div class="team-input">
                                    <label>Takım A</label>
                                    <input type="number" id="prediction-team-a" min="0" max="20" value="0">
                                </div>
                                <div class="vs-divider">VS</div>
                                <div class="team-input">
                                    <label>Takım B</label>
                                    <input type="number" id="prediction-team-b" min="0" max="20" value="0">
                                </div>
                            </div>
                            
                            <div class="prediction-confidence">
                                <label for="confidence-slider">Güven Seviyesi: <span id="confidence-value">50</span>%</label>
                                <input type="range" id="confidence-slider" min="10" max="100" value="50">
                            </div>
                            
                            <div class="prediction-actions">
                                <button class="prediction-submit-btn" onclick="submitPrediction()">
                                    <i class="fas fa-crystal-ball"></i> Tahmin Yap
                                </button>
                                <button class="prediction-cancel-btn" onclick="closePredictionModal()">
                                    İptal
                                </button>
                            </div>
                        </div>
                        
                        <div class="prediction-stats">
                            <h4>Tahmin İstatistiklerin</h4>
                            <div class="stats-grid-mini">
                                <div class="stat-mini">
                                    <span class="stat-value" id="user-prediction-points">${userSettings.predictionPoints}</span>
                                    <span class="stat-label">Puan</span>
                                </div>
                                <div class="stat-mini">
                                    <span class="stat-value" id="user-total-predictions">${userSettings.totalPredictions}</span>
                                    <span class="stat-label">Toplam</span>
                                </div>
                                <div class="stat-mini">
                                    <span class="stat-value" id="user-accuracy">${userSettings.totalPredictions > 0 ? Math.round((userSettings.correctPredictions / userSettings.totalPredictions) * 100) : 0}%</span>
                                    <span class="stat-label">Doğruluk</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', predictionModalHTML);
    
    // Güven seviyesi slider'ı için event listener
    const confidenceSlider = document.getElementById('confidence-slider');
    const confidenceValue = document.getElementById('confidence-value');
    
    confidenceSlider.addEventListener('input', (e) => {
        confidenceValue.textContent = e.target.value;
    });
}

function openPredictionModal(matchId) {
    const match = upcomingMatches.find(m => m.id === matchId);
    if (!match) return;
    
    // Maç bilgilerini doldur
    const matchInfoCard = document.getElementById('prediction-match-info');
    matchInfoCard.innerHTML = `
        <div class="prediction-match-header">
            <h3>${formatDate(match.date)} - ${match.time}</h3>
            <p class="match-venue">${match.venue}</p>
        </div>
        <div class="prediction-teams">
            <div class="prediction-team">
                <h4>Takım A</h4>
                <div class="team-strength">Güç: ${calculateTeamStrength(match.teamA)}</div>
                <div class="team-players-mini">
                    ${match.teamA.slice(0, 4).map(id => getPlayerNameById(id).split(' ')[0]).join(', ')}
                    ${match.teamA.length > 4 ? `+${match.teamA.length - 4}` : ''}
                </div>
            </div>
            <div class="prediction-team">
                <h4>Takım B</h4>
                <div class="team-strength">Güç: ${calculateTeamStrength(match.teamB)}</div>
                <div class="team-players-mini">
                    ${match.teamB.slice(0, 4).map(id => getPlayerNameById(id).split(' ')[0]).join(', ')}
                    ${match.teamB.length > 4 ? `+${match.teamB.length - 4}` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Önceki tahminleri kontrol et
    const existingPrediction = getPrediction(matchId);
    if (existingPrediction) {
        document.getElementById('prediction-team-a').value = existingPrediction.teamAScore;
        document.getElementById('prediction-team-b').value = existingPrediction.teamBScore;
        document.getElementById('confidence-slider').value = existingPrediction.confidence;
        document.getElementById('confidence-value').textContent = existingPrediction.confidence;
    }
    
    // Modal'ı göster
    const modal = document.getElementById('prediction-modal');
    modal.style.display = 'flex';
    modal.dataset.matchId = matchId;
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => modal.classList.add('active'), 10);
}

function closePredictionModal() {
    const modal = document.getElementById('prediction-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function submitPrediction() {
    const modal = document.getElementById('prediction-modal');
    const matchId = modal.dataset.matchId;
    
    const teamAScore = parseInt(document.getElementById('prediction-team-a').value);
    const teamBScore = parseInt(document.getElementById('prediction-team-b').value);
    const confidence = parseInt(document.getElementById('confidence-slider').value);
    
    const prediction = {
        matchId,
        teamAScore,
        teamBScore,
        confidence,
        timestamp: new Date().toISOString(),
        status: 'pending' // pending, correct, incorrect
    };
    
    savePrediction(prediction);
    userSettings.totalPredictions++;
    saveUserSettings();
    updateUserStats();
    
    // Başarı mesajı
    showNotification('Tahmin kaydedildi! Maç sonucunu bekleyelim.', 'success');
    closePredictionModal();
}

function savePrediction(prediction) {
    const predictions = getPredictions();
    const existingIndex = predictions.findIndex(p => p.matchId === prediction.matchId);
    
    if (existingIndex >= 0) {
        predictions[existingIndex] = prediction;
    } else {
        predictions.push(prediction);
    }
    
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
}

function getPredictions() {
    const stored = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    return stored ? JSON.parse(stored) : [];
}

function getPrediction(matchId) {
    const predictions = getPredictions();
    return predictions.find(p => p.matchId === matchId);
}

// Maç sonucu geldiğinde tahminleri değerlendir
function evaluatePredictions(matchId, actualTeamAScore, actualTeamBScore) {
    const predictions = getPredictions();
    const prediction = predictions.find(p => p.matchId === matchId);
    
    if (!prediction || prediction.status !== 'pending') return;
    
    const isCorrectScore = prediction.teamAScore === actualTeamAScore && 
                           prediction.teamBScore === actualTeamBScore;
    const isCorrectResult = getMatchResult(prediction.teamAScore, prediction.teamBScore) === 
                           getMatchResult(actualTeamAScore, actualTeamBScore);
    
    let points = 0;
    if (isCorrectScore) {
        points = Math.round(prediction.confidence * 1.5); // Tam skor: güven seviyesi x 1.5
        prediction.status = 'perfect';
        userSettings.correctPredictions++;
    } else if (isCorrectResult) {
        points = Math.round(prediction.confidence * 0.5); // Sonuç doğru: güven seviyesi x 0.5
        prediction.status = 'partial';
        userSettings.correctPredictions += 0.5;
    } else {
        prediction.status = 'incorrect';
    }
    
    prediction.earnedPoints = points;
    userSettings.predictionPoints += points;
    
    savePrediction(prediction);
    saveUserSettings();
    updateUserStats();
    
    // Sonuç bildirimi
    if (points > 0) {
        showNotification(`Tebrikler! ${points} puan kazandınız!`, 'success');
    }
}

function getMatchResult(teamAScore, teamBScore) {
    if (teamAScore > teamBScore) return 'A';
    if (teamBScore > teamAScore) return 'B';
    return 'D';
}

// MVP OYLAMA SİSTEMİ
function createMVPVotingSystem() {
    // MVP oylama modalı (maç bittiğinde açılacak)
    const mvpVotingHTML = `
        <div id="mvp-voting-modal" class="modal-overlay">
            <div class="modal-content glassmorphism-card">
                <div class="modal-header">
                    <h3>MVP Oylaması</h3>
                    <button class="modal-close" onclick="closeMVPVotingModal()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="mvp-voting-info">
                        <p>Bu maçın en değerli oyuncusunu (MVP) seçin:</p>
                        <div id="mvp-candidates" class="mvp-candidates-grid">
                            <!-- MVP adayları buraya gelecek -->
                        </div>
                        
                        <div class="voting-actions">
                            <button class="vote-submit-btn" onclick="submitMVPVote()" disabled>
                                <i class="fas fa-vote-yea"></i> Oy Ver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', mvpVotingHTML);
}

function openMVPVotingModal(matchId) {
    const match = matches.find(m => m.id == matchId);
    if (!match) return;
    
    // Zaten oy kullanılmış mı kontrol et
    if (hasVotedForMVP(matchId)) {
        showNotification('Bu maç için zaten oy kullandınız.', 'info');
        return;
    }
    
    // MVP adaylarını oluştur
    const candidatesContainer = document.getElementById('mvp-candidates');
    candidatesContainer.innerHTML = '';
    
    match.performances.forEach(perf => {
        const playerName = getPlayerNameById(perf.playerId);
        const isOfficialMVP = perf.mvp;
        
        const candidate = document.createElement('div');
        candidate.className = `mvp-candidate ${isOfficialMVP ? 'official-mvp' : ''}`;
        candidate.dataset.playerId = perf.playerId;
        
        candidate.innerHTML = `
            <div class="candidate-header">
                <span class="candidate-name">${playerName}</span>
                ${isOfficialMVP ? '<span class="official-badge">Resmi MVP</span>' : ''}
            </div>
            <div class="candidate-stats">
                <span class="stat-item">⚽ ${perf.goals} Gol</span>
                <span class="stat-item">🅰️ ${perf.assists || 0} Asist</span>
            </div>
            <div class="candidate-votes">
                <span class="vote-count" id="votes-${perf.playerId}">0 oy</span>
            </div>
        `;
        
        candidate.addEventListener('click', () => selectMVPCandidate(perf.playerId));
        candidatesContainer.appendChild(candidate);
    });
    
    // Mevcut oy sayılarını göster
    updateMVPVoteCounts(matchId);
    
    // Modal'ı göster
    const modal = document.getElementById('mvp-voting-modal');
    modal.style.display = 'flex';
    modal.dataset.matchId = matchId;
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => modal.classList.add('active'), 10);
}

function selectMVPCandidate(playerId) {
    // Önceki seçimi kaldır
    document.querySelectorAll('.mvp-candidate').forEach(c => c.classList.remove('selected'));
    
    // Yeni seçimi işaretle
    const candidate = document.querySelector(`[data-player-id="${playerId}"]`);
    candidate.classList.add('selected');
    
    // Oy ver butonunu aktif et
    document.querySelector('.vote-submit-btn').disabled = false;
    document.querySelector('.vote-submit-btn').dataset.selectedPlayer = playerId;
}

function submitMVPVote() {
    const modal = document.getElementById('mvp-voting-modal');
    const matchId = modal.dataset.matchId;
    const selectedPlayer = document.querySelector('.vote-submit-btn').dataset.selectedPlayer;
    
    if (!selectedPlayer) return;
    
    const vote = {
        matchId,
        playerId: selectedPlayer,
        timestamp: new Date().toISOString()
    };
    
    saveMVPVote(vote);
    showNotification('Oyunuz kaydedildi! Teşekkürler.', 'success');
    closeMVPVotingModal();
}

function saveMVPVote(vote) {
    const votes = getMVPVotes();
    votes.push(vote);
    localStorage.setItem(STORAGE_KEYS.MVP_VOTES, JSON.stringify(votes));
}

function getMVPVotes() {
    const stored = localStorage.getItem(STORAGE_KEYS.MVP_VOTES);
    return stored ? JSON.parse(stored) : [];
}

function hasVotedForMVP(matchId) {
    const votes = getMVPVotes();
    return votes.some(v => v.matchId === matchId);
}

function updateMVPVoteCounts(matchId) {
    const votes = getMVPVotes().filter(v => v.matchId === matchId);
    const voteCounts = {};
    
    votes.forEach(vote => {
        voteCounts[vote.playerId] = (voteCounts[vote.playerId] || 0) + 1;
    });
    
    Object.entries(voteCounts).forEach(([playerId, count]) => {
        const voteElement = document.getElementById(`votes-${playerId}`);
        if (voteElement) {
            voteElement.textContent = `${count} oy`;
        }
    });
}

function closeMVPVotingModal() {
    const modal = document.getElementById('mvp-voting-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// KULLANICI İSTATİSTİKLERİ GÜNCELLEME
function updateUserStats() {
    // Ana sayfada kullanıcı istatistiklerini göster
    const userStatsHTML = `
        <section class="user-stats glassmorphism-card animate-fade-in">
            <h3 class="section-title">Senin İstatistiklerin <span class="icon">👤</span></h3>
            <div class="user-stats-grid">
                <div class="user-stat-item">
                    <span class="user-stat-icon">🎯</span>
                    <span class="user-stat-value">${userSettings.predictionPoints}</span>
                    <span class="user-stat-label">Tahmin Puanı</span>
                </div>
                <div class="user-stat-item">
                    <span class="user-stat-icon">📊</span>
                    <span class="user-stat-value">${userSettings.totalPredictions}</span>
                    <span class="user-stat-label">Toplam Tahmin</span>
                </div>
                <div class="user-stat-item">
                    <span class="user-stat-icon">✅</span>
                    <span class="user-stat-value">${userSettings.totalPredictions > 0 ? Math.round((userSettings.correctPredictions / userSettings.totalPredictions) * 100) : 0}%</span>
                    <span class="user-stat-label">Doğruluk Oranı</span>
                </div>
            </div>
        </section>
    `;
    
    // Ana sayfada varsa güncelle
    const existingStats = document.querySelector('.user-stats');
    if (existingStats) {
        existingStats.outerHTML = userStatsHTML;
    } else {
        // İlk seferde ekle
        const topPlayers = document.querySelector('.top-players');
        if (topPlayers) {
            topPlayers.insertAdjacentHTML('afterend', userStatsHTML);
        }
    }
    
    // Modal'lardaki stat değerlerini güncelle
    const predictionPointsEl = document.getElementById('user-prediction-points');
    const totalPredictionsEl = document.getElementById('user-total-predictions');
    const accuracyEl = document.getElementById('user-accuracy');
    
    if (predictionPointsEl) predictionPointsEl.textContent = userSettings.predictionPoints;
    if (totalPredictionsEl) totalPredictionsEl.textContent = userSettings.totalPredictions;
    if (accuracyEl) {
        const accuracy = userSettings.totalPredictions > 0 ? 
            Math.round((userSettings.correctPredictions / userSettings.totalPredictions) * 100) : 0;
        accuracyEl.textContent = `${accuracy}%`;
    }
}

// BİLDİRİM SİSTEMİ
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animasyon
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Otomatik kaldır
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Tema değiştirme fonksiyonu
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
    
    // LocalStorage'da sakla
    localStorage.setItem('theme', newTheme);
    
    showNotification('success', `${newTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} tema aktif edildi`);
}

// Export fonksiyonları
window.openPredictionModal = openPredictionModal;
window.closePredictionModal = closePredictionModal;
window.submitPrediction = submitPrediction;
window.openMVPVotingModal = openMVPVotingModal;
window.closeMVPVotingModal = closeMVPVotingModal;
window.submitMVPVote = submitMVPVote;
window.selectMVPCandidate = selectMVPCandidate;
window.toggleTheme = toggleTheme;
window.evaluatePredictions = evaluatePredictions;
window.showNotification = showNotification;