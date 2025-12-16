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
    
    
    // Enhanced data'dan oyuncu bilgilerini al
    const playerData = getPlayerProfileData ? getPlayerProfileData(currentPlayerId) : null;
    
    if (!playerData) {
        
        // Fallback - mevcut sistemden veri al
        loadBasicPlayerData();
        return;
    }
    
    
    
    // Temel bilgileri yükle
    populateBasicInfo(playerData.basic);
    
    // İstatistikleri yükle
    
    populateStats(playerData.season, playerData.career);
    
    // Başarıları yükle
    populateAchievements(playerData.achievements);
    
    // Karşılaştırmaları yükle
    populateComparisons(playerData.comparisons);
    
    // Grafikleri çiz
    drawCharts(playerData.chartData);
    
    // Güç skorunu hesapla ve göster
    updatePlayerPower();
}

// Oyuncu güç skorunu hesapla ve göster
function updatePlayerPower() {
    const powerElement = document.getElementById('player-power');
    const powerCard = document.querySelector('.stat-card.power-card');
    
    if (powerElement && currentPlayerId) {
        const power = calculatePlayerPowerProfile(currentPlayerId);
        powerElement.textContent = power;
        
        // Güç seviyesine göre renk sınıfı ekle
        if (powerCard) {
            // Önceki sınıfları temizle
            powerCard.classList.remove('power-supreme', 'power-legendary', 'power-elite', 'power-strong', 'power-average', 'power-developing', 'power-rookie');
            
            // Yeni sınıfı ekle
            const powerClass = getPowerClassProfile(power);
            powerCard.classList.add(powerClass);
        }
    }
}

// Güç seviyesine göre CSS sınıfı döndür
function getPowerClassProfile(power) {
    if (power >= 95) return 'power-supreme';
    if (power >= 90) return 'power-legendary';
    if (power >= 80) return 'power-elite';
    if (power >= 70) return 'power-strong';
    if (power >= 60) return 'power-average';
    if (power >= 50) return 'power-developing';
    return 'power-rookie';
}

