/**
 * Oyuncunun puan tablosundaki sıralamasını hesapla
 */
function calculatePlayerRanking(playerId) {
    if (typeof calculatePlayerStats !== 'function') {

        return 5; // Varsayılan orta sıralama
    }
    
    const sortedPlayers = calculatePlayerStats();
    const playerIndex = sortedPlayers.findIndex(player => player.id === playerId);
    
    return playerIndex !== -1 ? playerIndex + 1 : sortedPlayers.length; // 1-based index
}

/**
 * Oyuncunun takım başarı oranını hesapla
 */
function calculateTeamSuccessRate(playerMatches, playerId) {
    if (!playerMatches || playerMatches.length === 0) return 0;
    
    let successfulMatches = 0;
    
    playerMatches.forEach(match => {
        // Galibiyet = tam başarı, beraberlik = yarı başarı
        if (match.result === 'Galibiyet') {
            successfulMatches += 1;
        } else if (match.result === 'Beraberlik') {
            successfulMatches += 0.5;
        }
    });
    
    return Math.min((successfulMatches / playerMatches.length) * 100, 100);
}

/* 
 * OYUNCU PROFİL PERFORMANS - JavaScript Modülü
 * Oyuncu profil sayfalarında performans grafikleri
 */

// Global değişkenler
let playerPerformanceChart = null;
let playerRadarChart = null;

// Oyuncu profil performansını başlat
function initializePlayerPerformance(playerId) {
    // Verilerin hazır olup olmadığını kontrol et
    if (!playerId) {
        return;
    }
    
    if (typeof matches === 'undefined' || !matches || matches.length === 0) {
        setTimeout(() => initializePlayerPerformance(playerId), 1000);
        return;
    }
    
    if (typeof players === 'undefined' || !players || players.length === 0) {
        setTimeout(() => initializePlayerPerformance(playerId), 1000);
        return;
    }

    // Chart.js kontrolü
    if (typeof Chart === 'undefined' && typeof window.Chart === 'undefined') {
        showNoPerformanceData();
        return;
    }

    // Chart referansını ayarla
    const ChartJS = Chart || window.Chart;

    // Chart.js global ayarları
    if (ChartJS && ChartJS.defaults) {
        ChartJS.defaults.color = '#e0e0e0';
        ChartJS.defaults.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        ChartJS.defaults.font.family = 'Montserrat, sans-serif';
    }

    // Performans verilerini hesapla
    const performanceData = calculatePlayerPerformanceData(playerId);
    
    if (performanceData && performanceData.matches.length > 0) {
        
        showPlayerPerformance(performanceData);
        createPlayerPerformanceChart(performanceData);
        createPlayerRadarChart(performanceData);
        updateRecentMatchesTable(performanceData);
    } else {
        
        hidePlayerPerformance();
    }
}

/**
 * Oyuncu performans verilerini hesapla
 */
function calculatePlayerPerformanceData(playerId) {
    
    
    const player = players.find(p => p.id === playerId);
    if (!player) {
        console.error(`❌ Oyuncu bulunamadı: ${playerId}`);
                return null;
    }

    

    const playerMatches = [];
    let totalGoals = 0;
    let totalMVPs = 0;

    

    // Tüm maçları analiz et
    matches.forEach((match, index) => {
                if (!match.performances || !Array.isArray(match.performances)) {
            console.warn(`⚠️ Maç ${match.id} - performances dizisi yok`);
            return;
        }
        
                const performance = match.performances.find(p => p.playerId === playerId);
        
        if (performance) {
            
            
            const goals = performance.goals || 0;
            const mvp = performance.weeklyMVP ? 1 : 0;

            // Maç sonucunu hesapla
            let result = 'Berabere';
            if (performance.team === 'A') {
                if (match.teamAGoals > match.teamBGoals) result = 'Galibiyet';
                else if (match.teamAGoals < match.teamBGoals) result = 'Mağlubiyet';
            } else {
                if (match.teamBGoals > match.teamAGoals) result = 'Galibiyet';
                else if (match.teamBGoals < match.teamAGoals) result = 'Mağlubiyet';
            }

            playerMatches.push({
                date: match.date,
                matchId: match.id,
                team: performance.team,
                goals: goals,
                mvp: mvp,
                result: result,
                teamScore: performance.team === 'A' ? match.teamAGoals : match.teamBGoals,
                opponentScore: performance.team === 'A' ? match.teamBGoals : match.teamAGoals
            });

            totalGoals += goals;
            totalMVPs += mvp;
        } else {
            
        }
    });

    

    // Tarihe göre sırala (eskiden yeniye)
    playerMatches.sort((a, b) => {
        const dateA = parsePerformanceDate(a.date);
        const dateB = parsePerformanceDate(b.date);
        return dateA - dateB;
    });

    return {
        player: player,
        matches: playerMatches,
        totals: {
            matches: playerMatches.length,
            goals: totalGoals,
            mvps: totalMVPs
        },
        averages: {
            goalsPerMatch: playerMatches.length > 0 ? (totalGoals / playerMatches.length).toFixed(1) : '0.0',
            mvpRate: playerMatches.length > 0 ? ((totalMVPs / playerMatches.length) * 100).toFixed(1) : '0.0'
        }
    };
}

