// GENİŞLETİLMİŞ VERİ YAPISI - Mevcut data.js'nin üzerine eklenen özellikler

// SEZON YÖNETİMİ
const seasons = {
    current: '2025-2026',
    all: ['2024-2025', '2025-2026', '2026-2027']
};

// GENİŞLETİLMİŞ OYUNCU YAPISI
const enhancedPlayers = [
    { 
        id: 'onur_mustafa', 
        name: 'Onur Mustafa KÖSE',
        rating: 85, // 0-100 arası oyuncu gücü
        position: 'Forvet', // Mevki bilgisi
        profileImage: 'img/oyuncular/onur_mustafa.jpg', // Profil fotoğrafı
        birthDate: '1995-05-15', // Doğum tarihi
        joinDate: '2024-09-01', // Lige katılma tarihi
        favNumber: 10, // Favori forma numarası
        bio: 'Sağ ayak tercihi olan hızlı forvet. Takımın gol kralı.',
        socialMedia: {
            instagram: '@onurkose',
            twitter: '@onurkose'
        }
    },
    // ... diğer oyuncular benzer formatta
];

// SEZONLUK VERİ YAPISI
const seasonData = {
    '2024-2025': {
        matches: [
            // Geçmiş sezon maçları
        ],
        seasonStats: {
            topScorer: 'onur',
            topAssist: 'ensarb', 
            mostMVP: 'ahmets',
            totalGoals: 45,
            totalMatches: 12
        }
    },
    '2025-2026': {
        matches: [
            // Mevcut sezon maçları (mevcut matches dizisi buraya taşınır)
        ],
        seasonStats: {
            // Otomatik hesaplanacak
        }
    }
};

// GELECEK MAÇLAR YAPISI
const upcomingMatches = [
    {
        id: 'upcoming-1',
        date: '2025-10-25',
        time: '19:00',
        venue: 'Spor Kompleksi Sahası A',
        teamA: ['onur', 'ensarb', 'ahmets', 'burakk', 'emree', 'enes', 'omere'],
        teamB: ['furkans', 'furkany', 'ibrahim', 'tayyipb', 'muhammetc', 'muratcan', 'orhan'],
        predictions: [], // Kullanıcı tahminleri localStorage'da tutulacak
        isConfirmed: true
    }
];

// LİG REKORLAR YAPISI (Otomatik hesaplanacak)
const leagueRecords = {
    // Bu değerler calculateLeagueRecords() fonksiyonu ile otomatik doldurulacak
    mostGoalsInMatch: { playerId: '', goals: 0, matchId: 0 },
    longestWinStreak: { playerId: '', streak: 0 },
    longestUnbeatenStreak: { playerId: '', streak: 0 },
    bestGoalDifference: { playerId: '', difference: 0 },
    mostMVPs: { playerId: '', count: 0 },
    youngestScorer: { playerId: '', age: 0 },
    oldestScorer: { playerId: '', age: 0 }
};

// GRAFIK VERİLERİ İÇİN YARDIMCI FONKSİYONLAR
function getChartData(type, playerId = null, seasonId = null) {
    const targetSeason = seasonId || seasons.current;
    const matches = seasonData[targetSeason]?.matches || [];
    
    switch(type) {
        case 'goalsPerMatch':
            return calculateGoalsPerMatch(matches, playerId);
        case 'teamPerformance':
            return calculateTeamPerformance(matches);
        case 'playerComparison':
            return calculatePlayerComparison(matches);
        case 'seasonProgress':
            return calculateSeasonProgress(matches);
        default:
            return {};
    }
}

// GRAFİK HESAPLAMA FONKSİYONLARI
function calculateGoalsPerMatch(matches, playerId) {
    const labels = [];
    const data = [];
    
    matches.forEach((match, index) => {
        labels.push(`Maç ${index + 1}`);
        if (playerId) {
            const playerPerf = match.performances.find(p => p.playerId === playerId);
            data.push(playerPerf ? playerPerf.goals : 0);
        } else {
            const totalGoals = match.teamAGoals + match.teamBGoals;
            data.push(totalGoals);
        }
    });
    
    return { labels, data };
}

