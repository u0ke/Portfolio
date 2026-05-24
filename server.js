const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const DB_FILE = 'database.json';

// Initialize Database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        about: { text: "Hello, I am a developer.", image: "assets/download.jpg" },
        skills: ["HTML", "CSS", "JavaScript", "Tailwind"],
        projects: []
    }));
}

// Fetch all data
app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data);
});

// Update About Section & Profile Photo
app.post('/api/about', upload.single('image'), (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    if (req.body.text) data.about.text = req.body.text;
    if (req.file) data.about.image = 'uploads/' + req.file.filename;
    
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, about: data.about });
});

// Update Skills
app.post('/api/skills', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    data.skills = req.body.skills || [];
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, skills: data.skills });
});

// Add a New Project Box
app.post('/api/projects', upload.single('image'), (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const newProject = {
        id: Date.now().toString(), // Unique ID
        title: req.body.title,
        description: req.body.description,
        image: req.file ? 'uploads/' + req.file.filename : 'assets/default-project.jpg'
    };
    data.projects.push(newProject);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, project: newProject });
});

// Delete a Project Box
app.delete('/api/projects/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    data.projects = data.projects.filter(p => p.id !== req.params.id);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Enables file uploading

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/assets', express.static('assets')); // Serve uploaded images to the portfolio

// Configure Multer to save files in the "assets" folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './assets/';
        if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Renames file to prevent duplicate name conflicts
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const DB_PATH = './database.json';

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ about: {}, skills: [], projects: [] }));
}

// Fetch Data
app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(data);
});

// Save Full Portfolio Data
app.post('/api/data', (req, res) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});

// Handle Image Uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ imageUrl: '/assets/' + req.file.filename });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));