require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./database'); // Fichier pour gérer la base de données

const app = express();
const port = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet()); // Ajoute des en-têtes HTTP sécurisés
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite à 100 requêtes par IP
    message: "Trop de requêtes, réessayez plus tard."
}));

// Middleware pour CORS et parsing
app.use(cors());
app.use(bodyParser.json());

// Initialisation de la base de données
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            x REAL,
            y REAL,
            z REAL,
            latitude REAL,
            longitude REAL,
            speed REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error("Erreur lors de l'initialisation de la base de données :", err.message);
        } else {
            console.log("Base de données initialisée avec succès.");
        }
    });
});

// POST pour stocker les données
app.post('/api/sensor-data', (req, res) => {
    const { x, y, z, latitude, longitude, speed } = req.body;

    if (x == null || y == null || z == null || latitude == null || longitude == null || speed == null) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    const query = `
        INSERT INTO sensor_data (x, y, z, latitude, longitude, speed)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [x, y, z, latitude, longitude, speed], function(err) {
        if (err) {
            console.error("Erreur lors de l'insertion :", err.message);
            return res.status(500).json({ error: 'Échec de l’enregistrement des données' });
        }
        res.status(200).json({ message: 'Données enregistrées avec succès', id: this.lastID });
    });
});

// GET pour récupérer les données
app.get('/api/sensor-data', (req, res) => {
    const query = `SELECT * FROM sensor_data ORDER BY timestamp DESC`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des données :", err.message);
            return res.status(500).json({ error: 'Échec de la récupération des données' });
        }
        res.status(200).json(rows);
    });
});

// Serveur en écoute
app.listen(port, () => {
    console.log(`API en écoute sur http://localhost:${port}`);
});