/**
 * Tarih string'ini Date objesine çevir
 */
function parsePerformanceDate(dateString) {
    const parts = dateString.split('.');
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date();
}

/**
 * Performans line chart'ı oluştur
 */
function createPlayerPerformanceChart(data) {
    const ctx = document.getElementById('player-performance-chart');
    if (!ctx) {
        console.error('❌ Canvas element bulunamadı: player-performance-chart');
        return;
    }

    const ChartJS = Chart || window.Chart;
    if (typeof ChartJS === 'undefined') {
        console.error('❌ Chart.js yüklenmemiş');
        return;
    }

    

    // Mevcut chart'ı temizle
    if (playerPerformanceChart) {
        playerPerformanceChart.destroy();
        playerPerformanceChart = null;
    }

    // Veri hazırlığı
    const labels = data.matches.map(match => {
        const date = new Date(parsePerformanceDate(match.date));
        return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    });

    const goalsData = data.matches.map(match => match.goals);

    // Chart konfigürasyonu
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Goller',
                    data: goalsData,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#e0e0e0',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 10,
                    displayColors: true,
                    callbacks: {
                        title: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            return `Maç: ${data.matches[index].date}`;
                        },
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                        },
                        afterBody: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const match = data.matches[index];
                            return [
                                `Takım: ${match.team}`,
                                `Sonuç: ${match.result}`,
                                `Skor: ${match.teamScore}-${match.opponentScore}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0',
                        stepSize: 1
                    }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeInOutQuart'
            }
        }
    };

    playerPerformanceChart = new ChartJS(ctx, config);
    
}

/**
 * Radar chart oluştur
 */
function createPlayerRadarChart(data) {
    const ctx = document.getElementById('player-radar-chart');
    if (!ctx) return;

    // Mevcut chart'ı temizle
    if (playerRadarChart) {
        playerRadarChart.destroy();
        playerRadarChart = null;
    }

    // Radar için normaliz edilmiş veriler (0-100 arası)
    const totalMatches = data.totals.matches;
    const totalGoals = data.totals.goals;
    const totalMVPs = data.totals.mvps;
    
    // Toplam oynanmış maç sayısını data.js'ten al
    const totalPlayedMatches = matches ? matches.length : 3; // Default 3 maç
    
    // Oyuncunun puan tablosundaki sıralamasını hesapla
    const playerRanking = calculatePlayerRanking(data.player.id);
    const rankingScore = Math.max(100 - (playerRanking * 10), 0); // 1. = 100, 2. = 90, vs.
    
    // 1. Gol Performansı: 1 maçta ortalama 5+ gol = 100 puan
    const avgGoalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0;
    const goalPerformance = Math.min((avgGoalsPerMatch / 5) * 100, 100) || 0;
    
    // 2. Takım Başarısı: Oyuncunun oynadığı maçlarda takımının başarı oranı
    const teamSuccessRate = calculateTeamSuccessRate(data.matches, data.player.id);
    
    // 3. Aktiflik: Kaç maça katıldığı / Toplam oynanan maç sayısı
    const activityLevel = Math.min((totalMatches / totalPlayedMatches) * 100, 100);
    
    // 4. Tutarlılık: Goller arasındaki tutarlılık (varyasyon az = iyi)
    const goalVariance = data.matches.length > 1 ? 
        Math.sqrt(data.matches.reduce((sum, match) => {
            const avg = totalGoals / totalMatches;
            return sum + Math.pow(match.goals - avg, 2);
        }, 0) / data.matches.length) : 0;
    const consistency = Math.max(100 - (goalVariance * 30), 0);
    
    // 5. Genel Değerlendirme: Tüm faktörleri içeren karma puan (puan tablosu sırası dahil)
    const overallRating = Math.min(((goalPerformance + teamSuccessRate + activityLevel + rankingScore) / 4), 100);
    
    const radarData = [
        goalPerformance,     // Gol Performansı
        teamSuccessRate,     // Takım Başarısı (MVP yerine)
        activityLevel,       // Aktiflik
        consistency,         // Tutarlılık
        overallRating        // Genel Değerlendirme
    ];

        const config = {
        type: 'radar',
        data: {
            labels: ['Gol Performansı', 'Takım Başarısı', 'Aktiflik', 'Tutarlılık', 'Genel Değerlendirme'],
            datasets: [{
                label: data.player.name,
                data: radarData,
                borderColor: '#0f4c75',
                backgroundColor: 'rgba(15, 76, 117, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#e07b39',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#e0e0e0',
                        stepSize: 25,
                        display: false
                    },
                    pointLabels: {
                        color: '#e0e0e0',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeInOutQuart'
            }
        }
    };

    const ChartJS = Chart || window.Chart;
    playerRadarChart = new ChartJS(ctx, config);
    
}

/**
 * Son maçlar tablosunu güncelle
 */
function updateRecentMatchesTable(data) {
    const tableBody = document.getElementById('recent-matches-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Son 5 maçı ters sırada göster (son maç üstte)
    const lastMatches = [...data.matches].reverse().slice(0, 5);

    lastMatches.forEach(match => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${match.date}</td>
            <td><span class="team-badge team-${match.team.toLowerCase()}">Takım ${match.team}</span></td>
            <td style="text-align: center; font-weight: 600; color: #4ecdc4;">${match.teamScore || 0}-${match.opponentScore || 0}</td>
            <td style="text-align: center; font-weight: 600; color: ${match.goals > 0 ? '#ff6b6b' : '#888'};">${match.goals}</td>
            <td><span class="match-result result-${match.result.toLowerCase().replace('ğ', 'g').replace('ı', 'i')}">${match.result}</span></td>
        `;

        tableBody.appendChild(row);
    });

    
}

