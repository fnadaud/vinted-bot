# Vinted Scraper & Bot Discord

Ce projet est une application Node.js permettant de surveiller les nouvelles annonces Vinted. Il propose une architecture double : un bot automatisé envoyant des notifications sur Discord, et un tableau de bord web local pour visualiser les annonces manuellement.

## Fonctionnalités

* Scraping automatisé via Puppeteer.
* Filtrage intelligent par pertinence du titre.
* Notifications Discord avec images, prix et liens directs.
* Tableau de bord accessible via navigateur.
* Architecture mémoire séparée : protection anti-spam pour Discord et affichage instantané pour le web.
* Support complet pour une automatisation via GitHub Actions.
* Support Docker pour l'hébergement du serveur web.

## Prérequis

* Node.js
* Git
* Un Webhook Discord (pour les notifications)

## Installation

1. Cloner le dépôt :
```bash
   git clone <url-du-depot>
   cd vinted-bot
```

2. Installer les dépendances :

```bash
   npm install
```

## Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet et y ajouter l'URL du webhook Discord :

```env
DISCORD_WEBHOOK_URL=[https://discord.com/api/webhooks/](https://discord.com/api/webhooks/)...
```

### Paramètres de recherche

Modifier le fichier `src/config.js` pour ajuster vos recherches.

* `DEFAULT_PARAMS` : Paramètres d'URL appliqués à toutes les recherches (tri, prix, catégorie).
* `SEARCHES` : Tableau contenant vos recherches spécifiques (mots-clés, score de pertinence minimum requis, etc.).

## Utilisation

Le projet propose plusieurs commandes via `npm` selon l'utilisation souhaitée.

### Tableau de bord Web (Interface Graphique)

Pour lancer l'interface web locale :

```bash
npm start
```

* Accéder au tableau de bord via `http://localhost:3000`.
* Cliquer sur "Refresh" pour lancer le scraping manuellement et afficher les annonces triées par groupes.

### Bot Discord (Notifications)

Pour lancer le bot manuellement une seule fois et envoyer des notifications pour les nouvelles annonces :

```bash
npm run bot
```

### Initialisation Silencieuse (Recommandé)

Lors de l'ajout d'une nouvelle recherche, il est conseillé de remplir la mémoire du bot sans envoyer de notifications sur Discord pour éviter le spam initial :

```bash
npm run bot:init
```

## Architecture des Mémoires

Le projet utilise deux systèmes de mémoire distincts pour répondre à des besoins différents :

* Mémoire du Bot (`seenItems.json`) : Fonctionne comme une file d'attente FIFO limitée à 5000 identifiants. Elle empêche le spam sur Discord causé par la remontée d'anciennes annonces (yoyo des prix, annonces vendues).
* Mémoire du Web (`dashboardData.json`) : Écrasée à chaque rafraîchissement. Elle permet au tableau de bord d'afficher exactement ce qui est présent sur la première page de Vinted à l'instant T.

## Déploiement

### Automatisation via GitHub Actions

Le projet inclut un fichier de workflow `.github/workflows/bot.yml` configuré pour exécuter la commande `npm run bot` toutes les 15 minutes.

1. Ajouter le fichier `seenItems.json` au dépôt Git.
2. Ajouter le secret `DISCORD_WEBHOOK_URL` dans les paramètres "Secrets and variables" du dépôt GitHub.
3. Le workflow s'exécutera automatiquement, committera les changements de mémoire et poussera les mises à jour sur le dépôt.

### Docker (Serveur Web)

Un `Dockerfile` est fourni pour conteneuriser le serveur web Express.

```bash
docker build -t vinted-dashboard .
docker run -p 3000:3000 vinted-dashboard
```