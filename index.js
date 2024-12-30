require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const { Coordonnee, Trajet } = require('./models');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configuration pour les proxys
app.set('trust proxy', true);

// Initialiser la base de données
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('Connexion à SQLite réussie.');
    }
});

Coordonnee.initialize(db);
Trajet.initialize(db);

// Middleware de sécurité
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite à 100 requêtes par IP
    message: "Trop de requêtes, réessayez plus tard."
}));

// Middleware pour CORS et parsing
app.use(cors());
app.use(bodyParser.json());

// POST pour sauvegarder une coordonnée
app.post('/api/sensor-data', async (req, res) => {
    const { x, y, z, latitude, longitude, speed, trajetId } = req.body;

    if ([x, y, z, latitude, longitude, speed, trajetId].some(v => v == null)) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
        const coordonnee = new Coordonnee(x, y, z, latitude, longitude, speed, trajetId);
        const savedCoord = await coordonnee.save();
        res.status(200).json({ message: 'Coordonnée enregistrée avec succès', data: savedCoord });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement des données' });
    }
});

// POST pour réinitialiser la base de données
app.post('/api/reset-database', (req, res) => {
    // Supprimer la base de données si elle existe
    if (fs.existsSync('./database.sqlite')) {
        fs.unlinkSync('./database.sqlite');
        console.log('Base de données supprimée.');
    }

    // Recréer la base de données
    const db = new sqlite3.Database('./database.sqlite', (err) => {
        if (err) {
            console.error('Erreur lors de la création de la base de données:', err.message);
            return res.status(500).json({ error: 'Erreur lors de la création de la base de données.' });
        }

        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS trajets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    ended_at DATETIME
                );
            `);
            db.run(`
                CREATE TABLE IF NOT EXISTS coordonnee (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    x REAL NOT NULL,
                    y REAL NOT NULL,
                    z REAL NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    speed REAL NOT NULL,
                    calculated_speed REAL,
                    trajetId INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (trajetId) REFERENCES trajets(id) ON DELETE CASCADE
                );
            `);
            res.status(200).json({ message: 'Base de données réinitialisée avec succès.' });
        });

        db.close();
    });
});

// API en écoute
app.listen(port, () => {
    console.log(`API en écoute sur le port ${port}`);
});