/**
 * Performans verilerini göster
 */
function showPlayerPerformance(data) {
    const noDataMessage = document.getElementById('no-performance-data');
    const chartCanvas = document.getElementById('player-performance-chart');
    const radarContainer = document.getElementById('performance-radar-container');
    const matchesSection = document.getElementById('recent-matches-section');

    if (noDataMessage) noDataMessage.style.display = 'none';
    if (chartCanvas) chartCanvas.style.display = 'block';
    if (radarContainer) radarContainer.style.display = 'block';
    if (matchesSection) matchesSection.style.display = 'block';
}

/**
 * Performans verisi olmadığında mesaj göster
 */
function showNoPerformanceData() {
    
    const noDataMessage = document.getElementById('no-performance-data');
    const chartCanvas = document.getElementById('player-performance-chart');
    const radarContainer = document.getElementById('performance-radar-container');
    const matchesSection = document.getElementById('recent-matches-section');

    if (noDataMessage) noDataMessage.style.display = 'flex';
    if (chartCanvas) chartCanvas.style.display = 'none';
    if (radarContainer) radarContainer.style.display = 'none';
    if (matchesSection) matchesSection.style.display = 'none';
}

/**
 * Performans verilerini gizle
 */
function hidePlayerPerformance() {
    const noDataMessage = document.getElementById('no-performance-data');
    const chartCanvas = document.getElementById('player-performance-chart');
    const radarContainer = document.getElementById('performance-radar-container');
    const matchesSection = document.getElementById('recent-matches-section');

    if (noDataMessage) noDataMessage.style.display = 'flex';
    if (chartCanvas) chartCanvas.style.display = 'none';
    if (radarContainer) radarContainer.style.display = 'none';
    if (matchesSection) matchesSection.style.display = 'none';

    // Chart'ları temizle
    if (playerPerformanceChart) {
        playerPerformanceChart.destroy();
        playerPerformanceChart = null;
    }
    if (playerRadarChart) {
        playerRadarChart.destroy();
        playerRadarChart = null;
    }
}

