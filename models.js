const sqlite3 = require('sqlite3').verbose();

class Coordonnee {
    constructor(x, y, z, latitude, longitude, speed, trajetId, calculatedSpeed = null) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.calculatedSpeed = calculatedSpeed; // Vitesse calculée
        this.trajetId = trajetId; // Clé étrangère
    }

    static initialize(db) {
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
    }

    save() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            db.run(
                `INSERT INTO coordonnee (x, y, z, latitude, longitude, speed, calculated_speed, trajetId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [this.x, this.y, this.z, this.latitude, this.longitude, this.speed, this.calculatedSpeed, this.trajetId],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...this });
                    }
                }
            );
            db.close();
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            db.all(
                `SELECT id, x, y, z, latitude, longitude, speed, calculated_speed, trajetId, created_at FROM coordonnee`,
                [],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
            db.close();
        });
    }

    static getAllByTrajetId(trajetId) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            db.all(
                `SELECT id, x, y, z, latitude, longitude, speed, calculated_speed, created_at FROM coordonnee WHERE trajetId = ?`,
                [trajetId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
            db.close();
        });
    }
}

class Trajet {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static initialize(db) {
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
    }

    save(end = false) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            if (end) {
                db.run(
                    `UPDATE trajets SET ended_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    [this.id],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id: this.id, ...this });
                        }
                    }
                );
            } else {
                db.run(
                    `INSERT INTO trajets (name) VALUES (?)`,
                    [this.name],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id: this.lastID, ...this });
                        }
                    }
                );
            }
            db.close();
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            db.all(`SELECT id, name, created_at, ended_at FROM trajets`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
            db.close();
        });
    }
}

module.exports = { Coordonnee, Trajet };
