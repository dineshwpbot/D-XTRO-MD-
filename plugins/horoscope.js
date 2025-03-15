const axios = require('axios');
const { Client } = require('whatsapp-web.js');
const { default: scrap } = require('@dark-yasiya/scrap');  // Import the 'scrap' npm package
const client = new Client();

// lagnapalapala.lk API URL
const lagnaApiURL = "https://www.palapala.lk/daily/";

// Lagna horoscope command
const handleLagnaCommand = async (msg, lagna) => {
    try {
        // Fetch horoscope data from lagnapalapala.lk
        const response = await axios.get(`${lagnaApiURL}${lagna}`);
        const horoscope = response.data;

        // Send horoscope to the user
        client.sendMessage(msg.from, `ඔබේ ${lagna} පලාපල:\n\n${horoscope}`);
    } catch (error) {
        console.error("Error fetching horoscope from lagnapalapala.lk:", error);
        msg.reply("දැනට පලාපල ලබා ගත නොහැක.");
    }
};

// Scrape News or Other Content (using scrap npm package)
const fetchScrapContent = async (url) => {
    try {
        const data = await scrap(url);
        return data;
    } catch (error) {
        console.error("Error scraping content:", error);
        return null;
    }
};

// Handle incoming messages
client.on('message', async (msg) => {
    if (msg.body.startsWith('.lagna')) {
        const lagna = msg.body.split(' ')[1].toLowerCase();
        handleLagnaCommand(msg, lagna);
    }

    if (msg.body.startsWith('.scrap')) {
        const url = msg.body.split(' ')[1];  // Get URL from the command
        const content = await fetchScrapContent(url);

        if (content) {
            client.sendMessage(msg.from, `Scraped Content:\n\n${content}`);
        } else {
            msg.reply("මෙම URL එකේ content ලබා ගත නොහැක.");
        }
    }
});

// Initialize the client
client.initialize();