// Oyuncu güç skoru hesaplama (profil sayfası için)
function calculatePlayerPowerProfile(playerId) {
    if (!matches || matches.length === 0) {
        return 50;
    }
    
    // Oyuncunun mevkisini bul
    const player = players.find(p => p.id === playerId);
    const position = player ? player.mevki : 'Orta Saha';
    
    let totalMatches = 0;
    let wins = 0;
    let draws = 0;
    let totalGoals = 0;
    let mvpCount = 0;
    let donkeyCount = 0;
    let totalGoalsConceded = 0;
    let totalTeamGoals = 0;
    let totalMatchGoals = 0;
    
    matches.forEach(match => {
        const performance = match.performances.find(p => p.playerId === playerId);
        if (performance) {
            totalMatches++;
            totalGoals += performance.goals || 0;
            
            if (performance.weeklyMVP) {
                mvpCount++;
            }
            
            if (match.esek_adam === playerId) {
                donkeyCount++;
            }
            
            const playerTeam = performance.team;
            const teamGoalsFor = playerTeam === 'A' ? match.teamAGoals : match.teamBGoals;
            const teamGoalsAgainst = playerTeam === 'A' ? match.teamBGoals : match.teamAGoals;
            
            totalTeamGoals += teamGoalsFor;
            totalGoalsConceded += teamGoalsAgainst;
            totalMatchGoals += match.teamAGoals + match.teamBGoals;
            
            if (playerTeam === 'A') {
                if (match.teamAGoals > match.teamBGoals) wins++;
                else if (match.teamAGoals === match.teamBGoals) draws++;
            } else {
                if (match.teamBGoals > match.teamAGoals) wins++;
                else if (match.teamBGoals === match.teamAGoals) draws++;
            }
        }
    });
    
    if (totalMatches === 0) {
        return 50;
    }
    
    // === MEVKİ BAZLI HESAPLAMA ===
    const winRate = wins / totalMatches;
    const winPoints = winRate * 35;
    
    const goalAverage = totalGoals / totalMatches;
    let goalPoints = 0;
    let positionBonus = 0;
    
    const avgConceded = totalGoalsConceded / totalMatches;
    const avgTeamGoals = totalTeamGoals / totalMatches;
    const avgMatchGoals = totalMatchGoals / totalMatches;
    const normalizationFactor = 20 / Math.max(avgMatchGoals, 10);
    
    if (position === 'Kaleci') {
        goalPoints = 0;
        // 12 gol/maç = 0 bonus, 2 gol/maç = 18 bonus
        const concededNormalized = avgConceded * normalizationFactor;
        const saveBonus = Math.max(0, 18 - (concededNormalized * 1.8));
        positionBonus = saveBonus;
    } else if (position === 'Defans') {
        goalPoints = goalAverage * 2.5; // ×2.5 gol çarpanı (gol atması zor)
        // Yenilen gol performansı (max +8)
        const concededNormalized = avgConceded * normalizationFactor;
        const defenseBonus = Math.max(0, 8 - (concededNormalized * 0.8));
        positionBonus = defenseBonus;
    } else if (position === 'Orta Saha') {
        goalPoints = goalAverage * 2; // ×2 gol çarpanı
        const goalDiffPerMatch = (totalTeamGoals - totalGoalsConceded) / totalMatches;
        const goalDiffNormalized = goalDiffPerMatch * normalizationFactor;
        const midfieldBonus = Math.min(8, Math.max(-4, goalDiffNormalized * 1.5));
        positionBonus = midfieldBonus;
    } else if (position === 'Forvet') {
        goalPoints = goalAverage * 1.75; // ×1.75 gol çarpanı (gol atması kolay)
        const teamGoalNormalized = avgTeamGoals * normalizationFactor;
        const forwardBonus = Math.min(5, teamGoalNormalized * 0.3);
        positionBonus = forwardBonus;
    } else {
        goalPoints = goalAverage * 2;
    }
    
    const mvpPoints = Math.min(mvpCount * 4, 12);
    const donkeyPenalty = donkeyCount * 2;
    
    const maxMatches = Math.max(...players.map(p => getPlayerMatchCountProfile(p.id)));
    const experienceRatio = totalMatches / Math.max(maxMatches, 1);
    let experiencePoints = experienceRatio * 30;
    
    const MIN_MATCHES = 5;
    
    // 5+ maç oynayanlara kazanma yüzdesi bonusu (max +10 puan)
    if (totalMatches >= MIN_MATCHES) {
        const winRateBonus = winRate * 10;
        experiencePoints += winRateBonus;
    }
    
    let matchPenalty = 1;
    if (totalMatches < MIN_MATCHES) {
        const missingMatches = MIN_MATCHES - totalMatches;
        matchPenalty = Math.max(0.4, 1 - (missingMatches * 0.15));
    }
    
    const basePoints = 30;
    
    let rawPower = basePoints + winPoints + goalPoints + positionBonus + mvpPoints + experiencePoints - donkeyPenalty;
    
    let power = Math.round(rawPower * matchPenalty);
    power = Math.max(30, Math.min(100, power));
    
    return power;
}

