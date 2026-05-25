const { DISCORD_WEBHOOK_URL } = require('./config');

async function sendDiscordNotification(item) {
    const payload = {
        embeds: [{
            title: item.title,
            url: item.url,
            color: 0x09B1BA,
            image: { url: item.image },
            fields: [
                { name: "Prix", value: `**${item.price}**`, inline: true },
            ],
            footer: { text: `ID Vinted : ${item.id}` },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi Discord :", error.message);
    }
}

module.exports = { sendDiscordNotification };