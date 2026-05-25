const cron = require('node-cron');
const { SEARCHES, CRON_INTERVAL } = require('./config');
const { buildVintedUrl } = require('./url');
const { launchBrowser, scrapePage } = require('./scraper');
const { sendDiscordNotification } = require('./discord');
const { loadMemory, saveMemory, hasBeenSeen, addSeen } = require('./memory');

let isFirstRun = true;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runRoutine() {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 Démarrage du cycle de vérification...`);
    let newItemsFound = 0;
    const browser = await launchBrowser();

    try {
        for (const search of SEARCHES) {
            const finalUrl = buildVintedUrl(search);
            const items = await scrapePage(browser, finalUrl);

            for (const item of items) {
                if (!hasBeenSeen(item.id)) {
                    newItemsFound++;
                    addSeen(item.id);
                    
                    if (!isFirstRun) {
                        await sendDiscordNotification(item);
                    }
                }
            }

            await sleep(Math.floor(Math.random() * 3000) + 2000);
        }
    } finally {
        await browser.close();
    }

    if (isFirstRun) {
        console.log(`📥 Initialisation terminée. ${newItemsFound} annonces ajoutées à la mémoire sans envoi de notification.`);
        isFirstRun = false;
        await saveMemory();
    } else if (newItemsFound > 0) {
        console.log(`✅ ${newItemsFound} nouvelle(s) annonce(s) au total détectée(s).`);
        await saveMemory();
    } else {
        console.log("💤 Aucune nouvelle annonce sur l'ensemble des recherches.");
    }
}

async function start() {
    console.log("🟢 Initialisation du moniteur Vinted...");
    await loadMemory();
    
    await runRoutine();

    cron.schedule(CRON_INTERVAL, () => {
        runRoutine();
    });
}

start();