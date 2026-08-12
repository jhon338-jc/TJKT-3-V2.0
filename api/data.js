import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'assets', 'data', 'data.json');

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    // GET - Baca data
    if (req.method === 'GET') {
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf-8');
            const data = JSON.parse(raw);
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Gagal baca data' });
        }
    }
    
    // POST - Simpan data
    if (req.method === 'POST') {
        try {
            const newData = req.body;
            fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf-8');
            return res.status(200).json({ success: true, message: 'Data tersimpan!' });
        } catch (err) {
            return res.status(500).json({ error: 'Gagal simpan data' });
        }
    }
    
    res.status(405).json({ error: 'Method not allowed' });
}