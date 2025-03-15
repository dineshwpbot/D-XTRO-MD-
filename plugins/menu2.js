const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu",
    react: "👾",
    desc: "get cmd list",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Voice message first
        await conn.sendMessage(from, { 
    audio: { url: 'https://github.com/mrdinesh595/Mssadu/raw/refs/heads/main/database/menu.mp3' }, 
    mimetype: 'audio/mp4', 
    ptt: true,
    contextInfo: { 
        mentionedJid: [m.sender], 
        forwardingScore: 999, 
        isForwarded: true, 
        forwardedNewsletterMessageInfo: { 
            newsletterJid: '120363354023106128@newsletter', 
            newsletterName: 'ᴍʀ ᴅɪɴᴇꜱʜ', 
            serverMessageId: 143 
        } 
    } 
}, { quoted: mek });


        // Command categories
        let menu = { main: '', download: '', group: '', owner: '', convert: '', search: '' };
        commands.forEach(cmd => {
            if (cmd.pattern && !cmd.dontAddCommandList) {
                menu[cmd.category] += `*┋* ${cmd.pattern}\n`;
            }
        });

        let madeMenu = `*👾 ${config.BOT_NAME} COMMAND LIST 👾*
        
🔹 *Hi ${pushname}*, welcome!
🔹 *Created by*: ${config.OWNER_NAME}
🔹 *Version*: 3.0.0 Beta

📥 *Download Commands*
${menu.download}

🔧 *Main Commands*
${menu.main}

👥 *Group Commands*
${menu.group}

👑 *Owner Commands*
${menu.owner}

🎭 *Convert Commands*
${menu.convert}

🔎 *Search Commands*
${menu.search}

*Powered by ${config.BOT_NAME}*`;

        // Send menu with channel view
        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG }, // Bot image
            caption: madeMenu,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106128@newsletter',
                    newsletterName: 'ᴍʀ ᴅɪɴᴇꜱʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
