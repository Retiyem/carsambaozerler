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
            MVP: 0, // MVP Sayısı
            DONKEY: 0 // Haftanın Eşşeği Sayısı
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
            if (performance.weeklyMVP) {
                stats.MVP++;
            }
        });

        // Haftanın Eşşeği sayısını güncelle (macin_adami ve esek_adam data.js'deki matches array'inde)
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
                <td class="avg-goals-cell">${player.M > 0 ? (player.GF / player.M).toFixed(1) : '0.0'}</td>
                <td class="mvp-cell">${player.MVP}</td>
                <td class="donkey-cell">${player.DONKEY}</td>
                <td class="points-cell"><strong>${player.PTS}</strong></td>
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

        const row = `
            <tr data-match-id="${match.id}">
                <td>${match.date}</td>
                <td>${match.teamAGoals}</td>
                <td>${match.teamBGoals}</td>
                <td>${match.teamAGoals} - ${match.teamBGoals}</td>
                <td>${winnerText}</td>
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

// Global fonksiyonları window objesine ekle - MODAL ÖZELLİĞİ KALDIRILDI
// window.toggleMatchDetail = toggleMatchDetail;

// Maç detayını aç/kapat
// MATCH DETAIL FONKSİYONLARI KALDIRILDI - MODAL ÖZELLİĞİ DEVREDİŞI

/*
function toggleMatchDetail(matchId) {
    // Bu fonksiyon artık kullanılmıyor - modal özelliği kaldırıldı
}

function populateMatchDetail(matchId) {
    // Bu fonksiyon artık kullanılmıyor - modal özelliği kaldırıldı
}
*/

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
    
    // Sıradaki maç kadrosunu göster
    displayLineup();
    
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

    // weeklyHeroes verisinden bu hafta için not al
    const currentWeek = matches.length; // Hafta numarası
    const weeklyHeroData = weeklyHeroes.find(hero => hero.week === currentWeek);
    const heroNote = weeklyHeroData ? weeklyHeroData.note : '';

    // Debug: fotoğraf yolunu konsola yazdır
    console.log('Fotoğraf yolu:', `img/oyuncular/${latestMatch.macin_adami}.jpg`);

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
                    ${heroNote ? `<p class="hero-note">💬 ${heroNote}</p>` : ''}
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
        <div class="donkey-profile" onclick="window.location.href='oyuncu-profili.html?id=${latestMatch.esek_adam}'" style="cursor: pointer;">
            <div class="donkey-avatar">
                <img src="img/oyuncular/${latestMatch.esek_adam}.jpg" alt="${donkeyPlayer.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="donkey-avatar-placeholder" style="display: none;">${donkeyPlayer.name.charAt(0)}</div>
            </div>
            <div class="donkey-info">
                <h4>${donkeyPlayer.name}</h4>
                <p class="donkey-comment">🫏 Orhan eşşeğinin yokluğunu aratmadı! kritik anlarda ağlayarak herkesin oyun hevesine sıçtı... 🫏</p>
            </div>
        </div>
    `;
}

