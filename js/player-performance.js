/**
 * Oyuncunun puan tablosundaki sıralamasını hesapla
 */
function calculatePlayerRanking(playerId) {
    if (typeof calculatePlayerStats !== 'function') {
        console.log('⚠️ calculatePlayerStats fonksiyonu bulunamadı, varsayılan sıralama: 5');
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
        console.log('❌ Player ID yok');
        return;
    }
    
    if (typeof matches === 'undefined' || !matches || matches.length === 0) {
        console.log('❌ Maç verileri yok, 1 saniye sonra tekrar denenecek...');
        setTimeout(() => initializePlayerPerformance(playerId), 1000);
        return;
    }
    
    if (typeof players === 'undefined' || !players || players.length === 0) {
        console.log('❌ Oyuncu verileri yok, 1 saniye sonra tekrar denenecek...');
        setTimeout(() => initializePlayerPerformance(playerId), 1000);
        return;
    }

    console.log(`📊 ${playerId} için performans grafikleri yükleniyor...`);

    // Chart.js kontrolü
    console.log('🔍 Chart.js kontrolü:', typeof Chart, window.Chart);
    
    if (typeof Chart === 'undefined' && typeof window.Chart === 'undefined') {
        console.log('❌ Chart.js bulunamadı, performans grafikleri devre dışı');
        showNoPerformanceData();
        return;
    }

    // Chart referansını ayarla
    const ChartJS = Chart || window.Chart;
    console.log('✅ Chart.js mevcut:', ChartJS);

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
        console.log(`✅ ${performanceData.matches.length} maç verisi bulundu`);
        showPlayerPerformance(performanceData);
        createPlayerPerformanceChart(performanceData);
        createPlayerRadarChart(performanceData);
        updateRecentMatchesTable(performanceData);
    } else {
        console.log('❌ Performans verisi bulunamadı');
        hidePlayerPerformance();
    }
}

/**
 * Oyuncu performans verilerini hesapla
 */
function calculatePlayerPerformanceData(playerId) {
    console.log(`🔍 Performans hesaplanıyor - Player ID: ${playerId}`);
    
    const player = players.find(p => p.id === playerId);
    if (!player) {
        console.error(`❌ Oyuncu bulunamadı: ${playerId}`);
        console.log('Mevcut oyuncu ID\'leri:', players.map(p => p.id));
        return null;
    }

    console.log(`✅ Oyuncu bulundu: ${player.name}`);

    const playerMatches = [];
    let totalGoals = 0;
    let totalMVPs = 0;

    console.log(`📊 ${matches.length} maç kontrol ediliyor...`);

    // Tüm maçları analiz et
    matches.forEach((match, index) => {
        console.log(`Maç ${index + 1} (ID: ${match.id}, Tarih: ${match.date})`);
        
        if (!match.performances || !Array.isArray(match.performances)) {
            console.warn(`⚠️ Maç ${match.id} - performances dizisi yok`);
            return;
        }
        
        console.log(`  Performanslar:`, match.performances.map(p => `${p.playerId}: ${p.goals}g`));
        
        const performance = match.performances.find(p => p.playerId === playerId);
        
        if (performance) {
            console.log(`  ✅ ${playerId} bu maçta oynadı:`, performance);
            
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
            console.log(`  ❌ ${playerId} bu maçta oynatılmamış`);
        }
    });

    console.log(`🎯 Sonuç: ${playerMatches.length} maç, ${totalGoals} gol, ${totalMVPs} MVP`);

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

    console.log('📊 Chart oluşturuluyor...', data.matches.length, 'maç ile');

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
    const mvpData = data.matches.map(match => match.mvp);

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
                },
                {
                    label: 'MVP',
                    data: mvpData,
                    borderColor: '#feca57',
                    backgroundColor: 'rgba(254, 202, 87, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#feca57',
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
    console.log('📊 Oyuncu performans chart oluşturuldu');
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

    console.log('🎯 Radar verileri:', {
        goalPerformance: goalPerformance.toFixed(1) + ` (Ortalama ${avgGoalsPerMatch.toFixed(1)} gol/maç, Hedef: 5 gol/maç)`,
        teamSuccessRate: teamSuccessRate.toFixed(1) + ` (Takım başarı oranı)`,
        activityLevel: activityLevel.toFixed(1) + ` (${totalMatches}/${totalPlayedMatches} maça katıldı)`,
        consistency: consistency.toFixed(1) + ` (Gol tutarlılığı)`,
        overallRating: overallRating.toFixed(1) + ` (Puan tablosu: ${playerRanking}. sıra, ${rankingScore.toFixed(1)} puan)`
    });

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
    console.log('🎯 Oyuncu radar chart oluşturuldu');
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
            <td style="text-align: center;">${match.mvp ? '<span class="mvp-badge">MVP</span>' : '-'}</td>
            <td><span class="match-result result-${match.result.toLowerCase().replace('ğ', 'g').replace('ı', 'i')}">${match.result}</span></td>
        `;

        tableBody.appendChild(row);
    });

    console.log(`📋 ${lastMatches.length} son maç tabloya eklendi`);
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
    console.log('📍 Performans verisi yok mesajı gösteriliyor');
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

// Export fonksiyonu
window.initializePlayerPerformance = initializePlayerPerformance;

console.log('✅ Oyuncu Profil Performans modülü yüklendi');