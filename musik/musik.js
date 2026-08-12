/* =========================================
   MUSIC PLAYER JS - TJKT 3
   ========================================= */

const tracks = [
    { 
        title: "Ingatlah Hari Ini", 
        src: "../assets/musik/lagu1.mp3",
        lyrics: [
            { time: 0, text: "🎵 Ingatlah Hari Ini 🎵" },
            { time: 5, text: "Ingatlah hari ini..." },
            { time: 10, text: "Saat kita bersama..." },
            { time: 15, text: "Di sekolah tercinta..." },
            { time: 20, text: "Kenangan yang tak terlupa..." },
            { time: 30, text: "🎵 TJKT 3 - TEKAJE MENDUNIA 🎵" }
        ]
    },
    { 
        title: "Kisah Kasih Di Sekolah", 
        src: "../assets/musik/lagu2.mp3",
        lyrics: [
            { time: 0, text: "🎵 Kisah Kasih Di Sekolah 🎵" },
            { time: 5, text: "Resah hati ini..." },
            { time: 10, text: "Tanpa dirimu lagi..." },
            { time: 15, text: "Kisah kasih di sekolah..." },
            { time: 25, text: "🎵 TJKT 3 - TEKAJE MENDUNIA 🎵" }
        ]
    },
    { 
        title: "Sampai Jumpa", 
        src: "../assets/musik/lagu3.mp3",
        lyrics: [
            { time: 0, text: "🎵 Sampai Jumpa 🎵" },
            { time: 5, text: "Sampai jumpa kawanku..." },
            { time: 10, text: "Kenangan bersamamu..." },
            { time: 15, text: "Takkan pernah terlupakan..." },
            { time: 25, text: "🎵 TJKT 3 - TEKAJE MENDUNIA 🎵" }
        ]
    },
    { 
        title: "Sesuatu Di Jogja", 
        src: "../assets/musik/lagu4.mp3",
        lyrics: [
            { time: 0, text: "🎵 Sesuatu Di Jogja 🎵" },
            { time: 5, text: "Ada sesuatu di Jogja..." },
            { time: 10, text: "Yang membuatku rindu..." },
            { time: 15, text: "Suasana yang berbeda..." },
            { time: 25, text: "🎵 TJKT 3 - TEKAJE MENDUNIA 🎵" }
        ]
    },
    { 
        title: "Kita Ke Sana", 
        src: "../assets/musik/lagu5.mp3",
        lyrics: [
            { time: 0, text: "🎵 Kita Ke Sana 🎵" },
            { time: 5, text: "Kita ke sana bersama..." },
            { time: 10, text: "Menuju masa depan..." },
            { time: 15, text: "Dengan semangat membara..." },
            { time: 25, text: "🎵 TJKT 3 - TEKAJE MENDUNIA 🎵" }
        ]
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

// DOM Elements
const playIcon = document.getElementById('playIcon');
const nowTitle = document.getElementById('nowTitle');
const progressBar = document.getElementById('progressBar');
const currTime = document.getElementById('currTime');
const durTime = document.getElementById('durTime');
const lyricsScroll = document.getElementById('lyricsScroll');
const discIcon = document.getElementById('discIcon');
const playlistList = document.getElementById('playlistList');

// Load track
function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    
    currentTrackIndex = index;
    audio.src = tracks[index].src;
    audio.load();
    
    nowTitle.innerText = tracks[index].title;
    
    // Render lyrics
    renderLyrics();
    
    // Update playlist active
    updatePlaylistActive();
}

// Play/Pause
function playPauseTrack() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        discIcon.classList.remove('spinning');
    } else {
        audio.play().then(() => {
            isPlaying = true;
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            discIcon.classList.add('spinning');
        }).catch(e => console.log(e));
    }
}

// Next/Prev
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audio.play();
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Render lyrics
function renderLyrics() {
    const track = tracks[currentTrackIndex];
    lyricsScroll.innerHTML = track.lyrics.map((l, i) => 
        `<p data-time="${l.time}" id="lyric-${i}">${l.text}</p>`
    ).join('');
}

// Update lyrics active
function updateLyrics() {
    const currentTime = audio.currentTime;
    const lyrics = tracks[currentTrackIndex].lyrics;
    
    let activeIndex = 0;
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            activeIndex = i;
            break;
        }
    }
    
    // Update active lyric
    document.querySelectorAll('.lyrics-scroll p').forEach((p, i) => {
        p.classList.toggle('active', i === activeIndex);
        if (i === activeIndex) {
            p.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Build playlist
function buildPlaylist() {
    playlistList.innerHTML = tracks.map((track, i) => `
        <div class="playlist-track ${i === currentTrackIndex ? 'active' : ''}" onclick="playTrack(${i})">
            <span class="track-num">${i + 1}</span>
            <span class="track-title">${track.title}</span>
            <span class="track-playing">${i === currentTrackIndex ? '<i class="fas fa-play"></i>' : ''}</span>
        </div>
    `).join('');
}

function playTrack(index) {
    loadTrack(index);
    isPlaying = false;
    playPauseTrack();
}

function updatePlaylistActive() {
    document.querySelectorAll('.playlist-track').forEach((el, i) => {
        el.classList.toggle('active', i === currentTrackIndex);
        const playingIcon = el.querySelector('.track-playing');
        if (playingIcon) {
            playingIcon.innerHTML = i === currentTrackIndex ? '<i class="fas fa-play"></i>' : '';
        }
    });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    // Load theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    buildPlaylist();
    loadTrack(0);
    
    // Audio events
    audio.addEventListener('timeupdate', () => {
        if (progressBar && audio.duration) {
            progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }
        if (currTime) currTime.innerText = formatTime(audio.currentTime);
        if (durTime && audio.duration) durTime.innerText = formatTime(audio.duration);
        updateLyrics();
    });
    
    audio.addEventListener('ended', nextTrack);
    
    audio.addEventListener('loadedmetadata', () => {
        if (durTime) durTime.innerText = formatTime(audio.duration);
    });
    
    // Progress click
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            if (!audio.duration) return;
            audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
        });
    }
});

// Theme toggle
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const icon = document.getElementById('theme-icon');
    const isLight = body.classList.contains('light-mode');
    
    if (icon) {
        icon.classList.remove('fa-moon', 'fa-sun');
        icon.classList.add(isLight ? 'fa-sun' : 'fa-moon');
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}