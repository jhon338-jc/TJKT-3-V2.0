/* =========================================
   ADMIN PANEL JS - TJKT 3 (SIDEBAR VERSION)
   ========================================= */

const CORRECT_PIN = "030308";

// =========================================
// PIN LOGIN
// =========================================
function addPin(num) {
    const input = document.getElementById('pinInput');
    if (input.value.length < 6) {
        input.value += num;
        document.getElementById('login-error').innerText = '';
        input.classList.remove('error');
    }
}

function clearPin() {
    const input = document.getElementById('pinInput');
    input.value = '';
    document.getElementById('login-error').innerText = '';
    input.classList.remove('error');
}

function submitPin() {
    const input = document.getElementById('pinInput');
    const errorMsg = document.getElementById('login-error');
    const loadingBar = document.getElementById('loadingBarLogin');
    const loginOverlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('admin-dashboard');
    
    const enteredPin = input.value;
    
    if (enteredPin === CORRECT_PIN) {
        errorMsg.innerText = '';
        input.classList.remove('error');
        input.disabled = true;
        loadingBar.classList.add('active');
        
        document.querySelectorAll('.pin-keypad button').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
        
        setTimeout(() => {
            loginOverlay.classList.add('hidden');
            dashboard.style.display = 'flex';
            document.body.style.overflow = 'auto';
            fetchData().then(() => renderAll());
        }, 3000);
        
    } else {
        errorMsg.innerText = '❌ PIN SALAH!';
        input.classList.add('error');
        input.value = '';
        setTimeout(() => { input.focus(); }, 500);
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('pinInput');
        if (document.activeElement === input || document.getElementById('login-overlay').style.display !== 'none') {
            submitPin();
        }
    }
    // Support angka dari keyboard fisik
    if (e.key >= '0' && e.key <= '9') {
        const input = document.getElementById('pinInput');
        if (document.activeElement === input || document.getElementById('login-overlay').style.display !== 'none') {
            addPin(e.key);
            input.focus();
        }
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
        clearPin();
    }
});

function logout() {
    if (confirm('Yakin ingin logout?')) {
        window.location.href = 'admin.html';
    }
}

// =========================================
// SIDEBAR NAVIGATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active-section'));
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active-section');
            
            const titles = {
                dashboard: '📊 Dashboard',
                siswa: '👥 Manage Siswa',
                struktur: '🏗️ Manage Struktur',
                musik: '🎵 Manage Musik',
                galeri: '🖼️ Manage Galeri'
            };
            document.getElementById('pageTitle').innerText = titles[sectionId] || sectionId;
            
            switch(sectionId) {
                case 'dashboard': renderDashboard(); break;
                case 'siswa': renderAdminSiswa(); break;
                case 'struktur': renderAdminStruktur(); break;
                case 'musik': renderAdminMusik(); break;
                case 'galeri': renderAdminGaleri(); break;
            }
        });
    });
});

// =========================================
// RENDER ALL
// =========================================
function renderAll() {
    renderDashboard();
    renderAdminSiswa();
    renderAdminStruktur();
    renderAdminMusik();
    renderAdminGaleri();
}

