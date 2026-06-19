const fs = require('fs').promises;
const path = require('path');

const DASHBOARD_FILE = path.join(__dirname, '../dashboardData.json');

async function saveDashboardMemory(groupedResults) {
    try {
        const dataToSave = {
            timestamp: new Date().toISOString(),
            groups: groupedResults
        };
        await fs.writeFile(DASHBOARD_FILE, JSON.stringify(dataToSave));
    } catch (error) {}
}

async function loadDashboardMemory() {
    try {
        const data = await fs.readFile(DASHBOARD_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { timestamp: null, groups: [] };
    }
}

module.exports = { saveDashboardMemory, loadDashboardMemory };