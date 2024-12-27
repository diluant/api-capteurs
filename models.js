
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connexion à la base de données SQLite
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'sensor_data.db');
const db = new sqlite3.Database(dbPath);

// Classe Coordonnee
class Coordonnee {
    constructor(x, y, z, latitude, longitude, speed, timestamp = new Date()) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.timestamp = timestamp;
    }

    // Méthode pour sauvegarder une coordonnée dans la base de données
    save() {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO sensor_data (x, y, z, latitude, longitude, speed, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(query, [this.x, this.y, this.z, this.latitude, this.longitude, this.speed, this.timestamp],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, ...this });
                    }
                });
        });
    }

    // Méthode statique pour récupérer toutes les coordonnées
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM sensor_data ORDER BY timestamp DESC`;
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new Coordonnee(row.x, row.y, row.z, row.latitude, row.longitude, row.speed, row.timestamp)));
                }
            });
        });
    }
}

// Classe Trajet
class Trajet {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.coordinates = [];
    }

    // Ajouter une coordonnée au trajet
    addCoordonnee(coordonnee) {
        this.coordinates.push(coordonnee);
    }

    // Sauvegarder le trajet dans la base de données
    save() {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO trajets (name) VALUES (?)
            `;
            db.run(query, [this.name], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, name: this.name });
                }
            });
        });
    }

    // Méthode statique pour récupérer tous les trajets
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM trajets`;
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => new Trajet(row.id, row.name)));
                }
            });
        });
    }

    // Récupérer toutes les coordonnées associées à ce trajet
    getCoordinates() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT sensor_data.* FROM sensor_data
                INNER JOIN trajet_coordinates ON sensor_data.id = trajet_coordinates.coordinate_id
                WHERE trajet_coordinates.trajet_id = ?
            `;
            db.all(query, [this.id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    this.coordinates = rows.map(row => new Coordonnee(row.x, row.y, row.z, row.latitude, row.longitude, row.speed, row.timestamp));
                    resolve(this.coordinates);
                }
            });
        });
    }
}

module.exports = { Coordonnee, Trajet, db };
