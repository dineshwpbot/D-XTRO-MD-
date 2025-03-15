const axios = require('axios');
const cron = require('node-cron');
const { Client } = require('whatsapp-web.js');
const client = new Client();

// Lagna horoscope API URL
const lagnaHoroscopeAPI = "https://www.palapala.lk/daily/";

// Lagna list
const lagnaList = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

let autoSendEnabled = false; // Auto-send is initially disabled

// Fetch Horoscope from the API
const getLagnaHoroscope = async (lagna) => {
    try {
        const response = await axios.get(`${lagnaHoroscopeAPI}${lagna}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching horoscope:", error);
        return "Horoscope data unavailable.";
    }
};

// Send Horoscope to the user
const sendHoroscope = async (lagna, chatId) => {
    const horoscope = await getLagnaHoroscope(lagna);
    client.sendMessage(chatId, horoscope);
};

// Handle Lagna Command
const handleLagnaCommand = async (msg, lagna) => {
    if (lagnaList.includes(lagna)) {
        const horoscope = await getLagnaHoroscope(lagna);
        client.sendMessage(msg.from, horoscope);
    } else {
        msg.reply("ඔබ ලබාදුන් lagna වලංගු නැත. කරුණාකර .lagna command එක සහ lagna එක නිවැරදිව ලබා දී බලන්න.");
    }
};

// Start auto-send functionality for all active chats
const startAutoSend = async () => {
    autoSendEnabled = true;
    for (let lagna of lagnaList) {
        // Send horoscope to all active chats
        for (let [key, value] of client.chatChats) {
            if (value.isGroup) {
                await sendHoroscope(lagna, key);
            }
        }
    }
    client.sendMessage("Auto-send for lagna horoscopes activated!");
};

// Cron job to auto-send daily horoscope to all groups
cron.schedule('0 6 * * *', async () => {
    if (autoSendEnabled) {
        for (let lagna of lagnaList) {
            // Send horoscope to all active chats
            for (let [key, value] of client.chatChats) {
                if (value.isGroup) {
                    await sendHoroscope(lagna, key);
                }
            }
        }
    }
});

// Handle incoming messages
client.on('message', (msg) => {
    if (msg.body.startsWith('.lagna')) {
        const lagna = msg.body.split(' ')[1].toLowerCase();
        handleLagnaCommand(msg, lagna);
    }

    // "startinformation" command to start auto-send
    if (msg.body.toLowerCase() === 'startinformation') {
        startAutoSend();
    }
});

// Initialize the client
client.initialize();
