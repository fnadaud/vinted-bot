const fs = require('fs').promises;
const { SAVE_FILE } = require('./config');

const MAX_MEMORY_SIZE = 5000; 

let seenItems = new Set();

async function loadMemory() {
    try {
        const data = await fs.readFile(SAVE_FILE, 'utf8');
        const itemsArray = JSON.parse(data);
        seenItems = new Set(itemsArray);
        console.log(`📁 Mémoire chargée : ${seenItems.size} annonces en base.`);
    } catch (error) {
        console.log("📁 Aucun historique trouvé, création d'une nouvelle mémoire.");
        seenItems = new Set();
    }
}

async function saveMemory() {
    try {
        let itemsArray = Array.from(seenItems);

        if (itemsArray.length > MAX_MEMORY_SIZE) {
            const itemsToRemove = itemsArray.length - MAX_MEMORY_SIZE;
            itemsArray = itemsArray.slice(itemsToRemove);
            
            seenItems = new Set(itemsArray);
            console.log(`🧹 Nettoyage de la mémoire : ${itemsToRemove} vieilles annonces supprimées.`);
        }

        await fs.writeFile(SAVE_FILE, JSON.stringify(itemsArray));
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde de la mémoire :", error.message);
    }
}

function hasBeenSeen(id) {
    return seenItems.has(id);
}

function addSeen(id) {
    seenItems.add(id);
}

module.exports = { loadMemory, saveMemory, hasBeenSeen, addSeen };