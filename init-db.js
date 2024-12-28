const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('Connexion à SQLite réussie.');
    }
});

// Initialiser les tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS trajets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table trajets:", err.message);
        } else {
            console.log("Table trajets prête.");
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            x REAL NOT NULL,
            y REAL NOT NULL,
            z REAL NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            speed REAL NOT NULL,
            trajetId INTEGER,
            FOREIGN KEY (trajetId) REFERENCES trajets(id) ON DELETE CASCADE
        );
    `, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table sensor_data:", err.message);
        } else {
            console.log("Table sensor_data prête.");
        }
    });
});

db.close();
