// VERİ SAKLAMA VE YEDEKLEME SİSTEMİ

// Veri export/import işlemleri
const DATA_MANAGER = {
    // Veri tipleri
    DATA_TYPES: {
        FULL_BACKUP: 'full_backup',
        MATCHES_ONLY: 'matches_only',
        PLAYERS_ONLY: 'players_only',
        USER_DATA: 'user_data'
    },
    
    // Dosya formatları
    FORMATS: {
        JSON: 'json',
        CSV: 'csv'
    }
};

// Sayfa yüklendiğinde veri yönetimi araçlarını başlat
document.addEventListener('DOMContentLoaded', () => {
    createDataManagementPanel();
    initializeAutoBackup();
    loadBackupHistory();
});

// Veri yönetimi paneli oluştur
function createDataManagementPanel() {
    const dataManagementHTML = `
        <section class="data-management glassmorphism-card" style="display: none;">
            <h3 class="section-title">Veri Yönetimi <span class="icon">💾</span></h3>
            
            <div class="data-management-grid">
                <!-- Export Bölümü -->
                <div class="data-section">
                    <h4 class="data-section-title">📤 Veri Dışa Aktar</h4>
                    <div class="export-options">
                        <div class="export-option">
                            <label for="export-type">Veri Tipi:</label>
                            <select id="export-type" class="data-select">
                                <option value="full_backup">Tam Yedekleme</option>
                                <option value="matches_only">Sadece Maçlar</option>
                                <option value="players_only">Sadece Oyuncular</option>
                                <option value="user_data">Kullanıcı Verileri</option>
                            </select>
                        </div>
                        
                        <div class="export-option">
                            <label for="export-format">Format:</label>
                            <select id="export-format" class="data-select">
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                        
                        <div class="export-actions">
                            <button class="export-btn" onclick="exportData()">
                                <i class="fas fa-download"></i> Dışa Aktar
                            </button>
                            <button class="preview-btn" onclick="previewExportData()">
                                <i class="fas fa-eye"></i> Önizle
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Import Bölümü -->
                <div class="data-section">
                    <h4 class="data-section-title">📥 Veri İçe Aktar</h4>
                    <div class="import-options">
                        <div class="file-upload-area" id="file-upload-area">
                            <input type="file" id="import-file" accept=".json,.csv" style="display: none;">
                            <div class="upload-content">
                                <span class="upload-icon">📁</span>
                                <span class="upload-text">Dosya seçin veya sürükleyin</span>
                                <span class="upload-hint">JSON veya CSV formatında</span>
                            </div>
                        </div>
                        
                        <div class="import-options-controls">
                            <label class="import-option">
                                <input type="checkbox" id="merge-data" checked>
                                <span>Mevcut verilerle birleştir</span>
                            </label>
                            <label class="import-option">
                                <input type="checkbox" id="backup-before-import" checked>
                                <span>İçe aktarmadan önce yedekle</span>
                            </label>
                        </div>
                        
                        <div class="import-actions">
                            <button class="import-btn" onclick="triggerFileSelect()" disabled>
                                <i class="fas fa-upload"></i> İçe Aktar
                            </button>
                            <button class="validate-btn" onclick="validateImportFile()" disabled>
                                <i class="fas fa-check-circle"></i> Doğrula
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Yedekleme Geçmişi -->
                <div class="data-section">
                    <h4 class="data-section-title">🕐 Yedekleme Geçmişi</h4>
                    <div class="backup-history" id="backup-history">
                        <!-- Yedekleme geçmişi buraya gelecek -->
                    </div>
                    
                    <div class="backup-actions">
                        <button class="auto-backup-btn" onclick="toggleAutoBackup()">
                            <i class="fas fa-robot"></i> Otomatik Yedekleme: <span id="auto-backup-status">Kapalı</span>
                        </button>
                        <button class="clear-history-btn" onclick="clearBackupHistory()">
                            <i class="fas fa-trash"></i> Geçmişi Temizle
                        </button>
                    </div>
                </div>
                
                <!-- Veri Temizleme -->
                <div class="data-section">
                    <h4 class="data-section-title">🧹 Veri Temizleme</h4>
                    <div class="cleanup-options">
                        <button class="cleanup-btn" onclick="clearUserData()">
                            <i class="fas fa-user-times"></i> Kullanıcı Verilerini Temizle
                        </button>
                        <button class="cleanup-btn" onclick="clearPredictions()">
                            <i class="fas fa-crystal-ball"></i> Tahminleri Temizle
                        </button>
                        <button class="cleanup-btn" onclick="clearMVPVotes()">
                            <i class="fas fa-vote-yea"></i> MVP Oylarını Temizle
                        </button>
                        <button class="cleanup-btn danger" onclick="resetAllData()">
                            <i class="fas fa-exclamation-triangle"></i> Tüm Verileri Sıfırla
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Ana sayfaya ekle (sadece admin/geliştirici için)
    const topPlayers = document.querySelector('.top-players');
    if (topPlayers) {
        topPlayers.insertAdjacentHTML('afterend', dataManagementHTML);
    }
    
    // Event listener'ları ayarla
    setupDataManagementEvents();
}

// Event listener'ları ayarla
function setupDataManagementEvents() {
    // Dosya upload area için drag & drop
    const uploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('import-file');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Export format değiştiğinde CSV uyarısı
    const exportFormat = document.getElementById('export-format');
    if (exportFormat) {
        exportFormat.addEventListener('change', (e) => {
            if (e.target.value === 'csv') {
                showNotification('CSV formatı sadece tablo verilerini destekler.', 'warning');
            }
        });
    }
}

// EXPORT İŞLEMLERİ
function exportData() {
    const exportType = document.getElementById('export-type').value;
    const exportFormat = document.getElementById('export-format').value;
    
    let data;
    let filename;
    
    try {
        switch (exportType) {
            case 'full_backup':
                data = createFullBackup();
                filename = `halisaha_full_backup_${getTimestamp()}`;
                break;
            case 'matches_only':
                data = { matches, seasonData: seasonData || {} };
                filename = `halisaha_matches_${getTimestamp()}`;
                break;
            case 'players_only':
                data = { players, enhancedPlayers: enhancedPlayers || [] };
                filename = `halisaha_players_${getTimestamp()}`;
                break;
            case 'user_data':
                data = createUserDataBackup();
                filename = `halisaha_user_data_${getTimestamp()}`;
                break;
            default:
                throw new Error('Geçersiz export tipi');
        }
        
        if (exportFormat === 'csv') {
            downloadCSV(convertToCSV(data, exportType), `${filename}.csv`);
        } else {
            downloadJSON(data, `${filename}.json`);
        }
        
        // Yedekleme geçmişine ekle
        addToBackupHistory(exportType, exportFormat, filename);
        showNotification('Veri başarıyla dışa aktarıldı!', 'success');
        
    } catch (error) {
        console.error('Export hatası:', error);
        showNotification('Veri dışa aktarırken hata oluştu: ' + error.message, 'error');
    }
}

function createFullBackup() {
    return {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
            players: players || [],
            enhancedPlayers: enhancedPlayers || [],
            matches: matches || [],
            seasonData: seasonData || {},
            upcomingMatches: upcomingMatches || [],
            seasons: seasons || { current: '2025-2026', all: ['2025-2026'] }
        },
        userData: createUserDataBackup(),
        settings: {
            theme: userSettings?.theme || 'dark'
        }
    };
}

function createUserDataBackup() {
    return {
        predictions: getPredictions(),
        mvpVotes: getMVPVotes(),
        userSettings: userSettings || {},
        localStorage: {
            theme: localStorage.getItem(STORAGE_KEYS.USER_THEME),
            predictionPoints: localStorage.getItem(STORAGE_KEYS.PREDICTION_POINTS),
            userSettings: localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)
        }
    };
}

// CSV dönüştürme
function convertToCSV(data, exportType) {
    switch (exportType) {
        case 'matches_only':
            return convertMatchesToCSV(data.matches);
        case 'players_only':
            return convertPlayersToCSV(data.players || data.enhancedPlayers);
        case 'user_data':
            return convertUserDataToCSV(data);
        default:
            return convertFullDataToCSV(data);
    }
}

function convertMatchesToCSV(matches) {
    if (!matches || matches.length === 0) return 'Maç verisi bulunamadı';
    
    const headers = ['ID', 'Tarih', 'Takım A Gol', 'Takım B Gol', 'Kazanan', 'MVP'];
    const rows = matches.map(match => {
        const winner = match.teamAGoals > match.teamBGoals ? 'Takım A' :
                      match.teamBGoals > match.teamAGoals ? 'Takım B' : 'Berabere';
        const mvp = match.performances?.find(p => p.mvp)?.playerId || 'Yok';
        
        return [
            match.id,
            match.date,
            match.teamAGoals,
            match.teamBGoals,
            winner,
            mvp
        ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function convertPlayersToCSV(players) {
    if (!players || players.length === 0) return 'Oyuncu verisi bulunamadı';
    
    const headers = ['ID', 'Ad', 'Rating', 'Mevki', 'Forma No'];
    const rows = players.map(player => [
        player.id,
        player.name,
        player.rating || 75,
        player.position || 'Oyuncu',
        player.favNumber || 0
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Dosya indirme
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, filename);
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// IMPORT İŞLEMLERİ
function triggerFileSelect() {
    document.getElementById('import-file').click();
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processImportFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processImportFile(file);
    }
}

function processImportFile(file) {
    const validTypes = ['application/json', 'text/csv', 'text/plain'];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(json|csv)$/i)) {
        showNotification('Desteklenmeyen dosya formatı. JSON veya CSV dosyası seçin.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            const isJSON = file.name.toLowerCase().endsWith('.json');
            
            if (isJSON) {
                const data = JSON.parse(content);
                validateAndImportJSON(data);
            } else {
                validateAndImportCSV(content);
            }
            
        } catch (error) {
            console.error('Dosya okuma hatası:', error);
            showNotification('Dosya okuma hatası: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function validateAndImportJSON(data) {
    // Veri yapısını kontrol et
    if (!data || typeof data !== 'object') {
        throw new Error('Geçersiz JSON formatı');
    }
    
    // Backup before import seçeneği
    if (document.getElementById('backup-before-import').checked) {
        const backupData = createFullBackup();
        addToBackupHistory('auto_backup', 'json', `auto_backup_before_import_${getTimestamp()}`);
    }
    
    // Merge veya replace
    const shouldMerge = document.getElementById('merge-data').checked;
    
    if (data.version && data.data) {
        // Tam yedekleme dosyası
        importFullBackup(data, shouldMerge);
    } else if (data.matches) {
        // Sadece maçlar
        importMatches(data.matches, shouldMerge);
    } else if (data.players || data.enhancedPlayers) {
        // Sadece oyuncular
        importPlayers(data, shouldMerge);
    } else if (data.predictions || data.mvpVotes) {
        // Kullanıcı verileri
        importUserData(data, shouldMerge);
    } else {
        throw new Error('Tanınmayan veri formatı');
    }
    
    showNotification('Veri başarıyla içe aktarıldı!', 'success');
    
    // Sayfayı yenile
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

function importFullBackup(data, shouldMerge) {
    if (data.data.players) {
        importPlayers({ players: data.data.players, enhancedPlayers: data.data.enhancedPlayers }, shouldMerge);
    }
    
    if (data.data.matches) {
        importMatches(data.data.matches, shouldMerge);
    }
    
    if (data.userData) {
        importUserData(data.userData, shouldMerge);
    }
    
    if (data.settings && data.settings.theme) {
        userSettings.theme = data.settings.theme;
        applyTheme(data.settings.theme);
        saveUserSettings();
    }
}

function importMatches(newMatches, shouldMerge) {
    if (!Array.isArray(newMatches)) return;
    
    if (shouldMerge) {
        // Mevcut maçlarla birleştir
        const existingIds = matches.map(m => m.id);
        const uniqueMatches = newMatches.filter(m => !existingIds.includes(m.id));
        matches.push(...uniqueMatches);
    } else {
        // Değiştir
        window.matches = newMatches;
    }
}

function importPlayers(data, shouldMerge) {
    if (data.players && Array.isArray(data.players)) {
        if (shouldMerge) {
            const existingIds = players.map(p => p.id);
            const uniquePlayers = data.players.filter(p => !existingIds.includes(p.id));
            players.push(...uniquePlayers);
        } else {
            window.players = data.players;
        }
    }
    
    if (data.enhancedPlayers && Array.isArray(data.enhancedPlayers)) {
        if (shouldMerge && window.enhancedPlayers) {
            const existingIds = enhancedPlayers.map(p => p.id);
            const uniquePlayers = data.enhancedPlayers.filter(p => !existingIds.includes(p.id));
            enhancedPlayers.push(...uniquePlayers);
        } else {
            window.enhancedPlayers = data.enhancedPlayers;
        }
    }
}

function importUserData(data, shouldMerge) {
    if (data.predictions) {
        const predictions = shouldMerge ? [...getPredictions(), ...data.predictions] : data.predictions;
        localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(predictions));
    }
    
    if (data.mvpVotes) {
        const votes = shouldMerge ? [...getMVPVotes(), ...data.mvpVotes] : data.mvpVotes;
        localStorage.setItem(STORAGE_KEYS.MVP_VOTES, JSON.stringify(votes));
    }
    
    if (data.userSettings) {
        if (shouldMerge) {
            userSettings = { ...userSettings, ...data.userSettings };
        } else {
            userSettings = data.userSettings;
        }
        saveUserSettings();
    }
}

// YEDEKLEME GEÇMİŞİ
function addToBackupHistory(type, format, filename) {
    const history = getBackupHistory();
    const entry = {
        id: Date.now(),
        type,
        format,
        filename,
        timestamp: new Date().toISOString(),
        size: 0 // Dosya boyutu hesaplanabilir
    };
    
    history.unshift(entry);
    
    // Maksimum 20 kayıt tut
    if (history.length > 20) {
        history.splice(20);
    }
    
    localStorage.setItem('halisaha_backup_history', JSON.stringify(history));
    loadBackupHistory();
}

function getBackupHistory() {
    const stored = localStorage.getItem('halisaha_backup_history');
    return stored ? JSON.parse(stored) : [];
}

function loadBackupHistory() {
    const history = getBackupHistory();
    const container = document.getElementById('backup-history');
    
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '<p class="no-backups">Henüz yedekleme yapılmamış.</p>';
        return;
    }
    
    container.innerHTML = history.map(entry => `
        <div class="backup-entry">
            <div class="backup-info">
                <span class="backup-name">${entry.filename}</span>
                <span class="backup-meta">${formatBackupType(entry.type)} • ${entry.format.toUpperCase()} • ${formatDate(entry.timestamp)}</span>
            </div>
            <div class="backup-actions">
                <button class="backup-download-btn" onclick="redownloadBackup('${entry.id}')" title="Yeniden İndir">
                    <i class="fas fa-download"></i>
                </button>
                <button class="backup-delete-btn" onclick="deleteBackupEntry('${entry.id}')" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// OTOMATİK YEDEKLEME
function initializeAutoBackup() {
    const isEnabled = localStorage.getItem('halisaha_auto_backup') === 'true';
    updateAutoBackupStatus(isEnabled);
    
    if (isEnabled) {
        startAutoBackup();
    }
}

function toggleAutoBackup() {
    const isEnabled = localStorage.getItem('halisaha_auto_backup') === 'true';
    const newStatus = !isEnabled;
    
    localStorage.setItem('halisaha_auto_backup', newStatus.toString());
    updateAutoBackupStatus(newStatus);
    
    if (newStatus) {
        startAutoBackup();
        showNotification('Otomatik yedekleme etkinleştirildi.', 'success');
    } else {
        showNotification('Otomatik yedekleme devre dışı bırakıldı.', 'info');
    }
}

function updateAutoBackupStatus(isEnabled) {
    const statusElement = document.getElementById('auto-backup-status');
    if (statusElement) {
        statusElement.textContent = isEnabled ? 'Açık' : 'Kapalı';
    }
}

function startAutoBackup() {
    // Her 24 saatte bir otomatik yedekleme
    setInterval(() => {
        const lastBackup = localStorage.getItem('halisaha_last_auto_backup');
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (!lastBackup || (now - parseInt(lastBackup)) > dayInMs) {
            const backupData = createFullBackup();
            addToBackupHistory('auto_backup', 'json', `auto_backup_${getTimestamp()}`);
            localStorage.setItem('halisaha_last_auto_backup', now.toString());
        }
    }, 60 * 60 * 1000); // Her saat kontrol et
}

// VERİ TEMİZLEME
function clearUserData() {
    if (confirm('Kullanıcı verilerini temizlemek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        
        userSettings = {
            theme: 'dark',
            username: 'Misafir',
            predictionPoints: 0,
            totalPredictions: 0,
            correctPredictions: 0
        };
        
        showNotification('Kullanıcı verileri temizlendi.', 'success');
        setTimeout(() => window.location.reload(), 1000);
    }
}

function clearPredictions() {
    if (confirm('Tüm tahminleri silmek istediğinizden emin misiniz?')) {
        localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
        showNotification('Tahminler temizlendi.', 'success');
    }
}

function clearMVPVotes() {
    if (confirm('Tüm MVP oylarını silmek istediğinizden emin misiniz?')) {
        localStorage.removeItem(STORAGE_KEYS.MVP_VOTES);
        showNotification('MVP oyları temizlendi.', 'success');
    }
}

function resetAllData() {
    const confirmation = prompt('Tüm verileri sıfırlamak için "SIFIRLA" yazın:');
    if (confirmation === 'SIFIRLA') {
        localStorage.clear();
        showNotification('Tüm veriler sıfırlandı. Sayfa yenileniyor...', 'success');
        setTimeout(() => window.location.reload(), 2000);
    }
}

function clearBackupHistory() {
    if (confirm('Yedekleme geçmişini temizlemek istediğinizden emin misiniz?')) {
        localStorage.removeItem('halisaha_backup_history');
        loadBackupHistory();
        showNotification('Yedekleme geçmişi temizlendi.', 'success');
    }
}

// YARDIMCI FONKSİYONLAR
function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

function formatBackupType(type) {
    const types = {
        'full_backup': 'Tam Yedekleme',
        'matches_only': 'Maçlar',
        'players_only': 'Oyuncular',
        'user_data': 'Kullanıcı Verileri',
        'auto_backup': 'Otomatik Yedekleme'
    };
    return types[type] || type;
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Veri yönetimi panelini göster/gizle (admin için)
function toggleDataManagement() {
    const panel = document.querySelector('.data-management');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

// Geliştirici konsol komutu
window.showDataManagement = toggleDataManagement;

// Veri önizleme fonksiyonu
function previewExportData() {
    const data = {
        players: players,
        matches: matches,
        exportDate: new Date().toISOString()
    };
    
    
    alert(`Veri Önizlemesi:\n- ${data.players.length} oyuncu\n- ${data.matches.length} maç\n- Dışa aktarma tarihi: ${new Date().toLocaleDateString('tr-TR')}`);
}

// Dosya doğrulama fonksiyonu
function validateImportFile(file) {
    if (!file) {
        alert('Lütfen bir dosya seçin.');
        return false;
    }
    
    if (file.type !== 'application/json') {
        alert('Sadece JSON dosyaları desteklenir.');
        return false;
    }
    
    
    return true;
}

// Export fonksiyonları
window.exportData = exportData;
window.previewExportData = previewExportData;
window.triggerFileSelect = triggerFileSelect;
window.validateImportFile = validateImportFile;
window.toggleAutoBackup = toggleAutoBackup;
window.clearUserData = clearUserData;
window.clearPredictions = clearPredictions;
window.clearMVPVotes = clearMVPVotes;
window.resetAllData = resetAllData;
window.clearBackupHistory = clearBackupHistory;