// =========================================
// DASHBOARD
// =========================================
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
            <p><strong>Total Data:</strong> ${siswa.length + struktur.length + musik.length + galeri.length} item</p>
        </div>
    `;
}

// =========================================
// CRUD SISWA
// =========================================
function renderAdminSiswa() {
    const section = document.getElementById('siswa');
    const siswa = getSiswa();
    
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;"><i class="fas fa-users"></i> MANAGE SISWA (${siswa.length})</h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddSiswaForm()"><i class="fas fa-plus"></i> Tambah</button>
            <div id="siswaForm" class="edit-form"></div>
            <div class="data-table">
                <table>
                    <thead><tr><th>No</th><th>Nama</th><th>NISN</th><th>Foto</th><th>Aksi</th></tr></thead>
                    <tbody>
                        ${siswa.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td><td>${s.nama}</td><td>${s.nisn}</td><td>${s.foto}</td>
                                <td>
                                    <button class="btn-edit" onclick="showEditSiswaForm(${s.id})"><i class="fas fa-edit"></i></button>
                                    <button class="btn-delete" onclick="deleteSiswaConfirm(${s.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddSiswaForm() {
    document.getElementById('siswaForm').innerHTML = `
        <div class="form-card">
            <h4>Tambah Siswa</h4>
            <input type="text" id="newNama" placeholder="Nama Lengkap">
            <input type="text" id="newNisn" placeholder="NISN">
            <select id="newFoto"><option value="L1">Laki-laki</option><option value="P1">Perempuan</option></select>
            <button class="admin-btn" onclick="addSiswaHandler()"><i class="fas fa-save"></i> Simpan</button>
            <button class="admin-btn" onclick="document.getElementById('siswaForm').innerHTML=''" style="background:#ff4757;">Batal</button>
        </div>
    `;
}

async function addSiswaHandler() {
    const nama = document.getElementById('newNama').value;
    const nisn = document.getElementById('newNisn').value;
    const foto = document.getElementById('newFoto').value;
    if (nama && nisn) {
        await addSiswa({ nama, nisn, foto });
        renderAdminSiswa();
        alert('✅ Tersimpan!');
    }
}

function showEditSiswaForm(id) {
    const s = getSiswa().find(x => x.id === id);
    if (!s) return;
    document.getElementById('siswaForm').innerHTML = `
        <div class="form-card">
            <h4>Edit Siswa</h4>
            <input type="text" id="editNama" value="${s.nama}">
            <input type="text" id="editNisn" value="${s.nisn}">
            <select id="editFoto"><option value="L1" ${s.foto==='L1'?'selected':''}>Laki-laki</option><option value="P1" ${s.foto==='P1'?'selected':''}>Perempuan</option></select>
            <button class="admin-btn" onclick="updateSiswaHandler(${id})"><i class="fas fa-save"></i> Update</button>
            <button class="admin-btn" onclick="document.getElementById('siswaForm').innerHTML=''" style="background:#ff4757;">Batal</button>
        </div>
    `;
}

async function updateSiswaHandler(id) {
    const nama = document.getElementById('editNama').value;
    const nisn = document.getElementById('editNisn').value;
    const foto = document.getElementById('editFoto').value;
    if (nama && nisn) {
        await updateSiswa(id, { nama, nisn, foto });
        renderAdminSiswa();
        alert('✅ Diupdate!');
    }
}

async function deleteSiswaConfirm(id) {
    if (confirm('Yakin hapus?')) {
        await deleteSiswa(id);
        renderAdminSiswa();
        alert('✅ Dihapus!');
    }
}

// =========================================
// CRUD STRUKTUR
// =========================================
function renderAdminStruktur() {
    const section = document.getElementById('struktur');
    const struktur = getStruktur();
    
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;"><i class="fas fa-sitemap"></i> MANAGE STRUKTUR (${struktur.length})</h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddStrukturForm()"><i class="fas fa-plus"></i> Tambah</button>
            <div id="strukturForm" class="edit-form"></div>
            <div class="data-table">
                <table>
                    <thead><tr><th>No</th><th>Posisi</th><th>Nama</th><th>Foto</th><th>Aksi</th></tr></thead>
                    <tbody>
                        ${struktur.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td><td>${s.posisi}</td><td>${s.nama}</td><td>${s.foto}</td>
                                <td>
                                    <button class="btn-edit" onclick="showEditStrukturForm(${s.id})"><i class="fas fa-edit"></i></button>
                                    <button class="btn-delete" onclick="deleteStrukturConfirm(${s.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showAddStrukturForm() {
    document.getElementById('strukturForm').innerHTML = `
        <div class="form-card">
            <h4>Tambah Posisi</h4>
            <input type="text" id="newPosisi" placeholder="Posisi">
            <input type="text" id="newNamaStruktur" placeholder="Nama">
            <select id="newFotoStruktur"><option value="L1">L</option><option value="P1">P</option><option value="BP1">BP</option></select>
            <button class="admin-btn" onclick="addStrukturHandler()"><i class="fas fa-save"></i> Simpan</button>
            <button class="admin-btn" onclick="document.getElementById('strukturForm').innerHTML=''" style="background:#ff4757;">Batal</button>
        </div>
    `;
}

async function addStrukturHandler() {
    const posisi = document.getElementById('newPosisi').value;
    const nama = document.getElementById('newNamaStruktur').value;
    const foto = document.getElementById('newFotoStruktur').value;
    if (posisi && nama) {
        await addStruktur({ posisi, nama, foto });
        renderAdminStruktur();
        alert('✅ Tersimpan!');
    }
}

function showEditStrukturForm(id) {
    const s = getStruktur().find(x => x.id === id);
    if (!s) return;
    document.getElementById('strukturForm').innerHTML = `
        <div class="form-card">
            <h4>Edit</h4>
            <input type="text" id="editPosisi" value="${s.posisi}">
            <input type="text" id="editNamaStruktur" value="${s.nama}">
            <select id="editFotoStruktur"><option value="L1" ${s.foto==='L1'?'selected':''}>L</option><option value="P1" ${s.foto==='P1'?'selected':''}>P</option><option value="BP1" ${s.foto==='BP1'?'selected':''}>BP</option></select>
            <button class="admin-btn" onclick="updateStrukturHandler(${id})"><i class="fas fa-save"></i> Update</button>
            <button class="admin-btn" onclick="document.getElementById('strukturForm').innerHTML=''" style="background:#ff4757;">Batal</button>
        </div>
    `;
}

async function updateStrukturHandler(id) {
    const posisi = document.getElementById('editPosisi').value;
    const nama = document.getElementById('editNamaStruktur').value;
    const foto = document.getElementById('editFotoStruktur').value;
    if (posisi && nama) {
        await updateStruktur(id, { posisi, nama, foto });
        renderAdminStruktur();
        alert('✅ Diupdate!');
    }
}

async function deleteStrukturConfirm(id) {
    if (confirm('Yakin hapus?')) {
        await deleteStruktur(id);
        renderAdminStruktur();
        alert('✅ Dihapus!');
    }
}

// =========================================
// MUSIK
// =========================================
function renderAdminMusik() {
    const section = document.getElementById('musik');
    const musik = getMusik();
    
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;"><i class="fas fa-music"></i> MANAGE MUSIK (${musik.length})</h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddMusikForm()"><i class="fas fa-plus"></i> Tambah Lagu</button>
            <div id="musikForm" class="edit-form"></div>
            ${musik.map(m => `
                <div class="music-item">
                    <div><strong>${m.id}. ${m.judul}</strong><br><small style="opacity:0.6">${m.file}</small></div>
                    <div>
                        <button class="btn-edit" onclick="showEditMusikForm(${m.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteMusikConfirm(${m.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('')}
            <p style="opacity:0.6;font-size:0.7rem;margin-top:15px;">*Upload MP3 ke GitHub: assets/musik/</p>
        </div>
    `;
}

function showAddMusikForm() {
    document.getElementById('musikForm').innerHTML = `
        <div class="form-card">
            <h4>Tambah Lagu</h4>
            <input type="text" id="newJudul" placeholder="Judul">
            <input type="text" id="newFile" placeholder="File (lagu6.mp3)">
            <button class="admin-btn" onclick="addMusikHandler()"><i class="fas fa-save"></i> Simpan</button>
            <button class="admin-btn" onclick="document.getElementById('musikForm').innerHTML=''" style="background:#ff4757;">Batal</button>
        </div>
    `;
}

async function addMusikHandler() {
    const judul = document.getElementById('newJudul').value;
    const file = document.getElementById('newFile').value;
    if (judul && file) {
        const data = getData();
        data.musik.push({ id: getNextId(data.musik), judul, file });
        await saveToServer(data);
        renderAdminMusik();
        alert('✅ Tersimpan!');
    }
}

function showEditMusikForm(id) {
    const m = getMusik().find(x => x.id === id);
    if (!m) return;
    document.getElementById('musikForm').innerHTML = `
        <div class="form-card">
            <h4>Edit</h4>
            <input type="text" id="editJudul" value="${m.judul}">
            <input type="text" id="editFile" value="${m.file}">
            <button class="admin-btn" onclick="updateMusikHandler(${id})"><i class="fas fa-save"></i> Update</button>
            <button class="admin-btn" onclick="document.getElementById('musikForm').innerHTML=''" style="background:#ff4757;">Batal</button>
        </div>
    `;
}

async function updateMusikHandler(id) {
    const judul = document.getElementById('editJudul').value;
    const file = document.getElementById('editFile').value;
    if (judul && file) {
        const data = getData();
        const idx = data.musik.findIndex(m => m.id === id);
        if (idx !== -1) { data.musik[idx] = { id, judul, file }; await saveToServer(data); }
        renderAdminMusik();
        alert('✅ Diupdate!');
    }
}

async function deleteMusikConfirm(id) {
    if (confirm('Yakin hapus?')) {
        const data = getData();
        data.musik = data.musik.filter(m => m.id !== id);
        await saveToServer(data);
        renderAdminMusik();
        alert('✅ Dihapus!');
    }
}

// =========================================
// GALERI
// =========================================
function renderAdminGaleri() {
    const section = document.getElementById('galeri');
    const galeri = getGaleri();
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;"><i class="fas fa-images"></i> MANAGE GALERI (${galeri.length})</h2>
        <div class="admin-card">
            <p>Total foto: ${galeri.length}</p>
            <button class="admin-btn" onclick="exportData()"><i class="fas fa-download"></i> Export</button>
            <p style="opacity:0.7;font-size:0.7rem;margin-top:10px;">*Upload gambar ke: assets/images/galeri/</p>
        </div>
    `;
}

// =========================================
// EXPORT & RESET
// =========================================
function exportData() {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'data.json'; a.click();
    URL.revokeObjectURL(url);
    alert('✅ Data diexport!');
}

async function resetAllData() {
    if (confirm('⚠️ RESET SEMUA DATA?')) {
        await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ siswa:[], struktur:[], musik:[], galeri:[] }) });
        alert('✅ Direset!');
        fetchData().then(() => renderAll());
    }
}