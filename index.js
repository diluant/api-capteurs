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