// ==================== SEZON BAZLI SON MAÇLAR ====================

// Aktif profil sezonu
let currentProfileSeason = 2;

/**
 * Sezon bazlı oyuncu maçlarını hesapla
 */
function calculateSeasonPlayerMatches(playerId, season) {
    const player = players.find(p => p.id === playerId);
    if (!player) return [];

    // Sezona göre maç verisini seç
    const matchData = season === 1 
        ? (typeof season1Matches !== 'undefined' ? season1Matches : [])
        : (typeof matches !== 'undefined' ? matches : []);

    const playerMatches = [];

    matchData.forEach(match => {
        if (!match.performances || !Array.isArray(match.performances)) return;
        
        const performance = match.performances.find(p => p.playerId === playerId);
        
        if (performance) {
            const goals = performance.goals || 0;

            // Maç sonucunu hesapla
            let result = 'Berabere';
            if (performance.team === 'A') {
                if (match.teamAGoals > match.teamBGoals) result = 'Galibiyet';
                else if (match.teamAGoals < match.teamBGoals) result = 'Mağlubiyet';
            } else {
                if (match.teamBGoals > match.teamAGoals) result = 'Galibiyet';
                else if (match.teamBGoals < match.teamAGoals) result = 'Mağlubiyet';
            }

            playerMatches.push({
                date: match.date,
                matchId: match.id,
                team: performance.team,
                goals: goals,
                result: result,
                teamScore: performance.team === 'A' ? match.teamAGoals : match.teamBGoals,
                opponentScore: performance.team === 'A' ? match.teamBGoals : match.teamAGoals
            });
        }
    });

    return playerMatches;
}

/**
 * Sezon bazlı son maçlar tablosunu güncelle
 */
function updateSeasonRecentMatchesTable(playerId, season) {
    const tableBody = document.getElementById('recent-matches-body');
    if (!tableBody) return;

    const playerMatches = calculateSeasonPlayerMatches(playerId, season);
    
    tableBody.innerHTML = '';

    if (playerMatches.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: #999;">
                    Bu sezonda maç verisi bulunmuyor.
                </td>
            </tr>
        `;
        return;
    }

    // Maçları ters sırada göster (son maç üstte)
    const sortedMatches = [...playerMatches].reverse();

    sortedMatches.forEach(match => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${match.date}</td>
            <td><span class="team-badge team-${match.team.toLowerCase()}">Takım ${match.team}</span></td>
            <td style="text-align: center; font-weight: 600; color: #4ecdc4;">${match.teamScore || 0}-${match.opponentScore || 0}</td>
            <td style="text-align: center; font-weight: 600; color: ${match.goals > 0 ? '#ff6b6b' : '#888'};">${match.goals}</td>
            <td><span class="match-result result-${match.result.toLowerCase().replace('ğ', 'g').replace('ı', 'i')}">${match.result}</span></td>
        `;

        tableBody.appendChild(row);
    });
}

/**
 * Profil sezon değiştirme fonksiyonu
 */
function changeProfileSeason(season) {
    currentProfileSeason = season;
    
    // Buton aktiflik durumunu güncelle
    document.querySelectorAll('.profile-season-selector .season-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.profile-season-selector [data-season="${season}"]`)?.classList.add('active');
    
    // URL'den oyuncu ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id') || 'onur_mustafa';
    
    // Tabloyu güncelle
    updateSeasonRecentMatchesTable(playerId, season);
}

/**
 * Profil sezon butonlarını başlat
 */
function initProfileSeasonButtons() {
    const season1Btn = document.getElementById('profile-season1-btn');
    const season2Btn = document.getElementById('profile-season2-btn');
    
    if (season1Btn) {
        season1Btn.addEventListener('click', () => changeProfileSeason(1));
    }
    if (season2Btn) {
        season2Btn.addEventListener('click', () => changeProfileSeason(2));
    }
}

// Sayfa yüklendiğinde sezon butonlarını başlat
document.addEventListener('DOMContentLoaded', () => {
    initProfileSeasonButtons();
});

// Export fonksiyonları
window.initializePlayerPerformance = initializePlayerPerformance;
window.changeProfileSeason = changeProfileSeason;
window.updateSeasonRecentMatchesTable = updateSeasonRecentMatchesTable;
window.initProfileSeasonButtons = initProfileSeasonButtons;



