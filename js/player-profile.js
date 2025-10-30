// OYUNCU PROFİLİ JavaScript FUNKSİYONLARI

// Aktif oyuncu
let currentPlayerId = null;

// Chart.js örnekleri
let goalsChart = null;
let performanceChart = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initializePlayerProfile();
    setupEventListeners();
});

// Başlangıç fonksiyonu
function initializePlayerProfile() {
    // URL'den oyuncu ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    currentPlayerId = urlParams.get('id') || 'onur_mustafa'; // Default olarak onur_mustafa
    
    // Oyuncu verilerini yükle
    loadPlayerData();
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Sezon sistemi kaldırıldı
}

// Oyuncu verilerini yükle
function loadPlayerData() {
    console.log('🔍 Oyuncu verileri yükleniyor, ID:', currentPlayerId);
    
    // Enhanced data'dan oyuncu bilgilerini al
    const playerData = getPlayerProfileData ? getPlayerProfileData(currentPlayerId) : null;
    
    if (!playerData) {
        console.log('📊 Enhanced data bulunamadı, basic data kullanılıyor');
        // Fallback - mevcut sistemden veri al
        loadBasicPlayerData();
        return;
    }
    
    console.log('✅ Enhanced data bulundu:', playerData);
    
    // Temel bilgileri yükle
    populateBasicInfo(playerData.basic);
    
    // İstatistikleri yükle
    console.log('📊 İstatistikler yükleniyor:', playerData.season);
    populateStats(playerData.season, playerData.career);
    
    // Başarıları yükle
    populateAchievements(playerData.achievements);
    
    // Karşılaştırmaları yükle
    populateComparisons(playerData.comparisons);
    
    // Grafikleri çiz
    drawCharts(playerData.chartData);
}

// Temel oyuncu bilgilerini doldur
function populateBasicInfo(playerInfo) {
    // Oyuncu adı
    const nameElement = document.getElementById('player-name');
    if (nameElement) nameElement.textContent = playerInfo.name || 'Bilinmeyen Oyuncu';
    
    // Profil fotoğrafı
    const imageElement = document.getElementById('player-image');
    if (imageElement) {
        imageElement.src = playerInfo.profileImage || 'img/oyuncular/default.svg';
        imageElement.alt = `${playerInfo.name} Profil Fotoğrafı`;
        imageElement.onerror = () => {
            imageElement.src = 'img/oyuncular/default.jpg';
        };
    }
    
    // Rating
    const ratingElement = document.getElementById('player-rating');
    if (ratingElement) ratingElement.textContent = playerInfo.rating || '0';
    
    // Mevki
    const positionElement = document.getElementById('player-position');
    if (positionElement) positionElement.textContent = playerInfo.position || 'Belirsiz';
    
    // Forma numarası
    const numberElement = document.getElementById('player-number');
    if (numberElement) numberElement.textContent = `#${playerInfo.favNumber || '?'}`;
    
    // Biyografi
    const bioElement = document.getElementById('player-bio');
    if (bioElement) bioElement.textContent = playerInfo.bio || 'Henüz biyografi eklenmemiş.';
    
    // Sosyal medya
    const instagramLink = document.getElementById('instagram-link');
    const twitterLink = document.getElementById('twitter-link');
    
    if (instagramLink && playerInfo.socialMedia?.instagram) {
        instagramLink.href = `https://instagram.com/${playerInfo.socialMedia.instagram.replace('@', '')}`;
        instagramLink.style.display = 'inline-flex';
    } else if (instagramLink) {
        instagramLink.style.display = 'none';
    }
    
    if (twitterLink && playerInfo.socialMedia?.twitter) {
        twitterLink.href = `https://twitter.com/${playerInfo.socialMedia.twitter.replace('@', '')}`;
        twitterLink.style.display = 'inline-flex';
    } else if (twitterLink) {
        twitterLink.style.display = 'none';
    }
}

