const express = require('express');
const path = require('path');
const { SEARCHES } = require('./config');
const { buildVintedUrl } = require('./url');
const { launchBrowser, scrapePage } = require('./scraper');
const { checkRelevance } = require('./filter');
const { loadDashboardMemory, saveDashboardMemory } = require('./memory-dashboard');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/items', async (req, res) => {
    const items = await loadDashboardMemory();
    res.json(items);
});

app.post('/api/refresh', async (req, res) => {
    const browser = await launchBrowser();
    let groupedResults = [];

    try {
        for (const search of SEARCHES) {
            const finalUrl = buildVintedUrl(search);
            const items = await scrapePage(browser, finalUrl);
            let validItems = [];

            for (const item of items) {
                if (checkRelevance(item.title, search.search_text, search.min_relevance)) {
                    validItems.push(item);
                }
            }

            validItems.sort((a, b) => parseInt(b.id) - parseInt(a.id));

            groupedResults.push({
                search_text: search.search_text,
                items: validItems
            });
        }

        await saveDashboardMemory(groupedResults);
        res.json(groupedResults);
        
    } catch (error) {
        res.status(500).json({ error: "Erreur" });
    } finally {
        await browser.close();
    }
});

app.listen(PORT, () => {});