// Yardımcı fonksiyon: Oyuncu ID'sine göre oyuncu adını bulur
function getPlayerNameById(playerId) {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Bilinmeyen Oyuncu';
}

// =====================================================
// OYUNCU GÜÇ SKORU HESAPLAMA (Kadro Kur ile aynı)
// =====================================================

const MIN_MATCHES_THRESHOLD_GLOBAL = 5;

// Oyuncunun temel güç ortalamasını hesapla (fizik, bitiricilik, teknik, oyunOkuma, dayaniklilik)
function getPlayerBasePower(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) return 50;
    
    const fizik = player.fizik || 50;
    const bitiricilik = player.bitiricilik || 50;
    const teknik = player.teknik || 50;
    const oyunOkuma = player.oyunOkuma || 50;
    const dayaniklilik = player.dayaniklilik || 50;
    
    return Math.round((fizik + bitiricilik + teknik + oyunOkuma + dayaniklilik) / 5);
}

function calculatePlayerPowerGlobal(playerId) {
    return getPlayerBasePower(playerId);
}

function getPlayerMatchCountGlobal(playerId) {
    if (!matches || matches.length === 0) return 0;
    return matches.filter(match => 
        match.performances.some(p => p.playerId === playerId)
    ).length;
}

// =====================================================

// Tüm oyuncuların istatistiklerini hesaplayan fonksiyon (mevcut sezon için)
function calculatePlayerStats() {
    return calculateCurrentSeasonPlayerStats();
}

// Puan durumu tablosunu HTML'e yerleştirir
function renderScoreboard() {
    const scoreboardBody = document.getElementById('player-scoreboard')?.querySelector('tbody');
    if (!scoreboardBody) return;

    // Sezon bilgilerini güncelle
    updateSeasonInfo();

    // Yeni sezon bazlı tabloya yönlendir
    renderSeasonScoreboard(currentStandingsSeason || 2);
}

// Güç seviyesine göre CSS sınıfı döndür
function getPowerClass(power) {
    if (power >= 95) return 'power-supreme';
    if (power >= 90) return 'power-legendary';
    if (power >= 80) return 'power-elite';
    if (power >= 70) return 'power-strong';
    if (power >= 60) return 'power-average';
    if (power >= 50) return 'power-developing';
    return 'power-rookie';
}

// Güç değişikliğini hesapla
function getPowerChange(playerId, currentPower) {
    // previousPowerScores data.js dosyasında tanımlı
    if (typeof previousPowerScores !== 'undefined' && previousPowerScores[playerId]) {
        const previousPower = previousPowerScores[playerId];
        return currentPower - previousPower;
    }
    return 0; // Değişiklik yok veya yeni oyuncu
}

// Sezon bilgilerini güncelleme fonksiyonu
function updateSeasonInfo() {
    const seasonInfo = getCurrentSeason();
    
    // Mevcut sezon başlığını güncelle
    const seasonTitle = document.getElementById('current-season-title');
    if (seasonTitle) {
        seasonTitle.textContent = seasonInfo.currentSeason.name || 'Sezon 1';
    }
    
    // Sezon bitiş bilgisini güncelle
    const seasonEndInfo = document.getElementById('season-end-info');
    if (seasonEndInfo) {
        const endDateText = formatSeasonEndDate(seasonInfo.seasonEndDate);
        seasonEndInfo.textContent = `${seasonInfo.currentSeason.name || 'Sezon 1'} ${endDateText} tarihinde bitecektir`;
    }
    
    // Geçmiş sezonları göster
    renderHistoricalSeasons();
}

// Geçmiş sezonları render etme fonksiyonu
function renderHistoricalSeasons() {
    const historicalSection = document.getElementById('historical-seasons');
    const historicalContent = document.getElementById('historical-seasons-content');
    
    if (!historicalSection || !historicalContent) return;
    
    // Şu an geçmiş sezon yok, sadece gizle
    historicalSection.style.display = 'none';
}