function calculateTeamPerformance(matches) {
    const teamStats = { A: { wins: 0, draws: 0, losses: 0 }, B: { wins: 0, draws: 0, losses: 0 } };
    
    matches.forEach(match => {
        if (match.teamAGoals > match.teamBGoals) {
            teamStats.A.wins++;
            teamStats.B.losses++;
        } else if (match.teamAGoals < match.teamBGoals) {
            teamStats.B.wins++;
            teamStats.A.losses++;
        } else {
            teamStats.A.draws++;
            teamStats.B.draws++;
        }
    });
    
    return teamStats;
}

function calculatePlayerComparison(matches) {
    const playerStats = {};
    
    matches.forEach(match => {
        match.performances.forEach(perf => {
            if (!playerStats[perf.playerId]) {
                playerStats[perf.playerId] = { goals: 0, assists: 0, mvps: 0 };
            }
            playerStats[perf.playerId].goals += perf.goals;
            playerStats[perf.playerId].assists += perf.assists;
            if (perf.mvp) playerStats[perf.playerId].mvps++;
        });
    });
    
    return playerStats;
}

function calculateSeasonProgress(matches) {
    const monthlyStats = {};
    
    matches.forEach(match => {
        const date = new Date(match.date.split('.').reverse().join('-'));
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { matches: 0, goals: 0 };
        }
        
        monthlyStats[monthKey].matches++;
        monthlyStats[monthKey].goals += match.teamAGoals + match.teamBGoals;
    });
    
    return monthlyStats;
}

// LİG REKORLARINI HESAPLAMA
function calculateLeagueRecords() {
    const allMatches = Object.values(seasonData).flatMap(season => season.matches || []);
    const records = { ...leagueRecords };
    
    // En çok gol atan maç
    allMatches.forEach(match => {
        match.performances.forEach(perf => {
            if (perf.goals > records.mostGoalsInMatch.goals) {
                records.mostGoalsInMatch = {
                    playerId: perf.playerId,
                    goals: perf.goals,
                    matchId: match.id
                };
            }
        });
    });
    
    // En uzun galibiyet serisi hesaplama
    const playerStreaks = {};
    enhancedPlayers.forEach(player => {
        playerStreaks[player.id] = { current: 0, longest: 0 };
    });
    
    allMatches.forEach(match => {
        const teamAResult = match.teamAGoals > match.teamBGoals ? 'W' : 
                          match.teamAGoals === match.teamBGoals ? 'D' : 'L';
        const teamBResult = teamAResult === 'W' ? 'L' : teamAResult === 'L' ? 'W' : 'D';
        
        match.performances.forEach(perf => {
            const result = perf.team === 'A' ? teamAResult : teamBResult;
            
            if (result === 'W') {
                playerStreaks[perf.playerId].current++;
                if (playerStreaks[perf.playerId].current > playerStreaks[perf.playerId].longest) {
                    playerStreaks[perf.playerId].longest = playerStreaks[perf.playerId].current;
                }
            } else {
                playerStreaks[perf.playerId].current = 0;
            }
        });
    });
    
    // En uzun galibiyet serisini bul
    Object.entries(playerStreaks).forEach(([playerId, streak]) => {
        if (streak.longest > records.longestWinStreak.streak) {
            records.longestWinStreak = {
                playerId,
                streak: streak.longest
            };
        }
    });
    
    return records;
}

