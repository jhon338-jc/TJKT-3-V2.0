/* =========================================
   ADMIN PANEL JS - TJKT 3 V2.0
   ========================================= */

const CORRECT_PIN = "030308";

/* =========================================
   1. PIN LOGIN
   ========================================= */
function addPin(num) {
    const input = document.getElementById('pinInput');
    if (!input || input.value.length >= 6) return;
    input.value += String(num);
    document.getElementById('login-error').innerText = '';
    input.classList.remove('error');
}

function clearPin() {
    const input = document.getElementById('pinInput');
    if (!input) return;
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
    
    if (!input || !loginOverlay) return;
    
    if (input.value === CORRECT_PIN) {
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
            fetchData().then(() => renderAll());
        }, 3000);
    } else {
        errorMsg.innerText = '❌ PIN SALAH!';
        input.classList.add('error');
        input.value = '';
        setTimeout(() => input.focus(), 500);
    }
}

/* Keyboard Support */
document.getElementById('pinInput').addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        addPin(e.key);
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        clearPin();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        submitPin();
    } else {
        e.preventDefault();
    }
});

function logout() {
    if (confirm('Yakin ingin logout?')) window.location.href = 'admin.html';
}

/* =========================================
   2. SIDEBAR NAVIGATION
   ========================================= */
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
            
            if (sectionId === 'dashboard') renderDashboard();
            if (sectionId === 'siswa') renderSiswa();
            if (sectionId === 'struktur') renderStruktur();
            if (sectionId === 'musik') renderMusik();
            if (sectionId === 'galeri') renderGaleri();
        });
    });
});

/* =========================================
   3. RENDER ALL
   ========================================= */
function renderAll() {
    renderDashboard();
    renderSiswa();
    renderStruktur();
    renderMusik();
    renderGaleri();
}

/* =========================================
   4. DASHBOARD
   ========================================= */
function renderDashboard() {
    const section = document.getElementById('dashboard');
    if (!section) return;
    
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
                <div class="stat-label">Pengurus</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-music"></i>
                <div class="stat-number">${musik.length}</div>
                <div class="stat-label">Lagu</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-images"></i>
                <div class="stat-number">${galeri.length}</div>
                <div class="stat-label">Foto</div>
            </div>
        </div>
        <div class="admin-card">
            <h3 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:15px;">📋 Info Kelas</h3>
            <p><strong>Wali Kelas:</strong> ${struktur.find(s => s.posisi === 'Wali Kelas')?.nama || '-'}</p>
            <p><strong>Ketua Kelas:</strong> ${struktur.find(s => s.posisi === 'Ketua Kelas')?.nama || '-'}</p>
            <p style="margin-top:10px;opacity:0.7;">Total Data: ${siswa.length + struktur.length + musik.length + galeri.length} item</p>
        </div>
    `;
}

/* =========================================
   5. CRUD SISWA
   ========================================= */
function renderSiswa() {
    const section = document.getElementById('siswa');
    if (!section) return;
    
    const siswa = getSiswa();
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;">
            <i class="fas fa-users"></i> MANAGE SISWA (${siswa.length})
        </h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddSiswaForm()">
                <i class="fas fa-plus"></i> Tambah Siswa
            </button>
            <div id="siswaForm" class="edit-form"></div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr><th>No</th><th>Nama</th><th>NISN</th><th>Foto</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        ${siswa.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${s.nama}</td>
                                <td>${s.nisn}</td>
                                <td>${s.foto}</td>
                                <td>
                                    <button class="btn-edit" onclick="showEditSiswaForm(${s.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete" onclick="deleteSiswaConfirm(${s.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
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
            <h4>Tambah Siswa Baru</h4>
            <input type="text" id="newNama" placeholder="Nama Lengkap">
            <input type="text" id="newNisn" placeholder="NISN">
            <select id="newFoto">
                <option value="L1">Laki-laki (L1)</option>
                <option value="P1">Perempuan (P1)</option>
            </select>
            <button class="admin-btn" onclick="addSiswaHandler()">
                <i class="fas fa-save"></i> Simpan
            </button>
            <button class="admin-btn" onclick="closeForm('siswaForm')" style="background:#ff4757;">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
}

async function addSiswaHandler() {
    const nama = document.getElementById('newNama').value.trim();
    const nisn = document.getElementById('newNisn').value.trim();
    const foto = document.getElementById('newFoto').value;
    
    if (!nama || !nisn) return alert('⚠️ Nama dan NISN wajib diisi!');
    
    await addSiswa({ nama, nisn, foto });
    renderSiswa();
    alert('✅ Siswa berhasil ditambahkan!');
}

function showEditSiswaForm(id) {
    const s = getSiswa().find(x => x.id === id);
    if (!s) return;
    
    document.getElementById('siswaForm').innerHTML = `
        <div class="form-card">
            <h4>Edit Data Siswa</h4>
            <input type="text" id="editNama" value="${s.nama}">
            <input type="text" id="editNisn" value="${s.nisn}">
            <select id="editFoto">
                <option value="L1" ${s.foto === 'L1' ? 'selected' : ''}>Laki-laki</option>
                <option value="P1" ${s.foto === 'P1' ? 'selected' : ''}>Perempuan</option>
            </select>
            <button class="admin-btn" onclick="updateSiswaHandler(${id})">
                <i class="fas fa-save"></i> Update
            </button>
            <button class="admin-btn" onclick="closeForm('siswaForm')" style="background:#ff4757;">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
}