// Maç sonuçları tablosunu HTML'e yerleştirir
function renderMatchResults() {
    const matchTableBody = document.getElementById('match-results-table')?.querySelector('tbody');
    if (!matchTableBody) return;

    matchTableBody.innerHTML = ''; // Mevcut içeriği temizle

    // Maçları tarihe göre tersten sırala (en yeni en başta)
    const sortedMatches = [...matches].sort((a, b) => {
        // Tarih formatı GG.AA.YYYY olduğu için parçalayıp YYYY-AA-GG formatına çevirerek karşılaştırıyoruz
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateB - dateA;
    });

    sortedMatches.forEach(match => {
        const teamAResult = match.teamAGoals > match.teamBGoals ? 'W' : (match.teamAGoals === match.teamBGoals ? 'D' : 'L');
        const teamBResult = match.teamBGoals > match.teamAGoals ? 'W' : (match.teamBGoals === match.teamAGoals ? 'D' : 'L');
        
        let winnerText = 'Berabere';
        if (teamAResult === 'W') winnerText = 'Takım A';
        else if (teamBResult === 'W') winnerText = 'Takım B';

        const row = `
            <tr data-match-id="${match.id}">
                <td>${match.date}</td>
                <td>${match.teamAGoals}</td>
                <td>${match.teamBGoals}</td>
                <td>${match.teamAGoals} - ${match.teamBGoals}</td>
                <td>${winnerText}</td>
                <td>
                    <button class="detail-btn" onclick="toggleMatchDetail(${match.id})">
                        <i class="fas fa-eye"></i> Detay
                    </button>
                </td>
            </tr>
            <tr id="detail-${match.id}" class="match-detail-row" style="display: none;">
                <td colspan="6">
                    <div class="match-detail-panel">
                        <!-- JavaScript ile doldurulacak -->
                    </div>
                </td>
            </tr>
        `;
        matchTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Ana sayfadaki özet bilgileri gösterir
function renderHomePageSummary() {
    const latestMatchSummaryDiv = document.getElementById('latest-match-summary');

    if (latestMatchSummaryDiv) {
        // En yüksek ID'li maçı bul (en son maç)
        if (!matches || matches.length === 0) {
            latestMatchSummaryDiv.innerHTML = '<p>Henüz maç oynanmadı.</p>';
        } else {
            const latestMatch = matches.reduce((prev, current) => (prev.id > current.id) ? prev : current);

            let resultStatusText = 'Berabere';
            if (latestMatch.teamAGoals > latestMatch.teamBGoals) resultStatusText = 'Takım A Kazandı';
            else if (latestMatch.teamBGoals > latestMatch.teamAGoals) resultStatusText = 'Takım B Kazandı';

            // En golcü 3 oyuncuyu bul (o maçtan)
            const playersWithGoals = latestMatch.performances
                .filter(perf => perf.goals > 0)
                .sort((a, b) => b.goals - a.goals)
                .slice(0, 3);

            let topScorersHtml = '';
            if (playersWithGoals.length > 0) {
                topScorersHtml = `
                    <div class="top-scorers-section">
                        <h5 style="margin: 15px 0 10px 0; color: var(--primary-accent);">En Golcü 3 Oyuncu:</h5>
                        <ol class="top-scorers-list">
                `;
                
                playersWithGoals.forEach((perf, index) => {
                    const player = players.find(p => p.id === perf.playerId);
                    const playerName = player ? player.name : 'Bilinmeyen Oyuncu';
                    const teamName = perf.team === 'A' ? 'Takım A' : 'Takım B';
                    
                    topScorersHtml += `
                        <li>${playerName} <span class="team-badge">(${teamName})</span> - <strong>${perf.goals} Gol</strong></li>
                    `;
                });
                
                topScorersHtml += `
                        </ol>
                    </div>
                `;
            }

            latestMatchSummaryDiv.innerHTML = `
                <p><strong>Tarih:</strong> ${latestMatch.date}</p>
                <p><strong>Skor:</strong> ${latestMatch.teamAGoals} - ${latestMatch.teamBGoals}</p>
                <p><strong>Sonuç:</strong> ${resultStatusText}</p>
                ${topScorersHtml}
            `;
        }
    }
    
    // Ana sayfaya puan durumu liderlerini ekle
    renderTopPlayersPreview();
    
    // Video açıklamasını ekle
    renderVideoDescription();
}

// Video açıklamasını render et
function renderVideoDescription() {
    const videoDescriptionElement = document.getElementById('video-description');
    
    if (videoDescriptionElement) {
        // En yüksek ID'li maçı bul (en son maç)
        if (!matches || matches.length === 0) {
            videoDescriptionElement.innerHTML = '';
        } else {
            const latestMatch = matches.reduce((prev, current) => (prev.id > current.id) ? prev : current);
            
            // video_aciklama varsa göster
            if (latestMatch.video_aciklama) {
                videoDescriptionElement.innerHTML = `<em>${latestMatch.video_aciklama}</em>`;
            } else {
                videoDescriptionElement.innerHTML = '';
            }
        }
    }
}

// Ana sayfa için ilk 3 oyuncuyu göster
function renderTopPlayersPreview() {
    const topPlayersContent = document.getElementById('top-players-content');
    if (!topPlayersContent) return;
    
    const sortedPlayers = calculatePlayerStats();
    const top3Players = sortedPlayers.slice(0, 3);
    
    if (top3Players.length === 0) {
        topPlayersContent.innerHTML = '<p>Henüz puan durumu verisi bulunmamaktadır.</p>';
        return;
    }
    
    let html = '';
    top3Players.forEach((player, index) => {
        const playerData = players.find(p => p.name === player.name);
        const playerId = playerData ? playerData.id : player.name.toLowerCase().replace(/\s+/g, '_');
        
        let rankClass = '';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';
        
        const winRate = player.M > 0 ? ((player.W / player.M) * 100).toFixed(0) : 0;
        
        html += `
            <div class="top-player-item ${rankClass}">
                <div class="top-player-left">
                    <div class="top-player-rank">${index + 1}</div>
                    <img src="img/oyuncular/${playerId}.jpg" alt="${player.name}" class="top-player-avatar" onerror="this.src='img/oyuncular/default.svg'">
                    <div class="top-player-info">
                        <div class="top-player-name">
                            <a href="oyuncu-profili.html?id=${playerId}" class="player-profile-link">${player.name}</a>
                        </div>
                        <div class="top-player-stats">${player.M} maç, ${player.GF} gol, %${winRate} galibiyet</div>
                    </div>
                </div>
                <div class="top-player-points">
                    <div class="player-points-value">${player.PTS}</div>
                    <div class="player-points-label">puan</div>
                </div>
            </div>
        `;
    });
    
    topPlayersContent.innerHTML = html;
}

// Maç detayını aç/kapat fonksiyonu
function toggleMatchDetail(matchId) {
    const detailRow = document.getElementById(`detail-${matchId}`);
    const detailBtn = document.querySelector(`tr[data-match-id="${matchId}"] .detail-btn`);
    
    if (!detailRow) return;
    
    if (detailRow.style.display === 'none' || detailRow.style.display === '') {
        // Detayı göster
        detailRow.style.display = 'table-row';
        detailBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Gizle';
        populateMatchDetail(matchId);
    } else {
        // Detayı gizle
        detailRow.style.display = 'none';
        detailBtn.innerHTML = '<i class="fas fa-eye"></i> Detay';
    }
}

// Maç detaylarını doldur
function populateMatchDetail(matchId) {
    const match = matches.find(m => m.id == matchId);
    if (!match) return;
    
    const detailPanel = document.querySelector(`#detail-${matchId} .match-detail-panel`);
    if (!detailPanel) return;
    
    // Takımları ayır ve gol sayısına göre sırala
    const teamAPlayers = match.performances
        .filter(p => p.team === 'A')
        .sort((a, b) => (b.goals || 0) - (a.goals || 0)); // En çok golcüden aza doğru
    
    const teamBPlayers = match.performances
        .filter(p => p.team === 'B')
        .sort((a, b) => (b.goals || 0) - (a.goals || 0)); // En çok golcüden aza doğru
    
    // MVP ve Eşşek bilgilerini al
    const mvpPlayer = match.macin_adami ? getPlayerNameById(match.macin_adami) : 'Belirtilmemiş';
    const donkeyPlayer = match.esek_adam ? getPlayerNameById(match.esek_adam) : 'Belirtilmemiş';
    
    let teamAHtml = `
        <div class="team-detail">
            <h4>🅰️ Takım A - ${match.teamAGoals} Gol</h4>
            <ol class="players-list">
    `;
    
    teamAPlayers.forEach(perf => {
        const player = players.find(p => p.id === perf.playerId);
        const playerName = player ? player.name : 'Bilinmeyen Oyuncu';
        const goals = perf.goals || 0;
        const mvpIcon = perf.weeklyMVP ? ' ⭐' : '';
        
        teamAHtml += `<li>${playerName} - ${goals} Gol${mvpIcon}</li>`;
    });
    
    teamAHtml += '</ol></div>';
    
    let teamBHtml = `
        <div class="team-detail">
            <h4>🅱️ Takım B - ${match.teamBGoals} Gol</h4>
            <ol class="players-list">
    `;
    
    teamBPlayers.forEach(perf => {
        const player = players.find(p => p.id === perf.playerId);
        const playerName = player ? player.name : 'Bilinmeyen Oyuncu';
        const goals = perf.goals || 0;
        const mvpIcon = perf.weeklyMVP ? ' ⭐' : '';
        
        teamBHtml += `<li>${playerName} - ${goals} Gol${mvpIcon}</li>`;
    });
    
    teamBHtml += '</ol></div>';
    
    // Özel ödüller bölümü
    const awardsHtml = `
        <div class="match-awards">
            <h4>🏆 Maç Ödülleri</h4>
            <div class="awards-grid">
                <div class="award-item mvp-award">
                    <span class="award-icon">⭐</span>
                    <div class="award-info">
                        <div class="award-title">Maçın Adamı</div>
                        <div class="award-winner">${mvpPlayer}</div>
                    </div>
                </div>
                <div class="award-item donkey-award">
                    <span class="award-icon">🫏</span>
                    <div class="award-info">
                        <div class="award-title">Haftanın Eşşeği</div>
                        <div class="award-winner">${donkeyPlayer}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    detailPanel.innerHTML = `
        <div class="match-detail-content">
            <div class="teams-container">
                ${teamAHtml}
                ${teamBHtml}
            </div>
            ${awardsHtml}
        </div>
    `;
}

// Global fonksiyonları window objesine ekle
window.toggleMatchDetail = toggleMatchDetail;



// Ana sayfadaki özet bilgileri gösterir
function populateMatchDetail(matchId) {
    const match = matches.find(m => m.id == matchId);
    if (!match) return;
    
    const detailPanel = document.querySelector(`#detail-${matchId} .match-detail-panel`);
    if (!detailPanel) return;
    
    // Takımları ayır ve gol sayısına göre sırala
    const teamAPlayers = match.performances
        .filter(p => p.team === 'A')
        .sort((a, b) => (b.goals || 0) - (a.goals || 0)); // En çok golcüden aza doğru
    
    const teamBPlayers = match.performances
        .filter(p => p.team === 'B')
        .sort((a, b) => (b.goals || 0) - (a.goals || 0)); // En çok golcüden aza doğru
    
    // Takım A toplam gol
    const teamAGoals = teamAPlayers.reduce((sum, p) => sum + (p.goals || 0), 0);
    const teamBGoals = teamBPlayers.reduce((sum, p) => sum + (p.goals || 0), 0);
    
    let teamAHtml = `
        <div class="team-detail">
            <h4>🅰️ Takım A - ${teamAGoals} Gol</h4>
            <ol class="players-list">
    `;
    
    teamAPlayers.forEach(perf => {
        const player = players.find(p => p.id === perf.playerId);
        const playerName = player ? player.name : 'Bilinmeyen Oyuncu';
        const goals = perf.goals || 0;
        const goalText = goals > 0 ? ` (${goals})` : '';
        const mvpBadge = perf.weeklyMVP ? ' <span class="mvp-mini-badge">MVP</span>' : '';
        const donkeyBadge = match.esek_adam === perf.playerId ? ' <span class="donkey-mini-badge">🫏</span>' : '';
        
        teamAHtml += `
            <li>${playerName}${goalText}${mvpBadge}${donkeyBadge}</li>
        `;
    });
    
    teamAHtml += `
            </ol>
        </div>
    `;
    
    let teamBHtml = `
        <div class="team-detail">
            <h4>🅱️ Takım B - ${teamBGoals} Gol</h4>
            <ol class="players-list">
    `;
    
    teamBPlayers.forEach(perf => {
        const player = players.find(p => p.id === perf.playerId);
        const playerName = player ? player.name : 'Bilinmeyen Oyuncu';
        const goals = perf.goals || 0;
        const goalText = goals > 0 ? ` (${goals})` : '';
        const mvpBadge = perf.weeklyMVP ? ' <span class="mvp-mini-badge">MVP</span>' : '';
        const donkeyBadge = match.esek_adam === perf.playerId ? ' <span class="donkey-mini-badge">🫏</span>' : '';
        
        teamBHtml += `
            <li>${playerName}${goalText}${mvpBadge}${donkeyBadge}</li>
        `;
    });
    
    teamBHtml += `
            </ol>
        </div>
    `;
    
    detailPanel.innerHTML = `
        <div class="match-teams-container">
            ${teamAHtml}
            ${teamBHtml}
        </div>
    `;
}


// Sayfa yüklendiğinde ilgili fonksiyonları çağır
document.addEventListener('DOMContentLoaded', () => {
    // Hangi sayfada olduğumuza göre farklı fonksiyonları çalıştırabiliriz
    const path = window.location.pathname;

    if (path.includes('puan-durumu.html')) {
        renderScoreboard();
        // Sezon butonlarını başlat
        initStandingsSeasonButtons();
        // Maç click eventleri için - MODAL ÖZELLİĞİ KALDIRILDI
        // addMatchClickEvents();
    } else if (path.includes('maclar.html')) {
        renderMatchResults();
        // Maç click eventleri için - MODAL ÖZELLİĞİ KALDIRILDI
        // addMatchClickEvents();
    } else if (path.includes('index.html') || path === '/') { // Ana sayfa veya kök dizin
        renderHomePageSummary();
        // Gelecek maçları render et
        if (typeof renderUpcomingMatches === 'function') {
            renderUpcomingMatches();
            // Geri sayımları başlat
            setTimeout(startCountdowns, 100);
        }
    }
    
    // Animasyonları başlatmak için
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        el.style.opacity = 1; // opacity'i 1 yaparak animasyonu tetikle
    });
    
    // Haftanın adamını göster
    displayWeeklyHero();
    
    // Haftanın eşşeğini göster
    displayWeeklyDonkey();
    
    // Video açıklamasını güncelle
    displayVideoDescription();
    
    // Sıradaki maç kadrosunu göster
    displayLineup();
    
    // Skor tahminini göster
    displayScorePrediction();
    
    // Gelişmiş UI özelliklerini başlat
    if (typeof initializePageTransitions === 'function') {
        // UI geliştirmeleri script'i yüklenmişse
        setTimeout(() => {
            initializePageTransitions();
            // initializeSwipeNavigation(); // SWIPE NAVIGATION DEVRE DIŞI
            createFloatingActionButton();
        }, 500);
    }
});

// Haftanın adamını görüntüleme fonksiyonu
function displayWeeklyHero() {
    const weeklyHeroContainer = document.getElementById('weekly-hero-content');
    if (!weeklyHeroContainer) return;

    // Maç yoksa mesaj göster
    if (!matches || matches.length === 0) {
        weeklyHeroContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); opacity: 0.7;">Henüz maç oynanmamış.</p>';
        return;
    }

    // En yüksek ID'li maçı bul
    const latestMatch = matches.reduce((prev, current) => (prev.id > current.id) ? prev : current);
    
    // macin_adami parametresini kontrol et
    if (!latestMatch.macin_adami) {
        weeklyHeroContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); opacity: 0.7;">Bu hafta MVP seçilmemiş.</p>';
        return;
    }

    // Haftanın adamı oyuncusunu bul
    const mvpPlayer = players.find(p => p.id === latestMatch.macin_adami);
    if (!mvpPlayer) {
        weeklyHeroContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); opacity: 0.7;">Oyuncu bilgisi bulunamadı.</p>';
        return;
    }

    // Bu oyuncunun bu maçtaki performansını bul
    const mvpPerformance = latestMatch.performances.find(perf => perf.playerId === latestMatch.macin_adami);
    const mvpGoals = mvpPerformance ? mvpPerformance.goals : 0;

    // Bu oyuncunun tüm maçlardaki toplam gollerini ve maç sayısını hesapla
    let totalGoals = 0;
    let totalMatches = 0;
    let weeklyMVPCount = 0;
    
    matches.forEach(match => {
        const playerPerf = match.performances.find(perf => perf.playerId === latestMatch.macin_adami);
        if (playerPerf) {
            totalGoals += playerPerf.goals;
            totalMatches++;
        }
        
        // Haftanın adamı sayısını hesapla
        if (match.macin_adami === latestMatch.macin_adami) {
            weeklyMVPCount++;
        }
    });

    // Maç başına ortalama gol hesapla
    const averageGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : 0;

    // Maçtan açıklama al (eğer varsa)
    const heroDescription = latestMatch.macin_adami_aciklama || '';

    // Debug: fotoğraf yolunu konsola yazdır


    weeklyHeroContainer.innerHTML = `
        <div class="hero-profile" onclick="window.location.href='oyuncu-profili.html?id=${latestMatch.macin_adami}'" style="cursor: pointer;">
            <div class="hero-avatar">
                <img src="img/oyuncular/${latestMatch.macin_adami}.jpg" alt="${mvpPlayer.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hero-avatar-placeholder" style="display: none;">${mvpPlayer.name.charAt(0)}</div>
            </div>
            <div class="hero-info">
                <h4>${mvpPlayer.name}</h4>
                <p class="hero-position">🏃‍♂️ ${mvpPlayer.mevki}</p>
                <div class="hero-stats-list">
                    <p class="hero-stat-item">📈 <strong>${mvpPlayer.name}</strong> Bu Hafta <strong>${mvpGoals}</strong> Gol Attı!</p>
                    <p class="hero-stat-item">⚽ Maç başına ortalama <strong>${averageGoals}</strong> kadar golü var!</p>
                    <p class="hero-stat-item">🏆 <strong>${weeklyMVPCount}</strong> kere Haftanın adamı seçildi!</p>
                    ${heroDescription ? `<p class="hero-note">💬 ${heroDescription}</p>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Haftanın Eşşeğini göster
