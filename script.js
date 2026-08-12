/* =========================================
   1. GLOBAL VARIABLES & TRACK LIST
   ========================================= */
const tracks = [
    { title: "Ingatlah Hari Ini", src: "musik/lagu1.mp3" },
    { title: "Kisah Kasih Di Sekolah", src: "musik/lagu2.mp3" },
    { title: "Sampai Jumpa", src: "musik/lagu3.mp3" },
    { title: "Sesuatu Di Jogja", src: "musik/lagu4.mp3" },
    { title: "Kita Ke Sana", src: "musik/lagu5.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

/* =========================================
   2. FUNGSI UTAMA
   ========================================= */

// Toggle Theme
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    const iconNav = document.getElementById('theme-icon-nav');

    body.classList.toggle('light-mode');

    const isLight = body.classList.contains('light-mode');
    const newIcon = isLight ? 'fa-sun' : 'fa-moon';
    const storageValue = isLight ? 'light' : 'dark';

    if (icon) {
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(newIcon);
    }
    if (iconNav) {
        iconNav.classList.remove('fa-moon', 'fa-sun');
        iconNav.classList.add(newIcon);
    }

    localStorage.setItem('theme', storageValue);
}

// Toggle Music Player
function togglePlayer() {
    const playerCard = document.getElementById('musicPlayer');
    if (playerCard) {
        playerCard.classList.toggle('active');
    }
}

// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add("active");
        }
    });
}

/* =========================================
   3. MUSIC PLAYER LOGIC
   ========================================= */

function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    
    currentTrackIndex = index;
    audio.src = tracks[index].src;
    audio.load();
    
    const trackTitle = document.getElementById('trackTitle');
    if (trackTitle) {
        trackTitle.innerText = tracks[index].title;
    }
    
    updatePlaylistActive();
}

function playPauseTrack() {
    const playIcon = document.getElementById('playIcon');
    if (!playIcon) return;

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        audio.play().then(() => {
            isPlaying = true;
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }).catch(error => {
            console.log("Playback prevented:", error);
        });
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log(e));
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        audio.play().catch(e => console.log(e));
    }
}

function updatePlaylistActive() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
        if (idx === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/* =========================================
   4. INITIALIZATION
   ========================================= */
window.addEventListener("DOMContentLoaded", () => {
    
    // Show body
    document.body.style.visibility = 'visible';
    
    const overlay = document.getElementById('welcome-overlay');
    const startBtn = document.getElementById('startBtn');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const icons = document.querySelectorAll('#theme-icon, #theme-icon-nav');
        icons.forEach(icon => {
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }

    // Build Playlist
    const playlistContainer = document.getElementById('playlist');
    if (playlistContainer) {
        playlistContainer.innerHTML = "";
        tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.classList.add('playlist-item');
            item.innerText = `${index + 1}. ${track.title}`;
            item.addEventListener('click', () => {
                loadTrack(index);
                if (!isPlaying) {
                    playPauseTrack();
                } else {
                    audio.play().catch(e => console.log(e));
                }
            });
            playlistContainer.appendChild(item);
        });
    }

    // Load first track
    loadTrack(0);

    // Welcome Screen Logic
    if (overlay) {
        if (startBtn) startBtn.style.display = 'none';
        
        if (loadingBar) {
            setTimeout(() => {
                loadingBar.style.display = 'none';
                if (startBtn) startBtn.style.display = 'inline-block';
            }, 2000);
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                overlay.classList.add('fade-out');
                
                // Start music
                isPlaying = true;
                audio.play().then(() => {
                    const playIcon = document.getElementById('playIcon');
                    if (playIcon) {
                        playIcon.classList.remove('fa-play');
                        playIcon.classList.add('fa-pause');
                    }
                }).catch(error => {
                    console.log("Browser blocked autoplay:", error);
                });

                setTimeout(() => {
                    overlay.style.display = 'none';
                    reveal();
                }, 1000);
            });
        }
    }

    // Audio Events
    audio.addEventListener('timeupdate', () => {
        const progressBar = document.getElementById('progressBar');
        const currTime = document.getElementById('currTime');
        const durTime = document.getElementById('durTime');

        if (progressBar && audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        if (currTime) currTime.innerText = formatTime(audio.currentTime);
        if (durTime && audio.duration) durTime.innerText = formatTime(audio.duration);
    });

    audio.addEventListener('ended', nextTrack);
    
    audio.addEventListener('loadedmetadata', () => {
        const durTime = document.getElementById('durTime');
        if (durTime) durTime.innerText = formatTime(audio.duration);
    });

    // Progress bar click
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (!audio.duration) return;
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            audio.currentTime = (clickX / width) * audio.duration;
        });
    }

    // Scroll Reveal
    window.addEventListener("scroll", reveal, { passive: true });
    
    // Initial reveal check
    setTimeout(reveal, 100);
});

// Handle page unload (reset scroll position bug on some mobile browsers)
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});