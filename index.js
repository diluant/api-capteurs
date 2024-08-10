const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  // Add this line
app.use(bodyParser.json());

// Existing POST endpoint to store data
app.post('/api/sensor-data', (req, res) => {
    const { x, y, z, latitude, longitude, speed } = req.body;

    const query = `
        INSERT INTO sensor_data (x, y, z, latitude, longitude, speed)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [x, y, z, latitude, longitude, speed], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to store data in the database' });
            return;
        }
        res.status(200).json({ message: 'Data stored successfully', id: this.lastID });
    });
});

// New GET endpoint to retrieve data
app.get('/api/sensor-data', (req, res) => {
    const query = `SELECT * FROM sensor_data ORDER BY timestamp DESC`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to retrieve data from the database' });
            return;
        }
        res.status(200).json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
