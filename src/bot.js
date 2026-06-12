const { SEARCHES } = require('./config');
const { buildVintedUrl } = require('./url');
const { launchBrowser, scrapePage } = require('./scraper');
const { sendDiscordNotification } = require('./discord');
const { loadMemory, saveMemory, hasBeenSeen, addSeen } = require('./memory-bot');
const { checkRelevance } = require('./filter');

const isSilent = process.argv.includes('--silent');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBot() {
    console.log(`Démarrage du bot ${isSilent ? '(Mode Initialisation)' : ''}`);
    const browser = await launchBrowser();
    let memoryUpdated = false;

    try {
        await loadMemory();

        for (const search of SEARCHES) {
            console.log(`Recherche : "${search.search_text}"`);
            const finalUrl = buildVintedUrl(search);
            const items = await scrapePage(browser, finalUrl);
            
            let newCount = 0;
            let relevantCount = 0;

            for (const item of items) {
                if (!hasBeenSeen(item.id)) {
                    newCount++;
                    if (checkRelevance(item.title, search.search_text, search.min_relevance)) {
                        relevantCount++;
                        addSeen(item.id);
                        memoryUpdated = true;
                        if (!isSilent) {
                            await sendDiscordNotification(item);
                        }
                    } else {
                        addSeen(item.id);
                        memoryUpdated = true;
                    }
                }
            }
            
            console.log(`   └─ ${items.length} analysées | ${newCount} nouvelles | ${relevantCount} pertinentes`);
            await sleep(2000);
        }

        if (memoryUpdated) {
            await saveMemory();
            console.log(`Mémoire mise à jour`);
        } else {
            console.log(`Aucune nouveauté, mémoire inchangée`);
        }
    } finally {
        await browser.close();
        console.log(`Fin du cycle`);
        process.exit(0);
    }
}

runBot();