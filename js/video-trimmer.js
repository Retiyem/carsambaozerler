/**
 * Video Kırpma ve İndirme Fonksiyonalitesi
 * Son Maç Videosu bölümü için gelişmiş video kırpma özellikleri
 */

class VideoTrimmer {
    constructor() {
        this.video = null;
        this.timelineSlider = null;
        this.startMarker = null;
        this.endMarker = null;
        this.startTimeInput = null;
        this.endTimeInput = null;
        this.currentTimeDisplay = null;
        this.totalTimeDisplay = null;
        this.timelineProgress = null;
        
        // Kırpma değerleri
        this.trimStart = 0;
        this.trimEnd = 0;
        this.videoDuration = 0;
        
        // Preview kontrolü
        this.previewInterval = null;
        
        this.init();
    }
    
    init() {
        // DOM elementlerini bul
        this.video = document.getElementById('matchVideo');
        this.timelineSlider = document.getElementById('timelineSlider');
        this.startMarker = document.querySelector('.start-marker');
        this.endMarker = document.querySelector('.end-marker');
        this.startTimeInput = document.getElementById('trimStart');
        this.endTimeInput = document.getElementById('trimEnd');
        this.currentTimeDisplay = document.querySelector('.current-time');
        this.totalTimeDisplay = document.querySelector('.total-time');
        this.timelineProgress = document.querySelector('.timeline-progress');
        
        if (!this.video) {
            console.error('Video element bulunamadı! DOM hazır mı?');
            // Biraz bekleyip tekrar dene
            setTimeout(() => {
                this.init();
            }, 1000);
            return;
        }
        
        console.log('Video trimmer başarıyla başlatıldı');
        console.log('Video src:', this.video.src);
        console.log('Video ready state:', this.video.readyState);
        
        // MediaRecorder desteğini kontrol et
        if (typeof MediaRecorder === 'undefined') {
            console.error('MediaRecorder desteklenmiyor!');
            this.showNotification('Tarayıcınız video kırpma özelliğini desteklemiyor', 'error');
        } else {
            console.log('MediaRecorder destekleniyor');
            
            // Desteklenen formatları göster - MP4 öncelikli kontrol
            const formats = ['video/mp4', 'video/webm;codecs=h264', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
            let mp4Supported = false;
            
            formats.forEach(format => {
                if (MediaRecorder.isTypeSupported(format)) {
                    console.log(`✅ Desteklenen format: ${format}`);
                    if (format.includes('mp4')) mp4Supported = true;
                } else {
                    console.log(`❌ Desteklenmeyen format: ${format}`);
                }
            });
            
            if (mp4Supported) {
                console.log('🎉 MP4 formatında video indirilebilecek!');
                this.showNotification('Video MP4 formatında indirilebilir', 'success');
            } else {
                console.log('⚠️ MP4 desteklenmiyor, WebM formatında indirilecek');
                this.showNotification('Video WebM formatında indirilecek (MP4 desteklenmiyor)', 'info');
            }
        }
        
        // Event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Video yüklendiğinde
        this.video.addEventListener('loadedmetadata', () => {
            this.videoDuration = this.video.duration;
            console.log('Video metadata yüklendi, süre:', this.videoDuration);
            this.initializeControls();
            this.updateTimeDisplay();
        });
        
        // Eğer video zaten yüklüyse
        if (this.video.readyState >= 1 && this.video.duration > 0) {
            this.videoDuration = this.video.duration;
            console.log('Video zaten yüklü, süre:', this.videoDuration);
            this.initializeControls();
            this.updateTimeDisplay();
        }
        
        // Video oynatılırken
        this.video.addEventListener('timeupdate', () => {
            this.updateTimeline();
            this.updateTimeDisplay();
        });
        
        // Timeline slider değişikliği
        if (this.timelineSlider) {
            this.timelineSlider.addEventListener('input', (e) => {
                const time = (e.target.value / 100) * this.videoDuration;
                this.video.currentTime = time;
            });
        }
        
        // Trim input değişiklikleri
        if (this.startTimeInput) {
            this.startTimeInput.addEventListener('change', () => {
                this.trimStart = this.parseTimeInput(this.startTimeInput.value);
                this.updateMarkers();
                this.validateTrimValues();
            });
        }
        
        if (this.endTimeInput) {
            this.endTimeInput.addEventListener('change', () => {
                this.trimEnd = this.parseTimeInput(this.endTimeInput.value);
                this.updateMarkers();
                this.validateTrimValues();
            });
        }
        
        // Action buttons
        const previewBtn = document.getElementById('preview-trim');
        const downloadBtn = document.getElementById('download-trim');
        const setStartBtn = document.getElementById('set-start-current');
        const setEndBtn = document.getElementById('set-end-current');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewTrimmedVideo());
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadTrimmedVideo());
        }
        
        if (setStartBtn) {
            setStartBtn.addEventListener('click', () => {
                this.trimStart = this.video.currentTime;
                if (this.startTimeInput) {
                    this.startTimeInput.value = this.formatTime(this.trimStart);
                }
                this.validateTrimValues();
                this.showNotification('Başlangıç zamanı ayarlandı: ' + this.formatTime(this.trimStart), 'success');
            });
        }
        
        if (setEndBtn) {
            setEndBtn.addEventListener('click', () => {
                this.trimEnd = this.video.currentTime;
                if (this.endTimeInput) {
                    this.endTimeInput.value = this.formatTime(this.trimEnd);
                }
                this.validateTrimValues();
                this.showNotification('Bitiş zamanı ayarlandı: ' + this.formatTime(this.trimEnd), 'success');
            });
        }
        
        // Video üzerine tıklama - play/pause
        this.video.addEventListener('click', () => {
            if (this.video.paused) {
                this.video.play();
            } else {
                this.video.pause();
            }
        });
        
        // Klavye kısayolları
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.video.paused ? this.video.play() : this.video.pause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.video.currentTime = Math.max(0, this.video.currentTime - 5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.video.currentTime = Math.min(this.videoDuration, this.video.currentTime + 5);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.video.currentTime = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    this.video.currentTime = this.videoDuration;
                    break;
            }
        });
    }
    
    initializeControls() {
        // Başlangıç değerleri
        this.trimStart = 0;
        this.trimEnd = this.videoDuration;
        
        // Timeline slider max değeri
        if (this.timelineSlider) {
            this.timelineSlider.max = 100;
            this.timelineSlider.value = 0;
        }
        
        // Input alanlarını doldur
        if (this.startTimeInput) {
            this.startTimeInput.value = this.formatTime(this.trimStart);
        }
        
        if (this.endTimeInput) {
            this.endTimeInput.value = this.formatTime(this.trimEnd);
        }
        
        // Markerları yerleştir ve duration'ı güncelle
        this.updateMarkers();
        this.updateDurationDisplay();
        
        console.log(`Video başlatıldı: ${this.formatTime(this.videoDuration)} süre, ${this.video.videoWidth}x${this.video.videoHeight} boyut`);
    }
    
    updateTimeline() {
        if (!this.timelineSlider || !this.timelineProgress) return;
        
        const progress = (this.video.currentTime / this.videoDuration) * 100;
        this.timelineSlider.value = progress;
        this.timelineProgress.style.width = progress + '%';
    }
    
    updateTimeDisplay() {
        if (this.currentTimeDisplay) {
            this.currentTimeDisplay.textContent = this.formatTime(this.video.currentTime);
        }
        
        if (this.totalTimeDisplay) {
            this.totalTimeDisplay.textContent = this.formatTime(this.videoDuration);
        }
    }
    
    updateMarkers() {
        if (!this.startMarker || !this.endMarker || !this.videoDuration) return;
        
        const startPercent = (this.trimStart / this.videoDuration) * 100;
        const endPercent = (this.trimEnd / this.videoDuration) * 100;
        
        this.startMarker.style.left = startPercent + '%';
        this.endMarker.style.left = endPercent + '%';
    }
    
    parseTimeInput(timeString) {
        // Format: MM:SS veya HH:MM:SS
        const parts = timeString.split(':').map(part => parseInt(part) || 0);
        
        if (parts.length === 2) {
            // MM:SS
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            // HH:MM:SS
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        
        return 0;
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    validateTrimValues() {
        // Başlangıç ve bitiş değerlerini doğrula
        this.trimStart = Math.max(0, Math.min(this.trimStart, this.videoDuration));
        this.trimEnd = Math.max(this.trimStart + 0.5, Math.min(this.trimEnd, this.videoDuration));
        
        // Minimum 0.5 saniye, maksimum video süresi kontrolü
        if (this.trimEnd - this.trimStart < 0.5) {
            this.trimEnd = Math.min(this.trimStart + 0.5, this.videoDuration);
        }
        
        // Input alanlarını güncelle
        if (this.startTimeInput) {
            this.startTimeInput.value = this.formatTime(this.trimStart);
        }
        
        if (this.endTimeInput) {
            this.endTimeInput.value = this.formatTime(this.trimEnd);
        }
        
        this.updateMarkers();
        this.updateDurationDisplay();
    }
    
    updateDurationDisplay() {
        const duration = this.trimEnd - this.trimStart;
        const durationElement = document.getElementById('selected-duration');
        
        if (durationElement) {
            durationElement.textContent = `${duration.toFixed(1)} saniye`;
        }
        
        // Download butonu durumu
        const downloadBtn = document.getElementById('download-trim');
        if (downloadBtn) {
            if (duration >= 0.5 && duration <= this.videoDuration) {
                downloadBtn.disabled = false;
                downloadBtn.style.opacity = '1';
            } else {
                downloadBtn.disabled = true;
                downloadBtn.style.opacity = '0.5';
            }
        }
    }
    
    previewTrimmedVideo() {
        if (this.trimEnd <= this.trimStart) {
            this.showNotification('Geçerli bir aralık seçin!', 'error');
            return;
        }
        
        // Video kontrolü
        if (!this.video || this.video.readyState < 2) {
            this.showNotification('Video henüz yüklenmedi, lütfen bekleyin', 'error');
            return;
        }
        
        // Mevcut preview'i durdur
        if (this.previewInterval) {
            clearInterval(this.previewInterval);
            this.previewInterval = null;
        }
        
        // Video'yu başlangıç noktasına götür
        this.video.currentTime = this.trimStart;
        
        // Kısa bir beklemeden sonra oynat
        setTimeout(() => {
            this.video.play();
            
            // Sürekli kontrol et
            this.previewInterval = setInterval(() => {
                if (this.video.currentTime >= this.trimEnd) {
                    this.video.pause();
                    this.video.currentTime = this.trimStart;
                    clearInterval(this.previewInterval);
                    this.previewInterval = null;
                    
                    this.showNotification('Önizleme tamamlandı', 'success');
                }
            }, 100); // Her 100ms kontrol et
            
        }, 200);
        
        const duration = (this.trimEnd - this.trimStart).toFixed(1);
        this.showNotification(`Önizleme başladı (${duration}s)`, 'info');
    }
    
    async downloadTrimmedVideo() {
        // Temel kontroller
        if (!this.video) {
            this.showNotification('Video element bulunamadı!', 'error');
            return;
        }
        
        if (this.trimEnd <= this.trimStart) {
            this.showNotification('Bitiş zamanı başlangıç zamanından büyük olmalıdır!', 'error');
            return;
        }
        
        const duration = this.trimEnd - this.trimStart;
        if (duration < 0.5) {
            this.showNotification('En az 0.5 saniye seçmelisiniz!', 'error');
            return;
        }
        
        // Video hazır mı kontrol et
        if (this.video.readyState < 2) {
            this.showNotification('Video henüz yüklenmedi, lütfen bekleyin...', 'error');
            return;
        }
        
        console.log('Download işlemi başlatılıyor...');
        console.log('Trim Start:', this.trimStart, 'Trim End:', this.trimEnd);
        console.log('Duration:', duration);
        
        // Loading göster
        this.showProcessingOverlay(true, 'Video hazırlanıyor...', `${duration.toFixed(1)} saniye işlenecek`);
        
        try {
            // En basit yöntemle başla
            await this.ultraSimpleVideoTrim();
        } catch (error) {
            console.error('Ultra simple trim hatası:', error);
            
            try {
                this.showProcessingOverlay(true, 'Alternatif yöntem deneniyor...', 'Lütfen bekleyin...');
                await this.simpleVideoTrim();
            } catch (simpleError) {
                console.error('Simple trim hatası:', simpleError);
                
                try {
                    this.showProcessingOverlay(true, 'Son yöntem deneniyor...', 'Lütfen bekleyin...');
                    await this.fallbackVideoTrim();
                } catch (fallbackError) {
                    console.error('Tüm yöntemler başarısız:', fallbackError);
                    this.showNotification('Video kırpma başarısız. Tarayıcınız bu özelliği desteklemiyor olabilir.', 'error');
                }
            }
        } finally {
            this.showProcessingOverlay(false);
        }
    }
    
    // En basit video kırpma yöntemi - garantili çalışır
    async ultraSimpleVideoTrim() {
        return new Promise((resolve, reject) => {
            console.log('Ultra basit video kırpma başlatılıyor...');
            
            try {
                // Sadece temel HTML5 video işlevi kullan
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Küçük boyut - performans için
                canvas.width = 320;
                canvas.height = 180;
                
                console.log('Canvas oluşturuldu:', canvas.width, 'x', canvas.height);
                
                // MediaRecorder - format kontrolü ile
                const stream = canvas.captureStream(5); // Çok düşük FPS
                
                // MP4 desteği kontrolü
                let recorder;
                let outputFormat = 'webm';
                let mimeType = 'video/webm';
                
                // Önce MP4 dene
                if (MediaRecorder.isTypeSupported('video/mp4')) {
                    mimeType = 'video/mp4';
                    outputFormat = 'mp4';
                    console.log('MP4 formatı destekleniyor');
                } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
                    mimeType = 'video/webm; codecs=vp9';
                    console.log('WebM VP9 formatı kullanılıyor');
                } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp8')) {
                    mimeType = 'video/webm; codecs=vp8';
                    console.log('WebM VP8 formatı kullanılıyor');
                } else {
                    console.log('Varsayılan WebM formatı kullanılıyor');
                }
                
                recorder = new MediaRecorder(stream, { mimeType: mimeType });
                const chunks = [];
                
                console.log('MediaRecorder oluşturuldu, format:', outputFormat);
                
                recorder.ondataavailable = (event) => {
                    console.log('Data available:', event.data.size, 'bytes');
                    chunks.push(event.data);
                };
                
                recorder.onstop = () => {
                    console.log('Kayıt durdu, chunk sayısı:', chunks.length);
                    
                    if (chunks.length === 0) {
                        reject(new Error('Kayıt verisi oluşmadı'));
                        return;
                    }
                    
                    const blob = new Blob(chunks, { type: mimeType });
                    console.log('Blob oluşturuldu, boyut:', blob.size, 'format:', outputFormat);
                    
                    // Dosyayı doğru uzantıyla indir
                    const filename = `kirpilmis-video-${Date.now()}.${outputFormat}`;
                    this.downloadBlob(blob, filename);
                    this.showNotification(`Video kaydedildi! (${chunks.length} parça)`, 'success');
                    resolve();
                };
                
                recorder.onerror = (error) => {
                    console.error('Recorder hatası:', error);
                    reject(error);
                };
                
                // Çok basit kayıt döngüsü
                const duration = this.trimEnd - this.trimStart;
                const durationMs = duration * 1000;
                let startTime = performance.now();
                
                console.log('Kayıt başlatılıyor, süre:', duration, 'saniye');
                
                // Video pozisyonunu ayarla
                this.video.currentTime = this.trimStart;
                
                // Kayda başla
                recorder.start(500); // Her 500ms chunk
                
                const captureLoop = () => {
                    const elapsed = performance.now() - startTime;
                    
                    if (elapsed >= durationMs) {
                        console.log('Süre doldu, kayıt durduruluyor');
                        recorder.stop();
                        return;
                    }
                    
                    // Canvas'a çiz
                    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                    
                    // Progress güncelle
                    const progress = (elapsed / durationMs) * 100;
                    this.updateProcessingProgress(progress);
                    
                    // Devam et
                    setTimeout(captureLoop, 200); // 200ms aralıkla
                };
                
                // Döngüyü başlat
                setTimeout(captureLoop, 100);
                
                // Güvenlik timeout
                setTimeout(() => {
                    if (recorder.state === 'recording') {
                        console.log('Güvenlik timeout, kayıt durduruluyor');
                        recorder.stop();
                    }
                }, durationMs + 2000);
                
            } catch (error) {
                console.error('Ultra simple trim hatası:', error);
                reject(error);
            }
        });
    }
    
        // Çalışan video kırpma yöntemi
    async simpleVideoTrim() {
        return new Promise((resolve, reject) => {
            console.log('Video kırpma başlatılıyor...');
            console.log('Video src:', this.video?.src);
            console.log('Video duration:', this.video?.duration);
            console.log('Stored duration:', this.videoDuration);
            console.log('Ready state:', this.video?.readyState);
            
            // Video kontrolü - daha esnek
            if (!this.video || !this.video.src) {
                reject(new Error('Video element bulunamadı'));
                return;
            }
            
            // Duration kontrolü - video.duration kullan
            const actualDuration = this.video.duration || this.videoDuration;
            if (!actualDuration || actualDuration === 0) {
                reject(new Error('Video süresi alınamadı'));
                return;
            }            const duration = this.trimEnd - this.trimStart;
            console.log(`Kırpılacak süre: ${duration.toFixed(2)}s (${this.trimStart.toFixed(2)}s - ${this.trimEnd.toFixed(2)}s)`);
            
            // Duration kontrolü
            if (duration <= 0) {
                reject(new Error('Geçersiz kırpma aralığı'));
                return;
            }
            
            // Canvas oluştur - tam boyut daha iyi sonuç verir
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Video boyutlarını al
            canvas.width = this.video.videoWidth || 640;
            canvas.height = this.video.videoHeight || 360;
            
            console.log(`Canvas boyutu: ${canvas.width}x${canvas.height}`);
            
            // MediaRecorder için stream oluştur
            const fps = 30; // Daha yüksek FPS daha iyi kalite
            const stream = canvas.captureStream(fps);
            
            // MediaRecorder ayarları
            const options = {
                videoBitsPerSecond: 5000000 // 5 Mbps daha iyi kalite (typo düzeltildi)
            };
            
            // Format seçimi - MP4 öncelikli
            let outputExtension = 'webm';
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                options.mimeType = 'video/mp4';
                outputExtension = 'mp4';
                console.log('MP4 formatı seçildi');
            } else if (MediaRecorder.isTypeSupported('video/webm; codecs=h264')) {
                options.mimeType = 'video/webm; codecs=h264';
                outputExtension = 'webm';
                console.log('WebM H264 formatı seçildi');
            } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
                options.mimeType = 'video/webm; codecs=vp9';
                outputExtension = 'webm';
                console.log('WebM VP9 formatı seçildi');
            } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp8')) {
                options.mimeType = 'video/webm; codecs=vp8';
                outputExtension = 'webm';
                console.log('WebM VP8 formatı seçildi');
            } else if (MediaRecorder.isTypeSupported('video/webm')) {
                options.mimeType = 'video/webm';
                outputExtension = 'webm';
                console.log('Varsayılan WebM formatı seçildi');
            }
            
            console.log('MediaRecorder ayarları:', options);
            
            const mediaRecorder = new MediaRecorder(stream, options);
            const recordedChunks = [];
            
            mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                    console.log(`Chunk eklendi: ${(event.data.size / 1024).toFixed(1)}KB`);
                }
            });
            
            mediaRecorder.addEventListener('stop', () => {
                console.log(`Kayıt tamamlandı. Toplam ${recordedChunks.length} chunk`);
                
                if (recordedChunks.length === 0) {
                    reject(new Error('Kayıt verisi bulunamadı'));
                    return;
                }
                
                const totalSize = recordedChunks.reduce((total, chunk) => total + chunk.size, 0);
                console.log(`Toplam boyut: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
                
                const blob = new Blob(recordedChunks, { 
                    type: mediaRecorder.mimeType || 'video/webm' 
                });
                
                // Dosya uzantısını mime type'a göre belirle
                const filename = `kirpilmis-video-${Date.now()}.${outputExtension}`;
                
                this.downloadBlob(blob, filename);
                this.showNotification(`Video başarıyla kırpıldı! (${duration.toFixed(1)}s, ${(blob.size / 1024 / 1024).toFixed(2)}MB)`, 'success');
                resolve();
            });
            
            mediaRecorder.addEventListener('error', (event) => {
                console.error('MediaRecorder hatası:', event.error);
                reject(new Error('MediaRecorder hatası: ' + event.error));
            });
            
            // Video'yu kırpma başlangıcına götür
            this.video.currentTime = this.trimStart;
            
            // Video ready olduğunda başlat
            const startRecording = () => {
                console.log('Kayıt başlatılıyor...');
                
                let animationId;
                let startTime = performance.now();
                const targetDuration = duration * 1000; // ms
                
                const renderLoop = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / targetDuration, 1);
                    
                    // Video zamanını güncelle
                    const videoTime = this.trimStart + (progress * duration);
                    this.video.currentTime = videoTime;
                    
                    // Canvas'a çiz
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                    
                    // Progress güncelle
                    this.updateProcessingProgress(progress * 100);
                    
                    if (progress < 1) {
                        animationId = requestAnimationFrame(renderLoop);
                    } else {
                        console.log('Kayıt süresi tamamlandı, durduruluyor...');
                        mediaRecorder.stop();
                    }
                };
                
                // Kayda başla
                mediaRecorder.start(100); // Her 100ms'de chunk oluştur
                animationId = requestAnimationFrame(renderLoop);
                
                // Güvenlik timeout'u
                setTimeout(() => {
                    if (mediaRecorder.state === 'recording') {
                        console.log('Güvenlik timeout - kayıt durduruluyor');
                        cancelAnimationFrame(animationId);
                        mediaRecorder.stop();
                    }
                }, targetDuration + 2000); // 2sn ekstra
            };
            
            // Video seeked olduğunda başlat
            if (this.video.readyState >= 2) {
                // Video zaten hazır
                setTimeout(startRecording, 100);
            } else {
                // Video yüklenene kadar bekle
                this.video.addEventListener('canplay', startRecording, { once: true });
            }
        });
    }
    
    // Alternatif video kırpma yöntemi - daha basit yaklaşım
    async fallbackVideoTrim() {
        return new Promise((resolve, reject) => {
            console.log('Alternatif video kırpma yöntemi başlatılıyor...');
            
            try {
                // Çok basit canvas kayıt yöntemi
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Küçük boyut - hız için
                canvas.width = 480;
                canvas.height = 270;
                
                const stream = canvas.captureStream(10); // Düşük FPS
                const recorder = new MediaRecorder(stream); // En basit ayarlar
                const chunks = [];
                
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };
                
                recorder.onstop = () => {
                    if (chunks.length === 0) {
                        reject(new Error('Kayıt verisi oluşturulamadı'));
                        return;
                    }
                    
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    this.downloadBlob(blob, `fallback-video-${Date.now()}.webm`);
                    this.showNotification('Alternatif yöntemle video kaydedildi', 'success');
                    resolve();
                };
                
                recorder.onerror = (e) => reject(e.error);
                
                // Basit timer tabanlı kayıt
                const duration = (this.trimEnd - this.trimStart) * 1000;
                let elapsed = 0;
                
                this.video.currentTime = this.trimStart;
                
                const captureFrame = () => {
                    if (elapsed >= duration) {
                        recorder.stop();
                        return;
                    }
                    
                    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
                    elapsed += 100;
                    
                    // Progress
                    this.updateProcessingProgress((elapsed / duration) * 100);
                    
                    setTimeout(captureFrame, 100);
                };
                
                recorder.start();
                setTimeout(() => {
                    this.video.play();
                    captureFrame();
                }, 500);
                
            } catch (error) {
                // Son çare - gerçekten video indirme işlemi yap
                console.log('Canvas yöntemi de başarısız, blob URL yöntemi deneniyor...');
                this.downloadOriginalVideoSection(resolve, reject);
            }
        });
    }
    
    // Son çare - orijinal videodan bölüm indirme
    downloadOriginalVideoSection(resolve, reject) {
        try {
            // Orijinal video dosyasını fetch et
            fetch(this.video.src)
                .then(response => response.blob())
                .then(blob => {
                    // Not: Bu gerçek kırpma değil, sadece orijinal video indirme
                    // Gerçek kırpma için FFmpeg.js gerekir
                    
                    const duration = this.trimEnd - this.trimStart;
                    const filename = `video-bolum-${this.trimStart.toFixed(0)}s-${this.trimEnd.toFixed(0)}s.${blob.type.split('/')[1] || 'mp4'}`;
                    
                    this.downloadBlob(blob, filename);
                    
                    // Kullanıcıya açıklama
                    const message = `
                        Tarayıcı sınırlamaları nedeniyle tam video kırpma yapılamadı.
                        Orijinal video indirildi.
                        
                        MANUEL KESİM BİLGİLERİ:
                        • Başlangıç: ${this.formatTime(this.trimStart)}
                        • Bitiş: ${this.formatTime(this.trimEnd)}
                        • Süre: ${duration.toFixed(1)} saniye
                        
                        Video düzenleme programlarında bu zamanları kullanarak manuel kesim yapabilirsiniz.
                    `;
                    
                    this.showNotification('Video indirildi - Manuel kesim gerekli', 'info');
                    
                    // Bilgi dosyasını da indir
                    const infoBlob = new Blob([message], { type: 'text/plain' });
                    this.downloadBlob(infoBlob, `kesim-bilgileri-${Date.now()}.txt`);
                    
                    resolve();
                })
                .catch(error => {
                    console.error('Video fetch hatası:', error);
                    reject(new Error('Video indirilemedi'));
                });
                
        } catch (error) {
            reject(error);
        }
    }
    
    downloadBlob(blob, filename) {
        try {
            console.log('Blob indirme başlatılıyor:', filename, 'Boyut:', blob.size);
            
            // Blob geçerli mi kontrol et
            if (!blob || blob.size === 0) {
                console.error('Geçersiz blob!');
                this.showNotification('Video dosyası oluşturulamadı!', 'error');
                return;
            }
            
            const url = URL.createObjectURL(blob);
            console.log('Blob URL oluşturuldu:', url);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            // Link'i DOM'a ekle
            document.body.appendChild(a);
            
            // İndirmeyi tetikle
            console.log('İndirme tetikleniyor...');
            a.click();
            
            // Temizlik
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('İndirme temizliği tamamlandı');
            }, 1000);
            
        } catch (error) {
            console.error('Download blob hatası:', error);
            this.showNotification('Dosya indirme hatası: ' + error.message, 'error');
        }
    }
    
    showProcessingOverlay(show, title = '', subtitle = '') {
        let overlay = document.querySelector('.processing-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'processing-overlay';
            overlay.innerHTML = `
                <div class="processing-content">
                    <div class="processing-spinner"></div>
                    <div class="processing-text">${title}</div>
                    <div class="processing-subtext">${subtitle}</div>
                    <div class="processing-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">0%</div>
                    </div>
                </div>
            `;
            document.querySelector('.video-container').appendChild(overlay);
        } else {
            overlay.querySelector('.processing-text').textContent = title;
            overlay.querySelector('.processing-subtext').textContent = subtitle;
        }
        
        overlay.style.display = show ? 'flex' : 'none';
        
        // Progress'i sıfırla
        if (show) {
            this.updateProcessingProgress(0);
        }
    }
    
    updateProcessingProgress(percentage) {
        const overlay = document.querySelector('.processing-overlay');
        if (!overlay) return;
        
        const progressFill = overlay.querySelector('.progress-fill');
        const progressText = overlay.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = Math.round(percentage) + '%';
        }
    }
    
    showNotification(message, type = 'info') {
        // Basit bir notification sistemi
        const notification = document.createElement('div');
        notification.className = `video-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Stil ekle
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '1000',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'
        });
        
        document.body.appendChild(notification);
        
        // Animasyon
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Otomatik kaldırma
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Gelişmiş özellikler için hazırlık
    setTrimMarkerByClick(percentage) {
        const time = (percentage / 100) * this.videoDuration;
        
        // En yakın marker'ı güncelle
        const distanceToStart = Math.abs(time - this.trimStart);
        const distanceToEnd = Math.abs(time - this.trimEnd);
        
        if (distanceToStart < distanceToEnd) {
            this.trimStart = time;
            if (this.startTimeInput) {
                this.startTimeInput.value = this.formatTime(this.trimStart);
            }
        } else {
            this.trimEnd = time;
            if (this.endTimeInput) {
                this.endTimeInput.value = this.formatTime(this.trimEnd);
            }
        }
        
        this.validateTrimValues();
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    // Video trimmer'ı başlat
    window.videoTrimmer = new VideoTrimmer();
    
    // Timeline'a tıklama event'i ekle
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    if (timelineWrapper) {
        timelineWrapper.addEventListener('click', (e) => {
            const rect = timelineWrapper.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            
            // Shift tuşuna basılıysa marker ayarla
            if (e.shiftKey && window.videoTrimmer) {
                window.videoTrimmer.setTrimMarkerByClick(percentage);
            }
        });
    }
    
    console.log('Video Trimmer başlatıldı!');
});