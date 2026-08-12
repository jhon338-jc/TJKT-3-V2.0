/* =========================================
   ADMIN PANEL JS - TJKT 3 (CRUD VERSION + API SYNC)
   ========================================= */

const CORRECT_PIN = "030308";

// PIN Input Functions
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
            dashboard.style.display = 'block';
            document.body.style.overflow = 'auto';
            fetchData().then(() => renderAdminData());
        }, 3000);
        
    } else {
        errorMsg.innerText = '❌ PIN SALAH! AKSES DITOLAK!';
        input.classList.add('error');
        input.value = '';
        input.style.animation = 'none';
        input.offsetHeight;
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => { input.focus(); }, 500);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('pinInput');
        if (document.activeElement === input) submitPin();
    }
});

function logout() {
    if (confirm('Yakin ingin logout?')) {
        window.location.href = 'admin.html';
    }
}

// =========================================
// CRUD RENDER FUNCTIONS
// =========================================

function renderAdminData() {
    renderAdminSiswa();
    renderAdminStruktur();
    renderAdminGaleri();
    renderAdminMusik();
}

// SISWA
function renderAdminSiswa() {
    const section = document.getElementById('siswa');
    const siswa = getSiswa();
    
    section.innerHTML = `
        <h2><i class="fas fa-users"></i> MANAGE SISWA (${siswa.length})</h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddSiswaForm()"><i class="fas fa-plus"></i> Tambah Siswa</button>
            <button class="admin-btn" onclick="resetData()" style="background:#ff4757;margin-left:10px;"><i class="fas fa-redo"></i> Reset Data</button>
            <div id="siswaForm" class="edit-form"></div>
            <div class="data-table">
                <table>
                    <thead><tr><th>No</th><th>Nama</th><th>NISN</th><th>Foto</th><th>Aksi</th></tr></thead>
                    <tbody>
                        ${siswa.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${s.nama}</td>
                                <td>${s.nisn}</td>
                                <td>${s.foto}</td>
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
            <h4>Tambah Siswa Baru</h4>
            <input type="text" id="newNama" placeholder="Nama Lengkap">
            <input type="text" id="newNisn" placeholder="NISN">
            <select id="newFoto">
                <option value="L1">Laki-laki (L1)</option>
                <option value="P1">Perempuan (P1)</option>
            </select>
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
        renderAdminData();
        alert('✅ Siswa ditambahkan & TERSIMPAN di server! Semua device akan melihat data baru.');
    }
}

function showEditSiswaForm(id) {
    const siswa = getSiswa().find(s => s.id === id);
    if (!siswa) return;
    
    document.getElementById('siswaForm').innerHTML = `
        <div class="form-card">
            <h4>Edit Siswa</h4>
            <input type="text" id="editNama" value="${siswa.nama}">
            <input type="text" id="editNisn" value="${siswa.nisn}">
            <select id="editFoto">
                <option value="L1" ${siswa.foto === 'L1' ? 'selected' : ''}>Laki-laki</option>
                <option value="P1" ${siswa.foto === 'P1' ? 'selected' : ''}>Perempuan</option>
            </select>
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
        renderAdminData();
        alert('✅ Data diupdate & TERSIMPAN di server!');
    }
}

async function deleteSiswaConfirm(id) {
    if (confirm('Yakin hapus siswa ini?')) {
        await deleteSiswa(id);
        renderAdminData();
        alert('✅ Siswa dihapus!');
    }
}

// STRUKTUR
function renderAdminStruktur() {
    const section = document.getElementById('struktur');
    const struktur = getStruktur();
    
    section.innerHTML = `
        <h2><i class="fas fa-sitemap"></i> MANAGE STRUKTUR (${struktur.length})</h2>
        <div class="admin-card">
            <button class="admin-btn" onclick="showAddStrukturForm()"><i class="fas fa-plus"></i> Tambah Posisi</button>
            <div id="strukturForm" class="edit-form"></div>
            <div class="data-table">
                <table>
                    <thead><tr><th>No</th><th>Posisi</th><th>Nama</th><th>Foto</th><th>Aksi</th></tr></thead>
                    <tbody>
                        ${struktur.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${s.posisi}</td>
                                <td>${s.nama}</td>
                                <td>${s.foto}</td>
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
            <h4>Tambah Posisi Baru</h4>
            <input type="text" id="newPosisi" placeholder="Nama Posisi">
            <input type="text" id="newNamaStruktur" placeholder="Nama">
            <select id="newFotoStruktur">
                <option value="L1">Laki-laki</option>
                <option value="P1">Perempuan</option>
                <option value="BP1">BP</option>
            </select>
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
        renderAdminData();
        alert('✅ Posisi ditambahkan & TERSIMPAN di server!');
    }
}

function showEditStrukturForm(id) {
    const item = getStruktur().find(s => s.id === id);
    if (!item) return;
    
    document.getElementById('strukturForm').innerHTML = `
        <div class="form-card">
            <h4>Edit Struktur</h4>
            <input type="text" id="editPosisi" value="${item.posisi}">
            <input type="text" id="editNamaStruktur" value="${item.nama}">
            <select id="editFotoStruktur">
                <option value="L1" ${item.foto === 'L1' ? 'selected' : ''}>Laki-laki</option>
                <option value="P1" ${item.foto === 'P1' ? 'selected' : ''}>Perempuan</option>
                <option value="BP1" ${item.foto === 'BP1' ? 'selected' : ''}>BP</option>
            </select>
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
        renderAdminData();
        alert('✅ Data diupdate & TERSIMPAN di server!');
    }
}

async function deleteStrukturConfirm(id) {
    if (confirm('Yakin hapus posisi ini?')) {
        await deleteStruktur(id);
        renderAdminData();
        alert('✅ Posisi dihapus!');
    }
}

// GALERI
function renderAdminGaleri() {
    const section = document.getElementById('galeri');
    const galeri = getGaleri();
    
    section.innerHTML = `
        <h2><i class="fas fa-images"></i> MANAGE GALERI (${galeri.length})</h2>
        <div class="admin-card">
            <p>Total foto: ${galeri.length}</p>
            <button class="admin-btn" onclick="exportData()"><i class="fas fa-download"></i> EXPORT DATA</button>
            <p style="opacity:0.7;font-size:0.7rem;margin-top:10px;">*Upload gambar manual ke folder assets/images/galeri/</p>
        </div>
    `;
}

// MUSIK
function renderAdminMusik() {
    const section = document.getElementById('musik');
    const musik = getMusik();
    
    section.innerHTML = `
        <h2><i class="fas fa-music"></i> MANAGE MUSIK (${musik.length})</h2>
        <div class="admin-card">
            <div class="music-list">
                ${musik.map(m => `
                    <div class="music-item">
                        <span>${m.id}. ${m.judul}</span>
                        <span style="opacity:0.5">${m.file}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Export data
function exportData() {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Data diexport! Upload ke GitHub jika API Vercel belum aktif.');
}

// Smooth scroll
document.querySelectorAll('.admin-menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.admin-menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        }
    });
});