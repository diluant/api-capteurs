
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Définir le chemin de la base de données à partir des variables d'environnement ou d'un chemin par défaut
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'sensor_data.db');

// Connexion à la base de données SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`Erreur lors de la connexion à la base de données : ${err.message}`);
    } else {
        console.log(`Connecté à la base de données SQLite : ${dbPath}`);
    }
});

// Initialisation des tables
db.serialize(() => {
    // Table pour les données des capteurs
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
            console.error(`Erreur lors de la création de la table sensor_data : ${err.message}`);
        } else {
            console.log("Table 'sensor_data' vérifiée/initialisée avec succès.");
        }
    });

    // Table pour les trajets
    db.run(`
        CREATE TABLE IF NOT EXISTS trajets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error(`Erreur lors de la création de la table trajets : ${err.message}`);
        } else {
            console.log("Table 'trajets' vérifiée/initialisée avec succès.");
        }
    });

    // Table pour associer trajets et coordonnées
    db.run(`
        CREATE TABLE IF NOT EXISTS trajet_coordinates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trajet_id INTEGER NOT NULL,
            coordinate_id INTEGER NOT NULL,
            FOREIGN KEY (trajet_id) REFERENCES trajets(id),
            FOREIGN KEY (coordinate_id) REFERENCES sensor_data(id)
        )
    `, (err) => {
        if (err) {
            console.error(`Erreur lors de la création de la table trajet_coordinates : ${err.message}`);
        } else {
            console.log("Table 'trajet_coordinates' vérifiée/initialisée avec succès.");
        }
    });
});

module.exports = db;
