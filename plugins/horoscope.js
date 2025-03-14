const axios = require('axios');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const { cmd } = require('../command'); // WhatsApp bot command handler

// Function to fetch horoscope from Hiru FM
const fetchHoroscope = async () => {
  try {
    const { data } = await axios.get('https://astro.hirufm.lk/');
    const $ = cheerio.load(data);
    const horoscopes = [];

    $('.daily-horoscope').each((i, elem) => {
      const sign = $(elem).find('h3').text().trim();
      const prediction = $(elem).find('p').text().trim();
      horoscopes.push({ sign, prediction });
    });

    return horoscopes;
  } catch (error) {
    console.error('දත්ත සොස් කිරීමේ දෝෂයකි:', error);
    return [];
  }
};

// Function to send horoscope messages to WhatsApp group
const sendHoroscopes = async (conn, groupId) => {
  const horoscopes = await fetchHoroscope();
  horoscopes.forEach(async ({ sign, prediction }) => {
    const message = `🌞 ඔබට සුබ උදැසනක්... \n\n*${sign}*\n${prediction}\n\nඔබට ජයග්‍රාහී සුබ දවසක්...`;
    await conn.sendMessage(groupId, { text: message });
  });
};

// Auto-send the horoscope every day between 6:00 AM - 7:00 AM
schedule.scheduleJob('0 6 * * *', async () => {
  const groups = await conn.getChats(); // Get all group chats
  groups.forEach(async (group) => {
    if (group.isGroup) {
      await sendHoroscopes(conn, group.id);
    }
  });
});

// Command to activate horoscope updates in the group
cmd({
  pattern: "startinformation",
  desc: "Enable daily horoscope updates in this group",
  isGroup: true,
  react: "🌟",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
  try {
    if (isGroup) {
      const isAdmin = participants.some(p => p.id === mek.sender && p.admin);
      const isBotOwner = mek.sender === conn.user.jid;

      if (isAdmin || isBotOwner) {
        await conn.sendMessage(from, { text: "🇱🇰 *Horoscope Service Activated*.\n\n> QUEEN-SADU-MD & D-XTRO-MD" });
      } else {
        await conn.sendMessage(from, { text: "🚫 This command can only be used by group admins or the bot owner." });
      }
    } else {
      await conn.sendMessage(from, { text: "This command can only be used in groups." });
    }
  } catch (e) {
    console.error(`Error in startinformation command: ${e.message}`);
    await conn.sendMessage(from, { text: "Failed to activate horoscope service." });
  }
});

// Command to stop horoscope updates in the group
cmd({
  pattern: "stopinformation",
  desc: "Disable daily horoscope updates in this group",
  isGroup: true,
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
  try {
    if (isGroup) {
      const isAdmin = participants.some(p => p.id === mek.sender && p.admin);
      const isBotOwner = mek.sender === conn.user.jid;

      if (isAdmin || isBotOwner) {
        await conn.sendMessage(from, { text: "❌ *Horoscope Service Deactivated.*" });

        // Stop the scheduled job
        schedule.cancelJob('0 6 * * *');
      } else {
        await conn.sendMessage(from, { text: "🚫 This command can only be used by group admins or the bot owner." });
      }
    } else {
      await conn.sendMessage(from, { text: "This command can only be used in groups." });
    }
  } catch (e) {
    console.error(`Error in stopinformation command: ${e.message}`);
    await conn.sendMessage(from, { text: "Failed to deactivate horoscope service." });
  }
});