function displayWeeklyDonkey() {
    const weeklyDonkeyContainer = document.getElementById('weekly-donkey-content');
    if (!weeklyDonkeyContainer) return;

    // Maç olup olmadığını kontrol et
    if (matches.length === 0) {
        weeklyDonkeyContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); opacity: 0.7;">Henüz maç oynanmamış.</p>';
        return;
    }

    // En son maçı al
    const latestMatch = matches[matches.length - 1];

    // esek_adam parametresini kontrol et
    if (!latestMatch.esek_adam) {
        weeklyDonkeyContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); opacity: 0.7;">Bu hafta eşşek seçilmemiş.</p>';
        return;
    }

    // Haftanın eşşeği oyuncusunu bul
    const donkeyPlayer = players.find(p => p.id === latestMatch.esek_adam);
    if (!donkeyPlayer) {
        weeklyDonkeyContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); opacity: 0.7;">Oyuncu bilgisi bulunamadı.</p>';
        return;
    }

    // Eşek adam açıklamasını al (eğer varsa)
    const donkeyDescription = latestMatch.esek_adam_aciklama || 'Bu hafta maalesef performans beklenenin altındaydı.';

    // Haftanın eşşeğini göster (sadece fotoğraf ve isim)
    weeklyDonkeyContainer.innerHTML = `
        <div class="donkey-profile" onclick="window.location.href='oyuncu-profili.html?id=${latestMatch.esek_adam}'" style="cursor: pointer;">
            <div class="donkey-avatar">
                <img src="img/oyuncular/${latestMatch.esek_adam}.jpg" alt="${donkeyPlayer.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="donkey-avatar-placeholder" style="display: none;">${donkeyPlayer.name.charAt(0)}</div>
            </div>
            <div class="donkey-info">
                <h4>${donkeyPlayer.name}</h4>
                <p class="donkey-comment">🫏 ${donkeyDescription} 🫏</p>
            </div>
        </div>
    `;
}

