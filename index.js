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

// Configuration pour les proxys (Render ou autre)
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

    if (x == null || y == null || z == null || latitude == null || longitude == null || speed == null || trajetId == null) {
        console.error("Requête invalide :", req.body);
        return res.status(400).json({ error: 'Tous les champs sont obligatoires, y compris trajetId' });
    }

    try {
        const coordonnee = new Coordonnee(x, y, z, latitude, longitude, speed, trajetId);
        const savedCoord = await coordonnee.save();
        console.log("Coordonnée sauvegardée :", savedCoord);
        res.status(200).json({ message: 'Coordonnée enregistrée avec succès', data: savedCoord });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement des données' });
    }
});

// GET pour récupérer toutes les coordonnées
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

// GET pour récupérer les coordonnées d'un trajet spécifique
app.get('/api/trajets/:id/sensor-data', async (req, res) => {
    const { id } = req.params;

    try {
        const coordinates = await Coordonnee.getAllByTrajetId(id);
        console.log(`Coordonnées pour le trajet ${id} récupérées :`, coordinates);
        res.status(200).json(coordinates);
    } catch (err) {
        console.error("Erreur lors de la récupération des coordonnées pour le trajet :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

// POST pour créer un trajet
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

// GET pour récupérer tous les trajets
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

// Serveur en écoute
app.listen(port, () => {
    console.log(`API en écoute sur http://localhost:${port}`);
});
