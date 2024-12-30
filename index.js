const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const { Coordonnee, Trajet } = require('./models');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Initialisation de la base de données
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Erreur lors de la connexion à SQLite:', err.message);
    else console.log('Connexion à SQLite réussie.');
});
Coordonnee.initialize(db);
Trajet.initialize(db);

// Routes API
app.post('/api/trajets', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nom obligatoire' });

    try {
        const trajet = new Trajet(null, name);
        const result = await trajet.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du trajet.' });
    }
});

app.get('/api/trajets', async (req, res) => {
    try {
        const trajets = await Trajet.getAll();
        res.status(200).json(trajets);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des trajets.' });
    }
});

app.post('/api/sensor-data', async (req, res) => {
    const { x, y, z, latitude, longitude, speed, calculatedSpeed, trajetId } = req.body;
    if ([x, y, z, latitude, longitude, speed, trajetId].some(v => v == null))
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });

    try {
        const coord = new Coordonnee(x, y, z, latitude, longitude, speed, trajetId, calculatedSpeed);
        const result = await coord.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement des données.' });
    }
});

app.get('/api/trajets/:id/sensor-data', async (req, res) => {
    const { id } = req.params;
    try {
        const coords = await Coordonnee.getAllByTrajetId(id);
        res.status(200).json(coords);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
});

app.patch('/api/trajets/:id/terminate', async (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database('./database.sqlite');

    db.run(
        `UPDATE trajets SET ended_at = datetime('now') WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.error("Erreur lors de la mise à jour de ended_at :", err.message);
                res.status(500).json({ error: "Erreur lors de la mise à jour du trajet." });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Trajet non trouvé." });
            } else {
                res.status(200).json({ message: "Trajet terminé avec succès." });
            }
        }
    );

    db.close();
});

// Réinitialiser la base de données
app.post('/api/reset-database', (req, res) => {
    if (fs.existsSync('./database.sqlite')) fs.unlinkSync('./database.sqlite');
    const db = new sqlite3.Database('./database.sqlite', (err) => {
        if (err) {
            console.error('Erreur lors de la création de la base de données:', err.message);
            return res.status(500).json({ error: 'Erreur lors de la création de la base de données.' });
        }
        Coordonnee.initialize(db);
        Trajet.initialize(db);
        res.status(200).json({ message: 'Base de données réinitialisée avec succès.' });
    });
});


// Serveur
app.listen(port, () => console.log(`API en écoute sur le port ${port}`));
