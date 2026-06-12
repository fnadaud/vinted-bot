require('dotenv').config();
const path = require('path');

module.exports = {
    BASE_URL: "https://www.vinted.fr/catalog",
    DEFAULT_PARAMS: {
        "catalog[]": "2319",
        "price_to": "30",
        "currency": "EUR",
        "order": "relevance",
        "language_book_ids[]": "6436"
    },
    SEARCHES: [
        { search_text: "La Cité de Jade" },
        { search_text: "Les Aventures d'Amina al-Sirafi" }
    ],
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    BOT_SAVE_FILE: path.join(__dirname, '../seenItems.json'),
    DASHBOARD_SAVE_FILE: path.join(__dirname, '../dashboardData.json')
};