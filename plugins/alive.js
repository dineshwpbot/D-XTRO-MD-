const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // System status message
        const status = `╭━━〔 *D-XTRO-MD* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *⏳Uptime*:  ${runtime(process.uptime())} 
┃◈┃• *📟 Ram usage*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃◈┃• *⚙️ HostName*: ${os.hostname()}
┃◈┃• *👨‍💻 Owner*: ᴍʀ ᴅɪɴᴇꜱʜ
┃◈┃• *🧬 Version*: V2 BETA
┃◈└───────────┈⊷
╰──────────────┈⊷

  𝐪𝐮𝐞𝐞𝐧 𝐬𝐚𝐝𝐮 programing.𝐢𝐦 𝐚𝐥𝐢𝐯𝐞 𝐧𝐨𝐰. 

  https://whatsapp.com/channel/0029Vb0Anqe9RZAcEYc2fT2c

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ`;

        // Voice message URL (PTT voice message)
        const voiceUrl = 'https://github.com/mrdinesh595/Mssadu/raw/refs/heads/main/database/dxtro%20alive.mp3';

        // Send Image + Caption First
        const sentMessage = await conn.sendMessage(from, {
            image: { url: `https://i.postimg.cc/44vBQhjF/IMG-20250206-224743.jpg` }, // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363357105376275@g.us@newsletter',
                    newsletterName: 'ᴍʀ ᴅɪɴᴇꜱʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send PTT Voice linked to the Image + Text
        await conn.sendMessage(from, {
            audio: { url: voiceUrl },
            mimetype: 'audio/mpeg',
            ptt: true // Send as voice message (PTT)
        }, { quoted: sentMessage });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
