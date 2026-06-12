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
    const browser = await launchBrowser();
    let memoryUpdated = false;

    try {
        await loadMemory();

        for (const search of SEARCHES) {
            const finalUrl = buildVintedUrl(search);
            const items = await scrapePage(browser, finalUrl);

            for (const item of items) {
                if (!hasBeenSeen(item.id)) {
                    if (checkRelevance(item.title, search.search_text, search.min_relevance)) {
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
            await sleep(2000);
        }

        if (memoryUpdated) {
            await saveMemory();
        }
    } finally {
        await browser.close();
        process.exit(0);
    }
}

runBot();