// Video açıklamasını göster
function displayVideoDescription() {
    const videoDescriptionElement = document.getElementById('video-description');
    if (!videoDescriptionElement) return;

    // Maç olup olmadığını kontrol et
    if (!matches || matches.length === 0) {
        videoDescriptionElement.textContent = 'Henüz maç videosu yok.';
        return;
    }

    // En son maçı al
    const latestMatch = matches[matches.length - 1];

    // video_aciklama alanını kullan (yoksa varsayılan mesaj)
    const videoDescription = latestMatch.video_aciklama || 'Son maçtan unutulmaz bir an...';
    
    videoDescriptionElement.textContent = videoDescription;
}

// Hamburger Menü Fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
    // Ana sayfa özet bilgilerini göster - önce verilerin yüklendiğinden emin ol
    setTimeout(() => {
        renderHomePageSummary();
        displayWeeklyHero();
        displayWeeklyDonkey();
        displayLineup();
        displayScorePrediction();
    }, 100);
    
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Menü linklerine tıklandığında menüyü kapat
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Dışarı tıklandığında menüyü kapat
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Backup çözüm - window onload
window.addEventListener('load', function() {
    // Eğer DOM ready'de çalışmadıysa burada tekrar dene
    const latestMatchSummaryDiv = document.getElementById('latest-match-summary');
    if (latestMatchSummaryDiv && latestMatchSummaryDiv.innerHTML.includes('Yükleniyor...')) {
        setTimeout(() => {
            renderHomePageSummary();
        }, 200);
    }
});

// ==================== SKOR TAHMİNİ FONKSİYONLARI ====================

/**
 * Oyuncunun gol ortalamasını hesaplar (Skor tahmini için)
 * Hem 2. sezon hem de 1. sezon maçlarını dahil eder
 * @param {string} playerId - Oyuncu ID'si
 * @returns {Object} - {goalsPerMatch, totalGoals, totalMatches, mvpCount}
 */
function calculatePlayerGoalStats(playerId) {
    let totalGoals = 0;
    let totalMatches = 0;
    let mvpCount = 0;
    
    // Tüm maçları birleştir (hem güncel sezon hem eski sezon)
    const allMatches = [...(typeof season1Matches !== 'undefined' ? season1Matches : []), ...matches];
    
    allMatches.forEach(match => {
        const performance = match.performances.find(p => p.playerId === playerId);
        if (performance) {
            totalGoals += performance.goals;
            totalMatches++;
        }
        if (match.macin_adami === playerId) {
            mvpCount++;
        }
    });
    
    const goalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0;
    
    return {
        goalsPerMatch,
        totalGoals,
        totalMatches,
        mvpCount
    };
}

/**
 * Oyuncunun belirli rakiplere karşı performansını hesaplar
 * Hem 2. sezon hem de 1. sezon maçlarını dahil eder
 * @param {string} playerId - Oyuncu ID'si
 * @param {Array} opponentIds - Rakip oyuncu ID'leri
 * @returns {Object} - {goalsAgainstOpponents, matchesAgainstOpponents, avgGoalsVsOpponents}
 */
function calculatePerformanceVsOpponents(playerId, opponentIds) {
    let goalsAgainstOpponents = 0;
    let matchesAgainstOpponents = 0;
    
    // Tüm maçları birleştir (hem güncel sezon hem eski sezon)
    const allMatches = [...(typeof season1Matches !== 'undefined' ? season1Matches : []), ...matches];
    
    allMatches.forEach(match => {
        const playerPerf = match.performances.find(p => p.playerId === playerId);
        if (!playerPerf) return;
        
        const playerTeam = playerPerf.team;
        const opponentTeam = playerTeam === 'A' ? 'B' : 'A';
        
        // Bu maçta rakip takımda kaç kişi var kontrol et
        const opponentsInMatch = match.performances.filter(p => 
            p.team === opponentTeam && opponentIds.includes(p.playerId)
        );
        
        // En az 3 rakip oyuncu aynı maçta oynamışsa bu maçı say
        if (opponentsInMatch.length >= 3) {
            goalsAgainstOpponents += playerPerf.goals;
            matchesAgainstOpponents++;
        }
    });
    
    const avgGoalsVsOpponents = matchesAgainstOpponents > 0 
        ? goalsAgainstOpponents / matchesAgainstOpponents 
        : null; // null = veri yok
    
    return {
        goalsAgainstOpponents,
        matchesAgainstOpponents,
        avgGoalsVsOpponents
    };
}

/**
 * Oyuncunun belirli takım arkadaşlarıyla performansını hesaplar
 * Hem 2. sezon hem de 1. sezon maçlarını dahil eder
 * @param {string} playerId - Oyuncu ID'si
 * @param {Array} teammateIds - Takım arkadaşı ID'leri
 * @returns {Object} - {goalsWithTeammates, matchesWithTeammates, avgGoalsWithTeammates}
 */
function calculatePerformanceWithTeammates(playerId, teammateIds) {
    let goalsWithTeammates = 0;
    let matchesWithTeammates = 0;
    
    // Tüm maçları birleştir (hem güncel sezon hem eski sezon)
    const allMatches = [...(typeof season1Matches !== 'undefined' ? season1Matches : []), ...matches];
    
    allMatches.forEach(match => {
        const playerPerf = match.performances.find(p => p.playerId === playerId);
        if (!playerPerf) return;
        
        const playerTeam = playerPerf.team;
        
        // Bu maçta aynı takımda kaç takım arkadaşı var kontrol et
        const teammatesInMatch = match.performances.filter(p => 
            p.team === playerTeam && 
            p.playerId !== playerId && 
            teammateIds.includes(p.playerId)
        );
        
        // En az 3 takım arkadaşı aynı maçta oynamışsa bu maçı say
        if (teammatesInMatch.length >= 3) {
            goalsWithTeammates += playerPerf.goals;
            matchesWithTeammates++;
        }
    });
    
    const avgGoalsWithTeammates = matchesWithTeammates > 0 
        ? goalsWithTeammates / matchesWithTeammates 
        : null; // null = veri yok
    
    return {
        goalsWithTeammates,
        matchesWithTeammates,
        avgGoalsWithTeammates
    };
}

/**
 * Mevkiye göre gol potansiyeli çarpanı
 * @param {string} mevki - Oyuncu mevkisi
 * @returns {number} - Çarpan değeri
 */
function getPositionMultiplier(mevki) {
    const mevkiLower = mevki.toLowerCase();
    if (mevkiLower.includes('forvet')) return 1.3;
    if (mevkiLower.includes('orta')) return 1.0;
    if (mevkiLower.includes('defans')) return 0.6;
    if (mevkiLower.includes('kaleci')) return 0.1;
    return 0.8;
}


/**
 * Takımın tahmini gol sayısını hesaplar (Rakip analizi + Takım arkadaşı uyumu + Oyuncu gücü dahil)
 * @param {Array} teamPlayerIds - Takım oyuncu ID'leri
 * @param {Array} opponentIds - Rakip takım oyuncu ID'leri
 * @returns {Object} - {predictedGoals, topScorers, teamStrength}
 */
