import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    if (req.method === 'GET') {
        const data = await redis.get('db_tjkt');
        if (!data) {
            return res.status(200).json({
                siswa: [
                    { id: 1, nama: "Agustian", nisn: "0092035245", foto: "L1" },
                    { id: 2, nama: "Aira Nuraeni", nisn: "3095292849", foto: "P1" }
                ],
                struktur: [],
                galeri: [],
                musik: []
            });
        }
        return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
        await redis.set('db_tjkt', req.body);
        return res.status(200).json({ success: true });
    }
}