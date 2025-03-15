const axios = require('axios');
const cron = require('node-cron');
const { Client } = require('whatsapp-web.js');
const client = new Client();

const lagnaHoroscopeAPI = "https://www.palapala.lk/daily/";

const lagnaList = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

let autoSendEnabled = false; // Auto-send ක්‍රියාවලියක් සක්‍රීයයි

// Group chat ID දෙකක්
const groupChatIds = [
    '120363021938526250@g.us', // පළමු group ID
    '120363376342659899@g.us'  // දෙවෙනි group ID
];

const getLagnaHoroscope = async (lagna) => {
    try {
        const response = await axios.get(`${lagnaHoroscopeAPI}${lagna}`);
        return response.data;
    } catch (error) {
        console.error("Horoscope data එක ලබා ගැනීමේ දෝෂයක්:", error);
        return "Horoscope data unavailable.";
    }
};

const sendHoroscope = async (lagna, chatId) => {
    const horoscope = await getLagnaHoroscope(lagna);
    client.sendMessage(chatId, horoscope);
};

const handleLagnaCommand = async (msg, lagna) => {
    const horoscope = await getLagnaHoroscope(lagna);
    client.sendMessage(msg.from, horoscope);
};

const startAutoSend = async () => {
    autoSendEnabled = true;
    for (let groupId of groupChatIds) {
        await client.sendMessage(groupId, "ඔබට සුබ දවසක්! Auto-send ලග්න පලාපල ක්‍රියාත්මක වෙයි.");
        for (let lagna of lagnaList) {
            await sendHoroscope(lagna, groupId);
        }
    }
};

// ලැබෙන පණිවිඩ අසා
client.on('message', (msg) => {
    if (msg.body.startsWith('.lagna')) {
        const lagna = msg.body.split(' ')[1].toLowerCase();
        if (lagnaList.includes(lagna)) {
            handleLagnaCommand(msg, lagna);
        } else {
            msg.reply("අවශ්‍ය ලග්නයක් ඇතුලත් කරන්න. උදා: .lagna libra");
        }
    }

    // "startinformation" විධානයෙන් auto-send සක්‍රීය කිරීම
    if (msg.body.toLowerCase() === 'startinformation' && msg.from.includes('@g.us')) {
        // group chat එකකින්ම startinformation command එක ලැබුණු විට
        startAutoSend();
    }
});

// auto-send ක්‍රියාවලිය
cron.schedule('0 6 * * *', async () => {
    if (autoSendEnabled) {
        for (let groupId of groupChatIds) {
            for (let lagna of lagnaList) {
                await sendHoroscope(lagna, groupId);
            }
        }
    }
});

// Bot එක ආරම්භ කිරීම
client.initialize();
