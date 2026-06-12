const fs = require('fs').promises;
const { DASHBOARD_SAVE_FILE } = require('./config');

async function loadDashboardMemory() {
    try {
        const data = await fs.readFile(DASHBOARD_SAVE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveDashboardMemory(items) {
    try {
        await fs.writeFile(DASHBOARD_SAVE_FILE, JSON.stringify(items));
    } catch (error) {}
}

module.exports = { loadDashboardMemory, saveDashboardMemory };