// İstatistikleri doldur
function populateStats(seasonStats, careerStats) {
    // Oyuncunun attığı gol
    const totalGoalsElement = document.getElementById('total-goals');
    if (totalGoalsElement) totalGoalsElement.textContent = seasonStats.goals || 0;
    
    // Takımının attığı gol
    const teamGoalsForElement = document.getElementById('team-goals-for');
    if (teamGoalsForElement) teamGoalsForElement.textContent = seasonStats.teamGoalsFor || 0;
    
    // Takımının yediği gol
    const teamGoalsAgainstElement = document.getElementById('team-goals-against');
    if (teamGoalsAgainstElement) teamGoalsAgainstElement.textContent = seasonStats.teamGoalsAgainst || 0;
    
    // Gol farkı
    const goalDifferenceElement = document.getElementById('goal-difference');
    if (goalDifferenceElement) {
        const diff = (seasonStats.teamGoalsFor || 0) - (seasonStats.teamGoalsAgainst || 0);
        goalDifferenceElement.textContent = diff > 0 ? `+${diff}` : diff;
        
        // Renk kodlaması
        if (diff > 0) goalDifferenceElement.style.color = '#4ade80'; // Yeşil
        else if (diff < 0) goalDifferenceElement.style.color = '#f87171'; // Kırmızı
        else goalDifferenceElement.style.color = '#e0e0e0'; // Nötr
    }
    
    // MVP sayısı
    const totalMvpsElement = document.getElementById('total-mvps');
    if (totalMvpsElement) totalMvpsElement.textContent = seasonStats.mvps || 0;
    
    // Haftanın Eşşeği sayısı (script.js'deki donkey hesaplamasından)
    const totalDonkeysElement = document.getElementById('total-donkeys');
    if (totalDonkeysElement) {
        if (typeof calculatePlayerStats === 'function') {
            const allStats = calculatePlayerStats();
            const playerStats = allStats.find(s => s.id === currentPlayerId);
            totalDonkeysElement.textContent = playerStats?.DONKEY || 0;
        } else {
            totalDonkeysElement.textContent = 0;
        }
    }
}

// Başarıları doldur
function populateAchievements(achievements) {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList || !Array.isArray(achievements)) return;
    
    achievementsList.innerHTML = '';
    
    if (achievements.length === 0) {
        achievementsList.innerHTML = '<p style="color: var(--text-light); opacity: 0.7;">Henüz başarı kazanılmamış.</p>';
        return;
    }
    
    achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        
        const icon = getAchievementIcon(achievement.type);
        
        badge.innerHTML = `
            <span class="achievement-icon">${icon}</span>
            <div class="achievement-text">
                <span class="achievement-title">${achievement.title}</span>
                <span class="achievement-description">${achievement.description}</span>
            </div>
        `;
        
        achievementsList.appendChild(badge);
    });
}

// Başarı ikonu al
function getAchievementIcon(type) {
    const icons = {
        'crown': '👑',
        'fire': '🔥',
        'star': '⭐',
        'trophy': '🏆',
        'medal': '🏅',
        'target': '🎯'
    };
    return icons[type] || '🏆';
}

// Karşılaştırmaları doldur
function populateComparisons(comparisons) {
    if (!comparisons) return;
    
    const overallRankElement = document.getElementById('overall-rank');
    if (overallRankElement) {
        overallRankElement.textContent = `${comparisons.rank}/${comparisons.totalPlayers}`;
    }
    
    const goalRankElement = document.getElementById('goal-rank');
    if (goalRankElement) {
        goalRankElement.textContent = `${comparisons.goalRank}/${comparisons.totalPlayers}`;
    }
    
    const mvpRankElement = document.getElementById('mvp-rank');
    if (mvpRankElement) {
        mvpRankElement.textContent = `${comparisons.mvpRank}/${comparisons.totalPlayers}`;
    }
}