// OYUNCU PROFİL VERİLERİNİ HESAPLAMA
function getPlayerProfileData(playerId, seasonId = null) {
    const targetSeason = seasonId || seasons.current;
    const matches = seasonData[targetSeason]?.matches || [];
    const player = enhancedPlayers.find(p => p.id === playerId);
    
    if (!player) return null;
    
    const stats = {
        basic: { ...player },
        season: calculatePlayerStats().find(p => p.id === playerId) || {},
        career: calculateCareerStats(playerId),
        chartData: {
            goalsPerMatch: getChartData('goalsPerMatch', playerId, seasonId),
            performanceTimeline: calculatePerformanceTimeline(playerId, matches)
        },
        achievements: calculatePlayerAchievements(playerId),
        comparisons: calculatePlayerComparisons(playerId)
    };
    
    return stats;
}

function calculateCareerStats(playerId) {
    const allMatches = Object.values(seasonData).flatMap(season => season.matches || []);
    let careerStats = {
        totalMatches: 0,
        totalGoals: 0,
        totalAssists: 0,
        totalMVPs: 0,
        totalWins: 0,
        averageGoalsPerMatch: 0,
        bestSeason: null
    };
    
    allMatches.forEach(match => {
        const perf = match.performances.find(p => p.playerId === playerId);
        if (perf) {
            careerStats.totalMatches++;
            careerStats.totalGoals += perf.goals;
            careerStats.totalAssists += perf.assists;
            if (perf.mvp) careerStats.totalMVPs++;
            
            // Galibiyet hesaplama
            const teamResult = perf.team === 'A' ? 
                (match.teamAGoals > match.teamBGoals ? 'W' : 
                 match.teamAGoals === match.teamBGoals ? 'D' : 'L') :
                (match.teamBGoals > match.teamAGoals ? 'W' : 
                 match.teamBGoals === match.teamAGoals ? 'D' : 'L');
            
            if (teamResult === 'W') careerStats.totalWins++;
        }
    });
    
    careerStats.averageGoalsPerMatch = careerStats.totalMatches > 0 ? 
        (careerStats.totalGoals / careerStats.totalMatches).toFixed(2) : 0;
    
    return careerStats;
}

function calculatePerformanceTimeline(playerId, matches) {
    const timeline = {
        labels: [],
        goals: [],
        assists: [],
        mvps: []
    };
    
    matches.forEach((match, index) => {
        const perf = match.performances.find(p => p.playerId === playerId);
        timeline.labels.push(`Maç ${index + 1}`);
        timeline.goals.push(perf ? perf.goals : 0);
        timeline.assists.push(perf ? perf.assists : 0);
        timeline.mvps.push(perf && perf.mvp ? 1 : 0);
    });
    
    return timeline;
}

function calculatePlayerAchievements(playerId) {
    const achievements = [];
    const playerStats = calculatePlayerStats().find(p => p.id === playerId);
    
    if (!playerStats) return achievements;
    
    // Başarı rozetleri
    if (playerStats.P === 1) achievements.push({ type: 'crown', title: 'Lig Lideri', description: 'Puan durumunda 1. sırada' });
    if (playerStats.GF >= 10) achievements.push({ type: 'fire', title: 'Golcü Kral', description: '10+ gol attı' });
    if (playerStats.MVP >= 3) achievements.push({ type: 'star', title: 'MVP Ustası', description: '3+ MVP ödülü' });
    if (playerStats.W >= 5) achievements.push({ type: 'trophy', title: 'Galibiyetçi', description: '5+ galibiyet' });
    
    return achievements;
}

function calculatePlayerComparisons(playerId) {
    const allStats = calculatePlayerStats();
    const playerStats = allStats.find(p => p.id === playerId);
    
    if (!playerStats) return {};
    
    return {
        rank: playerStats.P,
        totalPlayers: allStats.length,
        goalRank: allStats.sort((a, b) => b.GF - a.GF).findIndex(p => p.id === playerId) + 1,
        mvpRank: allStats.sort((a, b) => b.MVP - a.MVP).findIndex(p => p.id === playerId) + 1
    };
}

// EXPORT
// Bu veriler mevcut data.js dosyasına entegre edilecek veya ayrı dosya olarak import edilecek