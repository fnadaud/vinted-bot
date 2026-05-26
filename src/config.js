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
        { search_text: "La guerre du pavot" },
        { search_text: "La cité de jade" },
        { search_text: "Le livre des terres bannies" },
        { search_text: "nevernight" },
        { search_text: "l'empire du vampire" },
        { search_text: "l'assassin royal" },
        { search_text: "les aventuriers de la mer" },
    ],
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    CRON_INTERVAL: process.env.CRON_INTERVAL || "*/30 * * * *",
    SAVE_FILE: path.join(__dirname, '../seenItems.json')
};