function getPlayerMatchCountProfile(playerId) {
    if (!matches || matches.length === 0) return 0;
    return matches.filter(match => 
        match.performances.some(p => p.playerId === playerId)
    ).length;
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
        
        // Fotoğrafa tıklandığında büyütme özelliği
        imageElement.style.cursor = 'pointer';
        imageElement.addEventListener('click', () => {
            enlargeProfilePhoto(imageElement.src, playerInfo.name);
        });
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
    // calculatePlayerStats'tan güncel veriyi al
    let playerStats = null;
    if (typeof calculatePlayerStats === 'function') {
        const allStats = calculatePlayerStats();
        if (Array.isArray(allStats)) {
            playerStats = allStats.find(s => s.id === currentPlayerId);
        }
    }
    
    // Oyuncunun attığı gol - önce seasonStats.goals kullan (enhanced-data-simple.js'den geliyor)
    const totalGoalsElement = document.getElementById('total-goals');
    if (totalGoalsElement) {
        const goals = seasonStats.goals || (playerStats ? playerStats.GF : 0);
        totalGoalsElement.textContent = goals;
    }
    
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
    
    // MVP sayısı - önce seasonStats.mvps kullan
    const totalMvpsElement = document.getElementById('total-mvps');
    if (totalMvpsElement) {
        const mvps = seasonStats.mvps || (playerStats ? playerStats.MVP : 0);
        totalMvpsElement.textContent = mvps;
    }
    
    // Haftanın Eşşeği sayısı
    const totalDonkeysElement = document.getElementById('total-donkeys');
    if (totalDonkeysElement) {
        // data.js'den eşşek sayısını hesapla
        let donkeyCount = 0;
        if (typeof matches !== 'undefined' && currentPlayerId) {
            matches.forEach(match => {
                if (match.esek_adam === currentPlayerId) {
                    donkeyCount++;
                }
            });
        }
        totalDonkeysElement.textContent = playerStats ? playerStats.DONKEY : donkeyCount;
    }
    
    // Maç başına gol hesaplama
    const goalsPerMatchElement = document.getElementById('goals-per-match');
    if (goalsPerMatchElement) {
        const matchCount = seasonStats.matchesPlayed || (playerStats ? playerStats.M : 0);
        const goalCount = seasonStats.goals || (playerStats ? playerStats.GF : 0);
        const goalsPerMatch = matchCount > 0 ? (goalCount / matchCount).toFixed(1) : '0.0';
        goalsPerMatchElement.textContent = goalsPerMatch;
    }
}

// Başarıları doldur
function populateAchievements(achievements) {
    const achievementsList = document.getElementById('achievements-list');
    if (!achievementsList || !Array.isArray(achievements)) return;
    
    achievementsList.innerHTML = '';
    
    if (achievements.length === 0) {
        // Başarı yoksa boş bırak
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

// Profil fotoğrafını büyüt
function enlargeProfilePhoto(imageSrc, playerName) {
    // Modal oluştur
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="photo-modal-content">
            <span class="photo-modal-close">&times;</span>
            <img src="${imageSrc}" alt="${playerName}" class="photo-modal-image">
            <p class="photo-modal-caption">${playerName}</p>
        </div>
    `;
    
    // Modal'ı sayfaya ekle
    document.body.appendChild(modal);
    
    // Modal'ı göster
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Kapatma fonksiyonu
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    // Kapatma butonuna tıklama
    const closeBtn = modal.querySelector('.photo-modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Modal dışına tıklama
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC tuşu ile kapatma
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
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
        
        initializePlayerPerformance(currentPlayerId);
    } else {
        
        // 1 saniye sonra tekrar dene
        setTimeout(() => {
            if (typeof initializePlayerPerformance === 'function') {
                
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
    
    
    
    // data.js'den oyuncuyu bul
    const player = (typeof players !== 'undefined') ? players.find(p => p.id === currentPlayerId) : null;
    
    
    
    if (!player) {
        
        // Oyuncu bulunamadı
        const nameElement = document.getElementById('player-name');
        if (nameElement) nameElement.textContent = 'Oyuncu Bulunamadı';
        return;
    }
    
    
    
    // Enhanced data'dan ek bilgileri al (varsa)
    const enhancedPlayer = (typeof enhancedPlayers !== 'undefined') ? 
        enhancedPlayers.find(p => p.id === currentPlayerId) : null;
    
    
    
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
    
    // Güç skorunu hesapla ve göster
    updatePlayerPower();
    
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
