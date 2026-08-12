import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const FULL_DATA = {
    "siswa": [
        { "id": 1, "nama": "Agustian", "nisn": "0092035245", "foto": "L1" },
        { "id": 2, "nama": "Aira Nuraeni", "nisn": "3095292849", "foto": "P1" },
        { "id": 3, "nama": "Anis", "nisn": "0097795515", "foto": "P1" },
        { "id": 4, "nama": "Arya Rafly Islami", "nisn": "0086095357", "foto": "L1" },
        { "id": 5, "nama": "Chintya Audrey", "nisn": "3095639670", "foto": "P1" },
        { "id": 6, "nama": "Dede Yusup", "nisn": "0081051689", "foto": "L1" },
        { "id": 7, "nama": "Dinda Dwi Assifa", "nisn": "0092964183", "foto": "P1" },
        { "id": 8, "nama": "Farras Dafa", "nisn": "0088459839", "foto": "L1" },
        { "id": 9, "nama": "Hera Rosmiati", "nisn": "0089845680", "foto": "P1" },
        { "id": 10, "nama": "Ikbal Patturahman", "nisn": "0088940844", "foto": "L1" },
        { "id": 11, "nama": "Julia Zahra Almunawaroh", "nisn": "3095998304", "foto": "P1" },
        { "id": 12, "nama": "Lia Sapitri", "nisn": "3080698145", "foto": "P1" },
        { "id": 13, "nama": "Muhammad Andi Nugraha", "nisn": "0085409173", "foto": "L1" },
        { "id": 14, "nama": "Muhammad Yogi", "nisn": "3082721929", "foto": "L1" },
        { "id": 15, "nama": "Muhamad Aghia Arin Pratama", "nisn": "0088654589", "foto": "L1" },
        { "id": 16, "nama": "Muhamad Jam'Ahsari", "nisn": "0084960852", "foto": "L1" },
        { "id": 17, "nama": "Muhamad Yahya Saputra", "nisn": "0089851691", "foto": "L1" },
        { "id": 18, "nama": "Nadila Sadkia", "nisn": "0083011061", "foto": "P1" },
        { "id": 19, "nama": "Nisa Tri Ramdani", "nisn": "0086054039", "foto": "P1" },
        { "id": 20, "nama": "Pina Aolia", "nisn": "0097203799", "foto": "P1" },
        { "id": 21, "nama": "Raka Tegar Wibisono", "nisn": "3086714943", "foto": "L1" },
        { "id": 22, "nama": "Resti", "nisn": "3091857797", "foto": "P1" },
        { "id": 23, "nama": "Riandi Sugilar", "nisn": "0082400185", "foto": "L1" },
        { "id": 24, "nama": "Riki Yahya Mubarok", "nisn": "0094541039", "foto": "L1" },
        { "id": 25, "nama": "Rina", "nisn": "3099386158", "foto": "P1" },
        { "id": 26, "nama": "Safa Alawiyah", "nisn": "0088378958", "foto": "P1" },
        { "id": 27, "nama": "Salwa Fauziah Assopa", "nisn": "0089051717", "foto": "P1" },
        { "id": 28, "nama": "Siti Marwah", "nisn": "0096759718", "foto": "P1" },
        { "id": 29, "nama": "Siti Sarah", "nisn": "0086637251", "foto": "P1" },
        { "id": 30, "nama": "Sri Bintang Lesmana", "nisn": "0089458793", "foto": "L1" },
        { "id": 31, "nama": "Suci Mukarimah", "nisn": "3083833260", "foto": "P1" },
        { "id": 32, "nama": "Tia Amelia", "nisn": "0094786473", "foto": "P1" },
        { "id": 33, "nama": "Yulli Sapitri", "nisn": "0089899432", "foto": "P1" }
    ],
    "struktur": [
        { "id": 1, "posisi": "Wali Kelas", "nama": "Yulih Yuliansah", "foto": "BP1" },
        { "id": 2, "posisi": "Ketua Kelas", "nama": "Julia Zahra Almunawaroh", "foto": "P1" },
        { "id": 3, "posisi": "Wakil Ketua", "nama": "Muhamad Yogi", "foto": "L1" },
        { "id": 4, "posisi": "Sekretaris 1", "nama": "Yulli Sapitri", "foto": "P1" },
        { "id": 5, "posisi": "Sekretaris 2", "nama": "Aira Nuraeni", "foto": "P1" },
        { "id": 6, "posisi": "Bendahara 1", "nama": "Chintya Audrey", "foto": "P1" },
        { "id": 7, "posisi": "Bendahara 2", "nama": "Lia Sapitri", "foto": "P1" },
        { "id": 8, "posisi": "Keagamaan 1", "nama": "Arya Rafly Islami", "foto": "L1" },
        { "id": 9, "posisi": "Keagamaan 2", "nama": "Riandi Sugilar", "foto": "L1" },
        { "id": 10, "posisi": "Olahraga 1", "nama": "Tia Amelia", "foto": "P1" },
        { "id": 11, "posisi": "Olahraga 2", "nama": "Siti Sarah", "foto": "P1" },
        { "id": 12, "posisi": "Keamanan 1", "nama": "M. Jam'Ahsari", "foto": "L1" },
        { "id": 13, "posisi": "Keamanan 2", "nama": "Riki Yahya Mubarok", "foto": "L1" },
        { "id": 14, "posisi": "Kebersihan 1", "nama": "Anis", "foto": "P1" },
        { "id": 15, "posisi": "Kebersihan 2", "nama": "Nadila Sadkia", "foto": "P1" },
        { "id": 16, "posisi": "Keperalatan 1", "nama": "Pina Aolia", "foto": "P1" },
        { "id": 17, "posisi": "Keperalatan 2", "nama": "Resti", "foto": "P1" },
        { "id": 18, "posisi": "Kependidikan 1", "nama": "Safa Alawiyah", "foto": "P1" },
        { "id": 19, "posisi": "Kependidikan 2", "nama": "Salwa Fauziah", "foto": "P1" }
    ],
    "galeri": [
        { "id": 1, "caption": "Kenangan 1", "file": "v1.png" },
        { "id": 2, "caption": "Kenangan 2", "file": "v2.png" },
        { "id": 3, "caption": "Kenangan 3", "file": "v3.png" },
        { "id": 4, "caption": "Kenangan 4", "file": "v4.png" },
        { "id": 5, "caption": "Kenangan 5", "file": "v5.png" },
        { "id": 6, "caption": "Kenangan 6", "file": "v6.png" },
        { "id": 7, "caption": "Kenangan 7", "file": "v7.png" },
        { "id": 8, "caption": "Kenangan 8", "file": "v8.png" },
        { "id": 9, "caption": "Kenangan 9", "file": "v9.png" },
        { "id": 10, "caption": "Kenangan 10", "file": "v10.png" },
        { "id": 11, "caption": "Kenangan 11", "file": "v11.png" },
        { "id": 12, "caption": "Kenangan 12", "file": "v12.png" },
        { "id": 13, "caption": "Kenangan 13", "file": "v13.png" },
        { "id": 14, "caption": "Kenangan 14", "file": "v14.png" },
        { "id": 15, "caption": "Kenangan 15", "file": "v15.png" },
        { "id": 16, "caption": "Kenangan 16", "file": "v16.png" },
        { "id": 17, "caption": "Kenangan 17", "file": "v17.png" },
        { "id": 18, "caption": "Kenangan 18", "file": "v18.png" },
        { "id": 19, "caption": "Kenangan 19", "file": "v19.png" },
        { "id": 20, "caption": "Kenangan 20", "file": "v20.png" }
    ],
    "musik": [
        { "id": 1, "judul": "Ingatlah Hari Ini", "file": "lagu1.mp3" },
        { "id": 2, "judul": "Kisah Kasih Di Sekolah", "file": "lagu2.mp3" },
        { "id": 3, "judul": "Sampai Jumpa", "file": "lagu3.mp3" },
        { "id": 4, "judul": "Sesuatu Di Jogja", "file": "lagu4.mp3" },
        { "id": 5, "judul": "Kita Ke Sana", "file": "lagu5.mp3" }
    ]
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    if (req.method === 'GET') {
        const data = await redis.get('db_tjkt');
        if (!data) {
            await redis.set('db_tjkt', FULL_DATA);
            return res.status(200).json(FULL_DATA);
        }
        return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
        await redis.set('db_tjkt', req.body);
        return res.status(200).json({ success: true });
    }
}