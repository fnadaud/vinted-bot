const { SEARCHES } = require('./config');
const { buildVintedUrl } = require('./url');
const { launchBrowser, scrapePage } = require('./scraper');
const { sendDiscordNotification } = require('./discord');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testNotification({ limitPerSearch = 10, targetIndices = null } = {}) {
    console.log(`🧪 Démarrage du test Discord...`);
    console.log(`⚙️  Configuration : ${limitPerSearch} annonce(s) max par recherche.`);
    
    // On filtre les recherches selon les index demandés, ou on les prend toutes si targetIndices est null
    const searchesToRun = targetIndices 
        ? targetIndices.map(index => SEARCHES[index]).filter(Boolean) // filter(Boolean) retire les index invalides
        : SEARCHES;

    if (searchesToRun.length === 0) {
        console.log("❌ Aucune recherche valide sélectionnée.");
        return;
    }

    const browser = await launchBrowser();

    try {
        for (let i = 0; i < searchesToRun.length; i++) {
            const search = searchesToRun[i];
            const testUrl = buildVintedUrl(search);
            
            console.log(`\n🔍 Scraping de la recherche : "${search.search_text}"`);
            const items = await scrapePage(browser, testUrl);

            // On coupe le tableau selon la limite demandée
            const topItems = items.slice(0, limitPerSearch);

            if (topItems.length > 0) {
                console.log(`📢 Envoi de ${topItems.length} notification(s) sur Discord...`);
                
                for (let j = 0; j < topItems.length; j++) {
                    const item = topItems[j];
                    console.log(`   -> Envoi de : "${item.title}"`);
                    await sendDiscordNotification(item);
                    
                    await sleep(1000); 
                }
            } else {
                console.log("❌ Aucune annonce trouvée pour cette recherche.");
            }

            if (i < searchesToRun.length - 1) {
                console.log("⏳ Pause de 3 secondes avant la prochaine recherche...");
                await sleep(3000);
            }
        }
        
        console.log("\n✅ Toutes les notifications de test ont été envoyées avec succès !");
        
    } catch (error) {
        console.error("\n❌ Erreur pendant le test :", error.message);
    } finally {
        await browser.close();
        console.log("🛑 Navigateur fermé. Fin du test.");
    }
}

/* * Exemples d'utilisation :
 * * Tester 1 seule annonce de la 1ère recherche (Index 0) :
 * targetIndices: [0], limitPerSearch: 1
 * * Tester 5 annonces de la 1ère et 3ème recherche (Index 0 et 2) :
 * targetIndices: [0, 2], limitPerSearch: 5
 */
testNotification({ 
    limitPerSearch: 3,
    targetIndices: null 
});