// Detaylı istatistikleri doldur
function populateDetailedStats(seasonStats, careerStats) {
    const detailedStatsBody = document.getElementById('detailed-stats-body');
    if (!detailedStatsBody) return;
    
    const stats = [
        { label: 'Sezon Oynadığı Maç', value: seasonStats.M || 0 },
        { label: 'Sezon Galibiyet', value: seasonStats.W || 0 },
        { label: 'Sezon Beraberlik', value: seasonStats.D || 0 },
        { label: 'Sezon Mağlubiyet', value: seasonStats.L || 0 },
        { label: 'Sezon Attığı Gol', value: seasonStats.GF || 0 },
        { label: 'Sezon Yediği Gol', value: seasonStats.GA || 0 },
        { label: 'Sezon Gol Farkı', value: seasonStats.GD || 0 },
        { label: 'Sezon Puan', value: seasonStats.PTS || 0 }
    ];
    
    if (careerStats) {
        stats.push(
            { label: 'Kariyer Toplam Maç', value: careerStats.totalMatches || 0 },
            { label: 'Kariyer Toplam Gol', value: careerStats.totalGoals || 0 },
            { label: 'Kariyer Toplam Asist', value: careerStats.totalAssists || 0 },
            { label: 'Kariyer Toplam MVP', value: careerStats.totalMVPs || 0 },
            { label: 'Kariyer Galibiyet Oranı', value: careerStats.totalMatches > 0 ? `%${((careerStats.totalWins / careerStats.totalMatches) * 100).toFixed(1)}` : '%0' }
        );
    }
    
    detailedStatsBody.innerHTML = '';
    stats.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stat.label}</td>
            <td>${stat.value}</td>
        `;
        detailedStatsBody.appendChild(row);
    });
}

// Grafikleri çiz
function drawCharts(chartData) {
    if (!chartData) return;
    
    // Mevcut grafikleri temizle
    if (goalsChart) {
        goalsChart.destroy();
        goalsChart = null;
    }
    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }
    
    // Yeni performans grafik sistemi kullan
    if (typeof initializePlayerPerformance === 'function') {
        console.log('🎯 Player performance fonksiyonu çağrılıyor...');
        initializePlayerPerformance(currentPlayerId);
    } else {
        console.log('❌ initializePlayerPerformance fonksiyonu bulunamadı');
        // 1 saniye sonra tekrar dene
        setTimeout(() => {
            if (typeof initializePlayerPerformance === 'function') {
                console.log('🎯 Player performance fonksiyonu gecikmeli çağrılıyor...');
                initializePlayerPerformance(currentPlayerId);
            }
        }, 1000);
    }
}

// Gol grafiği çiz
function drawGoalsChart(data) {
    const ctx = document.getElementById('goals-chart');
    if (!ctx || !data) return;
    
    goalsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Goller',
                data: data.data || [],
                borderColor: '#0f4c75',
                backgroundColor: 'rgba(15, 76, 117, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#e07b39',
                pointBorderColor: '#0f4c75',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#e0e0e0',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Performans grafiği çiz
function drawPerformanceChart(data) {
    const ctx = document.getElementById('performance-chart');
    if (!ctx || !data) return;
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels || [],
            datasets: [
                {
                    label: 'Goller',
                    data: data.goals || [],
                    backgroundColor: 'rgba(15, 76, 117, 0.8)',
                    borderColor: '#0f4c75',
                    borderWidth: 1
                },
                {
                    label: 'Asistler',
                    data: data.assists || [],
                    backgroundColor: 'rgba(224, 123, 57, 0.8)',
                    borderColor: '#e07b39',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#e0e0e0',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Temel veri yükleme (fallback)
function loadBasicPlayerData() {
    console.log('🔧 Basic data yükleniyor, ID:', currentPlayerId);
    console.log('📋 Mevcut players:', typeof players !== 'undefined' ? players.length : 'tanımsız');
    
    // data.js'den oyuncuyu bul
    const player = (typeof players !== 'undefined') ? players.find(p => p.id === currentPlayerId) : null;
    
    console.log('🎯 Bulunan oyuncu:', player);
    
    if (!player) {
        console.log('❌ Oyuncu bulunamadı');
        // Oyuncu bulunamadı
        const nameElement = document.getElementById('player-name');
        if (nameElement) nameElement.textContent = 'Oyuncu Bulunamadı';
        return;
    }
    
    console.log('✅ Oyuncu bulundu:', player.name);
    
    // Enhanced data'dan ek bilgileri al (varsa)
    const enhancedPlayer = (typeof enhancedPlayers !== 'undefined') ? 
        enhancedPlayers.find(p => p.id === currentPlayerId) : null;
    
    console.log('📊 Enhanced player:', enhancedPlayer);
    
    // Temel bilgileri doldur
    const basicInfo = {
        name: player.name,
        rating: enhancedPlayer ? enhancedPlayer.rating : Math.floor(Math.random() * 20) + 70, // 70-89 arası
        position: enhancedPlayer ? enhancedPlayer.position : (player.mevki || 'Bilinmiyor'),
        favNumber: enhancedPlayer ? enhancedPlayer.favNumber : Math.floor(Math.random() * 99) + 1,
        bio: enhancedPlayer ? enhancedPlayer.bio : 'Halısaha ligi oyuncusu.',
        profileImage: `img/oyuncular/${player.id}.jpg`, // ID ile eşleşen fotoğraf
        birthDate: enhancedPlayer ? enhancedPlayer.birthDate : null,
        joinDate: enhancedPlayer ? enhancedPlayer.joinDate : null,
        socialMedia: enhancedPlayer ? enhancedPlayer.socialMedia : null
    };
    
    console.log('🎨 Basic info hazırlandı:', basicInfo);
    populateBasicInfo(basicInfo);
    
    // Oyuncu istatistiklerini hesapla - Script.js'deki fonksiyonu kullan
    let stats = { GF: 0, M: 0, MVP: 0, DONKEY: 0 }; // Default değerler
    
    if (typeof calculatePlayerStats === 'function') {
        const allStats = calculatePlayerStats();
        const playerStats = allStats.find(s => s.id === currentPlayerId);
        if (playerStats) {
            stats = playerStats;
        }
    }
    
    // İstatistikleri doldur
    populateStats(stats, stats);
    populateDetailedStats(stats, stats);
    
    // Basit grafik verisi oluştur
    const chartData = {
        goals: {
            labels: ['Son 5 Maç'],
            data: [stats.goals]
        },
        performance: {
            categories: ['Gol', 'Asist', 'MVP'],
            values: [stats.goals, stats.assists, stats.mvps]
        }
    };
    
    drawCharts(chartData);
}

// Oyuncu profili için istatistik hesaplama
function calculatePlayerStatsForProfile(playerName) {
    // Eğer matches varsa ve dolu ise gerçek stats hesapla
    if (typeof matches !== 'undefined' && matches.length > 0) {
        let goals = 0;
        let assists = 0;
        let matchCount = 0;
        let wins = 0;
        let mvps = 0;

        matches.forEach(match => {
            const performance = match.performances.find(p => {
                const player = players.find(pl => pl.id === p.playerId);
                return player && player.name === playerName;
            });

            if (performance) {
                goals += performance.goals;
                assists += performance.assists;
                matchCount++;
                if (performance.mvp) mvps++;

                // Kazanma durumunu kontrol et
                const isWinner = (performance.team === 'A' && match.teamAGoals > match.teamBGoals) ||
                                 (performance.team === 'B' && match.teamBGoals > match.teamAGoals);
                if (isWinner) wins++;
            }
        });

        return {
            goals: goals,
            assists: assists,
            matches: matchCount,
            wins: wins,
            mvps: mvps,
            winRate: matchCount > 0 ? Math.round((wins / matchCount) * 100) : 0,
            GF: goals, // Uyumluluk için
            M: matchCount,
            W: wins,
            MVP: mvps
        };
    } else {
        // Henüz maç olmadığında örnek/demo veriler
        const goals = Math.floor(Math.random() * 5);
        const assists = Math.floor(Math.random() * 3);
        const matches = Math.floor(Math.random() * 3);
        const wins = Math.floor(matches * (Math.random() * 0.6 + 0.2)); // %20-80 kazanma
        const mvps = Math.floor(Math.random() * 2);

        return {
            goals: goals,
            assists: assists,
            matches: matches,
            wins: wins,
            mvps: mvps,
            winRate: matches > 0 ? Math.round((wins / matches) * 100) : 0,
            GF: goals, // Uyumluluk için
            M: matches,
            W: wins,
            MVP: mvps
        };
    }
}

// Rastgele pozisyon oluştur (player-profile için)
function getRandomPosition() {
    const positions = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci'];
    return positions[Math.floor(Math.random() * positions.length)];
}

// Sayfa animasyonları
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.animate-fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});