function calculateTeamPrediction(teamPlayerIds, opponentIds) {
    let totalPredictedGoals = 0;
    let topScorers = [];
    let totalExperience = 0;
    let mvpPower = 0;
    
    teamPlayerIds.forEach(playerId => {
        const player = players.find(p => p.id === playerId);
        if (!player) return;
        
        // Temel istatistikler
        const stats = calculatePlayerGoalStats(playerId);
        const positionMultiplier = getPositionMultiplier(player.mevki);
        
        // Rakip analizi - Bu rakiplere karşı nasıl oynadı?
        const vsOpponents = calculatePerformanceVsOpponents(playerId, opponentIds);
        
        // Takım arkadaşı uyumu - Bu takım arkadaşlarıyla nasıl oynadı?
        const withTeammates = calculatePerformanceWithTeammates(playerId, teamPlayerIds.filter(id => id !== playerId));
        
        // Oyuncu gücü hesapla (base stats)
        const playerPower = Math.round((player.fizik + player.bitiricilik + player.teknik + player.oyunOkuma + player.dayaniklilik) / 5);
        
        // Güç bazlı temel tahmin (0-3 gol arası, güce göre normalize)
        // 50 güç = 0.5 gol, 85 güç = 1.7 gol, 95 güç = 2.4 gol potansiyeli
        const powerBasedPrediction = (playerPower / 100) * 2.5;
        
        // Performans bazlı tahmin (geçmiş gol ortalaması)
        let performanceBasedPrediction = stats.goalsPerMatch;
        
        // Rakip analizi etkisi (%40 ağırlık - eğer veri varsa)
        if (vsOpponents.avgGoalsVsOpponents !== null && vsOpponents.matchesAgainstOpponents >= 2) {
            performanceBasedPrediction = (performanceBasedPrediction * 0.6) + (vsOpponents.avgGoalsVsOpponents * 0.4);
        }
        
        // Takım arkadaşı uyumu etkisi (%30 ağırlık - eğer veri varsa)
        if (withTeammates.avgGoalsWithTeammates !== null && withTeammates.matchesWithTeammates >= 2) {
            performanceBasedPrediction = (performanceBasedPrediction * 0.7) + (withTeammates.avgGoalsWithTeammates * 0.3);
        }
        
        // Hibrit tahmin: Güç ve performansı dengeli birleştir
        let playerPrediction;
        if (stats.totalMatches >= 5) {
            // Çok maç deneyimi varsa: %60 performans, %40 güç
            playerPrediction = (performanceBasedPrediction * 0.6) + (powerBasedPrediction * 0.4);
        } else if (stats.totalMatches >= 2) {
            // Orta deneyim: %50 performans, %50 güç
            playerPrediction = (performanceBasedPrediction * 0.5) + (powerBasedPrediction * 0.5);
        } else {
            // Az deneyim: %30 performans, %70 güç (güce daha çok güven)
            playerPrediction = (performanceBasedPrediction * 0.3) + (powerBasedPrediction * 0.7);
        }
        
        // Mevki çarpanı uygula
        playerPrediction *= positionMultiplier;
        
        // MVP bonus (her MVP +%10 etki)
        if (stats.mvpCount > 0) {
            playerPrediction *= (1 + stats.mvpCount * 0.1);
            mvpPower += stats.mvpCount;
        }
        
        // Deneyim faktörü
        totalExperience += stats.totalMatches;
        
        totalPredictedGoals += playerPrediction;
        
        topScorers.push({
            id: playerId,
            name: player.name,
            prediction: playerPrediction,
            goalsPerMatch: stats.goalsPerMatch,
            playerPower: playerPower,
            vsOpponentsAvg: vsOpponents.avgGoalsVsOpponents,
            vsOpponentsMatches: vsOpponents.matchesAgainstOpponents,
            withTeammatesAvg: withTeammates.avgGoalsWithTeammates,
            withTeammatesMatches: withTeammates.matchesWithTeammates
        });
    });
    
    // En çok gol atacak tahmini yapılanları sırala
    topScorers.sort((a, b) => b.prediction - a.prediction);
    
    // Takım gücü = Tahmini gol sayısı
    const teamStrength = totalPredictedGoals;
    
    return {
        predictedGoals: Math.round(totalPredictedGoals * 10) / 10,
        topScorers: topScorers, // Tüm oyuncular
        teamStrength,
        totalExperience
    };
}

/**
 * Skor tahminini ekrana render eder
 */
