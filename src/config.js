require('dotenv').config();
const path = require('path');

module.exports = {
    BASE_URL: "https://www.vinted.fr/catalog",
    DEFAULT_PARAMS: {
        "catalog[]": "2319",
        "price_to": "30",
        "currency": "EUR",
        "order": "newest_first",
        "language_book_ids[]": "6436"
    },
    SEARCHES: [
        { search_text: "La guerre du pavot" },
        { search_text: "La cité de jade" },
        {
            search_text: "The everlasting",
            "price_to": "15",
            "language_book_ids[]": "6435"
        },
        {
            search_text: "The poet empress",
            "price_to": "15",
            "language_book_ids[]": "6435"
        }
    ],
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    CRON_INTERVAL: process.env.CRON_INTERVAL || "*/30 * * * *",
    SAVE_FILE: path.join(__dirname, '../seenItems.json')
};