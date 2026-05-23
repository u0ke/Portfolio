const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.get('/api/data', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('database.json'));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Could not read database." });
    }
});

app.post('/api/data', (req, res) => {
    const { password, newData } = req.body;
    
    if (password !== '1234') {
        return res.status(401).json({ success: false, error: 'Unauthorized access.' });
    }

    // Save the completely updated data
    fs.writeFileSync('database.json', JSON.stringify(newData, null, 2));
    res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend office running on http://localhost:${PORT}`));