function displayScorePrediction() {
    const container = document.getElementById('score-prediction');
    if (!container) return;
    
    // Toplam maç sayısını hesapla (hem eski sezon hem yeni sezon)
    const totalMatchData = (typeof season1Matches !== 'undefined' ? season1Matches.length : 0) + (matches?.length || 0);
    
    // Maç verisi yoksa
    if (totalMatchData === 0) {
        container.innerHTML = `
            <p style="color: #CCCCCC; text-align: center;">
                Henüz yeterli maç verisi yok.<br>
                <small>Tahmin için en az 1 maç oynanmalı.</small>
            </p>
        `;
        return;
    }
    
    // Takım tahminlerini hesapla
    const teamAPrediction = calculateTeamPrediction(nextMatchLineup.teamA, nextMatchLineup.teamB);
    const teamBPrediction = calculateTeamPrediction(nextMatchLineup.teamB, nextMatchLineup.teamA);
    
    // Güven oranı hesapla (maç sayısına göre)
    const confidencePercent = Math.min(95, 30 + (totalMatchData * 5));
    
    // Kazanan tahmini (sonra güncellenecek)
    let winnerText = '';
    
    // Top scorers HTML - Tahmini gol sayısını göster (sadece gol atacaklar)
    const topScorersHTML = (scorers, teamName) => {
        if (scorers.length === 0) return '';
        
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
            
            return `
            <div class="top-scorer-item">
                <span class="scorer-name">${i + 1}. ${s.name.split(' ')[0]}</span>
                <span class="scorer-prediction">${goalText}</span>
            </div>
        `}).join('');
    };
    
    // Skor hesaplama: oyuncuların yuvarlanmış gollerinin toplamı
    const calculateRoundedScore = (scorers) => {
        return scorers.reduce((total, s) => {
            const roundedGoals = Math.round(s.prediction);
            return total + Math.max(0, Math.min(5, roundedGoals));
        }, 0);
    };
    
    // Skorları yuvarlanmış oyuncu gollerinden hesapla
    let scoreA = calculateRoundedScore(teamAPrediction.topScorers);
    let scoreB = calculateRoundedScore(teamBPrediction.topScorers);
    
    // Kazanan tahmini güncelle
    if (scoreA > scoreB) {
        winnerText = '🏆 A Takımı kazanır';
    } else if (scoreB > scoreA) {
        winnerText = '🏆 B Takımı kazanır';
    } else {
        winnerText = '🤝 Berabere biter';
    }
    
    container.innerHTML = `
        <div class="prediction-score-row">
            <div class="prediction-team">
                <span class="prediction-team-name">A Takımı</span>
                <span class="prediction-score">${scoreA}</span>
            </div>
            <div class="prediction-team">
                <span class="prediction-team-name">B Takımı</span>
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
                        <div style="font-size: 11px; color: #999; margin-bottom: 5px;">A Takımı</div>
                        ${topScorersHTML(teamAPrediction.topScorers, 'A')}
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <div style="font-size: 11px; color: #999; margin-bottom: 5px;">B Takımı</div>
                        ${topScorersHTML(teamBPrediction.topScorers, 'B')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== SIRADAKI MAÇ KADROSU FONKSİYONLARI ====================

// Kadro verisi artık data.js dosyasından geliyor (nextMatchLineup)

/**
 * Her iki takımın kadrosunu aynı anda gösterir
 */
function displayLineup() {
    const teamAContainer = document.getElementById('team-a-players');
    const teamBContainer = document.getElementById('team-b-players');
    
    if (!teamAContainer || !teamBContainer) return;

    // A Takımını göster
    displayTeamLineup('A', teamAContainer);
    
    // B Takımını göster
    displayTeamLineup('B', teamBContainer);
}

/**
 * Belirtilen takımın dizilişini gösterir
 * @param {string} team - Takım ('A' veya 'B')
 * @param {HTMLElement} container - Takım container'ı
 */
function displayTeamLineup(team, container) {
    container.innerHTML = '';
    
    // Takım oyuncularını ID'lerden player objelerine çevir
    const teamPlayerIds = nextMatchLineup[`team${team}`];
    const teamPlayers = teamPlayerIds.map(playerId => {
        const player = players.find(p => p.id === playerId);
        return player || { id: playerId, name: playerId, mevki: 'Orta Saha' };
    });

    // Otomatik diziliş oluştur (2 kaleci durumu da bu fonksiyonda çözülüyor)
    const groupedPlayers = groupPlayersByPosition(teamPlayers);
    
    // Her mevki için oyuncuları yerleştir
    Object.keys(groupedPlayers).forEach(mevki => {
        const mevkiCount = groupedPlayers[mevki].length;
        groupedPlayers[mevki].forEach((player, index) => {
            const playerElement = createPlayerElement(player, team, mevki, index, mevkiCount);
            container.appendChild(playerElement);
        });
    });
}

/**
 * Oyuncuları gerçek mevkilerine göre otomatik gruplar
 * Eğer takımda 2 kaleci varsa, birini defansa taşır
 * @param {Array} teamPlayers - Takım oyuncuları
 * @returns {Object} - Mevkiye göre grupanmış oyuncular
 */
function groupPlayersByPosition(teamPlayers) {
    const grouped = {
        kaleci: [],
        defans: [],
        ortaSaha: [],
        forvet: []
    };

    // Oyuncuları gerçek mevkilerine göre grupla
    teamPlayers.forEach(player => {
        const mevki = player.mevki.toLowerCase();
        if (mevki.includes('kaleci')) {
            grouped.kaleci.push(player);
        } else if (mevki.includes('defans')) {
            grouped.defans.push(player);
        } else if (mevki.includes('orta')) {
            grouped.ortaSaha.push(player);
        } else if (mevki.includes('forvet')) {
            grouped.forvet.push(player);
        } else {
            // Bilinmeyen mevki için orta sahaya koy
            grouped.ortaSaha.push(player);
        }
    });

    // Eğer takımda 2 kaleci varsa, birini defansa taşı
    while (grouped.kaleci.length > 1) {
        const extraGoalkeeper = grouped.kaleci.pop();
        grouped.defans.unshift(extraGoalkeeper); // Defansın başına ekle
    }

    return grouped;
}

/**
 * Oyuncu adını formatlar (Sadece ilk isim + soyadın baş harfi)
 * Örnek: "Onur Mustafa KÖSE" -> "Onur K."
 * Örnek: "Furkan SEVİMLİ" -> "Furkan S."
 * Örnek: "Berkin Tayyip CERAN" -> "Berkin C."
 * @param {string} fullName - Tam isim
 * @returns {string} - Formatlanmış isim
 */
function formatPlayerName(fullName) {
    const nameParts = fullName.trim().split(' ');
    
    if (nameParts.length === 1) {
        // Tek isim (misafir vb.)
        return nameParts[0];
    } else {
        // İki veya daha fazla kelime: İlk isim + soyadın baş harfi
        // "Furkan SEVİMLİ" -> "Furkan S."
        // "Onur Mustafa KÖSE" -> "Onur K."
        // "Berkin Tayyip CERAN" -> "Berkin C."
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        return `${firstName} ${lastName.charAt(0)}.`;
    }
}

/**
 * Oyuncu elementi oluşturur
 * @param {Object} player - Oyuncu verisi
 * @param {string} team - Takım ('A' veya 'B')
 * @param {string} mevki - Oyuncunun sahada oynayacağı mevki
 * @param {number} index - Mevkideki sıra numarası
 * @param {number} mevkiCount - Bu mevkideki toplam oyuncu sayısı
 * @returns {HTMLElement} - Oyuncu DOM elementi
 */
function createPlayerElement(player, team, mevki, index, mevkiCount) {
    const playerDiv = document.createElement('div');
    playerDiv.className = `player ${getMevkiClass(mevki)}`;
    
    // Fotoğraf elementi oluştur
    const photoDiv = document.createElement('div');
    photoDiv.className = 'player-photo';
    
    // Fotoğraf yolu - img/oyuncular/{player.id}.jpg
    const photoImg = document.createElement('img');
    photoImg.src = `img/oyuncular/${player.id}.jpg`;
    photoImg.alt = player.name;
    photoImg.onerror = function() {
        // Fotoğraf yoksa baş harfleri göster
        this.style.display = 'none';
        const initials = player.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        photoDiv.textContent = initials;
        photoDiv.classList.add('no-photo');
    };
    
    photoDiv.appendChild(photoImg);
    
    // İsim elementi oluştur
    const nameDiv = document.createElement('div');
    nameDiv.className = 'player-name-label';
    nameDiv.textContent = formatPlayerName(player.name);
    
    // Elementleri birleştir
    playerDiv.appendChild(photoDiv);
    playerDiv.appendChild(nameDiv);
    
    playerDiv.dataset.playerId = player.id;
    playerDiv.dataset.team = team;
    playerDiv.title = player.name; // Tam isim tooltip olarak
    
    // Oyuncuyu pozisyonuna göre yerleştir - translateX ile merkezle
    const position = calculatePlayerPosition(mevki, index, mevkiCount);
    playerDiv.style.left = position.x + '%';
    playerDiv.style.transform = 'translateX(-50%)';
    
    // Event listener'ları ekle
    addPlayerEventListeners(playerDiv, player);
    
    return playerDiv;
}

/**
 * Mevki adını CSS class'ına çevirir
 * @param {string} mevki - Oyuncu mevkisi veya pozisyon adı
 * @returns {string} - CSS class adı
 */
function getMevkiClass(mevki) {
    const mevkiMap = {
        'Kaleci': 'kaleci',
        'kaleci': 'kaleci',
        'Defans': 'defans', 
        'defans': 'defans',
        'Orta Saha': 'orta-saha',
        'ortaSaha': 'orta-saha',
        'Forvet': 'forvet',
        'forvet': 'forvet'
    };
    return mevkiMap[mevki] || 'orta-saha';
}

/**
 * Oyuncunun sahada pozisyonunu hesaplar (orantılı diziliş)
 * @param {string} mevki - Oyuncu mevkisi (kaleci, defans, ortaSaha, forvet)
 * @param {number} index - Mevkideki sıra numarası
 * @param {string} team - Takım ('A' veya 'B')
 * @returns {Object} - {x} koordinatı (yüzde cinsinden)
 */
/**
 * Oyuncunun sahada pozisyonunu hesaplar (orantılı diziliş)
 * @param {string} mevki - Oyuncu mevkisi (kaleci, defans, ortaSaha, forvet)
 * @param {number} index - Mevkideki sıra numarası
 * @param {number} mevkiCount - Bu mevkideki toplam oyuncu sayısı
 * @returns {Object} - {x} koordinatı (yüzde cinsinden)
 */
function calculatePlayerPosition(mevki, index, mevkiCount) {
    let positions = [];
    
    switch(mevki) {
        case 'kaleci':
            // Kaleci her zaman ortada
            positions = [{ x: 50 }];
            break;
            
        case 'defans':
            // Defans sayısına göre orantılı yerleştirme
            if (mevkiCount === 1) {
                positions = [{ x: 50 }];
            } else if (mevkiCount === 2) {
                positions = [{ x: 30 }, { x: 70 }];
            } else if (mevkiCount === 3) {
                positions = [{ x: 20 }, { x: 50 }, { x: 80 }];
            } else if (mevkiCount === 4) {
                positions = [{ x: 15 }, { x: 38 }, { x: 62 }, { x: 85 }];
            } else if (mevkiCount >= 5) {
                positions = [{ x: 10 }, { x: 30 }, { x: 50 }, { x: 70 }, { x: 90 }];
            }
            break;
            
        case 'ortaSaha':
            // Orta saha sayısına göre orantılı yerleştirme
            if (mevkiCount === 1) {
                positions = [{ x: 50 }];
            } else if (mevkiCount === 2) {
                positions = [{ x: 35 }, { x: 65 }];
            } else if (mevkiCount === 3) {
                positions = [{ x: 25 }, { x: 50 }, { x: 75 }];
            } else if (mevkiCount === 4) {
                positions = [{ x: 20 }, { x: 40 }, { x: 60 }, { x: 80 }];
            } else if (mevkiCount >= 5) {
                positions = [{ x: 15 }, { x: 32 }, { x: 50 }, { x: 68 }, { x: 85 }];
            }
            break;
            
        case 'forvet':
            // Forvet sayısına göre orantılı yerleştirme
            if (mevkiCount === 1) {
                positions = [{ x: 50 }];
            } else if (mevkiCount === 2) {
                positions = [{ x: 35 }, { x: 65 }];
            } else if (mevkiCount === 3) {
                positions = [{ x: 25 }, { x: 50 }, { x: 75 }];
            } else if (mevkiCount >= 4) {
                positions = [{ x: 20 }, { x: 40 }, { x: 60 }, { x: 80 }];
            }
            break;
            
        default:
            positions = [{ x: 50 }];
    }
    
    // Eğer pozisyon tanımlı değilse, dinamik olarak oluştur
    if (positions.length === 0 || mevkiCount > positions.length) {
        positions = [];
        for (let i = 0; i < mevkiCount; i++) {
            // Oyuncuları eşit aralıklarla dağıt (10% - 90% arası)
            const x = 10 + (80 / (mevkiCount - 1 || 1)) * i;
            positions.push({ x: mevkiCount === 1 ? 50 : x });
        }
    }
    
    // Index'e göre pozisyon seç
    const positionIndex = index % positions.length;
    let xPosition = positions[positionIndex].x;
    
    return { x: xPosition };
}

/**
 * Oyuncu elementine event listener'ları ekler
 * @param {HTMLElement} playerElement - Oyuncu DOM elementi
 * @param {Object} player - Oyuncu verisi
 */
function addPlayerEventListeners(playerElement, player) {
    const tooltip = document.getElementById('player-tooltip');
    
    // Mouse enter - tooltip göster
    playerElement.addEventListener('mouseenter', (e) => {
        showPlayerTooltip(e, player);
    });
    
    // Mouse leave - tooltip gizle
    playerElement.addEventListener('mouseleave', () => {
        hidePlayerTooltip();
    });
    
    // Click - oyuncu profiline git
    playerElement.addEventListener('click', () => {
        window.location.href = `oyuncu-profili.html?id=${player.id}`;
    });
}

/**
 * Oyuncu tooltip'ini gösterir
 * @param {Event} e - Mouse event
 * @param {Object} player - Oyuncu verisi
 */
function showPlayerTooltip(e, player) {
    const tooltip = document.getElementById('player-tooltip');
    if (!tooltip) return;
    
    // Oyuncu istatistiklerini hesapla
    const stats = calculatePlayerStatsForTooltip(player.id);
    
    // Tooltip içeriğini doldur
    document.getElementById('tooltip-name').textContent = player.name;
    document.getElementById('tooltip-position').textContent = `🏃‍♂️ ${player.mevki}`;
    document.getElementById('tooltip-stats').innerHTML = `
        <div>⚽ Goller: ${stats.goals}</div>
        <div>🎯 Maçlar: ${stats.matches}</div>
        <div>🏆 Kazanma: %${stats.winRate}</div>
    `;
    
    // Tooltip pozisyonunu ayarla - hangi sahada olduğunu bul
    const rect = e.target.getBoundingClientRect();
    const fieldRect = e.target.closest('.football-field').getBoundingClientRect();
    
    tooltip.style.left = (rect.left - fieldRect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - fieldRect.top - 10) + 'px';
    tooltip.classList.add('show');
}

/**
 * Oyuncu tooltip'ini gizler
 */
function hidePlayerTooltip() {
    const tooltip = document.getElementById('player-tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

/**
 * Tooltip için oyuncu istatistiklerini hesaplar
 * @param {string} playerId - Oyuncu ID'si
 * @returns {Object} - İstatistik verisi
 */
function calculatePlayerStatsForTooltip(playerId) {
    // Eğer matches varsa gerçek stats hesapla
    if (typeof matches !== 'undefined' && matches.length > 0) {
        let goals = 0;
        let matchCount = 0;
        let wins = 0;

        matches.forEach(match => {
            const performance = match.performances.find(p => p.playerId === playerId);
            if (performance) {
                goals += performance.goals || 0;
                matchCount++;
                
                // Kazanma durumunu kontrol et
                const isWinner = (performance.team === 'A' && match.teamAGoals > match.teamBGoals) ||
                                 (performance.team === 'B' && match.teamBGoals > match.teamAGoals);
                if (isWinner) wins++;
            }
        });

        return {
            goals: goals,
            matches: matchCount,
            winRate: matchCount > 0 ? Math.round((wins / matchCount) * 100) : 0
        };
    } else {
        // Demo veriler
        return {
            goals: Math.floor(Math.random() * 5),
            matches: Math.floor(Math.random() * 3) + 1,
            winRate: Math.floor(Math.random() * 61) + 20
        };
    }
}

// ==================== VIDEO BACKGROUND FONKSİYONLARI ====================

/**
 * Video arka plan kontrollerini başlatır
 */
function initVideoBackground() {
    const video = document.getElementById('bgVideo');
    
    if (!video) return;
    
    // Video ayarları
    video.volume = 0.3; // Kısık ses (%30)
    video.muted = false; // Ses açık
    
    // Video otomatik başlatma fonksiyonu
    function startVideo() {
        video.play().catch(function(error) {
            
            // Eğer sesli oynatma başarısızsa sessiz dene
            video.muted = true;
            return video.play().catch(function(muteError) {
                
            });
        });
    }
    
    // Video yüklenince otomatik başlat
    video.addEventListener('loadeddata', function() {
        startVideo();
    });
    
    // Video zaten yüklenmişse hemen başlat
    if (video.readyState >= 3) {
        startVideo();
    }
    
    // Kullanıcı etkileşimi sonrası ses açık video başlatma (mobil için)
    function enableAutoplayWithSound() {
        video.muted = false;
        video.volume = 0.3;
        
        if (video.paused) {
            startVideo();
        }
        
        // Event listener'ları kaldır (bir kez yeterli)
        document.removeEventListener('touchstart', enableAutoplayWithSound);
        document.removeEventListener('click', enableAutoplayWithSound);
    }
    
    // Mobil cihazlarda ilk dokunuş/tıklama sonrası ses açık video başlat
    document.addEventListener('touchstart', enableAutoplayWithSound, { once: true });
    document.addEventListener('click', enableAutoplayWithSound, { once: true });
}

// Sayfa yüklendiğinde video background'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    initVideoBackground();
});

// ============ SEZON YÖNETİM SİSTEMİ ============

// Geçerli sezonu hesaplayan fonksiyon
function getCurrentSeason() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() 0-indexed
    
    // Sezon 2: Ocak 2026'dan itibaren başladı
    // Her 3 ayda bir sezon değişiyor (Ocak, Nisan, Temmuz, Ekim)
    let seasonEndDate;
    let seasonName = 'Sezon 2';
    
    if (currentMonth >= 1 && currentMonth < 4) {
        // Ocak-Mart: 31 Mart'ta bitiyor
        seasonEndDate = new Date(currentYear, 2, 31); // 31 Mart
    } else if (currentMonth >= 4 && currentMonth < 7) {
        // Nisan-Haziran: 30 Haziran'da bitiyor
        seasonEndDate = new Date(currentYear, 5, 30); // 30 Haziran
    } else if (currentMonth >= 7 && currentMonth < 10) {
        // Temmuz-Eylül: 30 Eylül'de bitiyor
        seasonEndDate = new Date(currentYear, 8, 30); // 30 Eylül
    } else {
        // Ekim-Aralık: 31 Aralık'ta bitiyor
        seasonEndDate = new Date(currentYear, 11, 31); // 31 Aralık
    }
    
    return {
        currentSeason: { name: seasonName },
        seasonEndDate: seasonEndDate,
        isSeasonActive: currentDate < seasonEndDate
    };
}

// Sezon sonu tarihini formatla
function formatSeasonEndDate(date) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Sadece mevcut sezonun maçlarını filtreleyen fonksiyon
function getCurrentSeasonMatches() {
    // Şu an için basit bir yaklaşım: tüm maçlar mevcut sezonda
    // Gelecekte sezon geçişi yapıldığında bu fonksiyon güncellenecek
    return matches;
}

// Mevcut sezon için oyuncu istatistiklerini hesaplayan fonksiyon
function calculateCurrentSeasonPlayerStats() {
    const currentSeasonMatches = getCurrentSeasonMatches();
    const playerStats = {};

    // Her oyuncu için başlangıç istatistiklerini oluştur
    players.forEach(player => {
        playerStats[player.id] = {
            id: player.id,
            name: player.name,
            M: 0, // Maç
            W: 0, // Galibiyet
            D: 0, // Beraberlik
            L: 0, // Mağlubiyet
            GF: 0, // Attığı Gol
            GA: 0, // Yediği Gol
            GD: 0, // Gol Farkı
            PTS: 0, // Puan
            MVP: 0, // MVP Sayısı
            DONKEY: 0 // Haftanın Eşşeği Sayısı
        };
    });

    // Her maç için istatistikleri güncelle
    currentSeasonMatches.forEach(match => {
        const teamAResult = match.teamAGoals > match.teamBGoals ? 'W' : (match.teamAGoals === match.teamBGoals ? 'D' : 'L');
        const teamBResult = match.teamBGoals > match.teamAGoals ? 'W' : (match.teamBGoals === match.teamAGoals ? 'D' : 'L');

        match.performances.forEach(performance => {
            const stats = playerStats[performance.playerId];
            if (!stats) return; // Oyuncu bulunamazsa devam et

            stats.M++; // Oynadığı maç sayısını artır

            // Attığı gol ve asistleri ekle
            stats.GF += performance.goals;
        });

        // MVP sayısını güncelle - macin_adami kontrolü ile
        if (match.macin_adami && playerStats[match.macin_adami]) {
            playerStats[match.macin_adami].MVP++;
        }

        // Haftanın Eşşeği sayısını güncelle
        if (match.esek_adam && playerStats[match.esek_adam]) {
            playerStats[match.esek_adam].DONKEY++;
        }

        match.performances.forEach(performance => {
            const stats = playerStats[performance.playerId];
            if (!stats) return; // Oyuncu bulunamazsa devam et

            // Maç sonucuna göre galibiyet, beraberlik, mağlubiyet ve yediği golleri güncelle
            if (performance.team === 'A') {
                if (teamAResult === 'W') { stats.W++; stats.PTS += 3; }
                else if (teamAResult === 'D') { stats.D++; stats.PTS += 1; }
                else { stats.L++; }
                stats.GA += match.teamBGoals; // Rakip takımın attığı goller
            } else { // team === 'B'
                if (teamBResult === 'W') { stats.W++; stats.PTS += 3; }
                else if (teamBResult === 'D') { stats.D++; stats.PTS += 1; }
                else { stats.L++; }
                stats.GA += match.teamAGoals; // Rakip takımın attığı goller
            }
        });
    });

    // Gol farkını hesapla
    Object.values(playerStats).forEach(stats => {
        stats.GD = stats.GF - stats.GA;
    });

    // Puanlara göre sırala (önce Puan, sonra GD, sonra GF)
    const sortedPlayers = Object.values(playerStats).sort((a, b) => {
        if (b.PTS !== a.PTS) return b.PTS - a.PTS;
        if (b.GD !== a.GD) return b.GD - a.GD;
        return b.GF - a.GF;
    });

    // Sıra numarasını ekle
    sortedPlayers.forEach((player, index) => {
        player.P = index + 1;
    });

    return sortedPlayers;
}

// ==================== SEZON BAZLI PUAN DURUMU ====================

// Aktif puan durumu sezonu
let currentStandingsSeason = 2;

// Sezon 1 şampiyonu
const SEASON1_CHAMPION = 'ensar_bulbul';

// Sezon bazlı istatistik hesaplama
function calculateSeasonPlayerStats(season) {
    const playerStats = {};
    
    // Sezona göre maç verisini seç
    const matchData = season === 1 
        ? (typeof season1Matches !== 'undefined' ? season1Matches : [])
        : (typeof matches !== 'undefined' ? matches : []);
    
    matchData.forEach(match => {
        const teamAResult = match.teamAGoals > match.teamBGoals ? 'W' : (match.teamAGoals === match.teamBGoals ? 'D' : 'L');
        const teamBResult = match.teamBGoals > match.teamAGoals ? 'W' : (match.teamBGoals === match.teamAGoals ? 'D' : 'L');
        
        match.performances.forEach(perf => {
            const player = players.find(p => p.id === perf.playerId);
            const playerName = player ? player.name : perf.playerId;
            
            if (!playerStats[playerName]) {
                playerStats[playerName] = { 
                    name: playerName, 
                    id: perf.playerId,
                    M: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, 
                    PTS: 0, MVP: 0, DONKEY: 0 
                };
            }
            
            const stats = playerStats[playerName];
            stats.M++;
            stats.GF += perf.goals || 0;
            
            // MVP sayısı - macin_adami alanından kontrol
            if (match.macin_adami === perf.playerId) {
                stats.MVP++;
            }
            
            // Eşşek sayısı - esek_adam alanından kontrol
            if (match.esek_adam === perf.playerId) {
                stats.DONKEY++;
            }
            
            // Takım sonucuna göre puan
            if (perf.team === 'A') {
                if (teamAResult === 'W') { stats.W++; stats.PTS += 3; }
                else if (teamAResult === 'D') { stats.D++; stats.PTS += 1; }
                else { stats.L++; }
                stats.GA += match.teamBGoals;
            } else {
                if (teamBResult === 'W') { stats.W++; stats.PTS += 3; }
                else if (teamBResult === 'D') { stats.D++; stats.PTS += 1; }
                else { stats.L++; }
                stats.GA += match.teamAGoals;
            }
        });
    });

    // Gol farkı ve sıralama
    Object.values(playerStats).forEach(stats => {
        stats.GD = stats.GF - stats.GA;
    });

    const sortedPlayers = Object.values(playerStats).sort((a, b) => {
        if (b.PTS !== a.PTS) return b.PTS - a.PTS;
        if (b.GD !== a.GD) return b.GD - a.GD;
        return b.GF - a.GF;
    });

    sortedPlayers.forEach((player, index) => {
        player.P = index + 1;
    });

    return sortedPlayers;
}

// Sezon değiştirme fonksiyonu (Puan Durumu)
function changeStandingsSeason(season) {
    currentStandingsSeason = season;
    
    // Buton aktiflik durumunu güncelle
    document.querySelectorAll('.standings-season-selector .season-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.standings-season-selector [data-season="${season}"]`)?.classList.add('active');
    
    // Sezon bilgilerini güncelle
    const seasonTitle = document.getElementById('current-season-title');
    const seasonEndInfo = document.getElementById('season-end-info');
    const championBanner = document.getElementById('champion-banner');
    
    if (season === 1) {
        if (seasonTitle) seasonTitle.textContent = 'Sezon 1 (Tamamlandı)';
        if (seasonEndInfo) seasonEndInfo.textContent = '22.10.2025 - 18.12.2025';
        if (championBanner) championBanner.style.display = 'block';
    } else {
        if (seasonTitle) seasonTitle.textContent = 'Sezon 2';
        if (seasonEndInfo) seasonEndInfo.textContent = 'Sezon 2 Mart 2026\'da bitecektir';
        if (championBanner) championBanner.style.display = 'block';
    }
    
    // Tabloyu güncelle
    renderSeasonScoreboard(season);
}

