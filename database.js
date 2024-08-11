const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite (ou création si n'existe pas)
// Connect to the SQLite database (or create it if it doesn't exist)
const dbPath = path.resolve(__dirname, 'sensor_data.db');
const db = new sqlite3.Database(dbPath);

// Création de la table pour storer les données des capteurs si n'existe pas
// Create the table for storing sensor data if it doesn't exist
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
    `);
});

module.exports = db;
