const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "menu",
    react: "⚡",
    desc: "Show bot menu",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Voice Message Send First
        await conn.sendMessage(from, {
            audio: { url: config.VOICE_MENU:"https://github.com/mrdinesh595/Mssadu/raw/refs/heads/main/database/menu.mp3"}, // <-- මෙතනට ඔයාගේ Voice Link එක දාන්න
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

        // Menu Structure
        let menuText = `
╭──〔 *${config.BOT_NAME} Menu* 〕───
│ 👤 Owner: *${config.OWNER_NAME}*
│ ⚡ Prefix: *${config.PREFIX}*
│ 🚀 Version: *3.0.0 Bᴇᴛᴀ*
╰───────────────────

📌 *Main Commands*
${commands.filter(cmd => cmd.category === "main").map(cmd => `┋ ${cmd.pattern}`).join("\n")}

📥 *Download Commands*
${commands.filter(cmd => cmd.category === "download").map(cmd => `┋ ${cmd.pattern}`).join("\n")}

👥 *Group Commands*
${commands.filter(cmd => cmd.category === "group").map(cmd => `┋ ${cmd.pattern}`).join("\n")}

🔧 *Owner Commands*
${commands.filter(cmd => cmd.category === "owner").map(cmd => `┋ ${cmd.pattern}`).join("\n")}

🛠 *Convert Commands*
${commands.filter(cmd => cmd.category === "convert").map(cmd => `┋ ${cmd.pattern}`).join("\n")}

🔎 *Search Commands*
${commands.filter(cmd => cmd.category === "search").map(cmd => `┋ ${cmd.pattern}`).join("\n")}

⚡ *Powered by QUEEN SADU MD*
`;

        // Send Menu with Channel View
        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG }, // <-- Menu Image
            caption: menuText,
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