// Sezon bazlı puan durumu tablosu
function renderSeasonScoreboard(season) {
    const scoreboardBody = document.getElementById('player-scoreboard')?.querySelector('tbody');
    if (!scoreboardBody) return;

    const sortedPlayers = calculateSeasonPlayerStats(season);
    scoreboardBody.innerHTML = '';

    sortedPlayers.forEach((player, index) => {
        const playerId = player.id || player.name.toLowerCase().replace(/\s+/g, '_');
        const playerPower = calculatePlayerPowerGlobal(playerId);
        const powerClass = getPowerClass(playerPower);
        
        // Şampiyon kontrolü (sadece 1. sezon için)
        const isChampion = season === 1 && playerId === SEASON1_CHAMPION;
        
        // Rank class'ını belirle
        let rankClass = '';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';
        
        // Şampiyon için extra class
        if (isChampion) rankClass += ' season-champion';
        
        const championBadge = isChampion ? '<span class="champion-badge">🏆</span>' : '';
        
        const row = `
            <tr class="${rankClass}">
                <td>${player.P}</td>
                <td class="player-name-cell">
                    <img src="img/oyuncular/${playerId}.jpg" alt="${player.name}" class="player-avatar" onerror="this.src='img/oyuncular/default.svg'">
                    <span class="player-name">
                        <a href="oyuncu-profili.html?id=${playerId}" class="player-link">${player.name}</a>
                        ${championBadge}
                    </span>
                </td>
                <td class="power-cell ${powerClass}">
                    <strong>${playerPower}</strong>
                </td>
                <td>${player.M}</td>
                <td>${player.W}</td>
                <td>${player.D}</td>
                <td>${player.L}</td>
                <td>${player.GF}</td>
                <td class="avg-goals-cell">${player.M > 0 ? (player.GF / player.M).toFixed(1) : '0.0'}</td>
                <td class="mvp-cell">${player.MVP}</td>
                <td class="donkey-cell">${player.DONKEY}</td>
                <td class="points-cell"><strong>${player.PTS}</strong></td>
            </tr>
        `;
        scoreboardBody.insertAdjacentHTML('beforeend', row);
    });
}

// Puan durumu sezon butonlarını başlat
function initStandingsSeasonButtons() {
    const season1Btn = document.getElementById('standings-season1-btn');
    const season2Btn = document.getElementById('standings-season2-btn');
    
    if (season1Btn) {
        season1Btn.addEventListener('click', () => changeStandingsSeason(1));
    }
    if (season2Btn) {
        season2Btn.addEventListener('click', () => changeStandingsSeason(2));
    }
}

// Export
window.changeStandingsSeason = changeStandingsSeason;
window.renderSeasonScoreboard = renderSeasonScoreboard;
window.initStandingsSeasonButtons = initStandingsSeasonButtons;
