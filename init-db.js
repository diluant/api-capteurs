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
    // Table trajets
    db.run(`
        CREATE TABLE IF NOT EXISTS trajets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ended_at DATETIME
        );
    `, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table trajets:", err.message);
        } else {
            console.log("Table trajets prête avec timestamps.");
        }
    });

    // Table coordonnee
    db.run(`
        CREATE TABLE IF NOT EXISTS coordonnee (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            x REAL NOT NULL,
            y REAL NOT NULL,
            z REAL NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            speed REAL NOT NULL,
            calculated_speed REAL, -- Vitesse calculée ajoutée
            trajetId INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (trajetId) REFERENCES trajets(id) ON DELETE CASCADE
        );
    `, (err) => {
        if (err) {
            console.error("Erreur lors de la création de la table coordonnee:", err.message);
        } else {
            console.log("Table coordonnee prête avec vitesse calculée.");
        }
    });
});

db.close();
