const express = require('express');
const path = require('path');
const { loadDashboardMemory } = require('./memory-dashboard');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/data', async (req, res) => {
    const data = await loadDashboardMemory();
    res.json(data);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur web accessible sur le réseau local au port ${port}`);
});