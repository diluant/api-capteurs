require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Coordonnee, Trajet } = require('./models'); // Importer les modèles

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

// POST pour sauvegarder une coordonnée
app.post('/api/sensor-data', async (req, res) => {
    const { x, y, z, latitude, longitude, speed } = req.body;

    if (x == null || y == null || z == null || latitude == null || longitude == null || speed == null) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    try {
        const coordonnee = new Coordonnee(x, y, z, latitude, longitude, speed);
        const savedCoord = await coordonnee.save();
        res.status(200).json({ message: 'Coordonnée enregistrée avec succès', data: savedCoord });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err.message);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement des données' });
    }
});

// GET pour récupérer toutes les coordonnées
app.get('/api/sensor-data', async (req, res) => {
    try {
        const coordinates = await Coordonnee.getAll();
        res.status(200).json(coordinates);
    } catch (err) {
        console.error("Erreur lors de la récupération :", err.message);
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
        res.status(200).json({ message: 'Trajet créé avec succès', data: savedTrajet });
    } catch (err) {
        console.error("Erreur lors de la création du trajet :", err.message);
        res.status(500).json({ error: 'Erreur lors de la création du trajet' });
    }
});

// GET pour récupérer tous les trajets
app.get('/api/trajets', async (req, res) => {
    try {
        const trajets = await Trajet.getAll();
        res.status(200).json(trajets);
    } catch (err) {
        console.error("Erreur lors de la récupération des trajets :", err.message);
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
