// =========================================
// SIDEBAR NAVIGATION
// =========================================
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        
        // Update active link
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        // Show section
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active-section'));
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('active-section');
        
        // Update page title
        const titles = {
            dashboard: '📊 Dashboard',
            siswa: '👥 Manage Siswa',
            struktur: '🏗️ Manage Struktur',
            musik: '🎵 Manage Musik',
            galeri: '🖼️ Manage Galeri'
        };
        document.getElementById('pageTitle').innerText = titles[sectionId] || sectionId;
        
        // Render section
        if (sectionId === 'dashboard') renderDashboard();
        if (sectionId === 'siswa') renderAdminSiswa();
        if (sectionId === 'struktur') renderAdminStruktur();
        if (sectionId === 'musik') renderAdminMusik();
        if (sectionId === 'galeri') renderAdminGaleri();
    });
});

// Dashboard
function renderDashboard() {
    const section = document.getElementById('dashboard');
    const siswa = getSiswa();
    const struktur = getStruktur();
    const musik = getMusik();
    const galeri = getGaleri();
    
    section.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-number">${siswa.length}</div>
                <div class="stat-label">Total Siswa</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-sitemap"></i>
                <div class="stat-number">${struktur.length}</div>
                <div class="stat-label">Pengurus Kelas</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-music"></i>
                <div class="stat-number">${musik.length}</div>
                <div class="stat-label">Lagu Tersimpan</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-images"></i>
                <div class="stat-number">${galeri.length}</div>
                <div class="stat-label">Foto Galeri</div>
            </div>
        </div>
        <div class="admin-card">
            <h3 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:15px;">📋 Informasi Kelas</h3>
            <p><strong>Wali Kelas:</strong> ${struktur.find(s => s.posisi === 'Wali Kelas')?.nama || '-'}</p>
            <p><strong>Ketua Kelas:</strong> ${struktur.find(s => s.posisi === 'Ketua Kelas')?.nama || '-'}</p>
            <p><strong>Total Data Tersimpan:</strong> ${siswa.length + struktur.length + musik.length + galeri.length} item</p>
        </div>
    `;
}

// Reset All Data
async function resetAllData() {
    if (confirm('⚠️ RESET SEMUA DATA?\n\nSemua perubahan akan hilang!')) {
        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(FULL_DATA || { siswa: [], struktur: [], musik: [], galeri: [] })
        });
        alert('✅ Data berhasil direset!');
        fetchData().then(() => {
            renderDashboard();
            renderAdminSiswa();
            renderAdminStruktur();
            renderAdminMusik();
            renderAdminGaleri();
        });
    }
}

// Update renderAdminData
function renderAdminData() {
    renderDashboard();
    renderAdminSiswa();
    renderAdminStruktur();
    renderAdminMusik();
    renderAdminGaleri();
}