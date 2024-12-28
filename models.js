const sqlite3 = require('sqlite3').verbose();

class Coordonnee {
    constructor(x, y, z, latitude, longitude, speed) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
    }

    static initialize(db) {
        db.run(`
            CREATE TABLE IF NOT EXISTS sensor_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                x REAL NOT NULL,
                y REAL NOT NULL,
                z REAL NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                speed REAL NOT NULL
            );
        `, (err) => {
            if (err) {
                console.error("Erreur lors de la création de la table sensor_data:", err.message);
            } else {
                console.log("Table sensor_data prête.");
            }
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            db.run(
                `INSERT INTO sensor_data (x, y, z, latitude, longitude, speed) VALUES (?, ?, ?, ?, ?, ?)`,
                [this.x, this.y, this.z, this.latitude, this.longitude, this.speed],
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
            db.all(`SELECT * FROM sensor_data`, [], (err, rows) => {
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

class Trajet {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static initialize(db) {
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
    }

    save() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
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
            db.close();
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./database.sqlite');
            db.all(`SELECT * FROM trajets`, [], (err, rows) => {
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
