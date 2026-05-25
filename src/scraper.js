const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function launchBrowser() {
    return await puppeteer.launch({
        headless: true, 
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1280,800'
        ]
    });
}

async function scrapePage(browser, url) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const items = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('.feed-grid__item, [data-testid^="grid-item"]'));
            
            return elements.map(el => {
                const linkNode = el.querySelector('a');
                const imgNode = el.querySelector('img');
                const priceNode = el.querySelector('p[data-testid*="price-text"]');
                const titleNode = el.querySelector('p[data-testid*="description-title"]');

                const itemUrl = linkNode ? linkNode.href : 'Unknown URL';
                let id = null;
                
                if (itemUrl !== 'Unknown URL') {
                    const match = itemUrl.match(/items\/(\d+)-/);
                    if (match) id = match[1];
                }
                
                let cleanPrice = 'Prix inconnu';
                if (priceNode) {
                    cleanPrice = priceNode.innerText.replace(/\u00A0/g, ' ').replace('\n', ' ').trim();
                }

                let cleanTitle = titleNode ? titleNode.innerText.trim() : (imgNode ? imgNode.alt : 'Titre inconnu');

                return {
                    id: id,
                    title: cleanTitle,
                    price: cleanPrice,
                    url: itemUrl,
                    image: imgNode ? imgNode.src : null
                };
            }).filter(item => item.id !== null);
        });

        return items;

    } catch (error) {
        console.error(`❌ Erreur sur ${url} :`, error.message);
        return [];
    } finally {
        await page.close();
    }
}

module.exports = { launchBrowser, scrapePage };