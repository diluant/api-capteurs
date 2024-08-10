const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/sensor-data', (req, res) => {
    const { x, y, z, latitude, longitude, speed } = req.body;
    
    console.log(`Accélération: x=${x}, y=${y}, z=${z}`);
    console.log(`Position: latitude=${latitude}, longitude=${longitude}`);
    console.log(`Vitesse: ${speed} km/h`);

    res.status(200).json({ message: 'Données reçues avec succès' });
});

app.listen(port, () => {
    console.log(`API en écoute sur http://localhost:${port}`);
});
