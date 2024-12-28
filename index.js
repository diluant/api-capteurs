require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const { Coordonnee, Trajet } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', true);

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('Connexion à SQLite réussie.');
    }
});

Coordonnee.initialize(db);
Trajet.initialize(db);

app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Trop de requêtes, réessayez plus tard."
}));

app.use(cors());
app.use(bodyParser.json());

app.post('/api/sensor-data', async (req, res) => {
    const { x, y, z, latitude, longitude, speed } = req.body;

    if (x == null || y == null || z == null || latitude == null || longitude == null || speed == null) {
        console.error("Requête invalide :", req.body);
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    try {
        const coordonnee = new Coordonnee(x, y, z, latitude, longitude, speed);
        const savedCoord = await coordonnee.save();
        console.log("Coordonnée sauvegardée :", savedCoord);
        res.status(200).json({ message: 'Coordonnée enregistrée avec succès', data: savedCoord });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement des données' });
    }
});

app.get('/api/sensor-data', async (req, res) => {
    try {
        const coordinates = await Coordonnee.getAll();
        console.log("Coordonnées récupérées :", coordinates);
        res.status(200).json(coordinates);
    } catch (err) {
        console.error("Erreur lors de la récupération :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

app.post('/api/trajets', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Le nom du trajet est obligatoire' });
    }

    try {
        const trajet = new Trajet(null, name);
        const savedTrajet = await trajet.save();
        console.log("Trajet créé :", savedTrajet);
        res.status(200).json({ message: 'Trajet créé avec succès', data: savedTrajet });
    } catch (err) {
        console.error("Erreur lors de la création du trajet :", err);
        res.status(500).json({ error: 'Erreur lors de la création du trajet' });
    }
});

app.get('/api/trajets', async (req, res) => {
    try {
        const trajets = await Trajet.getAll();
        console.log("Trajets récupérés :", trajets);
        res.status(200).json(trajets);
    } catch (err) {
        console.error("Erreur lors de la récupération des trajets :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des trajets' });
    }
});

app.get('/', (req, res) => {
    res.send('Bienvenue à l\'API des capteurs ! Utilisez les endpoints /api/sensor-data ou /api/trajets.');
});

app.listen(port, () => {
    console.log(`API en écoute sur http://localhost:${port}`);
});
