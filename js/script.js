// js/script.js

// Yardımcı fonksiyon: Oyuncu ID'sine göre oyuncu objesini bulur
function getPlayerById(playerId) {
    return players.find(p => p.id === playerId);
}

// Tüm oyuncuların istatistiklerini hesaplayan fonksiyon
function calculatePlayerStats() {
    const playerStats = {};

    // Her oyuncu için başlangıç istatistiklerini oluştur
    players.forEach(player => {
        playerStats[player.id] = {
            id: player.id,
            name: player.name,
            photo: player.photo, // YENİ: Oyuncu fotoğrafını ekle
            M: 0, // Maç
            W: 0, // Galibiyet
            D: 0, // Beraberlik
            L: 0, // Mağlubiyet
            GF: 0, // Attığı Gol
            GA: 0, // Yediği Gol
            GD: 0, // Gol Farkı
            PTS: 0, // Puan
            Assists: 0, // YENİ: Asist sayısı
            MVP_Count: 0 // YENİ: MVP Sayısı
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
            stats.Assists += performance.assists; // Asist istatistiği

            // MVP sayısını güncelle (artık mvpPoints > 8 olanları MVP sayabiliriz veya özel bir mvp bayrağı tutabiliriz)
            // data.js'deki mvpPoints'i MVP sayısına dönüştürelim.
            if (performance.mvpPoints >= 9) { // Örneğin 9 ve üzeri MVP sayılabilir
                stats.MVP_Count++;
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
            <tr class="${player.P === 1 ? 'rank-1' : (player.P === 2 ? 'rank-2' : (player.P === 3 ? 'rank-3' : ''))}">
                <td>${player.P}</td>
                <td><img src="${player.photo || 'img/players/default.jpg'}" alt="${player.name}" class="player-photo-small"></td> <!-- YENİ: Fotoğraf -->
                <td><a href="oyuncu-detay.html?id=${player.id}">${player.name}</a></td> <!-- YENİ: Detay sayfasına link -->
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
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateB - dateA;
    });

    sortedMatches.forEach(match => {
        let teamANames = match.teamA.map(id => getPlayerById(id)?.name || id).join(', ');
        let teamBNames = match.teamB.map(id => getPlayerById(id)?.name || id).join(', ');

        let winnerText = 'Berabere';
        if (match.teamAGoals > match.teamBGoals) {
            winnerText = `Takım A (${teamANames.split(', ').slice(0, 3).join(', ')}...) Kazandı`; // İlk 3 oyuncuyu göster
        } else if (match.teamBGoals > match.teamAGoals) {
            winnerText = `Takım B (${teamBNames.split(', ').slice(0, 3).join(', ')}...) Kazandı`; // İlk 3 oyuncuyu göster
        }

        // MVP bilgisini de ekleyelim (mvpPoints'i en yüksek olanı MVP sayabiliriz)
        let mvpPlayer = null;
        let maxMvpPoints = -1;
        match.performances.forEach(p => {
            if (p.mvpPoints > maxMvpPoints) {
                maxMvpPoints = p.mvpPoints;
                mvpPlayer = getPlayerById(p.playerId);
            }
        });
        const mvpText = mvpPlayer ? `<br><strong>Maçın Yıldızı:</strong> <a href="oyuncu-detay.html?id=${mvpPlayer.id}">${mvpPlayer.name}</a>` : '';

        const row = `
            <tr>
                <td>${match.date}</td>
                <td>${teamANames}</td> <!-- YENİ: Oyuncu isimleri -->
                <td>${teamBNames}</td> <!-- YENİ: Oyuncu isimleri -->
                <td>${match.teamAGoals} - ${match.teamBGoals}</td>
                <td>${winnerText}${mvpText}</td>
            </tr>
        `;
        matchTableBody.insertAdjacentHTML('beforeend', row);
    });
}

// YENİ FONKSİYON: Oyuncu Detay Sayfasını render eder
function renderPlayerDetail() {
    const playerDetailContent = document.getElementById('player-detail-content');
    if (!playerDetailContent) return;

    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id');

    if (!playerId) {
        playerDetailContent.innerHTML = '<p>Oyuncu bulunamadı.</p>';
        return;
    }

    const player = getPlayerById(playerId);
    if (!player) {
        playerDetailContent.innerHTML = '<p>Oyuncu bulunamadı.</p>';
        return;
    }

    // Oyuncunun genel istatistiklerini al
    const playerStats = calculatePlayerStats().find(s => s.id === playerId);
    
    // YENİ: Oyuncunun maç performanslarından asist toplamını da alalım
    let totalAssists = 0;
    matches.forEach(match => {
        const performance = match.performances.find(p => p.playerId === playerId);
        if (performance) {
            totalAssists += performance.assists || 0;
        }
    });

    playerDetailContent.innerHTML = `
        <img src="${player.photo || 'img/players/default.jpg'}" alt="${player.name}" class="player-detail-photo">
        <h3 class="player-detail-name">${player.name}</h3>
        <p class="player-detail-info"><strong>Pozisyon:</strong> ${player.details.position || 'Bilinmiyor'} | <strong>Doğum Tarihi:</strong> ${player.details.birthDate || 'Bilinmiyor'}</p>
        <p class="player-detail-info"><strong>Forma No:</strong> ${player.details.jerseyNumber || '-'} | <strong>Favori Ayak:</strong> ${player.details.favoriteFoot || '-'}</p>
        <p class="player-detail-bio">${player.details.bio || 'Oyuncu hakkında bilgi bulunmamaktadır.'}</p>

        <h3 class="section-title" style="margin-top: 40px;">Genel İstatistikler</h3>
        <div class="player-stats-grid">
            <div class="stat-item"><h4>Oynanan Maç</h4><p>${playerStats?.M || 0}</p></div>
            <div class="stat-item"><h4>Attığı Gol</h4><p>${playerStats?.GF || 0}</p></div>
            <div class="stat-item"><h4>Asist</h4><p>${totalAssists || 0}</p></div>
            <div class="stat-item"><h4>Galibiyet</h4><p>${playerStats?.W || 0}</p></div>
            <div class="stat-item"><h4>Beraberlik</h4><p>${playerStats?.D || 0}</p></div>
            <div class="stat-item"><h4>Mağlubiyet</h4><p>${playerStats?.L || 0}</p></div>
            <div class="stat-item"><h4>Gol Farkı</h4><p>${playerStats?.GD || 0}</p></div>
            <div class="stat-item"><h4>Puan</h4><p>${playerStats?.PTS || 0}</p></div>
            <div class="stat-item"><h4>Maçın Yıldızı (MVP)</h4><p>${playerStats?.MVP_Count || 0}</p></div>
        </div>
    `;
}

// YENİ FONKSİYON: Haftanın En İyileri sıralamasını hesaplar
function calculateBestPerformers() {
    const performerScores = {};

    players.forEach(player => {
        performerScores[player.id] = {
            id: player.id,
            name: player.name,
            photo: player.photo,
            mvpPoints: 0,
            forwardPoints: 0,
            defensePoints: 0,
            goalQualityPoints: 0,
            saveQualityPoints: 0,
            worstPerformancePoints: 0 // Yüksek puan kötü performans
        };
    });

    matches.forEach(match => {
        match.performances.forEach(performance => {
            const scores = performerScores[performance.playerId];
            if (!scores) return;

            scores.mvpPoints += performance.mvpPoints || 0;
            scores.forwardPoints += performance.forwardPoints || 0;
            scores.defensePoints += performance.defensePoints || 0;
            scores.goalQualityPoints += performance.goalQualityPoints || 