async function updateSiswaHandler(id) {
    const nama = document.getElementById('editNama').value.trim();
    const nisn = document.getElementById('editNisn').value.trim();
    const foto = document.getElementById('editFoto').value;
    
    if (!nama || !nisn) return alert('⚠️ Nama dan NISN wajib diisi!');
    
    await updateSiswa(id, { nama, nisn, foto });
    renderSiswa();
    alert('✅ Data berhasil diupdate!');
}

async function deleteSiswaConfirm(id) {
    if (confirm('⚠️ Yakin hapus siswa ini?')) {
        await deleteSiswa(id);
        renderSiswa();
        alert('✅ Siswa berhasil dihapus!');
    }
}

/* =========================================
   6. CRUD STRUKTUR
   ========================================= */
function renderStruktur() {
    const section = document.getElementById('struktur');
    if (!section) return;
    
    const data = getStruktur();
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;">
            <i class="fas fa-sitemap"></i> MANAGE STRUKTUR (${data.length})
        </h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddStrukturForm()">
                <i class="fas fa-plus"></i> Tambah Posisi
            </button>
            <div id="strukturForm" class="edit-form"></div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr><th>No</th><th>Posisi</th><th>Nama</th><th>Foto</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        ${data.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${s.posisi}</td>
                                <td>${s.nama}</td>
                                <td>${s.foto}</td>
                                <td>
                                    <button class="btn-edit" onclick="showEditStrukturForm(${s.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete" onclick="deleteStrukturConfirm(${s.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
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
            <h4>Tambah Posisi Baru</h4>
            <input type="text" id="newPosisi" placeholder="Nama Posisi">
            <input type="text" id="newNamaStruktur" placeholder="Nama">
            <select id="newFotoStruktur">
                <option value="L1">Laki-laki</option>
                <option value="P1">Perempuan</option>
                <option value="BP1">BP</option>
            </select>
            <button class="admin-btn" onclick="addStrukturHandler()">
                <i class="fas fa-save"></i> Simpan
            </button>
            <button class="admin-btn" onclick="closeForm('strukturForm')" style="background:#ff4757;">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
}

async function addStrukturHandler() {
    const posisi = document.getElementById('newPosisi').value.trim();
    const nama = document.getElementById('newNamaStruktur').value.trim();
    const foto = document.getElementById('newFotoStruktur').value;
    
    if (!posisi || !nama) return alert('⚠️ Posisi dan Nama wajib diisi!');
    
    await addStruktur({ posisi, nama, foto });
    renderStruktur();
    alert('✅ Posisi berhasil ditambahkan!');
}

function showEditStrukturForm(id) {
    const s = getStruktur().find(x => x.id === id);
    if (!s) return;
    
    document.getElementById('strukturForm').innerHTML = `
        <div class="form-card">
            <h4>Edit Posisi</h4>
            <input type="text" id="editPosisi" value="${s.posisi}">
            <input type="text" id="editNamaStruktur" value="${s.nama}">
            <select id="editFotoStruktur">
                <option value="L1" ${s.foto === 'L1' ? 'selected' : ''}>Laki-laki</option>
                <option value="P1" ${s.foto === 'P1' ? 'selected' : ''}>Perempuan</option>
                <option value="BP1" ${s.foto === 'BP1' ? 'selected' : ''}>BP</option>
            </select>
            <button class="admin-btn" onclick="updateStrukturHandler(${id})">
                <i class="fas fa-save"></i> Update
            </button>
            <button class="admin-btn" onclick="closeForm('strukturForm')" style="background:#ff4757;">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
}

async function updateStrukturHandler(id) {
    const posisi = document.getElementById('editPosisi').value.trim();
    const nama = document.getElementById('editNamaStruktur').value.trim();
    const foto = document.getElementById('editFotoStruktur').value;
    
    if (!posisi || !nama) return alert('⚠️ Posisi dan Nama wajib diisi!');
    
    await updateStruktur(id, { posisi, nama, foto });
    renderStruktur();
    alert('✅ Data berhasil diupdate!');
}

async function deleteStrukturConfirm(id) {
    if (confirm('⚠️ Yakin hapus posisi ini?')) {
        await deleteStruktur(id);
        renderStruktur();
        alert('✅ Posisi berhasil dihapus!');
    }
}

/* =========================================
   7. MUSIK
   ========================================= */
function renderMusik() {
    const section = document.getElementById('musik');
    if (!section) return;
    
    const data = getMusik();
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;">
            <i class="fas fa-music"></i> MANAGE MUSIK (${data.length})
        </h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddMusikForm()">
                <i class="fas fa-plus"></i> Tambah Lagu
            </button>
            <div id="musikForm" class="edit-form"></div>
            <div class="music-list" style="margin-top:20px;">
                ${data.map(m => `
                    <div class="music-item">
                        <div>
                            <strong>${m.id}. ${m.judul}</strong>
                            <br><small style="opacity:0.6">📁 ${m.file}</small>
                        </div>
                        <div>
                            <button class="btn-edit" onclick="showEditMusikForm(${m.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="deleteMusikConfirm(${m.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <p style="opacity:0.6;font-size:0.7rem;margin-top:15px;">
                💡 Upload file MP3 ke folder <code>assets/musik/</code> via GitHub
            </p>
        </div>
    `;
}

function showAddMusikForm() {
    document.getElementById('musikForm').innerHTML = `
        <div class="form-card">
            <h4>Tambah Lagu Baru</h4>
            <input type="text" id="newJudul" placeholder="Judul Lagu">
            <input type="text" id="newFile" placeholder="Nama File (contoh: lagu6.mp3)">
            <button class="admin-btn" onclick="addMusikHandler()">
                <i class="fas fa-save"></i> Simpan
            </button>
            <button class="admin-btn" onclick="closeForm('musikForm')" style="background:#ff4757;">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
}

async function addMusikHandler() {
    const judul = document.getElementById('newJudul').value.trim();
    const file = document.getElementById('newFile').value.trim();
    
    if (!judul || !file) return alert('⚠️ Judul dan File wajib diisi!');
    
    const data = getData();
    data.musik.push({ id: getNextId(data.musik), judul, file });
    await saveToServer(data);
    renderMusik();
    alert('✅ Lagu berhasil ditambahkan!');
}

function showEditMusikForm(id) {
    const m = getMusik().find(x => x.id === id);
    if (!m) return;
    
    document.getElementById('musikForm').innerHTML = `
        <div class="form-card">
            <h4>Edit Lagu</h4>
            <input type="text" id="editJudul" value="${m.judul}">
            <input type="text" id="editFile" value="${m.file}">
            <button class="admin-btn" onclick="updateMusikHandler(${id})">
                <i class="fas fa-save"></i> Update
            </button>
            <button class="admin-btn" onclick="closeForm('musikForm')" style="background:#ff4757;">
                <i class="fas fa-times"></i> Batal
            </button>
        </div>
    `;
}

async function updateMusikHandler(id) {
    const judul = document.getElementById('editJudul').value.trim();
    const file = document.getElementById('editFile').value.trim();
    
    if (!judul || !file) return alert('⚠️ Judul dan File wajib diisi!');
    
    const data = getData();
    const idx = data.musik.findIndex(m => m.id === id);
    if (idx !== -1) {
        data.musik[idx] = { id, judul, file };
        await saveToServer(data);
    }
    renderMusik();
    alert('✅ Lagu berhasil diupdate!');
}

async function deleteMusikConfirm(id) {
    if (confirm('⚠️ Yakin hapus lagu ini?')) {
        const data = getData();
        data.musik = data.musik.filter(m => m.id !== id);
        await saveToServer(data);
        renderMusik();
        alert('✅ Lagu berhasil dihapus!');
    }
}

/* =========================================
   8. GALERI
   ========================================= */
function renderGaleri() {
    const section = document.getElementById('galeri');
    if (!section) return;
    
    const data = getGaleri();
    section.innerHTML = `
        <h2 style="font-family:var(--font-cyber);color:var(--neon);margin-bottom:20px;">
            <i class="fas fa-images"></i> MANAGE GALERI (${data.length})
        </h2>
        <div class="admin-card">
            <p>📸 Total foto: <strong>${data.length}</strong></p>
            <button class="admin-btn" onclick="exportData()" style="margin-top:15px;">
                <i class="fas fa-download"></i> Export Data JSON
            </button>
            <p style="opacity:0.6;font-size:0.7rem;margin-top:10px;">
                💡 Upload gambar ke folder <code>assets/images/galeri/</code> via GitHub
            </p>
        </div>
    `;
}

/* =========================================
   9. UTILS
   ========================================= */
function closeForm(formId) {
    document.getElementById(formId).innerHTML = '';
}

function exportData() {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Data berhasil diexport!');
}

async function resetAllData() {
    if (confirm('⚠️ RESET SEMUA DATA?\n\nSemua data akan kembali ke awal!')) {
        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siswa: [], struktur: [], musik: [], galeri: [] })
        });
        await fetchData();
        renderAll();
        alert('✅ Data berhasil direset!');
    }
}