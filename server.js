const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const safeName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        cb(null, safeName);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOADS_DIR));

// --- API: Get data ---
app.get('/api/data', (req, res) => {
    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        res.json(JSON.parse(raw));
    } catch (err) {
        console.error('Read error:', err);
        res.status(500).json({ error: 'Failed to read database.json' });
    }
});

// --- API: Save all data ---
app.post('/api/data', (req, res) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true, message: 'Saved to database.json' });
    } catch (err) {
        console.error('Write error:', err);
        res.status(500).json({ error: 'Failed to save database.json' });
    }
});

// --- API: Upload image ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ imageUrl: '/uploads/' + req.file.filename });
});

// --- API: Delete image (optional) ---
app.delete('/api/upload', (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const filePath = path.join(__dirname, imageUrl);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true });
    }
    res.status(404).json({ error: 'File not found' });
});

app.listen(PORT, () => {
    console.log(`✅ Portfolio running at http://localhost:${PORT}`);
    console.log(`🔐 Admin panel:  http://localhost:${PORT}/admin.html`);
});
