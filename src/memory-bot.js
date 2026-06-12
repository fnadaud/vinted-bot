const fs = require('fs').promises;
const { BOT_SAVE_FILE } = require('./config');

const MAX_MEMORY_SIZE = 5000; 
let seenItems = new Set();

async function loadMemory() {
    try {
        const data = await fs.readFile(BOT_SAVE_FILE, 'utf8');
        const itemsArray = JSON.parse(data);
        seenItems = new Set(itemsArray);
        console.log(`Mémoire chargée (${seenItems.size} annonces)`);
    } catch (error) {
        seenItems = new Set();
        console.log(`Création d'une nouvelle mémoire`);
    }
}

async function saveMemory() {
    try {
        let itemsArray = Array.from(seenItems);
        if (itemsArray.length > MAX_MEMORY_SIZE) {
            itemsArray = itemsArray.slice(itemsArray.length - MAX_MEMORY_SIZE);
            seenItems = new Set(itemsArray);
        }
        await fs.writeFile(BOT_SAVE_FILE, JSON.stringify(itemsArray));
    } catch (error) {}
}

function hasBeenSeen(id) {
    return seenItems.has(id);
}

function addSeen(id) {
    seenItems.add(id);
}

module.exports = { loadMemory, saveMemory, hasBeenSeen, addSeen };