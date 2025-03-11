const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check bot status with voice and buttons",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Alive message content
        const status = `╭━━〔 *D-XTRO-MD* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *⏳ Uptime*:  ${runtime(process.uptime())}
┃◈┃• *📟 Ram Usage*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃◈┃• *👨‍💻 Owner*: ᴍʀ ᴅɪɴᴇꜱʜ
┃◈┃• *🧬 Version*: V2 BETA
┃◈└───────────┈⊷
╰──────────────┈⊷
🚀 I'm Alive & Ready to Assist You!
👉 [Visit Channel](https://whatsapp.com/channel/0029Vb0Anqe9RZAcEYc2fT2c)`;

        // Voice message link
        const voiceUrl = 'https://github.com/mrdinesh595/Mssadu/raw/refs/heads/main/database/dxtro%20alive.mp3';

        // Combined message (Image + Text + Button + Voice)
        await conn.sendMessage(from, {
            image: { url: 'https://i.postimg.cc/44vBQhjF/IMG-20250206-224743.jpg' },
            caption: status,
            buttons: [
                { buttonId: 'ping', buttonText: { displayText: '🏓 Ping' }, type: 1 },
                { buttonId: 'menu', buttonText: { displayText: '📜 Menu' }, type: 1 }
            ],
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: 'D-XTRO-MD',
                    body: 'Click here to visit channel',
                    mediaType: 1, // Fixed mediaType for Image + Button
                    thumbnailUrl: 'https://i.postimg.cc/44vBQhjF/IMG-20250206-224743.jpg',
                    mediaUrl: 'https://whatsapp.com/channel/0029Vb0Anqe9RZAcEYc2fT2c'
                }
            }
        }, { quoted: mek });

        // Voice message (as push-to-talk voice)
        await conn.sendMessage(from, {
            audio: { url: voiceUrl },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
