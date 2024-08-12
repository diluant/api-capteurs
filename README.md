
# API-Capteurs

## Description
**`API-capteurs`** est un projet conçu pour collecter des données de capteurs à partir d'une application mobile, les stocker dans une base de données et permettre aux utilisateurs de récupérer les données via une API. L'API est construite avec Node.js et prend en charge les opérations d'envoi et de récupération des données via des requêtes HTTP.

## Fonctionnalités
- **Collecte de Données :** Collecte des données provenant de divers capteurs, y compris les coordonnées GPS, l'accélération, et la vitesse.
- **Stockage de Données :** Stocke les données collectées dans une base de données pour une conservation persistante.
- **API :** Fournit un point d'accès API pour poster des données de capteur et les récupérer en utilisant des requêtes HTTP.
- **Interfaces HTML :** Comprend des pages web pour envoyer les données de capteur à l'API et les récupérer pour les afficher. (Utilisées pendant la conception)

## Aperçu des Fichiers

### 1. **`index.js`**
   - Le point d'entrée principal du serveur API.
   - Gère les routes pour les requêtes POST et GET afin d'interagir avec les données des capteurs.
   - Configure le serveur à l'aide de Express.js et gère les connexions à la base de données.

### 2. **`package.json`**
   - Contient les métadonnées du projet, y compris les dépendances et les scripts.
   - Utilisé par Node.js pour installer et gérer les dépendances du projet telles que `express` et `mongoose`.

### 3. **`config.js`**
   - Gère la configuration de la base de données et d'autres paramètres importants pour l'application.
   - Utilisé pour définir les paramètres de connexion à la base de données MongoDB.

### 4. **`models/sensorData.js`**
   - Définit le modèle de données pour les capteurs en utilisant Mongoose.
   - Spécifie la structure des données qui seront stockées dans MongoDB, telles que les axes X, Y, Z, la latitude, la longitude, et la vitesse.

### 5. **`routes/sensorData.js`**
   - Gère les routes spécifiques pour la manipulation des données des capteurs.
   - Définit les routes pour l'envoi (`POST`) et la récupération (`GET`) des données via l'API.

### 6. **`public/index.html`**
   - Page HTML pour envoyer des données de capteur à l'API.
   - Permet aux utilisateurs d'entrer manuellement les valeurs des capteurs et de les envoyer au serveur.

### 7. **`public/get-data.html`**
   - Page HTML pour récupérer et afficher les données de capteur depuis l'API.
   - Affiche les données stockées dans la base de données dans un tableau ou une autre interface visuelle.

## Installation

Pour installer et exécuter ce projet localement :

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/api-capteurs.git
   
2. Accédez au répertoire du projet :
   ```bash
   cd api-capteurs

3. Installez les dépendances :
   ```bash
   npm install

4. Configurer la Base de Données
Vous pouvez configurer les paramètres de la base de données dans le fichier config.js. Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine ou utilisez un service MongoDB hébergé comme MongoDB Atlas.
   
5. Lancez le serveur :
   ```bash
   npm start

6. Tester Localement
Accédez à l'API via [http://localhost:3000/api/sensor-data](http://localhost:3000/api/sensor-data) dans votre navigateur ou utilisez des outils comme Postman pour tester les requêtes POST et GET.

## Utilisation

Envoyer des données
Ouvrez le fichier index.html dans votre navigateur et utilisez le formulaire pour entrer les données de capteur, puis cliquez sur "Envoyer" pour les envoyer à l'API.

Récupérer des données
Ouvrez le fichier get-data.html dans votre navigateur pour afficher les données stockées. Les données seront récupérées via une requête GET à l'API et affichées dans un tableau.

## Intégration avec Render pour Héberger le Service Web

1. Créer un Compte sur Render
Si vous n'avez pas encore de compte, inscrivez-vous sur Render.

2. Déployer le Projet sur Render
Connectez votre dépôt GitHub ou GitLab à Render.
Créez un nouveau service Web sur Render.
Sélectionnez le dépôt api-capteurs pour déploiement.
Render détectera automatiquement les paramètres et le fichier package.json pour configurer le déploiement.

4. Configurer les Variables d'Environnement
Ajoutez les variables d'environnement nécessaires dans l'interface Render, telles que les configurations de base de données ou d'autres clés secrètes.
Par exemple, pour MongoDB, vous pourriez ajouter une variable MONGODB_URI.

6. Automatisation des Déploiements
À chaque fois que vous poussez des modifications dans votre dépôt Git, Render déclenchera automatiquement un nouveau déploiement du service.

7. Accéder au Service Hébergé
Une fois déployé, Render vous fournira une URL pour accéder à votre API en ligne. Utilisez cette URL pour interagir avec l'API à partir des fichiers HTML (index.html pour envoyer des données et get-data.html pour les récupérer).

8. Test en Production
Testez l'API en production en utilisant l'URL fournie par Render. Vous pouvez aussi modifier les fichiers HTML pour pointer vers cette URL de production pour l'envoi et la récupération des données.

## Résumé
Dans ce projet, j'ai intégré un service d'API pour la gestion des données de capteurs, avec une persistance via MongoDB. Le projet peut être déployé localement pour le développement, ainsi que sur la plateforme Render pour une hébergement en ligne.

### Forfait Gratuit et Limitations sur Render

#### Choix du Forfait Gratuit :

Render propose un forfait gratuit qui est adapté pour les projets universitaires et de développement personnel. Ce forfait vous permet d'héberger une application web avec des limitations spécifiques, comme un certain nombre de dynos gratuits, une mémoire limitée, et des mises en veille automatiques après une période d'inactivité.

#### Limitations :

- **Mise en veille automatique** : Après 15 minutes d'inactivité, les applications sur le forfait gratuit entrent en veille, ce qui entraîne un délai de réveil lors de la première requête après la mise en veille.
- **Mémoire et stockage limités** : Les ressources de mémoire et de stockage sont limitées, ce qui peut restreindre les performances pour des projets plus importants ou des volumes de données élevés.
- **Temps de construction limité** : Les applications ont un temps de construction limité, ce qui peut affecter les déploiements continus si votre application devient complexe.

Ces limitations font du forfait gratuit un bon choix pour les projets légers ou les premiers prototypes, mais il peut être nécessaire de passer à un forfait payant si le projet évolue vers quelque chose de plus exigeant.
