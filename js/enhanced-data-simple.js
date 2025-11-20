// BASIT GENİŞLETİLMİŞ VERİ YAPISI - Sadece data.js'deki maçları kullanır

// GENİŞLETİLMİŞ OYUNCU YAPISI
const enhancedPlayers = [
    { 
        id: 'onur_mustafa', 
        name: 'Onur Mustafa KÖSE',
        rating: 85, 
        position: 'Defans', 
        profileImage: 'img/oyuncular/onur_mustafa.jpg', 
        birthDate: '1995-05-15', 
        joinDate: '2024-09-01', 
        favNumber: 10, 
        bio: 'Savunmada güvenilir, hızlı müdahaleleri ile dikkat çeken defans oyuncusu.',
        socialMedia: {
            instagram: '@onurkose',
            twitter: '@onurkose'
        }
    }
    // Diğer oyuncular için enhanced data eklenebilir
];

/**
 * Basitleştirilmiş oyuncu profil verisi - sadece data.js'deki maçları kullanır
 */
function getPlayerProfileData(playerId) {
    const player = players.find(p => p.id === playerId);
    const enhanced = enhancedPlayers.find(p => p.id === playerId);
    
    if (!player) return null;
    
    // Oyuncunun oynadığı maçları bul (data.js'den)
    const playerMatches = matches.filter(match => 
        match.performances && match.performances.some(perf => perf.playerId === playerId)
    );
    
    // İstatistikleri hesapla
    let totalGoals = 0;
    let totalMVPs = 0;
    let teamGoalsFor = 0;
    let teamGoalsAgainst = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    
    playerMatches.forEach(match => {
        const playerPerf = match.performances.find(p => p.playerId === playerId);
        if (playerPerf) {
            totalGoals += playerPerf.goals || 0;
            if (playerPerf.weeklyMVP) totalMVPs++;
            
            // Takım bazlı istatistikler
            if (playerPerf.team === 'A') {
                teamGoalsFor += match.teamAGoals || 0;
                teamGoalsAgainst += match.teamBGoals || 0;
                if (match.teamAGoals > match.teamBGoals) wins++;
                else if (match.teamAGoals < match.teamBGoals) losses++;
                else draws++;
            } else if (playerPerf.team === 'B') {
                teamGoalsFor += match.teamBGoals || 0;
                teamGoalsAgainst += match.teamAGoals || 0;
                if (match.teamBGoals > match.teamAGoals) wins++;
                else if (match.teamBGoals < match.teamAGoals) losses++;
                else draws++;
            }
        }
    });
    
    const matchesPlayed = playerMatches.length;
    const goalDifference = teamGoalsFor - teamGoalsAgainst;
    
    return {
        basic: {
            name: player.name,
            position: enhanced?.position || player.mevki || 'Bilinmiyor',
            profileImage: enhanced?.profileImage || `img/oyuncular/${player.id}.jpg`,
            rating: enhanced?.rating || Math.floor(Math.random() * 20) + 70,
            favNumber: enhanced?.favNumber || Math.floor(Math.random() * 99) + 1,
            bio: enhanced?.bio || 'Halısaha ligi oyuncusu.',
            birthDate: enhanced?.birthDate,
            joinDate: enhanced?.joinDate,
            socialMedia: enhanced?.socialMedia
        },
        season: {
            matchesPlayed,
            goals: totalGoals,
            mvps: totalMVPs,
            teamGoalsFor,
            teamGoalsAgainst,
            goalDifference,
            wins,
            losses,
            draws,
            avgGoals: matchesPlayed > 0 ? (totalGoals / matchesPlayed).toFixed(1) : '0.0',
            avgTeamGoalsFor: matchesPlayed > 0 ? (teamGoalsFor / matchesPlayed).toFixed(1) : '0.0',
            avgTeamGoalsAgainst: matchesPlayed > 0 ? (teamGoalsAgainst / matchesPlayed).toFixed(1) : '0.0'
        },
        career: {
            // Kariyer = sezon (tek sezon olduğu için aynı)
            matchesPlayed,
            goals: totalGoals,
            mvps: totalMVPs,
            teamGoalsFor,
            teamGoalsAgainst,
            goalDifference,
            wins,
            losses,
            draws
        },
        achievements: [], 
        comparisons: [], 
        chartData: {
            goalsPerMatch: generateGoalsChartData(playerMatches, playerId),
            performanceTimeline: generatePerformanceTimelineData(playerMatches, playerId)
        }
    };
}

/**
 * Maç başına gol grafiği verisi
 */
function generateGoalsChartData(playerMatches, playerId) {
    const labels = [];
    const data = [];
    
    playerMatches.forEach((match, index) => {
        const playerPerf = match.performances.find(p => p.playerId === playerId);
        labels.push(`Maç ${index + 1}`);
        data.push(playerPerf?.goals || 0);
    });
    
    return { labels, data };
}

/**
 * Performans zaman çizelgesi verisi
 */
function generatePerformanceTimelineData(playerMatches, playerId) {
    const labels = [];
    const goals = [];
    const mvps = [];
    
    playerMatches.forEach((match, index) => {
        const playerPerf = match.performances.find(p => p.playerId === playerId);
        labels.push(`Maç ${index + 1}`);
        goals.push(playerPerf?.goals || 0);
        mvps.push(playerPerf?.weeklyMVP ? 1 : 0);
    });
    
    return { labels, goals, mvps };
}