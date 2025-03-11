const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check bot status with buttons and voice",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Alive message content
        const status = `╭━━〔 *D-XTRO-MD* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *⏳ Uptime*: ${runtime(process.uptime())}
┃◈┃• *📟 Ram Usage*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃◈┃• *👨‍💻 Owner*: ᴍʀ ᴅɪɴᴇꜱʜ
┃◈┃• *🧬 Version*: V2 BETA
┃◈└───────────┈⊷
╰──────────────┈⊷
🚀 I'm Alive & Ready to Assist You!

👉 [Visit Channel](https://whatsapp.com/channel/0029Vb0Anqe9RZAcEYc2fT2c)`;

        // Send Image + Text + Buttons + Voice
        await conn.sendMessage(from, {
            image: { url: 'https://i.postimg.cc/44vBQhjF/IMG-20250206-224743.jpg' }, // Image URL
            caption: status,
            footer: "D-XTRO-MD",
            buttons: [
                { buttonId: 'ping', buttonText: { displayText: '🏓 Ping' }, type: 1 },
                { buttonId: 'menu', buttonText: { displayText: '📜 Menu' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

        // Send Voice Message (PTT)
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/mrdinesh595/Mssadu/raw/refs/heads/main/database/dxtro%20alive.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                externalAdReply: {
                    title: "D-XTRO-MD",
                    body: "Click to View Channel",
                    mediaType: 1,
                    thumbnailUrl: "https://i.postimg.cc/44vBQhjF/IMG-20250206-224743.jpg",
                    mediaUrl: "https://whatsapp.com/channel/0029Vb0Anqe9RZAcEYc2fT2c",
                    sourceUrl: "https://whatsapp.com/channel/0029Vb0Anqe9RZAcEYc2fT2c"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ Error occurred: ${e.message}`);
    }
});