// Hamburger Menü Fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
    // Ana sayfa özet bilgilerini göster - önce verilerin yüklendiğinden emin ol
    setTimeout(() => {
        renderHomePageSummary();
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

// ==================== SIRADAKI MAÇ KADROSU FONKSİYONLARI ====================

// Kadro verisi - Kullanıcının belirttiği kadro (düzeltilmiş)
const nextMatchLineup = {
    teamA: [
        'onur_mustafa',      // 1 - Onur
        'ozan_necipoglu',    // 2 - Ozan
        'fatih_atalay',      // 3 - Fatih
        'ensar_bulbul',      // 4 - Ensar
        'ahmet_sadıkoglu',   // 5 - Ahmet
        'ibrahim_erdogdu',   // 6 - İbrahim
        'burak_kocabey',     // 7 - Burak
        'furkan_sevimli'     // 8 - Furkan Sevimli
    ],
    teamB: [
        'tayyip_erdogan_yilmaz', // 1 - Erdoğan
        'huseyincan_yuksekdag',  // 2 - Hüseyin Can
        'talha_bulbul',          // 3 - Talha
        'firatcan_solmaz',       // 4 - Fırat
        'furkan_yilmaz',         // 5 - Furkan Yılmaz
        'ridvan_gumus',          // 6 - Rıdvan
        'emre_erdal',            // 7 - Emre
        'seyfeddin_bulbul'       // 8 - Seyfeddin
    ]
};

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

    // Otomatik diziliş oluştur
    const groupedPlayers = groupPlayersByPosition(teamPlayers);
    
    // Her mevki için oyuncuları yerleştir
    Object.keys(groupedPlayers).forEach(mevki => {
        groupedPlayers[mevki].forEach((player, index) => {
            const playerElement = createPlayerElement(player, team, mevki, index);
            container.appendChild(playerElement);
        });
    });
}

/**
 * Oyuncuları gerçek mevkilerine göre otomatik gruplar
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

    return grouped;
}

/**
 * Oyuncu elementi oluşturur
 * @param {Object} player - Oyuncu verisi
 * @param {string} team - Takım ('A' veya 'B')
 * @param {string} mevki - Oyuncunun sahada oynayacağı mevki
 * @param {number} index - Mevkideki sıra numarası
 * @returns {HTMLElement} - Oyuncu DOM elementi
 */
function createPlayerElement(player, team, mevki, index) {
    const playerDiv = document.createElement('div');
    playerDiv.className = `player ${getMevkiClass(mevki)}`;
    
    // Oyuncu adını kısalt - sadece ilk isim veya soyadı
    let displayName = player.name.split(' ')[0];
    if (displayName.length > 8) {
        displayName = displayName.substring(0, 7) + '.';
    }
    
    playerDiv.textContent = displayName;
    playerDiv.dataset.playerId = player.id;
    playerDiv.dataset.team = team;
    playerDiv.title = player.name; // Tam isim tooltip olarak
    
    // Oyuncuyu pozisyonuna göre yerleştir - translateX ile merkezle
    const position = calculatePlayerPosition(mevki, index, team);
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
function calculatePlayerPosition(mevki, index, team) {
    let positions = [];
    
    // Takımdaki mevki dağılımını hesapla
    const teamPlayerIds = nextMatchLineup[`team${team}`];
    const teamPlayers = teamPlayerIds.map(id => players.find(p => p.id === id)).filter(p => p);
    
    const kaleciler = teamPlayers.filter(p => p.mevki.toLowerCase().includes('kaleci'));
    const defanslar = teamPlayers.filter(p => p.mevki.toLowerCase().includes('defans'));
    const ortaSahalar = teamPlayers.filter(p => p.mevki.toLowerCase().includes('orta'));
    const forvetler = teamPlayers.filter(p => p.mevki.toLowerCase().includes('forvet'));
    
    switch(mevki) {
        case 'kaleci':
            // Kaleci her zaman ortada
            positions = [{ x: 50 }];
            break;
            
        case 'defans':
            // Defans sayısına göre orta saha noktası referanslı yerleştirme
            const defansCount = defanslar.length;
            if (defansCount === 1) {
                positions = [{ x: 50 }];
            } else if (defansCount === 2) {
                positions = [{ x: 30 }, { x: 70 }];
            } else if (defansCount === 3) {
                positions = [{ x: 20 }, { x: 50 }, { x: 80 }];
            } else if (defansCount === 4) {
                positions = [{ x: 15 }, { x: 38 }, { x: 62 }, { x: 85 }];
            } else if (defansCount >= 5) {
                positions = [{ x: 10 }, { x: 30 }, { x: 50 }, { x: 70 }, { x: 90 }];
            }
            break;
            
        case 'ortaSaha':
            // Orta saha sayısına göre orta saha noktası referanslı yerleştirme
            const ortaSahaCount = ortaSahalar.length;
            if (ortaSahaCount === 1) {
                positions = [{ x: 50 }];
            } else if (ortaSahaCount === 2) {
                positions = [{ x: 35 }, { x: 65 }];
            } else if (ortaSahaCount === 3) {
                positions = [{ x: 25 }, { x: 50 }, { x: 75 }];
            } else if (ortaSahaCount === 4) {
                positions = [{ x: 20 }, { x: 40 }, { x: 60 }, { x: 80 }];
            } else if (ortaSahaCount >= 5) {
                positions = [{ x: 15 }, { x: 32 }, { x: 50 }, { x: 68 }, { x: 85 }];
            }
            break;
            
        case 'forvet':
            // Forvet sayısına göre orta saha noktası referanslı yerleştirme
            const forvetCount = forvetler.length;
            if (forvetCount === 1) {
                positions = [{ x: 50 }];
            } else if (forvetCount === 2) {
                positions = [{ x: 35 }, { x: 65 }];
            } else if (forvetCount === 3) {
                positions = [{ x: 25 }, { x: 50 }, { x: 75 }];
            } else if (forvetCount >= 4) {
                positions = [{ x: 20 }, { x: 40 }, { x: 60 }, { x: 80 }];
            }
            break;
            
        default:
            positions = [{ x: 50 }];
    }
    
    // Index'e göre pozisyon seç, fazla oyuncu varsa yayıl
    const positionIndex = index % positions.length;
    let xPosition = positions[positionIndex].x;
    
    // Eğer aynı mevkide çok fazla oyuncu varsa hafif kaydır
    if (index >= positions.length) {
        const extraOffset = Math.floor(index / positions.length) * 6;
        xPosition = Math.max(5, Math.min(95, xPosition + (extraOffset * (index % 2 === 0 ? 1 : -1))));
    }
    
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
            console.log('Sesli oynatma başarısız, sessiz deneniyor:', error);
            // Eğer sesli oynatma başarısızsa sessiz dene
            video.muted = true;
            return video.play().catch(function(muteError) {
                console.log('Video oynatma tamamen başarısız:', muteError);
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