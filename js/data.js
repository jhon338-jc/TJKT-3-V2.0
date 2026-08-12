/* =========================================
   DATABASE TJKT 3 - VERCEL API SYNC
   ========================================= */

const API_URL = '/api/data';

let dbData = null;

// Fetch data dari API Vercel
async function fetchData() {
    try {
        const response = await fetch(API_URL + '?t=' + Date.now());
        if (!response.ok) throw new Error('Gagal fetch');
        dbData = await response.json();
        localStorage.setItem('db_tjkt', JSON.stringify(dbData));
        return dbData;
    } catch (error) {
        console.log('Fetch API gagal, pakai localStorage:', error);
        const cache = localStorage.getItem('db_tjkt');
        if (cache) { dbData = JSON.parse(cache); return dbData; }
        return null;
    }
}

// Simpan data ke API Vercel
async function saveToServer(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            localStorage.setItem('db_tjkt', JSON.stringify(data));
            dbData = data;
            return true;
        }
        return false;
    } catch (error) {
        console.log('Gagal simpan ke server, fallback localStorage');
        localStorage.setItem('db_tjkt', JSON.stringify(data));
        dbData = data;
        return false;
    }
}

function getData() { return dbData; }
function getSiswa() { return getData()?.siswa || []; }
function getStruktur() { return getData()?.struktur || []; }
function getGaleri() { return getData()?.galeri || []; }
function getMusik() { return getData()?.musik || []; }
function getNextId(arr) { return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1; }

// CRUD with AUTO SAVE
async function addSiswa(item) {
    const data = getData();
    item.id = getNextId(data.siswa);
    data.siswa.push(item);
    await saveToServer(data);
    return item;
}

async function updateSiswa(id, newData) {
    const data = getData();
    const idx = data.siswa.findIndex(s => s.id === id);
    if (idx !== -1) {
        data.siswa[idx] = { ...data.siswa[idx], ...newData };
        await saveToServer(data);
    }
}

async function deleteSiswa(id) {
    const data = getData();
    data.siswa = data.siswa.filter(s => s.id !== id);
    await saveToServer(data);
}

async function addStruktur(item) {
    const data = getData();
    item.id = getNextId(data.struktur);
    data.struktur.push(item);
    await saveToServer(data);
    return item;
}

async function updateStruktur(id, newData) {
    const data = getData();
    const idx = data.struktur.findIndex(s => s.id === id);
    if (idx !== -1) {
        data.struktur[idx] = { ...data.struktur[idx], ...newData };
        await saveToServer(data);
    }
}

async function deleteStruktur(id) {
    const data = getData();
    data.struktur = data.struktur.filter(s => s.id !== id);
    await saveToServer(data);
}

function resetData() {
    localStorage.removeItem('db_tjkt');
    fetchData().then(() => location.reload());
}

// Init
fetchData();