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

    sortedPlayers.forEach(player => {
        const row = `
            <tr>
                <td>${player.P}</td>
                <td>${player.name}</td>
                <td>${player.M}</td>
                <td>${player.W}</td>
                <td>${player.D}</td>
                <td>${player.L}</td>
                <td>${player.GF}</td>
                <td>${player.GA}</td>
                <td>${player.GD}</td>
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
            <tr>
                <td>${match.date}</td>
                <td>${match.teamAGoals}</td>
                <td>${match.teamBGoals}</td>
                <td>${match.teamAGoals} - ${match.teamBGoals}</td>
                <td>${winnerText} ${mvpText}</td>
            </tr>
        `;
        matchTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Ana sayfadaki özet bilgileri gösterir
function renderHomePageSummary() {
    const latestMatchSummaryDiv = document.getElementById('latest-match-summary');
    const topScorersSummaryDiv = document.getElementById('top-scorers-summary');

    if (latestMatchSummaryDiv) {
        // En son maçı bul
        const latestMatch = [...matches].sort((a, b) => {
            const dateA = new Date(a.date.split('.').reverse().join('-'));
            const dateB = new Date(b.date.split('.').reverse().join('-'));
            return dateB - dateA;
        })[0];

        if (latestMatch) {
            const teamAResult = latestMatch.teamAGoals > latestMatch.teamBGoals ? 'W' : (latestMatch.teamAGoals === latestMatch.teamBGoals ? 'D' : 'L');
            
            let resultStatusText = 'Berabere';
            if (teamAResult === 'W') resultStatusText = 'Takım A Kazandı';
            else if (teamAResult === 'L') resultStatusText = 'Takım B Kazandı';

            const mvpPlayer = latestMatch.performances.find(p => p.mvp);
            const mvpText = mvpPlayer ? `<p><strong>MVP:</strong> ${getPlayerNameById(mvpPlayer.playerId)}</p>` : '';

            latestMatchSummaryDiv.innerHTML = `
                <p><strong>Tarih:</strong> ${latestMatch.date}</p>
                <p><strong>Skor:</strong> ${latestMatch.teamAGoals} - ${latestMatch.teamBGoals}</p>
                <p><strong>Sonuç:</strong> ${resultStatusText}</p>
                ${mvpText}
            `;
        } else {
            latestMatchSummaryDiv.innerHTML = '<p>Henüz maç oynanmadı.</p>';
        }
    }

    if (topScorersSummaryDiv) {
        const sortedPlayers = calculatePlayerStats();
        // Sadece golleri olan oyuncuları al ve sırala
        const top3Scorers = sortedPlayers.filter(player => player.GF > 0).sort((a, b) => b.GF - a.GF).slice(0, 3); 

        if (top3Scorers.length > 0) {
            let html = '<ul class="top-players-list">';
            top3Scorers.forEach(player => {
                html += `<li><strong>${player.name}</strong> - ${player.GF} Gol</li>`;
            });
            html += '</ul>';
            topScorersSummaryDiv.innerHTML = html;
        } else {
            topScorersSummaryDiv.innerHTML = '<p>Henüz gol atan oyuncu yok.</p>';
        }
    }
}


// Sayfa yüklendiğinde ilgili fonksiyonları çağır
document.addEventListener('DOMContentLoaded', () => {
    // Hangi sayfada olduğumuza göre farklı fonksiyonları çalıştırabiliriz
    const path = window.location.pathname;

    if (path.includes('puan-durumu.html')) {
        renderScoreboard();
    } else if (path.includes('maclar.html')) {
        renderMatchResults();
    } else if (path.includes('index.html') || path === '/') { // Ana sayfa veya kök dizin
        renderHomePageSummary();
    }
    // Animasyonları başlatmak için
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        el.style.opacity = 1; // opacity'i 1 yaparak animasyonu tetikle
    });
});