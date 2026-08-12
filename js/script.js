/* =========================================
   1. GLOBAL VARIABLES & TRACK LIST
   ========================================= */
function loadTracks() {
    const musikData = getMusik();
    if (!musikData || musikData.length === 0) return [];
    return musikData.map(m => ({
        title: m.judul,
        src: `assets/musik/${m.file}`
    }));
}

let tracks = [];
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

    body.classList.add('theme-transitioning');
    body.classList.toggle('light-mode');

    const isLight = body.classList.contains('light-mode');
    const newIcon = isLight ? 'fa-sun' : 'fa-moon';
    const storageValue = isLight ? 'light' : 'dark';

    if (icon) {
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(newIcon);
    }

    localStorage.setItem('theme', storageValue);
    
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 300);
}

// Easter Egg: Open Full Music Player
function openFullMusic() {
    window.open('musik/', '_blank');
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

/* =========================================
   3. RENDER DINAMIS DARI DATA
   ========================================= */

// Render Struktur Kelas
function renderStruktur() {
    const struktur = getStruktur();
    const orgContainer = document.querySelector('.org-container');
    if (!orgContainer || !struktur || struktur.length === 0) return;
    
    const waliKelas = struktur.find(s => s.posisi === "Wali Kelas");
    const ketuaKelas = struktur.find(s => s.posisi === "Ketua Kelas");
    const wakilKetua = struktur.find(s => s.posisi === "Wakil Ketua");
    const sekretaris1 = struktur.find(s => s.posisi === "Sekretaris 1");
    const sekretaris2 = struktur.find(s => s.posisi === "Sekretaris 2");
    const bendahara1 = struktur.find(s => s.posisi === "Bendahara 1");
    const bendahara2 = struktur.find(s => s.posisi === "Bendahara 2");
    
    const gridStruktur = struktur.filter(s => 
        !["Wali Kelas", "Ketua Kelas", "Wakil Ketua", "Sekretaris 1", "Sekretaris 2", "Bendahara 1", "Bendahara 2"].includes(s.posisi)
    );
    
    let html = '';
    
    if (waliKelas) {
        html += `<div class="row-org"><div class="node reveal">
            <div class="pic-box"><img src="assets/images/struktur/${waliKelas.foto}.png" alt="${waliKelas.posisi}"></div>
            <div class="label">${waliKelas.posisi}</div>
            <div class="name">${waliKelas.nama}</div>
        </div></div>`;
    }
    
    if (ketuaKelas || wakilKetua) {
        html += '<div class="row-org">';
        if (ketuaKelas) html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${ketuaKelas.foto}.png" alt="${ketuaKelas.posisi}"></div><div class="label">${ketuaKelas.posisi}</div><div class="name">${ketuaKelas.nama}</div></div>`;
        if (wakilKetua) html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${wakilKetua.foto}.png" alt="${wakilKetua.posisi}"></div><div class="label">${wakilKetua.posisi}</div><div class="name">${wakilKetua.nama}</div></div>`;
        html += '</div>';
    }
    
    if (sekretaris1 || sekretaris2 || bendahara1 || bendahara2) {
        html += '<div class="row-org split-row">';
        html += '<div class="group-pair">';
        if (sekretaris1) html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${sekretaris1.foto}.png" alt="${sekretaris1.posisi}"></div><div class="label">${sekretaris1.posisi}</div><div class="name">${sekretaris1.nama}</div></div>`;
        if (sekretaris2) html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${sekretaris2.foto}.png" alt="${sekretaris2.posisi}"></div><div class="label">${sekretaris2.posisi}</div><div class="name">${sekretaris2.nama}</div></div>`;
        html += '</div>';
        html += '<div class="group-pair">';
        if (bendahara1) html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${bendahara1.foto}.png" alt="${bendahara1.posisi}"></div><div class="label">${bendahara1.posisi}</div><div class="name">${bendahara1.nama}</div></div>`;
        if (bendahara2) html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${bendahara2.foto}.png" alt="${bendahara2.posisi}"></div><div class="label">${bendahara2.posisi}</div><div class="name">${bendahara2.nama}</div></div>`;
        html += '</div>';
        html += '</div>';
    }
    
    if (gridStruktur.length > 0) {
        html += '<div class="grid-sections">';
        gridStruktur.forEach(s => {
            html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/struktur/${s.foto}.png" alt="${s.posisi}"></div><div class="label">${s.posisi}</div><div class="name">${s.nama}</div></div>`;
        });
        html += '</div>';
    }
    
    orgContainer.innerHTML = html;
}

function renderSiswa() {
    const siswa = getSiswa();
    const siswaGrid = document.querySelector('.siswa-grid');
    if (!siswaGrid || !siswa || siswa.length === 0) return;
    
    let html = '';
    siswa.forEach((s, i) => {
        html += `<div class="node reveal"><div class="pic-box"><img src="assets/images/siswa/${s.foto}.png" alt="${s.nama}"></div><div class="label">Siswa ${i + 1}</div><div class="name">${s.nama}</div><div class="nisn">NISN: ${s.nisn}</div></div>`;
    });
    siswaGrid.innerHTML = html;
}

function renderGaleri() {
    const galeri = getGaleri();
    const galeriGrid = document.querySelector('.galeri-grid');
    if (!galeriGrid || !galeri || galeri.length === 0) return;
    
    let html = '';
    galeri.forEach(g => {
        html += `<div class="galeri-item reveal"><div class="img-16-9"><img src="assets/images/galeri/${g.file}" alt="${g.caption}"></div><div class="caption">${g.caption}</div></div>`;
    });
    galeriGrid.innerHTML = html;
}

function renderPlaylist() {
    tracks = loadTracks();
    const playlistContainer = document.getElementById('playlist');
    if (!playlistContainer || tracks.length === 0) return;
    
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

function refreshAllData() {
    renderStruktur();
    renderSiswa();
    renderGaleri();
    renderPlaylist();
    setTimeout(reveal, 200);
}

/* =========================================
   4. MUSIC PLAYER LOGIC
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
    if (isPlaying) audio.play().catch(e => console.log(e));
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play().catch(e => console.log(e));
}

function updatePlaylistActive() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentTrackIndex);
    });
}

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

/* =========================================
   5. INITIALIZATION
   ========================================= */
window.addEventListener("DOMContentLoaded", async () => {
    
    document.body.style.visibility = 'visible';
    
    // TUNGGU DATA DARI API
    await fetchData();
    
    // RENDER SEMUA
    refreshAllData();
    
    // Load first track
    if (tracks.length > 0) loadTrack(0);
    
    const overlay = document.getElementById('welcome-overlay');
    const startBtn = document.getElementById('startBtn');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Auto focus untuk keyboard Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && startBtn && startBtn.style.display !== 'none') {
            startBtn.click();
        }
    });

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
                
                isPlaying = true;
                if (tracks.length > 0) {
                    audio.play().then(() => {
                        const playIcon = document.getElementById('playIcon');
                        if (playIcon) {
                            playIcon.classList.remove('fa-play');
                            playIcon.classList.add('fa-pause');
                        }
                    }).catch(error => {
                        console.log("Browser blocked autoplay:", error);
                    });
                }

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

    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (!audio.duration) return;
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            audio.currentTime = (clickX / width) * audio.duration;
        });
    }

    window.addEventListener("scroll", reveal, { passive: true });
    
    setTimeout(reveal, 100);
});

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});