# Vinted Monitor Bot 🚀

Un bot Node.js pour surveiller automatiquement les annonces Vinted selon plusieurs critères de recherche et envoyer des notifications sur un serveur Discord via un Webhook.


## 📂 Architecture du Projet

```text
vinted-bot/
├── src/
│   ├── config.js          # Centralisation de la configuration et des recherches
│   ├── url.js             # Assembleur dynamique d'URL Vinted (URLSearchParams)
│   ├── scraper.js         # Logique Puppeteer (lancement navigateur & scraping)
│   ├── memory.js          # Gestion du fichier historique (lecture/écriture JSON)
│   ├── discord.js         # Formatage de l'embed et envoi du Webhook Discord
│   ├── test-discord.js    # Script de test unitaire pour valider le Webhook
│   └── index.js           # Point d'entrée principal (Chef d'orchestre & Cron)
├── .env                   # Variables d'environnement (Webhook, Intervalle)
├── .gitignore             # Fichiers exclus de Git
├── .dockerignore          # Fichiers exclus de l'image Docker
├── Dockerfile             # Recette de l'image Docker (inclut dépendances Chrome)
├── package.json           # Dépendances et scripts de lancement
└── seenItems.json         # Historique des annonces déjà vues (généré automatiquement)
```


## 🛠️ Configuration Initiale

### 1. Cloner le projet et installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/VOTRE_WEBHOOK_ICI
CRON_INTERVAL="*/15 * * * *"
```

### 3. Ajuster vos filtres de recherche

Ouvrez `src/config.js` pour y déclarer vos requêtes sous le tableau `SEARCHES`.
*Exemple de configuration avec filtres par défaut et surcharges :*

```javascript
DEFAULT_PARAMS: {
    "catalog[]": "2319",             // Livres par défaut
    "price_to": "30",                // 30€ max par défaut
    "currency": "EUR",
    "order": "newest_first",
    "language_book_ids[]": "6436"    // Français par défaut
},
SEARCHES: [
    {
        search_text: "Le seigneur des anneaux",
        price_to: "15"               // Écrase le prix max à 15€ pour ce livre
    },
    {
        search_text: "L'empire du silence",
        "language_book_ids[]": null, // Désactive le filtre langue de livre
        price_to: "50"
    }
]
```


## 🚀 Lancement en Local

Le projet intègre trois commandes principales déclarées dans le `package.json` :

### Tester le Webhook Discord

Envoie instantanément le résultat le plus récent de votre première recherche sur Discord pour valider le visuel et la connexion :

```bash
npm run test:discord
```

### Lancer en Mode Développement

Démarre le bot avec **Nodemon**, qui redémarrera automatiquement l'application à chaque modification de code :

```bash
npm run dev
```

### Lancer en Production (Standard)

Démarre le bot normalement :

```bash
npm start
```


## 🐳 Lancement avec Docker

Docker encapsule toutes les dépendances graphiques Linux indispensables pour exécuter Puppeteer, garantissant un fonctionnement identique partout.

### 1. Construire l'image Docker

Déclenchez la création de l'image localement (nommée `vinted-bot`) :

```bash
docker build -t vinted-bot .
```

### 2. Lancer un conteneur de Test

Pour exécuter le conteneur une fois au premier plan en lui passant le fichier `.env` local :

```bash
docker run --env-file .env vinted-bot
```

### 3. Déploiement permanent (Production)

Pour le faire tourner en arrière-plan (détaché), s'assurer qu'il redémarre automatiquement si la machine reboot, et **conserver le fichier mémoire** `seenItems.json` sur l'hôte afin de ne jamais perdre l'historique :

```bash
docker run -d \
  --name mon-vinted-bot \
  --restart always \
  --env-file .env \
  -v $(pwd)/seenItems.json:/app/seenItems.json \
  vinted-bot
```


## 📝 Bon à savoir

* **Premier passage (`isFirstRun`) :** Lors du premier cycle de vérification, la console indiquera `Initialisation terminée. X annonces ajoutées à la mémoire sans envoi de notification`. C'est le comportement normal pour éviter un spam initial. Les notifications arriveront dès le cycle suivant.
* **Veille d'ordinateur :** Si vous l'exécutez localement sur votre ordinateur personnel, assurez-vous d'éteindre uniquement votre écran mais de désactiver la mise en veille système pour éviter que le script ne s'interrompe.