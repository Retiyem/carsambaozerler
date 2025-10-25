// Yardımcı fonksiyon: Oyuncu ID'sine göre oyuncu adını bulur
function getPlayerNameById(playerId) {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Bilinmeyen Oyuncu';
}

// Tüm oyuncuların istatistiklerini hesaplayan fonksiyon
function calculatePlayerStats() {
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
            MVP: 0 // MVP Sayısı (isteğe bağlı)
        };
    });

    // Her maç için istatistikleri güncelle
    matches.forEach(match => {
        const teamAResult = match.teamAGoals > match.teamBGoals ? 'W' : (match.teamAGoals === match.teamBGoals ? 'D' : 'L');
        const teamBResult = match.teamBGoals > match.teamAGoals ? 'W' : (match.teamBGoals === match.teamAGoals ? 'D' : 'L');

        match.performances.forEach(performance => {
            const stats = playerStats[performance.playerId];
            if (!stats) return; // Oyuncu bulunamazsa devam et

            stats.M++; // Oynadığı maç sayısını artır

            // Attığı gol ve asistleri ekle
            stats.GF += performance.goals;
            // stats.Assists += performance.assists; // Asist istatistiği eklemek istersen

            // MVP sayısını güncelle
            if (performance.mvp) {
                stats.MVP++;
            }

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

// Puan durumu tablosunu HTML'e yerleştirir
function renderScoreboard() {
    const scoreboardBody = document.getElementById('player-scoreboard')?.querySelector('tbody');
    if (!scoreboardBody) return;

    const sortedPlayers = calculatePlayerStats();
    scoreboardBody.innerHTML = ''; // Mevcut içeriği temizle

    sortedPlayers.forEach((player, index) => {
        // Oyuncu ID'sini bul
        const playerData = players.find(p => p.name === player.name);
        const playerId = playerData ? playerData.id : player.name.toLowerCase().replace(/\s+/g, '_');
        
        // Rank class'ını belirle
        let rankClass = '';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';
        
        const row = `
            <tr class="${rankClass}">
                <td>${player.P}</td>
                <td class="player-name-cell">
                    <img src="img/oyuncular/${playerId}.jpg" alt="${player.name}" class="player-avatar" onerror="this.src='img/oyuncular/default.svg'">
                    <span class="player-name">
                        <a href="oyuncu-profili.html?id=${playerId}" class="player-link">${player.name}</a>
                    </span>
                </td>
                <td>${player.M}</td>
                <td>${player.W}</td>
                <td>${player.D}</td>
                <td>${player.L}</td>
                <td>${player.GF}</td>
                <td>${player.PTS}</td>
            </tr>
        `;
        scoreboardBody.insertAdjacentHTML('beforeend', row);
    });
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

        // MVP bilgisini de ekleyelim (isteğe bağlı)
        const mvpPlayer = match.performances.find(p => p.mvp);
        const mvpText = mvpPlayer ? `(${getPlayerNameById(mvpPlayer.playerId)} MVP)` : '';

        const row = `
            <tr data-match-id="${match.id}">
                <td>${match.date}</td>
                <td>${match.teamAGoals}</td>
                <td>${match.teamBGoals}</td>
                <td>${match.teamAGoals} - ${match.teamBGoals}</td>
                <td>${winnerText} ${mvpText}</td>
                <td>
                    <button class="match-detail-btn" onclick="toggleMatchDetail(${match.id})" data-match-id="${match.id}">
                        📋 Detay
                    </button>
                </td>
            </tr>
            <tr id="detail-${match.id}" class="match-detail-row" style="display: none;">
                <td colspan="6">
                    <div class="match-detail-panel">
                        <!-- Buraya maç detayları gelecek -->
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
            return;
        }

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

// Global fonksiyonları window objesine ekle
window.toggleMatchDetail = toggleMatchDetail;

// Maç detayını aç/kapat
function toggleMatchDetail(matchId) {
    const detailRow = document.getElementById(`detail-${matchId}`);
    const button = document.querySelector(`[data-match-id="${matchId}"].match-detail-btn`);
    
    if (!detailRow) return;
    
    if (detailRow.style.display === 'none') {
        // Önce diğer tüm detay panellerini kapat
        document.querySelectorAll('.match-detail-row').forEach(row => {
            row.style.display = 'none';
        });
        document.querySelectorAll('.match-detail-btn').forEach(btn => {
            btn.textContent = '📋 Detay';
        });
        
        // Bu detay panelini aç
        detailRow.style.display = 'table-row';
        button.textContent = '📤 Kapat';
        
        // Detay içeriğini doldur
        populateMatchDetail(matchId);
    } else {
        // Bu detay panelini kapat
        detailRow.style.display = 'none';
        button.textContent = '📋 Detay';
    }
}

// Maç detayını doldur
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
        
        teamAHtml += `
            <li>${playerName}${goalText}${mvpBadge}</li>
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
        
        teamBHtml += `
            <li>${playerName}${goalText}${mvpBadge}</li>
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
        // Maç click eventleri için
        addMatchClickEvents();
    } else if (path.includes('maclar.html')) {
        renderMatchResults();
        // Maç click eventleri için
        addMatchClickEvents();
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
    
    // Gelişmiş UI özelliklerini başlat
    if (typeof initializePageTransitions === 'function') {
        // UI geliştirmeleri script'i yüklenmişse
        setTimeout(() => {
            initializePageTransitions();
            initializeSwipeNavigation();
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

    // Debug: fotoğraf yolunu konsola yazdır
    console.log('Fotoğraf yolu:', `img/oyuncular/${latestMatch.macin_adami}.jpg`);

    weeklyHeroContainer.innerHTML = `
        <div class="hero-profile">
            <div class="hero-avatar">
                <img src="img/oyuncular/${latestMatch.macin_adami}.jpg" alt="${mvpPlayer.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hero-avatar-placeholder" style="display: none;">${mvpPlayer.name.charAt(0)}</div>
            </div>
            <div class="hero-info">
                <h4>${mvpPlayer.name}</h4>
                <div class="hero-stats-list">
                    <p class="hero-stat-item">📈 <strong>${mvpPlayer.name}</strong> Bu Hafta <strong>${mvpGoals}</strong> Gol Attı!</p>
                    <p class="hero-stat-item">⚽ Maç başına ortalama <strong>${averageGoals}</strong> kadar golü var!</p>
                    <p class="hero-stat-item">🏆 <strong>${weeklyMVPCount}</strong> kere Haftanın adamı seçildi!</p>
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

    // Haftanın eşşeğini göster (sadece fotoğraf ve isim)
    weeklyDonkeyContainer.innerHTML = `
        <div class="donkey-profile">
            <div class="donkey-avatar">
                <img src="img/oyuncular/${latestMatch.esek_adam}.jpg" alt="${donkeyPlayer.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="donkey-avatar-placeholder" style="display: none;">${donkeyPlayer.name.charAt(0)}</div>
            </div>
            <div class="donkey-info">
                <h4>${donkeyPlayer.name}</h4>
            </div>
        </div>
    `;
}

// Hamburger Menü Fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
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