const axios = require("axios");
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

cmd({
    pattern: "gpt",
    alias: "ai",
    desc: "Interact with ChatGPT using Sinhala voice.",
    category: "ai",
    react: "🤖",
    use: "<your query>",
    filename: __filename,
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("⚠️ කරුණාකර ප්‍රශ්නයක් ලබාදෙන්න.\n\nඋදාහරණය:\n.gpt AI කියන්නේ මොකක්ද?");

        const text = encodeURIComponent(q);
        
        // ChatGPT API Request (Sinhala Response)
        const gptResponse = await axios.get(`https://api.dreaded.site/api/chatgpt?text=${text}&lang=si`);
        
        if (!gptResponse.data || !gptResponse.data.result || !gptResponse.data.result.prompt) {
            return reply("❌ GPT API වෙතින් පිළිතුරක් ලබාගත නොහැක.");
        }

        const message = gptResponse.data.result.prompt;

        // Voice (Sinhala Female Voice) Generation
        const voiceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(message)}&tl=si-LK`;
        const voicePath = path.join(__dirname, "sinhala_female_voice.mp3");

        const voiceResponse = await axios({
            method: 'get',
            url: voiceUrl,
            responseType: 'stream',
        });

        voiceResponse.data.pipe(fs.createWriteStream(voicePath));

        await new Promise((resolve) => voiceResponse.data.on('end', resolve));

        // Image and Message Response
        const AI_IMAGE = 'https://i.postimg.cc/4y4Bxdc8/Picsart-25-02-08-23-56-16-217.jpg';
        const formattedInfo = `🤖 *ChatGPT පිළිතුර:* \n\n${message}`;

        await conn.sendMessage(from, {
            image: { url: AI_IMAGE },
            caption: formattedInfo,
            audio: { url: voicePath },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363357105376275@g.us@newsletter',
                    newsletterName: 'MR DINESH AI',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in GPT command:", error);
        reply("❌ දෝෂයක් සිදුවී ඇත. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
});
