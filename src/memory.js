const fs = require('fs').promises;
const { SAVE_FILE } = require('./config');

let seenItems = new Set();

async function loadMemory() {
    try {
        const data = await fs.readFile(SAVE_FILE, 'utf8');
        seenItems = new Set(JSON.parse(data));
        console.log(`[${new Date().toLocaleTimeString()}] 💾 Mémoire chargée : ${seenItems.size} IDs récupérés.`);
    } catch (error) {
        seenItems = new Set();
        console.log(`[${new Date().toLocaleTimeString()}] 📝 Aucun historique trouvé. Création d'un nouveau fichier.`);
    }
}

async function saveMemory() {
    try {
        const idsArray = Array.from(seenItems);
        await fs.writeFile(SAVE_FILE, JSON.stringify(idsArray), 'utf8');
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error.message);
    }
}

function hasBeenSeen(id) {
    return seenItems.has(id);
}

function addSeen(id) {
    seenItems.add(id);
}

module.exports = { loadMemory, saveMemory, hasBeenSeen, addSeen };