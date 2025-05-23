// Music Website JavaScript - Advanced Features
class MusicPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.currentAudio = null;
        this.audioContext = null;
        this.analyser = null;
        this.gainNode = null;
        this.bassFilter = null;
        this.trebleFilter = null;
        this.playlist = [];
        this.canvas = null;
        this.canvasContext = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.initializeAudioContext();
        this.createPlaylist();
        this.setupEventListeners();
        this.setupVisualizer();
        this.setupSpotifyIntegration();
        this.setupResponsiveMenu();
    }

    // Sample playlist - you can add your own songs here
    createPlaylist() {
        this.playlist = [
            {
                title: "Neon Dreams",
                artist: "HassanAzawi",
                duration: "3:45",
                src: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Sample audio
                albumArt: "https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Neon+Dreams"
            },
            {
                title: "Purple Rain Remix",
                artist: "HassanAzawi",
                duration: "4:12",
                src: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Sample audio
                albumArt: "https://via.placeholder.com/300x300/A855F7/FFFFFF?text=Purple+Rain"
            },
            {
                title: "Digital Waves",
                artist: "HassanAzawi",
                duration: "3:58",
                src: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Sample audio
                albumArt: "https://via.placeholder.com/300x300/6D28D9/FFFFFF?text=Digital+Waves"
            },
            {
                title: "Midnight Bass",
                artist: "HassanAzawi",
                duration: "5:23",
                src: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Sample audio
                albumArt: "https://via.placeholder.com/300x300/C4B5FD/000000?text=Midnight+Bass"
            },
            {
                title: "Synthesized Soul",
                artist: "HassanAzawi",
                duration: "4:01",
                src: "https://www.soundjay.com/misc/sounds/magic-chime-02.wav", // Sample audio
                albumArt: "https://via.placeholder.com/300x300/DDD6FE/000000?text=Synth+Soul"
            }
        ];
        
        this.renderPlaylist();
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAudioNodes();
        } catch (error) {
            console.log('Web Audio API not supported:', error);
        }
    }

    setupAudioNodes() {
        if (!this.audioContext) return;

        // Create audio nodes for enhancement
        this.gainNode = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.trebleFilter = this.audioContext.createBiquadFilter();
        
        // Configure filters
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.value = 320;
        this.bassFilter.gain.value = 0;
        
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.value = 3200;
        this.trebleFilter.gain.value = 0;
        
        // Configure analyser
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;
    }

    connectAudioNodes(audioElement) {
        if (!this.audioContext || !audioElement) return;

        const source = this.audioContext.createMediaElementSource(audioElement);
        
        // Connect nodes: source -> bass -> treble -> gain -> analyser -> destination
        source.connect(this.bassFilter);
        this.bassFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist');
        if (!playlistContainer) return;

        playlistContainer.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <img src="${track.albumArt}" alt="${track.title}">
                <div class="playlist-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
                <span class="playlist-duration">${track.duration}</span>
            `;
            
            playlistItem.addEventListener('click', () => this.playTrack(index));
            playlistContainer.appendChild(playlistItem);
        });
    }

    setupEventListeners() {
        // Play/Pause buttons
        const playPauseBtn = document.getElementById('play-pause-btn');
        const mainPlayBtn = document.getElementById('main-play-btn');
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (mainPlayBtn) {
            mainPlayBtn.addEventListener('click', () => this.togglePlay());
        }

        // Navigation controls
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }

        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        }

        // Audio enhancement controls
        this.setupEnhancementControls();

        // Progress bar
        this.setupProgressBar();
    }

    setupEnhancementControls() {
        const bassSlider = document.getElementById('bass-slider');
        const trebleSlider = document.getElementById('treble-slider');
        const reverbSlider = document.getElementById('reverb-slider');
        const audio3DToggle = document.getElementById('3d-audio');

        if (bassSlider) {
            bassSlider.addEventListener('input', (e) => this.setBassGain(e.target.value));
        }

        if (trebleSlider) {
            trebleSlider.addEventListener('input', (e) => this.setTrebleGain(e.target.value));
        }

        if (reverbSlider) {
            reverbSlider.addEventListener('input', (e) => this.setReverb(e.target.value));
        }

        if (audio3DToggle) {
            audio3DToggle.addEventListener('change', (e) => this.toggle3DAudio(e.target.checked));
        }
    }

    setupProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                if (this.currentAudio) {
                    const rect = progressBar.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    this.currentAudio.currentTime = percent * this.currentAudio.duration;
                }
            });
        }
    }

    playTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        // Stop current track
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        this.currentTrack = index;
        const track = this.playlist[index];
        
        // Update UI
        this.updateTrackDisplay(track);
        this.updatePlaylistHighlight();

        // Create new audio element
        this.currentAudio = new Audio();
        this.currentAudio.src = track.src;
        this.currentAudio.crossOrigin = "anonymous";

        // Connect to audio context
        this.connectAudioNodes(this.currentAudio);

        // Setup audio event listeners
        this.currentAudio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        this.currentAudio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.currentAudio.addEventListener('ended', () => {
            this.nextTrack();
        });

        // Start playing
        this.currentAudio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.startVisualizer();
        }).catch(error => {
            console.log('Play failed:', error);
            // For demo purposes, use a simple oscillator
            this.playDemoSound();
        });
    }

    playDemoSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 2);
        
        this.isPlaying = true;
        this.updatePlayButton();
        
        setTimeout(() => {
            this.isPlaying = false;
            this.updatePlayButton();
        }, 2000);
    }

    togglePlay() {
        if (!this.currentAudio && this.playlist.length > 0) {
            this.playTrack(0);
            return;
        }

        if (this.currentAudio) {
            if (this.isPlaying) {
                this.currentAudio.pause();
                this.isPlaying = false;
                this.stopVisualizer();
            } else {
                this.currentAudio.play().then(() => {
                    this.isPlaying = true;
                    this.startVisualizer();
                }).catch(error => {
                    console.log('Play failed:', error);
                });
            }
            this.updatePlayButton();
        }
    }

    previousTrack() {
        const prevIndex = this.currentTrack > 0 ? this.currentTrack - 1 : this.playlist.length - 1;
        this.playTrack(prevIndex);
    }

    nextTrack() {
        const nextIndex = this.currentTrack < this.playlist.length - 1 ? this.currentTrack + 1 : 0;
        this.playTrack(nextIndex);
    }

    setVolume(volume) {
        if (this.currentAudio) {
            this.currentAudio.volume = volume;
        }
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    }

    setBassGain(value) {
        if (this.bassFilter) {
            const gain = (value - 50) * 0.4; // Convert 0-100 to -20 to +20 dB
            this.bassFilter.gain.value = gain;
        }
    }

    setTrebleGain(value) {
        if (this.trebleFilter) {
            const gain = (value - 50) * 0.4; // Convert 0-100 to -20 to +20 dB
            this.trebleFilter.gain.value = gain;
        }
    }

    setReverb(value) {
        // Reverb implementation would require convolution reverb
        // For now, just adjust the overall gain slightly
        if (this.gainNode) {
            const reverbGain = 1 + (value / 100) * 0.2;
            this.gainNode.gain.value *= reverbGain;
        }
    }

    toggle3DAudio(enabled) {
        if (!this.audioContext) return;
        
        if (enabled) {
            // Create panner node for 3D audio
            const panner = this.audioContext.createPanner();
            panner.panningModel = 'HRTF';
            panner.positionX.value = Math.sin(Date.now() * 0.001) * 2;
            panner.positionY.value = 0;
            panner.positionZ.value = Math.cos(Date.now() * 0.001) * 2;
            
            // Animate position
            const animate3D = () => {
                if (enabled) {
                    panner.positionX.value = Math.sin(Date.now() * 0.001) * 2;
                    panner.positionZ.value = Math.cos(Date.now() * 0.001) * 2;
                    requestAnimationFrame(animate3D);
                }
            };
            animate3D();
        }
    }

    updateTrackDisplay(track) {
        const currentTitle = document.getElementById('current-title');
        const currentArtist = document.getElementById('current-artist');
        const currentAlbum = document.getElementById('current-album');

        if (currentTitle) currentTitle.textContent = track.title;
        if (currentArtist) currentArtist.textContent = track.artist;
        if (currentAlbum) currentAlbum.src = track.albumArt;
    }

    updatePlaylistHighlight() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            if (index === this.currentTrack) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const mainPlayBtn = document.getElementById('main-play-btn');
        
        const icon = this.isPlaying ? 'fa-pause' : 'fa-play';
        
        if (playPauseBtn) {
            const i = playPauseBtn.querySelector('i');
            if (i) {
                i.className = `fas ${icon}`;
            }
        }
        
        if (mainPlayBtn) {
            const i = mainPlayBtn.querySelector('i');
            if (i) {
                i.className = `fas ${icon}`;
            }
        }
    }

    updateProgress() {
        if (!this.currentAudio) return;

        const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
        const progressFill = document.querySelector('.progress-fill');
        const currentTime = document.getElementById('current-time');

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        if (currentTime) {
            currentTime.textContent = this.formatTime(this.currentAudio.currentTime);
        }
    }

    updateDuration() {
        if (!this.currentAudio) return;

        const totalTime = document.getElementById('total-time');
        if (totalTime) {
            totalTime.textContent = this.formatTime(this.currentAudio.duration);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    setupVisualizer() {
        this.canvas = document.getElementById('visualizer');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'visualizer';
            this.canvas.style.display = 'none';
            document.body.appendChild(this.canvas);
        }
        
        this.canvasContext = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
    }

    startVisualizer() {
        if (!this.analyser || !this.canvasContext) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!this.isPlaying) return;

            this.animationId = requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(dataArray);

            this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth = (this.canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * this.canvas.height;

                const r = barHeight + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;

                this.canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
                this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }

            // Update wave bars in hero section
            this.updateWaveBars(dataArray);
        };

        draw();
    }

    updateWaveBars(dataArray) {
        const waveBars = document.querySelectorAll('.wave-bar');
        waveBars.forEach((bar, index) => {
            const value = dataArray[index * 8] || 0;
            const height = (value / 255) * 100 + 20;
            bar.style.height = `${height}px`;
        });
    }

    stopVisualizer() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupSpotifyIntegration() {
        const spotifyConnectBtn = document.getElementById('spotify-connect');
        if (spotifyConnectBtn) {
            spotifyConnectBtn.addEventListener('click', () => this.connectSpotify());
        }
    }

    connectSpotify() {
        // Spotify Web API integration would go here
        // For demo purposes, show a message
        const spotifyPlayer = document.getElementById('spotify-player');
        if (spotifyPlayer) {
            spotifyPlayer.style.display = 'block';
            spotifyPlayer.innerHTML = `
                <h4>Spotify Integration</h4>
                <p>To connect your Spotify account, you would need to:</p>
                <ol>
                    <li>Register this app with Spotify Developer Dashboard</li>
                    <li>Implement OAuth 2.0 authentication flow</li>
                    <li>Use Spotify Web API to fetch user's playlists</li>
                    <li>Implement Spotify Web Playback SDK for playback</li>
                </ol>
                <p>This demo shows the UI structure for Spotify integration.</p>
            `;
        }

        // Change button text
        const connectBtn = document.getElementById('spotify-connect');
        if (connectBtn) {
            connectBtn.innerHTML = '<i class="fas fa-check"></i> Connected to Spotify';
            connectBtn.disabled = true;
        }
    }

    setupResponsiveMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.feature-card, .playlist-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (window.musicPlayer) {
                    window.musicPlayer.togglePlay();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (window.musicPlayer) {
                    window.musicPlayer.previousTrack();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (window.musicPlayer) {
                    window.musicPlayer.nextTrack();
                }
                break;
        }
    });
}

// Theme toggler (bonus feature)
function setupThemeToggler() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-purple);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        transition: all 0.3s ease;
    `;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('blue-theme');
    });

    document.body.appendChild(themeToggle);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize music player
    window.musicPlayer = new MusicPlayer();
    
    // Setup additional features
    setupScrollAnimations();
    setupKeyboardShortcuts();
    setupThemeToggler();
    
    // Add loading states
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // Add some extra visual effects
    createFloatingNotes();
});

// Floating musical notes animation
function createFloatingNotes() {
    const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
    
    setInterval(() => {
        if (window.musicPlayer && window.musicPlayer.isPlaying) {
            const note = document.createElement('div');
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.cssText = `
                position: fixed;
                bottom: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 20}px;
                color: var(--primary-purple);
                z-index: 10;
                pointer-events: none;
                animation: floatUp 4s linear forwards;
                opacity: 0.6;
            `;
            
            document.body.appendChild(note);
            
            setTimeout(() => {
                note.remove();
            }, 4000);
        }
    }, 2000);
}

// Add CSS for floating notes animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        to {
            bottom: 100vh;
            opacity: 0;
            transform: translateX(${Math.random() * 200 - 100}px);
        }
    }
    
    .blue-theme {
        --primary-purple: #3B82F6;
        --secondary-purple: #60A5FA;
        --dark-purple: #1E40AF;
        --light-purple: #BFDBFE;
        --accent-purple: #DBEAFE;
    }
    
    .loaded .hero-content {
        animation: slideInLeft 1s ease-out;
    }
    
    .loaded .hero-visual {
        animation: slideInRight 1s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
