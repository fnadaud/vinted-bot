# Documentation Serveur Mac - Vinted Bot

Ce document explique comment configurer un Mac (puce Intel) pour qu'il agisse comme un serveur autonome, économe en énergie, et exécutant le bot Vinted ainsi que son tableau de bord en arrière-plan via PM2.

---

## 1. Préparation Matérielle et Économie d'Énergie

L'objectif est de permettre au Mac de fonctionner 24h/24 sans abîmer la batterie et avec le capot fermé.

### Protection de la Batterie
* Installer l'application **AlDente**.
* Régler la limite de charge maximale entre 50% et 60%.

### Fonctionnement Capot Fermé
* Installer l'application **Amphetamine**.
* Configurer l'application pour empêcher la mise en veille lorsque le capot est fermé.

### Réglages Système (Économie & Automatisation)
1. **Énergie :** Dans les Préférences Système, cocher "Empêcher la suspension d'activité automatique du Mac lorsque l'écran est éteint".
2. **Périphériques :** Désactiver le Bluetooth, baisser la luminosité du clavier à zéro et couper le son.
3. **Planification :** Configurer un allumage automatique le matin (ex: 07:00) et une extinction le soir (ex: 23:30) via l'onglet Planifier des paramètres de Batterie/Énergie.
4. **Session :** Dans "Utilisateurs et groupes", activer l'ouverture de session automatique pour ton compte (nécessite de désactiver FileVault au préalable).
5. **Spotlight :** Dans les paramètres Spotlight (Confidentialité), ajouter le dossier du projet `vinted-bot` pour empêcher l'indexation continue du fichier mémoire.

---

## 2. Mise en place de PM2

PM2 est le gestionnaire qui va faire tourner le bot et le serveur web en arrière-plan.

### Installation Initiale
Ouvrir le terminal et exécuter :
```bash
npm install -g pm2
pm2 install pm2-logrotate

```

### Lancement des processus

Se placer dans le dossier du projet `vinted-bot` et exécuter :

1. Lancement du Bot (avec récurrence toutes les 15 minutes) :

```bash
pm2 start npm --name "vinted-bot" --cron "*/15 * * * *" --no-autorestart -- run bot

```

2. Lancement du Tableau de bord Web :

```bash
pm2 start npm --name "vinted-dashboard" -- start

```

### Automatisation au redémarrage

Pour que PM2 relance ces processus à chaque fois que le Mac s'allume le matin :

```bash
pm2 startup

```

Copier et exécuter la ligne de commande générée par la commande ci-dessus, puis enregistrer la configuration :

```bash
pm2 save

```

---

## 3. Accès au Tableau de Bord (Local)

Pour accéder au tableau de bord depuis un téléphone connecté au même réseau Wi-Fi :

1. Trouver l'adresse IP du Mac via le terminal :

```bash
ipconfig getifaddr en0

```

2. Sur le téléphone, ouvrir un navigateur et entrer l'adresse IP suivie du port 3000 (ex: `http://192.168.1.15:3000`).
3. S'assurer que le coupe-feu du Mac autorise les connexions entrantes pour Node.js.

---

## 4. Commandes Utiles (Gestion Quotidienne)

Voir l'état de tous les processus en cours :

```bash
pm2 list

```

Voir les logs (sorties console) en temps réel :

```bash
pm2 logs

```

Vider les fichiers de logs si besoin :

```bash
pm2 flush

```

---

## 5. Arrêt et Désinstallation

Si le projet doit être mis en pause ou retiré du Mac, voici les procédures.

### Arrêt Temporaire

Pour stopper les processus sans les supprimer (ils ne se lanceront plus jusqu'à ce qu'on les redémarre manuellement) :

```bash
pm2 stop vinted-bot
pm2 stop vinted-dashboard

```

### Suppression des Processus (Désinstallation logicielle)

Pour retirer définitivement les scripts de PM2 :

```bash
pm2 delete vinted-bot
pm2 delete vinted-dashboard
pm2 save

```

### Désactivation du Lancement au Démarrage (Désinstallation système)

Pour empêcher PM2 de se lancer automatiquement à l'allumage du Mac :

```bash
pm2 unstartup

```

Copier et exécuter la ligne générée par le système pour retirer les droits.

### Désinstallation Complète de PM2

Si PM2 n'est plus du tout nécessaire sur la machine :

```bash
npm uninstall -g pm2

```